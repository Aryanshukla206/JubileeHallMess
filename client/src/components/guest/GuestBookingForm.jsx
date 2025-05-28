import React, { useState, useEffect } from 'react';
import { useBookings } from '../../context/BookingContext';
import { useMenu } from '../../context/MenuContext';
import { useToast } from '../../context/ToastContext';
import QuantitySelector from '../common/QuantitySelector';
import QRCode from '../common/QRCode';

const GuestBookingForm = () => {
  // console.log('✏️ GuestBookingForm render start');
  const { addGuestBooking, getAvailableItems } = useBookings();
  const { isOffDay, getOffDayReason } = useMenu();
  const { success, error } = useToast();

  // console.log('useBookings →', { addGuestBooking, getAvailableItems });
  // console.log('useMenu     →', { isOffDay, getOffDayReason });
  // console.log('useToast    →', { success, error });


  if (!addGuestBooking || !getAvailableItems || !isOffDay || !getOffDayReason) {
    return <div>Loading booking system...</div>;
  }

  // Form state
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [mealType, setMealType] = useState('');
  const [date, setDate] = useState('');
  const [quantities, setQuantities] = useState({});

  // Booking state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [bookingDiscount, setBookingDiscount] = useState(0);

  // Setup date default (tomorrow)
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    // console.log('Setting default date:', tomorrow);
    setDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  const meals = getAvailableItems(mealType, date);
  // console.log('MealBookingCard > mealType:', mealType);
  // console.log('MealBookingCard > date:', date);

  // Check if selected date is a mess off-day
  const selectedDateIsOffDay = isOffDay?.(date) || false;
  const offDayReason = selectedDateIsOffDay ? getOffDayReason?.(date) : '';


  const handleQuantityChange = (item, value) => {
    setQuantities(prev => ({
      ...prev,
      [item.toLowerCase()]: value
    }));
  };

  // Calculate if booking is made at least 1 hour in advance for discount
  const checkDiscount = () => {
    if (!date || !mealType) return 0;

    const bookingTime = new Date();
    const mealStartTime = new Date(`${date}T${meals[mealType].startTime}`);
    const hourDiff = (mealStartTime - bookingTime) / (1000 * 60 * 60);

    return hourDiff >= 1 ? 10 : 0;
  };

  // Update discount whenever meal type or date changes
  useEffect(() => {
    setBookingDiscount(checkDiscount());
  }, [mealType, date]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    if (!name || !contactNumber || !mealType || !date) {
      error("Please fill all required fields");
      return;
    }

    // Validate at least one item is selected
    const totalItems = Object.values(quantities).reduce((sum, q) => sum + q, 0);
    // console.log(totalItems);
    if (totalItems === 0) {
      error("Please select at least one item");
      return;
    }

    // Check if selected date is a mess off-day
    if (selectedDateIsOffDay) {
      error(`Cannot book for ${date}. Mess is closed: ${offDayReason}`);
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate discount
      const discount = checkDiscount();

      // Book meal
      const booking = addGuestBooking(name, contactNumber, mealType, date, quantities, discount);

      if (booking) {
        setBookingData(booking);
        setBookingComplete(true);
        success("Guest booking successful!");
      } else {
        error("Booking failed. Please try again.");
      }
    } catch (err) {
      error(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName('');
    setContactNumber('');
    setMealType('lunch');

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(tomorrow.toISOString().split('T')[0]);

    setQuantities({});

    setBookingComplete(false);
    setBookingData(null);
  };

  // const MEAL_TIMES = {
  //   breakfast: { start: '08:00', end: '09:30' },
  //   lunch: { start: '13:00', end: '14:30' },
  //   dinner: { start: '19:00', end: '20:30' }
  // };
  // const { start, end } = MEAL_TIMES[mealType];
  // Format time to be more readable (e.g., "08:00" -> "8:00 AM")
  const formatTime = (timeStr) => {
    // console.log('Formatting time:', timeStr);
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours);
    const period = h >= 12 ? 'PM' : 'AM';
    const formattedHours = h % 12 || 12;
    return `${formattedHours}:${minutes} ${period}`;
  };
  if (!addGuestBooking || !getAvailableItems) {
    return <div>Loading booking system...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      {!bookingComplete ? (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Guest Meal Booking</h2>

          <div className="space-y-4">
            {/* Personal details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="tel"
                  id="contactNumber"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Meal details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="mealType" className="block text-sm font-medium text-gray-700 mb-1">
                  Meal
                </label>
                <select
                  id="mealType"
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="breakfast">Breakfast ({formatTime(meals.breakfast?.startTime)})</option>
                  <option value="lunch">Lunch ({formatTime(meals.lunch?.startTime)})</option>
                  <option value="dinner">Dinner ({formatTime(meals.dinner?.startTime)})</option>
                </select>
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Off-day warning */}
            {selectedDateIsOffDay && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
                <p className="font-medium">Mess is closed on {date}</p>
                <p className="text-sm">Reason: {offDayReason}</p>
                <p className="text-sm mt-1">Please select a different date.</p>
              </div>
            )}

            {/* Discount information */}
            {bookingDiscount > 0 && !selectedDateIsOffDay && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-700">
                <p className="font-medium">You're eligible for a {bookingDiscount}% early booking discount!</p>
                <p className="text-sm">Booking at least 1 hour before meal time.</p>
              </div>
            )}

            {/* Quantity selection */}
            <div className="mt-4">
              <h3 className="font-medium text-gray-800 mb-3">Meal Quantity</h3>
              <div className="space-y-3">
                {meals[mealType].items.map(item => (
                  <QuantitySelector
                    key={item}
                    name={item}
                    quantity={quantities[item.toLowerCase()] || 0}
                    setQuantity={(value) => handleQuantityChange(item, value)}
                    disabled={selectedDateIsOffDay}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || selectedDateIsOffDay}
              className={`w-full p-2 rounded-md font-medium transition-colors ${isSubmitting || selectedDateIsOffDay
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            >
              {isSubmitting ? 'Processing...' : 'Book Meal'}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-green-600 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600">
              Your meal has been booked. Please save this confirmation.
            </p>
          </div>

          <div className="flex justify-center mb-6">
            <QRCode data={JSON.stringify(bookingData)} />
          </div>

          <div className="border-t border-b border-gray-200 py-4 mb-4">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Booking Details</h3>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Booking ID:</span>
                <span className="font-medium">{bookingData?.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span>{bookingData?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Contact:</span>
                <span>{bookingData?.contactNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Meal:</span>
                <span>{meals[bookingData?.mealType]?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span>{bookingData?.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span>
                  {formatTime(meals[bookingData?.mealType]?.startTime)} - {formatTime(meals[bookingData?.mealType]?.endTime)}
                </span>
              </div>

              {bookingData?.hasDiscount && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount:</span>
                  <span>{bookingData?.discountPercent}%</span>
                </div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Items Ordered</h3>
            <ul className="space-y-1">
              {Object.entries(bookingData?.quantities || {}).map(([item, quantity]) => {
                if (quantity > 0) {
                  return (
                    <li key={item} className="flex justify-between">
                      <span className="text-gray-600 capitalize">{item}</span>
                      <span>{quantity}</span>
                    </li>
                  );
                }
                return null;
              })}
            </ul>
          </div>

          <div className="text-center">
            <button
              onClick={resetForm}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Book Another Meal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestBookingForm;

