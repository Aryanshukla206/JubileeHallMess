import React, { useState, useEffect } from 'react';
import { useBookings } from '../../context/BookingContext';
import { useMenu } from '../../context/MenuContext';
import { useToast } from '../../context/ToastContext';
import QuantitySelector from '../common/QuantitySelector';
import QRCode from '../common/QRCode';
import getTodayDate from '../../utils/getTodayDate';
import CollapsibleSection from '../common/CollapsibleSection';
const MEAL_TIMES = {
  breakfast: { start: '08:00', end: '09:30' },
  lunch: { start: '13:00', end: '14:00' },
  dinner: { start: '20:00', end: '21:00' }
};

const GuestBookingForm = () => {
  const { addGuestBooking, getAvailableItems } = useBookings();
  const { isOffDay, getOffDayReason, getMenuForDate } = useMenu();
  const { success, error } = useToast();

  // Form state
  const [userName, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [mealType, setMealType] = useState('lunch'); // Initialize with default value
  const [date, setDate] = useState(getTodayDate());
  const [quantities, setQuantities] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [bookingDiscount, setBookingDiscount] = useState(0);

  // Initialize date (tomorrow)
  useEffect(() => {
    const nextDate = getTodayDate();

    console.log(nextDate)
    setDate(nextDate);
  }, []);

  console.log(date, "from form")
  // Get available meals
  const meals = getAvailableItems(mealType, date);
  console.log(meals, "********************>")

  // Get meal time info safely
  const mealTime = MEAL_TIMES[mealType] || MEAL_TIMES.lunch; // Fallback to lunch
  const { start, end } = mealTime;

  // Check if selected date is off-day
  const selectedDateIsOffDay = isOffDay?.(date) || false;
  const offDayReason = selectedDateIsOffDay ? getOffDayReason?.(date) : '';

  // Format time display
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours);
    const period = h >= 12 ? 'PM' : 'AM';
    const formattedHours = h % 12 || 12;
    return `${formattedHours}:${minutes} ${period}`;
  };

  // Handle quantity changes
  const handleQuantityChange = (item, value) => {
    setQuantities(prev => ({
      ...prev,
      [formatMeal(item)]: value
    }));
  };

  // Calculate discount eligibility
  // const checkDiscount = () => {
  //   if (!date || !mealType) return 0;

  //   const bookingTime = new Date();
  //   const mealStartTime = new Date(`${date}T${start}`);
  //   const hourDiff = (mealStartTime - bookingTime) / (1000 * 60 * 60);

  //   return hourDiff >= 1 ? 10 : 0;
  // };

  // Update discount when meal/date changes
  // useEffect(() => {
  //   setBookingDiscount(checkDiscount());
  // }, [mealType, date]);

  // Handle form submission
  const formatMeal = (meal) => {
    return meal.charAt(0).toUpperCase() + meal.slice(1);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userName || !contactNumber || !mealType || !date) {
      error("Please fill all required fields");
      return;
    }

    const totalItems = Object.values(quantities).reduce((sum, q) => sum + q, 0);
    if (totalItems === 0) {
      error("Please select at least one item");
      return;
    }

    if (selectedDateIsOffDay) {
      error(`Cannot book for ${date}. Mess is closed: ${offDayReason}`);
      return;
    }

    setIsSubmitting(true);

    try {
      const discount = false;
      // console.log(userName, contactNumber, mealType, date, quantities, discount, "from booking form");
      const booking = await addGuestBooking({ userName, contactNumber, mealType, date, quantities, discount, isGuest: true });
      console.log(booking, " booking form  from guesbooking->>>>>>>>>>>>")

      if (booking) {
        console.log("object booking --------__>", booking);
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

  // Reset form
  const resetForm = () => {
    setName('');
    setContactNumber('');
    setMealType('lunch');
    setQuantities({});
    setBookingComplete(false);
    setBookingData(null);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(tomorrow.toISOString().split('T')[0]);
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
                <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="userName"
                  value={userName}
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
                  <option value="breakfast">Breakfast ({formatTime(start)})</option>
                  <option value="lunch">Lunch ({formatTime(start)})</option>
                  <option value="dinner">Dinner ({formatTime(start)})</option>
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
                {/* <p className="font-medium">You're eligible for a {bookingDiscount}% early booking discount!</p> */}
                <p className="text-sm">Booking at least 1 hour before meal time.</p>
              </div>
            )}

            {/* Quantity selection */}
            <div className="mt-4">
              <CollapsibleSection title={"Meal Quantity"}>
                {/* <h3 className="font-medium text-gray-800 mb-3">Meal Quantity</h3> */}
                <div className="space-y-3">
                  {console.log(meals, "------------------------>")}
                  {meals.map(item => (
                    <QuantitySelector
                      key={item}
                      name={item}
                      quantity={quantities[formatMeal(item)] || 0}
                      setQuantity={(value) => handleQuantityChange(item, value)}
                      disabled={selectedDateIsOffDay}
                    />
                  ))}
                </div>
              </CollapsibleSection>
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
            {/* <h3 className="text-lg font-medium text-gray-800 mb-3">Booking Details</h3> */}
            <CollapsibleSection title={"Booking Details"}>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking ID:</span>
                  <span className="font-medium">{bookingData?.bookingNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span>{bookingData?.userName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Contact:</span>
                  <span>{bookingData?.contactNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Meal:</span>
                  <span>{bookingData?.mealType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span>{bookingData?.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span>
                    {formatTime(MEAL_TIMES[bookingData?.mealType].start)} - {formatTime(MEAL_TIMES[bookingData?.mealType].end)}
                  </span>
                </div>

                {/* {bookingData?.hasDiscount && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount:</span>
                  <span>{bookingData?.discountPercent}%</span>
                </div>
              )} */}
              </div>
            </CollapsibleSection>
          </div>

          <div className="mb-4">
            {/* <h3 className="text-lg font-medium text-gray-800 mb-2">Items Ordered</h3> */}
            <CollapsibleSection title={"Items Ordered"}>

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
            </CollapsibleSection>
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

