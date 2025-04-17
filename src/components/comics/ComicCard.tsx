import React from 'react';
import { BookText } from 'lucide-react';
import { Comic } from '../../types/comic';
interface ComicCardProps {
  comic: Comic;
  onClick: () => void;
}
export const ComicCard: React.FC<ComicCardProps> = ({
  comic,
  onClick
}) => {
  return <div onClick={onClick} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100">
      <div className="flex items-center space-x-4">
        <div className="bg-indigo-100 p-2 rounded-full">
          <BookText className="h-6 w-6 text-indigo-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">
            {comic.title} {comic.issue_number}
          </h3>
          <p className="text-sm text-gray-400">{comic.publisher}
            {comic.is_custom && ' (Custom)'}
          </p>
        </div>
      </div>
    </div>;
};