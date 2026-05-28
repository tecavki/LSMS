'use client';
import { useEffect, useState } from 'react';

export default function LogPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch('/api/logs').then(res => res.json()).then(setLogs);
  }, []);

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold mb-6">Sistem Hareket Dökümü</h1>
      <div className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
        <table className="w-full text-left">
          <thead className="bg-zinc-800">
            <tr>
              <th className="p-4">Tarih</th>
              <th className="p-4">İşlem</th>
              <th className="p-4">Hedef</th>
              <th className="p-4">İşlemi Yapan</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log: any) => (
              <tr key={log._id} className="border-t border-zinc-800">
                <td className="p-4">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="p-4 text-blue-400">{log.action}</td>
                <td className="p-4">{log.target}</td>
                <td className="p-4">{log.adminName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}