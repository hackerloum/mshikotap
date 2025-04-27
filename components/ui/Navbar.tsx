import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaTasks, FaMoneyBillWave, FaUserCog } from 'react-icons/fa';
import { HiMenu, HiX } from 'react-icons/hi';

const Navbar = () => {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="bg-primary shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="text-white font-bold text-xl">
              Mshiko Tap
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/tasks" className="text-white hover:text-gray-200">
              Tasks
            </Link>
            <Link href="/how-it-works" className="text-white hover:text-gray-200">
              How It Works
            </Link>
            
            {session ? (
              <>
                <Link href="/dashboard" className="text-white hover:text-gray-200">
                  Dashboard
                </Link>
                
                {session.user.role === 'admin' && (
                  <Link href="/admin" className="text-white hover:text-gray-200">
                    Admin Panel
                  </Link>
                )}
                
                <div className="relative group">
                  <button className="flex items-center text-white hover:text-gray-200">
                    <FaUser className="mr-1" />
                    {session.user.name || 'Account'}
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block z-10">
                    <div className="py-1">
                      <Link href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                        <FaUserCog className="inline mr-2" /> Profile
                      </Link>
                      <Link href="/earnings" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                        <FaMoneyBillWave className="inline mr-2" /> Earnings
                      </Link>
                      <Link href="/my-tasks" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                        <FaTasks className="inline mr-2" /> My Tasks
                      </Link>
                      <button 
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        <FaSignOutAlt className="inline mr-2" /> Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="text-white hover:text-gray-200">
                  <FaSignInAlt className="inline mr-1" /> Sign In
                </Link>
                <Link href="/auth/register" className="bg-white text-primary px-4 py-2 rounded-md hover:bg-gray-100">
                  <FaUserPlus className="inline mr-1" /> Register
                </Link>
              </>
            )}
          </div>
          
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white">
              {menuOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-4">
            <Link href="/tasks" className="block text-white py-2">
              Tasks
            </Link>
            <Link href="/how-it-works" className="block text-white py-2">
              How It Works
            </Link>
            
            {session ? (
              <>
                <Link href="/dashboard" className="block text-white py-2">
                  Dashboard
                </Link>
                
                {session.user.role === 'admin' && (
                  <Link href="/admin" className="block text-white py-2">
                    Admin Panel
                  </Link>
                )}
                
                <Link href="/profile" className="block text-white py-2">
                  <FaUserCog className="inline mr-2" /> Profile
                </Link>
                <Link href="/earnings" className="block text-white py-2">
                  <FaMoneyBillWave className="inline mr-2" /> Earnings
                </Link>
                <Link href="/my-tasks" className="block text-white py-2">
                  <FaTasks className="inline mr-2" /> My Tasks
                </Link>
                <button 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="block w-full text-left text-white py-2"
                >
                  <FaSignOutAlt className="inline mr-2" /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="block text-white py-2">
                  <FaSignInAlt className="inline mr-1" /> Sign In
                </Link>
                <Link href="/auth/register" className="block text-white py-2">
                  <FaUserPlus className="inline mr-1" /> Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 