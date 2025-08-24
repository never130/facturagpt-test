import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-500 text-white p-4">
      <h1 className="text-xl font-bold">ReactApp</h1>
      <nav>
        <Link to="/" className="text-white hover:underline">Home</Link>
      </nav>
    </header>
  );
};

export default Header;
