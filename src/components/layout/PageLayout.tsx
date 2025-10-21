import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Header from '../Header';
import Footer from '../Footer';
import ScrollingBackground from '../ScrollingBackground';

interface PageLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
  showBackground?: boolean;
}

const PageLayout = ({ children, showFooter = false, showBackground = true }: PageLayoutProps) => {
  return (
    <div className="min-h-screen relative">
      {showBackground && <ScrollingBackground />}
      <Header />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 pt-14 md:pt-20 lg:pt-24"
      >
        {children}
      </motion.main>
      {showFooter && <Footer />}
    </div>
  );
};

export default PageLayout;
