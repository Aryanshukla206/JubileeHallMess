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
    console.log(currentUser)

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
      {!loading && children}
    </RebateContext.Provider>
  );
};

export const useRebates = () => useContext(RebateContext);



// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { useAuth } from './AuthContext';

// const RebateContext = createContext();

// export const RebateProvider = ({ children }) => {
//   const { currentUser } = useAuth();
//   const [rebates, setRebates] = useState([]);

//   // Load rebates from localStorage on component mount
//   useEffect(() => {
//     const storedRebates = localStorage.getItem('jubilee_rebates');

//     if (storedRebates) {
//       setRebates(JSON.parse(storedRebates));
//     }
//   }, []);

//   // Save rebates to localStorage whenever they change
//   useEffect(() => {
//     localStorage.setItem('jubilee_rebates', JSON.stringify(rebates));
//   }, [rebates]);

//   // Apply for a rebate
//   const applyForRebate = (startDate, endDate, reason) => {
//     if (!currentUser) return null;

//     const newRebate = {
//       id: Date.now().toString(),
//       userId: currentUser.id,
//       userName: currentUser.name,
//       startDate,
//       endDate,
//       reason,
//       status: 'pending',
//       appliedAt: new Date().toISOString()
//     };

//     setRebates(prevRebates => [...prevRebates, newRebate]);
//     return newRebate;
//   };

//   // Get user's rebates
//   const getUserRebates = (userId) => {
//     return rebates.filter(rebate => rebate.userId === userId);
//   };

//   // Check if a user is on rebate for a specific date
//   const isUserOnRebate = (userId, date) => {
//     return rebates.some(
//       rebate =>
//         rebate.userId === userId &&
//         rebate.status === 'approved' &&
//         new Date(date) >= new Date(rebate.startDate) &&
//         new Date(date) <= new Date(rebate.endDate)
//     );
//   };

//   // Approve a rebate
//   const approveRebate = (rebateId) => {
//     setRebates(prevRebates =>
//       prevRebates.map(rebate =>
//         rebate.id === rebateId
//           ? { ...rebate, status: 'approved' }
//           : rebate
//       )
//     );
//   };

//   // Reject a rebate
//   const rejectRebate = (rebateId) => {
//     setRebates(prevRebates =>
//       prevRebates.map(rebate =>
//         rebate.id === rebateId
//           ? { ...rebate, status: 'rejected' }
//           : rebate
//       )
//     );
//   };

//   // Get all pending rebates
//   const getPendingRebates = () => {
//     return rebates.filter(rebate => rebate.status === 'pending');
//   };

//   // Get all approved rebates
//   const getApprovedRebates = () => {
//     return rebates.filter(rebate => rebate.status === 'approved');
//   };

//   const value = {
//     rebates,
//     applyForRebate,
//     getUserRebates,
//     isUserOnRebate,
//     approveRebate,
//     rejectRebate,
//     getPendingRebates,
//     getApprovedRebates
//   };

//   return (
//     <RebateContext.Provider value={value}>
//       {children}
//     </RebateContext.Provider>
//   );
// };

// export const useRebates = () => {
//   return useContext(RebateContext);
// };


// import React, { createContext, useState, useContext, useEffect } from 'react';
// import axios from 'axios';
// import { useAuth } from './AuthContext';

// const RebateContext = createContext();

// const API_URL = 'http://localhost:3000/api';

// export const RebateProvider = ({ children }) => {
//   const { currentUser } = useAuth();
//   const [rebates, setRebates] = useState([]);

//   const authHeader = {
//     headers: {
//       Authorization: `Bearer ${currentUser?.token}`,
//     },
//   };

//   useEffect(() => {
//     if (currentUser) {
//       fetchRebates();
//     }
//   }, [currentUser]);

//   const fetchRebates = async () => {
//     try {
//       const { data } = await axios.get(
//         `${API_URL}/rebates/my`,
//         authHeader
//       );
//       setRebates(data);
//     } catch (error) {
//       console.error('Error fetching rebates:', error);
//     }
//   };

//   const applyForRebate = async (startDate, endDate, reason) => {
//     try {
//       const { data } = await axios.post(
//         `${API_URL}/rebates`,
//         {
//           startDate,
//           endDate,
//           reason,
//         },
//         authHeader
//       );
//       setRebates([...rebates, data]);
//       return data;
//     } catch (error) {
//       throw new Error(error.response?.data?.message || 'Failed to apply for rebate');
//     }
//   };

//   const approveRebate = async (rebateId) => {
//     try {
//       const { data } = await axios.put(
//         `${API_URL}/rebates/${rebateId}`,
//         { status: 'approved' },
//         authHeader
//       );
//       setRebates(rebates.map(r => r._id === rebateId ? data : r));
//     } catch (error) {
//       throw new Error(error.response?.data?.message || 'Failed to approve rebate');
//     }
//   };

//   const rejectRebate = async (rebateId) => {
//     try {
//       const { data } = await axios.put(
//         `${API_URL}/rebates/${rebateId}`,
//         { status: 'rejected' },
//         authHeader
//       );
//       setRebates(rebates.map(r => r._id === rebateId ? data : r));
//     } catch (error) {
//       throw new Error(error.response?.data?.message || 'Failed to reject rebate');
//     }
//   };

//   const value = {
//     rebates,
//     applyForRebate,
//     approveRebate,
//     rejectRebate,
//   };

//   return (
//     <RebateContext.Provider value={value}>
//       {children}
//     </RebateContext.Provider>
//   );
// };

// export const useRebates = () => {
//   return useContext(RebateContext);
// };