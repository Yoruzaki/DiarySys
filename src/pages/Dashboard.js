import React from 'react';

const Dashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Stats Cards */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <i className="fas fa-flask text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Today's Milk Collection</p>
              <p className="text-2xl font-bold">1,240 L</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <i className="fas fa-warehouse text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Inventory</p>
              <p className="text-2xl font-bold">24 Products</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <i className="fas fa-industry text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Today's Production</p>
              <p className="text-2xl font-bold">560 kg</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
              <i className="fas fa-users text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Employees Present</p>
              <p className="text-2xl font-bold">18/24</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          {/* Activity items would go here */}
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <i className="fas fa-plus-circle text-blue-600 mb-2" />
              <p>New Collection</p>
            </button>
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <i className="fas fa-play-circle text-green-600 mb-2" />
              <p>Start Production</p>
            </button>
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <i className="fas fa-clipboard-list text-purple-600 mb-2" />
              <p>Create Report</p>
            </button>
            <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
              <i className="fas fa-user-plus text-orange-600 mb-2" />
              <p>Add Employee</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;