/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Cpu, 
  BookOpen, 
  Activity, 
  FolderOpen, 
  Settings, 
  Bell, 
  User, 
  Compass, 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  ChevronRight, 
  Menu,
  CheckCircle,
  HelpCircle,
  LogOut
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { Student, Teacher, RPP, FileAttachment, ChatMessage } from "./types";
import { 
  seedDatabaseIfEmpty, 
  getTeacher, 
  saveTeacher, 
  getStudents, 
  saveStudent, 
  deleteStudent,
  getRPPs, 
  saveRPP, 
  deleteRPP,
  getFiles, 
  saveFile, 
  deleteFile 
} from "./lib/firebaseService";
import DashboardView from "./components/DashboardView";
import BuilderView from "./components/BuilderView";
import TeachingView from "./components/TeachingView";
import AnalyticsView from "./components/AnalyticsView";
import LampiranView from "./components/LampiranView";
import ManagementView from "./components/ManagementView";
import LoginView from "./components/LoginView";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  
  // Real login state
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("aats_logged_in") === "true";
  });
  
  // Quick AI Assistant Panel state
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "init-msg",
      role: "model",
      text: "Halo! Saya AATS AI Assistant, asisten kurikulum cerdas Anda. Ada yang bisa saya bantu dalam merancang RPP, LKPD, atau menyiapkan game pembelajaran hari ini?",
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // States linked to Firestore
  const [currentTeacher, setCurrentTeacher] = useState<Teacher>(() => {
    const saved = localStorage.getItem("aats_current_teacher");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback to default
      }
    }
    return {
      id: "teacher-1",
      name: "Drs. Eko Prasetyo, M.Kom.",
      nip: "19820412 201012 1 003",
      role: "Guru Mapel",
      subject: "Informatika"
    };
  });

  const [students, setStudents] = useState<Student[]>([]);
  const [rpps, setRpps] = useState<RPP[]>([]);
  const [files, setFiles] = useState<FileAttachment[]>([]);

  // List of Preset Accounts for Simulated Login Portal
  const PRESET_USERS: Teacher[] = [
    {
      id: "teacher-1",
      name: "Drs. Eko Prasetyo, M.Kom.",
      nip: "19820412 201012 1 003",
      role: "Guru Mapel",
      subject: "Informatika"
    },
    {
      id: "teacher-admin-1",
      name: "Ika Sulistyaningsih, S.Pd.",
      nip: "19881105 201402 2 001",
      role: "Admin Akademik",
      subject: "Kurikulum & Operator Sekolah"
    },
    {
      id: "teacher-super-1",
      name: "Hj. Endang Rahayu, M.Si.",
      nip: "19710315 199602 2 001",
      role: "Super Administrator Sekolah",
      subject: "Konfigurasi & Master Data"
    },
    {
      id: "teacher-curriculum-1",
      name: "Budi Santoso, S.Kom.",
      nip: "19800714 200801 1 005",
      role: "Wakil Kepala Sekolah Bidang Kurikulum",
      subject: "Kurikulum & Evaluasi"
    },
    {
      id: "teacher-kaprog-1",
      name: "Achmad Shodiqin, M.T.",
      nip: "19830822 201212 1 004",
      role: "Kaprog / MGMP",
      subject: "Teknik Jaringan & Software"
    },
    {
      id: "teacher-principal-1",
      name: "Margaretha Sofia, M.Pd.",
      nip: "19740523 199903 2 002",
      role: "Kepala Sekolah",
      subject: "Manajemen Sekolah"
    },
    {
      id: "teacher-sysadmin-1",
      name: "Prasetyo Adi, S.Kom.",
      nip: "19850218 201103 1 002",
      role: "System Administrator",
      subject: "Server & Infrastruktur"
    }
  ];

  const handleSwitchUser = async (userId: string) => {
    const selected = PRESET_USERS.find(u => u.id === userId);
    if (selected) {
      setCurrentTeacher(selected);
      localStorage.setItem("aats_current_teacher", JSON.stringify(selected));
      await saveTeacher(selected);
    }
  };

  const handleAddStudent = async (newStudent: Student) => {
    setStudents(prev => [...prev, newStudent]);
    await saveStudent(newStudent);
  };

  const handleDeleteStudent = async (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    await deleteStudent(id);
  };

  // Load and hydrate database on mount
  useEffect(() => {
    async function initDb() {
      try {
        await seedDatabaseIfEmpty();
        const [teacherData, studentsData, rppsData, filesData] = await Promise.all([
          getTeacher(),
          getStudents(),
          getRPPs(),
          getFiles()
        ]);
        
        const savedTeacher = localStorage.getItem("aats_current_teacher");
        if (savedTeacher) {
          try {
            setCurrentTeacher(JSON.parse(savedTeacher));
          } catch {
            setCurrentTeacher(teacherData);
          }
        } else {
          setCurrentTeacher(teacherData);
        }
        
        setStudents(studentsData);
        setRpps(rppsData);
        setFiles(filesData);
      } catch (err) {
        console.error("Gagal sinkronisasi dengan Cloud Firestore:", err);
      } finally {
        setLoading(false);
      }
    }
    initDb();
  }, []);

  const handleUpdateAttendance = async (studentId: string, status: Student["attendance"]) => {
    const updatedList = students.map(s => s.id === studentId ? { ...s, attendance: status } : s);
    setStudents(updatedList);
    const updatedStudent = updatedList.find(s => s.id === studentId);
    if (updatedStudent) {
      await saveStudent(updatedStudent);
    }
  };

  const handleUpdateStudent = async (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    await saveStudent(updatedStudent);
  };

  const handleSaveQuickNotes = (notes: string) => {
    // Save to the active session notes
    console.log("Catatan kelas disimpan:", notes);
  };

  const handleSaveRpp = async (newRpp: RPP) => {
    setRpps(prev => {
      const idx = prev.findIndex(r => r.id === newRpp.id);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = newRpp;
        return copy;
      }
      return [newRpp, ...prev];
    });
    await saveRPP(newRpp);
  };

  const handlePublishRpp = async (id: string) => {
    const rppObj = rpps.find(r => r.id === id);
    if (rppObj) {
      const updatedRpp: RPP = { ...rppObj, status: "Published" };
      setRpps(prev => prev.map(r => r.id === id ? updatedRpp : r));
      await saveRPP(updatedRpp);
      
      // Auto-create matching file attachments in repository to maintain integration
      const newFile: FileAttachment = {
        id: "f-auto-" + Date.now(),
        name: `LKPD_Otomatis_${rppObj.materi.replace(/\s+/g, "_")}.pdf`,
        type: "LKPD",
        size: "350 KB",
        createdAt: new Date().toLocaleDateString("id-ID"),
        rppId: id,
        content: rppObj.lkpdContent || "Konten LKPD dihasilkan oleh AI."
      };
      setFiles(prev => [newFile, ...prev]);
      await saveFile(newFile);
    }
  };

  const handleDeleteRpp = async (id: string) => {
    setRpps(prev => prev.filter(r => r.id !== id));
    await deleteRPP(id);
  };

  const handleUploadFile = async (file: FileAttachment) => {
    setFiles(prev => [file, ...prev]);
    await saveFile(file);
  };

  const handleDeleteFile = async (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    await deleteFile(id);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: "user-" + Date.now(),
      role: "user",
      text: chatInput,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: chatInput,
          history: chatMessages.map(m => ({ role: m.role, text: m.text }))
        })
      });

      const data = await res.json();
      const aiMsg: ChatMessage = {
        id: "ai-" + Date.now(),
        role: "model",
        text: data.content || "Gagal menyusun jawaban cerdas.",
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
      };
      setChatMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      const fallbackMsg: ChatMessage = {
        id: "ai-fallback-" + Date.now(),
        role: "model",
        text: "Maaf, terjadi gangguan pada koneksi server AI. Sebagai solusi cepat, Anda bisa mencoba fitur 'Penyusunan Paket Pembelajaran' pada menu Builder di sidebar.",
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
      };
      setChatMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#031b4e] flex flex-col items-center justify-center text-white p-6">
        <div className="space-y-6 text-center max-w-sm">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-white p-1 flex items-center justify-center shadow-lg animate-bounce">
              <svg viewBox="0 0 100 100" className="h-12 w-12 text-blue-800 animate-spin">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" />
                <path d="M50 15 L80 35 L80 65 L50 85 L20 65 L20 35 Z" fill="none" stroke="currentColor" strokeWidth="3" />
              </svg>
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-black tracking-widest text-white uppercase">SMK THERESIANA</h1>
            <h2 className="text-xs font-bold text-amber-400 uppercase tracking-widest">AI ACADEMIC TEACHING SYSTEM</h2>
            <div className="h-1.5 w-32 bg-blue-900 mx-auto rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full animate-pulse" />
            </div>
            <p className="text-[10px] text-blue-200 font-semibold animate-pulse pt-2">Menghubungkan ke Cloud Firestore...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <LoginView 
        presetUsers={PRESET_USERS}
        onLogin={async (teacher) => {
          setCurrentTeacher(teacher);
          localStorage.setItem("aats_current_teacher", JSON.stringify(teacher));
          localStorage.setItem("aats_logged_in", "true");
          setIsLoggedIn(true);
          await saveTeacher(teacher);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans antialiased flex flex-col">
      
      {/* PHASE 2 BRANDING BANNER (Matches mockup image top header perfectly) */}
      <header className="bg-gradient-to-r from-[#031b4e] via-[#092c74] to-[#0e3c9c] px-6 py-4 flex flex-col md:flex-row items-center justify-between border-b-4 border-amber-400 text-white shadow-lg relative z-40">
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 hover:bg-white/10 rounded-xl transition-colors md:hidden text-white mr-1"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            <div className="h-11 w-11 rounded-full bg-white p-0.5 flex items-center justify-center shadow-md shrink-0 border border-blue-200">
              <svg viewBox="0 0 100 100" className="h-9 w-9 text-blue-800">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" />
                <path d="M50 15 L80 35 L80 65 L50 85 L20 65 L20 35 Z" fill="none" stroke="currentColor" strokeWidth="3" />
                <text x="50" y="55" textAnchor="middle" fontSize="11" fontWeight="900" fontFamily="sans-serif" fill="currentColor">SMK</text>
                <path d="M35 50 H65 M50 35 V65" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <div>
              <h2 className="text-xs font-black tracking-wider text-white leading-tight uppercase font-sans">SMK THERESIANA</h2>
              <span className="text-[9px] text-blue-200 font-bold block uppercase tracking-wider leading-none pt-0.5">SEMARANG</span>
            </div>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <div className="bg-blue-950/60 border border-white/10 px-2.5 py-1 rounded-xl text-[9px] font-bold text-amber-400">
              VERSI 1.0
            </div>
          </div>
        </div>

        {/* Center Title Block */}
        <div className="text-center my-3 md:my-0 space-y-0.5">
          <h1 className="text-base sm:text-lg font-black tracking-wider text-white">THERESIANA CARE+</h1>
          <h2 className="text-xs font-extrabold tracking-widest text-amber-400">Integrated Teaching & Learning System</h2>
          <p className="text-[9px] text-blue-100 font-medium">"CARE Your Future Through Intelligent Education"</p>
        </div>

        {/* Portal simulated login drop-down */}
        <div className="flex items-center gap-2.5 bg-white/10 border border-white/10 p-2 rounded-2xl backdrop-blur-md">
          <div className="text-right hidden sm:block shrink-0">
            <span className="text-[9px] text-blue-200 font-bold block uppercase leading-none">PORTAL LOGIN SIMULATOR</span>
            <span className="text-[10px] font-black text-amber-300">PILIH PERAN / AKUN:</span>
          </div>
          <select
            value={currentTeacher.id}
            onChange={(e) => handleSwitchUser(e.target.value)}
            className="bg-[#092c74] border border-blue-500 text-white font-bold text-xs rounded-xl px-2 py-1 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer max-w-[190px] text-ellipsis"
          >
            {PRESET_USERS.map((user) => (
              <option key={user.id} value={user.id} className="bg-[#031b4e] text-white">
                {user.name} ({user.role})
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              localStorage.removeItem("aats_logged_in");
              localStorage.removeItem("aats_current_teacher");
              setIsLoggedIn(false);
            }}
            className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] sm:text-xs px-2.5 py-1.5 rounded-xl transition-all shadow-md shrink-0 ml-1"
            title="Keluar / Logout"
          >
            <LogOut className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </header>

      {/* Main Body with sidebar and views workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* PERSISTENT SIDEBAR */}
        <aside 
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform md:translate-x-0 md:static transition-transform duration-200 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Menu navigation */}
          <div className="p-4 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3 px-3">Main Workspace</span>
            
            {[
              { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
              { id: "builder", label: "Planning Studio", icon: Cpu },
              { id: "teaching", label: "Teaching Studio", icon: BookOpen },
              { id: "analytics", label: "Academic Intelligence", icon: Activity },
              { id: "lampiran", label: "Lampiran (Repository)", icon: FolderOpen },
              { id: "management", label: "Setelan & Hak Akses", icon: Settings }
            ].map((menu) => {
              const Icon = menu.icon;
              const isActive = activeTab === menu.id;
              return (
                <button
                  key={menu.id}
                  onClick={() => {
                    setActiveTab(menu.id);
                    if (window.innerWidth < 768) setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-100"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{menu.label}</span>
                  </div>
                  <ChevronRight className={`h-3.5 w-3.5 opacity-0 ${isActive ? "opacity-100" : ""}`} />
                </button>
              );
            })}

            <div className="pt-4 border-t border-slate-100 mt-4">
              <button
                onClick={() => {
                  localStorage.removeItem("aats_logged_in");
                  localStorage.removeItem("aats_current_teacher");
                  setIsLoggedIn(false);
                }}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all text-left"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                <span>Keluar dari Sistem</span>
              </button>
            </div>
          </div>

          {/* Slogan & Footer accent */}
          <div className="absolute bottom-16 left-0 right-0 p-4">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-1">
              <span className="text-[10px] text-blue-600 font-extrabold uppercase">CLPS INTEGRATION</span>
              <p className="text-[11px] font-bold text-slate-700 italic leading-relaxed">"Sekali Mengajar, Seluruh Bukti Pembelajaran Terdokumentasi."</p>
            </div>
          </div>
        </aside>

        {/* Content Workspace Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === "dashboard" && (
                <DashboardView 
                  rpps={rpps} 
                  students={students} 
                  currentTeacher={currentTeacher} 
                  onChangeTab={(tab) => setActiveTab(tab)}
                  onSetTeacherRole={async (role) => {
                    const updatedTeacher: Teacher = { ...currentTeacher, role };
                    setCurrentTeacher(updatedTeacher);
                    await saveTeacher(updatedTeacher);
                  }}
                  activeSession={rpps[0]}
                  onUpdateAttendance={handleUpdateAttendance}
                />
              )}

              {activeTab === "builder" && (
                <BuilderView 
                  rpps={rpps} 
                  onSaveRpp={handleSaveRpp} 
                  onPublishRpp={handlePublishRpp}
                  currentTeacherSubject={currentTeacher.subject}
                />
              )}

              {activeTab === "teaching" && (
                <TeachingView 
                  rpps={rpps} 
                  students={students} 
                  onUpdateAttendance={handleUpdateAttendance}
                  onSaveQuickNotes={handleSaveQuickNotes}
                  savedNotes=""
                  onDeleteRpp={handleDeleteRpp}
                />
              )}

              {activeTab === "analytics" && (
                <AnalyticsView students={students} onUpdateStudent={handleUpdateStudent} />
              )}

              {activeTab === "lampiran" && (
                <LampiranView 
                  files={files} 
                  onUploadFile={handleUploadFile} 
                  onDeleteFile={handleDeleteFile}
                />
              )}

              {activeTab === "management" && (
                <ManagementView 
                  currentTeacher={currentTeacher} 
                  onUpdateTeacherSubject={async (subject) => {
                    const updatedTeacher: Teacher = { ...currentTeacher, subject };
                    setCurrentTeacher(updatedTeacher);
                    await saveTeacher(updatedTeacher);
                  }}
                  students={students}
                  onAddStudent={handleAddStudent}
                  onDeleteStudent={handleDeleteStudent}
                  onUpdateStudent={handleUpdateStudent}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* FLOATING AI ASSISTANT PANEL */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {assistantOpen ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-80 sm:w-96 overflow-hidden flex flex-col h-[420px]"
            >
              {/* Header */}
              <div className="p-4 bg-blue-600 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-yellow-300 fill-yellow-300" />
                  <div>
                    <h3 className="font-bold text-xs leading-none">AATS AI Assistant</h3>
                    <span className="text-[10px] text-blue-100 font-semibold pt-1 block leading-none">Asisten Pengajar Cerdas</span>
                  </div>
                </div>
                <button 
                  onClick={() => setAssistantOpen(false)}
                  className="p-1 rounded-lg hover:bg-blue-700/50 text-white/80 hover:text-white transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
                {chatMessages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed font-semibold shadow-sm ${
                      msg.role === "user" 
                        ? "bg-blue-600 text-white rounded-br-none" 
                        : "bg-white border border-slate-200 text-slate-700 rounded-bl-none"
                    }`}>
                      <p>{msg.text}</p>
                      <span className={`text-[9px] font-normal block text-right pt-1 ${
                        msg.role === "user" ? "text-blue-100" : "text-slate-400"
                      }`}>{msg.timestamp}</span>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 rounded-2xl p-3 text-xs text-slate-400 rounded-bl-none shadow-sm flex items-center gap-1 font-bold">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" />
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce delay-75" />
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce delay-150" />
                    </div>
                  </div>
                )}
              </div>

              {/* Input Footer */}
              <div className="p-3 bg-white border-t border-slate-100 flex gap-2 items-center">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ketik pertanyaan untuk asisten AI..."
                  className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:border-blue-500 bg-slate-50"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim()}
                  className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-xl transition-all shadow-sm"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>

            </motion.div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setAssistantOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3.5 shadow-xl shadow-blue-900/15 flex items-center gap-2 font-bold text-xs"
            >
              <MessageSquare className="h-5 w-5 animate-pulse" />
              Asisten AI
            </motion.button>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
