import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import axios from '../../api/axios';
import { Link } from 'react-router-dom';

const FournisseurProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    unit: '',
    min_order_qty: '',
    stock: '',
    delivery_zones: '',
    delivery_delay: '',
    images: [],
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('/api/fournisseur/products');
        setProducts(response.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setForm(prev => ({ ...prev, images: [] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editProductId) {
        // Update existing product
        await axios.put(`/api/fournisseur/products/${editProductId}`, form);
      } else {
        // Create new product
        await axios.post('/api/fournisseur/products', form);
      }
      // Close modals and reset form
      setShowAddModal(false);
      setShowEditModal(false);
      setForm({
        name: '',
        category: '',
        description: '',
        price: '',
        unit: '',
        min_order_qty: '',
        stock: '',
        delivery_zones: '',
        delivery_delay: '',
        images: [],
      });
      // Refetch products
      const response = await axios.get('/api/fournisseur/products');
      setProducts(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`/api/fournisseur/products/${id}`);
      // Refetch products
      const response = await axios.get('/api/fournisseur/products');
      setProducts(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;

  return (
    <DashboardLayout title="Manage Products" navLinks={[
      { path: '/fournisseur/dashboard', label: 'Dashboard', active: false },
      { path: '/fournisseur/products', label: 'Products', active: true },
      { path: '/fournisseur/promotions', label: 'Promotions', active: false },
      { path: '/fournisseur/orders', label: 'Orders', active: false },
      { path: '/fournisseur/messages', label: 'Messages', active: false },
    ]}>
      <div className="space-y-6">
        {/* Header with Add Product button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Product List</h2>
          <button
            onClick={() => {
              setShowAddModal(true);
              setEditProductId(null);
              setForm({
                name: '',
                category: '',
                description: '',
                price: '',
                unit: '',
                min_order_qty: '',
                stock: '',
                delivery_zones: '',
                delivery_delay: '',
                images: [],
              });
            }}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <span className="mr-2">+</span> Add Product
          </button>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 flex items-center space-x-3">
                        {/* Product image placeholder */}
                        <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-500 text-sm">IMG</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.price} {product.unit || ''}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.stock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm flex space-x-2">
                        <button
                          onClick={() => {
                            setEditProductId(product.id);
                            setForm({
                              name: product.name,
                              category: product.category,
                              description: product.description || '',
                              price: product.price,
                              unit: product.unit,
                              min_order_qty: product.min_order_qty || '',
                              stock: product.stock,
                              delivery_zones: product.delivery_zones || '',
                              delivery_delay: product.delivery_delay || '',
                              images: product.images || [],
                            });
                            setShowEditModal(true);
                          }}
                          className="px-3 py-1 bg-indigo-500 text-white rounded-md text-sm hover:bg-indigo-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Product Modal */}
        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {editProductId ? 'Edit Product' : 'Add Product'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    required
                    value={form.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select a category</option>
                    <option value="legumes">Vegetables</option>
                    <option value="viandes">Meats</option>
                    <option value="boissons">Beverages</option>
                    <option value="epices">Spices</option>
                    <option value="secs">Dry Goods</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows="3"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      Price
                    </label>
                    <input
                      id="price"
                      type="number"
                      required
                      value={form.price}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                      Unit
                    </label>
                    <input
                      id="unit"
                      type="text"
                      value={form.unit}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="min_order_qty" className="block text-sm font-medium text-gray-700 mb-1">
                      Min Order Qty
                    </label>
                    <input
                      id="min_order_qty"
                      type="number"
                      value={form.min_order_qty}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                      Stock
                    </label>
                    <input
                      id="stock"
                      type="number"
                      value={form.stock}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="delivery_zones" className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Zones
                    </label>
                    <input
                      id="delivery_zones"
                      type="text"
                      value={form.delivery_zones}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="delivery_delay" className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Delay (days)
                    </label>
                    <input
                      id="delivery_delay"
                      type="number"
                      value={form.delivery_delay}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
                    Product Images (max 5)
                  </label>
                  <input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    You can upload up to 5 images. (Note: actual upload handling is not implemented in this frontend code)
                  </p>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {editProductId ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FournisseurProducts;