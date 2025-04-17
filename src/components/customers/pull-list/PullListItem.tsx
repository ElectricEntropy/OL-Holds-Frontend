import React from 'react';
import { Loader2Icon, TrashIcon } from 'lucide-react';
import { Comic } from '../../../types/comic';

interface PullListItemProps {
  comic: Comic;
  onRemove: () => void;
  isRemoving: boolean;
}
export const PullListItem: React.FC<PullListItemProps> = ({
  comic,
  onRemove,
  isRemoving
}) => {
  return <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
      <div>
        <h4 className="font-medium text-gray-900">{comic.title} {comic.issue_number}</h4>
        <p className="text-sm text-gray-500">
          {comic.publisher}
          {comic.is_custom && ' (Custom)'}
        </p>
      </div>
      <button onClick={onRemove} disabled={isRemoving} className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
        {isRemoving ? <Loader2Icon className="h-5 w-5 animate-spin" /> : <TrashIcon className="h-5 w-5" />}
        <span className="sr-only">Remove {comic.title}</span>
      </button>
    </div>;
};