import React from 'react';
import OrderCard from './OrderCard';

const OrderList = ({ orders, isGuest }) => {
  // Sort orders by timestamp (latest first)
  const sortedOrders = [...orders].sort((a, b) =>
    new Date(b.timestamp) - new Date(a.timestamp)
  );

  return (
    <div className="space-y-4">
      {sortedOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
          {isGuest ? 'No guest orders found.' : 'No Resident orders found.'}
        </div>
      ) : (
        sortedOrders.map(order => (
          <OrderCard key={order.id} order={order} isGuest={isGuest} />
        ))
      )}
    </div>
  );
};

export default OrderList;