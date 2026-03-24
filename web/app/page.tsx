'use client';

import { useState, useEffect } from 'react';
import ServerCard from '@/components/ServerCard';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Server {
  id: string;
  name: string;
  gameType: string;
  status: string;
  port?: number;
}

export default function Home() {
  const [servers, setServers] = useState<Server[]>([]);
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [discordId, setDiscordId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you'd get this from authentication
    const storedDiscordId = localStorage.getItem('discordId');
    if (storedDiscordId) {
      setDiscordId(storedDiscordId);
      loadData(storedDiscordId);
    } else {
      setLoading(false);
    }
  }, []);

  const loadData = async (id: string) => {
    try {
      const [serversRes, balanceRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/servers?discordId=${id}`),
        fetch(`${API_BASE_URL}/api/tokens/balance?discordId=${id}`),
      ]);

      const serversData = await serversRes.json();
      const balanceData = await balanceRes.json();

      setServers(serversData);
      setTokenBalance(balanceData.balance);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    const id = prompt('Enter your Discord ID:');
    if (id) {
      setDiscordId(id);
      localStorage.setItem('discordId', id);
      loadData(id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!discordId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">VelocityDrop</h1>
          <p className="text-gray-400 mb-8">Game Server Management</p>
          <button
            onClick={handleLogin}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold"
          >
            Enter Discord ID
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">VelocityDrop</h1>
            <p className="text-gray-400">Manage your game servers</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{tokenBalance}</div>
            <div className="text-gray-400">Tokens</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servers.map((server) => (
            <ServerCard
              key={server.id}
              server={server}
              discordId={discordId}
              onUpdate={() => loadData(discordId)}
            />
          ))}
        </div>

        {servers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No servers yet</p>
            <p className="text-sm text-gray-500">
              Use the Discord bot to create your first server!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

