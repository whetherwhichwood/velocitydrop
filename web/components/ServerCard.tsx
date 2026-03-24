'use client';

import { useState } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Server {
  id: string;
  name: string;
  gameType: string;
  status: string;
  port?: number;
}

interface ServerCardProps {
  server: Server;
  discordId: string;
  onUpdate: () => void;
}

export default function ServerCard({ server, discordId, onUpdate }: ServerCardProps) {
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    try {
      await fetch(`${API_BASE_URL}/api/servers/${server.id}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discordId }),
      });
      setTimeout(onUpdate, 2000);
    } catch (error) {
      console.error('Error starting server:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    setLoading(true);
    try {
      await fetch(`${API_BASE_URL}/api/servers/${server.id}/stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discordId }),
      });
      setTimeout(onUpdate, 2000);
    } catch (error) {
      console.error('Error stopping server:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-500';
      case 'stopped':
        return 'bg-gray-500';
      case 'starting':
      case 'stopping':
        return 'bg-yellow-500';
      default:
        return 'bg-red-500';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold">{server.name}</h3>
          <p className="text-gray-400 text-sm capitalize">{server.gameType}</p>
        </div>
        <div className={`w-3 h-3 rounded-full ${getStatusColor(server.status)}`} />
      </div>

      <div className="mb-4">
        <div className="text-sm text-gray-400">Status</div>
        <div className="text-lg capitalize">{server.status}</div>
        {server.port && (
          <>
            <div className="text-sm text-gray-400 mt-2">Port</div>
            <div className="text-lg">{server.port}</div>
          </>
        )}
      </div>

      <div className="flex gap-2">
        {server.status === 'stopped' && (
          <button
            onClick={handleStart}
            disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded font-semibold"
          >
            {loading ? 'Starting...' : 'Start'}
          </button>
        )}
        {server.status === 'running' && (
          <button
            onClick={handleStop}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 px-4 py-2 rounded font-semibold"
          >
            {loading ? 'Stopping...' : 'Stop'}
          </button>
        )}
      </div>
    </div>
  );
}

