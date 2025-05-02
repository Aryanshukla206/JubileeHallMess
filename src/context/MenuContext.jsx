import React, { createContext, useState, useContext, useEffect } from 'react';

const MenuContext = createContext();

// Initial menu data

export const INITIAL_MENU = {
  monday: {
    breakfast: ['Lunch Pack: Paratha, Paneer Bhurji', 'Bread', 'Aloo Sandwich/Grilled Sandwich', 'Jam', 'Banana/Omelette', 'Milk', 'Tea'],
    lunch: ['Bhindi Fry', 'Rice', 'Lal Masoor Dal', 'Chapati', 'Hari Chutney', 'Salad', 'Curd Rice'],
    dinner: ['Matar Paneer / Egg Curry OR Fish Fry (Alt)', 'Rice', 'Arhar Dal', 'Chapati', 'Salad', 'Dessert: Rooh-Afza Milk']
  },
  tuesday: {
    breakfast: ['Lunch Pack: Aloo Matar and Paratha', 'Aalu-Pyaaz / Paneer Pyaaz (Alt) Paratha', 'Curd', 'Tea', 'Achaar', 'Chutney', 'Ketchup'],
    lunch: ['Matar Pattagobhi', 'Rice', 'Arhar Dal', 'Chapati', 'Salad', 'Chaach'],
    dinner: ['Mix Veg', 'Veg Pulao / (Rasam Rice & Papad)', 'Rajma', 'Chapati', 'Salad', 'Laal Chutney', 'Dessert: Chilled Kheer / Sewai']
  },
  wednesday: {
    breakfast: ['Lunch Pack: Bhindi Fry, Roti', 'Idli', 'Coconut-Peanut Chutney', 'Sambar', 'Mango Shake'],
    lunch: ['Brinjal Masala', 'Rice', 'Palak Dal', 'Chapati', 'Salad', 'Curd Rice'],
    dinner: ['Kadai Paneer', 'Chicken Kadai', 'Rice', 'Arhar Dal', 'Chapati', 'Salad', 'Dessert: Ice Cream [Vanilla, American nut, Butterscotch]']
  },
  thursday: {
    breakfast: ['Lunch Pack: Sookhe Chole, Puri', 'Gobhi Paratha', 'Achaar', 'Curd', 'Chutney', 'Tea'],
    lunch: ['Kadhi Pakora', 'Tamatar Pyaaz Curry', 'Rice', 'Chapati', 'Salad', 'Rooh-Afza Milk'],
    dinner: ['Mango Pyaaz Curry', 'Dal Fry', 'Chapati', 'Salad', 'Tamarind/Lemon Rice', 'Dessert: Gulab Jamun']
  },
  friday: {
    breakfast: ['Lunch Pack: Matar Pattagobhi, Paratha', 'Upma Chana', 'Tamatar Chutney', 'Boiled Egg / Banana', 'Daliya', 'Chocolate Shake', 'Tomato Sauce'],
    lunch: ['Aloo Matar Gobhi Masala Sabji', 'Kali Masoor Dal', 'Salad', 'Rice', 'Chapati', 'Chhach'],
    dinner: ['Chicken Fry Piece Biryani & Paneer Biryani', 'Mirchi Ka Salan', 'Rajma', 'Chapati', 'Boondi Raita', 'Salad', 'Dessert: Cold Drinks']
  },
  saturday: {
    breakfast: ['Lunch Pack: Aloo Bhujia, Roti', 'Sambar Vada', 'Coconut-Peanut Chutney', 'Fruitchat', 'Milk'],
    lunch: ['Khichdi', 'Aloo-Chokha', 'Lobia', 'Dahi', 'Papad', 'Chapati', 'Salad'],
    dinner: ['Aloo Methi / Karela Fry', 'Dal Makhni', 'Chapati', 'Rice', 'Tamatar Chutney', 'Salad', 'Dessert: Badam Shake']
  },
  sunday: {
    breakfast: ['Lunch Pack: NIL', '(Paneer Chilla, Moong-Dal Pakode) / (Dosa Alt)', 'Coconut-Peanut Chutney', 'Rasam', 'Banana Shake'],
    lunch: ['Chhole', 'Palak Puri', 'Bhature', 'Pumpkin', 'Rice', 'Salad', 'Dahi Papdi', 'Imli Chutney'],
    dinner: ['Paneer Bhurji and Chicken Gravy Roast / Mutton Curry (Alt)', 'Chapati', 'Tomato Rice', 'Moong-Masoor Dal', 'Pacchipulusu', 'Salad', 'Dessert: Shahi Tukda / Double Ka Meetha']
  }
};


// Off-days data
const INITIAL_OFF_DAYS = [
  {
    date: '2025-01-01',
    reason: 'New Year Holiday'
  },
  {
    date: '2025-01-26',
    reason: 'Republic Day'
  }
];

export const MenuProvider = ({ children }) => {
  const [menu, setMenu] = useState(INITIAL_MENU);
  const [offDays, setOffDays] = useState(INITIAL_OFF_DAYS);

  // Load menu and off-days from localStorage on component mount
  useEffect(() => {
    const storedMenu = localStorage.getItem('jubilee_menu');
    const storedOffDays = localStorage.getItem('jubilee_off_days');

    if (storedMenu) {
      setMenu(JSON.parse(storedMenu));
    }

    if (storedOffDays) {
      setOffDays(JSON.parse(storedOffDays));
    }
  }, []);

  // Save menu and off-days to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('jubilee_menu', JSON.stringify(menu));
  }, [menu]);

  useEffect(() => {
    localStorage.setItem('jubilee_off_days', JSON.stringify(offDays));
  }, [offDays]);

  // Update menu for a specific day and meal
  const updateMenu = (day, mealType, dishes) => {
    setMenu(prevMenu => ({
      ...prevMenu,
      [day]: {
        ...prevMenu[day],
        [mealType]: dishes
      }
    }));
  };

  // Add a new off-day
  const addOffDay = (date, reason) => {
    setOffDays(prevOffDays => [
      ...prevOffDays,
      { date, reason }
    ]);
  };

  // Remove an off-day
  const removeOffDay = (date) => {
    setOffDays(prevOffDays =>
      prevOffDays.filter(offDay => offDay.date !== date)
    );
  };

  // Check if a date is an off-day
  const isOffDay = (date) => {
    return offDays.some(offDay => offDay.date === date);
  };

  // Get off-day reason
  const getOffDayReason = (date) => {
    const offDay = offDays.find(offDay => offDay.date === date);
    return offDay ? offDay.reason : null;
  };

  // Get day of week from date
  const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[date.getDay()];
  };

  // Get menu for a specific date
  const getMenuForDate = (dateString) => {
    const day = getDayOfWeek(dateString);
    return menu[day];
  };

  const value = {
    menu,
    offDays,
    updateMenu,
    addOffDay,
    removeOffDay,
    isOffDay,
    getOffDayReason,
    getMenuForDate
  };

  return (
    <MenuContext.Provider value={value}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  return useContext(MenuContext);
};