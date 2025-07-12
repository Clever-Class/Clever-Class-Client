import { StaticPageLayout } from '~components/Layout';
import styles from './PrivacyPolicy.module.scss';

export const PrivacyPolicy = () => {
  return (
    <StaticPageLayout 
      title="Privacy Policy" 
      className={styles.privacyPolicy}
    >
      <div className={styles.lastUpdated}>
        <p><strong>Effective Date:</strong> July 12, 2025</p>
        <p><strong>Last Updated:</strong> July 12, 2025</p>
      </div>

      <section className={styles.section}>
        <p>
          Welcome to Clever Class, an AI-powered educational platform designed to support students with learning assistance, personalized tutoring, and academic enrichment. This Privacy Policy explains how we collect, use, share, and protect your information when you use our services, including our website, Chrome extension, mobile and web applications, and any other features or services provided by Clever Class (collectively, the "Services").
        </p>
        <p>
          We are committed to protecting your privacy and complying with international privacy laws including the General Data Protection Regulation (GDPR), California Consumer Privacy Act (CCPA), Children's Online Privacy Protection Act (COPPA), and educational standards such as FERPA where applicable.
        </p>
      </section>

      <section className={styles.section}>
        <h2>1. Information We Collect</h2>
        <p>
          We collect information directly from you, automatically when you use our Services, and from third parties as necessary to deliver and improve our offerings.
        </p>
        
        <h3>A. Information You Provide to Us</h3>
        <ul>
          <li><strong>Account Information:</strong> Name, email address, password, subscription status, and preferences.</li>
          <li><strong>Educational Content:</strong> PDFs, documents, lecture notes, and other learning materials you upload.</li>
          <li><strong>Payment Information:</strong> Billing address and payment details (processed securely via third-party providers).</li>
          <li><strong>Voice & Chat Inputs:</strong> Conversations and voice recordings when using AI tutoring or voice features.</li>
          <li><strong>Images:</strong> Uploaded screenshots, handwritten problems, or images for learning assistance.</li>
        </ul>

        <h3>B. Automatically Collected Information</h3>
        <ul>
          <li><strong>Usage Data:</strong> Interactions with our platform, study sessions, quiz completions, and progress.</li>
          <li><strong>Chrome Extension Data:</strong> Content and interactions on supported educational websites (15+ platforms).</li>
          <li><strong>Device & Technical Data:</strong> Browser type, IP address, device identifiers, OS, and diagnostic logs.</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>2. How We Use Your Information</h2>
        <p>
          We use your data to provide, personalize, maintain, and improve the Services, including to:
        </p>
        <ul>
          <li>Generate quizzes from uploaded materials.</li>
          <li>Summarize YouTube videos and podcasts.</li>
          <li>Provide AI-powered tutoring and homework help.</li>
          <li>Track academic progress and recommend study actions.</li>
          <li>Improve learning outcomes through analytics and insights.</li>
          <li>Administer accounts, billing, and subscriptions.</li>
          <li>Ensure security, prevent fraud, and comply with legal obligations.</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>3. Data Sharing and Disclosure</h2>
        <p>
          We do not sell your personal data. We may share information only under the following circumstances:
        </p>
        <ul>
          <li><strong>With Service Providers:</strong> Such as payment processors, analytics tools, or cloud storage providers under strict data processing agreements.</li>
          <li><strong>With Educational Institutions (if applicable):</strong> When accounts are connected with schools or educators, consistent with FERPA compliance.</li>
          <li><strong>Legal Obligations:</strong> In response to lawful requests by public authorities, including to meet national security or law enforcement requirements.</li>
          <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, with appropriate safeguards.</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>4. Data Security and Storage</h2>
        <p>
          We implement industry-standard administrative, technical, and physical safeguards to protect your data:
        </p>
        <ul>
          <li>End-to-end encryption for voice, image, and chat data.</li>
          <li>Cloud-based storage with access controls and encryption at rest.</li>
          <li>Routine security audits and vulnerability assessments.</li>
          <li>Role-based access controls for employee data access.</li>
        </ul>
        <p>
          We retain your data only as long as necessary for educational, legal, or operational purposes, and securely delete or anonymize it thereafter.
        </p>
      </section>

      <section className={styles.section}>
        <h2>5. Your Privacy Rights</h2>
        <p>
          Depending on your location, you may have the following rights:
        </p>
        
        <h3>Under GDPR (EU Users)</h3>
        <ul>
          <li>Right to access, correct, or delete your data</li>
          <li>Right to data portability</li>
          <li>Right to restrict or object to processing</li>
          <li>Right to withdraw consent at any time</li>
        </ul>

        <h3>Under CCPA (California Users)</h3>
        <ul>
          <li>Right to know what personal data we collect and how we use it</li>
          <li>Right to request deletion of personal data</li>
          <li>Right to opt-out of data selling (Note: We do not sell your data)</li>
          <li>Right to non-discrimination when exercising privacy rights</li>
        </ul>

        <p>
          You may exercise these rights at any time by emailing us at support@cleverclass.io.
        </p>
      </section>

      <section className={styles.section}>
        <h2>6. Educational Privacy Protections</h2>
        <p>
          We take additional steps to safeguard data for students and minors, especially where educational or parental consent is required:
        </p>
        <ul>
          <li><strong>FERPA:</strong> We align with FERPA principles when working with educational institutions to protect student education records.</li>
          <li><strong>COPPA:</strong> For children under 13, we require verifiable parental consent before collecting personal data. If we learn that we have collected personal data from a child under 13 without parental consent, we will promptly delete it.</li>
        </ul>
        <p>
          Parents and guardians may review and manage their child's information by contacting us directly.
        </p>
      </section>

      <section className={styles.section}>
        <h2>7. International Data Transfers</h2>
        <p>
          We may transfer and store your information outside your country, including in the United States, where our servers and third-party service providers are located. We use appropriate legal mechanisms such as Standard Contractual Clauses to safeguard international data transfers under GDPR.
        </p>
      </section>

      <section className={styles.section}>
        <h2>8. Cookie and Tracking Technologies</h2>
        <p>
          We use cookies and similar technologies to:
        </p>
        <ul>
          <li>Authenticate users and maintain sessions</li>
          <li>Analyze platform usage and improve features</li>
          <li>Customize content and provide personalized recommendations</li>
        </ul>
        <p>
          You can manage cookie settings through your browser or device preferences. For EU users, we provide cookie consent banners as required by GDPR.
        </p>
      </section>

      <section className={styles.section}>
        <h2>9. Third-Party Services</h2>
        <p>
          Our Services may integrate with or link to third-party tools such as:
        </p>
        <ul>
          <li>Payment providers (e.g., Stripe)</li>
          <li>Analytics platforms (e.g., Google Analytics)</li>
          <li>Content summarization APIs</li>
          <li>Educational platform APIs</li>
        </ul>
        <p>
          These providers operate under their own privacy policies. We encourage you to review their practices before using integrated features.
        </p>
      </section>

      <section className={styles.section}>
        <h2>10. Updates to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy periodically to reflect changes in our practices or legal obligations. When we do, we will revise the "Last Updated" date and notify users via email or platform notices if material changes occur.
        </p>
      </section>

      <section className={styles.section}>
        <h2>11. Contact Information</h2>
        <p>
          If you have questions, concerns, or wish to exercise your privacy rights, please contact us:
        </p>
        <p>
          <strong>Clever Class Privacy Team</strong><br />
          📧 Email: support@cleverclass.io<br />
          🌐 Website: https://www.cleverclass.io
        </p>
      </section>
    </StaticPageLayout>
  );
}; 