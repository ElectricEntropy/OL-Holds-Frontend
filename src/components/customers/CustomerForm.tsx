import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeftIcon, Loader2Icon } from 'lucide-react';
import type { Customer, CustomerFormData } from '../../types/customer';
const schema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  birth_date: z.string().date('Invalid date'),
  //company: z.string().min(1, 'Company is required'),
  phone_number: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(12, 'Phone number may only have 12 digits'),
  store_credit: z.number().min(0, 'Store credit cannot be negative'),
  comic_discount: z.number()
    .min(0, 'Discount cannot be negative')
    .max(100, 'Discount cannot exceed 100%'),
  notes: z.string()
});
type FormData = z.infer<typeof schema>;
const createCustomer = async (data: CustomerFormData): Promise<Customer> => {
  const response = await fetch('/api/customers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to create customer');
  return response.json();
};
const updateCustomer = async ({
  id,
  data
}: {
  id: string;
  data: CustomerFormData;
}): Promise<Customer> => {
  const response = await fetch(`/api/customers/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to update customer');
  return response.json();
};
export const CustomerForm: React.FC = () => {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = Boolean(id);
  const {
    register,
    handleSubmit,
    formState: {
      errors
    }
  } = useForm<FormData>({
    resolver: zodResolver(schema)
  });
  const mutation = useMutation({
    mutationFn: (data: CustomerFormData) => isEditing ? updateCustomer({
      id: id!,
      data
    }) : createCustomer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['customers']
      });
      toast.success(isEditing ? 'Customer updated successfully' : 'Customer created successfully');
      navigate('/');
    },
    onError: error => {
      toast.error(`Error: ${error.message}`);
    }
  });
  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };
  return <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex items-center">
        <button onClick={() => navigate('/')} className="text-gray-600 hover:text-gray-900 flex items-center">
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Customers
        </button>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {isEditing ? 'Edit Customer' : 'Add New Customer'}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input type="text" {...register('first_name')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            {errors.first_name && <p className="mt-1 text-sm text-red-600">
                {errors.first_name.message}
              </p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input type="text" {...register('last_name')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            {errors.last_name && <p className="mt-1 text-sm text-red-600">
                {errors.last_name.message}
              </p>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input type="email" {...register('email')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>
        {/* <div>
          <label className="block text-sm font-medium text-gray-700">
            Company
          </label>
          <input type="text" {...register('company')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          {errors.company && <p className="mt-1 text-sm text-red-600">
              {errors.company.message}
            </p>}
        </div> */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input type="tel" {...register('phone_number')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          {errors.phone_number && <p className="mt-1 text-sm text-red-600">
              {errors.phone_number.message}
            </p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Birth Date
          </label>
          <input type="date" {...register('birth_date')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          {errors.birth_date && <p className="mt-1 text-sm text-red-600">
              {errors.birth_date.message}
            </p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Store Credit
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input type="number" step="0.01" {...register('store_credit', {
            valueAsNumber: true
          })} className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          {errors.store_credit && <p className="mt-1 text-sm text-red-600">
              {errors.store_credit.message}
            </p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Comic Discount
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">%</span>
            </div>
            <input type="number" step="0.01" {...register('comic_discount', {
            valueAsNumber: true
          })} className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          {errors.comic_discount && <p className="mt-1 text-sm text-red-600">
              {errors.comic_discount.message}
            </p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <input type="notes" {...register('notes')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>}
        </div>
        <div className="flex justify-end">
          <button type="submit" disabled={mutation.isPending} className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
            {mutation.isPending ? <Loader2Icon className="h-4 w-4 mr-2 animate-spin" /> : null}
            {isEditing ? 'Update Customer' : 'Create Customer'}
          </button>
        </div>
      </form>
    </div>;
};