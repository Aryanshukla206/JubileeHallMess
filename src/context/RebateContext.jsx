import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const RebateContext = createContext();

export const RebateProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [rebates, setRebates] = useState([]);

  // Load rebates from localStorage on component mount
  useEffect(() => {
    const storedRebates = localStorage.getItem('jubilee_rebates');
    
    if (storedRebates) {
      setRebates(JSON.parse(storedRebates));
    }
  }, []);

  // Save rebates to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('jubilee_rebates', JSON.stringify(rebates));
  }, [rebates]);

  // Apply for a rebate
  const applyForRebate = (startDate, endDate, reason) => {
    if (!currentUser) return null;
    
    const newRebate = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      startDate,
      endDate,
      reason,
      status: 'pending',
      appliedAt: new Date().toISOString()
    };
    
    setRebates(prevRebates => [...prevRebates, newRebate]);
    return newRebate;
  };

  // Get user's rebates
  const getUserRebates = (userId) => {
    return rebates.filter(rebate => rebate.userId === userId);
  };

  // Check if a user is on rebate for a specific date
  const isUserOnRebate = (userId, date) => {
    return rebates.some(
      rebate => 
        rebate.userId === userId && 
        rebate.status === 'approved' &&
        new Date(date) >= new Date(rebate.startDate) &&
        new Date(date) <= new Date(rebate.endDate)
    );
  };

  // Approve a rebate
  const approveRebate = (rebateId) => {
    setRebates(prevRebates => 
      prevRebates.map(rebate => 
        rebate.id === rebateId 
          ? { ...rebate, status: 'approved' } 
          : rebate
      )
    );
  };

  // Reject a rebate
  const rejectRebate = (rebateId) => {
    setRebates(prevRebates => 
      prevRebates.map(rebate => 
        rebate.id === rebateId 
          ? { ...rebate, status: 'rejected' } 
          : rebate
      )
    );
  };

  // Get all pending rebates
  const getPendingRebates = () => {
    return rebates.filter(rebate => rebate.status === 'pending');
  };

  // Get all approved rebates
  const getApprovedRebates = () => {
    return rebates.filter(rebate => rebate.status === 'approved');
  };

  const value = {
    rebates,
    applyForRebate,
    getUserRebates,
    isUserOnRebate,
    approveRebate,
    rejectRebate,
    getPendingRebates,
    getApprovedRebates
  };

  return (
    <RebateContext.Provider value={value}>
      {children}
    </RebateContext.Provider>
  );
};

export const useRebates = () => {
  return useContext(RebateContext);
};