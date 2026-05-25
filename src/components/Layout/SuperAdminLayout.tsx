import React from 'react';
import { Outlet } from 'react-router-dom';

export default function SuperAdminLayout() {
  return (
    <div className="min-h-[100dvh] bg-[#07090C] text-white">
      <nav className="p-4 border-b border-white/10 text-xl font-bold tracking-widest uppercase">Super Admin Portal</nav>
      <div className="p-8">
        <Outlet />
      </div>
    </div>
  );
}
