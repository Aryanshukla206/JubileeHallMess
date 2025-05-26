import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Check, X } from 'lucide-react';
import QuantitySelector from '../common/QuantitySelector';
import { useBookings } from '../../context/BookingContext';
import { useRebates } from '../../context/RebateContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import getTodayDate from '../../utils/getTodayDate';

const MealBookingCard = ({ mealType, date = getTodayDate() }) => {
  // console.log("ddddddddddddddddddd------> ", date);
  const { hasBookedMeal, addBooking, canBookMeal, getAvailableItems } = useBookings();
  const { isUserOnRebate } = useRebates();
  const { currentUser } = useAuth();
  const { success, error } = useToast();

  const [quantities, setQuantities] = useState("");

  const [isBookingEnabled, setIsBookingEnabled] = useState(false);
  const [hasBooked, setHasBooked] = useState(false);
  const [isOnRebate, setIsOnRebate] = useState(false);
  const [isTimeValid, setIsTimeValid] = useState(false);

  const meal = getAvailableItems(mealType, date) || [];
  console.log('MealBookingCard > mealType:', mealType);
  console.log('MealBookingCard > date:', date);
  // console.log('MealBookingCard > items:', meal);

  // Check if booking is possible based on time, rebate status, and existing bookings
  useEffect(() => {
    if (currentUser) {
      const bookedAlready = hasBookedMeal(currentUser._id, mealType, date);
      const onRebate = isUserOnRebate(currentUser._id, date);
      const timeValid = canBookMeal(mealType, date);
      // const timeValid = true; // Temporarily set to true for testing
      console.log("timeValid:", timeValid);

      setHasBooked(bookedAlready);
      setIsOnRebate(onRebate);
      setIsTimeValid(timeValid);

      // Enable booking if: time is valid, not on rebate, and not already booked
      setIsBookingEnabled(timeValid && !onRebate && !bookedAlready);
    }
  }, [currentUser, mealType, date, hasBookedMeal, isUserOnRebate, canBookMeal]);

  const handleQuantityChange = (item, value) => {
    setQuantities(prev => ({
      ...prev,
      [formatMeal(item)]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate at least one item is selected
    const totalItems = Object.values(quantities).reduce((sum, q) => sum + q, 0);
    if (totalItems === 0) {
      error("Please select at least one item");
      return;
    }

    try {
      const booking = addBooking(mealType, quantities);
      if (booking) {
        console.log("Booking successful:", booking);
        success(`${mealType} booked successfully!`);
        setHasBooked(true);
        setIsBookingEnabled(false);
      } else {
        error("Booking failed. Please try again.");
      }
    } catch (err) {
      error(err.message || "Something went wrong");
    }
  };

  const MEAL_TIMES = {
    breakfast: { start: '08:00', end: '09:30' },
    lunch: { start: '13:00', end: '14:30' },
    dinner: { start: '19:00', end: '20:30' }
  };
  const { start, end } = MEAL_TIMES[mealType];

  // Format time to be more readable (e.g., "08:00" -> "8:00 AM")
  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours);
    const period = h >= 12 ? 'PM' : 'AM';
    const formattedHours = h % 12 || 12;
    return `${formattedHours}:${minutes} ${period}`;
  };

  const formatMeal = (meal) => {
    return meal.charAt(0).toUpperCase() + meal.slice(1);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* Card header with meal type and timing */}
      <div className="bg-blue-600 text-white p-4">
        <h3 className="text-xl font-bold">{mealType}</h3>
        <div className="flex items-center mt-2 text-blue-100">
          <Clock size={16} className="mr-1" />
          <span>{formatTime(start)} - {formatTime(end)}</span>
          {/* {console.log(formatTime(start))} */}
          {/* {console.log(formatTime(end))} */}
        </div>
      </div>

      {/* Card body with booking form or status */}
      <div className="p-4">
        {hasBooked ? (
          <div className="flex items-center justify-center p-4 bg-green-50 rounded-md border border-green-200">
            <Check size={20} className="text-green-500 mr-2" />
            <span className="text-green-700 font-medium">Booked for today</span>
          </div>
        ) : isOnRebate ? (
          <div className="flex items-center justify-center p-4 bg-yellow-50 rounded-md border border-yellow-200">
            <Calendar size={20} className="text-yellow-500 mr-2" />
            <span className="text-yellow-700 font-medium">On rebate for this day</span>
          </div>
        ) : !isTimeValid ? (
          <div className="flex items-center justify-center p-4 bg-gray-50 rounded-md border border-gray-200">
            <X size={20} className="text-gray-500 mr-2" />
            <span className="text-gray-700 font-medium">Booking time has passed</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-3">
              {meal.map(item => (
                <QuantitySelector
                  key={item}
                  name={item}
                  quantity={quantities[formatMeal(item)] || 0}
                  setQuantity={(value) => handleQuantityChange(item, value)}
                  disabled={!isBookingEnabled}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={!isBookingEnabled}
              className={`w-full mt-4 p-2 rounded-md font-medium transition-colors
                ${isBookingEnabled
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
            >
              Book Meal
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default MealBookingCard;