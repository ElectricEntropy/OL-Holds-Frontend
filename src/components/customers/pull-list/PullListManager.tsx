import React, { useState, Component } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertCircleIcon, Loader2Icon, PlusIcon } from 'lucide-react';
import { Comic, PullListItem } from '../../../types/comic';
import { ComicSearch } from './ComicSearch';
import { PullListItem as PullListItemComponent } from './PullListItem';
import { AddCustomComic } from './AddCustomComic';
import { toast } from 'sonner';
interface PullListManagerProps {
  customerId: string;
}
const fetchComics = async (): Promise<Comic[]> => {
  const response = await fetch('/api/comics');
  if (!response.ok) throw new Error('Failed to fetch comics');
  return response.json();
};
const fetchCustomerPullList = async (customerId: string): Promise<PullListItem[]> => {
  const response = await fetch(`/api/customers/${customerId}/pull-list`);
  if (!response.ok) throw new Error('Failed to fetch pull list');
  return response.json();
};
export const PullListManager: React.FC<PullListManagerProps> = ({
  customerId
}) => {
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const queryClient = useQueryClient();
  const {
    data: comics,
    isLoading: isLoadingComics
  } = useQuery({
    queryKey: ['comics'],
    queryFn: fetchComics
  });
  const {
    data: pullList,
    isLoading: isLoadingPullList,
    error
  } = useQuery({
    queryKey: ['pullList', customerId],
    queryFn: () => fetchCustomerPullList(customerId)
  });
  const addToListMutation = useMutation({
    mutationFn: async (comic: Comic) => {
      const response = await fetch(`/api/customers/${customerId}/pull-list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(comic)
      });
      if (!response.ok) throw new Error('Failed to add comic to pull list');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['pullList', customerId]
      });
      toast.success('Comic added to pull list');
    },
    onError: error => {
      toast.error(`Error adding comic: ${error.message}`);
    }
  });
  const removeFromListMutation = useMutation({
    mutationFn: async (comicId: string) => {
      const response = await fetch(`/api/customers/${customerId}/pull-list/${comicId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to remove comic from pull list');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['pullList', customerId]
      });
      toast.success('Comic removed from pull list');
    },
    onError: error => {
      toast.error(`Error removing comic: ${error.message}`);
    }
  });
  const handleAddComic = (comic: Comic) => {
    addToListMutation.mutate(comic);
  };
  const handleRemoveComic = (comicId: string) => {
    removeFromListMutation.mutate(comicId);
  };
  if (error) {
    return <div className="bg-red-50 p-4 rounded-lg flex items-center space-x-3">
        <AlertCircleIcon className="h-5 w-5 text-red-500" />
        <p className="text-red-600">Error loading pull list: {error.message}</p>
      </div>;
  }
  const isLoading = isLoadingComics || isLoadingPullList;
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Pull List</h2>
        <button onClick={() => setIsAddingCustom(true)} className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <PlusIcon className="h-4 w-4 mr-1" />
          Add Custom Title
        </button>
      </div>
      <ComicSearch comics={comics || []} onSelect={handleAddComic} disabled={addToListMutation.isPending} existingPullList={pullList || []} />
      {isAddingCustom && <AddCustomComic onAdd={handleAddComic} onCancel={() => setIsAddingCustom(false)} isAdding={addToListMutation.isPending} />}
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Current Pull List
        </h3>
        {isLoading ? <div className="flex items-center justify-center py-8">
            <Loader2Icon className="h-6 w-6 text-indigo-600 animate-spin" />
          </div> : pullList?.length === 0 ? <p className="text-center py-8 text-gray-500">
            No comics in pull list yet.
          </p> : <div className="space-y-3">
            {pullList?.map(comic => <PullListItemComponent key={comic.id} comic={comic} onRemove={() => handleRemoveComic(comic.id)} isRemoving={removeFromListMutation.isPending} />)}
          </div>}
      </div>
    </div>;
};