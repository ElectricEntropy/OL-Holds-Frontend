import React from 'react';
import { Loader2Icon, TrashIcon } from 'lucide-react';
import { PencilIcon } from 'lucide-react';
import { EditText } from 'react-edit-text';
import { Comic } from '../../../types/comic';
import { Pull } from '../../../types/pull';
const url_prefix = "http://localhost:5000"
//const url_prefix = ""
interface PullListItemProps {
  comic: Comic;
  pull: Pull;
  onRemove: () => void;
  isRemoving: boolean;
}

export const PullListItem: React.FC<PullListItemProps> = ({
  comic,
  pull,
  onRemove,
  isRemoving
}) => {
  const handleSave = async ({ name, value, previousValue }: {name: string, value: string, previousValue: string}) => {
    const data = {
      customer_id: pull.customer_id,
      comic_id: pull.comic_id,
      quantity: value,
    };
    const response = await fetch(`${url_prefix}/api/pulls/${pull.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update pull');
      return response.json();
    };
  return <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
      <div>
        <h4 className="font-medium text-gray-900">{comic.title} {comic.issue_number}</h4>
        <p className="text-sm text-gray-500">
          {comic.publisher}
          {comic.is_custom && ' (Custom)'}
        </p>
      </div>
      <div>
        Quantity: 
        <EditText
            name='textbox1'
            style={{ fontSize: '16px', border: '1px solid #ccc' }}
            onSave={handleSave}
            placeholder={pull?.quantity?.toString() || ' 1'}
          />
        <PencilIcon className="h-4 w-4 mr-2" />
      </div>
      <button onClick={onRemove} disabled={isRemoving} className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
        {isRemoving ? <Loader2Icon className="h-5 w-5 animate-spin" /> : <TrashIcon className="h-5 w-5" />}
        <span className="sr-only">Remove {comic.title}</span>
      </button>
    </div>;
};