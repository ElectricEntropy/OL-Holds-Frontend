import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeftIcon, Loader2Icon, PencilIcon } from 'lucide-react';
import { Comic } from '../../types/comic';
const url_prefix = "http://localhost:5000"
//const url_prefix = ""
const fetchComic = async (id: string): Promise<Comic> => {
  const response = await fetch(`${url_prefix}/api/comics/${id}`);
  if (!response.ok) throw new Error('Failed to fetch comic');
  return response.json();
};
export const ComicDetails: React.FC = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const {
    data: comic,
    isLoading
  } = useQuery({
    queryKey: ['comic', id],
    queryFn: () => fetchComic(id!),
    enabled: !!id
  });
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[200px]">
        <Loader2Icon className="h-8 w-8 animate-spin text-indigo-600" />
      </div>;
  }
  if (!comic) {
    return null;
  }
  return <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <button onClick={() => navigate('/comics')} className="text-gray-600 hover:text-gray-900 flex items-center mb-4">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Comics
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {comic.title} {comic.issue_number}
          </h1>
          <p className="text-gray-500">{comic.publisher} {comic.is_custom ? ' (Custom)' : comic.distributor}</p>
          <p className="text-gray-500">Release Date: {new Date(comic.release_date).toLocaleDateString("en-US", {timeZone: "America/Chicago"})}</p>
        </div>
        <button onClick={() => navigate(`/comics/${id}/edit`, { state: comic })} className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <PencilIcon className="h-4 w-4 mr-2" />
          Edit Comic
        </button>
      </div>
    </div>
};