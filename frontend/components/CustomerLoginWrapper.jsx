'use client';

import dynamic from 'next/dynamic';

const CustomerLoginForm = dynamic(() => import('./CustomerLoginForm'), { ssr: false });

export default function CustomerLoginWrapper() {
  return <CustomerLoginForm />;
}
