"use client";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white">
      <h1 className="text-3xl font-bold mb-8">LSMS Personel Girişi</h1>
      <button 
        onClick={() => signIn("discord")}
        className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg font-bold transition"
      >
        Discord ile Giriş Yap
      </button>
    </div>
  );
}