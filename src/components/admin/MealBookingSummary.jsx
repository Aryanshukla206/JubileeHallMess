import React, { useState, useEffect } from 'react';
import { useBookings } from '../../context/BookingContext';
import { useMenu } from '../../context/MenuContext'; // Import MenuContext
import { Calendar, Users } from 'lucide-react';

const MealBookingSummary = () => {
  const { getBookingsByDate } = useBookings();
  const { getAllGuestBookings } = useBookings(); // Function to get all guest bookings
  const { getMenuForDate } = useMenu(); // Function to get menu for a specific date

  const [bookingStats, setBookingStats] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Fetch menu for the selected date
  const menuForSelectedDate = getMenuForDate(selectedDate);

  useEffect(() => {
    const bookings = getBookingsByDate(selectedDate);
    // bookings.push(...getAllGuestBookings().filter(booking => booking.date === selectedDate));
    // Combine resident and guest bookings
    const allBookings = [
      ...bookings.map(b => ({
        ...b,
        type: 'Resident',
        name: b.userName,
        contact: 'N/A'
      })),
      ...getAllGuestBookings().filter(booking => booking.date === selectedDate).map(b => ({
        ...b,
        type: 'Guest',
        userId: 'N/A'
      }))
    ];
    // Initialize stats structure dynamically based on menu items
    const initStats = {};
    ['breakfast', 'lunch', 'dinner'].forEach((mealType) => {
      const menuItems = menuForSelectedDate[mealType] || [];

      // Create an object to hold quantities for each menu item
      const quantities = {};
      menuItems.forEach((item) => {
        quantities[item] = 0;
      });

      initStats[mealType] = { total: 0, quantities };
    });

    // Calculate totals for each meal type
    allBookings.forEach(({ mealType, quantities }) => {
      // Increase total bookings for the meal type
      initStats[mealType].total++;

      // Aggregate booked quantities based on menu items
      Object.entries(quantities).forEach(([item, quantity]) => {
        if (initStats[mealType].quantities[item] !== undefined) {
          initStats[mealType].quantities[item] += quantity;
        } else {
          // Handle cases where menu changes dynamically and item isn't pre-defined
          initStats[mealType].quantities[item] = quantity;
        }
      });
    });

    setBookingStats(initStats);
  }, [selectedDate, getBookingsByDate, menuForSelectedDate]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Meal Summary</h2>
          <div className="flex items-center mt-1 text-blue-100">
            <Calendar size={16} className="mr-1" />
            <span>{selectedDate}</span>
          </div>
        </div>
        <div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded text-gray-800 p-1"
          />
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['breakfast', 'lunch', 'dinner'].map((mealType) => (
            <div key={mealType} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-bold text-lg text-gray-800 mb-2 capitalize">
                {mealType}
              </h3>

              <div className="flex items-center mb-3 text-blue-600">
                <Users size={18} className="mr-2" />
                <span className="font-medium">
                  {bookingStats[mealType]?.total || 0} bookings
                </span>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-gray-700">Item Quantities:</h4>
                {menuForSelectedDate[mealType] ? (
                  Object.entries(bookingStats[mealType]?.quantities || {}).map(
                    ([item, quantity]) => (
                      <div key={item} className="flex justify-between">
                        <span className="text-gray-600">{item}</span>
                        <span className="font-medium">{quantity}</span>
                      </div>
                    )
                  )
                ) : (
                  <p className="text-gray-500 italic">No menu available.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MealBookingSummary;
