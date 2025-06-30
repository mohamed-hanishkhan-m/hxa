'use client';

import React, { useEffect, useState } from 'react';
import {
  CircularProgressbar,
  buildStyles,
} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios';

const DashboardOverview = () => {
    const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // ✅ This is the key line you asked about
        const token = localStorage.getItem('token');

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/dashboard/status`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setStats(res.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <p className="text-white">Loading stats...</p>;
  }

  if (!stats) {
    return <p className="text-red-500">Failed to load dashboard data.</p>;
  }

  const progressItems = [
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      max: 200,
      color: '#4B5563',
    },
    {
        label: 'Cancelled',
        value: stats.cancelled,
        max: 100,
        color: '#EF4444', // Tailwind red-500
    },
    {
      label: 'Pending',
      value: stats.pending,
      max: 100,
      color: '#D97706',
    },
    {
      label: 'Delivered',
      value: stats.delivered,
      max: 200,
      color: '#10B981',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-6 px-4 border rounded border-white-600">
      {progressItems.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col items-center bg-transparent shadow-none p-4"
        >
          <div className="w-20 h-20 mb-3">
            <CircularProgressbar
              value={stat.value}
              maxValue={stat.max}
              text={`${stat.value}`}
              styles={buildStyles({
                pathColor: stat.color,
                textColor: '#fff',
                trailColor: 'transparent',
                textSize: '16px',
              })}
            />
          </div>
          <span className="text-sm font-semibold text-white">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default DashboardOverview;
