'use client';

import dynamic from 'next/dynamic';

const AdminLoginForm = dynamic(() => import('./AdminLoginForm'), { ssr: false });

export default function AdminLoginWrapper() {
  return <AdminLoginForm />;
}
