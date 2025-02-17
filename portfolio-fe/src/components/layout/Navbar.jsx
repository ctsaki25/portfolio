import AuthButton from '../auth/AuthButton';

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow">
      {/* Your other navbar items */}
      <AuthButton />
    </nav>
  );
};

export default Navbar; 