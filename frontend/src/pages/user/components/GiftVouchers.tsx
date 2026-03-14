import React from 'react';

const GiftVouchers: React.FC = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-8">Gift Vouchers</h2>
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-300 bg-white ">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-600">Active TSS Points</p>
            <p className="text-2xl font-bold text-gray-900">0.00</p>
          </div>
          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            Redeem Points
          </button>
        </div>
      </div>
    </div>
  );
};

export default GiftVouchers;