import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Header from '../Header';
import Footer from '../Footer';
import ScrollingBackground from '../ScrollingBackground';

interface PageLayoutProps {
  children: ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className="min-h-screen relative">
      <ScrollingBackground />
      <Header />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 pt-24"
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
};

export default PageLayout;
