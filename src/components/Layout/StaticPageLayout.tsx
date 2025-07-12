import { useState, ReactNode } from 'react';
import { Navbar, AuthPopup } from '~components/index';
import Footer from '~components/Footer/Footer';
import styles from './StaticPageLayout.module.scss';

interface StaticPageLayoutProps {
  children: ReactNode;
  className?: string;
  title?: string;
  containerClassName?: string;
}

export const StaticPageLayout = ({ 
  children, 
  className = '', 
  title, 
  containerClassName = '' 
}: StaticPageLayoutProps) => {
  const [authPopup, setAuthPopup] = useState<{
    isOpen: boolean;
    mode: 'login' | 'signup';
  }>({
    isOpen: false,
    mode: 'signup',
  });

  const handleJoinRequest = () => {
    setAuthPopup({ isOpen: true, mode: 'signup' });
  };

  const handleLoginRequest = () => {
    setAuthPopup({ isOpen: true, mode: 'login' });
  };

  return (
    <div className={`${styles.staticPageLayout} ${className}`}>
      <Navbar
        onSignupClick={handleJoinRequest}
        onLoginClick={handleLoginRequest}
      />

      {/* Auth Popup */}
      {authPopup.isOpen && (
        <AuthPopup
          onClose={() => setAuthPopup({ isOpen: false, mode: 'signup' })}
          mode={authPopup.mode}
        />
      )}

      <main className={styles.staticPageContent}>
        <div className={`${styles.contentContainer} ${containerClassName}`}>
          {title && <h1 className={styles.pageTitle}>{title}</h1>}
          <div className={styles.pageContent}>
            {children}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}; 