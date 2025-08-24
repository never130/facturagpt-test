
const { connectDB } = require("./utils");
const { catchedAsync } = require("../utils/err");
const { sendInvoiceEmail, sendBillEmail } = require("../services/email");
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const stripe = require("stripe")("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");


const createSetupIntentController = async (req, res) => {
  try {


    const dbAccounts = await connectDB('db_accounts')
    let allAccounts = [];
    let skip = 0;
    const batchSize = 100;
    let hasMore = true;

    while (hasMore) {
      const batch = await dbAccounts.find({
        selector: {
          email: {
            $exists: true,
            $ne: null,
            $ne: ""
          }
        },
        limit: batchSize,
        skip: skip
      });

      if (batch.docs.length === 0) {
        hasMore = false;
      } else {
        allAccounts = [...allAccounts, ...batch.docs];
        skip += batchSize;
      }
    }

    const accounts = allAccounts;
    const totalAccounts = accounts.length;
    let processedCount = 0;
    let successfulPayments = 0;
    let totalAmount = 0;

    for (let account of accounts) {
      if (!account.tokenMonth) continue

      try {

        processedCount++;
        const progress = Math.round((processedCount / totalAccounts) * 100);
        const barLength = 30;
        const filledLength = Math.round((progress / 100) * barLength);
        const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);


        let customer;
        try {
          customer = await stripe.customers.search({
            query: `email:'${account.email}'`,
          });

          if (customer.data.length === 0) {
            const id = account._id.split('_').pop()
            customer = await stripe.customers.create({
              email: account.email,
              metadata: { accountId: id }
            });

          } else {
            customer = customer.data[0];

            try {
              const customerDetails = await stripe.customers.retrieve(customer.id);

              const lastPaymentDate = customerDetails.metadata?.lastPaymentDate;
              if (lastPaymentDate) {
                const [lastYear, lastMonth] = lastPaymentDate.split('-');
                const currentDate = new Date();
                const currentYear = currentDate.getFullYear();
                const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');

                if (lastYear === currentYear.toString() && lastMonth === currentMonth) {
                  continue;
                }
              }
            } catch (retrieveError) {
              if (retrieveError.code === 'resource_missing') {
                const id = account._id.split('_').pop()
                customer = await stripe.customers.create({
                  email: account.email,
                  metadata: { accountId: id }
                });
              } else {
                throw retrieveError;
              }
            }
          }
        } catch (err) {
          console.error(`\x1b[31mError with customer: ${err.message}\x1b[0m`);
          continue;
        }

        const paymentMethods = await stripe.paymentMethods.list({
          customer: customer.id,
          type: 'card'
        });

        let defaultPaymentMethodId;

        if (paymentMethods.data.length > 0) {

          defaultPaymentMethodId = paymentMethods.data[0].id;

          const customerDetails = await stripe.customers.retrieve(customer.id);
          if (customerDetails.invoice_settings?.default_payment_method !== defaultPaymentMethodId) {
            await stripe.customers.update(customer.id, {
              invoice_settings: {
                default_payment_method: defaultPaymentMethodId
              }
            });
          }
        } else {
        }
        if (!defaultPaymentMethodId) {
          await createInvoice(account, "failed", null);

          account.statusLastInvoice = 'failed'; 
          await dbAccounts.insert(account);

          continue; 
        }
        try {
          const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(account.tokenMonth * 100),
            currency: 'eur',
            customer: customer.id,
            payment_method: defaultPaymentMethodId,
            off_session: true,
            confirm: true
          });

          const paymentMethod = paymentMethods.data[0]; 

          const invoiceResult = await createInvoice(account, paymentIntent.status, paymentMethod);


          const today = new Date().toISOString().split('T')[0];
          const amount = account.tokenMonth.toFixed(2).replace('.', ',');
          const formattedAmount = amount.padStart(6, '0');

          await stripe.customers.update(customer.id, {
            metadata: {
              ...customer.metadata,
              lastPaymentDate: today,
              totalCharged: `${formattedAmount}€`
            }
          });


          account.lastPayment = new Date().toISOString();
          account.typePlan = "plus";
          account.tokenMonth = 0;         

          if (paymentMethod) {
            account.statusLastInvoice = paymentIntent.status;
          }
          await dbAccounts.insert(account);


          successfulPayments++;
          totalAmount += account.tokenMonth;

        } catch (err) {
          console.error(`\n\x1b[31mPayment failed for ${account.email}: ${err.message}\x1b[0m`);
          return res.status(500).json({ error: 'Error interno del servidor', details: err.message });
        }

      } catch (err) {
        console.error(`\n\x1b[31mError processing account ${account.email}: ${err.message}\x1b[0m`);
        return res.status(500).json({ error: 'Error interno del servidor', details: err.message });
      }
    }
    return res.status(200).json({
      message: 'Proceso completado correctamente',
      totalAccounts,
      processedCount,
      successfulPayments,
      totalAmount: Number(totalAmount.toFixed(2))
    });

  } catch (err) {
    console.error(`\x1b[31mError in createSetupIntentController: ${err.message}\x1b[0m`);
    return res.status(500).json({ error: 'Error interno del servidor', details: err.message });

  }
};


const createInvoice = async (account, status, paymentMethod) => {
  try {
    if (!paymentMethod || !paymentMethod.card) {
      status = "failed";
      sendInvoiceEmail(account.nombre, account.email, account.language)
    } else {
      sendBillEmail(account.nombre, account.email, account.language)
    }
    const id = account._id.split('_').pop();
    const invoicesDB = await connectDB(`db_${id}_invoice`);


    const tokenMonth = Number(account.tokenMonth);
    const discountPercent = Number(account.discount) || 0;
    const discountAmount = tokenMonth * discountPercent / 100;

    const subtotal = tokenMonth - discountAmount;

    const vat = subtotal * 0.21;

    const total = subtotal + vat;

    const newInvoice = {
      contactId: account._id,
      date: new Date().toISOString(),
      tokenMonth: tokenMonth,
      discount: discountPercent,          
      discountAmount: parseFloat(discountAmount.toFixed(2)),
      subtotal: parseFloat(subtotal.toFixed(2)),
      vat: parseFloat(vat.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      status,
      paymentMethod: {
        id: paymentMethod?.id,
        brand: paymentMethod?.card.brand,
        last4: paymentMethod?.card.last4,
        exp_month: paymentMethod?.card.exp_month,
        exp_year: paymentMethod?.card.exp_year
      }
    };
    const pdfBuffer = await generateInvoicePDF(newInvoice, account);
    const insertResult = await invoicesDB.insert(newInvoice);

    await invoicesDB.attachment.insert(
      insertResult.id,
      'invoice.pdf',
      pdfBuffer,
      'application/pdf',
      { rev: insertResult.rev }
    );



    return {
      success: true,
      message: 'Invoice creado correctamente',
      invoice: newInvoice
    };

  } catch (error) {
    console.error('Error al crear invoice:', error);
    return {
      success: false,
      message: 'Error al crear invoice',
      error: error.message || error
    };
  }
};


const generateInvoicePDF = async (invoice, account) => {
  const path = require('path');

  const templatePath = path.join(
    __dirname,
    '..', '..',                      
    'src', 'views', 'Dashboard', 'components', 'FacturaTemplate',
    'FacturaTemplate.html'
  );

  let html = fs.readFileSync(templatePath, 'utf8');

  html = html
    .replace(/{{nombre}}/g, account.nombre)
    .replace(/{{email}}/g, account.email)
    .replace(/{{fecha}}/g, new Date(invoice.date).toLocaleDateString())
    .replace(/{{subtotal}}/g, invoice.subtotal.toFixed(2))
    .replace(/{{descuento}}/g, invoice.discount.toFixed(2))
    .replace(/{{descuentoMonto}}/g, invoice.discountAmount.toFixed(2))
    .replace(/{{vat}}/g, invoice.vat.toFixed(2))
    .replace(/{{total}}/g, invoice.total.toFixed(2))
    .replace(/{{estado}}/g, invoice.status);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true 
  });
  await browser.close();

  return pdfBuffer;
};


const attachCustomPaymentMethodController = async (req, res) => {
  try {


    const { payMethod } = req.body

    const user = req.user
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    const dbAccounts = await connectDB("db_accounts");
    let account = await dbAccounts.get(user._id);

    if (!account) {
      return res
        .status(404)
        .send({ success: false, message: "User not found." });
    }

    await dbAccounts.insert({
      ...account,
      payMethod: [
        ...(account.payMethod || []),
        payMethod
      ],
    })

    let stripeCustomerId = account.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: account.email,
        metadata: { userId: selectedWorkspace },
        description: `Customer for ${account.email}`,
      });

      stripeCustomerId = customer.id;

      account.stripeCustomerId = stripeCustomerId;

      let updateSuccessful = false;
      while (!updateSuccessful) {
        try {
          const response = await dbAccounts.insert({ ...account, _rev: account._rev });

          updateSuccessful = true;
        } catch (conflictError) {
          if (conflictError.statusCode === 409) {
            account = await dbAccounts.get(user._id);
          } else {
            throw conflictError;
          }
        }
      }
    }


    const attachmentResponse = await stripe.paymentMethods.attach(
      payMethod.id,
      {
        customer: stripeCustomerId,
      }
    );


    const updatedCustomer = await stripe.customers.update(stripeCustomerId, {
      invoice_settings: {
        default_payment_method: payMethod.id,
      },
    });


    return res.status(200).send({
      success: true,
      message: "Payment method attached successfully.",
    });
  } catch (err) {
    console.error("Error in attachCustomPaymentMethodController:", err);
    return res
      .status(500)
      .send({ success: false, message: "Internal server error." });
  }
};

const createCustomPaymentIntentController = async (req, res) => {
  try {
    const { amount, currency = "eur" } = req.body;

    const user = req.user
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    if (!user._id || !amount) {
      return res
        .status(400)
        .send({ success: false, message: "Missing userId or amount." });
    }

    const db = await connectDB("db_accounts");
    const dbUser = await db.get(user._id);

    if (!dbUser || !dbUser.stripeCustomerId || !dbUser.paymentMethodId) {
      return res.status(404).send({
        success: false,
        message: "User or payment details not found in the database.",
      });
    }


    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      customer: dbUser.stripeCustomerId,
      payment_method: dbUser.paymentMethodId,
      confirm: true,
      description: `Payment for client: ${dbUser.email}`,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });

    if (paymentIntent.status !== "succeeded") {
      throw new Error(
        `Payment confirmation failed with status: ${paymentIntent.status}`
      );
    }

    return res.status(200).send({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error("Error in createPaymentIntentController:", err.message);
    return res.status(500).send({
      success: false,
      message: "Error creating payment intent.",
    });
  }
};

const deletePaymentMethod = async (req, res) => {
  const { paymentMethodId } = req.body;
  const user = req.user;



  try {

    const detached = await stripe.paymentMethods.detach(paymentMethodId);

    res.status(200).json({ success: true, detached, });
  } catch (error) {
    console.error('Error al eliminar el método de pago:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
const setDefaultPaymentMethod = async (req, res) => {
  const { paymentMethodId } = req.body;
  const user = req.user;

  try {
    const db = await connectDB("db_accounts");

    const dbUser = await db.get(user._id);



    const updatedCustomer = await stripe.customers.update(dbUser.stripeCustomerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });
    res.status(200).json({
      success: true,
      message: "Método de pago establecido como predeterminado.",
    });
  } catch (error) {
    console.error("Error al establecer método de pago por defecto:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};



module.exports = {

  createSetupIntentController: catchedAsync(createSetupIntentController),
  attachCustomPaymentMethodController: catchedAsync(attachCustomPaymentMethodController),
  createCustomPaymentIntentController: catchedAsync(createCustomPaymentIntentController),
  deletePaymentMethod: catchedAsync(deletePaymentMethod),
  setDefaultPaymentMethod: catchedAsync(setDefaultPaymentMethod),
};
