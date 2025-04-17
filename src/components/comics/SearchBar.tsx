import React from 'react';
import { SearchIcon, XIcon } from 'lucide-react';
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}
export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange
}) => {
  return <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <SearchIcon className="h-5 w-5 text-gray-400" />
      </div>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} className="block w-full rounded-lg border-gray-300 pl-10 pr-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="Search by title, publisher, or issue number..." />
      {value && <button onClick={() => onChange('')} className="absolute inset-y-0 right-0 flex items-center pr-3 hover:text-gray-600">
          <XIcon className="h-5 w-5 text-gray-400" />
          <span className="sr-only">Clear search</span>
        </button>}
    </div>;
};