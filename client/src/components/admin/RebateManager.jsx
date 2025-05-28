import React, { useState } from 'react';
import { useRebates } from '../../context/RebateContext';
import { useToast } from '../../context/ToastContext';
import { Calendar, User, Check, X, Clock } from 'lucide-react';

const RebateManager = () => {
  const { getPendingRebates, getApprovedRebates, approveRebate, rejectRebate } = useRebates();
  const { success } = useToast();
  
  const [activeTab, setActiveTab] = useState('pending');
  
  const pendingRebates = getPendingRebates();
  const approvedRebates = getApprovedRebates();
  
  const handleApprove = (rebateId) => {
    approveRebate(rebateId);
    success("Rebate approved successfully");
  };
  
  const handleReject = (rebateId) => {
    rejectRebate(rebateId);
    success("Rebate rejected");
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-blue-600 text-white p-4">
        <h2 className="text-xl font-bold">Rebate Applications</h2>
      </div>
      
      <div className="border-b border-gray-200">
        <nav className="flex">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-3 font-medium text-sm focus:outline-none ${
              activeTab === 'pending'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Pending ({pendingRebates.length})
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`px-4 py-3 font-medium text-sm focus:outline-none ${
              activeTab === 'approved'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Approved ({approvedRebates.length})
          </button>
        </nav>
      </div>
      
      <div className="p-4">
        {activeTab === 'pending' && (
          <>
            {pendingRebates.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No pending rebate applications
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRebates.map(rebate => (
                  <div key={rebate.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <User size={16} className="text-gray-500 mr-1" />
                          <h3 className="font-medium text-gray-800">{rebate.userName}</h3>
                        </div>
                        
                        <div className="flex items-center mt-1 text-gray-500 text-sm">
                          <Calendar size={14} className="mr-1" />
                          <span>
                            {formatDate(rebate.startDate)} - {formatDate(rebate.endDate)}
                          </span>
                        </div>
                        
                        <div className="mt-2">
                          <p className="text-gray-600">{rebate.reason}</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApprove(rebate.id)}
                          className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-colors"
                          title="Approve"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => handleReject(rebate.id)}
                          className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors"
                          title="Reject"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-400 flex items-center">
                      <Clock size={12} className="mr-1" />
                      <span>Applied on {formatDate(rebate.appliedAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        
        {activeTab === 'approved' && (
          <>
            {approvedRebates.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No approved rebate applications
              </div>
            ) : (
              <div className="space-y-4">
                {approvedRebates.map(rebate => (
                  <div key={rebate.id} className="border border-gray-200 rounded-lg p-4 bg-green-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <User size={16} className="text-gray-600 mr-1" />
                          <h3 className="font-medium text-gray-800">{rebate.userName}</h3>
                        </div>
                        
                        <div className="flex items-center mt-1 text-gray-500 text-sm">
                          <Calendar size={14} className="mr-1" />
                          <span>
                            {formatDate(rebate.startDate)} - {formatDate(rebate.endDate)}
                          </span>
                        </div>
                        
                        <div className="mt-2">
                          <p className="text-gray-600">{rebate.reason}</p>
                        </div>
                      </div>
                      
                      <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                        Approved
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RebateManager;