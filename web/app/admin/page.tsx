'use client';

import { useState, useEffect } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function AdminPage() {
  const [resources, setResources] = useState<any>(null);
  const [servers, setServers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [resourcesRes, serversRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/resources`),
        fetch(`${API_BASE_URL}/api/admin/servers`),
      ]);

      const resourcesData = await resourcesRes.json();
      const serversData = await serversRes.json();

      setResources(resourcesData);
      setServers(serversData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        {resources && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Resource Pool</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-gray-400 text-sm">CPU Cores</div>
                <div className="text-2xl font-bold">
                  {resources.availableCpuCores} / {resources.totalCpuCores}
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-sm">RAM (GB)</div>
                <div className="text-2xl font-bold">
                  {resources.availableRamGB} / {resources.totalRamGB}
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-sm">Disk (GB)</div>
                <div className="text-2xl font-bold">
                  {resources.availableDiskGB} / {resources.totalDiskGB}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">All Servers</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Game</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Port</th>
                  <th className="text-left p-2">User</th>
                </tr>
              </thead>
              <tbody>
                {servers.map((server) => (
                  <tr key={server.id} className="border-b border-gray-700">
                    <td className="p-2">{server.name}</td>
                    <td className="p-2 capitalize">{server.gameType}</td>
                    <td className="p-2 capitalize">{server.status}</td>
                    <td className="p-2">{server.port || 'N/A'}</td>
                    <td className="p-2">{server.user.discordId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

