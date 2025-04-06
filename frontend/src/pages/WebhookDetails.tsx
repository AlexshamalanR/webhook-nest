import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface WebhookLog {
  id: number;
  webhook_id: number;
  payload: any;
  headers: Record<string, string>;
  status_code: number;
  received_at: string;
  replayed: boolean;
}

interface WebhookDetails {
  webhook: string;
  logs: WebhookLog[];
}

export default function WebhookDetails() {
  const { slug } = useParams<{ slug: string }>();
  const { user, isLoading: authLoading } = useAuth();

  const { data, isLoading: dataLoading, error } = useQuery<WebhookDetails>({
    queryKey: ['webhook', slug],
    queryFn: async () => {
      console.log('Fetching webhook details for slug:', slug);
      const response = await axios.get(`/api/webhooks/${slug}/logs`);
      console.log('Webhook details response:', response.data);
      return response.data;
    },
    enabled: !!user && !!slug,
    refetchInterval: 5000, // Refetch every 5 seconds to get new logs
  });

  if (authLoading) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Loading...</h2>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (dataLoading) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Loading webhook details...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-600">Error loading webhook details</h2>
        <p className="mt-2 text-gray-600">
          {error instanceof Error ? error.message : 'An unknown error occurred'}
        </p>
      </div>
    );
  }

  const webhookUrl = `http://localhost:5001/api/receive/${slug}`;

  return (
    <div className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Webhook URL</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Use this URL to send webhook requests:</p>
            <div className="mt-2 flex items-center space-x-2">
              <code className="flex-1 block rounded-md bg-gray-50 p-4 font-mono text-sm">
                {webhookUrl}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(webhookUrl);
                }}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Webhook Logs</h3>
          <div className="mt-4 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                        Time
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Headers
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Payload
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data?.logs.map((log) => (
                      <tr key={log.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-0">
                          {new Date(log.received_at).toLocaleString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {log.status_code}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <pre className="max-w-xs overflow-x-auto">
                            {JSON.stringify(log.headers, null, 2)}
                          </pre>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <pre className="max-w-xs overflow-x-auto">
                            {JSON.stringify(log.payload, null, 2)}
                          </pre>
                        </td>
                      </tr>
                    ))}
                    {(!data?.logs || data.logs.length === 0) && (
                      <tr>
                        <td colSpan={4} className="px-3 py-4 text-sm text-gray-500 text-center">
                          No webhook logs found. Send a POST request to the webhook URL to see logs appear here.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Example Usage</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Here's how to send a webhook using curl:</p>
            <pre className="mt-2 block rounded-md bg-gray-50 p-4 font-mono text-sm overflow-x-auto">
{`curl -X POST ${webhookUrl} \\
  -H "Content-Type: application/json" \\
  -d '{"event":"test","data":{"message":"Hello World!"}}'`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
} 