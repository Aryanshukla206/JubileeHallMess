import React, { useState } from 'react';
import Layout from '../components/common/Layout';
import MealBookingSummary from '../components/admin/MealBookingSummary';
import RebateManager from '../components/admin/RebateManager';
import OffDayManager from '../components/admin/OffDayManager';
import { Calendar, Download, FileText } from 'lucide-react';
import { useBookings } from '../context/BookingContext';

const AdminDashboard = () => {
  const { getBookingsByDate, getAllGuestBookings } = useBookings();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Export bookings as CSV
  const exportBookingsCSV = () => {
    const bookings = getBookingsByDate(date);
    const guestBookings = getAllGuestBookings().filter(booking => booking.date === date);
    
    // Combine resident and guest bookings
    const allBookings = [
      ...bookings.map(b => ({
        ...b,
        type: 'Resident',
        name: b.userName,
        contact: 'N/A'
      })),
      ...guestBookings.map(b => ({
        ...b,
        type: 'Guest',
        userId: 'N/A'
      }))
    ];
    
    // Create CSV content
    const headers = [
      'Type', 'ID', 'Name', 'Contact', 'Meal', 'Date', 
      'Rice Qty', 'Dal Qty', 'Sabji Qty', 'Roti Qty', 'Timestamp'
    ];
    
    let csvContent = headers.join(',') + '\n';
    
    allBookings.forEach(booking => {
      const row = [
        booking.type,
        booking.id,
        booking.name,
        booking.contact,
        booking.mealType,
        booking.date,
        booking.quantities.rice || 0,
        booking.quantities.dal || 0,
        booking.quantities.sabji || 0,
        booking.quantities.roti || 0,
        booking.timestamp
      ];
      
      csvContent += row.join(',') + '\n';
    });
    
    // Create and download the CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `bookings-${date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Layout 
      title="Admin Dashboard" 
      subtitle="Manage mess operations and monitor bookings"
    >
      <div className="space-y-8">
        {/* Actions and date selector row */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mr-2">
              Date:
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={exportBookingsCSV}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Download size={16} className="mr-1" />
              Export Bookings
            </button>
          </div>
        </div>
        
        {/* Meal booking summary */}
        <MealBookingSummary />
        
        {/* Two-column layout for admin tools */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Rebate manager */}
          <RebateManager />
          
          {/* Off-day manager */}
          <OffDayManager />
        </div>
        
        {/* Reports section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-600 text-white p-4">
            <h2 className="text-xl font-bold">Reports & Analytics</h2>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center mb-3">
                  <Calendar size={20} className="text-blue-600 mr-2" />
                  <h3 className="font-medium text-gray-800">Monthly Summary</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  View monthly booking patterns and food consumption.
                </p>
                <button className="text-sm text-blue-600 flex items-center hover:text-blue-700">
                  <FileText size={14} className="mr-1" />
                  Generate Report
                </button>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center mb-3">
                  <Calendar size={20} className="text-blue-600 mr-2" />
                  <h3 className="font-medium text-gray-800">Resident Attendance</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Track resident meal attendance and preferences.
                </p>
                <button className="text-sm text-blue-600 flex items-center hover:text-blue-700">
                  <FileText size={14} className="mr-1" />
                  Generate Report
                </button>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center mb-3">
                  <Calendar size={20} className="text-blue-600 mr-2" />
                  <h3 className="font-medium text-gray-800">Guest Bookings</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Analyze guest booking patterns and revenue.
                </p>
                <button className="text-sm text-blue-600 flex items-center hover:text-blue-700">
                  <FileText size={14} className="mr-1" />
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;