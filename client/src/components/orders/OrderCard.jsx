import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBookings } from '../../context/BookingContext';
import { useToast } from '../../context/ToastContext';
import { Clock, User, Check } from 'lucide-react';
import CollapsibleSection from '../common/CollapsibleSection';

const OrderCard = ({ order, isGuest }) => {
  const { currentUser, isAdmin } = useAuth();
  const { markBookingComplete } = useBookings();
  const { success } = useToast();
  const [isOpen, setIsOpen] = useState(true);
  const toggleOpen = () => setIsOpen(prev => !prev);


  // console.log(order, "---------> OrderCard.jsx");


  const [isCompleted, setIsCompleted] = useState(order.status === 'completed');

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleMarkComplete = () => {
    markBookingComplete(order._id);
    setIsCompleted(true);
    success('Order marked as completed');
  };

  return (
    <div onClick={toggleOpen} className="cursor-pointer bg-white rounded-lg shadow-md overflow-hidden">
      <div className='p-4 pt-4'>

        {/* <div onClick={toggleOpen} className="p-4" > */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center">
              <User size={16} className="text-gray-500 mr-1" />
              <h3 className="font-medium text-gray-800">{order.userName} <span className='font-light text-sm'>{isGuest ? "- Guest" : "- Resident"}</span> </h3>
            </div>

            <div className="flex items-center mt-1 text-gray-500 text-sm">
              <Clock size={14} className="mr-1" />
              <span>{formatTime(order.timestamp)}</span>
            </div>
          </div>


          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs rounded-full ${order.mealType === 'breakfast' ? 'bg-yellow-100 text-yellow-800' :
              order.mealType === 'lunch' ? 'bg-green-100 text-green-800' :
                'bg-blue-100 text-blue-800'
              }`}>
              {order.mealType.charAt(0).toUpperCase() + order.mealType.slice(1)}
            </span>

            <span className={`px-2 py-1 text-xs rounded-full ${isCompleted
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
              }`}>
              {isCompleted ? 'Completed' : 'Pending'}
            </span>
          </div>
        </div>
        {isOpen && (

          <div>
            <div className="mt-4 space-y-2">
              {Object.entries(order.quantities).map(([item, quantity]) => {
                if (quantity > 0) {
                  return (
                    <div key={item} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 capitalize">{item}</span>
                      <span className="font-medium">{quantity}</span>
                    </div>
                  );
                }
                return null;
              })}
            </div>

            {isAdmin && !isCompleted && !order.isGuest && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={handleMarkComplete}
                  className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <Check size={16} className="mr-1" />
                  Mark as Completed
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCard;