import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AlertCircleIcon, PlusIcon } from 'lucide-react';
import { CustomerCard } from './CustomerCard';
import { SearchBar } from './SearchBar';
import { Customer } from '../../types/customer';
const fetchCustomers = async (): Promise<Customer[]> => {
  const response = await fetch('/api/customers');
  if (!response.ok) {
    throw new Error('Failed to fetch customers');
  }
  return response.json();
};
export const CustomerList: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const {
    data,
    isLoading,
    error
  } = useQuery<Customer[], Error>({
    queryKey: ['customers'],
    queryFn: fetchCustomers
  });
  const filteredCustomers = useMemo(() => {
    if (!data) return [];
    if (!searchQuery) return data;
    const query = searchQuery.toLowerCase();
    return data.filter(customer => {
      const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
      return fullName.includes(query) || customer.email.toLowerCase().includes(query) || customer.company.toLowerCase().includes(query);
    });
  }, [data, searchQuery]);
  if (error) {
    return <div className="bg-red-50 p-4 rounded-lg flex items-center space-x-3">
        <AlertCircleIcon className="h-5 w-5 text-red-500" />
        <p className="text-red-600">Error loading customers: {error.message}</p>
      </div>;
  }
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <button onClick={() => navigate('/customers/new')} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Customer
        </button>
      </div>
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      {isLoading ? <div className="space-y-4">
          {[...Array(3)].map((_, index) => <div key={index} className="bg-white p-4 rounded-lg animate-pulse h-24">
              <div className="flex items-center space-x-4">
                <div className="bg-gray-200 p-2 rounded-full h-10 w-10" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            </div>)}
        </div> : filteredCustomers.length === 0 ? <div className="text-center py-12">
          <p className="text-gray-500">
            {searchQuery ? 'No customers found matching your search.' : 'No customers yet.'}
          </p>
        </div> : <div className="space-y-4">
          {filteredCustomers.map(customer => <CustomerCard key={customer.id} customer={customer} onClick={() => navigate(`/customers/${customer.id}`)} />)}
        </div>}
    </div>;
};