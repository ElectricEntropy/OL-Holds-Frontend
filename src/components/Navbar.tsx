import React, { useState } from 'react';
import { MenuIcon, XIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const linkClass = (path: string) => `
    px-3 py-2 rounded-md text-sm font-medium
    ${location.pathname === path ? 'text-indigo-600' : 'text-gray-900 hover:text-indigo-600 transition duration-150'}
  `;
  const mobileLinkClass = (path: string) => `
    block px-3 py-2 rounded-md text-base font-medium
    ${location.pathname === path ? 'text-indigo-600 bg-gray-50' : 'text-gray-900 hover:text-indigo-600 hover:bg-gray-50'}
  `;
  return <nav className="bg-white shadow-sm w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-indigo-600">
                Logo
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="space-x-4">
              <Link to="/" className={linkClass('/')}>
                Customers
              </Link>
            </div>
          </div>
          <div className="flex items-center sm:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500" aria-expanded="false">
              <span className="sr-only">Open main menu</span>
              {isOpen ? <XIcon className="block h-6 w-6" /> : <MenuIcon className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link to="/" className={mobileLinkClass('/')}>
              Customers
            </Link>
          </div>
        </div>}
    </nav>;
};