import styles from './ModalContent.module.css';

function ArrowIcon() {
  return <div className={styles.arrowSquare} />;
}

function DetailRow({ label, amount }) {
  return (
    <div className={styles.detailRow}>
      <div className={styles.detailLabel}>
        <p className={styles.detailLabelText}>{label}</p>
      </div>
      <div className={styles.detailValue}>
        <p className={styles.detailValueText}>{amount}</p>
      </div>
    </div>
  );
}

function TotalRow({ label, amount }) {
  return (
    <div className={styles.detailRowTotal}>
      <div className={styles.detailLabel}>
        <p className={styles.detailLabelText}>{label}</p>
      </div>
      <div className={styles.detailValue}>
        <p className={styles.detailValueText}>{amount}</p>
      </div>
    </div>
  );
}

function DetailsSection() {
  return (
    <div className={styles.detailsContainer}>
      <div className={styles.detailsInner}>
        <div className={styles.detailsList}>
          <DetailRow label="Taxable base 21%" amount="0.00 €" />
          <DetailRow label="VAT 21%" amount="0.00 €" />
          <DetailRow label="Withholding (0%)" amount="-0.00 €" />
          <DetailRow label="Advance expenses" amount="0.00 €" />
          <TotalRow label="Total" amount="0.00 €" />
        </div>
      </div>
    </div>
  );
}

function TotalPaymentAmount() {
  return (
    <div className={styles.totalPaymentAmount}>
      <div className={styles.totalPaymentAmountNumber}>
        <p className={styles.totalPaymentAmountText}>0</p>
      </div>
      <div className={styles.totalPaymentAmountCurrency}>
        <p className={styles.totalPaymentAmountText}> €</p>
      </div>
    </div>
  );
}

function TotalPaymentSection() {
  return (
    <div className={styles.totalPaymentContainer}>
      <div className={styles.totalPaymentInner}>
        <div className={styles.totalPaymentContent}>
          <div className={styles.totalPaymentLabel}>
            <p className={styles.totalPaymentLabelText}>Total to pay</p>
          </div>
          <TotalPaymentAmount />
        </div>
      </div>
    </div>
  );
}

function MainContent() {
  return (
    <div className={styles.mainContentContainer}>
      <DetailsSection />
      <TotalPaymentSection />
    </div>
  );
}

function PopupContainer() {
  return (
    <div className={styles.popupContainer}>
      <MainContent />
    </div>
  );
}

export default function BalanceTotal() {
  return (
    <div className={styles.balanceTotal}>
      <div className={styles.arrowContainer}>
        <div className={styles.arrowIcon}>
          <ArrowIcon />
        </div>
      </div>
      <PopupContainer />
    </div>
  );
}