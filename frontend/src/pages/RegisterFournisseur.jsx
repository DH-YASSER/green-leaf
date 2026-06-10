import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const RegisterFournisseur = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    // Step 1
    name: '',
    email: '',
    password: '',
    // Step 2
    company_name: '',
    phone: '',
    city: '',
    address: '',
    ice_number: '',
    category: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleNext = () => {
    // Basic validation for step 1
    if (step === 1) {
      if (!form.name || !form.email || !form.password) {
        setError('Please fill all required fields');
        return;
      }
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Prepare data for API (assuming the endpoint expects a single object)
      const response = await axios.post('/api/auth/register', {
        ...form,
        role: 'fournisseur', // We are registering as supplier
      });
      // Assuming response.data contains { user, token }
      const { user, token } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('role', user.role);
      navigate('/fournisseur/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <img className="mx-auto h-12 w-auto" src="/vite.svg" alt="Markeat logo" />
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Create your supplier account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join thousands of suppliers growing their business on Markeat
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Progress indicator */}
          <div className="flex items-center space-x-4 text-sm font-medium">
            <div className="flex items-center">
              <div className={`w-3 h-3 bg-${step >= 1 ? '#16a34a' : '#e5e7eb'} rounded-full`} />
              <div className="mx-1">1</div>
            </div>
            <div className="flex items-center">
              <div className={`w-3 h-3 bg-${step === 2 ? '#16a34a' : '#e5e7eb'} rounded-full`} />
              <div className="mx-1">2</div>
            </div>
          </div>

          {step === 1 && (
            <>
              <div className="space-y-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="mt-1 block w-px min-w-0 flex-auto border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-brand-accent focus:border-brand-primary sm:text-sm"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                />

                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mt-4">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 block w-px min-w-0 flex-auto border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-brand-accent focus:border-brand-primary sm:text-sm"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />

                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mt-4">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="mt-1 block w-px min-w-0 flex-auto border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-brand-accent focus:border-brand-primary sm:text-sm"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={loading}
                  className={`group w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent disabled:opacity-50`}
                >
                  Next Step
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-4">
                <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <input
                  id="company_name"
                  name="company_name"
                  type="text"
                  required
                  className="mt-1 block w-px min-w-0 flex-auto border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-brand-accent focus:border-brand-primary sm:text-sm"
                  value={form.company_name}
                  onChange={handleChange}
                />

                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mt-4">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="mt-1 block w-px min-w-0 flex-auto border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-brand-accent focus:border-brand-primary sm:text-sm"
                  value={form.phone}
                  onChange={handleChange}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      required
                      className="mt-1 block w-px min-w-0 flex-auto border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-brand-accent focus:border-brand-primary sm:text-sm"
                      value={form.city}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="ice_number" className="block text-sm font-medium text-gray-700">
                      ICE Number
                    </label>
                    <input
                      id="ice_number"
                      name="ice_number"
                      type="text"
                      required
                      className="mt-1 block w-px min-w-0 flex-auto border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-brand-accent focus:border-brand-primary sm:text-sm"
                      value={form.ice_number}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mt-4">
                  Address
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  required
                  className="mt-1 block w-px min-w-0 flex-auto border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-brand-accent focus:border-brand-primary sm:text-sm"
                  value={form.address}
                  onChange={handleChange}
                />

                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mt-4">
                  Category (Dropdown)
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  className="mt-1 block w-px min-w-0 flex-auto border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-brand-accent focus:border-brand-primary sm:text-sm"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="">Select a category</option>
                  <option value="legumes">Vegetables</option>
                  <option value="viandes">Meats</option>
                  <option value="boissons">Beverages</option>
                  <option value="epices">Spices</option>
                  <option value="secs">Dry Goods</option>
                </select>

                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mt-4">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  required
                  className="mt-1 block w-px min-w-0 flex-auto border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-brand-accent focus:border-brand-primary sm:text-sm"
                  value={form.description}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`group w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent disabled:opacity-50`}
                >
                  Create Account
                </button>
              </div>
            </>
          )}
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-secondary hover:text-brand-primary">
            Sign in
          </Link>
        </p>

        <div className="text-center text-xs text-gray-400">
          <Link to="/admin/login" className="hover:text-gray-500">
            Staff access
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterFournisseur;
