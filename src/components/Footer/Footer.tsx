import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import { AppRoutes } from '~constants';
import styles from './Footer.module.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      // { name: 'About Us', href: AppRoutes.AboutUs },
      { name: 'Pricing', href: AppRoutes.Pricing },
    ],
    links: [
      { name: 'Terms of Service', href: AppRoutes.TermsOfService },
      { name: 'Privacy Policy', href: AppRoutes.PrivacyPolicy },
      { name: 'Refund Policy', href: AppRoutes.RefundPolicy },
    ],
  };

  const socialLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com',
      icon: FaGithub,
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com',
      icon: FaTwitter,
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com',
      icon: FaLinkedinIn,
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com',
      icon: FaInstagram,
    },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Brand Section */}
          <div className={styles.brand}>
            <Link to="/" className={styles.logo}>
              Clever Class
            </Link>
            <p className={styles.description}>
              Empowering education through AI-powered learning assistance.
              Transform the way you learn with personalized study tools and
              instant support.
            </p>
            <div className={styles.social}>
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label={item.name}
                >
                  <item.icon />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div className={styles.links}>
            <div className={styles.linkGroup}>
              <h3>Company</h3>
              <ul>
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href}>{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.linkGroup}>
              <h3>Quick Links</h3>
              <ul>
                {footerLinks.links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href}>{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {currentYear} Clever Class. All rights reserved.
          </p>
          <div className={styles.locale}>
            <span>English (US)</span>
            <span>USD $</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
