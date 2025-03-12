import React from 'react';
import { UserIcon } from 'lucide-react';
import { Customer } from '../../types/customer';
interface CustomerCardProps {
  customer: Customer;
  onClick: () => void;
}
export const CustomerCard: React.FC<CustomerCardProps> = ({
  customer,
  onClick
}) => {
  return <div onClick={onClick} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100">
      <div className="flex items-center space-x-4">
        <div className="bg-indigo-100 p-2 rounded-full">
          <UserIcon className="h-6 w-6 text-indigo-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">
            {customer.firstName} {customer.lastName}
          </h3>
          <p className="text-sm text-gray-500">{customer.company}</p>
          <p className="text-sm text-gray-400">{customer.email}</p>
        </div>
      </div>
    </div>;
};