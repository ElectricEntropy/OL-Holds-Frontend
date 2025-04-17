import React, { useMemo, useState } from 'react';
import { SearchIcon } from 'lucide-react';
import { Comic } from '../../../types/comic';
import { Pull } from '../../../types/pull';
interface ComicSearchProps {
  comics: Comic[];
  onSelect: (comic: Comic) => void;
  disabled: boolean;
  existingPullList: Pull[];
}
export const ComicSearch: React.FC<ComicSearchProps> = ({
  comics,
  onSelect,
  disabled,
  existingPullList
}) => {
  const [query, setQuery] = useState('');
  const filteredComics = useMemo(() => {
    if (!query) return [];
    const search = query.toLowerCase();
    const existingIds = new Set(existingPullList.map(pull => pull.comic_id));
    return comics.filter(comic => !existingIds.has(comic.id) && (comic.title.toLowerCase().includes(search) || comic.publisher.toLowerCase().includes(search))).slice(0, 5);
  }, [comics, query, existingPullList]);
  return <div className="relative">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <SearchIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input type="text" className="block w-full rounded-lg border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="Search for comics to add..." value={query} onChange={e => setQuery(e.target.value)} />
      </div>
      {filteredComics.length > 0 && <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg">
          <ul className="max-h-60 overflow-auto rounded-md py-1 text-base">
            {filteredComics.map(comic => <li key={comic.id} className="relative cursor-pointer select-none py-2 px-3 hover:bg-gray-100" onClick={() => {
          onSelect(comic);
          setQuery('');
        }}>
                <div className="flex justify-between">
                  <p className="font-medium text-gray-900">{comic.title} {comic.issue_number}</p>
                  <p className="text-sm text-gray-500">{comic.publisher}</p>
                </div>
              </li>)}
          </ul>
        </div>}
    </div>;
};