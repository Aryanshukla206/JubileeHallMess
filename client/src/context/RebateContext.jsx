// src/contexts/RebateContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const RebateContext = createContext();

export const RebateProvider = ({ children }) => {
  const { authFetch, currentUser } = useAuth();
  const [rebates, setRebates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all rebates once user is authenticated
  useEffect(() => {
    if (!currentUser) return;
    // console.log(currentUser)

    const fetchRebates = async () => {
      try {
        const res = await authFetch('/api/rebates');
        const data = await res.json();
        setRebates(data);
      } catch (err) {
        console.error('Error loading rebates', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRebates();
  }, [currentUser, authFetch]);

  // Apply for a rebate (resident)
  const applyForRebate = async ({ startDate, endDate, reason }) => {
    if (!currentUser) return null;
    const payload = {
      id: currentUser.id, // Use _id from currentUser
      userId: currentUser._id,
      userName: currentUser.name,
      startDate,
      endDate,
      reason,
      status: 'pending'
    };
    const res = await authFetch('/api/rebates', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    const created = await res.json();
    setRebates(prev => [...prev, created]);
    return created;
  };


  // Approve a rebate (admin)
  const approveRebate = async id => {
    const res = await authFetch(`/api/rebates/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'approved' })
    });
    const updated = await res.json();
    setRebates(prev => prev.map(r => (r._id === updated._id ? updated : r)));
    return updated;
  };

  // Reject a rebate (admin)
  const rejectRebate = async id => {
    const res = await authFetch(`/api/rebates/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'rejected' })
    });
    const updated = await res.json();
    setRebates(prev => prev.map(r => (r._id === updated._id ? updated : r)));
    return updated;
  };

  // Selectors
  const getUserRebates = userId =>
    rebates.filter(r => r.userId === userId);

  const getPendingRebates = () =>
    rebates.filter(r => r.status === 'pending');

  const getApprovedRebates = () =>
    rebates.filter(r => r.status === 'approved');

  const isUserOnRebate = (userId, date) =>
    rebates.some(r =>
      r.userId === userId &&
      r.status === 'approved' &&
      new Date(date) >= new Date(r.startDate) &&
      new Date(date) <= new Date(r.endDate)
    );

  return (
    <RebateContext.Provider value={{
      rebates,
      loading,
      applyForRebate,
      approveRebate,
      rejectRebate,
      getUserRebates,
      getPendingRebates,
      getApprovedRebates,
      isUserOnRebate
    }}>
      {children}
    </RebateContext.Provider>
  );
};

export const useRebates = () => useContext(RebateContext);