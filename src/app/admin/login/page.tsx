"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      setError("Usuário ou senha incorretos.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="font-black text-white text-2xl tracking-widest uppercase">TMC</p>
          <p className="text-[#4A4A4A] text-xs tracking-widest uppercase mt-1">
            Painel administrativo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold tracking-widest uppercase text-[#4A4A4A] mb-2">
              Usuário
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="w-full px-4 py-3 bg-[#111111] border border-[#1a1a1a] text-white text-sm focus:outline-none focus:border-[#4A4A4A]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold tracking-widest uppercase text-[#4A4A4A] mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full px-4 py-3 bg-[#111111] border border-[#1a1a1a] text-white text-sm focus:outline-none focus:border-[#4A4A4A]"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-white text-[#0A0A0A] text-sm font-bold tracking-widest uppercase hover:bg-[#F2F2F2] transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <a href="/" className="text-xs text-[#4A4A4A] hover:text-[#8A8A8A] transition-colors">
            ← Voltar ao site
          </a>
        </div>
      </div>
    </div>
  );
}
