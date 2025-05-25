import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { Navbar } from './components/Navbar';
import { CustomerList } from './components/customers/CustomerList';
import { CustomerForm } from './components/customers/CustomerForm';
import { CustomerDetails } from './components/customers/CustomerDetails';
import { ComicList } from './components/comics/ComicList';
import { ComicForm } from './components/comics/ComicForm';
import { ComicDetails } from './components/comics/ComicDetails';
const queryClient = new QueryClient();
export function App() {
  return <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="flex flex-col w-full min-h-screen bg-gray-50">
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<CustomerList />} />
              <Route path="/customers/new" element={<CustomerForm />} />
              <Route path="/customers/:id" element={<CustomerDetails />} />
              <Route path="/customers/:id/edit" element={<CustomerForm />} />
              <Route path="/comics" element={<ComicList />} />
              <Route path="/comics/new" element={<ComicForm />} />
              <Route path="/comics/:id" element={<ComicDetails />} />
              <Route path="/comics/:id/edit" element={<ComicForm />} />
            </Routes>
          </main>
        </div>
        <Toaster position="top-right" />
      </BrowserRouter>
    </QueryClientProvider>;
}