// src/contexts/MenuContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  // console.log('⚙️ MenuProvider init');
  const { authFetch, currentUser } = useAuth();
  const [menu, setMenu] = useState(null);
  const [offDays, setOffDays] = useState([]);
  const [loading, setLoading] = useState(true);

  // Utility: day-of-week string
  const getDayOfWeek = dateString => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[new Date(dateString).getDay()];
  };

  // Fetch menu + off-days from API once user is authenticated
  useEffect(() => {
    if (!currentUser) return;
    const fetchAll = async () => {
      try {
        const [mRes, oRes] = await Promise.all([
          authFetch('/api/menu'),
          authFetch('/api/off-days'),
        ]);
        // console.log(mRes, "mRes from menu");
        const [mData, oData] = await Promise.all([mRes.json(), oRes.json()]);
        setMenu(mData);
        setOffDays(oData);
      } catch (err) {
        console.error('Error loading menu data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [currentUser, authFetch]);

  // Update entire menu
  const updateMenu = async updatedMenu => {
    const res = await authFetch('/api/menu', {
      method: 'PUT',
      body: JSON.stringify(updatedMenu),
    });
    const updated = await res.json();
    setMenu(updated);
    return updated;
  };

  // Update just one day/meal
  const updateDayMeal = async (day, mealType, dishes) => {
    const updatedMenu = { ...menu, [day]: { ...menu[day], [mealType]: dishes } };
    return updateMenu(updatedMenu);
  };

  // Add an off-day
  const addOffDay = async (date, reason) => {
    // console.log(date, reason, "date and reason from addOffDay");
    // payload = { payload, reason };
    const res = await authFetch('/api/off-days', {
      method: 'POST',
      body: JSON.stringify({ date, reason }),
    });
    const created = await res.json();
    setOffDays(prev => [...prev, created]);
    return created;
  };

  // Remove an off-day by its Mongo _id
  const removeOffDay = async _id => {
    await authFetch(`/api/off-days/${_id}`, { method: 'DELETE' });
    setOffDays(prev => prev.filter(d => d._id !== _id));
  };

  // Helpers
  const isOffDay = date => {
    // console.log('isOffDay checking:', date);
    return offDays.some(d => d.date.split('T')[0] === date);
  };

  const getOffDayReason = date => {
    const d = offDays.find(d => d.date.split('T')[0] === date);
    // console.log('getOffDayReason:', date, '=>', d?.reason);
    return d ? d.reason : null;
  };

  const getMenuForDate = dateString => {
    if (!menu) return null;
    const dow = getDayOfWeek(dateString);
    // console.log('MenuContext > getMenuForDate:', dateString, '=>', dow, menu[dow]);
    return menu[dow] || null;
  };
  const value = {
    menu,
    offDays,
    loading,
    updateMenu,
    updateDayMeal,
    addOffDay,
    removeOffDay,
    isOffDay,
    getOffDayReason,
    getMenuForDate,
  }

  return (
    <MenuContext.Provider value={value}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => useContext(MenuContext);