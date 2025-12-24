import { Outlet } from 'react-router-dom';

interface RegisterLayoutProps {
  children?: React.ReactNode;
}

const RegisterLayout = ({ children }: RegisterLayoutProps) => {
  return (
    <div>
      {children}
      <Outlet />
    </div>
  );
};

export default RegisterLayout;
