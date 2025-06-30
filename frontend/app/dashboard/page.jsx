'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/utils/auth";
import DashboardOverview from "@/components/DashboardOverview";
import OrdersTable from '@/components/OrdersTable';
import ProductList from '@/components/ProductList';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Checking session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-black text-white">
      <h1 className="text-2xl font-bold mb-6">Welcome to Admin Dashboard🫣</h1>
      <DashboardOverview />
      {/* Orders Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Orders🚚</h2>
        <OrdersTable />
        <h2 className="text-2xl font-bold mb-4">Products🛒</h2>
        <ProductList />
      </section>
    </div>
  );
}
