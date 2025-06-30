// app/shop/page.jsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import DiscountCarousel from "@/components/DiscountCarousel";
import { ShoppingCart } from "lucide-react";
import { CircleUser } from "lucide-react";

export default function ShopPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/public`)
      .then((res) => setProducts(res.data))
      .catch((err) => {
        console.error("Failed to load products", err);
      });
  }, []);

  const categories = [
    { name: "T-Shirt", position: "-10px -65px" },
    { name: "Hoodie", position: "-87px -67px" },
    { name: "Dress", position: "-158px -65px" },
    { name: "Blazer", position: "-231px -67px" },
    { name: "Pants", position: "-14px -170px" },
    { name: "Skirt", position: "-87px -170px" },
    { name: "Hat", position: "-160px -170px" },
    { name: "Bag", position: "-232px -173px" },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5dc] text-black">
      {/* Section 1: Message Slider */}
      <div className="overflow-hidden whitespace-nowrap bg-black text-white py-2">
        <div className="animate-marquee inline-block">
          <span className="mx-4">SAVE NOW: FREE SHIPPING OVER ₹599 •</span>
          <span className="mx-4">15-DAY FREE RETURNS •</span>
          <span className="mx-4">HASSLE-FREE REFUNDS •</span>
          <span className="mx-4">EXTRA 10% OFF ON PREPAID PAYMENTS •</span>
        </div>
      </div>

      {/* Section 2: Navbar */}
      <nav className="flex justify-between items-center p-4 bg-[#f5f5dc] shadow">
        <h1 className="text-2xl font-bold">HxA</h1>
        <div className="flex gap-6">
          <a href="/shop" className="hover:font-bold">
            SHOP
          </a>
          <a
            href="/profile"
            className="hover:font-bold flex items-center gap-1"
          >
            <CircleUser className="w-5 h-5" />
          </a>
          <a href="/cart" className="hover:font-bold flex items-center gap-1">
            <ShoppingCart className="w-5 h-5" />
          </a>
        </div>
      </nav>

      {/* Section 3: Discount Carousel */}
      <div>
        <DiscountCarousel />
      </div>

      {/* Section 4: Categories */}
      <div className="px-4 py-6 sm:px-6 bg-[#e8dece]">
        <h2 className="text-2xl sm:text-3xl md:text-4xl mb-6 text-center sm:text-left">
          Categories
        </h2>
        <div className="flex gap-4 space-x-6 overflow-x-auto no-scrollbar snap-x snap-mandatory">
          {categories.map((cat) => (
            <a
              key={cat.name}
              href={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="flex-shrink-0 w-24 flex flex-col items-center text-center"
            >
              <div
                className="category-icon mb-2"
                style={{ backgroundPosition: cat.position }}
              />
              <span className="text-sm">{cat.name}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Section 5: Bestsellers */}
      <div className="px-4 py-6 sm:px-6 bg-[#f5f5dc]">
        <h2 className="text-2xl sm:text-3xl md:text-4xl mb-6 text-center sm:text-left">
          Bestselling
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.slice(-8).map((product) => (
            <div
              key={product._id}
              className=""
            >
              {product.images?.[0] ? (
                <img
                  src={product.images[0]}
                  className="product-grid"
                  alt={product.name}
                />
              ) : (
                <div className="bg-transparent text-gray-500 text-sm text-center preview-grid">
                  No image available
                </div>
              )}
              <h3 className="product-font">
                {product.name}
              </h3>

              <div className="flex items-center gap-2 space-x-6">
                <p className="text-red-700 font-bold text-base">
                  ₹{product.discountPrice || product.price}
                </p>
                {product.discountPrice && (
                  <p className="text-gray-500 line-through text-sm">
                    ₹{product.price}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 5: Footer */}
      <footer className="bg-black text-white text-sm p-4 text-center">
        <div className="mb-2">
          <a href="/about" className="mx-2 hover:underline">
            About
          </a>
          <a href="/contact" className="mx-2 hover:underline">
            Contact
          </a>
          <a href="/faq" className="mx-2 hover:underline">
            FAQ
          </a>
        </div>
        <p>&copy; {new Date().getFullYear()} HxA. All rights reserved.</p>
      </footer>
    </div>
  );
}
