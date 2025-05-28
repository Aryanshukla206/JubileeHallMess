import React from 'react';
import Navbar from './Navbar';
import OffDayBanner from './OffDayBanner';
import { useMenu } from '../../context/MenuContext';

const Layout = ({ children, title, subtitle }) => {
  const { isOffDay, getOffDayReason } = useMenu();


  // console.log(isOffDay);

  // Check if today is a mess off-day
  const today = new Date().toISOString().split('T')[0];
  const todayIsOffDay = isOffDay(today);
  const offDayReason = todayIsOffDay ? getOffDayReason(today) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Off-day banner */}
      {todayIsOffDay && <OffDayBanner reason={offDayReason} />}

      {/* Page header */}
      <header className="pt-24 pb-6 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">{title}</h1>
          {subtitle && <p className="mt-2 text-blue-100">{subtitle}</p>}
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-blue-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">Jubilee Hall Mess</h3>
              <p className="text-blue-200">Making meal management easier</p>
            </div>
            <div className="text-blue-200 text-sm">
              <p>Contact: aryan.msc23.du@gmail.com</p>
              <p>© {new Date().getFullYear()} Jubilee Hall. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;