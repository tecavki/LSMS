"use client";
import { useState, useEffect } from 'react';

export default function AdminDutyLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch('/api/admin/duties')
      .then((res) => res.json())
      .then((data) => setLogs(data))
      .catch((err) => console.error("Veri çekme hatası:", err));
  }, []);

  return (
    <div className="p-8 bg-zinc-950 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">Nöbet (Duty) Geçmişi</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-left bg-zinc-900 rounded-lg border-collapse">
          <thead>
            <tr className="border-b border-zinc-700 bg-zinc-800">
              <th className="p-4">Discord ID</th>
              <th className="p-4">Başlangıç</th>
              <th className="p-4">Bitiş</th>
              <th className="p-4">Süre (sn)</th>
            </tr>
          </thead>
          <tbody>
            {logs.length > 0 ? (
              logs.map((log: any) => (
                <tr key={log._id} className="border-b border-zinc-800 hover:bg-zinc-800 transition">
                  <td className="p-4 font-mono">{log.discordId}</td>
                  <td className="p-4">{new Date(log.startTime).toLocaleString()}</td>
                  <td className="p-4">{log.endTime ? new Date(log.endTime).toLocaleString() : "---"}</td>
                  <td className="p-4 font-bold text-green-400">{log.durationInSeconds || "Devam Ediyor"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-8 text-center text-zinc-500">Henüz kayıt yok.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}