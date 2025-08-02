import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import logo from '../../assets/images/massinissa-logo.png';

const Sidebar = () => {
  const location = useLocation();
  const navItems = [
    { name: 'Dashboard', path: '/', icon: 'tachometer-alt' },
    { name: 'Milk Collection', path: '/milk-collection', icon: 'faucet-drip', subItems: [
      { name: 'Collection Points', path: '/milk-collection/points' },
      { name: 'Quality Tests', path: '/milk-collection/tests' },
      { name: 'Suppliers', path: '/milk-collection/suppliers' }
    ]},
    { name: 'Production', path: '/production', icon: 'industry', subItems: [
      { name: 'Batches', path: '/production/batches' },
      { name: 'Recipes', path: '/production/recipes' },
      { name: 'Quality Control', path: '/production/quality' }
    ]},
    { name: 'Inventory', path: '/inventory', icon: 'warehouse', subItems: [
      { name: 'Raw Materials', path: '/inventory/raw-materials' },
      { name: 'Finished Goods', path: '/inventory/finished-goods' },
      { name: 'Supplies', path: '/inventory/supplies' }
    ]},
    { name: 'Employees', path: '/employees', icon: 'users' },
    { name: 'Reports', path: '/reports', icon: 'chart-line', subItems: [
      { name: 'Daily Reports', path: '/reports/daily' },
      { name: 'Monthly Reports', path: '/reports/monthly' },
      { name: 'Analytics', path: '/reports/analytics' }
    ]},
    { name: 'Settings', path: '/settings', icon: 'cog' }
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-blue-800 to-blue-900 text-white shadow-xl flex flex-col h-full transition-all duration-300">
      {/* Logo Section */}
      <div className="p-4 border-b border-blue-700 flex flex-col items-center justify-center py-6">
        <div className="flex items-center justify-center mb-3 h-16">
          {logo ? (
            <img 
              src={logo} 
              alt="Massinissa Dairy Logo" 
              className="h-full object-contain"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = '';
                e.target.parentElement.innerHTML = '<i class="fas fa-cow text-white text-4xl"></i>';
              }}
            />
          ) : (
            <i className="fas fa-cow text-white text-4xl"></i>
          )}
        </div>
        <h1 className="text-xl font-bold text-white">Massinissa Dairy</h1>
        <p className="text-xs text-blue-200 mt-1">Premium Dairy Solutions</p>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center p-3 rounded-lg transition-all duration-200 group ${
                    isActive || location.pathname.startsWith(item.path + '/')
                      ? 'bg-blue-600 shadow-md text-white font-semibold'
                      : 'text-blue-100 hover:bg-blue-700 hover:shadow-sm'
                  }`
                }
              >
                <span className="mr-3 w-6 text-center">
                  <i className={`fas fa-${item.icon} text-lg`} />
                </span>
                <span className="font-medium flex-1">{item.name}</span>
                {item.subItems && (
                  <i className={`fas fa-chevron-down text-xs transition-transform duration-200 ${
                    location.pathname.startsWith(item.path + '/') ? 'rotate-180' : ''
                  }`} />
                )}
              </NavLink>

              {/* Sub-items */}
              {item.subItems && location.pathname.startsWith(item.path + '/') && (
                <ul className="ml-4 mt-1 space-y-1 pl-7 border-l-2 border-blue-700">
                  {item.subItems.map((subItem) => (
                    <li key={subItem.name}>
                      <NavLink
                        to={subItem.path}
                        className={({ isActive }) => 
                          `block py-2 px-3 rounded transition-all duration-150 text-sm ${
                            isActive
                              ? 'text-white bg-blue-500/30'
                              : 'text-blue-200 hover:text-white hover:bg-blue-500/20'
                          }`
                        }
                      >
                        {subItem.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-blue-700 bg-blue-900/30">
        <div className="flex items-center justify-between text-blue-200 text-sm">
          <div>
            <p className="font-medium">v2.1.0</p>
            <p className="text-xs mt-1">© {new Date().getFullYear()}</p>
          </div>
          <div className="flex space-x-3">
            <a href="#" className="hover:text-white">
              <i className="fas fa-question-circle"></i>
            </a>
            <a href="#" className="hover:text-white">
              <i className="fas fa-cog"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;