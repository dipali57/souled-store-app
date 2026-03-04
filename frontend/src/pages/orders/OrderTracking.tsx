import React from "react";

interface OrderTrackingProps {
  orderId: number;
  status: string;
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ orderId, status }) => {
  const steps = [
    { label: "Order Placed", status: "Pending" },
    { label: "Processing", status: "Processing" },
    { label: "Shipped", status: "Shipped" },
    { label: "Delivered", status: "Delivered" },
  ];

  const getCurrentStep = () => {
    const index = steps.findIndex(
      (step) => step.status.toLowerCase() === status.toLowerCase(),
    );
    return index >= 0 ? index : 0;
  };

  const currentStep = getCurrentStep();

  return (
    <div className="py-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Track Order #{orderId}
      </h3>

      <div className="relative">
        {/* Progress Bar */}
        <div className="absolute top-5 left-0 w-full h-1 bg-gray-200">
          <div
            className="h-full bg-blue-600 transition-all duration-500"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  index <= currentStep
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {index <= currentStep ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <p
                className={`text-sm font-medium ${
                  index <= currentStep ? "text-gray-900" : "text-gray-500"
                }`}
              >
                {step.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
