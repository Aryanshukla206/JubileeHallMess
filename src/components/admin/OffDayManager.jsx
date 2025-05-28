import React, { useState } from 'react';
import { useMenu } from '../../context/MenuContext';
import { useToast } from '../../context/ToastContext';
import { Calendar, AlertTriangle, X } from 'lucide-react';

const OffDayManager = () => {
  const { offDays, addOffDay, removeOffDay } = useMenu();
  const { success, error } = useToast();

  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');



  const handleAddOffDay = (e) => {
    e.preventDefault();
    // console.log("Adding off day with date:", date, "and reason:", reason);
    if (!date) {
      error("Please select a date");
      return;
    }

    if (!reason) {
      error("Please provide a reason");
      return;
    }

    // Check if date already exists
    if (offDays.some(offDay => offDay.date === date)) {
      error("This date is already marked as an off-day");
      return;
    }

    addOffDay(date, reason);
    success(`${date} marked as mess off-day`);

    // Reset form
    setDate('');
    setReason('');
  };

  const handleRemoveOffDay = (id) => {
    removeOffDay(id);
    success(`Off-day for ${id} removed`);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Sort off days by date
  const sortedOffDays = [...offDays].sort((a, b) => new Date(a.date) - new Date(b.date));
  // console.log(date, reason, "------------->> offDays");

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-blue-600 text-white p-4">
        <h2 className="text-xl font-bold">Manage Mess Off-Days</h2>
      </div>

      <div className="p-4 border-b border-gray-200">
        <form onSubmit={handleAddOffDay} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="offDayDate" className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                id="offDayDate"
                value={date}
                onChange={(e) => {
                  // console.log('Date input changed to:', e.target.value);
                  setDate(e.target.value)
                }
                }
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="offDayReason" className="block text-sm font-medium text-gray-700 mb-1">
                Reason
              </label>
              <input
                type="text"
                id="offDayReason"
                value={reason}
                onChange={(e) => {
                  // console.log('Reason input changed to:', e.target.value);
                  setReason(e.target.value)
                }
                }
                placeholder="e.g. Holiday, Maintenance, etc."
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Off-Day
          </button>
        </form>
      </div>

      <div className="p-4">
        <h3 className="font-medium text-gray-700 mb-3">Scheduled Off-Days</h3>

        {sortedOffDays.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No scheduled off-days
          </div>
        ) : (
          <div className="space-y-2">
            {sortedOffDays.map(offDay => (
              <div
                key={offDay._id}
                className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-md"
              >
                <div className="flex items-center">
                  <AlertTriangle size={16} className="text-red-500 mr-2" />
                  <div>
                    <p className="font-medium text-gray-800">{formatDate(offDay.date)}</p>
                    <p className="text-sm text-gray-600">{offDay.reason}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveOffDay(offDay._id)}
                  className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                  title="Remove off-day"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OffDayManager;