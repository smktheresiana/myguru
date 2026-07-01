/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  BookOpen, 
  CheckSquare, 
  Play, 
  Pause, 
  RotateCcw, 
  Save, 
  Users, 
  Clock, 
  UserCheck, 
  Sparkles,
  ChevronRight,
  Bell,
  Search,
  Check,
  Award,
  Printer,
  FileDown,
  FileText,
  Trash2
} from "lucide-react";
import { Student, RPP } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface TeachingViewProps {
  rpps: RPP[];
  students: Student[];
  onUpdateAttendance: (studentId: string, status: Student["attendance"]) => void;
  onSaveQuickNotes: (notes: string) => void;
  savedNotes: string;
  onDeleteRpp?: (id: string) => void;
}

export default function TeachingView({ 
  rpps, 
  students, 
  onUpdateAttendance, 
  onSaveQuickNotes,
  savedNotes: initialSavedNotes,
  onDeleteRpp
}: TeachingViewProps) {
  
  // Teaching Active State Simulation
  const [isTeaching, setIsTeaching] = useState(false);
  const [activeTab, setActiveTab] = useState<"detail_rpp" | "alur" | "materi" | "lkpd" | "penilaian" | "refleksi">("detail_rpp");
  const [deletingRppId, setDeletingRppId] = useState<string | null>(null);

  // Selected RPP ID for preview/teach
  const [selectedRppId, setSelectedRppId] = useState<string>(
    rpps && rpps.length > 0 ? rpps[0].id : "rpp-default"
  );

  // Sync selectedRppId with rpps prop when it changes or when currently selected RPP is deleted
  useEffect(() => {
    if (rpps && rpps.length > 0) {
      const exists = rpps.some(r => r.id === selectedRppId);
      if (!exists || selectedRppId === "rpp-default") {
        setSelectedRppId(rpps[0].id);
      }
    }
  }, [rpps, selectedRppId]);

  const activeRpp = rpps.find(r => r.id === selectedRppId) || rpps[0] || {
    id: "rpp-default",
    mataPelajaran: "Informatika",
    kelas: "VII A",
    fase: "D",
    materi: "Berpikir Komputasional - Pencarian (Searching)",
    jp: 2,
    metode: "Diskusi kelompok, Simulasi Kartu, Praktik Mandiri",
    model: "Problem Based Learning (PBL)",
    content: `# MODUL AJAR INFORMATIKA\n## A. IDENTITAS MODUL\n* **Mata Pelajaran:** Informatika\n* **Kelas / Fase:** VII A / D\n* **Elemen:** Berpikir Komputasional\n* **Alokasi Waktu:** 2 JP (2 x 45 Menit)\n\n## B. KOMPETENSI AWAL\nSiswa telah memahami konsep algoritma sederhana dan pemecahan masalah dasar dalam kehidupan sehari-hari.\n\n## C. PROFIL PELAJAR PANCASILA\n* Mandiri\n* Bernalar Kritis\n* Kreatif\n\n## D. TUJUAN PEMBELAJARAN (TP)\n1. Peserta didik mampu menjelaskan konsep pencarian (searching) dengan tepat.\n2. Peserta didik mampu membedakan algoritma Linear Search dan Binary Search secara runtut.\n3. Peserta didik mampu memecahkan kasus pencarian data dalam kehidupan nyata.\n\n## E. LANGKAH PEMBELAJARAN\n### 1. Pendahuluan (10 Menit)\n* Orientasi kelas, doa pembuka, absensi.\n* **Apersepsi:** Menanyakan siswa tentang cara mencari nomor kontak di HP.\n* **Motivasi:** Menjelaskan pentingnya kecepatan algoritma pencarian di era Big Data.\n\n### 2. Kegiatan Inti (70 Menit)\n* **Orientasi Masalah:** Guru memberikan tumpukan kartu acak kepada siswa dan meminta mereka mencari angka tertentu.\n* **Organisasi Belajar:** Siswa berkelompok membandingkan pencarian berurutan dengan membelah dua tumpukan (Binary Search).\n* **Penyelidikan Mandiri:** Siswa mengisi LKPD yang disediakan.\n\n### 3. Penutup (10 Menit)\n* Guru dan siswa merefleksikan hasil pembelajaran.\n* Guru memberikan tugas remedial bagi siswa di bawah KKM 75.`,
    lkpdContent: `# LEMBAR KERJA PESERTA DIDIK (LKPD)\n### Judul Kegiatan: Eksplorasi Algoritma Searching\n**Mata Pelajaran:** Informatika\n**Kelas:** VII A\n**Alokasi Waktu:** 30 Menit\n\n---\n\n#### A. PETUNJUK BELAJAR\n1. Selesaikan LKPD ini secara berkelompok (3-4 orang).\n2. Gunakan tumpukan kartu angka yang disediakan guru sebagai alat bantu visual.\n\n#### B. LANGKAH KERJA\n1. Atur 10 kartu angka secara berurutan: **12, 18, 24, 30, 36, 42, 48, 54, 60, 66**.\n2. Cari kartu berangka **48** menggunakan metode **Linear Search** (dari ujung kiri satu per satu). Catat berapa kali perbandingan dilakukan.\n3. Cari angka yang sama menggunakan metode **Binary Search** (pilih nilai tengah, buang bagian yang tidak mungkin). Catat berapa kali perbandingan dilakukan.\n\n#### C. PERTANYAAN DISKUSI (HOTS)\n1. Metode pencarian manakah yang lebih cepat jika data sudah dalam keadaan terurut rapi? Mengapa?\n2. Jika data acak dan tidak terurut, apakah kita bisa menggunakan Binary Search langsung? Jelaskan alasannya!`,
    rubrikContent: `# RUBRIK PENILAIAN & ASESMEN FORMATIF\n### Elemen: Berpikir Komputasional - Searching\n\n| Aspek Penilaian | Sangat Baik (Skor 4) | Baik (Skor 3) | Cukup (Skor 2) | Perlu Bimbingan (Skor 1) |\n| :--- | :--- | :--- | :--- | :--- |\n| **Pemahaman Teori** | Mampu menjelaskan perbedaan Linear & Binary Search secara komprehensif. | Mampu membedakan dengan benar namun penjelasannya kurang lengkap. | Mengerti konsep dasar namun tertukar dalam beberapa langkah logis. | Belum memahami perbedaan kedua metode pencarian. |\n| **Keterampilan Praktik** | Mampu melakukan simulasi pencarian dengan kartu tanpa kesalahan langkah. | Melakukan simulasi dengan benar tetapi membutuhkan bimbingan kecil. | Melakukan simulasi dengan bantuan intensif dari guru. | Belum mampu melakukan simulasi mandiri. |\n| **Kolaborasi Kelompok** | Sangat aktif memimpin diskusi kelompok dan bertanggung jawab. | Berpartisipasi aktif dalam pengerjaan tugas kelompok. | Kurang berpartisipasi dan cenderung pasif dalam kelompok. | Menyerahkan seluruh pekerjaan kepada teman sekelompok. |`,
    createdAt: "29/06/2026",
    status: "Published"
  };

  // Browser Print RPP Utility
  const handlePrintPDF = (rpp: any) => {
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0px";
    iframe.style.height = "0px";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (!doc) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>RPP - ${rpp.materi}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
            body {
              font-family: 'Inter', sans-serif;
              color: #1e293b;
              padding: 40px;
              line-height: 1.6;
              background-color: #ffffff;
            }
            .header-container {
              text-align: center;
              border-bottom: 3px double #1e293b;
              padding-bottom: 15px;
              margin-bottom: 25px;
            }
            .header-title {
              font-size: 18px;
              font-weight: 800;
              margin: 0;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              color: #0f172a;
            }
            .header-subtitle {
              font-size: 13px;
              font-weight: 600;
              margin: 4px 0 0 0;
              color: #475569;
            }
            .header-address {
              font-size: 9px;
              color: #64748b;
              margin-top: 4px;
            }
            .identity-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 25px;
            }
            .identity-table td {
              padding: 6px 10px;
              font-size: 11px;
              border: 1px solid #cbd5e1;
            }
            .identity-table td.label {
              font-weight: 700;
              background-color: #f1f5f9;
              width: 25%;
            }
            .section-title {
              font-size: 13px;
              font-weight: 800;
              text-transform: uppercase;
              border-bottom: 1.5px solid #0f172a;
              padding-bottom: 3px;
              margin-top: 20px;
              margin-bottom: 10px;
              color: #0f172a;
            }
            .content-p {
              font-size: 11px;
              margin-bottom: 10px;
              text-align: justify;
              white-space: pre-wrap;
              color: #334155;
            }
            .signature-area {
              margin-top: 45px;
              width: 100%;
              display: flex;
              justify-content: space-between;
              font-size: 11px;
            }
            .signature-box {
              text-align: center;
              width: 200px;
            }
            .signature-space {
              height: 60px;
            }
            @media print {
              body {
                padding: 0;
              }
              @page {
                size: A4;
                margin: 15mm;
              }
            }
          </style>
        </head>
        <body>
          <div class="header-container">
            <div class="header-title">RENCANA PELAKSANAAN PEMBELAJARAN (RPP)</div>
            <div class="header-subtitle">SMK THERESIANA SEMARANG</div>
            <div class="header-address">Jl. Gajahmada No.91, Miroto, Kec. Semarang Tengah, Kota Semarang, Jawa Tengah</div>
          </div>

          <table class="identity-table">
            <tr>
              <td class="label">Mata Pelajaran</td>
              <td>${rpp.mataPelajaran}</td>
              <td class="label">Kelas / Semester</td>
              <td>${rpp.kelas} / Ganjil</td>
            </tr>
            <tr>
              <td class="label">Materi Pokok</td>
              <td>${rpp.materi}</td>
              <td class="label">Alokasi Waktu</td>
              <td>${rpp.jp} JP (90 Menit)</td>
            </tr>
            <tr>
              <td class="label">Model Pembelajaran</td>
              <td>${rpp.model}</td>
              <td class="label">Metode Pembelajaran</td>
              <td>${rpp.metode}</td>
            </tr>
            <tr>
              <td class="label">Fase / Kurikulum</td>
              <td>Fase ${rpp.fase} / Kurikulum Merdeka</td>
              <td class="label">Tanggal Dibuat</td>
              <td>${rpp.createdAt}</td>
            </tr>
          </table>

          <div class="section-title">I. TUJUAN PEMBELAJARAN</div>
          <div class="content-p">
            Peserta didik diharapkan mampu memahami landasan konsep berpikir komputasional dan menerapkannya untuk mengidentifikasi serta memecahkan masalah dalam kehidupan sehari-hari secara terstruktur, kolaboratif, dan kritis.
          </div>

          <div class="section-title">II. LANGKAH-LANGKAH & KONTEN PEMBELAJARAN</div>
          <div class="content-p">${rpp.content || "Konten rencana pelaksanaan pembelajaran yang dihasilkan."}</div>

          ${rpp.lkpdContent ? `
            <div class="section-title">III. LEMBAR KERJA PESERTA DIDIK (LKPD)</div>
            <div class="content-p">${rpp.lkpdContent}</div>
          ` : ""}

          ${rpp.rubrikContent ? `
            <div class="section-title">IV. RUBRIK & INSTRUMEN PENILAIAN</div>
            <div class="content-p">${rpp.rubrikContent}</div>
          ` : ""}

          <div class="signature-area">
            <div class="signature-box">
              <div>Mengetahui,</div>
              <div style="font-weight: bold; margin-top: 5px;">Kepala Sekolah</div>
              <div class="signature-space"></div>
              <div style="text-decoration: underline; font-weight: bold;">Margaretha Sofia, M.Pd.</div>
              <div>NIP. 19740523 199903 2 002</div>
            </div>
            <div class="signature-box">
              <div>Semarang, ${rpp.createdAt}</div>
              <div style="font-weight: bold; margin-top: 5px;">Guru Mata Pelajaran</div>
              <div class="signature-space"></div>
              <div style="text-decoration: underline; font-weight: bold;">Drs. Eko Prasetyo, M.Kom.</div>
              <div>NIP. 19820412 201012 1 003</div>
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() {
                window.frameElement.remove();
              }, 1000);
            };
          </script>
        </body>
      </html>
    `;

    doc.open();
    doc.write(htmlContent);
    doc.close();
  };

  // Checklist states (mockup Section 2)
  const [pendahuluanChecked, setPendahuluanChecked] = useState({
    pembiasaan: false,
    apersepsi: false,
    motivasi: false
  });

  const [kegiatanIntiChecked, setKegiatanIntiChecked] = useState({
    orientasi: false,
    organisasi: false,
    bimbing: false,
    kembang: false,
    analisis: false
  });

  const [penutupChecked, setPenutupChecked] = useState({
    resume: false,
    kesimpulan: false,
    doa: false
  });

  // Digital Timer State
  const [seconds, setSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return [
      hrs.toString().padStart(2, '0'),
      mins.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };

  const handleStartTeaching = () => {
    setIsTeaching(prev => !prev);
    setTimerRunning(prev => !prev);
  };

  const handleResetTimer = () => {
    setSeconds(0);
    setTimerRunning(false);
  };

  // Quick notes state
  const [quickNotes, setQuickNotes] = useState(initialSavedNotes || "");
  const [notesStatus, setNotesStatus] = useState("");

  const handleSaveNotesLocal = () => {
    onSaveQuickNotes(quickNotes);
    setNotesStatus("Catatan disimpan!");
    setTimeout(() => setNotesStatus(""), 2000);
  };

  // Attendance breakdown
  const totalStudents = students.length;
  const countHadir = students.filter(s => s.attendance === "Hadir").length;
  const countSakit = students.filter(s => s.attendance === "Sakit").length;
  const countIzin = students.filter(s => s.attendance === "Izin").length;
  const countAlfa = students.filter(s => s.attendance === "Alfa" || s.attendance === "Sakit" ? false : s.attendance === "Hadir" ? false : s.attendance === "Izin" ? false : true).length;
  const countTidakHadir = totalStudents - countHadir;

  // Attendance Detail Modal State
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);

  return (
    <div className="bg-[#f8fafc] rounded-3xl border border-slate-200/60 shadow-xl overflow-hidden">
      
      {/* SECTION HEADER BAR */}
      <div className="bg-purple-600 px-6 py-4 flex items-center justify-between border-b border-purple-700/50">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-full bg-white text-purple-600 flex items-center justify-center font-extrabold text-sm shadow-sm">
            2
          </div>
          <div>
            <span className="text-white font-extrabold text-sm uppercase tracking-wider block">TEACHING (TEACHING STUDIO)</span>
            <span className="text-purple-100 text-[10px] font-medium block">Pelaksanaan Pembelajaran Interaktif & Jurnal Mengajar Digital</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/10 uppercase font-mono">LIVE_CLASS</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 min-h-[580px]">
        
        {/* LOCAL SIDEBAR (Purple/Indigo Theme) */}
        <div className="xl:col-span-3 bg-slate-900 text-slate-300 p-4 flex flex-col justify-between border-r border-slate-800">
          <div className="space-y-4">
            <div className="px-3 pb-2 border-b border-slate-800 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-purple-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">CLASSROOM HUB</span>
            </div>

            <nav className="space-y-1">
              {[
                { id: "dashboard", label: "Dashboard", active: false },
                { id: "mengajar", label: "Mengajar Hari Ini", active: true },
                { id: "kelas_saya", label: "Kelas Saya", active: false },
                { id: "materi", label: "Materi", active: false },
                { id: "penilaian", label: "Penilaian", active: false },
                { id: "kehadiran", label: "Kehadiran", active: false },
                { id: "refleksi", label: "Refleksi", active: false },
                { id: "catatan", label: "Catatan", active: false },
                { id: "kalender", label: "Kalender", active: false },
                { id: "pengaturan", label: "Pengaturan", active: false }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => alert(`Navigasi ke menu Teaching: ${item.label}`)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left ${
                    item.active
                      ? "bg-purple-600 text-white shadow-md shadow-purple-900/10 font-bold"
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
            <span className="text-[9px] text-purple-400 font-bold uppercase block">Koneksi Hardware</span>
            <p className="text-[10px] text-slate-400 leading-normal">Smart Board & QR Presensi Terhubung otomatis.</p>
          </div>
        </div>

        {/* WORKSPACE AREA (Right) */}
        <div className="xl:col-span-9 p-6 flex flex-col bg-white">
          
          {/* Header Panel (Title block) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-5">
            <div>
              <h1 className="text-lg font-bold text-slate-900">Mengajar Hari Ini</h1>
              <p className="text-xs text-slate-400 font-semibold pt-0.5">Pantau aktivitas mengajar aktif dan jurnal penilaian secara langsung.</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors">
                <Bell className="h-4 w-4" />
              </button>
              <div className="h-7 w-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-extrabold text-xs">
                EP
              </div>
            </div>
          </div>

          {/* CLPS INTEGRATED TEACHING HEADER CARD (Matches mockup Section 2 header) */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">{activeRpp.mataPelajaran} – Kelas {activeRpp.kelas}</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase">
                  Status: {activeRpp.status}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500">{activeRpp.materi}</p>
              <p className="text-xs font-mono text-slate-400 font-bold pt-1">08.00 - 09.40 WIB • {activeRpp.jp} JP</p>
            </div>

            <div>
              <button
                onClick={handleStartTeaching}
                className={`w-full md:w-auto px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 ${
                  isTeaching 
                    ? "bg-red-600 hover:bg-red-700 text-white shadow-red-100" 
                    : "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-100"
                }`}
              >
                {isTeaching ? (
                  <>
                    <Pause className="h-4 w-4" />
                    Hentikan Mengajar
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Mulai Mengajar
                  </>
                )}
              </button>
            </div>
          </div>

          {/* HORIZONTAL WORKSPACE TABS */}
          <div className="flex border-b border-slate-100 mb-6 overflow-x-auto">
            {[
              { id: "detail_rpp", label: "Detail RPP" },
              { id: "alur", label: "Alur Pembelajaran" },
              { id: "materi", label: "Materi" },
              { id: "lkpd", label: "LKPD" },
              { id: "penilaian", label: "Penilaian" },
              { id: "refleksi", label: "Refleksi" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-purple-600 text-purple-600"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* MAIN DUAL COLUMN WORKSPACE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT COLUMN: ACTIVE VIEW (STEPS CHECKLIST) */}
            <div className="lg:col-span-8 space-y-5">
              
              {activeTab === "detail_rpp" && (
                <div className="space-y-4 animate-in fade-in duration-250">
                  {/* Dropdown Selector if multiple RPPs exist */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-purple-50/50 border border-purple-100 rounded-2xl p-4">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-black text-purple-700 uppercase tracking-wider block">Pilih Modul Ajar / RPP Aktif</span>
                      <p className="text-xs text-slate-500 font-semibold">Tampilkan rincian dokumen RPP yang ingin Anda cetak atau pelajari.</p>
                    </div>
                    <select
                      value={selectedRppId}
                      onChange={(e) => setSelectedRppId(e.target.value)}
                      className="text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500 shadow-sm shrink-0 cursor-pointer"
                    >
                      {rpps && rpps.length > 0 ? (
                        rpps.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.mataPelajaran} - {r.materi} ({r.kelas})
                          </option>
                        ))
                      ) : (
                        <option value="rpp-default">Informatika - Berpikir Komputasional (VII A)</option>
                      )}
                    </select>
                  </div>

                  {/* Document Container */}
                  <div className="bg-white border border-slate-200 rounded-3xl shadow-md overflow-hidden relative">
                    {/* Floating PDF Print button & Delete */}
                    <div className="flex justify-between items-center bg-slate-50 border-b border-slate-200 px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-purple-600" />
                        <span className="text-xs font-bold text-slate-800">Preview RPP Fisik</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {onDeleteRpp && (
                          deletingRppId === activeRpp.id ? (
                            <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-xl px-2.5 py-1.5">
                              <span className="text-[10px] font-bold text-red-700">Yakin hapus?</span>
                              <button
                                onClick={async () => {
                                  onDeleteRpp(activeRpp.id);
                                  setDeletingRppId(null);
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-[10px] px-2 py-1 rounded-lg transition-all"
                              >
                                Ya, Hapus
                              </button>
                              <button
                                onClick={() => setDeletingRppId(null)}
                                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold text-[10px] px-2 py-1 rounded-lg transition-all"
                              >
                                Batal
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeletingRppId(activeRpp.id)}
                              className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-2"
                              title="Hapus RPP"
                            >
                              <Trash2 className="h-4 w-4" />
                              Hapus
                            </button>
                          )
                        )}
                        <button
                          onClick={() => handlePrintPDF(activeRpp)}
                          className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md shadow-purple-100 flex items-center gap-2"
                        >
                          <Printer className="h-4 w-4" />
                          Cetak ke PDF
                        </button>
                      </div>
                    </div>

                    {/* Paper Sheet styling */}
                    <div className="p-8 sm:p-10 text-slate-800 space-y-6 font-sans">
                      {/* Paper Header */}
                      <div className="text-center border-b-4 border-double border-slate-900 pb-4 space-y-1">
                        <h1 className="text-base sm:text-lg font-black tracking-wide text-slate-900 uppercase">RENCANA PELAKSANAAN PEMBELAJARAN (RPP)</h1>
                        <h2 className="text-xs sm:text-sm font-extrabold text-slate-600">SMK THERESIANA SEMARANG</h2>
                        <p className="text-[10px] text-slate-400 font-bold">Jl. Gajahmada No.91, Miroto, Kec. Semarang Tengah, Kota Semarang, Jawa Tengah</p>
                      </div>

                      {/* Identity Details Table */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-200 border border-slate-200 rounded-xl overflow-hidden text-xs">
                        <div className="bg-slate-50 p-3 flex justify-between gap-2 border-b border-r border-slate-200">
                          <span className="font-extrabold text-slate-500 uppercase text-[9px]">Mata Pelajaran:</span>
                          <span className="font-bold text-slate-800">{activeRpp.mataPelajaran}</span>
                        </div>
                        <div className="bg-slate-50 p-3 flex justify-between gap-2 border-b border-slate-200">
                          <span className="font-extrabold text-slate-500 uppercase text-[9px]">Kelas / Semester:</span>
                          <span className="font-bold text-slate-800">{activeRpp.kelas} / Ganjil</span>
                        </div>
                        <div className="bg-slate-50 p-3 flex justify-between gap-2 border-r border-slate-200">
                          <span className="font-extrabold text-slate-500 uppercase text-[9px]">Materi Pokok:</span>
                          <span className="font-bold text-slate-800">{activeRpp.materi}</span>
                        </div>
                        <div className="bg-slate-50 p-3 flex justify-between gap-2">
                          <span className="font-extrabold text-slate-500 uppercase text-[9px]">Alokasi Waktu:</span>
                          <span className="font-bold text-slate-800">{activeRpp.jp} JP (90 Menit)</span>
                        </div>
                        <div className="bg-slate-50 p-3 flex justify-between gap-2 border-t border-r border-slate-200 col-span-1 sm:col-span-2">
                          <span className="font-extrabold text-slate-500 uppercase text-[9px]">Model & Metode:</span>
                          <span className="font-bold text-slate-800">{activeRpp.model} • {activeRpp.metode}</span>
                        </div>
                      </div>

                      {/* Objectives */}
                      <div className="space-y-2">
                        <h3 className="text-xs font-black uppercase text-slate-900 border-b-2 border-slate-800 pb-1">I. TUJUAN PEMBELAJARAN</h3>
                        <p className="text-xs leading-relaxed text-slate-700 font-medium">
                          Peserta didik secara berkelompok dan mandiri diharapkan mampu memahami prinsip-prinsip berpikir komputasional, serta menyusun dan merealisasikan langkah-langkah pemecahan masalah sederhana sesuai dengan elemen pembelajaran kurikulum Merdeka.
                        </p>
                      </div>

                      {/* Main RPP Content */}
                      <div className="space-y-2">
                        <h3 className="text-xs font-black uppercase text-slate-900 border-b-2 border-slate-800 pb-1">II. LANGKAH-LANGKAH & KONTEN PEMBELAJARAN</h3>
                        <div className="text-xs leading-relaxed text-slate-700 font-semibold space-y-4 whitespace-pre-wrap">
                          {activeRpp.content}
                        </div>
                      </div>

                      {/* LKPD Content if exists */}
                      {activeRpp.lkpdContent && (
                        <div className="space-y-2">
                          <h3 className="text-xs font-black uppercase text-slate-900 border-b-2 border-slate-800 pb-1">III. LEMBAR KERJA PESERTA DIDIK (LKPD)</h3>
                          <div className="text-xs leading-relaxed text-slate-700 font-semibold space-y-4 whitespace-pre-wrap">
                            {activeRpp.lkpdContent}
                          </div>
                        </div>
                      )}

                      {/* Assessment Rubric if exists */}
                      {activeRpp.rubrikContent && (
                        <div className="space-y-2">
                          <h3 className="text-xs font-black uppercase text-slate-900 border-b-2 border-slate-800 pb-1">IV. RUBRIK & ASESMEN</h3>
                          <div className="text-xs leading-relaxed text-slate-700 font-semibold space-y-4 whitespace-pre-wrap">
                            {activeRpp.rubrikContent}
                          </div>
                        </div>
                      )}

                      {/* Signatures Area */}
                      <div className="pt-8 flex flex-col sm:flex-row justify-between gap-6 text-xs border-t border-slate-100">
                        <div className="space-y-12">
                          <div className="space-y-1 text-slate-600">
                            <p>Mengetahui,</p>
                            <p className="font-extrabold text-slate-800">Kepala Sekolah</p>
                          </div>
                          <div className="space-y-0.5">
                            <p className="font-black text-slate-800 underline">Margaretha Sofia, M.Pd.</p>
                            <p className="text-[10px] text-slate-400 font-bold">NIP. 19740523 199903 2 002</p>
                          </div>
                        </div>

                        <div className="space-y-12 text-left sm:text-right">
                          <div className="space-y-1 text-slate-600">
                            <p>Semarang, {activeRpp.createdAt || "29 Juni 2026"}</p>
                            <p className="font-extrabold text-slate-800">Guru Mata Pelajaran</p>
                          </div>
                          <div className="space-y-0.5">
                            <p className="font-black text-slate-800 underline">Drs. Eko Prasetyo, M.Kom.</p>
                            <p className="text-[10px] text-slate-400 font-bold">NIP. 19820412 201012 1 003</p>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Bottom Action bar */}
                    <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex justify-between items-center">
                      <div>
                        {onDeleteRpp && (
                          deletingRppId === activeRpp.id ? (
                            <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-xl px-2.5 py-1.5">
                              <span className="text-xs font-bold text-red-700">Yakin hapus RPP ini?</span>
                              <button
                                onClick={async () => {
                                  onDeleteRpp(activeRpp.id);
                                  setDeletingRppId(null);
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-3 py-1.5 rounded-lg transition-all"
                              >
                                Ya, Hapus
                              </button>
                              <button
                                onClick={() => setDeletingRppId(null)}
                                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold text-xs px-3 py-1.5 rounded-lg transition-all"
                              >
                                Batal
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeletingRppId(activeRpp.id)}
                              className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-2"
                            >
                              <Trash2 className="h-4 w-4" />
                              Hapus RPP Ini
                            </button>
                          )
                        )}
                      </div>
                      <button
                        onClick={() => handlePrintPDF(activeRpp)}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md shadow-purple-100 flex items-center gap-2"
                      >
                        <Printer className="h-4 w-4" />
                        Cetak ke PDF
                      </button>
                    </div>

                  </div>
                </div>
              )}

              {activeTab === "alur" && (
                <div className="space-y-4">
                  {/* PENDAHULUAN CARD */}
                  <div className="border border-slate-200 rounded-2xl p-5 bg-[#fafbfd] hover:shadow-sm transition-all space-y-3.5">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                      <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Pendahuluan</h3>
                    </div>
                    
                    <div className="space-y-2.5">
                      {[
                        { key: "pembiasaan", label: "Pembiasaan (Berdoa, Salam, Presensi)" },
                        { key: "apersepsi", label: "Apersepsi (Review materi minggu lalu & Pemantik)" },
                        { key: "motivasi", label: "Motivasi (Pentingnya Berpikir Komputasional di Industri)" }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-2.5 bg-white border border-slate-100 rounded-xl">
                          <span className="text-xs font-semibold text-slate-700">{item.label}</span>
                          <input 
                            type="checkbox"
                            checked={(pendahuluanChecked as any)[item.key]}
                            onChange={(e) => setPendahuluanChecked(prev => ({ ...prev, [item.key]: e.target.checked }))}
                            className="h-4.5 w-4.5 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* KEGIATAN INTI CARD */}
                  <div className="border border-slate-200 rounded-2xl p-5 bg-[#fafbfd] hover:shadow-sm transition-all space-y-3.5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-purple-500" />
                        <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Kegiatan Inti (PBL)</h3>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100">PROBLEM BASED LEARNING</span>
                    </div>

                    <div className="space-y-2.5">
                      {[
                        { key: "orientasi", label: "1. Orientasi siswa pada masalah dekomposisi kartu" },
                        { key: "organisasi", label: "2. Mengorganisasikan siswa ke kelompok kecil (4 orang)" },
                        { key: "bimbing", label: "3. Membimbing penyelidikan individu dan kelompok" },
                        { key: "kembang", label: "4. Mengembangkan dan menyajikan hasil kerja kelompok" },
                        { key: "analisis", label: "5. Menganalisis dan mengevaluasi proses pemecahan masalah" }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-2.5 bg-white border border-slate-100 rounded-xl">
                          <span className="text-xs font-semibold text-slate-700">{item.label}</span>
                          <input 
                            type="checkbox"
                            checked={(kegiatanIntiChecked as any)[item.key]}
                            onChange={(e) => setKegiatanIntiChecked(prev => ({ ...prev, [item.key]: e.target.checked }))}
                            className="h-4.5 w-4.5 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* PENUTUP CARD */}
                  <div className="border border-slate-200 rounded-2xl p-5 bg-[#fafbfd] hover:shadow-sm transition-all space-y-3.5">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Penutup</h3>
                    </div>

                    <div className="space-y-2.5">
                      {[
                        { key: "resume", label: "Resume (Siswa menyimpulkan 4 pilar BK)" },
                        { key: "kesimpulan", label: "Kesimpulan & Penguatan dari Guru" },
                        { key: "doa", label: "Doa Penutup & Tindak Lanjut" }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-2.5 bg-white border border-slate-100 rounded-xl">
                          <span className="text-xs font-semibold text-slate-700">{item.label}</span>
                          <input 
                            type="checkbox"
                            checked={(penutupChecked as any)[item.key]}
                            onChange={(e) => setPenutupChecked(prev => ({ ...prev, [item.key]: e.target.checked }))}
                            className="h-4.5 w-4.5 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "materi" && (
                <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm">Modul Materi Pokok: Berpikir Komputasional</h3>
                  <div className="prose text-xs text-slate-600 leading-relaxed space-y-3 font-semibold">
                    <p>Berpikir komputasional (computational thinking) adalah metode menyelesaikan masalah dengan menerapkan teknik ilmu komputer (informatika). Terdapat empat pilar utama:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Dekomposisi:</strong> Memecah masalah besar menjadi bagian-bagian kecil yang mudah dikelola.</li>
                      <li><strong>Pengenalan Pola:</strong> Mencari kesamaan di antara dan di dalam masalah-masalah tersebut.</li>
                      <li><strong>Abstraksi:</strong> Fokus hanya pada informasi yang relevan dan mengabaikan detail yang tidak perlu.</li>
                      <li><strong>Algoritma:</strong> Menyusun langkah-langkah logis untuk memecahkan masalah.</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === "lkpd" && (
                <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="font-bold text-slate-800 text-sm">LKPD Aktif: Eksplorasi Logika Pencarian</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">Formatif</span>
                  </div>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed">Siswa diminta melakukan perbandingan langkah pencarian antara metode linear search (berurutan) dengan binary search (membagi dua) menggunakan tumpukan kartu angka.</p>
                </div>
              )}

              {activeTab === "penilaian" && (
                <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm">Rubrik Penilaian & Penilaian Formatif Langsung</h3>
                  <div className="space-y-3">
                    {students.slice(0, 4).map((student) => (
                      <div key={student.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div>
                          <p className="text-xs font-bold text-slate-800">{student.name}</p>
                          <p className="text-[10px] text-slate-400">NIS: {student.nis}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => alert(`Skor Formatif ${student.name} diset ke 90`)}
                            className="px-2.5 py-1 bg-white hover:bg-slate-100 border text-[10px] font-bold rounded-lg text-slate-700 shadow-sm"
                          >
                            Set Nilai Formatif
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "refleksi" && (
                <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm">Jurnal & Refleksi Pembelajaran</h3>
                  <p className="text-xs text-slate-600 font-semibold italic">"Apakah seluruh siswa telah mencapai KKM pada pilar berpikir komputasional hari ini?"</p>
                  <textarea 
                    placeholder="Tulis refleksi mengajar Anda di sini..."
                    className="w-full border rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-purple-500 bg-slate-50 min-h-[80px]"
                  />
                  <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm transition-colors">
                    Simpan Jurnal Refleksi
                  </button>
                </div>
              )}

            </div>

            {/* RIGHT COLUMN: INTERACTIVE WIDGETS (Exactly matching Section 2 right cards) */}
            <div className="lg:col-span-4 space-y-5">
              
              {/* TIMER KELAS CARD */}
              <div className="border border-slate-200 rounded-2xl p-5 bg-white hover:shadow-sm transition-all text-center space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-left">
                  <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">Timer Kelas</span>
                  <Clock className="h-4 w-4 text-slate-400" />
                </div>

                <div className="text-3xl font-bold text-slate-800 font-mono tracking-widest py-2">
                  {formatTime(seconds)}
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button 
                    onClick={() => setTimerRunning(!timerRunning)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all"
                  >
                    {timerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </button>
                  <button 
                    onClick={handleResetTimer}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* CATATAN CEPAT CARD */}
              <div className="border border-slate-200 rounded-2xl p-5 bg-white hover:shadow-sm transition-all space-y-3.5">
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block border-b border-slate-100 pb-2">Catatan Cepat</span>
                
                <textarea 
                  value={quickNotes}
                  onChange={(e) => setQuickNotes(e.target.value)}
                  placeholder="Tuliskan catatan selama pembelajaran..."
                  className="w-full h-24 p-3 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-purple-500 bg-slate-50 placeholder-slate-400"
                />

                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-600">{notesStatus}</span>
                  <button 
                    onClick={handleSaveNotesLocal}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <Save className="h-3.5 w-3.5" />
                    Simpan Catatan
                  </button>
                </div>
              </div>

              {/* PESERTA DIDIK CARD */}
              <div className="border border-slate-200 rounded-2xl p-5 bg-white hover:shadow-sm transition-all space-y-4">
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block border-b border-slate-100 pb-2">Peserta Didik</span>
                
                <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-700">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100/60 flex items-center justify-between">
                    <span className="text-slate-500">Hadir:</span>
                    <span className="text-slate-900">{countHadir}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100/60 flex items-center justify-between">
                    <span className="text-slate-500">Sakit:</span>
                    <span className="text-slate-900">{countSakit}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100/60 flex items-center justify-between">
                    <span className="text-slate-500">Izin:</span>
                    <span className="text-slate-900">{countIzin}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100/60 flex items-center justify-between">
                    <span className="text-slate-500">Alfa:</span>
                    <span className="text-slate-900">{countAlfa}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setShowAttendanceModal(true)}
                  className="w-full text-center text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center justify-center gap-1 bg-purple-50 hover:bg-purple-100/70 p-2.5 rounded-xl border border-purple-100 transition-all"
                >
                  <Users className="h-3.5 w-3.5" />
                  Detail Kehadiran →
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* DETAIL ATTENDANCE MODAL (Saves back to main App state for complete integration!) */}
      <AnimatePresence>
        {showAttendanceModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[500px]"
            >
              <div className="p-5 bg-purple-600 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  <h3 className="font-bold text-sm">Daftar Kehadiran Siswa</h3>
                </div>
                <button 
                  onClick={() => setShowAttendanceModal(false)}
                  className="p-1 rounded-lg hover:bg-purple-700 text-white/80 hover:text-white transition-all"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto space-y-3.5 flex-1">
                {students.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">{student.name}</span>
                      <span className="text-[10px] text-slate-400 font-bold block">NIS: {student.nis}</span>
                    </div>

                    <div className="flex gap-1">
                      {(["Hadir", "Sakit", "Izin", "Alfa"] as const).map((status) => {
                        const isSelected = student.attendance === status;
                        return (
                          <button
                            key={status}
                            onClick={() => onUpdateAttendance(student.id, status)}
                            className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all border ${
                              isSelected 
                                ? "bg-purple-600 border-purple-600 text-white shadow-sm" 
                                : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                            }`}
                          >
                            {status}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => setShowAttendanceModal(false)}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm transition-colors"
                >
                  Selesai Presensi
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
