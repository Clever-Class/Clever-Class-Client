import React from 'react';
import Footer from '../Footer';
import CTASection from '../CTASection';

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <>
      <main>{children}</main>
      <CTASection />
      <Footer />
    </>
  );
};

export default Layout;
