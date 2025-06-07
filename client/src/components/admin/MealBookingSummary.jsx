import React, { useState, useEffect } from 'react';
import { useBookings } from '../../context/BookingContext';
import { useMenu } from '../../context/MenuContext'; // Import MenuContext
import { Calendar, Users, Utensils } from 'lucide-react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const MealBookingSummary = () => {
  const { getBookingsByDate, getGuestBookingsByDate } = useBookings();
  const { getMenuForDate } = useMenu(); // Function to get menu for a specific date
  const [isOpen, setIsOpen] = useState(true);

  const toggleOpen = () => setIsOpen(prev => !prev);

  const [bookingStats, setBookingStats] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    // 3. Fetch both resident & guest bookings
    const residents = getBookingsByDate(selectedDate);
    const guests = getGuestBookingsByDate(selectedDate);

    // 4. Merge arrays
    const allBookings = [
      ...residents.map(b => ({ ...b, type: 'Resident' })),
      ...guests.map(g => ({ ...g, type: 'Guest' }))
    ];

    // 5. Get the menu for this date
    const menuForDate = getMenuForDate(selectedDate) || {};

    // 6. Initialize stats structure
    const initStats = {};
    ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
      const items = menuForDate[mealType] || [];
      initStats[mealType] = {
        total: 0,
        quantities: items.reduce((acc, item) => {
          acc[item] = 0;
          return acc;
        }, {})
      };
    });

    // 7. Accumulate totals & quantities
    allBookings.forEach(({ mealType, quantities }) => {
      if (!initStats[mealType]) return; // skip unknown meal
      initStats[mealType].total += 1;
      Object.entries(quantities).forEach(([item, qty]) => {
        // if new item appears, initialize
        if (initStats[mealType].quantities[item] == null) {
          initStats[mealType].quantities[item] = 0;
        }
        initStats[mealType].quantities[item] += qty;
      });
    });

    // 8. Update state
    setBookingStats(initStats);
  }, [
    selectedDate,
    getBookingsByDate,
    getGuestBookingsByDate,
    getMenuForDate
  ]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}

      <div onClick={toggleOpen} className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Meal Summary</h2>
          <div className="flex items-center mt-1 text-blue-100">
            <Calendar size={16} className="mr-1" />
            <span>{selectedDate}</span>
          </div>
        </div>
        <div className='flex justify-end gap-6 '>
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="rounded text-gray-800 p-1"
          />
          {isOpen ? (
            <ChevronUp className="bg-blue-200 h-5 w-5 border-2 mt-2  rounded-md text-gray-800" />
          ) : (
            <ChevronDown className="bg-blue-200 h-5 w-5 border-2 mt-2  rounded-md text-gray-800" />
          )}
        </div>
      </div>
      <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <Users className="mr-2 text-blue-600" />
            <span className="font-medium">
              Total Bookings: {Object.values(bookingStats).reduce((sum, meal) => sum + meal.total, 0)}
            </span>
          </div>

        </div>
      </div>
      {/* <CollapsibleSection> */}
      {/* Body */}
      {isOpen && (
        // <div >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['breakfast', 'lunch', 'dinner'].map(mealType => {
            const stats = bookingStats[mealType] || { total: 0, quantities: {} };
            return (
              <div
                key={mealType}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <h3 className="font-bold text-lg text-gray-800 mb-2 capitalize">
                  {mealType}
                </h3>
                <div className="flex items-center mb-3 text-blue-600">
                  <Users size={18} className="mr-2" />
                  <span className="font-medium">{stats.total} bookings</span>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Item Quantities:</h4>
                  {Object.entries(stats.quantities).length > 0 ? (
                    Object.entries(stats.quantities).map(
                      ([item, quantity]) => (
                        <div
                          key={item}
                          className="flex justify-between text-gray-600"
                        >
                          <span>{item}</span>
                          <span className="font-medium">{quantity}</span>
                        </div>
                      )
                    )
                  ) : (
                    <p className="text-gray-500 italic">
                      No menu or no bookings.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      )}
      {/* </CollapsibleSection> */}
    </div>
  );

};

export default MealBookingSummary;
