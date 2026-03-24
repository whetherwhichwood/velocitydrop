'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function ServerDetailPage() {
  const params = useParams();
  const serverId = params.id as string;
  const [server, setServer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [discordId, setDiscordId] = useState<string>('');

  useEffect(() => {
    const storedDiscordId = localStorage.getItem('discordId');
    if (storedDiscordId) {
      setDiscordId(storedDiscordId);
      loadServer(storedDiscordId);
    } else {
      setLoading(false);
    }
  }, [serverId]);

  const loadServer = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/servers/${serverId}/status?discordId=${id}`);
      const data = await response.json();
      setServer(data);
    } catch (error) {
      console.error('Error loading server:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/servers/${serverId}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discordId }),
      });
      setTimeout(() => loadServer(discordId), 2000);
    } catch (error) {
      console.error('Error starting server:', error);
    }
  };

  const handleStop = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/servers/${serverId}/stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discordId }),
      });
      setTimeout(() => loadServer(discordId), 2000);
    } catch (error) {
      console.error('Error stopping server:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!server) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Server not found</h1>
          <a href="/" className="text-blue-400 hover:underline">Back to dashboard</a>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'text-green-400';
      case 'stopped':
        return 'text-gray-400';
      case 'starting':
      case 'stopping':
        return 'text-yellow-400';
      default:
        return 'text-red-400';
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <a href="/" className="text-blue-400 hover:underline mb-4 inline-block">
          ← Back to dashboard
        </a>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{server.name}</h1>
              <p className="text-gray-400 capitalize">{server.gameType}</p>
            </div>
            <div className={`text-lg font-semibold capitalize ${getStatusColor(server.status)}`}>
              {server.status}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <div className="text-gray-400 text-sm">Port</div>
              <div className="text-xl">{server.port || 'N/A'}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Created</div>
              <div className="text-xl">{new Date(server.createdAt).toLocaleDateString()}</div>
            </div>
          </div>

          {server.instance && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Instance Details</h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-gray-400 text-sm">CPU Cores</div>
                  <div className="text-lg">{server.instance.cpuCores}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">RAM</div>
                  <div className="text-lg">{server.instance.ramGB} GB</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Started</div>
                  <div className="text-lg">{new Date(server.instance.startedAt).toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            {server.status === 'stopped' && (
              <button
                onClick={handleStart}
                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold"
              >
                Start Server
              </button>
            )}
            {server.status === 'running' && (
              <button
                onClick={handleStop}
                className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold"
              >
                Stop Server
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

