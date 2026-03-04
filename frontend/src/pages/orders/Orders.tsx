import React, { useState } from "react";
import { useGetUserOrdersQuery } from "./redux/orders.api";
import OrderDetailsModal from "./OrderDetails";

const Orders: React.FC = () => {
  const { data: orders, isLoading, error, refetch } = useGetUserOrdersQuery();
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "text-green-600";
      case "shipped":
        return "text-blue-600";
      case "processing":
        return "text-yellow-600";
      case "cancelled":
        return "text-red-600";
      case "return received":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">
          Error loading orders. Please try again.
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">MY ORDERS</h2>
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">
            You haven't placed any orders yet.
          </p>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">MY ORDERS</h2>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedOrderId(order.id)}
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="font-medium text-gray-900">
                  Order ID: #{order.id}
                </span>
                <span className="text-gray-600 ml-4">
                  {formatDate(order.createdAt)}
                </span>
              </div>
              <button className="text-blue-600 hover:underline text-sm font-medium">
                Invoice
              </button>
            </div>

            <div className="border-t border-gray-200 pt-4">
              {order.orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-start mb-3 last:mb-0"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Size: {item.product.size || "M"} | Qty: {item.quantity} |
                      Price: ₹{item.product.price}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-medium ${getStatusColor(order.status)}`}
                  >
                    - {order.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
              <span className="text-gray-700">Total Amount:</span>
              <span className="text-lg font-bold text-gray-900">
                ₹{order.totalAmount}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Order Details Modal */}
      {selectedOrderId && (
        <OrderDetailsModal
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}
    </div>
  );
};

export default Orders;
