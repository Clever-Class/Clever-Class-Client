import { StaticPageLayout } from '~components/Layout';
import styles from './AboutUs.module.scss';

export const AboutUs = () => {
  return (
    <StaticPageLayout 
      title="About Us" 
      className={styles.aboutUs}
    >
      <div className={styles.heroSection}>
        <p className={styles.heroText}>
          Clever Class is an AI-powered educational platform built to transform the way students learn, study, and grow academically. Launched in 2025, our mission is to make personalized, intelligent learning assistance accessible to every student—whether you're preparing for exams, catching up on lectures, or tackling tough homework assignments.
        </p>
        <p className={styles.heroSubtext}>
          We combine cutting-edge AI technology with user-friendly tools to deliver smart, efficient, and engaging learning experiences. From generating quizzes out of your class notes to summarizing YouTube lectures and podcasts, Clever Class helps you focus on what matters most: understanding and mastering your subjects.
        </p>
      </div>

      <section className={styles.section}>
        <h2>What We Offer</h2>
        <p className={styles.sectionIntro}>
          Clever Class empowers learners through:
        </p>
        <div className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🎓</div>
            <h3>AI Quiz Builder</h3>
            <p>
              Instantly generate quizzes from PDFs, lecture slides, and class notes
            </p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🧠</div>
            <h3>Lecture & Video Summarization</h3>
            <p>
              Understand complex topics quickly from YouTube videos and podcasts
            </p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🧩</div>
            <h3>Chrome Extension</h3>
            <p>
              Get on-the-spot homework help across 15+ popular learning platforms
            </p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🗣️</div>
            <h3>AI Tutoring</h3>
            <p>
              Chat with an AI tutor via text, voice, or image inputs for real-time support
            </p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>📊</div>
            <h3>Progress Tracking</h3>
            <p>
              Stay motivated with personalized study insights and recommendations
            </p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>📷</div>
            <h3>Image-Based Problem Solving</h3>
            <p>
              Snap a picture of a math problem or diagram, and get guided help
            </p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Why We Exist</h2>
        <p>
          Education shouldn't be one-size-fits-all. Students today face overwhelming information, tight schedules, and diverse learning needs. Clever Class was created to bridge that gap—with AI that understands, adapts, and supports each learner's journey.
        </p>
        <p>
          Whether you're a high school student, college learner, or lifelong self-studier, Clever Class is here to be your on-demand learning companion—right from your browser, phone, or desktop.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Our Vision</h2>
        <p className={styles.visionText}>
          To become the most trusted AI learning partner for students worldwide—making education smarter, simpler, and more personalized.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Join Us</h2>
        <p>
          Start learning smarter today at <a href="https://www.cleverclass.io" className={styles.link}>www.cleverclass.io</a>
        </p>
        <p>
          Have questions? Reach us at <a href="mailto:support@cleverclass.io" className={styles.link}>support@cleverclass.io</a>
        </p>
      </section>
    </StaticPageLayout>
  );
}; 