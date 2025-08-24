<customer_vat_id type="string">%clientCif%</customer_vat_id>


- "conditionPay": Condición de pago.
- "companyPhoneNumber": Número de telefono de la empresa.
      - "companyEmail": Correo electrónico de la empresa.
      - "companyName": Nombre de la empresa.
      - "companyAddress": Dirección completa de la empresa.
      - "companyCity": Ciudad de la empresa.
      - "companyProvince": Provincia de la empresa.
      - "companyZip": Código postal de la empresa.
      - "clientPhoneNumber": Número de telefono del cliente.
      - "clientEmail": Correo electrónico del cliente.
      - "clientName": Nombre del cliente.
      - "clientAddress": Dirección completa del cliente.
      - "clientAddressNumber": Número de la dirección del cliente.
      - "clientAddressStreet": Calle de la dirección del cliente.
      - "clientAddressFloor": Piso de la dirección del cliente.
      - "clientCity": Ciudad del cliente.
      - "clientProvince": Provincia del cliente.
      - "clientZip": Código postal del cliente.


----------

<?xml version="1.0" encoding="ISO-8859-1"?>
<delivery>
  <vendor_id type="number">%supplierId%</vendor_id>
  <vendor_delivery_note_id type="string">%numberDocument%</vendor_delivery_note_id>
  <reference>parking</reference>
  <lines for-data="productList">
        <quantity type="number">%productQuantity%</quantity>
        <received_quantity type="number">%productQuantity%</received_quantity>
        <product_id>%productId%</product_id>
        <description>%productDescription%</description>
        <barcode>%productRef%</barcode>
        <purchasing_group_id></purchasing_group_id>
        <packing_unit_id></packing_unit_id>
        <sale_order_id>%productRef%</sale_order_id>
        <packing_unit_quantity type="number">0</packing_unit_quantity>
        <discount_1 type="number">%productDiscountRate%</discount_1>
        <purchase_order_unique_id>%productRef%</purchase_order_unique_id>
        <line_number type="number">%n%</line_number>
        <purchase_order_line_number type="number"></purchase_order_line_number>
        <sale_order_line_number></sale_order_line_number>
        <purchase_order_id>%productRef%</purchase_order_id>
        <price type="float">%productImport%</price>
        <product_reference>%productRef%</product_reference>
        <line_type type="string">%n%</line_type>
        <pending_data>%pending_data%</pending_data>
        <packing_unit_quantity type="decimal">1.00</packing_unit_quantity>
  </lines>
</delivery>


-----------------------

    <taxes for-data="productList">
            <tax_base type="float">%productDiscountAmount%</tax_base>
            <tax_id type="float">1</tax_id>
            <tax_type type="float">1</tax_type>
            <tax_amount type="float"></tax_amount>
            <description_type_tax type="string">IVA</description_type_tax>
            <type_tax type="string">IVA</type_tax>
    </taxes>

    ---
     <tax_id type="float">1</tax_id>
            <tax_type type="float">1</tax_type>
            <tax_base type="float">%productDiscountAmount%</tax_base>
            <tax_amount type="float">19.00</tax_amount>
            <invoice_tax_amount type="float">19.00</invoice_tax_amount>
            <tax_rate>19.00</tax_rate>
            <description_type_tax type="string">IVA</description_type_tax>
            <type_tax type="string">IVA</type_tax>




- "productAlbaranDate": Fecha del albarán (si existe alguna referencia previa a un albarán con fecha arriba de los productos, extraer esa fecha; si no se encuentra, dejar "").


- "productUnit": Unidad de medida (si aplica, si no se encuentra dejar "UN").


---
taxes => "borrar" y mejorar ocr
cif mejorar ocr
unitario / descuento
algunas lineas de 
objFlatten.invoice.gross_amount = `${processedData.partialAmount}`
        objFlatten.invoice.amount = `${processedData.totalAmount}` 

        tienen que ir en el xml

porductimportunit y comprobar fira

referencia albaranes refDocument