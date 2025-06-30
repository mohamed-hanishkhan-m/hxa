'use client';

import dynamic from 'next/dynamic';

const CustomerRegisterForm = dynamic(() => import('./CustomerRegisterForm'), { ssr: false });

export default function CustomerRegisterWrapper() {
  return <CustomerRegisterForm />;
}
