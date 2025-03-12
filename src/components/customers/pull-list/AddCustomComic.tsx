import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2Icon } from 'lucide-react';
import { Comic } from '../../../types/comic';
const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  publisher: z.string().min(1, 'Publisher is required')
});
type FormData = z.infer<typeof schema>;
interface AddCustomComicProps {
  onAdd: (comic: Comic) => void;
  onCancel: () => void;
  isAdding: boolean;
}
export const AddCustomComic: React.FC<AddCustomComicProps> = ({
  onAdd,
  onCancel,
  isAdding
}) => {
  const {
    register,
    handleSubmit,
    formState: {
      errors
    }
  } = useForm<FormData>({
    resolver: zodResolver(schema)
  });
  const onSubmit = (data: FormData) => {
    onAdd({
      id: `custom-${Date.now()}`,
      ...data,
      isCustom: true
    });
  };
  return <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-gray-50 p-4 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Comic Title
        </label>
        <input type="text" {...register('title')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Publisher
        </label>
        <input type="text" {...register('publisher')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        {errors.publisher && <p className="mt-1 text-sm text-red-600">
            {errors.publisher.message}
          </p>}
      </div>
      <div className="flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Cancel
        </button>
        <button type="submit" disabled={isAdding} className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
          {isAdding && <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />}
          Add Custom Comic
        </button>
      </div>
    </form>;
};