import React from 'react';
import { AlertTriangle } from 'lucide-react';

const OffDayBanner = ({ reason }) => {
  return (
    <div className="bg-red-100 text-red-700 px-4 py-3 mt-16 flex items-center justify-center">
      <div className="max-w-7xl w-full flex items-center">
        <AlertTriangle size={20} className="mr-2" />
        <span className="font-medium">Mess is closed today: {reason || 'Holiday'}</span>
      </div>
    </div>
  );
};

export default OffDayBanner;