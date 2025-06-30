// frontend/components/ProductList.jsx
"use client";

import React from "react";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { X, ArrowLeft, ArrowRight, Eye, EyeOff, GripVertical } from "lucide-react";
import { CSVLink } from "react-csv";
import Papa from "papaparse";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableRow = ({ id, product, handleCheckboxChange, selectedProducts, toggleVisibility, handleEdit, handleDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr style={style} className="text-center">
      <td className="p-2 text-center">
        <div ref={setNodeRef} {...attributes} {...listeners} className="cursor-grab inline-block">
          <GripVertical className="text-gray-400" />
        </div>
      </td>
      <td className="p-2">
        <input
          type="checkbox"
          checked={selectedProducts.includes(product._id)}
          onChange={() => handleCheckboxChange(product._id)}
        />
      </td>
      <td className="p-2">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-10 w-10 object-cover rounded mx-auto"
          />
        ) : (
          "No Image"
        )}
      </td>
      <td className="p-2">{product.name}</td>
      <td className="p-2">
        {product.discountPrice ? (
          <>
            <span>${product.discountPrice}</span>
            <span className="ml-2 text-gray-400 line-through">
              ${product.price}
            </span>
          </>
        ) : (
          <span>${product.price}</span>
        )}
      </td>
      <td className="p-2">
        {product.stock < 10 ? (
          <span className="text-red-500 font-semibold">
            {product.stock} (Low Stock)
          </span>
        ) : (
          product.stock
        )}
      </td>
      <td className="p-2">{product.category}</td>
      <td className="p-2">{product.status || "active"}</td>
      <td className="p-2">
        <button
          onClick={() => toggleVisibility(product._id, product.visible)}
          className="text-white"
        >
          {product.visible ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      </td>
      <td className="p-2">
        <div className="flex justify-center gap-2">
          <button
            onClick={() => handleEdit(product)}
            className="px-2 py-1 bg-yellow-500 rounded text-xs"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(product._id)}
            className="px-2 py-1 bg-red-600 rounded text-xs"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editProduct, setEditProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [formState, setFormState] = useState({});
  const [isCreating, setIsCreating] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [rawImageInput, setRawImageInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [bulkStatus, setBulkStatus] = useState("");
  const [showCSVDialog, setShowCSVDialog] = useState(false);
  const [csvSuccessMessage, setCSVSuccessMessage] = useState("");
  const [csvFile, setCsvFile] = useState(null);
  const csvInputRef = useRef();

  const productsPerPage = 10;
  const categories = ["Tops", "Bottoms", "Shoes", "Accessories"];
  const sensors = useSensors(useSensor(PointerSensor));


  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProducts(res.data.products || res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = products.findIndex((p) => p._id === active.id);
      const newIndex = products.findIndex((p) => p._id === over?.id);
      setProducts((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  const toggleVisibility = async (id, visible) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${id}`,
        { visible: !visible },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchProducts();
    } catch (error) {
      console.error("Error toggling visibility:", error);
    }
  };

  const handleEditClick = (product) => {
    setEditProduct(product);
    setRawImageInput(product.images?.join(", ") || "");
    setFormState({
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.category,
      description: product.description || '',
      status: product.status || 'active',
      discountPrice: product.discountPrice || '',
      variants: product.variants || '',
      images: product.images || [],
    });
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setFormState({
      name: product.name,
      price: product.price,
      discountPrice: product.discountPrice,
      category: product.category,
      stock: product.stock,
      status: product.status,
      images: product.images,
      visible: product.visible,
    });
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this product?");
    if (!confirm) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };


  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const data = {
        ...formState,
        images: rawImageInput
          .split(',')
          .map((url) => url.trim())
          .filter(Boolean),
      };
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${editProduct._id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditProduct(null);
      setFormState({});
      setRawImageInput("");
      await fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProducts(products.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const bulkDelete = async () => {
    for (const id of selectedProducts) {
      await deleteProduct(id);
    }
    setSelectedProducts([]);
  };

  const handleBulkStatusUpdate = async () => {
    if (!bulkStatus || selectedProducts.length === 0) return;
    try {
      const token = localStorage.getItem("token");
      await Promise.all(
        selectedProducts.map((id) =>
          axios.put(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${id}`,
            { status: bulkStatus },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
        )
      );
      setBulkStatus("");
      setSelectedProducts([]);
      await fetchProducts();
      alert("Status updated successfully");
    } catch (error) {
      console.error("Error updating product status:", error);
      alert("Failed to update status");
    }
  };
  

  const toggleSelectProduct = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleCSVFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setCsvFile(file);
  };

  const handleCSVImport = () => {
    if (!csvFile) return;
    Papa.parse(csvFile, {
      header: true,
      complete: async (results) => {
        const token = localStorage.getItem("token");
        try {
          await Promise.all(
            results.data.map(async (row) => {
              const product = {
                ...row,
                images: (row.images || "").split(',').map((url) => url.trim()).filter(Boolean),
              };
              await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products`,
                product,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
            })
          );
          await fetchProducts();
          setCSVSuccessMessage("Products added successfully!");
          setCsvFile(null);
        } catch (err) {
          console.error("CSV import error:", err);
        }
        setShowCSVDialog(false);
      },
    });
  };

  

  const filteredProducts = products.filter((product) => {
    const matchSearch =
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus =
      statusFilter === "all" || (product.status || 'active') === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleCreateSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const newProduct = {
        ...formState,
        images: formState.images ? [formState.images] : [],
      };
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products`,
        newProduct,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchProducts(); // ✅ Refetch full list
      setIsCreating(false);
      setFormState({});
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };
  

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const csvData = filteredProducts.map(({ _id, ...rest }) => rest);

  const PaginationControls = () => (
    <div className="flex flex-col md:flex-row justify-between items-center gap-2 mt-4 text-white text-sm">
      <div className="text-center md:text-left">
        Showing {paginatedProducts.length} of {filteredProducts.length} products
      </div>
      <div className="flex gap-1 flex-wrap">
        <button
          className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Prev
        </button>
        {[...Array(totalPages).keys()].map((num) => {
          const page = num + 1;
          return (
            <button
              key={page}
              className={`px-3 py-1 rounded ${currentPage === page ? 'bg-blue-600' : 'bg-gray-700'}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          );
        })}
        <button
          className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
  const handleCheckboxChange = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  useEffect(() => {
    console.log("bulkStatus:", bulkStatus);
    console.log("selectedProducts:", selectedProducts);
  }, [bulkStatus, selectedProducts]);
  return (
    <div className="p-4">
      <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by name or category"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-1 text-sm rounded bg-white text-black"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1 rounded text-sm bg-white text-black"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="flex gap-2 items-center">
        <select
          value={bulkStatus}
          onChange={(e) => setBulkStatus(e.target.value)}
          className="bg-gray-800 text-white px-3 py-1 rounded"
        >
          <option value="">Select Status</option>
          <option value="active">Activate</option>
          <option value="inactive">Deactivate</option>
        </select>
        <button
          onClick={handleBulkStatusUpdate}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
          disabled={!bulkStatus || selectedProducts.length === 0}
        >
          Update Status
        </button>
          <button
            className="px-3 py-1 bg-purple-600 text-white rounded text-sm"
            onClick={() => setShowCSVDialog(true)}
          >
            Import CSV
          </button>
          <CSVLink
            data={csvData}
            filename="products.csv"
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
          >
            Export CSV
          </CSVLink>
          <button
            className="px-3 py-1 bg-green-600 text-white rounded text-sm"
            onClick={() => {
              setFormState({});
              setIsCreating(true);
            }}
          >
            Add Product
          </button>
        </div>
      </div>

      {/* CSV Dialog */}
      {showCSVDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Import Products via CSV</h2>
            <input
              type="file"
              accept=".csv"
              ref={csvInputRef}
              onChange={handleCSVFileChange}
              className="w-full text-sm mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-1 bg-gray-500 text-white rounded"
                onClick={() => setShowCSVDialog(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-1 bg-blue-600 text-white rounded"
                onClick={handleCSVImport}
              >
                Import
              </button>
            </div>
            {csvSuccessMessage && (
              <p className="mt-4 text-green-600 text-sm">{csvSuccessMessage}</p>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-white">Loading products...</p>
      ) : (
        <div className="p-4">
      <div className="overflow-x-auto mt-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={paginatedProducts.map((p) => p._id)} strategy={verticalListSortingStrategy}>
            <table className="w-full text-white border border-gray-700 text-center">
              <thead className="bg-gray-800 text-sm">
                <tr>
                  <th className="p-2">Drag</th>
                  <th className="p-2">Select</th>
                  <th className="p-2">Image</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Stock</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Visible</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((product) => (
                  <SortableRow
                  key={product._id}
                  id={product._id}
                  product={product}
                  handleCheckboxChange={handleCheckboxChange}
                  selectedProducts={selectedProducts}
                  toggleVisibility={toggleVisibility}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                />
                ))}
              </tbody>
            </table>
          </SortableContext>
        </DndContext>
      </div>
      <PaginationControls/>
    </div>
      )}
{(editProduct || isCreating) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md bg-white text-black p-6 rounded-lg shadow-lg overflow-y-auto relative max-h-[90vh]">
            <button
              onClick={() => {
                setEditProduct(null);
                setIsCreating(false);
              }}
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4">
              {editProduct ? "Edit Product" : "Create Product"}
            </h2>
            <div className="space-y-2">
              <label className="block text-sm">Product Name</label>
              <input
                name="name"
                value={formState.name || ''}
                onChange={handleFormChange}
                className="w-full px-3 py-1 rounded border text-black"
                placeholder="Product Name"
              />
              <label className="block text-sm">Price</label>
              <input
                name="price"
                type="number"
                value={formState.price || ''}
                onChange={handleFormChange}
                className="w-full px-3 py-1 rounded border text-black"
                placeholder="Price"
              />
              <label className="block text-sm">Discount Price</label>
              <input
                name="discountPrice"
                type="number"
                value={formState.discountPrice || ''}
                onChange={handleFormChange}
                className="w-full px-3 py-1 rounded border text-black"
                placeholder="Discount Price"
              />
              <label className="block text-sm">Variants</label>
              <input
                name="variants"
                value={formState.variants || ''}
                onChange={handleFormChange}
                className="w-full px-3 py-1 rounded border text-black"
                placeholder="e.g., Red, L, Cotton"
              />
              <label className="block text-sm">Stock</label>
              <input
                name="stock"
                type="number"
                value={formState.stock || ''}
                onChange={handleFormChange}
                className="w-full px-3 py-1 rounded border text-black"
                placeholder="Stock"
              />
              <label className="block text-sm">Category</label>
              <select
                name="category"
                value={formState.category || ''}
                onChange={handleFormChange}
                className="w-full px-3 py-1 rounded border text-black"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <label className="block text-sm">Description</label>
              <textarea
                name="description"
                value={formState.description || ''}
                onChange={handleFormChange}
                rows={3}
                placeholder="Description"
                className="w-full px-3 py-1 rounded border text-black"
              />
              <label className="block text-black text-sm mb-1">Image URLs (comma separated)</label>
              <textarea
                name="images"
                value={rawImageInput}
                onChange={(e) => {
                  const value = e.target.value;
                  setRawImageInput(value);
                  setFormState((prev) => ({
                    ...prev,
                    images: value.split(",").map((url) => url.trim()).filter((url) => url),
                  }));
                }}
                rows={3}
                placeholder="Enter image URLs separated by commas"
                className="w-full px-3 py-1 rounded border text-black"
              />
              <label className="block text-black text-sm mb-1" htmlFor="status">
                Status
              </label>
              <select
                name="status"
                value={formState.status || "active"}
                onChange={handleFormChange}
                className="w-full px-3 py-1 rounded border text-black"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-1 bg-gray-500 text-white rounded"
                onClick={() => {
                  setEditProduct(null);
                  setIsCreating(false);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-1 bg-blue-600 text-white rounded"
                onClick={editProduct ? handleFormSubmit : handleCreateSubmit}
              >
                {editProduct ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
        {viewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-4xl bg-white text-black p-6 rounded-lg shadow-lg overflow-y-auto relative max-h-[90vh]">
            <button
              onClick={() => setViewProduct(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4">Product Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                {viewProduct.images?.length > 0 && (
                  <div className="relative w-full h-auto">
                    <img
                      src={viewProduct.images[currentImage]}
                      alt={`Image ${currentImage + 1}`}
                      className="w-full h-auto object-cover rounded"
                    />
                    {viewProduct.images.length > 1 && (
                      <div className="absolute inset-0 flex items-center justify-between px-2">
                        <button
                          onClick={() =>
                            setCurrentImage(
                              (prev) => (prev - 1 + viewProduct.images.length) % viewProduct.images.length
                            )
                          }
                          className="bg-white text-black p-1 rounded-full shadow"
                        >
                          <ArrowLeft size={16} />
                        </button>
                        <button
                          onClick={() =>
                            setCurrentImage(
                              (prev) => (prev + 1) % viewProduct.images.length
                            )
                          }
                          className="bg-white text-black p-1 rounded-full shadow"
                        >
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="space-y-3 text-sm">
                <p className="text-gray-800 whitespace-pre-line">
                  <strong>Description:</strong> {viewProduct.description || 'No description provided.'}
                </p>
                <p><strong>Name:</strong> {viewProduct.name}</p>
                <p><strong>Price:</strong> ${viewProduct.price}</p>
                {viewProduct.discountPrice && <p><strong>Discount Price:</strong> ${viewProduct.discountPrice}</p>}
                {viewProduct.variants && <p><strong>Variants:</strong> {viewProduct.variants}</p>}
                <p><strong>Stock:</strong> {viewProduct.stock}</p>
                <p><strong>Category:</strong> {viewProduct.category}</p>
                <p><strong>Status:</strong> {viewProduct.status || 'active'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
