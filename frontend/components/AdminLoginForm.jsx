"use client";

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const AdminLoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showBrandAnimation, setShowBrandAnimation] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/login`, {
        email,
        password,
      });

      const { token } = res.data;
      localStorage.setItem('token', token);

      setShowBrandAnimation(true); // Trigger brand animation
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500); // Delay to show animation
    } catch (err) {
        console.error('Login Error:', err.response?.data || err.message);
        alert('Login failed.');
        setIsLoading(false);
      }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5dc] transition-all duration-500">
    {showBrandAnimation ? (
      <div className="text-5xl sm:text-7xl font-bold text-[#222] animate-fade-in-up">
        <h1 className="text-4xl font-extrabold text-center pulse-glow">HxA</h1>
      </div>
    ) : (
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-96 transition-all duration-500"
      >
        <h2 className="text-xl font-bold mb-4 text-black text-center">Admin Login</h2>

        <input
          type="email"
          className="w-full p-2 border rounded mb-3 text-black"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="w-full p-2 border rounded mb-3 text-black"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#333] text-white text-sm sm:text-base p-2 rounded hover:bg-[#555] active:scale-95 transition-all duration-200 ease-in-out"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        {/* 👇 Added this below the button */}
        <p className="mt-4 text-sm text-center text-black">
          Not an admin?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login as customer
          </a>
        </p>
      </form>
    )}
  </div>
  );
};

export default AdminLoginForm;