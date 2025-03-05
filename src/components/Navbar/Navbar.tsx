import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { RxDashboard } from 'react-icons/rx';
import { HiOutlineMenuAlt3 } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import CleverClassLogo from '~assets/images/logo.png';

import styles from './Navbar.module.scss';

interface NavbarProps {
  onSignupClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSignupClick }) => {
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

  const menuVariants = {
    closed: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.25,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: 'afterChildren',
      },
    },
    open: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0, 0, 0.2, 1],
        staggerChildren: 0.07,
        delayChildren: 0.1,
      },
    },
  };

  const menuItemVariants = {
    closed: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 1, 1],
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: [0, 0, 0.2, 1],
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
              <a href="#extention">Chrome Extension</a>
            </li>
            <li>
              <a href="#notebook">Notebook</a>
            </li>
            <li>
              <a href="#help-center">Help Center</a>
            </li>
            <li>
              <a href="#pricing">Pricing</a>
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
                  <a href="/login" className={styles.navbarLogin}>
                    Log in
                  </a>
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
            <motion.ul className={styles.mobileMenuLinks}>
              <motion.li variants={menuItemVariants}>
                <a href="#extention">Chrome Extension</a>
              </motion.li>
              <motion.li variants={menuItemVariants}>
                <a href="#notebook">Notebook</a>
              </motion.li>
              <motion.li variants={menuItemVariants}>
                <a href="#help-center">Help Center</a>
              </motion.li>
              <motion.li variants={menuItemVariants}>
                <a href="#pricing">Pricing</a>
              </motion.li>
              {userToken ? (
                <motion.li variants={menuItemVariants}>
                  <a href="/dashboard" className={styles.mobileMenuDashboard}>
                    <RxDashboard className={styles.icon} />
                    Dashboard
                  </a>
                </motion.li>
              ) : (
                <>
                  <motion.li variants={menuItemVariants}>
                    <a href="/login">Log in</a>
                  </motion.li>
                  <motion.li variants={menuItemVariants}>
                    <a
                      href="#start-trial"
                      className={styles.mobileMenuJoinFree}
                      onClick={onSignupClick}
                    >
                      Join for free
                    </a>
                  </motion.li>
                </>
              )}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
