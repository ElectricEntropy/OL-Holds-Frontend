import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2Icon } from 'lucide-react';
import type { Comic, ComicFormData } from '../../types/comic';
const url_prefix = "http://localhost:5000"
//const url_prefix = ""
const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  issue_number: z.coerce.number(),
  publisher: z.string().min(1, 'Publisher is required'),
  is_custom: z.boolean()
});
const form_prefilled_data = {
  comic_title: "Visible Default",
  issue_number: 0,
  publisher: "",
  is_custom: false,
};
const handlePreviousData = (existingData: ComicFormData) => {
  //existingData.publication_date = existingData.publication_date.split("T")[0]
  Object.assign(form_prefilled_data, existingData);
};
const resetData = () => {
  Object.assign(form_prefilled_data, {
    comic_title: "Visible Default",
    issue_number: 0,
    publisher: "",
    is_custom: false,
  })
}
type FormData = z.infer<typeof schema>;
const createComic = async (data: ComicFormData): Promise<Comic> => {
  const response = await fetch(`${url_prefix}/api/comics`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to create comic');
  return response.json();
};
const updateComic = async ({
  id,
  data,
}: {
  id: string;
  data: ComicFormData;
}): Promise<Comic> => {
  const response = await fetch(`${url_prefix}/api/comics/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to update comic');
  return response.json();
};
export const ComicForm: React.FC = () => {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  location.state ? handlePreviousData(location.state) : resetData();
  const queryClient = useQueryClient();
  const isEditing = Boolean(id);
  const {
    register,
    handleSubmit,
    formState: {
      errors
    }
  } = useForm<FormData>({
    defaultValues: form_prefilled_data,
    resolver: zodResolver(schema)
  });
  const mutation = useMutation({
    mutationFn: (data: ComicFormData) => isEditing ? updateComic({
      id: id!,
      data
    }) : createComic(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['comics']
      });
      toast.success(isEditing ? 'Comic updated successfully' : 'Comic added successfully');
      navigate('/comics');
    },
    onError: error => {
      toast.error(`Error: ${error.message}`);
    }
  });
  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };
  const onCancel = () => {
    mutation.reset
    navigate('/comics');
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
          Issue Number
        </label>
        <input type="text" {...register('issue_number')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        {errors.issue_number && <p className="mt-1 text-sm text-red-600">
            {errors.issue_number.message}
          </p>}
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
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Is Custom Item
        </label>
        <input type="checkbox" {...register('is_custom')} />
      </div>
      <div className="flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Cancel
        </button>
        <button type="submit" disabled={mutation.isPending} className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
          {mutation.isPending && <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />}
          {isEditing ? 'Update Comic' : 'Add Comic'}
        </button>
      </div>
    </form>;
};