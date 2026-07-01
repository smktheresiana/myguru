/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  BookOpen, 
  Users, 
  CheckCircle, 
  Award, 
  ArrowRight, 
  Sparkles, 
  UserCheck, 
  Clock, 
  Activity, 
  ChevronRight,
  ShieldAlert,
  Smartphone,
  Check,
  Zap,
  Layout,
  Layers,
  HelpCircle,
  TrendingUp,
  RotateCcw,
  Calendar,
  Plus,
  Play,
  ClipboardList,
  GraduationCap,
  QrCode,
  MapPin,
  RefreshCw,
  Camera,
  AlertTriangle
} from "lucide-react";
import { RPP, Student, Teacher } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface DashboardViewProps {
  rpps: RPP[];
  students: Student[];
  currentTeacher: Teacher;
  onChangeTab: (tab: string) => void;
  onSetTeacherRole: (role: Teacher["role"]) => void;
  activeSession: any;
  onUpdateAttendance?: (studentId: string, status: Student["attendance"]) => Promise<void> | void;
}

export default function DashboardView({ 
  rpps, 
  students, 
  currentTeacher, 
  onChangeTab,
  onSetTeacherRole,
  activeSession,
  onUpdateAttendance
}: DashboardViewProps) {
  
  // Real-time Clock simulation
  const [timeStr, setTimeStr] = useState("");
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      setDateStr(now.toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // QR Attendance Portal State
  const [qrTab, setQrTab] = useState<"siswa-scan" | "guru-monitor" | "rekap-log">("siswa-scan");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState<string | null>(null);
  const [gpsVerified, setGpsVerified] = useState(true);
  const [useRealCamera, setUseRealCamera] = useState(false);
  const [qrHash, setQrHash] = useState("AATS-SECURE-9A27F1-0815");
  const [qrTimer, setQrTimer] = useState(15);
  const [scanHistory, setScanHistory] = useState<Array<{
    studentId: string;
    name: string;
    nis: string;
    time: string;
    coords: string;
    device: string;
    method: "QR Code" | "Manual" | "Simulasi Scan";
  }>>([]);

  // Audio synthesizer for scanner beep
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(950, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.12);
    } catch (e) {
      console.warn("Audio Context blocked or not supported", e);
    }
  };

  // Keep scanning logs in sync with 'Hadir' students list
  useEffect(() => {
    const presentStudents = students.filter(s => s.attendance === "Hadir");
    const initialLogs = presentStudents.map((s, idx) => {
      const mins = 5 + idx * 3;
      return {
        studentId: s.id,
        name: s.name,
        nis: s.nis,
        time: `08:${mins < 10 ? "0" + mins : mins}:12 WIB`,
        coords: "-6.9825, 110.4208 (SMK Theresiana)",
        device: idx % 2 === 0 ? "Chrome Web (Xiaomi)" : "Samsung Internet (Galaxy A54)",
        method: "QR Code" as const
      };
    });
    setScanHistory(initialLogs);
    
    // Set default selected student to the first one that is NOT present yet
    const absent = students.find(s => s.attendance !== "Hadir");
    if (absent) {
      setSelectedStudentId(absent.id);
    } else if (students.length > 0) {
      setSelectedStudentId(students[0].id);
    }
  }, [students]);

  // QR dynamic hash updates
  useEffect(() => {
    const interval = setInterval(() => {
      setQrTimer(prev => {
        if (prev <= 1) {
          const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
          const nowStr = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }).replace(":", "");
          setQrHash(`AATS-SECURE-${randomHex}-${nowStr}`);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSimulateScan = async (studentId: string) => {
    if (!studentId) return;
    setIsScanning(true);
    setScanSuccess(null);

    // Simulate scanning delay
    setTimeout(async () => {
      const studentObj = students.find(s => s.id === studentId);
      if (studentObj) {
        // Trigger parent state and firestore save
        if (onUpdateAttendance) {
          await onUpdateAttendance(studentId, "Hadir");
        }

        playBeep();
        
        const now = new Date();
        const timeFormatted = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) + " WIB";
        
        // Add to local scan logs if not already present
        setScanHistory(prev => {
          if (prev.some(log => log.studentId === studentId)) return prev;
          return [
            {
              studentId,
              name: studentObj.name,
              nis: studentObj.nis,
              time: timeFormatted,
              coords: "-6.9825, 110.4208 (SMK Theresiana Semarang)",
              device: "AATS QR Scanner Android Client",
              method: "Simulasi Scan"
            },
            ...prev
          ];
        });

        setScanSuccess(`Presensi BERHASIL! Siswa ${studentObj.name} (NIS: ${studentObj.nis}) tercatat HADIR otomatis ke database Cloud Firestore.`);
      }
      setIsScanning(false);
    }, 1200);
  };

  const handleResetAttendance = async () => {
    if (window.confirm("Apakah Anda yakin ingin mereset seluruh presensi kelas hari ini kembali ke status default?")) {
      // Keep Alisha & Shodiq Present, set others to absent for interactive testing
      for (const s of students) {
        const defaultStatus = s.id === "s1" || s.id === "s2" ? "Hadir" : "Alfa";
        if (onUpdateAttendance) {
          await onUpdateAttendance(s.id, defaultStatus);
        }
      }
      alert("Status presensi di Cloud Firestore berhasil di-reset untuk simulasi!");
    }
  };

  // Quick statistics breakdown
  const totalStudents = students.length;
  const activeRpps = rpps.length;
  const classAverage = 84.5;
  const attendanceRate = 96;

  // Real-time student attendance counters
  const hadirCount = students.filter(s => s.attendance === "Hadir").length;
  const sakitCount = students.filter(s => s.attendance === "Sakit").length;
  const izinCount = students.filter(s => s.attendance === "Izin").length;
  const alfaCount = students.filter(s => s.attendance === "Alfa").length;
  const attendanceRatePercent = totalStudents > 0 ? Math.round((hadirCount / totalStudents) * 100) : 0;

  // Selected schedule tab (Today, Weekly)
  const [selectedSchedule, setSelectedSchedule] = useState<"hari-ini" | "mingguan">("hari-ini");

  // Mock list of today's schedules matching SMK Theresiana Semarang
  const todaySchedules = [
    { id: "sch-1", time: "08:00 - 09:30", kelas: "Kelas VII A", subject: "Informatika", topic: "Berpikir Komputasional - Searching", status: "Berlangsung", type: "PBL" },
    { id: "sch-2", time: "10:00 - 11:30", kelas: "Kelas VIII A", subject: "Informatika", topic: "Struktur Data - Stack & Queue", status: "Akan Datang", type: "Inquiry" },
    { id: "sch-3", time: "13:00 - 14:30", kelas: "Kelas IX A", subject: "Informatika", topic: "Algoritma Pemrograman Sederhana", status: "Akan Datang", type: "Project" }
  ];

  // Quick Announcements or Activity feed
  const activeActivities = [
    { id: "act-1", time: "07:45", text: "Deni Saputra ditandai Sakit oleh piket sekolah.", type: "system" },
    { id: "act-2", time: "Kemarin", text: "Alisha Putri mendapatkan pencapaian Excellence score pada Formatif 2.", type: "grade" },
    { id: "act-3", time: "15/06", text: "Modul Ajar Berpikir Komputasional berhasil disetujui oleh Kepala Sekolah.", type: "rpp" }
  ];

  return (
    <div className="space-y-6">
      
      {/* 1. WELCOME HERO BANNER (Ultra premium glassmorphism & visual layout) */}
      <div className="relative bg-[#092c74] rounded-3xl overflow-hidden border border-blue-900 shadow-xl p-6 sm:p-8 text-white">
        {/* Background ambient accents */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-60 h-60 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-blue-950 font-black text-[10px] uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-sm">
                Dashboard Utama
              </span>
              <span className="text-[11px] text-blue-200 font-semibold">• Terintegrasi dengan Cloud Classroom</span>
            </div>
            
            <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
              Selamat Datang kembali, <span className="text-amber-300">{currentTeacher.name}</span>
            </h1>
            <p className="text-xs text-blue-100 font-medium max-w-xl leading-relaxed">
              Pantau jalannya kelas secara real-time, susun rencana pembelajaran otomatis dengan asisten AI, dan kelola penilaian kelas secara otomatis.
            </p>
          </div>

          {/* Time & Date Display widget */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 px-5 py-3.5 rounded-2xl shrink-0 w-full md:w-auto text-center md:text-right space-y-1 shadow-inner">
            <span className="text-[10px] text-blue-200 font-extrabold uppercase tracking-wider block">WAKTU AKTIF SEKARANG</span>
            <div className="text-lg font-black font-mono tracking-widest text-amber-300 leading-none">
              {timeStr || "08:00:00"}
            </div>
            <div className="text-[10px] text-white font-semibold leading-relaxed">
              {dateStr || "Memuat Hari & Tanggal..."}
            </div>
          </div>
        </div>
      </div>

      {/* 2. CORE STATISTICS KPI ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Modul Ajar (RPP)", value: activeRpps, desc: "Modul Aktif Semester ini", color: "text-blue-600 bg-blue-50 border-blue-100", icon: BookOpen },
          { label: "Total Murid", value: totalStudents, desc: "Siswa Kelas Bimbingan", color: "text-purple-600 bg-purple-50 border-purple-100", icon: Users },
          { label: "Rata-rata Kelas", value: `${classAverage}%`, desc: "Ketercapaian TP", color: "text-emerald-600 bg-emerald-50 border-emerald-100", icon: GraduationCap },
          { label: "Tingkat Presensi", value: `${attendanceRate}%`, desc: "Kehadiran Siswa Hari Ini", color: "text-amber-600 bg-amber-50 border-amber-100", icon: ClipboardList }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm hover:border-blue-300/60 transition-all flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">{stat.label}</span>
                <span className="text-2xl font-black text-slate-900 block leading-tight">{stat.value}</span>
                <span className="text-[10px] text-slate-400 font-semibold block">{stat.desc}</span>
              </div>
              <div className={`h-11 w-11 rounded-xl flex items-center justify-center border shrink-0 ${stat.color}`}>
                <Icon className="h-5 w-5 stroke-[2.5]" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (Col 8) - Active Class & Today's Schedule */}
        <div className="xl:col-span-8 space-y-6">
          
          {/* A. CURRENT ONGOING CLASS TRACKER (Fokus Utama Guru) */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            {/* Panel header */}
            <div className="bg-gradient-to-r from-purple-700 to-indigo-600 px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-purple-200 block">SEDANG BERLANGSUNG</span>
                  <h3 className="text-sm font-extrabold leading-none">Informatika – Kelas VII A</h3>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 border border-white/10 uppercase font-mono">
                Sesi Berjalan
              </span>
            </div>

            {/* Panel body */}
            <div className="p-6 space-y-5">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Materi Pokok Hari Ini</span>
                  <h4 className="text-base font-black text-slate-800">Berpikir Komputasional - Pencarian (Searching)</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Sintaks: <span className="font-bold text-slate-700">Problem Based Learning (PBL)</span> • Alokasi: 2 JP (90 Menit)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-100 font-bold shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <span className="text-[9px] text-slate-400 font-bold uppercase block leading-none">WAKTU KELAS</span>
                    <span className="text-sm font-black text-slate-700 leading-none">90 Menit</span>
                  </div>
                </div>
              </div>

              {/* Progress Stepper representation */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-600">
                  <span>Alur Kegiatan Pembelajaran</span>
                  <span className="text-purple-600">Langkah 3 dari 5 (Orientasi Masalah)</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: "100%" }} />
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: "100%" }} />
                  <div className="h-full bg-purple-500 animate-pulse rounded-full" style={{ width: "100%" }} />
                  <div className="h-full bg-slate-200 rounded-full" />
                  <div className="h-full bg-slate-200 rounded-full" />
                </div>
              </div>

              {/* Actions and shortcuts */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>Jurnal presensi kehadiran sudah terisi otomatis (6 siswa hadir).</span>
                </div>
                
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => onChangeTab("teaching")}
                    className="flex-1 sm:flex-none text-center text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-md shadow-purple-100 flex items-center justify-center gap-2"
                  >
                    <Play className="h-3.5 w-3.5" />
                    Lanjutkan Mengajar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* PORTAL PRESENSI QR CODE & DAILY PROGRESS */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden space-y-0">
            {/* Gradient Header */}
            <div className="bg-[#092c74] px-6 py-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-400 text-blue-950 text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                    Sistem Presensi Otomatis
                  </span>
                  <span className="text-[11px] text-blue-200 font-semibold">• QR Code & GPS Locker</span>
                </div>
                <h3 className="text-base font-black flex items-center gap-2">
                  <QrCode className="h-5 w-5 text-amber-300 animate-pulse" />
                  Presensi QR Code - SMK Theresiana Semarang
                </h3>
                <p className="text-xs text-blue-100 font-medium max-w-xl">
                  Siswa dapat memindai QR Code dinamis untuk melakukan absensi kehadiran mandiri secara real-time ke database Cloud Firestore.
                </p>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur border border-white/10 px-3 py-1.5 rounded-xl shrink-0">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[10px] font-extrabold text-blue-100 uppercase tracking-wider font-mono">Sync Mode: Live</span>
              </div>
            </div>

            {/* Inner Sub-navigation Tabs */}
            <div className="bg-slate-50 border-b border-slate-100 px-6 py-3.5 flex flex-wrap gap-2 items-center justify-between">
              <div className="flex gap-1.5 bg-slate-200/60 p-1 rounded-xl border border-slate-200/30">
                {[
                  { id: "siswa-scan", label: "📱 Siswa Scanner", desc: "Simulasi Absen" },
                  { id: "guru-monitor", label: "🏫 Guru Monitor", desc: "Tampilkan QR" },
                  { id: "rekap-log", label: "📊 Rekap & Progress", desc: "Log Kehadiran" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setQrTab(tab.id as any);
                      setScanSuccess(null);
                    }}
                    className={`px-4 py-2 rounded-lg text-xs font-black transition-all flex flex-col items-center leading-none ${
                      qrTab === tab.id 
                        ? "bg-white text-blue-900 shadow-sm font-black" 
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <span>{tab.label.split(" ")[1]}</span>
                    <span className="text-[8px] opacity-75 font-semibold mt-0.5 uppercase tracking-tighter">
                      {tab.label.split(" ")[0]} {tab.desc}
                    </span>
                  </button>
                ))}
              </div>

              {/* Reset button for easy simulation */}
              <button
                onClick={handleResetAttendance}
                className="text-[10px] font-black uppercase text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100/80 px-3 py-1.5 rounded-xl border border-rose-200/50 transition-all flex items-center gap-1"
                title="Reset status kehadiran siswa untuk mengulang simulasi scan"
              >
                <RotateCcw className="h-3 w-3 shrink-0" />
                Reset Kehadiran
              </button>
            </div>

            {/* Tab Contents Area */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {qrTab === "siswa-scan" && (
                  <motion.div
                    key="siswa"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-6"
                  >
                    {/* Left block - Scanner viewport */}
                    <div className="md:col-span-7 space-y-4">
                      <div className="relative border border-slate-200/80 rounded-2xl bg-slate-950 p-4 aspect-[4/3] flex flex-col items-center justify-center overflow-hidden shadow-inner group">
                        
                        {/* Interactive scan laser animation */}
                        {isScanning && (
                          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 shadow-[0_0_12px_#10b981] animate-[bounce_1.5s_infinite] z-20" />
                        )}

                        {/* Scanner Viewport Framing overlay */}
                        <div className="absolute inset-6 border-[2px] border-slate-800 rounded-xl pointer-events-none z-10 flex items-center justify-center">
                          {/* Corner bracket highlights */}
                          <div className="absolute -top-[2px] -left-[2px] w-5 h-5 border-t-4 border-l-4 border-blue-400 rounded-tl-md" />
                          <div className="absolute -top-[2px] -right-[2px] w-5 h-5 border-t-4 border-r-4 border-blue-400 rounded-tr-md" />
                          <div className="absolute -bottom-[2px] -left-[2px] w-5 h-5 border-b-4 border-l-4 border-blue-400 rounded-bl-md" />
                          <div className="absolute -bottom-[2px] -right-[2px] w-5 h-5 border-b-4 border-r-4 border-blue-400 rounded-br-md" />
                        </div>

                        {/* Simulated/Real camera placeholder stream */}
                        <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center opacity-75">
                          {isScanning ? (
                            <div className="space-y-3 text-center">
                              <div className="h-10 w-10 border-4 border-t-emerald-400 border-r-emerald-400 border-b-slate-800 border-l-slate-800 rounded-full animate-spin mx-auto" />
                              <span className="text-[11px] text-emerald-400 font-extrabold tracking-widest font-mono uppercase block animate-pulse">
                                Membaca Enkripsi QR Code...
                              </span>
                            </div>
                          ) : (
                            <div className="text-center space-y-2 p-4">
                              <div className="h-12 w-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-slate-400 group-hover:scale-105 transition-transform">
                                <Camera className="h-6 w-6" />
                              </div>
                              <h4 className="text-xs font-bold text-slate-300">CARE+ Smart Scan Engine</h4>
                              <p className="text-[10px] text-slate-500 max-w-xs mx-auto leading-relaxed">
                                Posisikan QR Code berada di dalam kotak bidik scanner. Deteksi GPS dan koordinat seluler akan divalidasi otomatis.
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Camera Info overlay */}
                        <div className="absolute bottom-3 left-3 bg-slate-900/80 border border-slate-800 px-2.5 py-1 rounded-lg text-[9px] text-slate-300 font-semibold font-mono z-20 flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-emerald-400 shrink-0" />
                          SMK Theresiana (-6.9825, 110.4208)
                        </div>
                      </div>

                      {/* GPS Integrity Check toggle */}
                      <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200/40 text-xs font-semibold">
                        <div className="flex items-center gap-2">
                          <div className={`h-2.5 w-2.5 rounded-full ${gpsVerified ? "bg-emerald-500" : "bg-rose-500"} shrink-0`} />
                          <span className="text-slate-700">Verifikasi Lokasi & Geofence (100 Meter)</span>
                        </div>
                        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest bg-white px-2 py-0.5 rounded border border-slate-200/60 shadow-sm">
                          {gpsVerified ? "Aktif & Aman" : "Nonaktif"}
                        </span>
                      </div>
                    </div>

                    {/* Right block - Simulation inputs */}
                    <div className="md:col-span-5 space-y-4">
                      <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-2xl space-y-4 h-full flex flex-col justify-between">
                        <div className="space-y-3.5 flex-1">
                          <div>
                            <span className="text-[10px] font-black text-blue-900 uppercase tracking-widest block mb-1">
                              Pilih Siswa yang Melakukan Absen:
                            </span>
                            <select
                              value={selectedStudentId}
                              onChange={(e) => {
                                setSelectedStudentId(e.target.value);
                                setScanSuccess(null);
                              }}
                              className="w-full text-xs font-extrabold px-3 py-2.5 border rounded-xl focus:outline-none focus:border-blue-500 bg-white text-slate-800"
                            >
                              <option value="" disabled>-- Pilih Murid --</option>
                              {students.map((s) => {
                                const isPresent = s.attendance === "Hadir";
                                return (
                                  <option key={s.id} value={s.id} className={isPresent ? "text-emerald-600 font-bold" : "text-slate-800"}>
                                    {s.name} ({s.nis}) - {isPresent ? "✅ HADIR (Selesai)" : "❌ Belum Hadir"}
                                  </option>
                                );
                              })}
                            </select>
                            <span className="text-[9px] text-slate-400 font-semibold mt-1 block">
                              * Menu drop-down ini mensimulasikan siswa yang membawa HP mereka dan memindai QR Code di proyektor kelas.
                            </span>
                          </div>

                          {/* Trigger Simulation button */}
                          <button
                            type="button"
                            disabled={isScanning || !selectedStudentId}
                            onClick={() => handleSimulateScan(selectedStudentId)}
                            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-100 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                          >
                            <QrCode className="h-4 w-4 shrink-0" />
                            {isScanning ? "Memindai QR..." : "Simulasikan Scan QR Code"}
                          </button>
                        </div>

                        {/* Result alerts inside card */}
                        <div className="space-y-2 mt-4">
                          {scanSuccess ? (
                            <div className="bg-emerald-50 border border-emerald-200/80 p-3.5 rounded-xl space-y-1.5">
                              <div className="flex items-center gap-1.5 text-emerald-800 font-black text-xs">
                                <CheckCircle className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                                <span>ABSENSI TERCATAT</span>
                              </div>
                              <p className="text-[11px] text-emerald-700 font-semibold leading-relaxed">
                                {scanSuccess}
                              </p>
                              <div className="flex gap-2 text-[10px] text-emerald-600 font-bold">
                                <span>🔑 Hash: <span className="font-mono">{qrHash.slice(0, 15)}</span></span>
                                <span>&bull;</span>
                                <span>🛰️ GPS: Verified</span>
                              </div>
                            </div>
                          ) : (
                            <div className="border border-dashed border-slate-200 p-4 rounded-xl text-center text-slate-400">
                              <Smartphone className="h-5 w-5 mx-auto mb-1 opacity-65" />
                              <span className="text-[11px] font-bold text-slate-500 block leading-tight">
                                Menunggu Sinyal Pindai QR
                              </span>
                              <p className="text-[10px] text-slate-400 font-medium leading-relaxed mt-0.5 max-w-xs mx-auto">
                                Klik tombol simulasikan absen di atas untuk melihat alur pendaftaran siswa otomatis ke Cloud Firestore.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {qrTab === "guru-monitor" && (
                  <motion.div
                    key="guru"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-6"
                  >
                    {/* Left block - Beautiful dynamic QR display */}
                    <div className="md:col-span-5 flex flex-col items-center justify-center bg-slate-50 border border-slate-200/60 rounded-2xl p-6 space-y-4">
                      
                      {/* Authentic QR container */}
                      <div className="relative bg-white border-2 border-blue-900/10 p-5 rounded-2xl shadow-md w-48 h-48 flex items-center justify-center overflow-hidden">
                        {/* Decorative scan line back and forth */}
                        <div className="absolute inset-x-0 h-0.5 bg-blue-500/10 shadow-[0_0_8px_#3b82f6] animate-[pulse_2s_infinite]" />
                        
                        {/* Pure JSX SVG QR Code renderer */}
                        <div className="w-full h-full">
                          <svg width="100%" height="100%" viewBox="0 0 100 100" className="text-slate-900 fill-current">
                            {/* Finding pattern Top Left */}
                            <rect x="0" y="0" width="28" height="28" rx="4" className="text-blue-900 fill-current" />
                            <rect x="4" y="4" width="20" height="20" rx="2" className="text-white fill-current" />
                            <rect x="8" y="8" width="12" height="12" rx="1.5" className="text-blue-900 fill-current" />

                            {/* Finding pattern Top Right */}
                            <rect x="72" y="0" width="28" height="28" rx="4" className="text-blue-900 fill-current" />
                            <rect x="76" y="4" width="20" height="20" rx="2" className="text-white fill-current" />
                            <rect x="80" y="8" width="12" height="12" rx="1.5" className="text-blue-900 fill-current" />

                            {/* Finding pattern Bottom Left */}
                            <rect x="0" y="72" width="28" height="28" rx="4" className="text-blue-900 fill-current" />
                            <rect x="4" y="76" width="20" height="20" rx="2" className="text-white fill-current" />
                            <rect x="8" y="80" width="12" height="12" rx="1.5" className="text-blue-900 fill-current" />

                            {/* Small timing / alignment pattern */}
                            <rect x="76" y="76" width="8" height="8" rx="1" className="text-blue-900 fill-current" />
                            <rect x="78" y="78" width="4" height="4" className="text-white fill-current" />
                            
                            {/* Simulated high-density QR grid data blocks */}
                            <rect x="34" y="0" width="4" height="4" rx="0.5" />
                            <rect x="42" y="0" width="8" height="4" rx="0.5" />
                            <rect x="54" y="0" width="4" height="4" rx="0.5" />
                            <rect x="62" y="0" width="6" height="4" rx="0.5" />

                            <rect x="34" y="6" width="6" height="4" rx="0.5" />
                            <rect x="46" y="6" width="4" height="4" rx="0.5" />
                            <rect x="54" y="6" width="10" height="4" rx="0.5" />
                            
                            <rect x="34" y="12" width="12" height="4" rx="0.5" />
                            <rect x="50" y="12" width="4" height="4" rx="0.5" />
                            <rect x="58" y="12" width="8" height="4" rx="0.5" />

                            <rect x="34" y="18" width="4" height="4" rx="0.5" />
                            <rect x="42" y="18" width="14" height="4" rx="0.5" />
                            <rect x="60" y="18" width="4" height="4" rx="0.5" />

                            <rect x="34" y="24" width="8" height="4" rx="0.5" />
                            <rect x="46" y="24" width="4" height="4" rx="0.5" />
                            <rect x="54" y="24" width="12" height="4" rx="0.5" />

                            {/* Left side timing column */}
                            <rect x="12" y="34" width="4" height="4" rx="0.5" />
                            <rect x="12" y="42" width="4" height="4" rx="0.5" />
                            <rect x="12" y="50" width="4" height="4" rx="0.5" />
                            <rect x="12" y="58" width="4" height="4" rx="0.5" />
                            <rect x="12" y="66" width="4" height="4" rx="0.5" />

                            {/* Right side data area */}
                            <rect x="72" y="34" width="8" height="4" rx="0.5" />
                            <rect x="84" y="34" width="12" height="4" rx="0.5" />
                            <rect x="72" y="40" width="4" height="4" rx="0.5" />
                            <rect x="80" y="40" width="10" height="4" rx="0.5" />
                            <rect x="72" y="46" width="14" height="4" rx="0.5" />
                            <rect x="90" y="46" width="4" height="4" rx="0.5" />
                            <rect x="72" y="52" width="6" height="4" rx="0.5" />
                            <rect x="82" y="52" width="14" height="4" rx="0.5" />
                            <rect x="72" y="58" width="10" height="4" rx="0.5" />
                            <rect x="86" y="58" width="6" height="4" rx="0.5" />
                            <rect x="72" y="64" width="4" height="4" rx="0.5" />
                            <rect x="80" y="64" width="16" height="4" rx="0.5" />

                            {/* Bottom side data area */}
                            <rect x="34" y="72" width="8" height="4" rx="0.5" />
                            <rect x="46" y="72" width="14" height="4" rx="0.5" />
                            <rect x="64" y="72" width="4" height="4" rx="0.5" />
                            <rect x="34" y="78" width="4" height="4" rx="0.5" />
                            <rect x="42" y="78" width="8" height="4" rx="0.5" />
                            <rect x="54" y="78" width="12" height="4" rx="0.5" />
                            <rect x="34" y="84" width="14" height="4" rx="0.5" />
                            <rect x="52" y="84" width="4" height="4" rx="0.5" />
                            <rect x="60" y="84" width="8" height="4" rx="0.5" />
                            <rect x="34" y="90" width="6" height="4" rx="0.5" />
                            <rect x="44" y="90" width="16" height="4" rx="0.5" />
                            <rect x="64" y="90" width="4" height="4" rx="0.5" />

                            {/* Middle area */}
                            <rect x="34" y="34" width="32" height="32" rx="4" className="text-white fill-current" />
                            <rect x="38" y="38" width="24" height="24" rx="2" className="text-blue-50/50 fill-current" />
                            
                            {/* Absolute center graphic (Logo mockup) */}
                            <rect x="44" y="44" width="12" height="12" rx="2" className="text-blue-900 fill-current" />
                            <polygon points="50,46 54,49 50,52 46,49" className="text-amber-400 fill-current" />
                            <rect x="49" y="50" width="2" height="4" className="text-amber-400 fill-current" />
                          </svg>
                        </div>
                      </div>

                      {/* Security Regenerate Countdown */}
                      <div className="text-center space-y-1">
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase block tracking-wider">REGENERASI KODE OTP DINAMIS</span>
                        <div className="flex items-center gap-1.5 justify-center">
                          <RefreshCw className="h-3.5 w-3.5 text-blue-600 animate-spin shrink-0" />
                          <span className="text-xs font-black font-mono text-slate-800">
                            Regenerasi dalam <span className="text-rose-600">{qrTimer} detik</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right block - Monitor details and live list */}
                    <div className="md:col-span-7 space-y-4">
                      <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-4 shadow-md">
                        <div className="border-b border-slate-800 pb-3">
                          <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-widest block mb-0.5">Live Session Parameters</span>
                          <h4 className="text-sm font-extrabold">Informatika &bull; Kelas VII A</h4>
                          <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                            Materi: <span className="text-white">Pencarian (Searching)</span> | Guru: <span className="text-white">{currentTeacher.name}</span>
                          </p>
                        </div>

                        {/* Interactive dynamic statistics */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-800">
                            <span className="text-[9px] text-slate-400 font-bold uppercase block">Hadir</span>
                            <div className="flex items-baseline gap-1.5 mt-0.5">
                              <span className="text-xl font-black text-emerald-400 font-mono">{hadirCount}</span>
                              <span className="text-[10px] text-slate-500 font-bold">/ {totalStudents} siswa</span>
                            </div>
                          </div>
                          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-800">
                            <span className="text-[9px] text-slate-400 font-bold uppercase block">Sakit/Izin/Alfa</span>
                            <div className="flex items-baseline gap-1.5 mt-0.5">
                              <span className="text-xl font-black text-amber-400 font-mono">{sakitCount + izinCount + alfaCount}</span>
                              <span className="text-[10px] text-slate-500 font-bold">absen</span>
                            </div>
                          </div>
                        </div>

                        {/* Hash Security Ticker */}
                        <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-4 text-xs">
                          <div className="space-y-0.5">
                            <span className="text-[9px] text-slate-400 font-bold block">ACTIVE ENCRYPTION CODE</span>
                            <span className="font-mono text-slate-200 font-bold">{qrHash}</span>
                          </div>
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-extrabold px-2 py-0.5 rounded border border-emerald-500/10 font-mono">
                            SECURE_KEY
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {qrTab === "rekap-log" && (
                  <motion.div
                    key="log"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6"
                  >
                    {/* Left block - Visual Progress gauge & summary (Col 4) */}
                    <div className="lg:col-span-4 bg-slate-50 border border-slate-200/60 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                      
                      <div className="space-y-3">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                          Visualisasi Kehadiran Harian
                        </span>
                        
                        {/* Circle radial progress */}
                        <div className="relative h-28 w-28 mx-auto flex items-center justify-center">
                          <svg className="h-full w-full transform -rotate-90" viewBox="0 0 80 80">
                            {/* Background circle */}
                            <circle cx="40" cy="40" r="35" fill="transparent" stroke="#e2e8f0" strokeWidth="6" />
                            {/* Foreground percentage bar */}
                            <circle 
                              cx="40" 
                              cy="40" 
                              r="35" 
                              fill="transparent" 
                              stroke="#3b82f6" 
                              strokeWidth="6" 
                              strokeDasharray={2 * Math.PI * 35}
                              strokeDashoffset={2 * Math.PI * 35 - (attendanceRatePercent / 100) * 2 * Math.PI * 35}
                              strokeLinecap="round"
                              className="transition-all duration-1000 ease-out"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                            <span className="text-lg font-black text-slate-800 font-mono">
                              {attendanceRatePercent}%
                            </span>
                            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                              PRESENSI
                            </span>
                          </div>
                        </div>

                        <div className="text-center font-semibold text-[11px] text-slate-500">
                          Kehadiran kelas berjalan dalam rentang aman (&gt;90%).
                        </div>
                      </div>

                      {/* Status Breakdown Pills */}
                      <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-bold pt-2 border-t border-slate-200/60">
                        <div className="bg-emerald-50 border border-emerald-100 p-2 rounded-xl text-emerald-800">
                          <span className="block text-slate-400 text-[8px] font-black uppercase">Hadir</span>
                          <span className="text-sm font-black font-mono">{hadirCount}</span>
                        </div>
                        <div className="bg-rose-50 border border-rose-100 p-2 rounded-xl text-rose-800">
                          <span className="block text-slate-400 text-[8px] font-black uppercase">Alfa</span>
                          <span className="text-sm font-black font-mono">{alfaCount}</span>
                        </div>
                        <div className="bg-amber-50 border border-amber-100 p-2 rounded-xl text-amber-800">
                          <span className="block text-slate-400 text-[8px] font-black uppercase">Sakit</span>
                          <span className="text-sm font-black font-mono">{sakitCount}</span>
                        </div>
                        <div className="bg-blue-50 border border-blue-100 p-2 rounded-xl text-blue-800">
                          <span className="block text-slate-400 text-[8px] font-black uppercase">Izin</span>
                          <span className="text-sm font-black font-mono">{izinCount}</span>
                        </div>
                      </div>

                    </div>

                    {/* Right block - Detailed Logs List table (Col 8) */}
                    <div className="lg:col-span-8 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Log Aktivitas Presensi Hari Ini
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase font-mono bg-slate-100 px-2.5 py-0.5 rounded">
                          {scanHistory.length} Record Terdaftar
                        </span>
                      </div>

                      {/* Log table */}
                      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white max-h-[250px] overflow-y-auto shadow-inner">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-50 text-[9px] font-extrabold text-slate-400 uppercase border-b border-slate-100">
                              <th className="px-4 py-2.5">Siswa</th>
                              <th className="px-4 py-2.5">Waktu Scan</th>
                              <th className="px-4 py-2.5">Metode</th>
                              <th className="px-4 py-2.5">Integrasi GPS & Device</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                            {scanHistory.length === 0 ? (
                              <tr>
                                <td colSpan={4} className="text-center py-8 text-slate-400 font-medium">
                                  Belum ada log masuk untuk sesi ini.
                                </td>
                              </tr>
                            ) : (
                              scanHistory.map((log) => (
                                <tr key={log.studentId} className="hover:bg-slate-50/55 transition-colors">
                                  <td className="px-4 py-3">
                                    <div className="leading-tight">
                                      <span className="font-extrabold text-slate-900 block">{log.name}</span>
                                      <span className="text-[10px] text-slate-400 font-mono font-bold block">{log.nis}</span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-slate-600 font-mono text-[11px]">
                                    {log.time}
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                      log.method === "QR Code" 
                                        ? "bg-blue-50 text-blue-700 border border-blue-100" 
                                        : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                    }`}>
                                      {log.method}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="space-y-0.5 text-[10px]">
                                      <span className="text-slate-500 font-medium block">📱 {log.device}</span>
                                      <span className="text-slate-400 block font-mono text-[9px]">📍 {log.coords}</span>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* B. TODAY'S TEACHING SCHEDULES */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-3">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-slate-900">Agenda & Jadwal Mengajar Hari Ini</h3>
                <p className="text-xs text-slate-400 font-semibold">Jadwal resmi bimbingan akademik Anda di SMK Theresiana.</p>
              </div>

              <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200/60 shrink-0">
                <button
                  onClick={() => setSelectedSchedule("hari-ini")}
                  className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${
                    selectedSchedule === "hari-ini" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Hari Ini
                </button>
                <button
                  onClick={() => {
                    setSelectedSchedule("mingguan");
                    alert("Menampilkan agenda mingguan terpadu...");
                  }}
                  className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${
                    selectedSchedule === "mingguan" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Mingguan
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {todaySchedules.map((schedule) => (
                <div 
                  key={schedule.id}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 border border-slate-200/40 rounded-2xl hover:border-blue-300 hover:bg-white transition-all gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    {/* Time block */}
                    <div className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 shrink-0 text-center shadow-sm">
                      <Clock className="h-3.5 w-3.5 text-slate-400 mx-auto mb-0.5" />
                      <span className="text-[10px] font-black text-slate-700 font-mono tracking-tighter leading-none block">{schedule.time}</span>
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-800 text-xs">{schedule.kelas}</span>
                        <span className="text-[9px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-md">
                          {schedule.type}
                        </span>
                      </div>
                      <h4 className="text-xs font-black text-slate-900">{schedule.topic}</h4>
                      <p className="text-[11px] text-slate-500 font-semibold">{schedule.subject}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      schedule.status === "Berlangsung" 
                        ? "bg-purple-50 text-purple-700 border border-purple-200" 
                        : "bg-slate-200/60 text-slate-600 border border-slate-200"
                    }`}>
                      {schedule.status}
                    </span>
                    
                    <button
                      onClick={() => {
                        if (schedule.status === "Berlangsung") {
                          onChangeTab("teaching");
                        } else {
                          alert(`Membuka persiapan RPP untuk topik: ${schedule.topic}`);
                          onChangeTab("builder");
                        }
                      }}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 group-hover:translate-x-1 transition-transform flex items-center gap-1"
                    >
                      Buka →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (Col 4) - AI Insights & Logs */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* C. GEMINI AI INSIGHTS & ADVICE PANEL */}
          <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-xl p-5 space-y-4">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-amber-400 fill-amber-400 animate-pulse" />
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-200">Rekomendasi Pintar AI</h3>
              </div>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-emerald-400 font-mono">
                GEMINI_V1.5
              </span>
            </div>

            <div className="space-y-4">
              
              {/* Insight 1: Remedial bimbingan */}
              <div className="space-y-1 bg-slate-800/40 p-3 rounded-xl border border-slate-800/80">
                <div className="flex items-center gap-2 text-amber-400">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span className="text-[11px] font-black uppercase">Alarm Remedial (TP 1.1)</span>
                </div>
                <p className="text-[11px] text-slate-300 font-semibold leading-relaxed">
                  3 siswa (Deni, Bimo, Citra) memiliki pencapaian di bawah Kriteria Ketercapaian Tujuan Pembelajaran (KKTP).
                </p>
                <button 
                  onClick={() => alert("Menyusun paket lembar kerja pengulangan remedial berbasis AI...")}
                  className="text-[10px] font-bold text-amber-400 hover:text-amber-300 hover:underline pt-1 block"
                >
                  Generate Tugas Remedial →
                </button>
              </div>

              {/* Insight 2: Pengayaan logic */}
              <div className="space-y-1 bg-slate-800/40 p-3 rounded-xl border border-slate-800/80">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Award className="h-4 w-4 shrink-0" />
                  <span className="text-[11px] font-black uppercase">Tantangan Pengayaan</span>
                </div>
                <p className="text-[11px] text-slate-300 font-semibold leading-relaxed">
                  Alisha Putri dan Eka Rahmawati menunjukkan penguasaan sangat tinggi pada materi Searching. Berikan pengayaan algoritma lanjut.
                </p>
                <button 
                  onClick={() => alert("Menyusun bahan tantangan kuis pemecahan masalah algoritma rumit...")}
                  className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 hover:underline pt-1 block"
                >
                  Beri Soal Pengayaan →
                </button>
              </div>

              {/* Insight 3: Pembelajaran interaktif */}
              <div className="space-y-1 bg-slate-800/40 p-3 rounded-xl border border-slate-800/80">
                <div className="flex items-center gap-2 text-blue-400">
                  <Zap className="h-4 w-4 shrink-0" />
                  <span className="text-[11px] font-black uppercase">Metode Rekomendasi</span>
                </div>
                <p className="text-[11px] text-slate-300 font-semibold leading-relaxed">
                  Gunakan media kartu visual interaktif untuk simulasi Binary Search pada sesi kelas berikutnya guna menjaga interaksi kelompok.
                </p>
              </div>

            </div>
          </div>

          {/* D. SCHOOL LOGS / RECENT ACTIVITY FEED */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-5 space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">Riwayat & Log Aktivitas</h3>
              <p className="text-[10px] text-slate-400 font-semibold">Log aktivitas kelas bimbingan secara real-time.</p>
            </div>

            <div className="space-y-3.5">
              {activeActivities.map((act) => (
                <div key={act.id} className="flex gap-2.5 items-start">
                  <div className="h-5 w-5 rounded-full bg-slate-100 border border-slate-200/50 flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-black text-slate-500">
                    •
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-semibold text-slate-700 leading-normal">
                      {act.text}
                    </p>
                    <span className="text-[9px] font-bold text-slate-400 block">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button 
                onClick={() => alert("Membuka log riwayat kurikulum sekolah selengkapnya...")}
                className="w-full text-center text-[10px] font-extrabold text-blue-600 hover:text-blue-800 block"
              >
                Lihat Log Selengkapnya →
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
