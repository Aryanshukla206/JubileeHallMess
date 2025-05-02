import React from 'react';
import Layout from '../components/common/Layout';
import MenuTable from '../components/menu/MenuTable';

const MenuPage = () => {
  return (
    <Layout 
      title="Weekly Mess Menu" 
      subtitle="Plan your meals with our weekly menu"
    >
      <div className="space-y-6">
        <MenuTable />
        
        <div className="bg-white rounded-lg shadow-md p-5">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Menu Information</h2>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              The mess menu is prepared weekly to provide a balanced and nutritious diet. 
              We aim to include a variety of dishes to cater to different tastes and dietary requirements.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
              <h3 className="font-medium text-blue-800 mb-2">Special Requests</h3>
              <p className="text-blue-700">
                If you have any dietary restrictions or special requests, please contact the mess administration 
                at least 48 hours in advance at <span className="font-medium">mess-admin@jubileehall.com</span>.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h3 className="font-medium text-gray-800 mb-2">Breakfast</h3>
                <p className="text-gray-600 text-sm">
                  Our breakfast menu includes a mix of South and North Indian dishes, along with continental options.
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h3 className="font-medium text-gray-800 mb-2">Lunch</h3>
                <p className="text-gray-600 text-sm">
                  Lunch features a complete balanced meal with rice, dal, vegetables, and sides.
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h3 className="font-medium text-gray-800 mb-2">Dinner</h3>
                <p className="text-gray-600 text-sm">
                  Dinner includes lighter options with a focus on providing essential nutrients.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MenuPage;