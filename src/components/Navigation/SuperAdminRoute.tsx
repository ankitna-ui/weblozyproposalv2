import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

export default function SuperAdminRoute({ children }: { children: ReactNode }) {
  // Placeholder for role-based protection
  return <>{children}</>;
}
