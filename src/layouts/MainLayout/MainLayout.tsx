import { Outlet } from 'react-router-dom';
import Footer from '~/components/Footer';
import Header from '~/components/Header';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div>
      <Header />
      {children}
      <Outlet />
      <Footer />
    </div>
  );
};

export default MainLayout;
