import { StaticPageLayout } from '~components/Layout';
import styles from './RefundPolicy.module.scss';

export const RefundPolicy = () => {
  return (
    <StaticPageLayout 
      title="Refund Policy" 
      className={styles.refundPolicy}
    >
      <div className={styles.lastUpdated}>
        <p><strong>Effective Date:</strong> July 12, 2025</p>
        <p><strong>Last Updated:</strong> July 12, 2025</p>
      </div>

      <section className={styles.section}>
        <p>
          Thank you for choosing Clever Class, your AI-powered educational learning assistant. Please read this Refund Policy carefully before subscribing or making a payment.
        </p>
      </section>

      <section className={styles.section}>
        <h2>1. No Refund Policy</h2>
        <p>
          All purchases, including subscriptions, upgrades, and renewals, made through Clever Class are non-refundable.
        </p>
        <p>
          Due to the digital nature of our Services and the immediate access granted to AI-powered tools, personalized learning content, and proprietary features, we do not offer refunds or credits for:
        </p>
        <ul>
          <li>Partial subscription periods (monthly or annual)</li>
          <li>Unused features or Services</li>
          <li>Account inactivity or non-usage</li>
          <li>Subscription cancellations made after the billing date</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>2. Free Trials and Plan Previews</h2>
        <p>
          To help you evaluate whether Clever Class is the right fit for your learning needs, we may occasionally offer free trials or demo access. You are encouraged to take advantage of these trial periods before subscribing to a paid plan.
        </p>
      </section>

      <section className={styles.section}>
        <h2>3. Subscription Cancellation</h2>
        <p>
          You may cancel your subscription at any time to avoid future billing. Upon cancellation:
        </p>
        <ul>
          <li>Your account will remain active for the remainder of the billing cycle.</li>
          <li>No further charges will be made.</li>
          <li>No prorated refunds will be issued.</li>
        </ul>
        <p>
          To cancel, log into your account and manage your subscription in the Billing section or contact us at support@cleverclass.io.
        </p>
      </section>

      <section className={styles.section}>
        <h2>4. Exceptions (at Our Sole Discretion)</h2>
        <p>
          While our general policy is not to issue refunds, we may review exceptions on a case-by-case basis in the event of:
        </p>
        <ul>
          <li>Technical issues that prevent access to core features and cannot be resolved</li>
          <li>Duplicate billing errors</li>
          <li>Fraudulent transactions</li>
        </ul>
        <p>
          Any exception will be made at the sole discretion of Clever Class, and our decision will be final.
        </p>
      </section>

      <section className={styles.section}>
        <h2>5. Contact Us</h2>
        <p>
          If you have questions about your billing, subscription, or this Refund Policy, please contact our support team:
        </p>
        <p>
          <strong>Clever Class Billing Support</strong><br />
          📧 Email: support@cleverclass.io
        </p>
        <p>
          By subscribing to or purchasing any services from Clever Class, you acknowledge and agree to this Refund Policy.
        </p>
      </section>
    </StaticPageLayout>
  );
}; 