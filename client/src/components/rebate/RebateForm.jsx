import React, { useState } from 'react';
import { useRebates } from '../../context/RebateContext';
import { useToast } from '../../context/ToastContext';
import CollapsibleSection from '../common/CollapsibleSection';

const RebateForm = () => {
  const { applyForRebate } = useRebates();
  const { success, error } = useToast();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get today's date for min attribute
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!startDate || !endDate || !reason) {
      error("Please fill all fields");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      error("End date must be after start date");
      return;
    }

    setIsSubmitting(true);

    try {
      // //console.log("Applying for rebate:", { startDate, endDate, reason });
      const rebate = applyForRebate({ startDate, endDate, reason });
      if (rebate) {
        success("Rebate application submitted successfully");
        // Reset form
        setStartDate('');
        setEndDate('');
        setReason('');
      } else {
        error("Failed to apply for rebate");
      }
    } catch (err) {
      error(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* <h2 className="text-xl font-bold text-gray-800 mb-4">Apply for Rebate</h2> */}
      <CollapsibleSection title={"Apply for Rebate"}>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                min={today}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                min={startDate || today}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                Reason
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Please provide a reason for your rebate application..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full p-2 rounded-md font-medium transition-colors ${isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            >
              {isSubmitting ? 'Submitting...' : 'Apply for Rebate'}
            </button>
          </div>
        </form>
      </CollapsibleSection>

      <div className="mt-4 text-sm text-gray-600">
        <p>Note: Rebate applications need to be approved by the mess admin before taking effect.</p>
        <p className="mt-1">You will not be able to book meals during the rebate period.</p>
      </div>
    </div>
  );
};

export default RebateForm;