import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const DashboardLayout = ({ children, title, navLinks }) => {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <span className="text-xl font-black text-brand-primary">Green<span className="text-brand-accent">Leaf</span></span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="mt-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${link.active ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {link.icon && <span className="mr-3">{link.icon}</span>}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* Spacer */}
        <div className="mt-auto pb-6">
          {/* User Info */}
          <div className="flex items-center space-x-3 p-4 text-sm">
            {/* User avatar placeholder */}
            <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-500">{user?.name?.charAt(0)?.toUpperCase() ?? '?'}</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{user?.name || 'User'}</p>
              <p className="text-gray-500">{user?.role || ''}</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="w-full flex items-center justify-start px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          <div className="flex items-center space-x-4">
            {/* Notifications Bell */}
            <div className="relative">
              <button className="text-gray-500 hover:text-gray-700">
                {/* Bell icon placeholder */}
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-5.656A2 2 0 0018 9h-5C9.819 9 8 10.819 8 12.5c0 1.378.53 2.593 1.405 4.056A7.953 7.953 0 008 19c4.478 0 8-2.874 8-6.592.037-.89.075-1.766.116-2.63z"></path>
                </svg>
              </button>
              {/* Unread notifications badge */}
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </div>
            </div>
            {/* Messages */}
            <div className="relative">
              <button className="text-gray-500 hover:text-gray-700">
                {/* Message icon placeholder */}
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11h3a2 2 0 012 2v3a2 2 0 01-2 2H8m4-5a2 2 0 100-4 2 2 0 000 4zm0 6a2 2 0 100-4 2 2 0 000 4z"></path>
                </svg>
              </button>
              {/* Unread messages badge */}
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                2
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;