import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { RxDashboard } from 'react-icons/rx';
import { HiOutlineMenuAlt3 } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import CleverClassLogo from '~assets/images/logo.png';
import { Link } from 'react-router-dom';
import { AppRoutes } from '~constants';

import styles from './Navbar.module.scss';

interface NavbarProps {
  onSignupClick: () => void;
  onLoginClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSignupClick,
  onLoginClick,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const userToken = Cookies.get('userToken');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToQuizBuilder = () => {
    const element = document.getElementById('quiz-builder');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    // Close mobile menu if open
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      scale: 0.98,
      y: -5,
      transition: {
        duration: 0.25,
        ease: [0.32, 0, 0.67, 0],
      },
    },
    open: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.25,
        ease: [0.33, 1, 0.68, 1],
      },
    },
  };

  const menuItemVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.1,
      },
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.15,
        delay: 0.1,
      },
    },
  };

  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        <div className={styles.navbarLogo}>
          <img src={CleverClassLogo} alt="Clever Class Logo" />
          <span>Clever Class</span>
        </div>

        {!isMobile && (
          <ul className={styles.navbarLinks}>
            <li>
              <Link to={AppRoutes.Homepage}>Chrome Extension</Link>
            </li>
            <li>
              <button onClick={scrollToQuizBuilder} className={styles.navLink}>Quiz Builder</button>
            </li>
            <li>
              <Link to={AppRoutes.Pricing}>Pricing</Link>
            </li>
          </ul>
        )}

        <div className={styles.navbarActions}>
          {!isMobile && (
            <>
              {userToken ? (
                <div className={styles.navbarDashboard}>
                  <a href="/dashboard" title="Go to Dashboard">
                    <RxDashboard className={styles.icon} />
                  </a>
                  <a href="/dashboard" className={styles.dashboardLink}>
                    Dashboard
                  </a>
                </div>
              ) : (
                <div className={styles.navbarAuth}>
                  <span className={styles.navbarLogin} onClick={onLoginClick}>
                    Log in
                  </span>
                  <a
                    href="#start-trial"
                    className={styles.navbarJoinFree}
                    onClick={onSignupClick}
                  >
                    Join for free
                  </a>
                </div>
              )}
            </>
          )}

          {isMobile && (
            <button
              className={styles.menuButton}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <HiOutlineMenuAlt3 size={24} />
            </button>
          )}
        </div>
      </nav>

      <AnimatePresence mode="wait">
        {isMobile && isMenuOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <ul className={styles.mobileMenuLinks}>
              <li>
                <a href="#extention">Chrome Extension</a>
              </li>
              <li>
                <button onClick={scrollToQuizBuilder} className={styles.mobileNavLink}>Quiz Builder</button>
              </li>
              <li>
                <a href="#notebook">Notebook</a>
              </li>
              <li>
                <a href="#help-center">Help Center</a>
              </li>
              <li>
                <Link to={AppRoutes.Pricing}>Pricing</Link>
              </li>
              {userToken ? (
                <li>
                  <a href="/dashboard" className={styles.mobileMenuDashboard}>
                    <RxDashboard className={styles.icon} />
                    Dashboard
                  </a>
                </li>
              ) : (
                <>
                  <li>
                    <a href="/login">Log in</a>
                  </li>
                  <li>
                    <a
                      href="#start-trial"
                      className={styles.mobileMenuJoinFree}
                      onClick={onSignupClick}
                    >
                      Join for free
                    </a>
                  </li>
                </>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
