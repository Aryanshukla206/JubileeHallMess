import React from 'react';

const QRCode = ({ data, size = 200 }) => {
  // In a real application, we would use a QR code library
  // For this demo, we'll create a simple placeholder
  const encodedData = encodeURIComponent(data);
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedData}`;

  return (
    <div className="flex flex-col items-center">
      <div className="border-4 border-blue-100 rounded-lg p-2 bg-white">
        <img 
          src={qrCodeUrl} 
          alt="QR Code" 
          width={size} 
          height={size} 
          className="max-w-full h-auto"
        />
      </div>
      <p className="mt-2 text-sm text-gray-500">Scan to verify</p>
    </div>
  );
};

export default QRCode;