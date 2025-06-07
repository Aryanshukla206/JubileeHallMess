// src/contexts/BookingContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useMenu } from './MenuContext';
import getTodayDate from '../utils/getTodayDate';
import { get } from 'mongoose';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  //console.log('⚙️ BookingProvider init');
  const { authFetch, currentUser } = useAuth();
  const { getMenuForDate } = useMenu();

  const [bookings, setBookings] = useState([]);
  const [guestBookings, setGuestBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const MEAL_TIME_WINDOWS = {
    breakfast: { start: '07:00', end: '09:00' },
    lunch: { start: '12:00', end: '14:00' },
    dinner: { start: '19:00', end: '21:00' }
  };
  // Utility: today's date in YYYY-MM-DD
  // const getTodayDate = () => {
  //   return formatInTimeZone(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd');
  // };
  //console.log("------------ >>>>>>  ", getTodayDate())




  const canBookMeal = (mealType, date = getTodayDate()) => {
    //console.log("date from getTodayDate ---------> ", date)
    const now = new Date();
    const window = MEAL_TIME_WINDOWS[mealType];
    //console.log("canBook meal ------> ", now, window)

    if (!window || !window.end) return false;

    // Parse end time from "HH:MM" format
    const [endH, endM] = window.end.split(':').map(Number);
    // //console.log(`Meal end time for ${mealType}: ${endH}:${endM}`);

    // Construct a Date object for meal end time on the given date
    const mealEndTime = new Date();

    // //console.log("mealEndTime ------> ", mealEndTime);
    mealEndTime.setHours(endH, endM, 0, 0); // HH, MM, SS, MS
    //console.log("mealEndTime ------> ", mealEndTime);

    // //console.log(`Checking booking for ${mealType} on ${date} with end time ${mealEndTime.toISOString()}`);

    // If booking is for today
    if (date === getTodayDate()) {
      // //console.log("------------> ", now < mealEndTime ? "Booking is allowed" : "Booking is not allowed");
      return now < mealEndTime;
    }

    // If booking is for a future date
    const bookingDate = new Date(date);
    const today = new Date(getTodayDate());
    // //console.log(`Booking date: ${bookingDate.toISOString()}, Today: ${today.toISOString()}`);
    return bookingDate > today;
  };









  // //console.log("getTodayDate ------> ", getTodayDate());

  // Fetch both resident and guest bookings once authenticated
  useEffect(() => {
    if (!currentUser) return;

    const fetchAll = async () => {
      try {
        const [res1, res2] = await Promise.all([
          authFetch('/api/bookings'),
          authFetch('/api/guest-bookings')
        ]);
        const [bData, gbData] = await Promise.all([res1.json(), res2.json()]);
        setBookings(bData);
        setGuestBookings(gbData);
      } catch (err) {
        console.error('Error loading bookings', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [currentUser, authFetch]);

  // Get bookings filtered by date
  const getBookingsByDate = date =>
    bookings.filter(b => b.date.split('T')[0] === date);

  const getGuestBookingsByDate = date =>
    guestBookings.filter(gb => gb.date.split('T')[0] === date);

  // Check if a user has booked
  const hasBookedMeal = (userId, mealType, date = getTodayDate()) =>
    bookings.some(b => b.userId === userId &&
      b.mealType === mealType &&
      b.date.split('T')[0] === date);

  const guestHasBookedMeal = (mealType, date = getTodayDate()) =>
    guestBookings.some(gb => gb.mealType === mealType &&
      gb.date.split('T')[0] === date);

  // Add resident booking
  const addBooking = async (mealType, quantities, date = getTodayDate()) => {
    if (!currentUser) return null;
    // //console.log(currentUser);
    const payload = {
      userId: currentUser._id,
      userName: currentUser.name,
      contactNumber: currentUser.email || currentUser.contactNumber || '',
      mealType,
      date,
      quantities,
      hasDiscount: false,
      status: 'pending'
    };
    const res = await authFetch('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    const created = await res.json();
    // //console.log("status ------> ", res.status);
    setBookings(prev => [...prev, created]);
    return created;
  };

  // Add guest booking
  const addGuestBooking = async ({ userName, contactNumber, mealType, date, quantities, discount, isGuest }) => {
    const payload = {
      userName,
      contactNumber,
      mealType,
      date,
      quantities,
      discount,
      status: 'pending',
      isGuest: 'true'
    };

    console.log({ payload }, "from addGuestBooking");

    try {
      const res = await fetch('http://localhost:3000/api/guest-bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      console.log(res, "from addGuestBooking res------>");

      // Check if response is OK
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const created = await res.json();

      // Add created booking to state
      setGuestBookings(prev => [...prev, created]);

      return created;
    } catch (error) {
      console.error("Error adding guest booking:", error);
      return null;  // Or you can throw error again if you want caller to handle
    }
  };


  // Mark resident booking complete
  const markBookingComplete = async id => {
    const res = await authFetch(`/api/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'completed' })
    });
    const updated = await res.json();
    setBookings(prev =>
      prev.map(b => (b._id === updated._id ? updated : b))
    );
    return updated;
  };
  // Mark resident booking complete
  const markGuestBookingComplete = async id => {
    const res = await authFetch(`/api/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'completed' })
    });
    const updated = await res.json();
    setBookings(prev =>
      prev.map(b => (b._id === updated._id ? updated : b))
    );
    return updated;
  };

  // Utility: get available menu items
  const getAvailableItems = (mealType, date) => {
    console.log(date, "from booking");
    const menu = getMenuForDate(date);
    console.log(mealType, date, menu, "From Booking Context fn getAvailable Items")
    return menu?.[mealType] || [];
  };

  // //console.log(getAvailableItems('breakfast', '2023-10-01'));
  // Reports…
  const generateMonthlySummary = (month, year) => {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);
    const monthly = bookings.filter(b => {
      const d = new Date(b.date);
      return d >= start && d <= end;
    });
    return {
      totalBookings: monthly.length,
      counts: {
        breakfast: monthly.filter(b => b.mealType === 'breakfast').length,
        lunch: monthly.filter(b => b.mealType === 'lunch').length,
        dinner: monthly.filter(b => b.mealType === 'dinner').length
      },
      itemTotals: monthly.reduce((acc, b) => {
        Object.entries(b.quantities).forEach(([item, qty]) => {
          acc[item] = (acc[item] || 0) + qty;
        });
        return acc;
      }, {})
    };
  };

  const value = {
    bookings,
    guestBookings,
    loading,
    getTodayDate,
    canBookMeal,
    getBookingsByDate,
    getGuestBookingsByDate,
    hasBookedMeal,
    guestHasBookedMeal,
    addBooking,
    addGuestBooking,
    markBookingComplete,
    getAvailableItems,
    generateMonthlySummary
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => useContext(BookingContext);

