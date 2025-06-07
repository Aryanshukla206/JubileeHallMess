import React from 'react';
import Layout from '../components/common/Layout';
import MealBookingCard from '../components/meal/MealBookingCard';
import RebateForm from '../components/rebate/RebateForm';
import { useRebates } from '../context/RebateContext';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import CollapsibleSection from '../components/common/CollapsibleSection';

const ResidentDashboard = () => {
  const { currentUser } = useAuth();
  const { getUserRebates } = useRebates();


  // Get resident's rebates
  const rebates = currentUser ? getUserRebates(currentUser._id) : [];

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'rejected':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <Clock size={16} className="text-yellow-500" />;
    }
  };

  // Get status text color
  const getStatusTextColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-green-700';
      case 'rejected':
        return 'text-red-700';
      default:
        return 'text-yellow-700';
    }
  };

  return (
    <Layout
      title={currentUser.name}
      subtitle="Book meals and manage your mess preferences"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Meal booking section */}
        <div className="lg:col-span-2 space-y-6">

          <div className=" bg-white rounded-lg shadow-md p-4">
            {/* <h2 className="text-xl font-bold text-gray-800 mb-4">Today's Meals</h2> */}
            <CollapsibleSection title={"Today's Meals"}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MealBookingCard mealType="breakfast" />
                <MealBookingCard mealType="lunch" />
                <MealBookingCard mealType="dinner" />
              </div>
            </CollapsibleSection>
          </div>


          {/* Rebates history section */}
          <div className="bg-white rounded-lg shadow-md p-4">
            {/* <h2 className="text-xl font-bold text-gray-800 mb-4">Your Rebate History</h2> */}
            <CollapsibleSection title={"Your Rebate History"}>
              {rebates.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  No rebate applications found
                </div>
              ) : (
                <div className="space-y-3">
                  {rebates.map(rebate => (
                    <div
                      key={rebate.id}
                      className={`p-3 rounded-md border ${rebate.status === 'approved'
                        ? 'border-green-200 bg-green-50'
                        : rebate.status === 'rejected'
                          ? 'border-red-200 bg-red-50'
                          : 'border-yellow-200 bg-yellow-50'
                        }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center">
                            <Calendar size={16} className="mr-1 text-gray-500" />
                            <span className="font-medium text-gray-800">
                              {formatDate(rebate.startDate)} - {formatDate(rebate.endDate)}
                            </span>
                          </div>
                          <p className="text-gray-600 mt-1">{rebate.reason}</p>
                        </div>
                        <div className={`flex items-center ${getStatusTextColor(rebate.status)}`}>
                          {getStatusIcon(rebate.status)}
                          <span className="ml-1 font-medium text-sm capitalize">
                            {rebate.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CollapsibleSection>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Rebate application form */}
          <RebateForm />

          {/* Information card */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Important Information</h3>

            <div className="space-y-3">
              <div className="flex items-start">
                <Clock size={18} className="text-blue-500 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700">Meal Timings</p>
                  <p className="text-sm text-gray-600">Breakfast: 8:00 AM - 9:45 AM</p>
                  <p className="text-sm text-gray-600">Lunch: 1:00 PM - 2:00 PM</p>
                  <p className="text-sm text-gray-600">Dinner: 8:00 PM - 9:00 PM</p>
                </div>
              </div>

              <div className="flex items-start">
                <AlertTriangle size={18} className="text-yellow-500 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700">Rebate Rules</p>
                  <p className="text-sm text-gray-600">Rebates must be applied at least 24 hours in advance.</p>
                  <p className="text-sm text-gray-600">All rebates require admin approval.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResidentDashboard;