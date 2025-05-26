// src/contexts/BookingContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useMenu } from './MenuContext';
import getTodayDate from '../utils/getTodayDate';
import { get } from 'mongoose';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  console.log('⚙️ BookingProvider init');
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
  console.log("------------ >>>>>>  ", getTodayDate())




  const canBookMeal = (mealType, date = getTodayDate()) => {
    console.log("date from getTodayDate ---------> ", date)
    const now = new Date();
    const window = MEAL_TIME_WINDOWS[mealType];
    console.log("canBook meal ------> ", now, window)

    if (!window || !window.end) return false;

    // Parse end time from "HH:MM" format
    const [endH, endM] = window.end.split(':').map(Number);
    // console.log(`Meal end time for ${mealType}: ${endH}:${endM}`);

    // Construct a Date object for meal end time on the given date
    const mealEndTime = new Date();

    // console.log("mealEndTime ------> ", mealEndTime);
    mealEndTime.setHours(endH, endM, 0, 0); // HH, MM, SS, MS
    console.log("mealEndTime ------> ", mealEndTime);

    // console.log(`Checking booking for ${mealType} on ${date} with end time ${mealEndTime.toISOString()}`);

    // If booking is for today
    if (date === getTodayDate()) {
      console.log("------------> ", now < mealEndTime ? "Booking is allowed" : "Booking is not allowed");
      return now < mealEndTime;
    }

    // If booking is for a future date
    const bookingDate = new Date(date);
    const today = new Date(getTodayDate());
    console.log(`Booking date: ${bookingDate.toISOString()}, Today: ${today.toISOString()}`);
    return bookingDate > today;
  };









  console.log("getTodayDate ------> ", getTodayDate());

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
    console.log(currentUser);
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
    console.log("status ------> ", res.status);
    setBookings(prev => [...prev, created]);
    return created;
  };

  // Add guest booking
  const addGuestBooking = async ({ userName, contactNumber, mealType, date, quantities, hasDiscount = true }) => {
    const payload = { userName, contactNumber, mealType, date, quantities, hasDiscount, status: 'pending' };
    const res = await authFetch('/api/guest-bookings', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    const created = await res.json();
    setGuestBookings(prev => [...prev, created]);
    return created;
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

  // Utility: get available menu items
  const getAvailableItems = (mealType, date = getTodayDate()) => {
    const menu = getMenuForDate(date);
    return menu?.[mealType] || [];
  };

  // console.log(getAvailableItems('breakfast', '2023-10-01'));
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
      {!loading && children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => useContext(BookingContext);



// // // src/contexts/BookingContext.js
// // import React, { createContext, useState, useContext, useEffect } from 'react';
// // import { useAuth } from './AuthContext';
// // import { useMenu } from './MenuContext';

// // const BookingContext = createContext();

// // export const BookingProvider = ({ children }) => {
// //   const { authFetch, currentUser } = useAuth();
// //   const getMenuForDate = useMenu();

// //   const [bookings, setBookings] = useState([]);
// //   const [guestBookings, setGuestBookings] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   // Utility: today's date in YYYY-MM-DD
// //   const getTodayDate = () => new Date().toISOString().split('T')[0];

// //   // Fetch both resident and guest bookings once authenticated
// //   useEffect(() => {
// //     if (!currentUser) return;

// //     const fetchAll = async () => {
// //       try {
// //         const [res1, res2] = await Promise.all([
// //           authFetch('/api/bookings'),
// //           authFetch('/api/guest-bookings')
// //         ]);
// //         const [bData, gbData] = await Promise.all([res1.json(), res2.json()]);
// //         setBookings(bData);
// //         setGuestBookings(gbData);
// //       } catch (err) {
// //         console.error('Error loading bookings', err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchAll();
// //   }, [currentUser, authFetch]);

// //   // Get bookings filtered by date
// //   const getBookingsByDate = date =>
// //     bookings.filter(b => b.date.split('T')[0] === date);

// //   const getGuestBookingsByDate = date =>
// //     guestBookings.filter(gb => gb.date.split('T')[0] === date);

// //   // Check if a user has booked
// //   const hasBookedMeal = (userId, mealType, date = getTodayDate()) =>
// //     bookings.some(b => b.userId === userId &&
// //       b.mealType === mealType &&
// //       b.date.split('T')[0] === date);

// //   const guestHasBookedMeal = (mealType, date = getTodayDate()) =>
// //     guestBookings.some(gb => gb.mealType === mealType &&
// //       gb.date.split('T')[0] === date);

// //   // Add resident booking
// //   const addBooking = async (mealType, quantities, date = getTodayDate()) => {
// //     if (!currentUser) return null;
// //     const payload = {
// //       userId: currentUser.id,
// //       userName: currentUser.name,
// //       contactNumber: currentUser.contactNumber || '',
// //       mealType,
// //       date,
// //       quantities,
// //       hasDiscount: false,
// //       status: 'pending'
// //     };
// //     const res = await authFetch('/api/bookings', {
// //       method: 'POST',
// //       body: JSON.stringify(payload)
// //     });
// //     const created = await res.json();
// //     setBookings(prev => [...prev, created]);
// //     return created;
// //   };

// //   // Add guest booking
// //   const addGuestBooking = async ({ userName, contactNumber, mealType, date = getTodayDate(), quantities, hasDiscount = true }) => {
// //     const payload = { userName, contactNumber, mealType, date, quantities, hasDiscount, status: 'pending' };
// //     const res = await authFetch('/api/guest-bookings', {
// //       method: 'POST',
// //       body: JSON.stringify(payload)
// //     });
// //     const created = await res.json();
// //     setGuestBookings(prev => [...prev, created]);
// //     return created;
// //   };

// //   // Mark resident booking complete
// //   const markBookingComplete = async id => {
// //     const res = await authFetch(`/api/bookings/${id}`, {
// //       method: 'PUT',
// //       body: JSON.stringify({ status: 'completed' })
// //     });
// //     const updated = await res.json();
// //     setBookings(prev =>
// //       prev.map(b => (b._id === updated._id ? updated : b))
// //     );
// //     return updated;
// //   };

// //   // Utility: get available menu items
// //   const getAvailableItems = (mealType, date = getTodayDate()) => {
// //     const menu = getMenuForDate(date);
// //     return menu?.[mealType] || [];
// //   };

// //   // Reports…
// //   const generateMonthlySummary = (month, year) => {
// //     const start = new Date(year, month - 1, 1);
// //     const end = new Date(year, month, 0);
// //     const monthly = bookings.filter(b => {
// //       const d = new Date(b.date);
// //       return d >= start && d <= end;
// //     });
// //     return {
// //       totalBookings: monthly.length,
// //       counts: {
// //         breakfast: monthly.filter(b => b.mealType === 'breakfast').length,
// //         lunch: monthly.filter(b => b.mealType === 'lunch').length,
// //         dinner: monthly.filter(b => b.mealType === 'dinner').length
// //       },
// //       itemTotals: monthly.reduce((acc, b) => {
// //         Object.entries(b.quantities).forEach(([item, qty]) => {
// //           acc[item] = (acc[item] || 0) + qty;
// //         });
// //         return acc;
// //       }, {})
// //     };
// //   };

// //   const value = {
// //     bookings,
// //     guestBookings,
// //     loading,
// //     getBookingsByDate,
// //     getGuestBookingsByDate,
// //     hasBookedMeal,
// //     guestHasBookedMeal,
// //     addBooking,
// //     addGuestBooking,
// //     markBookingComplete,
// //     getAvailableItems,
// //     generateMonthlySummary
// //   };

// //   return (
// //     <BookingContext.Provider value={value}>
// //       {!loading && children}
// //     </BookingContext.Provider>
// //   );
// // };

// // export const useBookings = () => useContext(BookingContext);
// import React, { createContext, useState, useContext, useEffect } from 'react';

// import { useAuth } from './AuthContext';
// import { INITIAL_MENU } from './MenuContext';
// import { useMenu } from './MenuContext';

// const BookingContext = createContext();


// const getDayOfWeek = (dateString) => {
//   const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
//   return days[new Date(dateString).getDay()];
// };

// const getTodayMealItems = (mealType, date = new Date()) => {
//   const day = getDayOfWeek(date.toISOString());
//   return INITIAL_MENU[day]?.[mealType] || [];
// };

// // Initial meal data with timing information
// const MEALS = {
//   breakfast: {
//     name: 'Breakfast',
//     startTime: '08:00',
//     endTime: '09:45',
//     items: getTodayMealItems('breakfast')
//   },
//   lunch: {
//     name: 'Lunch',
//     startTime: '13:00',
//     endTime: '14:00',
//     items: getTodayMealItems('lunch')
//   },
//   dinner: {
//     name: 'Dinner',
//     startTime: '20:00',
//     endTime: '21:00',
//     items: getTodayMealItems('dinner')
//   }
// };

// // Generate today's date in YYYY-MM-DD format
// // const getTodayDate = () => {
// //   const today = new Date();
// //   return today.toISOString().split('T')[0];
// // };

// export const BookingProvider = ({ children }) => {
//   const { currentUser } = useAuth();
//   const getMenuForDate = useMenu();
//   const [bookings, setBookings] = useState([]);
//   const [guestBookings, setGuestBookings] = useState([]);

//   // Load bookings from localStorage on component mount
//   useEffect(() => {
//     const storedBookings = localStorage.getItem('jubilee_bookings');
//     const storedGuestBookings = localStorage.getItem('jubilee_guest_bookings');
//     console.log(storedGuestBookings)

//     if (storedBookings) {
//       setBookings(JSON.parse(storedBookings));
//     }

//     if (storedGuestBookings) {
//       setGuestBookings(JSON.parse(storedGuestBookings));
//     }
//   }, []);

//   // Save bookings to localStorage whenever they change
//   useEffect(() => {
//     localStorage.setItem('jubilee_bookings', JSON.stringify(bookings));
//   }, [bookings]);

//   useEffect(() => {
//     localStorage.setItem('jubilee_guest_bookings', JSON.stringify(guestBookings));
//   }, [guestBookings]);

//   // Get today's date in YYYY-MM-DD format
//   const getTodayDate = () => {
//     const today = new Date();
//     return today.toISOString().split('T')[0];
//   };

//   // Get bookings for a specific date
//   const getBookingsByDate = (date) => {
//     return bookings.filter(booking => booking.date === date);
//   };
//   const getGuestBookingsByDate = (date) => {
//     return guestBookings.filter(guestBookings => guestBookings.date === date);
//   };

//   // Get available items for a specific meal type and date
//   const getAvailableItems = (mealType, date = getTodayDate()) => {
//     const dayMenu = getMenuForDate(date);
//     return dayMenu ? dayMenu[mealType] : [];
//   };

//   // Check if a user has already booked a meal for today
//   const hasBookedMeal = (userId, mealType, date = getTodayDate()) => {
//     return bookings.some(
//       booking =>
//         booking.userId === userId &&
//         booking.mealType === mealType &&
//         booking.date === date
//     );
//   };
//   const GuesthasBookedMeal = (userId, mealType, date = getTodayDate()) => {
//     return guestBookings.some(
//       guestBookings =>
//         guestBookings.userId === userId &&
//         guestBookings.mealType === mealType &&
//         guestBookings.date === date
//     );
//   };

//   // Check if a meal can be booked based on time
//   // const canBookMeal = (mealType, date = getTodayDate()) => {
//   //   const now = new Date();
//   //   const mealTimes = MEALS[mealType];
//   //   const [bookingHours, bookingMinutes] = mealTimes.startTime.split(':').map(Number);
//   //   const bookingTime = new Date(date);
//   //   bookingTime.setHours(bookingHours, bookingMinutes, 0);

//   //   // If booking for a future date, always allow
//   //   if (new Date(date) > new Date(now.toDateString())) {
//   //     return true;
//   //   }

//   //   // If booking for today, check if it's before the meal start time
//   //   if (date === getTodayDate()) {
//   //     return now < bookingTime;
//   //   }

//   //   return false;
//   // };
//   // Check if a meal can be booked based on current time
//   const canBookMeal = (mealType, date = getTodayDate()) => {
//     const now = new Date();
//     const mealEndTime = new Date(`${date}T${MEALS[mealType].endTime}`);
//     // const mealEndTime = new Date(`${date}T${"23:00:00"}`);

//     // If date is today, check if current time is before meal end time
//     if (date === getTodayDate()) {
//       return now < mealEndTime;
//     }

//     // If date is in the future, booking is allowed
//     return new Date(date) > now;
//   };

//   // Add a new booking
//   const addBooking = (mealType, quantities) => {
//     if (!currentUser) return null;

//     const newBooking = {
//       id: Date.now().toString(),
//       userId: currentUser.id,
//       userName: currentUser.name,
//       mealType,
//       date: getTodayDate(),
//       quantities,
//       status: 'pending',
//       timestamp: new Date().toISOString()
//     };

//     setBookings(prevBookings => [...prevBookings, newBooking]);
//     return newBooking;
//   };

//   const addGuestBooking = (name, contactNumber, mealType, date, quantities) => {
//     // console.log(currentUser)
//     console.log(name, contactNumber, mealType, date, quantities);
//     const newGuestBooking = {
//       id: Date.now().toString(),
//       // userId: currentUser.id,
//       userName: name, // Using the passed name parameter
//       contactNumber, // Adding the contactNumber to the booking
//       mealType,
//       date: date || getTodayDate(), // Use passed date or fallback to today
//       quantities,
//       hasDiscount: true, // Default value, can be calculated if needed
//       status: 'pending',
//       timestamp: new Date().toISOString()
//     };

//     setGuestBookings(prevGuestBookings => [...prevGuestBookings, newGuestBooking]);
//     console.log(newGuestBooking);
//     return newGuestBooking;
//   };

//   // Mark a booking as completed
//   const markBookingComplete = (bookingId) => {
//     setBookings(prevBookings =>
//       prevBookings.map(booking =>
//         booking.id === bookingId
//           ? { ...booking, status: 'completed' }
//           : booking
//       )
//     );
//   };

//   // Generate monthly summary report
//   const generateMonthlySummary = (month, year) => {
//     const startDate = new Date(year, month - 1, 1);
//     const endDate = new Date(year, month, 0);

//     const monthlyBookings = bookings.filter(booking => {
//       const bookingDate = new Date(booking.date);
//       return bookingDate >= startDate && bookingDate <= endDate;
//     });

//     return {
//       totalBookings: monthlyBookings.length,
//       mealTypeCounts: {
//         breakfast: monthlyBookings.filter(b => b.mealType === 'breakfast').length,
//         lunch: monthlyBookings.filter(b => b.mealType === 'lunch').length,
//         dinner: monthlyBookings.filter(b => b.mealType === 'dinner').length
//       },
//       itemQuantities: monthlyBookings.reduce((acc, booking) => {
//         Object.entries(booking.quantities).forEach(([item, qty]) => {
//           acc[item] = (acc[item] || 0) + qty;
//         });
//         return acc;
//       }, {})
//     };
//   };

//   // Generate resident attendance report
//   const generateResidentAttendance = (userId, month, year) => {
//     const startDate = new Date(year, month - 1, 1);
//     const endDate = new Date(year, month, 0);

//     const residentBookings = bookings.filter(booking => {
//       const bookingDate = new Date(booking.date);
//       return booking.userId === userId &&
//         bookingDate >= startDate &&
//         bookingDate <= endDate;
//     });

//     const daysInMonth = endDate.getDate();
//     const attendance = Array(daysInMonth).fill(false);

//     residentBookings.forEach(booking => {
//       const day = new Date(booking.date).getDate();
//       attendance[day - 1] = true;
//     });

//     return {
//       totalDays: daysInMonth,
//       daysPresent: attendance.filter(Boolean).length,
//       daysAbsent: attendance.filter(day => !day).length,
//       attendance
//     };
//   };

//   // Generate guest bookings report
//   const generateGuestBookingsReport = (month, year) => {
//     const startDate = new Date(year, month - 1, 1);
//     const endDate = new Date(year, month, 0);

//     const monthlyGuestBookings = guestBookings.filter(booking => {
//       const bookingDate = new Date(booking.date);
//       return bookingDate >= startDate && bookingDate <= endDate;
//     });

//     return {
//       totalBookings: monthlyGuestBookings.length,
//       totalDiscounts: monthlyGuestBookings.filter(b => b.hasDiscount).length,
//       revenue: monthlyGuestBookings.reduce((total, booking) => {
//         // Calculate revenue based on items and discount
//         const basePrice = Object.values(booking.quantities).reduce((sum, qty) => sum + qty * 50, 0);
//         const discount = booking.hasDiscount ? basePrice * 0.1 : 0;
//         return total + (basePrice - discount);
//       }, 0)
//     };
//   };

//   const value = {
//     meals: MEALS,
//     bookings,
//     guestBookings,
//     hasBookedMeal,
//     addBooking,
//     addGuestBooking,
//     GuesthasBookedMeal,
//     getGuestBookingsByDate,
//     markBookingComplete,
//     getAvailableItems,
//     generateMonthlySummary,
//     generateResidentAttendance,
//     generateGuestBookingsReport,
//     canBookMeal,
//     getTodayBookings: () => getBookingsByDate(getTodayDate()),
//     getBookingsByDate,
//     getAllGuestBookings: () => guestBookings,
//   };

//   return (
//     <BookingContext.Provider value={value}>
//       {children}
//     </BookingContext.Provider>
//   );
// };

// export const useBookings = () => {
//   return useContext(BookingContext);
// };


// // // import React, { createContext, useState, useContext, useEffect } from 'react';
// // // import axios from 'axios';
// // // import { useAuth } from './AuthContext';

// // // const BookingContext = createContext();

// // // const API_URL = 'http://localhost:3000/api';

// // // export const BookingProvider = ({ children }) => {
// // //   const { currentUser } = useAuth();
// // //   const [bookings, setBookings] = useState([]);

// // //   const authHeader = {
// // //     headers: {
// // //       Authorization: `Bearer ${currentUser?.token}`,
// // //     },
// // //   };

// // //   useEffect(() => {
// // //     if (currentUser) {
// // //       fetchBookings();
// // //     }
// // //   }, [currentUser]);

// // //   const fetchBookings = async () => {
// // //     try {
// // //       const { data } = await axios.get(
// // //         `${API_URL}/bookings/my`,
// // //         authHeader
// // //       );
// // //       setBookings(data);
// // //     } catch (error) {
// // //       console.error('Error fetching bookings:', error);
// // //     }
// // //   };

// // //   const addBooking = async (mealType, quantities, isVegetarian) => {
// // //     try {
// // //       const { data } = await axios.post(
// // //         `${API_URL}/bookings`,
// // //         {
// // //           mealType,
// // //           quantities,
// // //           isVegetarian,
// // //           date: new Date().toISOString(),
// // //         },
// // //         authHeader
// // //       );
// // //       setBookings([...bookings, data]);
// // //       return data;
// // //     } catch (error) {
// // //       throw new Error(error.response?.data?.message || 'Failed to create booking');
// // //     }
// // //   };

// // //   const getBookingsByDate = async (date) => {
// // //     try {
// // //       const { data } = await axios.get(
// // //         `${API_URL}/bookings?date=${date}`,
// // //         authHeader
// // //       );
// // //       return data;
// // //     } catch (error) {
// // //       console.error('Error fetching bookings by date:', error);
// // //       return [];
// // //     }
// // //   };

// // //   const markBookingComplete = async (bookingId) => {
// // //     try {
// // //       const { data } = await axios.put(
// // //         `${API_URL}/bookings/${bookingId}`,
// // //         { status: 'completed' },
// // //         authHeader
// // //       );
// // //       setBookings(bookings.map(b => b._id === bookingId ? data : b));
// // //     } catch (error) {
// // //       throw new Error(error.response?.data?.message || 'Failed to update booking');
// // //     }
// // //   };

// // //   const value = {
// // //     bookings,
// // //     addBooking,
// // //     getBookingsByDate,
// // //     markBookingComplete,
// // //   };

// // //   return (
// // //     <BookingContext.Provider value={value}>
// // //       {children}
// // //     </BookingContext.Provider>
// // //   );
// // // };

// // // export const useBookings = () => {
// // //   return useContext(BookingContext);
// // // };