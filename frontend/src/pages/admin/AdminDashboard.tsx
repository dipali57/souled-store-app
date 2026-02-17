// src/pages/admin/Dashboard.tsx
import { useState, useEffect } from 'react';

interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  totalRevenue: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Total Orders</h3>
          <p className="text-3xl font-bold">{stats?.totalOrders}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Total Products</h3>
          <p className="text-3xl font-bold">{stats?.totalProducts}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Total Users</h3>
          <p className="text-3xl font-bold">{stats?.totalUsers}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Total Revenue</h3>
          <p className="text-3xl font-bold">${stats?.totalRevenue}</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
        {/* Add recent orders table here */}
      </div>
    </div>
  );
};

export default AdminDashboard;