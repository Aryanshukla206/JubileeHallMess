// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { useAuth } from './AuthContext';
// import { INITIAL_MENU } from './MenuContext';

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
// const getTodayDate = () => {
//   const today = new Date();
//   return today.toISOString().split('T')[0];
// };

// export const BookingProvider = ({ children }) => {
//   const { currentUser } = useAuth();
//   const [bookings, setBookings] = useState([]);
//   const [guestBookings, setGuestBookings] = useState([]);

//   // Load bookings from localStorage on component mount
//   useEffect(() => {
//     const storedBookings = localStorage.getItem('jubilee_bookings');
//     const storedGuestBookings = localStorage.getItem('jubilee_guest_bookings');

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

//   // Check if a user has already booked a meal for today
//   const hasBookedMeal = (userId, mealType, date = getTodayDate()) => {
//     return bookings.some(
//       booking =>
//         booking.userId === userId &&
//         booking.mealType === mealType &&
//         booking.date === date
//     );
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
//       timestamp: new Date().toISOString()
//     };

//     setBookings(prevBookings => [...prevBookings, newBooking]);
//     return newBooking;
//   };

//   // Add a guest booking
//   const addGuestBooking = (name, contactNumber, mealType, date, quantities) => {
//     // Calculate if booking is made at least 1 hour in advance for discount
//     const bookingTime = new Date();
//     const mealStartTime = new Date(`${date}T${MEALS[mealType].startTime}`);
//     const hourDiff = (mealStartTime - bookingTime) / (1000 * 60 * 60);

//     const hasDiscount = hourDiff >= 1;

//     const newBooking = {
//       id: Date.now().toString(),
//       name,
//       contactNumber,
//       mealType,
//       date,
//       quantities,
//       hasDiscount,
//       discountPercent: hasDiscount ? 10 : 0,
//       timestamp: new Date().toISOString()
//     };

//     setGuestBookings(prevBookings => [...prevBookings, newBooking]);
//     return newBooking;
//   };

//   // Get user's bookings
//   const getUserBookings = (userId) => {
//     return bookings.filter(booking => booking.userId === userId);
//   };

//   // Check if a meal can be booked based on current time
//   const canBookMeal = (mealType, date = getTodayDate()) => {
//     const now = new Date();
//     // const mealEndTime = new Date(`${date}T${MEALS[mealType].endTime}`);
//     const mealEndTime = new Date(`${date}T${"23:00:00"}`);

//     // If date is today, check if current time is before meal end time
//     if (date === getTodayDate()) {
//       return now < mealEndTime;
//     }

//     // If date is in the future, booking is allowed
//     return new Date(date) > now;
//   };

//   // Get bookings for today
//   const getTodayBookings = () => {
//     const today = getTodayDate();
//     return bookings.filter(booking => booking.date === today);
//   };

//   // Get bookings for a specific date
//   const getBookingsByDate = (date) => {
//     return bookings.filter(booking => booking.date === date);
//   };

//   // Get all guest bookings
//   const getAllGuestBookings = () => {
//     return guestBookings;
//   };

//   const value = {
//     meals: MEALS,
//     bookings,
//     guestBookings,
//     hasBookedMeal,
//     addBooking,
//     addGuestBooking,
//     getUserBookings,
//     canBookMeal,
//     getTodayBookings,
//     getBookingsByDate,
//     getAllGuestBookings
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




import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { INITIAL_MENU } from './MenuContext';
import { useMenu } from './MenuContext';

const BookingContext = createContext();


const getDayOfWeek = (dateString) => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[new Date(dateString).getDay()];
};

const getTodayMealItems = (mealType, date = new Date()) => {
  const day = getDayOfWeek(date.toISOString());
  return INITIAL_MENU[day]?.[mealType] || [];
};

// Initial meal data with timing information
const MEALS = {
  breakfast: {
    name: 'Breakfast',
    startTime: '08:00',
    endTime: '09:45',
    items: getTodayMealItems('breakfast')
  },
  lunch: {
    name: 'Lunch',
    startTime: '13:00',
    endTime: '14:00',
    items: getTodayMealItems('lunch')
  },
  dinner: {
    name: 'Dinner',
    startTime: '20:00',
    endTime: '21:00',
    items: getTodayMealItems('dinner')
  }
};

// Generate today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export const BookingProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const getMenuForDate = useMenu();
  const [bookings, setBookings] = useState([]);
  const [guestBookings, setGuestBookings] = useState([]);

  // Load bookings from localStorage on component mount
  useEffect(() => {
    const storedBookings = localStorage.getItem('jubilee_bookings');
    const storedGuestBookings = localStorage.getItem('jubilee_guest_bookings');

    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    }

    if (storedGuestBookings) {
      setGuestBookings(JSON.parse(storedGuestBookings));
    }
  }, []);

  // Save bookings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('jubilee_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('jubilee_guest_bookings', JSON.stringify(guestBookings));
  }, [guestBookings]);

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get bookings for a specific date
  const getBookingsByDate = (date) => {
    return bookings.filter(booking => booking.date === date);
  };

  // Get available items for a specific meal type and date
  const getAvailableItems = (mealType, date = getTodayDate()) => {
    const dayMenu = getMenuForDate(date);
    return dayMenu ? dayMenu[mealType] : [];
  };

  // Check if a user has already booked a meal for today
  const hasBookedMeal = (userId, mealType, date = getTodayDate()) => {
    return bookings.some(
      booking =>
        booking.userId === userId &&
        booking.mealType === mealType &&
        booking.date === date
    );
  };

  // Check if a meal can be booked based on time
  // const canBookMeal = (mealType, date = getTodayDate()) => {
  //   const now = new Date();
  //   const mealTimes = MEALS[mealType];
  //   const [bookingHours, bookingMinutes] = mealTimes.startTime.split(':').map(Number);
  //   const bookingTime = new Date(date);
  //   bookingTime.setHours(bookingHours, bookingMinutes, 0);

  //   // If booking for a future date, always allow
  //   if (new Date(date) > new Date(now.toDateString())) {
  //     return true;
  //   }

  //   // If booking for today, check if it's before the meal start time
  //   if (date === getTodayDate()) {
  //     return now < bookingTime;
  //   }

  //   return false;
  // };
  // Check if a meal can be booked based on current time
  const canBookMeal = (mealType, date = getTodayDate()) => {
    const now = new Date();
    const mealEndTime = new Date(`${date}T${MEALS[mealType].endTime}`);
    // const mealEndTime = new Date(`${date}T${"23:00:00"}`);

    // If date is today, check if current time is before meal end time
    if (date === getTodayDate()) {
      return now < mealEndTime;
    }

    // If date is in the future, booking is allowed
    return new Date(date) > now;
  };

  // Add a new booking
  const addBooking = (mealType, quantities) => {
    if (!currentUser) return null;

    const newBooking = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      mealType,
      date: getTodayDate(),
      quantities,
      status: 'pending',
      timestamp: new Date().toISOString()
    };

    setBookings(prevBookings => [...prevBookings, newBooking]);
    return newBooking;
  };

  // Mark a booking as completed
  const markBookingComplete = (bookingId) => {
    setBookings(prevBookings =>
      prevBookings.map(booking =>
        booking.id === bookingId
          ? { ...booking, status: 'completed' }
          : booking
      )
    );
  };

  // Generate monthly summary report
  const generateMonthlySummary = (month, year) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const monthlyBookings = bookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      return bookingDate >= startDate && bookingDate <= endDate;
    });

    return {
      totalBookings: monthlyBookings.length,
      mealTypeCounts: {
        breakfast: monthlyBookings.filter(b => b.mealType === 'breakfast').length,
        lunch: monthlyBookings.filter(b => b.mealType === 'lunch').length,
        dinner: monthlyBookings.filter(b => b.mealType === 'dinner').length
      },
      itemQuantities: monthlyBookings.reduce((acc, booking) => {
        Object.entries(booking.quantities).forEach(([item, qty]) => {
          acc[item] = (acc[item] || 0) + qty;
        });
        return acc;
      }, {})
    };
  };

  // Generate resident attendance report
  const generateResidentAttendance = (userId, month, year) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const residentBookings = bookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      return booking.userId === userId &&
        bookingDate >= startDate &&
        bookingDate <= endDate;
    });

    const daysInMonth = endDate.getDate();
    const attendance = Array(daysInMonth).fill(false);

    residentBookings.forEach(booking => {
      const day = new Date(booking.date).getDate();
      attendance[day - 1] = true;
    });

    return {
      totalDays: daysInMonth,
      daysPresent: attendance.filter(Boolean).length,
      daysAbsent: attendance.filter(day => !day).length,
      attendance
    };
  };

  // Generate guest bookings report
  const generateGuestBookingsReport = (month, year) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const monthlyGuestBookings = guestBookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      return bookingDate >= startDate && bookingDate <= endDate;
    });

    return {
      totalBookings: monthlyGuestBookings.length,
      totalDiscounts: monthlyGuestBookings.filter(b => b.hasDiscount).length,
      revenue: monthlyGuestBookings.reduce((total, booking) => {
        // Calculate revenue based on items and discount
        const basePrice = Object.values(booking.quantities).reduce((sum, qty) => sum + qty * 50, 0);
        const discount = booking.hasDiscount ? basePrice * 0.1 : 0;
        return total + (basePrice - discount);
      }, 0)
    };
  };

  const value = {
    meals: MEALS,
    bookings,
    guestBookings,
    hasBookedMeal,
    addBooking,
    markBookingComplete,
    getAvailableItems,
    generateMonthlySummary,
    generateResidentAttendance,
    generateGuestBookingsReport,
    canBookMeal,
    getTodayBookings: () => getBookingsByDate(getTodayDate()),
    getBookingsByDate,
    getAllGuestBookings: () => guestBookings
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => {
  return useContext(BookingContext);
};