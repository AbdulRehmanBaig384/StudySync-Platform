import React from 'react';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#0a0f1e] font-sans text-slate-200">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto font-jakarta">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
