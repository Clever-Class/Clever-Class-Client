import React from 'react';
import styles from './Footer.module.scss';
import { FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.gradientOverlay} />
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.brand}>
            <a href="/" className={styles.logo}>
              CleverClass
            </a>
            <p className={styles.description}>
              Transforming education through AI-powered learning experiences.
              Join us in shaping the future of education.
            </p>
            <div className={styles.social}>
              <a href="#" className={styles.socialLink}>
                <FaTwitter />
              </a>
              <a href="#" className={styles.socialLink}>
                <FaGithub />
              </a>
              <a href="#" className={styles.socialLink}>
                <FaLinkedin />
              </a>
            </div>
          </div>
          <div className={styles.links}>
            <div className={styles.linkGroup}>
              <h3>Product</h3>
              <ul>
                <li>
                  <a href="#">Features</a>
                </li>
                <li>
                  <a href="#">Pricing</a>
                </li>
                <li>
                  <a href="#">Use Cases</a>
                </li>
                <li>
                  <a href="#">Resources</a>
                </li>
              </ul>
            </div>
            <div className={styles.linkGroup}>
              <h3>Company</h3>
              <ul>
                <li>
                  <a href="#">About</a>
                </li>
                <li>
                  <a href="#">Careers</a>
                </li>
                <li>
                  <a href="#">Blog</a>
                </li>
                <li>
                  <a href="#">Press</a>
                </li>
              </ul>
            </div>
            <div className={styles.linkGroup}>
              <h3>Support</h3>
              <ul>
                <li>
                  <a href="#">Help Center</a>
                </li>
                <li>
                  <a href="#">Contact</a>
                </li>
                <li>
                  <a href="#">Privacy</a>
                </li>
                <li>
                  <a href="#">Terms</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className={styles.bottom}>
          <div className={styles.copyright}>
            © 2024 CleverClass. All rights reserved.
          </div>
          <div className={styles.locale}>
            <span>English</span>
            <span>USD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
