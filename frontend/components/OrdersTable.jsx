// frontend/components/OrdersTable.jsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/dashboard/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Orders response:", res.data);
      setOrders(res.data.orders || res.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => fetchOrders(), 30000); // Auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    fetchOrders();
  };

  const handleExportCSV = () => {
    const headers = ["Order ID", "Customer", "Amount", "Status", "Date"];
    const rows = filteredOrders.map((order) => [
      order._id,
      order.customerName,
      order.totalAmount,
      order.status,
      new Date(order.createdAt).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "orders.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredOrders = Array.isArray(orders)
    ? orders.filter((order) => {
        const statusMatch =
          statusFilter === "all" ||
          order.status?.toLowerCase() === statusFilter;
        const searchMatch =
          order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order._id?.includes(searchQuery);

        const now = new Date();
        const createdAt = new Date(order.createdAt);
        let dateMatch = true;

        if (dateRange === "7d") {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(now.getDate() - 7);
          dateMatch = createdAt >= sevenDaysAgo;
        } else if (dateRange === "30d") {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(now.getDate() - 30);
          dateMatch = createdAt >= thirtyDaysAgo;
        }

        return statusMatch && searchMatch && dateMatch;
      })
    : [];

  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const currentData = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (loading) return <p className="text-white">Loading orders...</p>;

  return (
    <div className="p-4">
      <div className="mb-4 flex flex-wrap gap-3 items-center justify-between">
        {/* Search and refresh group */}
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Search by name or ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-1 text-sm rounded bg-white text-black"
          />

          <button
            onClick={handleRefresh}
            className="px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>

        {/* Date range, export CSV, and filters */}
        <div className="flex gap-2 flex-wrap items-center">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-1 rounded text-sm bg-white text-black"
          >
            <option value="all">All Time</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="px-4 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
          >
            Export CSV
          </button>

          {/* Mobile filter toggle */}
          <div className="sm:hidden">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="px-4 py-1 text-sm bg-gray-700 text-white rounded"
            >
              ☰
            </button>
            {showFilterMenu && (
              <div className="mt-2 space-y-2">
                {['all', 'pending', 'delivered', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                      setShowFilterMenu(false);
                    }}
                    className={`w-full px-4 py-1 rounded-full text-sm border transition-all duration-200 ${
                      statusFilter === status
                        ? 'bg-white text-black'
                        : 'text-white border-white hover:bg-white hover:text-black'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop filters */}
          <div className="hidden sm:flex gap-2">
            {['all', 'pending', 'delivered', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-1 rounded-full text-sm border transition-all duration-200 ${
                  statusFilter === status
                    ? 'bg-white text-black'
                    : 'text-white border-white hover:bg-white hover:text-black'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto text-left text-white border border-gray-700">
          <thead className="bg-gray-800 text-sm">
            <tr>
              <th className="p-2">Order ID</th>
              <th className="p-2">Customer</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Status</th>
              <th className="p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((order) => (
              <tr
                key={order._id}
                className="border-t border-gray-600 text-sm hover:bg-gray-700 cursor-pointer"
                onClick={() => alert(`Viewing order ${order._id}`)}
              >
                <td className="p-2">{order._id.slice(-6).toUpperCase()}</td>
                <td className="p-2">{order.customerName}</td>
                <td className="p-2">${order.totalAmount.toFixed(2)}</td>
                <td className="p-2 capitalize">{order.status}</td>
                <td className="p-2">{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 text-sm rounded border ${
                currentPage === page
                  ? 'bg-white text-black'
                  : 'text-white border-white hover:bg-white hover:text-black'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersTable;
