import React from 'react';
import { Link } from 'react-router-dom';
import GuestBookingForm from '../components/guest/GuestBookingForm';
import { Coffee, LogIn, CalendarDays, Clock, AlertTriangle } from 'lucide-react';

const GuestBookingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Coffee size={24} className="text-blue-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-800">Jubilee Hall Mess</h1>
            </div>
            <Link 
              to="/login" 
              className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors"
            >
              <LogIn size={18} className="mr-1" />
              Login
            </Link>
          </div>
        </div>
      </header>
      
      {/* Hero section */}
      <div className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Guest Meal Booking</h1>
            <p className="text-blue-100 max-w-xl mx-auto">
              Book your meals in advance with Jubilee Hall Mess. Enjoy delicious, 
              nutritious food with our easy booking system.
            </p>
          </div>
        </div>
      </div>
      
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <GuestBookingForm />
            </div>
            
            <div className="space-y-6">
              {/* Info card */}
              <div className="bg-white rounded-lg shadow-md p-5">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Booking Information</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CalendarDays size={20} className="text-blue-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-700">Advance Booking</p>
                      <p className="text-sm text-gray-600">
                        Bookings must be made before the meal start time.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock size={20} className="text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-700">Early Bird Discount</p>
                      <p className="text-sm text-gray-600">
                        Get 10% off when you book at least 1 hour in advance.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <AlertTriangle size={20} className="text-yellow-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-700">QR Code</p>
                      <p className="text-sm text-gray-600">
                        Show your booking QR code when you arrive at the mess.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Meal timings card */}
              <div className="bg-white rounded-lg shadow-md p-5">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Meal Timings</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium">Breakfast</span>
                    <span className="text-gray-600">8:00 AM - 9:45 AM</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium">Lunch</span>
                    <span className="text-gray-600">1:00 PM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium">Dinner</span>
                    <span className="text-gray-600">8:00 PM - 9:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-gray-800">Jubilee Hall Mess</h3>
              <p className="text-gray-600">Making meal management easier</p>
            </div>
            <div className="text-gray-500 text-sm">
              <p>Contact: mess-admin@jubileehall.com</p>
              <p>© {new Date().getFullYear()} Jubilee Hall. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GuestBookingPage;