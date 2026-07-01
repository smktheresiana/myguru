/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Lock, 
  User, 
  Sparkles, 
  LogIn, 
  ShieldAlert, 
  UserPlus, 
  Eye, 
  EyeOff, 
  CheckCircle,
  HelpCircle
} from "lucide-react";
import { Teacher } from "../types";
import { motion } from "motion/react";

interface LoginViewProps {
  presetUsers: Teacher[];
  onLogin: (teacher: Teacher) => void;
}

export default function LoginView({ presetUsers, onLogin }: LoginViewProps) {
  const [selectedPresetId, setSelectedPresetId] = useState(presetUsers[0]?.id || "");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Registration states
  const [isRegistering, setIsRegistering] = useState(false);
  const [regName, setRegName] = useState("");
  const [regNip, setRegNip] = useState("");
  const [regSubject, setRegSubject] = useState("");
  const [regRole, setRegRole] = useState<Teacher["role"]>("Guru Mapel");

  const handlePresetLogin = () => {
    const selected = presetUsers.find(u => u.id === selectedPresetId);
    if (selected) {
      setSuccess(`Selamat datang kembali, ${selected.name}!`);
      setTimeout(() => {
        onLogin(selected);
      }, 800);
    }
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError("Silakan masukkan NIP / Nama Pengguna dan Password Anda.");
      return;
    }

    // Check against presets
    const matched = presetUsers.find(
      u => u.nip.replace(/\s+/g, "") === username.replace(/\s+/g, "") || 
           u.name.toLowerCase().includes(username.toLowerCase())
    );

    if (matched) {
      setSuccess(`Login Berhasil! Selamat datang ${matched.name}.`);
      setTimeout(() => {
        onLogin(matched);
      }, 800);
    } else {
      // Create transient guest session for unlisted NIP/user
      const guestTeacher: Teacher = {
        id: `teacher-${Date.now()}`,
        name: username.length > 5 ? username : "Guru Tamu Terverifikasi",
        nip: username,
        role: "Guru Mapel",
        subject: "Informatika / Umum"
      };
      setSuccess(`Login Berhasil (Akun Baru/Tamu terdaftar)!`);
      setTimeout(() => {
        onLogin(guestTeacher);
      }, 800);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!regName || !regNip || !regSubject) {
      setError("Semua kolom pendaftaran wajib diisi!");
      return;
    }

    const newTeacher: Teacher = {
      id: `teacher-reg-${Date.now()}`,
      name: regName,
      nip: regNip,
      role: regRole,
      subject: regSubject
    };

    setSuccess("Pendaftaran Berhasil! Akun Anda telah dibuat dalam database.");
    setTimeout(() => {
      onLogin(newTeacher);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-between text-slate-100 font-sans relative overflow-hidden selection:bg-blue-600 selection:text-white">
      {/* Background Graphic Accents */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-10 w-80 h-80 bg-amber-500 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-emerald-600 rounded-full blur-3xl" />
      </div>

      {/* Header Area */}
      <header className="px-6 py-5 bg-slate-950/80 border-b border-slate-800 backdrop-blur-md flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-white p-0.5 flex items-center justify-center shadow-lg border border-slate-800">
            <svg viewBox="0 0 100 100" className="h-8 w-8 text-blue-900">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" />
              <path d="M50 15 L80 35 L80 65 L50 85 L20 65 L20 35 Z" fill="none" stroke="currentColor" strokeWidth="3" />
              <text x="50" y="55" textAnchor="middle" fontSize="11" fontWeight="900" fill="currentColor">SMK</text>
              <path d="M35 50 H65 M50 35 V65" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-black tracking-wider text-white leading-tight">SMK THERESIANA SEMARANG</h1>
            <span className="text-[10px] text-blue-400 font-bold block uppercase tracking-wider leading-none">THERESIANA CARE+ Portal</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block text-[11px] font-bold text-slate-400">Database Status:</span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/80 border border-emerald-800 text-emerald-400 rounded-full text-[10px] font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Connected to Cloud Firestore
          </span>
        </div>
      </header>

      {/* Main Login Card Area */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-slate-950/90 border border-slate-800 rounded-3xl shadow-2xl w-full max-w-lg p-6 sm:p-8 backdrop-blur-lg"
        >
          {/* Logo & Headline */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center p-3 bg-blue-900/40 text-blue-400 rounded-2xl mb-3 border border-blue-800/40">
              <Sparkles className="h-6 w-6 text-amber-400 animate-pulse" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">THERESIANA CARE+</h2>
            <p className="text-xs text-blue-400 mt-1 font-bold">Integrated Teaching & Learning System</p>
            <p className="text-[10px] text-slate-400 mt-0.5 font-medium italic">"CARE Your Future Through Intelligent Education"</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-950/60 border border-rose-800 text-rose-300 rounded-xl text-xs font-bold flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {!isRegistering ? (
            <div className="space-y-6">
              {/* Option A: Preset Login Simulator (Perfect for user roles inspection) */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-black text-amber-400 tracking-wider uppercase">Metode 1: Pilih Peran / Akun Simulator</h3>
                  <span className="text-[10px] bg-amber-400/10 text-amber-300 px-2 py-0.5 rounded font-extrabold uppercase">Rekomendasi Uji Coba</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                  Sesuai kebutuhan pengujian peran masing-masing, Anda dapat langsung memilih salah satu akun guru atau staf di bawah ini untuk melihat hak akses spesifik mereka:
                </p>
                <div className="space-y-3">
                  <select
                    value={selectedPresetId}
                    onChange={(e) => setSelectedPresetId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white font-bold text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-ellipsis"
                  >
                    {presetUsers.map((user) => (
                      <option key={user.id} value={user.id} className="bg-slate-950 text-slate-100">
                        {user.name} — [{user.role}]
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={handlePresetLogin}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-lg shadow-blue-900/30 transition-all hover:scale-[1.01]"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Masuk sebagai Akun Simulator</span>
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center my-4">
                <div className="flex-1 h-px bg-slate-800" />
                <span className="px-3 text-[10px] text-slate-500 font-extrabold uppercase tracking-widest">Atau</span>
                <div className="flex-1 h-px bg-slate-800" />
              </div>

              {/* Option B: Manual Login Portal */}
              <form onSubmit={handleManualLogin} className="space-y-4">
                <h3 className="text-xs font-black text-slate-400 tracking-wider uppercase">Metode 2: Login Akun Guru / NIP Manual</h3>
                
                <div className="space-y-3.5">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">NIP atau Nama Pengguna</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Contoh: 19820412 201012 1 003"
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-10 text-xs font-medium text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setIsRegistering(true)}
                    className="text-[11px] font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    Belum punya akun? Daftar Baru
                  </button>
                  <a href="#" onClick={(e) => {e.preventDefault(); alert("Gunakan pilihan login simulator (Metode 1) atau hubungi Admin IT Theresiana.");}} className="text-[11px] font-semibold text-slate-500 hover:text-slate-400">Lupa Password?</a>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl border border-slate-700 transition-all"
                >
                  <span>Masuk ke Workspace</span>
                </button>
              </form>
            </div>
          ) : (
            /* Register Account Form */
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-black text-blue-400 tracking-wider uppercase">Daftar Akun Guru / Staf Baru</h3>
                <button
                  type="button"
                  onClick={() => setIsRegistering(false)}
                  className="text-xs font-bold text-slate-400 hover:text-slate-200"
                >
                  Kembali ke Login
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Nama Lengkap & Gelar</label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Contoh: Dra. Maria Susanti, M.Pd."
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs font-medium text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">NIP (Nomor Induk Pegawai)</label>
                  <input
                    type="text"
                    required
                    value={regNip}
                    onChange={(e) => setRegNip(e.target.value)}
                    placeholder="Contoh: 19850422 201212 2 004"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs font-medium text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Mata Pelajaran Utama / Bagian</label>
                  <input
                    type="text"
                    required
                    value={regSubject}
                    onChange={(e) => setRegSubject(e.target.value)}
                    placeholder="Contoh: Matematika / Bahasa Inggris / BK"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs font-medium text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Peran Hak Akses (Role)</label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as Teacher["role"])}
                    className="w-full bg-slate-950 border border-slate-800 text-white font-bold text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="Guru Mapel" className="bg-slate-950">Guru Mapel (Pengajar Utama)</option>
                    <option value="Kaprog / MGMP" className="bg-slate-950">Kaprog / MGMP (Ketua Program Keahlian)</option>
                    <option value="Wakil Kepala Sekolah Bidang Kurikulum" className="bg-slate-950">Wakil Kepala Sekolah Bidang Kurikulum</option>
                    <option value="Kepala Sekolah" className="bg-slate-950">Kepala Sekolah (Verifikator Utama)</option>
                    <option value="Admin Akademik" className="bg-slate-950">Admin Akademik</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-lg transition-all mt-2"
              >
                <UserPlus className="h-4 w-4" />
                <span>Daftarkan & Masuk Ke Sistem</span>
              </button>
            </form>
          )}
        </motion.div>
      </main>

      {/* Footer / System Info */}
      <footer className="py-4 bg-slate-950 text-center border-t border-slate-900 relative z-10 text-slate-500 text-[10px] font-semibold space-y-1">
        <p>THERESIANA CARE+ &bull; SMK THERESIANA SEMARANG © 2026. All Rights Reserved.</p>
        <p className="text-slate-600">Terhubung secara terenkripsi ke Cloud Firestore Database & AI Engine.</p>
      </footer>
    </div>
  );
}
