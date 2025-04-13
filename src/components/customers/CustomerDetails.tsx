import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeftIcon, Loader2Icon, PencilIcon } from 'lucide-react';
import { Customer } from '../../types/customer';
import { PullListManager } from './pull-list/PullListManager';
const fetchCustomer = async (id: string): Promise<Customer> => {
  const response = await fetch(`/api/customers/${id}`);
  if (!response.ok) throw new Error('Failed to fetch customer');
  let dummyData:Customer = {
    id: "1",
    firstName: "Jared",
    lastName: "Colburn",
    email: "email@email",
    company: "Yup",
    phoneNumber: "615-852-9712",
    storeCredit: 15
}
return dummyData;
  //return response.json();
};
export const CustomerDetails: React.FC = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const {
    data: customer,
    isLoading
  } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => fetchCustomer(id!),
    enabled: !!id
  });
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[200px]">
        <Loader2Icon className="h-8 w-8 animate-spin text-indigo-600" />
      </div>;
  }
  if (!customer) {
    return null;
  }
  return <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <button onClick={() => navigate('/')} className="text-gray-600 hover:text-gray-900 flex items-center mb-4">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Customers
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {customer.firstName} {customer.lastName}
          </h1>
          <p className="text-gray-500">{customer.email}</p>
        </div>
        <button onClick={() => navigate(`/customers/${id}/edit`)} className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <PencilIcon className="h-4 w-4 mr-2" />
          Edit Customer
        </button>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-8">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Company</h3>
          <p className="mt-1 text-gray-900">{customer.company}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
          <p className="mt-1 text-gray-900">{customer.phoneNumber}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Store Credit</h3>
          <p className="mt-1 text-gray-900">
            ${customer.storeCredit.toFixed(2)}
          </p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <PullListManager customerId={id!} />
      </div>
    </div>;
};