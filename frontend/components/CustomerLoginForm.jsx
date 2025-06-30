"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const CustomerLoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setIsLoading] = useState(false); // ✅ ADD THIS LINE

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/customers/login`,
        { email, password }
      );
  
      const { token } = res.data;
      localStorage.setItem("customerToken", token);
  
      // Optional redirect
      router.push("/shop");
    } catch (err) {
      console.error(
        "Login Error:",
        err.response?.data || err.message || "Unknown error"
      );
  
      alert(
        err.response?.data?.message ||
          "Login failed. Please check your credentials or try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5dc]">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4 text-black text-center">Customer Login</h2>

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
          disabled={loading}
          className="w-full bg-[#333] text-white p-2 rounded hover:bg-[#555]"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="mt-4 text-sm text-center text-black">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </div>

        <div className="mt-2 text-xs text-center">
          <a href="/admin" className="text-gray-500 hover:underline">
            Are you an admin?
          </a>
        </div>
      </form>
    </div>
  );
};

export default CustomerLoginForm;
