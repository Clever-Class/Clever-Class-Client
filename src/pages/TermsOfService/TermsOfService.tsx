import { StaticPageLayout } from '~components/Layout';
import styles from './TermsOfService.module.scss';

export const TermsOfService = () => {
  return (
    <StaticPageLayout 
      title="Terms of Service" 
      className={styles.termsOfService}
    >
      <div className={styles.lastUpdated}>
        <p><strong>Effective Date:</strong> July 12, 2025</p>
        <p><strong>Last Updated:</strong> July 12, 2025</p>
      </div>

      <section className={styles.section}>
        <p>
          Welcome to Clever Class — your AI-powered learning assistant. These Terms of Service ("Terms") govern your access to and use of the Clever Class platform, including our website, applications, Chrome extension, and all services offered (collectively, the "Service" or "Services").
        </p>
        <p>
          By using Clever Class, you agree to be bound by these Terms and our Privacy Policy. If you do not agree, you may not access or use our Services.
        </p>
      </section>

      <section className={styles.section}>
        <h2>1. Who We Are</h2>
        <p>
          Clever Class is an educational technology platform offering AI tools such as quiz generation, lecture summarization, AI tutoring (chat, voice, image), and personalized study recommendations.
        </p>
      </section>

      <section className={styles.section}>
        <h2>2. Eligibility</h2>
        <p>
          You must be:
        </p>
        <ul>
          <li>At least 13 years old to use Clever Class (with parental consent if under 18)</li>
          <li>Able to form a binding contract under applicable laws</li>
          <li>Using the Services for lawful educational purposes only</li>
        </ul>
        <p>
          If you are under 13, you may only use Clever Class with verifiable parental or school authorization in compliance with COPPA.
        </p>
      </section>

      <section className={styles.section}>
        <h2>3. Your Account</h2>
        <p>
          You must create an account to access many of our Services. You agree to:
        </p>
        <ul>
          <li>Provide accurate, up-to-date information</li>
          <li>Keep your login credentials secure</li>
          <li>Not share your account with others</li>
          <li>Be responsible for all activity under your account</li>
        </ul>
        <p>
          We reserve the right to suspend or terminate accounts for any activity that violates these Terms.
        </p>
      </section>

      <section className={styles.section}>
        <h2>4. Subscriptions and Billing</h2>
        <p>
          Clever Class offers free and paid subscription plans. By subscribing to a paid plan, you agree to:
        </p>
        <ul>
          <li>Pay all applicable fees as described at checkout</li>
          <li>Allow automatic billing on a recurring basis (monthly or annually)</li>
          <li>Cancel prior to your next billing date to avoid renewal charges</li>
        </ul>
        <p>
          All payments are non-refundable, as described in our Refund Policy.
        </p>
      </section>

      <section className={styles.section}>
        <h2>5. Acceptable Use</h2>
        <p>
          By using Clever Class, you agree not to:
        </p>
        <ul>
          <li>Use the Services for cheating, academic dishonesty, or violating school policies</li>
          <li>Upload unlawful, infringing, or harmful content</li>
          <li>Interfere with or disrupt the Services or our servers</li>
          <li>Reverse engineer or misuse the platform's AI functionality</li>
        </ul>
        <p>
          We reserve the right to monitor usage and take action, including content removal, account suspension, or legal enforcement where necessary.
        </p>
      </section>

      <section className={styles.section}>
        <h2>6. Intellectual Property</h2>
        <p>
          All intellectual property, including software, algorithms, branding, content, and platform features, is owned or licensed by Clever Class. You may not:
        </p>
        <ul>
          <li>Copy, distribute, or create derivative works from our Services</li>
          <li>Use our trademarks or branding without written permission</li>
        </ul>
        <p>
          You retain ownership of the content you upload (e.g., notes, documents, images), but you grant Clever Class a license to use that content to provide the Services.
        </p>
      </section>

      <section className={styles.section}>
        <h2>7. Educational and Parental Rights</h2>
        <p>
          We take education data seriously:
        </p>
        <ul>
          <li>If you're an educational institution, our handling of student data aligns with FERPA.</li>
          <li>If you're a parent of a child under 13, you may review, manage, or delete your child's data by contacting us.</li>
          <li>All users may exercise rights under applicable privacy laws, including GDPR and CCPA.</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>8. AI Limitations and Disclaimer</h2>
        <p>
          Clever Class uses AI to assist learning, but:
        </p>
        <ul>
          <li>It does not replace teachers, textbooks, or human experts</li>
          <li>Outputs may sometimes be incorrect or incomplete</li>
          <li>Users should verify AI-generated content before using it in academic settings</li>
        </ul>
        <p>
          The Service is provided "as is" without warranties of any kind. We disclaim liability for losses arising from reliance on AI-generated responses.
        </p>
      </section>

      <section className={styles.section}>
        <h2>9. Termination</h2>
        <p>
          We reserve the right to suspend or terminate your access to Clever Class at any time, with or without cause, including if:
        </p>
        <ul>
          <li>You breach these Terms</li>
          <li>We are required by law to do so</li>
          <li>You misuse the Services</li>
        </ul>
        <p>
          Upon termination, you lose access to your account and data associated with the Service.
        </p>
      </section>

      <section className={styles.section}>
        <h2>10. Modifications to the Service</h2>
        <p>
          We may update, modify, or discontinue parts of the Service at any time. We'll provide notice for material changes via email or on-platform announcements.
        </p>
      </section>

      <section className={styles.section}>
        <h2>11. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, Clever Class and its affiliates are not liable for:
        </p>
        <ul>
          <li>Indirect, incidental, special, or consequential damages</li>
          <li>Loss of data, revenue, or academic results</li>
          <li>Issues caused by third-party services or integrations</li>
        </ul>
        <p>
          Our total liability under these Terms is limited to the amount you paid us in the last 12 months.
        </p>
      </section>

      <section className={styles.section}>
        <h2>12. Governing Law</h2>
        <p>
          These Terms are governed by the laws of the jurisdiction in which Clever Class is incorporated (to be added by the company). Any disputes shall be resolved in local courts of that jurisdiction.
        </p>
      </section>

      <section className={styles.section}>
        <h2>13. Third-Party Services</h2>
        <p>
          Clever Class may link to or integrate with services such as:
        </p>
        <ul>
          <li>Payment processors (e.g., Stripe)</li>
          <li>Analytics platforms</li>
          <li>Educational websites</li>
        </ul>
        <p>
          These services are subject to their own terms and privacy policies. We are not responsible for their practices.
        </p>
      </section>

      <section className={styles.section}>
        <h2>14. Updates to Terms</h2>
        <p>
          We may revise these Terms from time to time. When we do:
        </p>
        <ul>
          <li>We'll update the "Last Updated" date above</li>
          <li>We may notify you via email or platform alerts</li>
          <li>Continued use of the Services means you accept the updated Terms</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>15. Contact Us</h2>
        <p>
          Have questions about these Terms? Get in touch:
        </p>
        <p>
          <strong>Clever Class Legal Team</strong><br />
          📧 Email: support@cleverclass.io<br />
          🌐 Website: www.cleverclass.io
        </p>
      </section>
    </StaticPageLayout>
  );
}; 