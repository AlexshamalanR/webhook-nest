import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Webhook {
  id: number;
  url_slug: string;
  description: string;
  createdAt: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: webhooks, isLoading } = useQuery<Webhook[]>({
    queryKey: ['webhooks'],
    queryFn: async () => {
      console.log('Fetching webhooks...');
      const response = await axios.get('/api/webhooks');
      console.log('Webhooks fetched:', response.data);
      return response.data;
    },
    enabled: !!user,
  });

  const createWebhookMutation = useMutation({
    mutationFn: async (description: string) => {
      console.log('Creating webhook with description:', description);
      const response = await axios.post('/api/webhooks/create', { description });
      console.log('Webhook creation response:', response.data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      setDescription('');
      setIsCreating(false);
      setError(null);
    },
    onError: (error: any) => {
      console.error('Error creating webhook:', error);
      setError(error.response?.data?.message || 'Failed to create webhook. Please try again.');
    }
  });

  const handleCreateWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (description.trim()) {
      createWebhookMutation.mutate(description);
    } else {
      setError('Please enter a description for your webhook');
    }
  };

  if (!user) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Please log in to view your webhooks</h2>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Loading...</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Your Webhooks</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          Create New Webhook
        </button>
      </div>

      {isCreating && (
        <div className="bg-white shadow sm:rounded-lg p-6">
          <form onSubmit={handleCreateWebhook} className="space-y-4">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter webhook description"
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm">
                {error}
              </div>
            )}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setError(null);
                }}
                className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createWebhookMutation.isPending}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
              >
                {createWebhookMutation.isPending ? 'Creating...' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" className="divide-y divide-gray-200">
          {webhooks?.map((webhook) => (
            <li key={webhook.id}>
              <Link
                to={`/webhook/${webhook.url_slug}`}
                className="block hover:bg-gray-50"
              >
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {webhook.description || 'Unnamed Webhook'}
                      </p>
                    </div>
                    <div className="ml-2 flex flex-shrink-0">
                      <p className="text-sm text-gray-500">
                        Created {new Date(webhook.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        Webhook URL: /api/receive/{webhook.url_slug}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
          {webhooks?.length === 0 && (
            <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
              No webhooks found. Create your first webhook to get started.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
} 