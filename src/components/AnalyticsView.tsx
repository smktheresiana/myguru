/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Activity, 
  TrendingUp, 
  BarChart2, 
  PieChart, 
  Award, 
  ChevronDown, 
  Calendar, 
  Filter, 
  Search, 
  Sparkles,
  ArrowRight,
  Bell,
  Download,
  Users,
  CheckCircle,
  FileText,
  UserCheck,
  AlertTriangle,
  GraduationCap,
  ClipboardList,
  Printer,
  Copy,
  Check,
  RotateCw
} from "lucide-react";
import { Student } from "../types";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  RadarChart as ReRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar
} from "recharts";
import { motion, AnimatePresence } from "motion/react";

interface AnalyticsViewProps {
  students: Student[];
  onUpdateStudent?: (student: Student) => Promise<void>;
}

export default function AnalyticsView({ students, onUpdateStudent }: AnalyticsViewProps) {
  
  // Navigation sub-tab state
  const [activeSubTab, setActiveSubTab] = useState<string>("dashboard_analytics");

  // Filter states
  const [selectedClass, setSelectedClass] = useState("Kelas VII A");
  const [selectedSubject, setSelectedSubject] = useState("Informatika");
  const [selectedSemester, setSelectedSemester] = useState("Semester 1");
  const [selectedTp, setSelectedTp] = useState("TP 1.1");
  const [dateRange, setDateRange] = useState("01/01/2026 - 31/05/2026");
  
  // Student Search for rosters
  const [searchQuery, setSearchQuery] = useState("");

  // AI Recommendation Interactive State
  const [activeRecCategory, setActiveRecCategory] = useState<string | null>(null);
  const [isGeneratingRec, setIsGeneratingRec] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [generatedRec, setGeneratedRec] = useState<string | null>(null);

  // State for Grading and Personal Notes Editing
  const [selectedEditStudentId, setSelectedEditStudentId] = useState<string>("");
  const [formFormatif, setFormFormatif] = useState<number>(80);
  const [formSumatif, setFormSumatif] = useState<number>(80);
  const [formCare, setFormCare] = useState<string>("B");
  const [formShape, setFormShape] = useState<number>(80);
  const [formNotes, setFormNotes] = useState<string>("");
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Sync edit form when selected student or student list changes
  useEffect(() => {
    if (selectedEditStudentId) {
      const student = students.find(s => s.id === selectedEditStudentId);
      if (student) {
        setFormFormatif(student.grades.formatif);
        setFormSumatif(student.grades.sumatif);
        setFormCare(student.grades.care || "B");
        setFormShape(student.grades.shape || 80);
        setFormNotes(student.personalNotes || "");
        setSaveStatus(null);
      }
    } else if (students.length > 0) {
      setSelectedEditStudentId(students[0].id);
    }
  }, [selectedEditStudentId, students]);

  // Handle saving the updated grades & notes
  const handleSaveStudentGradesAndNotes = async () => {
    if (!selectedEditStudentId) return;
    const targetStudent = students.find(s => s.id === selectedEditStudentId);
    if (!targetStudent) return;

    setIsSaving(true);
    setSaveStatus(null);

    const updatedStudent: Student = {
      ...targetStudent,
      grades: {
        ...targetStudent.grades,
        formatif: Number(formFormatif),
        sumatif: Number(formSumatif),
        care: formCare,
        shape: Number(formShape)
      },
      personalNotes: formNotes
    };

    try {
      if (onUpdateStudent) {
        await onUpdateStudent(updatedStudent);
        setSaveStatus("Data penilaian dan catatan personal berhasil disimpan!");
        setTimeout(() => setSaveStatus(null), 4000);
      } else {
        setSaveStatus("Gagal: onUpdateStudent handler tidak terhubung.");
      }
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
      setSaveStatus("Error: Gagal menyimpan data ke server.");
    } finally {
      setIsSaving(false);
    }
  };

  // Recharts Chart Data (Graph Nilai)
  const lineChartData = [
    { name: "P1", Nilai: 65, RataRata: 72 },
    { name: "P2", Nilai: 78, RataRata: 76 },
    { name: "P3", Nilai: 88, RataRata: 82 },
    { name: "P4", Nilai: 84, RataRata: 81 },
    { name: "P5", Nilai: 92, RataRata: 84.5 }
  ];

  // Assessment distribution (Analisis Asesmen)
  const pieChartData = [
    { name: "Diagnostik", value: 72, color: "#F59E0B" },
    { name: "Formatif", value: 80, color: "#10B981" },
    { name: "Sumatif", value: 85, color: "#2563EB" }
  ];

  // Radar Chart Data (Analisis CARE / SHAPE)
  const radarChartData = [
    { subject: "Commitment", A: 85, fullMark: 100 },
    { subject: "Excellence", A: 90, fullMark: 100 },
    { subject: "Empathy", A: 82, fullMark: 100 },
    { subject: "Collaborative", A: 88, fullMark: 100 },
    { subject: "Adaptability", A: 76, fullMark: 100 }
  ];

  // Pre-configured premium AI recommendations matching our student data
  const REC_CONTENTS: Record<string, { title: string; subtitle: string; body: string }> = {
    remedial: {
      title: "Rencana Pembelajaran Remedial (TP 1.1)",
      subtitle: "Bimbingan Khusus untuk Deni Saputra, Bimo Wicaksono, dan Citra Lestari",
      body: `## RENCANA INTERVENSI BELAJAR REMEDIAL
### Elemen: Berpikir Komputasional (Searching & Sorting)

**Peserta Remedial:** 
1. **Deni Saputra** (Sakit/Kurang kehadiran, Nilai Formatif: 70)
2. **Bimo Wicaksono** (Nilai Formatif: 65)
3. **Citra Lestari** (Membutuhkan Pengulangan Langkah Praktis, Nilai Formatif: 80)

**A. Analisis Akar Masalah (AI Diagnostic):**
Siswa belum menguasai pembagian struktur data terurut. Terlalu terburu-buru melakukan pembagian data tengah (Binary Search) tanpa melakukan pengecekan pengurutan terlebih dahulu.

**B. Strategi Pendampingan Khusus:**
1. **Pendekatan Kognitif Konkret:** Menggunakan media nyata (Simulasi Kartu Angka). Siswa memegang 8 kartu bertuliskan angka acak.
2. **Latihan Berjenjang (Scaffolding):**
   * *Langkah 1:* Temukan angka 12 dari 5 kartu tak terurut (Metode Linear Search).
   * *Langkah 2:* Urutkan kartu terlebih dahulu dari terkecil ke terbesar.
   * *Langkah 3:* Temukan angka 12 menggunakan metode belah dua (Binary Search).
3. **Instrumen Evaluasi Alternatif (Lisan & Kinerja):**
   Mengurangi porsi tes tertulis pilihan ganda abstrak, menggantinya dengan unjuk kerja menyusun kartu di atas meja kelas.`
    },
    pengayaan: {
      title: "Materi Pengayaan Akademik Cerdas (TP 1.1)",
      subtitle: "Tantangan Algoritma Lanjut untuk Alisha Putri dan Eka Rahmawati",
      body: `## MODUL PENGAYAAN MANDIRI & TANTANGAN HIGH-ACHIEVER
### Topik: Optimasi Algoritma Pencarian & Kompleksitas Waktu (O-Notation)

**Peserta Pengayaan:** Alisha Putri, Eka Rahmawati, dan siswa berkemampuan tinggi lainnya.

**A. Tujuan Pembelajaran Tambahan:**
Siswa memahami konsep efisiensi algoritma dalam pemrograman berskala besar melalui analisis teoritis *Time Complexity* sederhana.

**B. Aktivitas Pembelajaran Mandiri (Bento-Challenge):**
1. **Studi Kasus 1: "The Telephone Book Paradox"**
   Jika buku telepon berisi 1.000.000 nama terurut, bandingkan jumlah perbandingan maksimum antara mencari halaman satu per satu dengan melipat buku menjadi dua secara berulang.
   * *Jawaban Kunci:* Linear Search = 1.000.000 perbandingan, Binary Search = Log2(1.000.000) ≈ Hanya 20 perbandingan!
2. **Tantangan Coding / Flowchart Logika:**
   Rancanglah bagan alur (flowchart) atau pseudocode untuk algoritma *Interpolation Search* (Pencarian berbasis perkiraan lokasi, mirip saat kita menebak letak huruf "Y" langsung di ujung belakang buku kamus).

**C. Penilaian Kinerja Pengayaan:**
Hasil penyusunan bagan alur dikirimkan ke repositori digital untuk dipresentasikan di depan teman sejawat (peer teaching) pada pertemuan berikutnya.`
    },
    strategi: {
      title: "Rekomendasi Strategi Mengajar Diferensiasi",
      subtitle: "Implementasi Project-Based Learning (PjBL) Kelas VII A",
      body: `## PANDUAN DIFERENSIASI PROSES & PRODUK
### Mata Pelajaran: Informatika | Kurikulum Merdeka - CLPS

Berdasarkan analisis keberagaman profil belajar siswa VII A (72% visual, 15% kinestetik, 13% auditori):

**1. Diferensiasi Konten (Media Belajar):**
* **Kelompok Visual:** Sediakan Mindmap visual alur Searching (bisa diambil dari menu Lampiran).
* **Kelompok Auditori / Interaktif:** Sediakan simulasi papan sirkuit digital interaktif atau video pendek tutorial.
* **Kelompok Kinestetik:** Tugaskan mereka memimpin simulasi kartu angka berukuran besar di depan kelas.

**2. Diferensiasi Proses (Langkah PBL):**
* **Kelompok Mandiri (Alisha, Eka):** Membantu kelompok lain setelah menyelesaikan studi kasus tingkat 3 secara mandiri.
* **Kelompok Menengah (Citra, dkk):** Mengikuti sintaks PBL standar guru dengan pendampingan berkala.
* **Kelompok Pendampingan Intensif (Bimo, Deni):** Guru berada di dekat meja kelompok ini selama fase Penyelidikan Masalah untuk memberikan petunjuk bertahap (*clues*).

**3. Diferensiasi Produk (Hasil LKPD):**
Siswa dibebaskan mengumpulkan laporan LKPD dalam bentuk peta pikiran kreatif, rekaman penjelasan video singkat, maupun tabel perbandingan di buku tulis.`
    },
    lkpd: {
      title: "Rekomendasi Perbaikan Lembar Kerja (LKPD)",
      subtitle: "Penyempurnaan Struktur HOTS pada Instrumen Penilaian",
      body: `## RESTRUKTURISASI LKPD PEMBELAJARAN INFORMATIKA
### Rekomendasi AI berdasarkan Analisis Butir Soal Kelas

Tingkat kesulitan LKPD saat ini masih terlalu landai pada tingkatan kognitif C1-C2 (Mengingat & Memahami). Disarankan melakukan peningkatan berikut:

**1. Tambahkan Studi Kasus Kontekstual Sekolah (C4 - Analisis):**
* *Pertanyaan Lama:* "Tuliskan langkah-langkah Binary Search!" (C2)
* *Pertanyaan Rekomendasi Baru:* "Kalian adalah pustakawan sekolah SMK Theresiana yang harus mengurutkan 200 buku baru berdasarkan nomor klasifikasi DDC. Jika kalian menggunakan metode belah dua secara acak, diskusikan skenario terburuk (worst-case) seandainya buku yang dicari berada di paling ujung tumpukan!" (C4)

**2. Integrasikan Penilaian Karakter (CARE):**
Tambahkan lembar refleksi diri dalam kerja kelompok di bagian akhir halaman LKPD yang meminta siswa memberikan apresiasi jujur terhadap kontribusi rekan satu kelompoknya.`
    },
    asesmen: {
      title: "Rekomendasi Perbaikan Asesmen & Kisi-Kisi",
      subtitle: "Optimalisasi Asesmen Formatif For Learning",
      body: `## DESAIN ULANG INSTRUMEN ASESMEN
### Pendekatan: Assessment for Learning (AfL)

Hasil analisis formatif menunjukkan 45% siswa kehabisan waktu pada tes tertulis pilihan ganda dengan kode program kompleks.

**Rekomendasi Pembenahan:**
1. **Reduksi Kompleksitas Sintaks:** Pada tingkat Kelas VII, fokus asesmen adalah pada **logika berpikir algoritmik**, bukan kepatuhan sintaks bahasa pemrograman. Ganti potongan kode pemrograman dengan *pseudocode* bahasa Indonesia yang ramah anak.
2. **Gunakan Rubrik Berbasis Rubrik CARE (Karakter):**
   * Hubungkan nilai akademis siswa dengan nilai kerja sama tim (*collaborative*).
   * Berikan bonus poin (Excellence Point) bagi siswa yang mendokumentasikan proses belajarnya secara rapi.
3. **Pemberian Umpan Balik Instan (Constructive Feedback):**
   Alih-alih hanya memberi coretan nilai merah (misalnya "60"), berikan kalimat umpan balik pembangun: *"Logikamu dalam membelah data sudah sangat tepat, hanya perlu sedikit lebih teliti saat menandai batas indeks kiri dan kanan!"*`
    }
  };

  const handleGenerateRecommendation = (cat: string) => {
    setIsGeneratingRec(true);
    setActiveRecCategory(cat);
    setGeneratedRec(null);
    setTimeout(() => {
      setGeneratedRec(REC_CONTENTS[cat]?.body || "");
      setIsGeneratingRec(false);
    }, 1500);
  };

  const copyToClipboard = () => {
    if (generatedRec) {
      navigator.clipboard.writeText(generatedRec);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  const exportToCSV = () => {
    const headers = ["ID", "Nama Siswa", "NIS", "Kehadiran", "Nilai Formatif", "Nilai Sumatif", "Sikap (CARE)", "Keterampilan (SHAPE)", "Catatan Personal"];
    const rows = students.map(s => [
      s.id,
      s.name,
      s.nis,
      s.attendance,
      s.grades.formatif,
      s.grades.sumatif,
      s.grades.care,
      s.grades.shape || 80,
      s.personalNotes || ""
    ]);
    const csvContent = "\uFEFF" + [headers, ...rows].map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `AATS_Laporan_Siswa_${selectedClass.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(students, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `AATS_Backup_Siswa_${selectedClass.replace(/\s+/g, "_")}_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  // Filter students by search
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    student.nis.includes(searchQuery)
  );

  return (
    <div className="bg-[#f8fafc] rounded-3xl border border-slate-200/60 shadow-xl overflow-hidden">
      
      {/* SECTION HEADER BAR */}
      <div className="bg-emerald-600 px-6 py-4 flex items-center justify-between border-b border-emerald-700/50">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-full bg-white text-emerald-600 flex items-center justify-center font-extrabold text-sm shadow-sm">
            6
          </div>
          <div>
            <span className="text-white font-extrabold text-sm uppercase tracking-wider block">ANALYTICS (ACADEMIC INTELLIGENCE)</span>
            <span className="text-emerald-100 text-[10px] font-medium block">Analisis Capaian Kompetensi, Grafik Nilai, & Rekomendasi AI Komersial</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-white border border-white/10 uppercase font-mono">ANALYTICS_CORE_ONLINE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 min-h-[620px]">
        
        {/* LOCAL SIDEBAR (Theme: Slate dark with dynamic highlight) */}
        <div className="xl:col-span-3 bg-slate-950 text-slate-300 p-4 flex flex-col justify-between border-r border-slate-900">
          <div className="space-y-4">
            <div className="px-3 pb-2 border-b border-slate-900 flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">INTELLIGENCE NAVIGATION</span>
            </div>

            <nav className="space-y-1">
              {[
                { id: "dashboard_analytics", label: "Dashboard Analytics", count: null },
                { id: "tp_attainment", label: "6.1.1 Ketercapaian TP", count: "78%" },
                { id: "cp_attainment", label: "6.1.2 Ketercapaian CP", count: "82%" },
                { id: "grades_assessments", label: "6.1.3 Nilai & Asesmen", count: "Formative" },
                { id: "care_shape", label: "6.1.4 Analisis CARE/SHAPE", count: "Karakter" },
                { id: "attendance", label: "6.1.5 Analisis Kehadiran", count: "92%" },
                { id: "graphs", label: "6.2 Grafik & Visualizer", count: "Charts" },
                { id: "ai_recommendations", label: "6.3 Rekomendasi AI", count: "Cerdas" },
                { id: "reports", label: "Laporan Akademik", count: "Print" },
                { id: "export_data", label: "Unduh & Ekspor Data", count: "Excel" },
                { id: "student_management_grades", label: "6.4 Kelola Nilai & Catatan", count: "Kelola" }
              ].map((item) => {
                const isActive = activeSubTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSubTab(item.id);
                      setGeneratedRec(null);
                      setActiveRecCategory(null);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[11px] font-bold transition-all text-left ${
                      isActive
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/40"
                        : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-white" : "bg-slate-700"}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.count && (
                      <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-extrabold ${isActive ? "bg-emerald-700 text-emerald-100" : "bg-slate-900 text-slate-500"}`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-900 mt-6 space-y-1.5">
            <span className="text-[9px] text-emerald-400 font-bold uppercase block">Gemini Intelligence</span>
            <p className="text-[10px] text-slate-400 leading-normal font-medium">
              Mesin analisis akademik otomatis menyinkronkan data murid ke dashboard kurikulum.
            </p>
          </div>
        </div>

        {/* WORKSPACE AREA (Right Side) */}
        <div className="xl:col-span-9 p-6 flex flex-col bg-white">
          
          {/* Header Panel (Dynamic Title depending on Subtab) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-5">
            <div>
              <h1 className="text-base font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                {activeSubTab === "dashboard_analytics" && "Dashboard Analisis Akademik"}
                {activeSubTab === "tp_attainment" && "6.1.1 Analisis Ketercapaian Tujuan Pembelajaran (TP)"}
                {activeSubTab === "cp_attainment" && "6.1.2 Analisis Ketercapaian Elemen Kompetensi (CP)"}
                {activeSubTab === "grades_assessments" && "6.1.3 Analisis Sebaran Nilai Formatif & Sumatif"}
                {activeSubTab === "care_shape" && "6.1.4 Analisis Karakter CARE / SHAPE Siswa"}
                {activeSubTab === "attendance" && "6.1.5 Analisis Presentase Kehadiran & Partisipasi"}
                {activeSubTab === "graphs" && "6.2 Visualisasi Grafik Ketercapaian & Kinerja"}
                {activeSubTab === "ai_recommendations" && "6.3 Rekomendasi Tindak Lanjut Cerdas AI"}
                {activeSubTab === "reports" && "Laporan Capaian Belajar Kurikulum"}
                {activeSubTab === "export_data" && "Unduh Portofolio & Master Data Akademik"}
                {activeSubTab === "student_management_grades" && "6.4 Kelola Penilaian & Catatan Personal"}
              </h1>
              <p className="text-xs text-slate-400 font-semibold pt-0.5">
                {selectedSubject} &gt; {selectedClass} &gt; {selectedSemester}
              </p>
            </div>
            
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 font-extrabold text-[10px] px-2.5 py-1 rounded-xl">
                STANDAR KKM: 75
              </div>
            </div>
          </div>

          {/* DYNAMIC METRIC FILTERS DROPDOWNS ROW */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200/50">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Kelas</label>
              <div className="relative">
                <select 
                  value={selectedClass} 
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full text-xs font-bold text-slate-700 bg-white border rounded-xl py-1.5 px-2.5 focus:outline-none focus:border-emerald-500 appearance-none pr-8 cursor-pointer"
                >
                  <option value="Kelas VII A">Kelas VII A</option>
                  <option value="Kelas VIII A">Kelas VIII A</option>
                  <option value="Kelas IX A">Kelas IX A</option>
                </select>
                <ChevronDown className="absolute right-2 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Mapel</label>
              <div className="relative">
                <select 
                  value={selectedSubject} 
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full text-xs font-bold text-slate-700 bg-white border rounded-xl py-1.5 px-2.5 focus:outline-none focus:border-emerald-500 appearance-none pr-8 cursor-pointer"
                >
                  <option value="Informatika">Informatika</option>
                  <option value="Matematika">Matematika</option>
                  <option value="Bahasa Inggris">Bahasa Inggris</option>
                </select>
                <ChevronDown className="absolute right-2 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Semester</label>
              <div className="relative">
                <select 
                  value={selectedSemester} 
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="w-full text-xs font-bold text-slate-700 bg-white border rounded-xl py-1.5 px-2.5 focus:outline-none focus:border-emerald-500 appearance-none pr-8 cursor-pointer"
                >
                  <option value="Semester 1">Semester 1</option>
                  <option value="Semester 2">Semester 2</option>
                </select>
                <ChevronDown className="absolute right-2 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Tujuan Belajar</label>
              <div className="relative">
                <select 
                  value={selectedTp} 
                  onChange={(e) => setSelectedTp(e.target.value)}
                  className="w-full text-xs font-bold text-slate-700 bg-white border rounded-xl py-1.5 px-2.5 focus:outline-none focus:border-emerald-500 appearance-none pr-8 cursor-pointer"
                >
                  <option value="TP 1.1">TP 1.1 (Searching)</option>
                  <option value="TP 1.2">TP 1.2 (Sorting)</option>
                  <option value="TP 1.3">TP 1.3 (Stack & Queue)</option>
                </select>
                <ChevronDown className="absolute right-2 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1 col-span-2 md:col-span-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Rentang Tanggal</label>
              <div className="relative">
                <input 
                  type="text"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full text-xs font-bold text-slate-700 bg-white border rounded-xl py-1.5 px-2.5 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* DYNAMIC CONTENT CONTAINER */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSubTab}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.12 }}
                className="space-y-6"
              >
                
                {/* 1. DASHBOARD ANALYTICS SUBTAB */}
                {activeSubTab === "dashboard_analytics" && (
                  <div className="space-y-6">
                    {/* KPI Cards Row */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="border border-slate-200 rounded-2xl p-4 bg-[#fafdfb] hover:border-emerald-200 transition-all space-y-1">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Ketercapaian TP</span>
                        <div className="flex items-baseline justify-between">
                          <span className="text-xl font-black text-slate-900">78%</span>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">Baik</span>
                        </div>
                      </div>

                      <div className="border border-slate-200 rounded-2xl p-4 bg-[#fafdfb] hover:border-emerald-200 transition-all space-y-1">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Ketercapaian CP</span>
                        <div className="flex items-baseline justify-between">
                          <span className="text-xl font-black text-slate-900">82%</span>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">Baik Sekali</span>
                        </div>
                      </div>

                      <div className="border border-slate-200 rounded-2xl p-4 bg-[#fafdfb] hover:border-emerald-200 transition-all space-y-1">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Rata-rata Nilai</span>
                        <div className="flex items-baseline justify-between">
                          <span className="text-xl font-black text-slate-900">84,5</span>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">Lulus KKM</span>
                        </div>
                      </div>

                      <div className="border border-slate-200 rounded-2xl p-4 bg-[#fafdfb] hover:border-emerald-200 transition-all space-y-1">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Kehadiran Kelas</span>
                        <div className="flex items-baseline justify-between">
                          <span className="text-xl font-black text-slate-900">92%</span>
                          <span className="text-[9px] font-bold px-2 py-0.5 bg-slate-100 rounded-full text-slate-600">Stabil</span>
                        </div>
                      </div>
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="border border-slate-200 rounded-2xl p-5 bg-white shadow-sm space-y-4">
                        <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Grafik Ketercapaian Nilai Formatif</h3>
                        <div className="h-48">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={lineChartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                              <YAxis tick={{ fontSize: 10, fill: "#64748b" }} domain={[0, 100]} axisLine={false} tickLine={false} />
                              <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
                              <Legend iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                              <Line type="monotone" dataKey="Nilai" stroke="#2563EB" strokeWidth={3} activeDot={{ r: 6 }} />
                              <Line type="monotone" dataKey="RataRata" stroke="#10B981" strokeWidth={2} strokeDasharray="3 3" />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="border border-slate-200 rounded-2xl p-5 bg-white shadow-sm space-y-4">
                        <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Analisis Butir Asesmen</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-4 h-48">
                          <div className="sm:col-span-7 h-40">
                            <ResponsiveContainer width="100%" height="100%">
                              <RePieChart>
                                <Pie
                                  data={pieChartData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={45}
                                  outerRadius={65}
                                  paddingAngle={4}
                                  dataKey="value"
                                >
                                  {pieChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
                              </RePieChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="sm:col-span-5 space-y-2">
                            {pieChartData.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1.5">
                                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                                  <span className="font-semibold text-slate-500">{item.name}</span>
                                </div>
                                <span className="font-bold text-slate-800">{item.value}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Split (Radar & AI quick tips) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="border border-slate-200 rounded-2xl p-5 bg-white shadow-sm space-y-4">
                        <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Analisis CARE / SHAPE (Kompetensi Karakter)</h3>
                        <div className="h-52">
                          <ResponsiveContainer width="100%" height="100%">
                            <ReRadarChart cx="50%" cy="50%" outerRadius="75%" data={radarChartData}>
                              <PolarGrid stroke="#e2e8f0" />
                              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: "#64748b", fontWeight: "bold" }} />
                              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8 }} />
                              <Radar name="Kompetensi" dataKey="A" stroke="#10B981" fill="#10B981" fillOpacity={0.25} />
                              <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
                            </ReRadarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="border border-slate-200 rounded-2xl p-5 bg-white shadow-sm flex flex-col justify-between">
                        <div>
                          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-emerald-600 animate-pulse" />
                            Rekomendasi Diagnostik Cepat AI
                          </h3>
                          <div className="space-y-3 pt-2">
                            <div className="p-2.5 bg-amber-50 border border-amber-100 rounded-xl text-xs space-y-1">
                              <span className="font-bold text-amber-800 block">Skenario Remedial Aktif (3 Murid)</span>
                              <p className="text-[11px] text-slate-600 leading-normal font-medium">
                                Deni Saputra, Bimo Wicaksono, dan Citra Lestari membutuhkan pendampingan manipulasi kartu fisik untuk menguatkan pemahaman.
                              </p>
                            </div>
                            <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl text-xs space-y-1">
                              <span className="font-bold text-blue-800 block">Skenario Pengayaan Cepat (2 Murid)</span>
                              <p className="text-[11px] text-slate-600 leading-normal font-medium">
                                Alisha Putri dan Eka Rahmawati perlu diberikan tantangan coding mandiri atau membandingkan visualisasi Binary vs Interpolation Search.
                              </p>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => setActiveSubTab("ai_recommendations")}
                          className="mt-4 w-full text-center py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-[11px] font-bold text-emerald-700 transition-colors"
                        >
                          Buka Studio Rekomendasi AI &rarr;
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. TP ATTAINMENT (Ketercapaian TP) */}
                {activeSubTab === "tp_attainment" && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="relative w-full sm:w-64">
                        <input 
                          type="text"
                          placeholder="Cari nama atau NIS siswa..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full text-xs font-semibold pl-8 pr-3 py-2 border rounded-xl focus:outline-none focus:border-emerald-500"
                        />
                        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase">Fase D &bull; Elemen Berpikir Komputasional</span>
                    </div>

                    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-100">
                            <th className="py-3 px-4">Nama Siswa / NIS</th>
                            <th className="py-3 px-3 text-center">TP 1.1 (Searching)</th>
                            <th className="py-3 px-3 text-center">TP 1.2 (Sorting)</th>
                            <th className="py-3 px-3 text-center">TP 1.3 (Stack/Queue)</th>
                            <th className="py-3 px-3 text-center">Rata-Rata TP</th>
                            <th className="py-3 px-4 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredStudents.map((student) => {
                            // Synthesize TP grades logically based on student object
                            const tp1 = student.grades.formatif;
                            const tp2 = Math.round(student.grades.formatif * 0.95 + (student.id === "s3" ? -5 : 2));
                            const tp3 = Math.round(student.grades.sumatif * 0.98);
                            const avg = Math.round((tp1 + tp2 + tp3) / 3);
                            const isRemedial = avg < 75;

                            return (
                              <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-3.5 px-4">
                                  <span className="font-extrabold text-slate-800 block">{student.name}</span>
                                  <span className="text-[10px] font-bold text-slate-400 font-mono">NIS: {student.nis}</span>
                                </td>
                                <td className="py-3.5 px-3 text-center font-bold text-slate-700 font-mono">{tp1}</td>
                                <td className="py-3.5 px-3 text-center font-bold text-slate-700 font-mono">{tp2}</td>
                                <td className="py-3.5 px-3 text-center font-bold text-slate-700 font-mono">{tp3}</td>
                                <td className="py-3.5 px-3 text-center font-black text-blue-600 font-mono">{avg}</td>
                                <td className="py-3.5 px-4 text-center">
                                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                    isRemedial 
                                      ? "bg-rose-50 text-rose-700 border border-rose-100 animate-pulse" 
                                      : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                  }`}>
                                    {isRemedial ? "Butuh Remedial" : "Lulus Capaian"}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 3. CP ATTAINMENT (Ketercapaian CP) */}
                {activeSubTab === "cp_attainment" && (
                  <div className="space-y-6">
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-xs space-y-1">
                      <span className="font-bold text-slate-700 block">Pemberitahuan Elemen CP:</span>
                      <p className="text-slate-500 font-semibold leading-relaxed">
                        Elemen Kompetensi Capaian Pembelajaran (CP) untuk mata pelajaran Informatika terbagi atas 8 Elemen Inti. Grafik di bawah menunjukkan persentase tingkat ketercapaian kompetensi di SMK Theresiana Semarang.
                      </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {[
                        { code: "BK", name: "Berpikir Komputasional", progress: 78, desc: "Siswa mampu menerapkan berpikir algoritmik" },
                        { code: "TIK", name: "Teknologi Informasi & Komunikasi", progress: 85, desc: "Pemanfaatan software pengolah dokumen" },
                        { code: "SK", name: "Sistem Komputer", progress: 72, desc: "Memahami interaksi hardware, software, user" },
                        { code: "JKI", name: "Jaringan Komputer & Internet", progress: 80, desc: "Koneksi jaringan kabel & nirkabel" },
                        { code: "AD", name: "Analisis Data", progress: 68, desc: "Pengumpulan dan visualisasi data digital" },
                        { code: "AP", name: "Algoritma & Pemrograman", progress: 74, desc: "Penyusunan kode pemrograman blok/visual" },
                        { code: "DSI", name: "Dampak Sosial Informatika", progress: 92, desc: "Keamanan data, hak kekayaan intelektual" },
                        { code: "PLB", name: "Praktik Lintas Bidang", progress: 84, desc: "Penyelesaian kasus proyek kelompok riil" }
                      ].map((item, idx) => (
                        <div key={idx} className="border border-slate-200 rounded-2xl p-4 bg-white space-y-3 shadow-sm">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <span className="bg-blue-50 text-blue-700 text-[9px] font-black px-2 py-0.5 rounded-full uppercase font-mono">
                                ELEMEN: {item.code}
                              </span>
                              <h3 className="text-xs font-black text-slate-800 pt-1.5">{item.name}</h3>
                              <p className="text-[10px] text-slate-400 font-semibold">{item.desc}</p>
                            </div>
                            <span className="text-sm font-black text-emerald-600 font-mono">{item.progress}%</span>
                          </div>

                          <div className="space-y-1">
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                                style={{ width: `${item.progress}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-[9px] font-bold text-slate-400">
                              <span>Batas KKM: 75%</span>
                              <span className={item.progress >= 75 ? "text-emerald-600" : "text-rose-500"}>
                                {item.progress >= 75 ? "TUNTAS" : "BELUM TUNTAS"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. GRADES & ASSESSMENTS */}
                {activeSubTab === "grades_assessments" && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase">Nilai Tertinggi</span>
                        <p className="text-xl font-black text-emerald-600 font-mono">96</p>
                        <span className="text-[9px] text-slate-400 font-semibold block">Eka Rahmawati</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase">Nilai Terendah</span>
                        <p className="text-xl font-black text-rose-600 font-mono">60</p>
                        <span className="text-[9px] text-slate-400 font-semibold block">Bimo Wicaksono</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase">Jumlah Siswa Lulus</span>
                        <p className="text-xl font-black text-blue-600 font-mono">4 / 6</p>
                        <span className="text-[9px] text-slate-400 font-semibold block">Persentase Kelulusan 67%</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase">Deviasi Standar</span>
                        <p className="text-xl font-black text-slate-700 font-mono">11.4</p>
                        <span className="text-[9px] text-slate-400 font-semibold block">Penyebaran Nilai Homogen</span>
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-100">
                            <th className="py-3 px-4">Nama Siswa</th>
                            <th className="py-3 px-3 text-center">Asesmen Diagnostik</th>
                            <th className="py-3 px-3 text-center">Asesmen Formatif (AFL)</th>
                            <th className="py-3 px-3 text-center">Asesmen Sumatif (AOL)</th>
                            <th className="py-3 px-4 text-center">Indikator KKM</th>
                            <th className="py-3 px-4 text-center">Kelola</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredStudents.map((student) => {
                            const isPassing = student.grades.sumatif >= 75;
                            return (
                              <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-3 px-4">
                                  <span className="font-extrabold text-slate-800 block">{student.name}</span>
                                  <span className="text-[10px] font-bold text-slate-400">NIS: {student.nis}</span>
                                </td>
                                <td className="py-3 px-3 text-center font-bold text-slate-600 font-mono">82</td>
                                <td className="py-3 px-3 text-center font-bold text-slate-700 font-mono">{student.grades.formatif}</td>
                                <td className="py-3 px-3 text-center font-black text-slate-800 font-mono">{student.grades.sumatif}</td>
                                <td className="py-3 px-4 text-center">
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border ${
                                    isPassing 
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                                      : "bg-amber-50 text-amber-700 border-amber-100"
                                  }`}>
                                    {isPassing ? "Tuntas" : "Remedial"}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <button
                                    onClick={() => {
                                      setSelectedEditStudentId(student.id);
                                      setActiveSubTab("student_management_grades");
                                    }}
                                    className="px-2.5 py-1 text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-xs"
                                  >
                                    Edit Nilai & Catatan
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 5. CARE / SHAPE SUBTAB */}
                {activeSubTab === "care_shape" && (
                  <div className="space-y-6">
                    <div className="bg-[#f0f9ff] border border-blue-100 p-4 rounded-2xl text-xs space-y-1">
                      <span className="font-bold text-blue-800 block">Metode Penilaian Karakter (CLPS CARE):</span>
                      <p className="text-blue-600 font-semibold leading-relaxed">
                        Aspek CARE adalah integrasi Penguatan Karakter Profil Pelajar Pancasila yang meliputi: **C**ommitment (Komitmen), **A**daptability (Adaptabilitas), **R**elationship (Hubungan sosial), dan **E**xcellence (Keunggulan). SHAPE adalah skor numerik (0-100) gabungan aktivitas bimbingan.
                      </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="border border-slate-200 rounded-2xl p-5 bg-white shadow-sm space-y-3">
                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight pb-2 border-b">
                          Statistik Nilai Karakter (CARE)
                        </h3>
                        <div className="space-y-3 text-xs">
                          {[
                            { letter: "A", title: "Sangat Peduli & Berintegritas", count: "4 Siswa", percent: 67, color: "bg-emerald-500" },
                            { letter: "B", title: "Baik & Kooperatif", count: "1 Siswa", percent: 17, color: "bg-blue-500" },
                            { letter: "C", title: "Cukup Berpartisipasi", count: "1 Siswa", percent: 17, color: "bg-amber-500" },
                            { letter: "D", title: "Kurang Perhatian", count: "0 Siswa", percent: 0, color: "bg-rose-500" }
                          ].map((item, idx) => (
                            <div key={idx} className="space-y-1">
                              <div className="flex justify-between font-bold">
                                <span className="text-slate-700">Skor {item.letter} &bull; {item.title}</span>
                                <span className="text-slate-400">{item.count}</span>
                              </div>
                              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border border-slate-200 rounded-2xl p-5 bg-white shadow-sm space-y-3">
                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight pb-2 border-b">
                          Nilai SHAPE & Sikap Murid
                        </h3>
                        <div className="border border-slate-100 rounded-xl overflow-hidden max-h-[220px] overflow-y-auto">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead className="bg-slate-50 font-bold text-slate-400">
                              <tr>
                                <th className="p-2.5">Nama Siswa</th>
                                <th className="p-2.5 text-center">Karakter CARE</th>
                                <th className="p-2.5 text-center">Skor SHAPE</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-semibold">
                              {students.map((student) => (
                                <tr key={student.id}>
                                  <td className="p-2.5 font-bold text-slate-800">{student.name}</td>
                                  <td className="p-2.5 text-center">
                                    <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[9px] font-black">
                                      {student.grades.care}
                                    </span>
                                  </td>
                                  <td className="p-2.5 text-center font-mono font-bold text-slate-700">{student.grades.shape}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. ATTENDANCE SUBTAB */}
                {activeSubTab === "attendance" && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-xs font-semibold text-emerald-800">
                      Rata-rata tingkat kehadiran Kelas VII A bulan Juni 2026 adalah **92%**. Kehadiran dihitung harian melalui integrasi Smart-Attendance.
                    </div>

                    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-100">
                            <th className="py-3 px-4">Nama Siswa</th>
                            <th className="py-3 px-3 text-center">Hadir</th>
                            <th className="py-3 px-3 text-center">Sakit</th>
                            <th className="py-3 px-3 text-center">Izin</th>
                            <th className="py-3 px-3 text-center">Alfa</th>
                            <th className="py-3 px-4 text-center">Persentase Presensi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredStudents.map((student) => {
                            // Synthesize mock attendance counts
                            let h = 18, s = 0, i = 0, a = 0;
                            if (student.attendance === "Sakit") { h = 16; s = 2; }
                            else if (student.id === "s3") { h = 17; i = 1; }
                            const rate = Math.round((h / 18) * 100);

                            return (
                              <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-3 px-4">
                                  <span className="font-extrabold text-slate-800 block">{student.name}</span>
                                  <span className="text-[10px] font-bold text-slate-400">NIS: {student.nis}</span>
                                </td>
                                <td className="py-3 px-3 text-center font-bold text-emerald-600 font-mono">{h}</td>
                                <td className="py-3 px-3 text-center font-bold text-amber-600 font-mono">{s}</td>
                                <td className="py-3 px-3 text-center font-bold text-blue-600 font-mono">{i}</td>
                                <td className="py-3 px-3 text-center font-bold text-rose-600 font-mono">{a}</td>
                                <td className="py-3 px-4 text-center">
                                  <div className="flex items-center justify-center gap-2">
                                    <span className="font-bold font-mono text-slate-700">{rate}%</span>
                                    <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                                      <div className="h-full bg-emerald-500" style={{ width: `${rate}%` }} />
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 7. GRAPHS (Full Screen Visualizer) */}
                {activeSubTab === "graphs" && (
                  <div className="grid grid-cols-1 gap-6">
                    <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm space-y-4">
                      <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider border-b pb-3">
                        Visualisasi Ketercapaian TP & CP (Line Chart)
                      </h3>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={lineChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b", fontWeight: "bold" }} />
                            <YAxis tick={{ fontSize: 11, fill: "#64748b" }} domain={[0, 100]} />
                            <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '12px' }} />
                            <Legend iconSize={10} wrapperStyle={{ fontSize: '11px' }} />
                            <Line name="Capaian Siswa" type="monotone" dataKey="Nilai" stroke="#2563EB" strokeWidth={4} activeDot={{ r: 8 }} />
                            <Line name="Batas Rata-rata" type="monotone" dataKey="RataRata" stroke="#10B981" strokeWidth={3} strokeDasharray="4 4" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm space-y-4">
                      <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider border-b pb-3">
                        Rata-rata Nilai Asesmen per Kelas (Bar Chart)
                      </h3>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={[
                            { name: "Kelas VII A", Formatif: 80, Sumatif: 85 },
                            { name: "Kelas VIII A", Formatif: 82, Sumatif: 79 },
                            { name: "Kelas IX A", Formatif: 76, Sumatif: 81 }
                          ]}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b", fontWeight: "bold" }} />
                            <YAxis domain={[0, 100]} />
                            <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '12px' }} />
                            <Legend iconSize={10} wrapperStyle={{ fontSize: '11px' }} />
                            <Bar name="Rata-rata Formatif" dataKey="Formatif" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                            <Bar name="Rata-rata Sumatif" dataKey="Sumatif" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                )}

                {/* 8. AI RECOMMENDATIONS (STUDIO) */}
                {activeSubTab === "ai_recommendations" && (
                  <div className="space-y-6">
                    <div className="p-5 bg-gradient-to-r from-emerald-600 to-indigo-600 rounded-2xl text-white shadow-md space-y-2">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="h-5 w-5 text-amber-300 animate-bounce" />
                        <span className="text-[10px] bg-white/15 px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider text-emerald-100">
                          AI Intervention Engine
                        </span>
                      </div>
                      <h3 className="text-sm font-black leading-tight uppercase">Rekomendasi Tindak Lanjut Pembelajaran</h3>
                      <p className="text-xs text-emerald-100 leading-relaxed font-medium">
                        Pilih kategori rekomendasi kurikulum di bawah untuk merumuskan lembar kerja tindak lanjut, modul remedial mandiri, atau panduan pengajaran terdiferensiasi yang diproduksi secara cerdas oleh asisten AI.
                      </p>
                    </div>

                    {/* Recommendation trigger grid */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {[
                        { id: "remedial", label: "Materi Remedial", color: "bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200" },
                        { id: "pengayaan", label: "Materi Pengayaan", color: "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200" },
                        { id: "strategi", label: "Strategi Diferensiasi", color: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200" },
                        { id: "lkpd", label: "Perbaikan LKPD", color: "bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200" },
                        { id: "asesmen", label: "Perbaikan Asesmen", color: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200" }
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleGenerateRecommendation(item.id)}
                          className={`flex flex-col items-center justify-center p-4 border rounded-xl font-bold text-xs text-center transition-all cursor-pointer ${item.color} ${
                            activeRecCategory === item.id ? "ring-4 ring-offset-2 ring-emerald-500 scale-95" : ""
                          }`}
                        >
                          <Sparkles className="h-4 w-4 mb-2 animate-pulse" />
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Output recommendation display */}
                    <div className="border border-slate-200 rounded-3xl bg-white shadow-md overflow-hidden min-h-[250px] relative">
                      {isGeneratingRec ? (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center space-y-3 z-15">
                          <RotateCw className="h-8 w-8 text-emerald-600 animate-spin" />
                          <p className="text-xs font-black text-slate-700 animate-pulse">Menghitung statistik & menyusun rekomendasi kurikulum cerdas...</p>
                        </div>
                      ) : null}

                      {generatedRec ? (
                        <div className="p-6 space-y-4">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3">
                            <div>
                              <h4 className="text-sm font-black text-slate-800">
                                {REC_CONTENTS[activeRecCategory || ""]?.title}
                              </h4>
                              <p className="text-[11px] font-semibold text-slate-400">
                                {REC_CONTENTS[activeRecCategory || ""]?.subtitle}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={copyToClipboard}
                                className="bg-slate-50 border hover:bg-slate-100 text-slate-600 px-3 py-1.5 rounded-xl font-bold text-[11px] transition-colors flex items-center gap-1"
                              >
                                {copiedText ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                                {copiedText ? "Disalin!" : "Salin Teks"}
                              </button>
                              <button 
                                onClick={() => alert("Mengekspor rencana tindak lanjut ini dalam format PDF/Word...")}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl font-bold text-[11px] transition-colors flex items-center gap-1 shadow-sm"
                              >
                                <Download className="h-3.5 w-3.5" />
                                Cetak PDF
                              </button>
                            </div>
                          </div>

                          <div className="prose max-w-none text-xs text-slate-600 font-medium leading-relaxed font-sans whitespace-pre-line bg-slate-50 border border-slate-100 rounded-2xl p-5 max-h-[350px] overflow-y-auto">
                            {generatedRec}
                          </div>
                        </div>
                      ) : (
                        <div className="p-12 text-center text-slate-400 font-semibold space-y-2">
                          <Sparkles className="h-8 w-8 text-slate-300 mx-auto" />
                          <p>Pilih salah satu kategori rekomendasi di atas untuk melihat detail rancangan tindak lanjut.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 9. REPORTS */}
                {activeSubTab === "reports" && (
                  <div className="space-y-4">
                    <div className="border border-slate-200 rounded-2xl p-5 bg-white shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b pb-3">
                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight">Pratinjau Raport Kurikulum Merdeka</h3>
                        <button 
                          onClick={() => alert("Mengunduh laporan komparatif kelas PDF...")}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5"
                        >
                          <Printer className="h-4 w-4" />
                          Cetak Raport Kelas
                        </button>
                      </div>

                      <div className="border border-slate-100 rounded-2xl bg-slate-50/50 p-6 space-y-4">
                        <div className="text-center space-y-1">
                          <h4 className="text-xs font-black text-slate-800">LAPORAN HASIL BELAJAR AKADEMIK</h4>
                          <span className="text-[10px] text-slate-400 font-semibold block">SMK THERESIANA SEMARANG &bull; TA 2026/2027</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-[11px] font-bold text-slate-600 border-t border-b py-2.5">
                          <div>KELAS: VII A</div>
                          <div>MATA PELAJARAN: INFORMATIKA</div>
                          <div>GURU: DRS. EKO PRASETYO, M.KOM.</div>
                          <div>TOTAL SISWA: 6 ORANG</div>
                        </div>

                        <table className="w-full text-left border-collapse text-[11px] font-semibold text-slate-600 bg-white shadow-inner rounded-xl overflow-hidden">
                          <thead className="bg-slate-100 text-[10px] font-bold text-slate-500">
                            <tr>
                              <th className="p-3">Nama Siswa</th>
                              <th className="p-3 text-center">Formatif</th>
                              <th className="p-3 text-center">Sumatif</th>
                              <th className="p-3 text-center">Sikap (CARE)</th>
                              <th className="p-3 text-center">Deskripsi Capaian</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {students.map((student) => (
                              <tr key={student.id}>
                                <td className="p-3 font-bold text-slate-800">{student.name}</td>
                                <td className="p-3 text-center font-mono">{student.grades.formatif}</td>
                                <td className="p-3 text-center font-mono">{student.grades.sumatif}</td>
                                <td className="p-3 text-center font-bold text-emerald-600">{student.grades.care}</td>
                                <td className="p-3 text-slate-500 leading-normal font-medium max-w-[200px]">
                                  {student.grades.sumatif >= 75 
                                    ? `Sangat baik dalam memahami elemen BK materi ${selectedSubject}` 
                                    : "Perlu bimbingan lebih lanjut pada elemen algoritma"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* 10. EXPORT DATA */}
                {activeSubTab === "export_data" && (
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      {[
                        { title: "Ekspor ke Microsoft Excel", ext: ".XLSX", desc: "Unduh file spreadsheet lengkap nilai murid, presensi, dan penilaian karakter.", action: "Excel" },
                        { title: "Ekspor Laporan Komparatif", ext: ".PDF", desc: "Dokumen PDF siap cetak untuk diserahkan kepada Wakil Kepala Kurikulum.", action: "PDF" },
                        { title: "Salinan Cadangan Database", ext: ".JSON", desc: "Cadangan skema database Firestore lokal untuk arsip data.", action: "Backup" }
                      ].map((card, idx) => (
                        <div key={idx} className="border border-slate-200 rounded-2xl p-5 bg-white shadow-sm flex flex-col justify-between space-y-4">
                          <div className="space-y-2">
                            <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase font-mono">
                              FORMAT: {card.ext}
                            </span>
                            <h3 className="text-xs font-black text-slate-800 leading-snug">{card.title}</h3>
                            <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">{card.desc}</p>
                          </div>
                          <button
                            onClick={() => {
                              if (card.action === "Excel") {
                                exportToCSV();
                              } else if (card.action === "Backup") {
                                exportToJSON();
                              } else if (card.action === "PDF") {
                                handlePrintPDF();
                              }
                            }}
                            className="w-full text-center py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition-colors shadow-sm"
                          >
                            Unduh File {card.action}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 11. KELOLA NILAI & CATATAN PERSONAL */}
                {activeSubTab === "student_management_grades" && (
                  <div className="space-y-6">
                    <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="font-extrabold text-slate-700 block">Informasi Sinkronisasi & Penilaian Real-time:</span>
                        <p className="text-slate-500 font-medium leading-relaxed">
                          Modul ini terhubung langsung ke basis data Google Cloud Firestore. Setiap perubahan nilai atau catatan personal siswa yang disimpan akan langsung memperbarui grafik analisis kurikulum dan laporan hasil belajar.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Left Sidebar: Student list */}
                      <div className="lg:col-span-4 space-y-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Cari murid..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold text-slate-700 placeholder-slate-400"
                          />
                        </div>

                        <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                          {filteredStudents.map((s) => {
                            const isSelected = s.id === selectedEditStudentId;
                            const isPassing = s.grades.sumatif >= 75;
                            return (
                              <button
                                key={s.id}
                                onClick={() => setSelectedEditStudentId(s.id)}
                                className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                                  isSelected
                                    ? "bg-slate-950 border-slate-900 text-white shadow-md"
                                    : "bg-white border-slate-200/60 text-slate-700 hover:border-slate-300"
                                }`}
                              >
                                <div className="space-y-1">
                                  <span className={`text-[10px] font-bold ${isSelected ? "text-slate-400" : "text-slate-400"}`}>
                                    NIS: {s.nis}
                                  </span>
                                  <h4 className="text-xs font-black leading-tight">{s.name}</h4>
                                  <div className="flex items-center gap-2 pt-1">
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                                      isPassing 
                                        ? "bg-emerald-500/10 text-emerald-500" 
                                        : "bg-rose-500/10 text-rose-500"
                                    }`}>
                                      S: {s.grades.sumatif}
                                    </span>
                                    <span className="text-[9px] text-slate-500 font-bold">
                                      F: {s.grades.formatif}
                                    </span>
                                    {s.personalNotes && (
                                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" title="Ada catatan personal" />
                                    )}
                                  </div>
                                </div>
                                <ArrowRight className={`h-3 w-3 ${isSelected ? "text-emerald-400" : "text-slate-300"}`} />
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Right Pane: Form Editor */}
                      <div className="lg:col-span-8">
                        {selectedEditStudentId ? (
                          (() => {
                            const student = students.find(s => s.id === selectedEditStudentId);
                            if (!student) return null;
                            const isPassing = formSumatif >= 75;
                            
                            // Auto suggestion generator
                            const getAISuggestion = () => {
                              if (formSumatif < 75) {
                                return `Siswa ini memerlukan pendampingan remedial terstruktur untuk TP 1.1 materi ${selectedSubject}. Berikan latihan konkret membandingkan algoritma pencarian menggunakan kartu angka secara terurut dan bantu memvisualisasikan indeks Binary Search.`;
                              } else if (formSumatif >= 90) {
                                return `Siswa memiliki potensi akademis sangat tinggi (High-Achiever). Disarankan memberikan tantangan mandiri berupa perancangan alur algoritma kompleksitas O(Log N) dan menugaskannya menjadi tutor sebaya (peer teacher).`;
                              } else {
                                return `Siswa telah mencapai KKM dengan baik. Terus dorong motivasi belajarnya dan berikan apresiasi atas usahanya mempertahankan konsistensi nilai.`;
                              }
                            };

                            return (
                              <div className="border border-slate-200/80 rounded-2xl bg-white shadow-sm overflow-hidden">
                                {/* Header */}
                                <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-extrabold text-sm border border-emerald-200 uppercase">
                                      {student.name.substring(0, 2)}
                                    </div>
                                    <div>
                                      <h3 className="text-xs font-black text-slate-900 leading-tight">{student.name}</h3>
                                      <span className="text-[10px] text-slate-400 font-bold block">NIS: {student.nis} &bull; {selectedClass}</span>
                                    </div>
                                  </div>

                                  <div className="text-right">
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black border uppercase tracking-wider ${
                                      isPassing 
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                                        : "bg-amber-50 text-amber-700 border-amber-200"
                                    }`}>
                                      {isPassing ? "Tuntas KKM" : "Butuh Remedial"}
                                    </span>
                                  </div>
                                </div>

                                {/* Body */}
                                <div className="p-5 space-y-4">
                                  {/* Inputs Grid */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Formatif Input */}
                                    <div className="space-y-1.5 p-3.5 border border-slate-100 rounded-xl bg-slate-50/50">
                                      <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wide">Asesmen Formatif (AfL)</label>
                                        <span className="font-mono text-xs font-extrabold text-slate-800 bg-white border px-1.5 py-0.5 rounded shadow-sm">{formFormatif}</span>
                                      </div>
                                      <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={formFormatif}
                                        onChange={(e) => setFormFormatif(Number(e.target.value))}
                                        className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                                      />
                                      <span className="text-[9px] text-slate-400 font-semibold block leading-none pt-1">Berdasarkan keaktifan harian dan latihan LKPD kelompok</span>
                                    </div>

                                    {/* Sumatif Input */}
                                    <div className="space-y-1.5 p-3.5 border border-slate-100 rounded-xl bg-slate-50/50">
                                      <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wide">Asesmen Sumatif (AoL)</label>
                                        <span className="font-mono text-xs font-extrabold text-slate-800 bg-white border px-1.5 py-0.5 rounded shadow-sm">{formSumatif}</span>
                                      </div>
                                      <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={formSumatif}
                                        onChange={(e) => setFormSumatif(Number(e.target.value))}
                                        className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                                      />
                                      <span className="text-[9px] text-slate-400 font-semibold block leading-none pt-1">Berdasarkan hasil tes tulis modul ajar / ujian akhir</span>
                                    </div>

                                    {/* Sikap CARE Input */}
                                    <div className="space-y-1.5 p-3.5 border border-slate-100 rounded-xl bg-slate-50/50">
                                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wide block">Karakter Sikap (CARE)</label>
                                      <select
                                        value={formCare}
                                        onChange={(e) => setFormCare(e.target.value)}
                                        className="w-full p-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold text-slate-700"
                                      >
                                        <option value="A">A - Sangat Baik (Excellent)</option>
                                        <option value="B">B - Baik (Good)</option>
                                        <option value="C">C - Cukup (Adequate)</option>
                                        <option value="D">D - Perlu Pendampingan</option>
                                      </select>
                                      <span className="text-[9px] text-slate-400 font-semibold block leading-none pt-1">Komitmen, Kolaborasi, Empati, dan Adaptabilitas</span>
                                    </div>

                                    {/* Keterampilan SHAPE Input */}
                                    <div className="space-y-1.5 p-3.5 border border-slate-100 rounded-xl bg-slate-50/50">
                                      <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wide">Keterampilan Praktik (SHAPE)</label>
                                        <span className="font-mono text-xs font-extrabold text-slate-800 bg-white border px-1.5 py-0.5 rounded shadow-sm">{formShape}</span>
                                      </div>
                                      <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={formShape}
                                        onChange={(e) => setFormShape(Number(e.target.value))}
                                        className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                                      />
                                      <span className="text-[9px] text-slate-400 font-semibold block leading-none pt-1">Keterampilan merancang bagan, menyusun kartu, & simulasi logis</span>
                                    </div>
                                  </div>

                                  {/* Personal Notes TextArea */}
                                  <div className="space-y-2 border border-slate-100 p-4 rounded-xl">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                      <label className="text-[10px] font-black text-slate-600 uppercase tracking-wide flex items-center gap-1.5">
                                        <FileText className="h-3.5 w-3.5 text-slate-400" />
                                        Catatan Personal & Observasi Guru
                                      </label>
                                      <button
                                        type="button"
                                        onClick={() => setFormNotes(getAISuggestion())}
                                        className="text-[9px] font-black text-blue-600 hover:text-blue-800 flex items-center gap-1 border border-blue-200 hover:border-blue-300 px-2 py-1 rounded bg-blue-50/50 transition-colors self-start sm:self-auto"
                                      >
                                        <Sparkles className="h-2.5 w-2.5 text-blue-500 fill-blue-500" />
                                        🪄 Tempel Saran AI Tindak Lanjut
                                      </button>
                                    </div>
                                    <textarea
                                      rows={4}
                                      value={formNotes}
                                      onChange={(e) => setFormNotes(e.target.value)}
                                      placeholder="Tuliskan catatan kualitatif tentang kebiasaan belajar, kekuatan, kelemahan, presensi, remedial, atau tindakan afektif spesifik untuk murid ini..."
                                      className="w-full p-3 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-700 leading-relaxed font-medium placeholder-slate-400"
                                    />
                                    {formNotes === getAISuggestion() && (
                                      <span className="text-[8px] text-blue-500 font-extrabold flex items-center gap-1 leading-none">
                                        <Sparkles className="h-2 w-2" />
                                        Saran kognitif AI berhasil dimasukkan. Anda dapat mengedit teks di atas sesuai kebutuhan rill.
                                      </span>
                                    )}
                                  </div>

                                  {/* Save feedback & Save button */}
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                                    <div className="flex-1">
                                      {saveStatus && (
                                        <div className={`flex items-center gap-2 p-2.5 rounded-xl border text-[11px] font-extrabold ${
                                          saveStatus.includes("Error") || saveStatus.includes("Gagal")
                                            ? "bg-rose-50 text-rose-700 border-rose-100"
                                            : "bg-emerald-50 text-emerald-700 border-emerald-100"
                                        }`}>
                                          <CheckCircle className="h-3.5 w-3.5" />
                                          <span>{saveStatus}</span>
                                        </div>
                                      )}
                                    </div>

                                    <button
                                      type="button"
                                      disabled={isSaving}
                                      onClick={handleSaveStudentGradesAndNotes}
                                      className={`w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-sm transition-colors flex items-center justify-center gap-2 ${
                                        isSaving ? "opacity-50 cursor-not-allowed" : ""
                                      }`}
                                    >
                                      {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                                      <Check className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })()
                        ) : (
                          <div className="border border-dashed border-slate-300 rounded-2xl p-12 text-center text-slate-400 font-semibold text-xs space-y-1 bg-white">
                            <p>Tidak ada murid yang dipilih.</p>
                            <span className="text-[10px] text-slate-400 font-medium">Pilih salah satu murid dari daftar di sebelah kiri untuk melihat dan mengelola nilai dan catatan.</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>

    </div>
  );
}
