import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AlertCircleIcon, PlusIcon } from 'lucide-react';
import { CustomerCard } from './CustomerCard';
import { SearchBar } from './SearchBar';
import { Customer } from '../../types/customer';
import { Comic } from '../../types/comic';
import { Pull } from '../../types/pull';
import * as FileSaver from 'file-saver';
import * as ExcelJS from 'exceljs';

const url_prefix = "http://localhost:5000"
//const url_prefix = ""

const fetchCustomers = async (): Promise<Customer[]> => {
  const response = await fetch(`${url_prefix}/api/customers`);
  if (!response.ok) {
    throw new Error('Failed to fetch customers');
  }
  return response.json();
};

const fetchComics = async (): Promise<Comic[]> => {
  const response = await fetch(`${url_prefix}/api/comics`);
  if (!response.ok) {
    throw new Error('Failed to fetch comics');
  }
  return response.json();
};

const fetchPulls = async (): Promise<Pull[]> => {
  const response = await fetch(`${url_prefix}/api/pulls`);
  if (!response.ok) {
    throw new Error('Failed to fetch pulls');
  }
  return response.json();
};

const downloadCustomerPullsReport = async (customerData: Customer[]) => {
  if (customerData.length === 0) {
    console.error('No customer data found')
    return;
  }

  const comics = await fetchComics();
  if (comics.length === 0) {
    console.error('No comic data found')
    return;
  }

  const pulls = await fetchPulls();
/*   if (pulls.length === 0) {
    console.error('No pulls found')
    return;
  } */

  const pullDict: Object[] = []
  customerData.forEach((customer: Customer) => {

    let pullComicIds: string[] = []
    pulls.forEach(pull => {
      if (pull.customer_id === customer.id) {
        pullComicIds.push(pull.comic_id)
      }
    })

    const holds: string[] = pullComicIds.map((comic_id: string) => {
      const comic = comics.find(comic => comic.id === comic_id)
      return `${comic?.title} #${comic?.issue_number}`
    })

    pullDict.push({
      first_name: customer.first_name,
      last_name: customer.last_name,
      numberOfHolds: pullComicIds.length,
      listOfHolds: holds.join(", ")
    })
  })

  //generate excel file
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');
  worksheet.columns = [
    { header: 'First Name', key: 'first_name' },
    { header: 'Last Name', key: 'last_name' },
    { header: 'Number of Holds', key: 'numberOfHolds' },
    { header: 'Holds', key: 'listOfHolds' }
  ];
  pullDict.forEach(row => {
    worksheet.addRow(row);
  })

  workbook.xlsx.writeBuffer()
    .then((data) => {
      const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
      const fileName = `${new Date().toLocaleDateString("en-US", {timeZone: "America/Chicago"})}-CustomerHoldsReport.xlsx`;
      FileSaver.saveAs(blob, fileName);
      console.log('Excel file generated successfully!');
    })
    .catch((error) => {
      console.error('Error generating Excel file:', error);
    });
};

export const CustomerList: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const {
    data,
    isLoading,
    error
  } = useQuery<Customer[], Error>({
    queryKey: ['customers'],
    queryFn: fetchCustomers
  });
  const [customerData, setCustomerData] = useState(data || []);

  const filteredCustomers = useMemo(() => {
    if (!data) return [];
    setCustomerData(data)
    if (!searchQuery) return data;
    const query = searchQuery.toLowerCase();
    return data.filter(customer => {
      const fullName = `${customer.first_name} ${customer.last_name}`.toLowerCase();
      return fullName.includes(query)
        || customer.email.toLowerCase().includes(query)
        || customer.notes.toLowerCase().includes(query)
      /* || customer.company.toLowerCase().includes(query) */;
    });
  }, [data, searchQuery]);
  if (error) {
    return <div className="bg-red-50 p-4 rounded-lg flex items-center space-x-3">
      <AlertCircleIcon className="h-5 w-5 text-red-500" />
      <p className="text-red-600">Error loading customers: {error.message}</p>
    </div>;
  }
  return <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
      <button onClick={() => { downloadCustomerPullsReport(customerData) }} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
        <PlusIcon className="h-5 w-5 mr-2" />
        Download Customer Report
      </button>
      <button onClick={() => navigate('/customers/new')} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        <PlusIcon className="h-5 w-5 mr-2" />
        Add Customer
      </button>
    </div>
    <SearchBar value={searchQuery} onChange={setSearchQuery} />
    {isLoading ? <div className="space-y-4">
      {[...Array(3)].map((_, index) => <div key={index} className="bg-white p-4 rounded-lg animate-pulse h-24">
        <div className="flex items-center space-x-4">
          <div className="bg-gray-200 p-2 rounded-full h-10 w-10" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>)}
    </div> : filteredCustomers.length === 0 ? <div className="text-center py-12">
      <p className="text-gray-500">
        {searchQuery ? 'No customers found matching your search.' : 'No customers yet.'}
      </p>
    </div> : <div className="space-y-4">
      {filteredCustomers.map(customer => <CustomerCard key={customer.id} customer={customer} onClick={() => navigate(`/customers/${customer.id}`)} />)}
    </div>}
  </div>;
};