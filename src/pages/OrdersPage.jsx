import React, { useState } from 'react';
import Layout from '../components/common/Layout';
import OrderList from '../components/orders/OrderList';
import { useBookings } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { Filter, Search } from 'lucide-react';
import getTodayDate from '../utils/getTodayDate';

const OrdersPage = () => {
  const { currentUser, isAdmin } = useAuth();
  const { getBookingsByDate, getGuestBookingsByDate } = useBookings();

  const [date, setDate] = useState(getTodayDate);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMeal, setFilterMeal] = useState('all');

  // Get orders based on date
  const orders = getBookingsByDate(date);
  console.log("guestBookings------> ", getGuestBookingsByDate(date))
  const guestOrders = getGuestBookingsByDate(date);

  const GuestfilteredOrders = guestOrders.filter(guestOrder => {
    const matchesSearch = guestOrder.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMeal = filterMeal === 'all' || guestOrder.mealType === filterMeal;
    return matchesSearch && matchesMeal;
  });
  // Filter orders based on search term and meal type
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMeal = filterMeal === 'all' || order.mealType === filterMeal;
    return matchesSearch && matchesMeal;
  });

  const myFilteredOrders = orders.filter(order =>
    order.userId === currentUser?._id

  );

  return (
    <Layout
      title="Meal Orders"
      subtitle={`Orders for ${new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}
    >
      <div className="space-y-6">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="mealFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Meal Type
              </label>
              <select
                id="mealFilter"
                value={filterMeal}
                onChange={(e) => setFilterMeal(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Meals</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search by Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search orders..."
                  className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {isAdmin && (
          <>
            <OrderList orders={filteredOrders} isGuest={false} />
            <OrderList orders={GuestfilteredOrders} isGuest={true} />
          </>
        )}
        {!isAdmin && (
          <OrderList orders={myFilteredOrders} isGuest={false} />
        )}

        {/* Guest Orders List */}

      </div>
    </Layout>
  );
};

export default OrdersPage;