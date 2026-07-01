/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Sparkles, 
  CheckCircle, 
  Cpu, 
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  RotateCw,
  Bell,
  Search,
  LayoutDashboard,
  FileText,
  User,
  Activity,
  FolderOpen,
  Settings,
  X,
  Send,
  HelpCircle,
  FileDown,
  ChevronDown
} from "lucide-react";
import { RPP } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface BuilderViewProps {
  rpps: RPP[];
  onSaveRpp: (rpp: RPP) => void;
  onPublishRpp: (id: string) => void;
  currentTeacherSubject: string;
}

export default function BuilderView({ rpps, onSaveRpp, onPublishRpp, currentTeacherSubject }: BuilderViewProps) {
  // Wizard stepper state (1 to 7)
  const [activeStep, setActiveStep] = useState<number>(1);
  
  // Input fields (for step 1)
  const [subject, setSubject] = useState(currentTeacherSubject || "Informatika");
  const [kelas, setKelas] = useState("VII A");
  const [fase, setFase] = useState("D");
  const [semester, setSemester] = useState("Semester 1");
  const [materi, setMateri] = useState("Berpikir Komputasional");
  const [jp, setJp] = useState(2);
  const [model, setModel] = useState("Problem Based Learning (PBL)");
  const [metode, setMetode] = useState("Diskusi kelompok, Simulasi Kartu, Praktik Mandiri");

  // AI assistant simulation inside Builder
  const [builderPrompt, setBuilderPrompt] = useState("");
  const [builderAILog, setBuilderAILog] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState("");

  // Target values matching the mockup
  const [kesiapanMurid, setKesiapanMurid] = useState("AI telah menganalisis kesiapan murid berdasarkan TP dan fase.");
  const [karakteristikMapel, setKarakteristikMapel] = useState("AI telah menganalisis karakteristik mata pelajaran.");
  const [tujuanPembelajaranText, setTujuanPembelajaranText] = useState(
    "Peserta didik mampu memahami konsep berpikir komputasional dan menerapkannya dalam menyelesaikan masalah sederhana secara terstruktur dan kreatif."
  );

  const steps = [
    { id: 1, label: "Identitas" },
    { id: 2, label: "Tujuan" },
    { id: 3, label: "Pengetahuan" },
    { id: 4, label: "Penilaian" },
    { id: 5, label: "Langkah" },
    { id: 6, label: "Lampiran" },
    { id: 7, label: "Refleksi" }
  ];

  const handleRegenerateKesiapan = () => {
    setIsGenerating(true);
    setGenerationStep("Menganalisis Kesiapan Murid...");
    setTimeout(() => {
      setKesiapanMurid("AI meregenerasi: Berdasarkan asesmen diagnostik, 85% siswa kelas VII A memiliki gaya belajar visual dan menyukai tantangan berbasis game logika.");
      setIsGenerating(false);
    }, 1000);
  };

  const handleRegenerateKarakteristik = () => {
    setIsGenerating(true);
    setGenerationStep("Menganalisis Karakteristik Mapel...");
    setTimeout(() => {
      setKarakteristikMapel("AI meregenerasi: Informatika Fase D menekankan pada pemecahan masalah (problem solving) terstruktur melalui pilar Berpikir Komputasional.");
      setIsGenerating(false);
    }, 1000);
  };

  const handleRewriteTujuan = () => {
    setIsGenerating(true);
    setGenerationStep("Menyusun Tujuan Baru...");
    setTimeout(() => {
      setTujuanPembelajaranText("Peserta didik mampu mendemonstrasikan pemahaman pilar berpikir komputasional (dekomposisi, pengenalan pola, abstraksi, dan algoritma) dalam memecahkan kasus logika sehari-hari.");
      setIsGenerating(false);
    }, 1200);
  };

  const handleImproveTujuan = () => {
    setIsGenerating(true);
    setGenerationStep("Menyempurnakan Tujuan Pembelajaran...");
    setTimeout(() => {
      setTujuanPembelajaranText(prev => prev + " dengan fokus pada kolaborasi kelompok dan bernalar kritis.");
      setIsGenerating(false);
    }, 1000);
  };

  const handleEditManualTujuan = () => {
    const val = prompt("Edit Manual Tujuan Pembelajaran:", tujuanPembelajaranText);
    if (val) setTujuanPembelajaranText(val);
  };

  const handleSendBuilderAssistant = () => {
    if (!builderPrompt.trim()) return;
    setIsGenerating(true);
    setGenerationStep("Mengolah Instruksi AI...");
    setTimeout(() => {
      if (builderPrompt.toLowerCase().includes("tujuan")) {
        setTujuanPembelajaranText("Peserta didik secara berkelompok mampu merancang algoritma pencarian linear untuk mengurutkan data acak.");
      } else if (builderPrompt.toLowerCase().includes("aktivitas") || builderPrompt.toLowerCase().includes("contoh")) {
        alert("AI Assistant: Ditambahkan aktivitas simulasi pencarian kartu angka di Langkah Pembelajaran.");
      } else {
        alert(`AI Assistant memproses: "${builderPrompt}". RPP berhasil disesuaikan.`);
      }
      setBuilderPrompt("");
      setIsGenerating(false);
    }, 1200);
  };

  return (
    <div className="bg-[#f8fafc] rounded-3xl border border-slate-200/60 shadow-xl overflow-hidden">
      
      {/* SECTION HEADER BAR */}
      <div className="bg-blue-600 px-6 py-4 flex items-center justify-between border-b border-blue-700/50">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-full bg-white text-blue-600 flex items-center justify-center font-extrabold text-sm shadow-sm">
            1
          </div>
          <div>
            <span className="text-white font-extrabold text-sm uppercase tracking-wider block">BUILDER (PLANNING STUDIO)</span>
            <span className="text-blue-100 text-[10px] font-medium block">Rancang RPP & Modul Ajar Terintegrasi Kurikulum Merdeka</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/10 uppercase font-mono">STEPPER_MODE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 min-h-[580px]">
        
        {/* LOCAL SIDEBAR (Exactly like mockup Section 1) */}
        <div className="xl:col-span-3 bg-slate-900 text-slate-300 p-4 flex flex-col justify-between border-r border-slate-800">
          <div className="space-y-4">
            <div className="px-3 pb-2 border-b border-slate-800 flex items-center gap-2">
              <Cpu className="h-4 w-4 text-blue-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">PLANNING ENGINE</span>
            </div>

            <nav className="space-y-1">
              {[
                { id: "dashboard", label: "Dashboard", active: false },
                { id: "builder", label: "Builder", active: true },
                { id: "perangkat", label: "Perangkat Ajar", active: false },
                { id: "rpp", label: "RPP", active: false },
                { id: "tp_cp", label: "TP / CP", active: false },
                { id: "penilaian", label: "Penilaian", active: false },
                { id: "rubrik", label: "Rubrik", active: false },
                { id: "lampiran", label: "Lampiran", active: false },
                { id: "preview_publish", label: "Preview & Publish", active: false },
                { id: "riwayat", label: "Riwayat", active: false },
                { id: "ai_assistant", label: "AI Assistant", active: false },
                { id: "pengaturan", label: "Pengaturan", active: false }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => alert(`Navigasi ke submenu RPP Builder: ${item.label}`)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left ${
                    item.active
                      ? "bg-blue-600 text-white shadow-md shadow-blue-900/10 font-bold"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                  }`}
                >
                  <div className={`h-1.5 w-1.5 rounded-full ${item.active ? "bg-white" : "bg-slate-700"}`} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-800 mt-6 space-y-1">
            <span className="text-[9px] text-blue-400 font-bold uppercase block">Status Sinkronisasi</span>
            <p className="text-[10px] text-slate-400 leading-normal">Fase D Terkunci. Dokumen terhubung ke Repository Lampiran.</p>
          </div>
        </div>

        {/* WORKSPACE AREA (Right) */}
        <div className="xl:col-span-9 p-6 flex flex-col justify-between bg-white">
          
          {/* Header Panel (Mockup Title Block) */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h1 className="text-lg font-bold text-slate-900">Builder RPP</h1>
                <p className="text-xs text-slate-400 font-semibold pt-0.5">
                  {subject} &gt; Kelas {kelas} &gt; {semester} &gt; TP 1.1 {materi}
                </p>
              </div>

              {/* Mockup Quick Actions */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => alert("Membuka Asisten AI Builder")}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-blue-100 transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Assistant
                </button>
                <button className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors">
                  <Bell className="h-4 w-4" />
                </button>
                <div className="h-7 w-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-extrabold text-xs">
                  EP
                </div>
              </div>
            </div>

            {/* STEPPER STEPPING DOTS (Exactly matching Section 1 dots) */}
            <div className="py-2">
              <div className="flex items-center justify-between max-w-3xl mx-auto px-4">
                {steps.map((step, idx) => {
                  const isCurrent = activeStep === step.id;
                  const isCompleted = activeStep > step.id;
                  return (
                    <React.Fragment key={step.id}>
                      {/* Circle Dot */}
                      <button
                        onClick={() => setActiveStep(step.id)}
                        className="flex flex-col items-center gap-1.5 focus:outline-none group"
                      >
                        <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isCurrent 
                            ? "bg-blue-600 text-white ring-4 ring-blue-100" 
                            : isCompleted 
                            ? "bg-emerald-600 text-white" 
                            : "bg-slate-100 text-slate-400 border border-slate-200"
                        }`}>
                          {step.id}
                        </div>
                        <span className={`text-[10px] font-bold ${
                          isCurrent ? "text-blue-600" : isCompleted ? "text-emerald-600" : "text-slate-400"
                        }`}>
                          {step.label}
                        </span>
                      </button>

                      {/* Line connector */}
                      {idx < steps.length - 1 && (
                        <div className="flex-1 h-[2px] mx-2 -mt-5 bg-slate-100">
                          <div className={`h-full transition-all duration-300 ${
                            activeStep > step.id ? "bg-emerald-500" : "bg-slate-100"
                          }`} style={{ width: activeStep > step.id ? "100%" : "0%" }} />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* STEP WORKSPACE CONTENT DISPLAY */}
            <div className="space-y-6 pt-4">
              
              {/* Loader overlay inside workspace during edits */}
              {isGenerating && (
                <div className="bg-blue-50/80 border border-blue-100 rounded-2xl p-4 flex items-center gap-3 animate-pulse">
                  <RotateCw className="h-4 w-4 text-blue-600 animate-spin" />
                  <span className="text-xs font-bold text-blue-700">{generationStep}</span>
                </div>
              )}

              {activeStep === 1 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {/* A. IDENTIFIKASI SECTION (Matching layout perfectly) */}
                  <div className="space-y-3">
                    <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">A. Identifikasi</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Card 1: Kesiapan Murid */}
                      <div className="border border-slate-200 rounded-2xl p-4 bg-[#fdfdfd] hover:border-slate-300 transition-all flex flex-col justify-between space-y-3 min-h-[110px]">
                        <div className="space-y-1">
                          <h3 className="text-xs font-extrabold text-slate-800">1. Kesiapan Murid</h3>
                          <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">
                            {kesiapanMurid}
                          </p>
                        </div>
                        <div className="text-right">
                          <button 
                            onClick={handleRegenerateKesiapan}
                            className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 ml-auto"
                          >
                            <RotateCw className="h-3 w-3" />
                            Regenerate
                          </button>
                        </div>
                      </div>

                      {/* Card 2: Karakteristik Mapel */}
                      <div className="border border-slate-200 rounded-2xl p-4 bg-[#fdfdfd] hover:border-slate-300 transition-all flex flex-col justify-between space-y-3 min-h-[110px]">
                        <div className="space-y-1">
                          <h3 className="text-xs font-extrabold text-slate-800">2. Karakteristik Mapel</h3>
                          <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">
                            {karakteristikMapel}
                          </p>
                        </div>
                        <div className="text-right">
                          <button 
                            onClick={handleRegenerateKarakteristik}
                            className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 ml-auto"
                          >
                            <RotateCw className="h-3 w-3" />
                            Regenerate
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* B. TUJUAN PEMBELAJARAN SECTION */}
                  <div className="space-y-3">
                    <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">B. Tujuan Pembelajaran</h2>
                    
                    {/* Styled AI block container */}
                    <div className="border border-blue-100 rounded-2xl p-4 bg-gradient-to-br from-blue-50/20 to-indigo-50/20 space-y-4">
                      <div className="flex items-center gap-2 border-b border-blue-50 pb-2">
                        <Sparkles className="h-4 w-4 text-blue-600" />
                        <span className="text-[10px] font-extrabold text-blue-800 uppercase tracking-wider">AI Generated Content</span>
                      </div>
                      
                      <p className="text-xs font-bold text-slate-700 leading-relaxed italic">
                        "{tujuanPembelajaranText}"
                      </p>

                      <div className="flex flex-wrap gap-2 pt-2 border-t border-blue-50/40">
                        <button 
                          onClick={handleRewriteTujuan}
                          className="bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 text-slate-700 text-[10px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all"
                        >
                          <RotateCw className="h-3 w-3 text-blue-600" />
                          Rewrite
                        </button>
                        <button 
                          onClick={handleImproveTujuan}
                          className="bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 text-slate-700 text-[10px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all"
                        >
                          <Sparkles className="h-3 w-3 text-yellow-500" />
                          Improve
                        </button>
                        <button 
                          onClick={handleEditManualTujuan}
                          className="bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 text-slate-700 text-[10px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all"
                        >
                          <FileText className="h-3 w-3 text-slate-500" />
                          Edit Manual
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Show fallback steps or mock details for other wizard steps */}
              {activeStep > 1 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50 space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                      {activeStep}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">
                        Langkah {activeStep}: {steps[activeStep-1].label}
                      </h3>
                      <p className="text-xs text-slate-400">Penyusunan modul otomatis berbasis kurikulum nasional.</p>
                    </div>
                  </div>

                  {activeStep === 2 && (
                    <div className="bg-white rounded-xl border border-slate-200/60 p-4 space-y-3">
                      <span className="text-[10px] font-extrabold text-slate-400 block uppercase">Daftar Indikator Pencapaian (TP):</span>
                      <ul className="text-xs font-semibold text-slate-600 space-y-2 list-disc pl-4">
                        <li>Mengidentifikasi masalah komputasi sederhana dalam kehidupan sehari-hari.</li>
                        <li>Memetakan pilar dekomposisi untuk memecah masalah besar menjadi bagian-bagian terpisah.</li>
                        <li>Mengembangkan rancangan solusi logis langkah demi langkah (algoritma).</li>
                      </ul>
                    </div>
                  )}

                  {activeStep === 3 && (
                    <div className="bg-white rounded-xl border border-slate-200/60 p-4 space-y-3">
                      <span className="text-[10px] font-extrabold text-slate-400 block uppercase">Materi Prasyarat & Pengetahuan Dasar:</span>
                      <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                        Siswa perlu memahami konsep dasar struktur data array, urutan indeks, serta memiliki nalar kritis dalam membandingkan elemen data secara sistematis.
                      </p>
                    </div>
                  )}

                  {activeStep === 4 && (
                    <div className="bg-white rounded-xl border border-slate-200/60 p-4 space-y-3">
                      <span className="text-[10px] font-extrabold text-slate-400 block uppercase">Asesmen Pembelajaran:</span>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="font-bold text-slate-700 block mb-1">Diagnostik</span>
                          <p className="text-slate-500 font-semibold text-[11px]">Kuis logika interaktif berbasis simulasi mencocokkan kartu angka.</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="font-bold text-slate-700 block mb-1">Formatif (LKPD)</span>
                          <p className="text-slate-500 font-semibold text-[11px]">Lembar kerja analisis efisiensi linear vs binary search.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeStep === 5 && (
                    <div className="bg-white rounded-xl border border-slate-200/60 p-4 space-y-3">
                      <span className="text-[10px] font-extrabold text-slate-400 block uppercase">Sintaks Kegiatan Inti (PBL):</span>
                      <ol className="text-xs font-semibold text-slate-600 space-y-2.5 list-decimal pl-4">
                        <li><strong>Orientasi Masalah:</strong> Mengamati demonstrasi pencarian tumpukan kartu.</li>
                        <li><strong>Organisasi Belajar:</strong> Membagi kelompok beranggotakan 4 siswa.</li>
                        <li><strong>Penyelidikan Mandiri:</strong> Melakukan uji coba manual linear search.</li>
                        <li><strong>Presentasi Hasil:</strong> Memaparkan jumlah komparasi data.</li>
                        <li><strong>Analisis & Evaluasi:</strong> Merumuskan kesimpulan efisiensi algoritma.</li>
                      </ol>
                    </div>
                  )}

                  {activeStep === 6 && (
                    <div className="bg-white rounded-xl border border-slate-200/60 p-4 space-y-3">
                      <span className="text-[10px] font-extrabold text-slate-400 block uppercase">Bahan Ajar Pendukung:</span>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded-lg border border-slate-100">
                          <span className="font-semibold text-slate-700">Slide_Komparasi_Algoritma.pptx</span>
                          <span className="text-[10px] text-slate-400">PPTX • 2.4 MB</span>
                        </div>
                        <div className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded-lg border border-slate-100">
                          <span className="font-semibold text-slate-700">LKPD_Searching_Praktis.pdf</span>
                          <span className="text-[10px] text-slate-400">PDF • 1.2 MB</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeStep === 7 && (
                    <div className="bg-white rounded-xl border border-slate-200/60 p-4 space-y-3">
                      <span className="text-[10px] font-extrabold text-slate-400 block uppercase">Pertanyaan Refleksi Siswa & Guru:</span>
                      <p className="text-xs font-semibold text-slate-600 leading-relaxed italic">
                        "Bagian manakah dari konsep berpikir komputasional yang paling menantang bagi saya? Bagaimana saya mengatasinya pada pertemuan berikutnya?"
                      </p>
                      <button 
                        onClick={() => {
                          const newRpp: RPP = {
                            id: "rpp-" + Date.now(),
                            mataPelajaran: subject,
                            kelas: "VII A",
                            fase,
                            materi,
                            jp,
                            metode,
                            model,
                            content: `# MODUL AJAR INFORMATIKA\n## TP 1.1 ${materi}\n\nTujuan: ${tujuanPembelajaranText}\n\nLangkah-langkah telah disusun.`,
                            lkpdContent: `# LKPD ${materi}\nEksplorasi linear dan binary search.`,
                            rubrikContent: `# RUBRIK PENILAIAN ${materi}`,
                            createdAt: new Date().toLocaleDateString("id-ID"),
                            status: "Published"
                          };
                          onSaveRpp(newRpp);
                          onPublishRpp(newRpp.id);
                          alert("Modul Ajar (RPP) berhasil diterbitkan ke Kelas VII A!");
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-sm shadow-emerald-100"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Terbitkan RPP & Sinkronkan
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

            </div>
          </div>

          {/* Stepper Wizard Action Buttons */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-6">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  const newRpp: RPP = {
                    id: "rpp-" + Date.now(),
                    mataPelajaran: subject,
                    kelas: kelas,
                    fase: fase,
                    materi: materi,
                    jp: jp,
                    metode: metode,
                    model: model,
                    content: `## MODUL AJAR: ${materi}\n\n### IDENTITAS MODUL\n- **Mata Pelajaran**: ${subject}\n- **Kelas**: ${kelas}\n- **Fase/Semester**: Fase ${fase} / ${semester}\n- **Alokasi Waktu**: ${jp} JP\n\n### CAPAIAN & TUJUAN PEMBELAJARAN\n- **Tujuan Pembelajaran**: ${tujuanPembelajaranText}\n\n### PROFIL PELAJAR PANCASILA\n- Mandiri\n- Bernalar Kritis\n- Kreatif\n\n### MEDIA & BAHAN AJAR\n- Slide Presentasi ${materi}\n- LKPD Eksplorasi Kelompok\n\n### KEGIATAN INTI (${model})\n1. Orientasi Masalah\n2. Organisasi Belajar Kelompok\n3. Penyelidikan Individu/Kelompok\n4. Pengembangan & Penyajian Hasil\n5. Analisis & Evaluasi`,
                    lkpdContent: `### LEMBAR KERJA PESERTA DIDIK (LKPD)\n\n**Materi**: ${materi}\n**Sasaran**: Kelas ${kelas}\n\n#### Tugas Kelompok:\n1. Diskusikan solusi logis dari masalah pencarian menggunakan metode yang diajarkan.\n2. Tuliskan urutan langkah/algoritma di lembar jawaban.\n3. Presentasikan hasil temuan kelompok Anda.`,
                    rubrikContent: `### RUBRIK PENILAIAN\n\n| Aspek Penilaian | Sangat Baik (4) | Baik (3) | Cukup (2) |\n|---|---|---|---|\n| **Pemahaman Teori** | Mampu menjelaskan konsep secara runut | Menjelaskan konsep dengan benar tapi singkat | Butuh bimbingan minor |\n| **Keterampilan Praktik** | Mampu mempraktikkan simulasi mandiri | Mampu mempraktikkan simulasi dengan bantuan | Butuh bantuan penuh |`,
                    createdAt: new Date().toISOString(),
                    status: "Draft"
                  };
                  onSaveRpp(newRpp);
                  alert(`Sukses menyimpan RPP '${materi}' sebagai DRAFT ke database Cloud Firestore!`);
                }}
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
              >
                Simpan Draft
              </button>
              <button 
                onClick={() => {
                  if (activeStep > 1) setActiveStep(prev => prev - 1);
                }}
                disabled={activeStep === 1}
                className="bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Kembali
              </button>
            </div>

            <button 
              onClick={() => {
                if (activeStep < 7) {
                  setActiveStep(prev => prev + 1);
                } else {
                  const newRpp: RPP = {
                    id: "rpp-" + Date.now(),
                    mataPelajaran: subject,
                    kelas: kelas,
                    fase: fase,
                    materi: materi,
                    jp: jp,
                    metode: metode,
                    model: model,
                    content: `## MODUL AJAR: ${materi}\n\n### IDENTITAS MODUL\n- **Mata Pelajaran**: ${subject}\n- **Kelas**: ${kelas}\n- **Fase/Semester**: Fase ${fase} / ${semester}\n- **Alokasi Waktu**: ${jp} JP\n\n### CAPAIAN & TUJUAN PEMBELAJARAN\n- **Tujuan Pembelajaran**: ${tujuanPembelajaranText}\n\n### PROFIL PELAJAR PANCASILA\n- Mandiri\n- Bernalar Kritis\n- Kreatif\n\n### MEDIA & BAHAN AJAR\n- Slide Presentasi ${materi}\n- LKPD Eksplorasi Kelompok\n\n### KEGIATAN INTI (${model})\n1. Orientasi Masalah\n2. Organisasi Belajar Kelompok\n3. Penyelidikan Individu/Kelompok\n4. Pengembangan & Penyajian Hasil\n5. Analisis & Evaluasi`,
                    lkpdContent: `### LEMBAR KERJA PESERTA DIDIK (LKPD)\n\n**Materi**: ${materi}\n**Sasaran**: Kelas ${kelas}\n\n#### Tugas Kelompok:\n1. Diskusikan solusi logis dari masalah pencarian menggunakan metode yang diajarkan.\n2. Tuliskan urutan langkah/algoritma di lembar jawaban.\n3. Presentasikan hasil temuan kelompok Anda.`,
                    rubrikContent: `### RUBRIK PENILAIAN\n\n| Aspek Penilaian | Sangat Baik (4) | Baik (3) | Cukup (2) |\n|---|---|---|---|\n| **Pemahaman Teori** | Mampu menjelaskan konsep secara runut | Menjelaskan konsep dengan benar tapi singkat | Butuh bimbingan minor |\n| **Keterampilan Praktik** | Mampu mempraktikkan simulasi mandiri | Mampu mempraktikkan simulasi dengan bantuan | Butuh bantuan penuh |`,
                    createdAt: new Date().toISOString(),
                    status: "Published"
                  };
                  onSaveRpp(newRpp);
                  alert(`Sukses mempublikasikan RPP '${materi}' ke dalam Roster Teaching Studio!`);
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2 rounded-xl shadow-md shadow-blue-200 transition-all flex items-center gap-1.5"
            >
              <span>{activeStep === 7 ? "Selesai" : "Lanjutkan"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* AI ASSISTANT PANEL inside Builder Workspace (Bottom Layout) */}
          <div className="mt-8 border-t border-slate-100 pt-6 space-y-3 bg-slate-50/50 -mx-6 -mb-6 p-6">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              AI Assistant (Builder)
            </h3>
            
            <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
              Tanyakan atau minta AI membuat konten RPP, rubrik penilaian, instrumen refleksi, maupun bahan ajar.
            </p>

            {/* Prompt input with send */}
            <div className="relative">
              <input 
                type="text"
                value={builderPrompt}
                onChange={(e) => setBuilderPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendBuilderAssistant()}
                placeholder="Tanyakan atau minta AI membuat konten..."
                className="w-full rounded-2xl border border-slate-200/80 px-4 py-3 pr-12 text-xs font-semibold focus:outline-none focus:border-blue-500 bg-white shadow-sm placeholder-slate-400"
              />
              <button 
                onClick={handleSendBuilderAssistant}
                disabled={!builderPrompt.trim()}
                className="absolute right-2 top-2 p-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-xl transition-all shadow-sm"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Quick Suggestions underneath */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                { label: "Buat tujuan pembelajaran", prompt: "Buat tujuan pembelajaran berpikir komputasional kelas VII" },
                { label: "Tambahkan contoh aktivitas", prompt: "Berikan contoh aktivitas interaktif yang seru untuk siswa" },
                { label: "Buat rubrik penilaian", prompt: "Susun rubrik penilaian formatif dengan 4 aspek skor" },
                { label: "Buat asesmen diagnostik", prompt: "Tulis 3 pertanyaan pemantik asesmen diagnostik awal" }
              ].map((pill, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setBuilderPrompt(pill.prompt);
                  }}
                  className="bg-white hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl text-[10px] font-bold text-slate-600 shadow-sm transition-all"
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
