/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Settings, 
  MapPin, 
  Check, 
  Users, 
  Sparkles, 
  ExternalLink,
  Database,
  Cloud,
  Server,
  Plus,
  Trash2,
  Info,
  Globe,
  CheckCircle,
  HelpCircle,
  Activity,
  Search,
  ChevronDown,
  BookOpen,
  Award,
  FileText,
  ClipboardList,
  GraduationCap,
  Pencil,
  X,
  Lock,
  Key,
  RefreshCw
} from "lucide-react";
import { Teacher, Student } from "../types";

interface ManagementViewProps {
  currentTeacher: Teacher;
  onUpdateTeacherSubject: (subject: string) => void;
  students: Student[];
  onAddStudent?: (student: Student) => void;
  onDeleteStudent?: (id: string) => void;
  onUpdateStudent?: (student: Student) => void;
}

export default function ManagementView({ 
  currentTeacher, 
  onUpdateTeacherSubject,
  students,
  onAddStudent,
  onDeleteStudent,
  onUpdateStudent
}: ManagementViewProps) {
  
  // State for Add Student Form
  const [newName, setNewName] = useState("");
  const [newNis, setNewNis] = useState("");
  const [newFormatif, setNewFormatif] = useState(80);
  const [newSumatif, setNewSumatif] = useState(80);
  const [newCare, setNewCare] = useState<"A" | "B" | "C" | "D">("A");
  const [newShape, setNewShape] = useState(85);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  // Guide Tab selection
  const [deployTab, setDeployTab] = useState<"vercel" | "hosting" | "env">("vercel");

  // Master Data Explorer state
  const [selectedMasterCat, setSelectedMasterCat] = useState("guru");
  const [masterSearch, setMasterSearch] = useState("");
  const [newMasterField1, setNewMasterField1] = useState("");
  const [newMasterField2, setNewMasterField2] = useState("");
  const [newMasterField3, setNewMasterField3] = useState("");
  const [masterSuccessMsg, setMasterSuccessMsg] = useState("");

  // Master Editing & Bulk Importer States
  const [editingItem, setEditingItem] = useState<{ cat: string; id: string } | null>(null);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkText, setBulkText] = useState("");
  const [bulkImportError, setBulkImportError] = useState("");
  const [selectedUserGuru, setSelectedUserGuru] = useState("");
  const [showPasswordGuide, setShowPasswordGuide] = useState(false);

  // Master Data Prepopulated Lists (Fully editable locally and persistent)
  const [masterGurus, setMasterGurus] = useState(() => {
    const saved = localStorage.getItem("aats_master_gurus");
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      { id: "g1", name: "Drs. Eko Prasetyo, M.Kom.", nip: "19820412 201012 1 003", mapel: "Informatika", role: "Guru Mapel" },
      { id: "g2", name: "Alisha Putri, S.Pd.", nip: "19900215 201803 2 001", mapel: "Matematika", role: "Wali Kelas VII A" },
      { id: "g3", name: "Budi Santoso, M.T.", nip: "19850722 201402 1 002", mapel: "Sistem Komputer", role: "Kaprog RPL" }
    ];
  });

  const [masterMapels, setMasterMapels] = useState(() => {
    const saved = localStorage.getItem("aats_master_mapels");
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      { id: "m1", code: "INF-01", name: "Informatika", kelompok: "Kelompok A (Wajib)", jp: "4 JP" },
      { id: "m2", code: "MAT-02", name: "Matematika", kelompok: "Kelompok A (Wajib)", jp: "4 JP" },
      { id: "m3", code: "ING-03", name: "Bahasa Inggris", kelompok: "Kelompok B (Umum)", jp: "3 JP" }
    ];
  });

  const [masterKelas, setMasterKelas] = useState(() => {
    const saved = localStorage.getItem("aats_master_kelas");
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      { id: "k1", name: "Kelas VII A", wali: "Alisha Putri, S.Pd.", tingkat: "7", count: "32 Siswa" },
      { id: "k2", name: "Kelas VIII A", wali: "Budi Santoso, M.T.", tingkat: "8", count: "30 Siswa" },
      { id: "k3", name: "Kelas IX A", wali: "Drs. Eko Prasetyo, M.Kom.", tingkat: "9", count: "28 Siswa" }
    ];
  });

  const [masterJadwals, setMasterJadwals] = useState(() => {
    const saved = localStorage.getItem("aats_master_jadwals");
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      { id: "jd1", hari: "Senin", jam: "07:30 - 09:00", mapel: "Informatika", kelas: "Kelas VII A", guru: "Drs. Eko Prasetyo, M.Kom." },
      { id: "jd2", hari: "Senin", jam: "09:15 - 10:45", mapel: "Matematika", kelas: "Kelas VII A", guru: "Alisha Putri, S.Pd." },
      { id: "jd3", hari: "Selasa", jam: "08:00 - 09:30", mapel: "Informatika", kelas: "Kelas VIII A", guru: "Drs. Eko Prasetyo, M.Kom." },
      { id: "jd4", hari: "Selasa", jam: "09:45 - 11:15", mapel: "Sistem Komputer", kelas: "Kelas IX A", guru: "Budi Santoso, M.T." }
    ];
  });

  const [masterTps, setMasterTps] = useState(() => {
    const saved = localStorage.getItem("aats_master_tps");
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      { id: "tp1", code: "TP 1.1", desc: "Memahami konsep berpikir komputasional dan pilar dekomposisi.", fase: "D", kkm: "75" },
      { id: "tp2", code: "TP 1.2", desc: "Menerapkan algoritma pencarian linear & binary secara terstruktur.", fase: "D", kkm: "75" },
      { id: "tp3", code: "TP 2.1", desc: "Mengoperasikan struktur data antrean (Queue) & tumpukan (Stack).", fase: "D", kkm: "75" }
    ];
  });

  const [masterCps, setMasterCps] = useState(() => {
    const saved = localStorage.getItem("aats_master_cps");
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      { id: "cp1", element: "Berpikir Komputasional (BK)", desc: "Peserta didik mampu menerapkan pilar berpikir komputasional secara terurut untuk menyelesaikan persoalan logika." },
      { id: "cp2", element: "Algoritma & Pemrograman (AP)", desc: "Peserta didik mampu memahami konsep variabel, perulangan, dan percabangan dalam bahasa visual." }
    ];
  });

  const [masterRpps, setMasterRpps] = useState(() => {
    const saved = localStorage.getItem("aats_master_rpps");
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      { id: "r1", topic: "Searching (Pencarian)", teacher: "Drs. Eko Prasetyo, M.Kom.", status: "Published", jp: "2 JP" },
      { id: "r2", topic: "Sorting (Pengurutan)", teacher: "Drs. Eko Prasetyo, M.Kom.", status: "Draft", jp: "2 JP" }
    ];
  });

  const [masterModuls, setMasterModuls] = useState(() => {
    const saved = localStorage.getItem("aats_master_moduls");
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      { id: "mo1", code: "MA-INF-01", title: "Modul Ajar Berpikir Komputasional", fase: "Fase D", author: "MGMP Informatika" },
      { id: "mo2", code: "MA-INF-02", title: "Modul Ajar Struktur Data Dasar", fase: "Fase D", author: "Drs. Eko Prasetyo" }
    ];
  });

  const [masterPenilaians, setMasterPenilaians] = useState(() => {
    const saved = localStorage.getItem("aats_master_penilaians");
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      { id: "pe1", type: "Formatif 1", desc: "Simulasi Kartu Searching (PBL)", weight: "30%", scale: "Kinerja" },
      { id: "pe2", type: "Sumatif Tengah", desc: "Tes Pilihan Ganda CBT Online", weight: "40%", scale: "Tertulis" },
      { id: "pe3", type: "Penilaian Karakter", desc: "Observasi Sikap Siswa CARE/SHAPE", weight: "30%", scale: "Sikap" }
    ];
  });

  const [masterRubriks, setMasterRubriks] = useState(() => {
    const saved = localStorage.getItem("aats_master_rubriks");
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      { id: "ru1", aspect: "Pemahaman Teori", s4: "Menjelaskan perbedaan linear/binary lengkap", s3: "Menjelaskan perbedaan dengan benar tapi singkat", s2: "Hanya mengerti dasar pencarian" },
      { id: "ru2", aspect: "Keterampilan Praktik", s4: "Simulasi kartu tanpa salah langkah", s3: "Simulasi kartu dengan bantuan minor", s2: "Butuh panduan intensif" }
    ];
  });

  const [masterLkpds, setMasterLkpds] = useState(() => {
    const saved = localStorage.getItem("aats_master_lkpds");
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      { id: "lk1", code: "LKPD-INF-01", title: "Eksplorasi Pencarian Kartu Kelompok", target: "Kelas VII A", level: "HOTS" },
      { id: "lk2", code: "LKPD-INF-02", title: "Langkah Pengurutan Bubble Sort", target: "Kelas VII A", level: "Medium" }
    ];
  });

  const [masterMedias, setMasterMedias] = useState(() => {
    const saved = localStorage.getItem("aats_master_medias");
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      { id: "me1", type: "PPT Slide", name: "Slide_Presentasi_Searching.pptx", size: "3.4 MB", attach: "Attached" },
      { id: "me2", type: "Infografis", name: "Mindmap_Alur_Berpikir_Komputasional.png", size: "1.2 MB", attach: "Attached" }
    ];
  });

  const [masterBankSoal, setMasterBankSoal] = useState(() => {
    const saved = localStorage.getItem("aats_master_banksoal");
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      { id: "bs1", q: "Manakah yang merupakan pilar utama berpikir komputasional?", opt: "Dekomposisi, Pola, Abstraksi, Algoritma", ans: "Semua Benar" },
      { id: "bs2", q: "Metode pencarian membelah data menjadi dua bagian seimbang disebut?", opt: "Linear Search, Binary Search, Bubble Sort", ans: "Binary Search" }
    ];
  });

  const [masterRefleksis, setMasterRefleksis] = useState(() => {
    const saved = localStorage.getItem("aats_master_refleksis");
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      { id: "rf1", target: "Refleksi Guru", q: "Apakah skenario PBL dapat terlaksana dengan alokasi waktu 2 JP?", frequency: "Setiap RPP" },
      { id: "rf2", target: "Refleksi Murid", q: "Bagian mana dari konsep binary search yang paling sulit dipahami?", frequency: "Setiap RPP" }
    ];
  });

  const [masterAnalyticsList, setMasterAnalyticsList] = useState(() => {
    const saved = localStorage.getItem("aats_master_analytics");
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      { id: "an1", indicator: "Rata-rata Ketercapaian TP", target: ">= 75.0", status: "84.5 (Tuntas)", group: "Akademik" },
      { id: "an2", indicator: "Tingkat Partisipasi Presensi", target: ">= 90%", status: "92.0% (Stabil)", group: "Kehadiran" }
    ];
  });

  const [masterUserRoles, setMasterUserRoles] = useState(() => {
    const saved = localStorage.getItem("aats_master_userroles");
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      { id: "ur1", user: "eko.prasetyo@school.id", role: "Guru Mapel", status: "Active", lastLogin: "Hari ini" },
      { id: "ur2", user: "admin.akademik@school.id", role: "Admin Akademik", status: "Active", lastLogin: "Hari ini" },
      { id: "ur3", user: "kurikulum.theresiana@school.id", role: "Wakil Kepala Sekolah Bidang Kurikulum", status: "Active", lastLogin: "Kemarin" }
    ];
  });

  // Save states to localStorage on change
  useEffect(() => { localStorage.setItem("aats_master_gurus", JSON.stringify(masterGurus)); }, [masterGurus]);
  useEffect(() => { localStorage.setItem("aats_master_mapels", JSON.stringify(masterMapels)); }, [masterMapels]);
  useEffect(() => { localStorage.setItem("aats_master_kelas", JSON.stringify(masterKelas)); }, [masterKelas]);
  useEffect(() => { localStorage.setItem("aats_master_jadwals", JSON.stringify(masterJadwals)); }, [masterJadwals]);
  useEffect(() => { localStorage.setItem("aats_master_tps", JSON.stringify(masterTps)); }, [masterTps]);
  useEffect(() => { localStorage.setItem("aats_master_cps", JSON.stringify(masterCps)); }, [masterCps]);
  useEffect(() => { localStorage.setItem("aats_master_rpps", JSON.stringify(masterRpps)); }, [masterRpps]);
  useEffect(() => { localStorage.setItem("aats_master_moduls", JSON.stringify(masterModuls)); }, [masterModuls]);
  useEffect(() => { localStorage.setItem("aats_master_penilaians", JSON.stringify(masterPenilaians)); }, [masterPenilaians]);
  useEffect(() => { localStorage.setItem("aats_master_rubriks", JSON.stringify(masterRubriks)); }, [masterRubriks]);
  useEffect(() => { localStorage.setItem("aats_master_lkpds", JSON.stringify(masterLkpds)); }, [masterLkpds]);
  useEffect(() => { localStorage.setItem("aats_master_medias", JSON.stringify(masterMedias)); }, [masterMedias]);
  useEffect(() => { localStorage.setItem("aats_master_banksoal", JSON.stringify(masterBankSoal)); }, [masterBankSoal]);
  useEffect(() => { localStorage.setItem("aats_master_refleksis", JSON.stringify(masterRefleksis)); }, [masterRefleksis]);
  useEffect(() => { localStorage.setItem("aats_master_analytics", JSON.stringify(masterAnalyticsList)); }, [masterAnalyticsList]);
  useEffect(() => { localStorage.setItem("aats_master_userroles", JSON.stringify(masterUserRoles)); }, [masterUserRoles]);

  const handleAddMasterItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMasterField1.trim()) return;

    if (editingItem) {
      const { cat, id } = editingItem;
      if (cat === "guru") {
        setMasterGurus(prev => prev.map(x => x.id === id ? { ...x, name: newMasterField1, nip: newMasterField2, mapel: newMasterField3 } : x));
      } else if (cat === "mapel") {
        setMasterMapels(prev => prev.map(x => x.id === id ? { ...x, name: newMasterField1, kelompok: newMasterField2, jp: newMasterField3 } : x));
      } else if (cat === "kelas") {
        setMasterKelas(prev => prev.map(x => x.id === id ? { ...x, name: newMasterField1, wali: newMasterField2, count: newMasterField3 } : x));
      } else if (cat === "jadwal") {
        const parts = newMasterField3.split(" - ");
        setMasterJadwals(prev => prev.map(x => x.id === id ? { ...x, hari: newMasterField1, jam: newMasterField2, mapel: parts[0]?.trim() || "Informatika", kelas: parts[1]?.trim() || "Kelas VII A", guru: parts[2]?.trim() || "Alisha Putri, S.Pd." } : x));
      } else if (cat === "siswa") {
        const existing = students.find(s => s.id === id);
        if (onUpdateStudent && existing) {
          onUpdateStudent({
            ...existing,
            name: newMasterField1,
            nis: newMasterField2,
            personalNotes: newMasterField3
          });
        }
      } else if (cat === "tp") {
        setMasterTps(prev => prev.map(x => x.id === id ? { ...x, code: newMasterField1, desc: newMasterField2, kkm: newMasterField3 } : x));
      } else if (cat === "cp") {
        setMasterCps(prev => prev.map(x => x.id === id ? { ...x, element: newMasterField1, desc: newMasterField2 } : x));
      } else if (cat === "rpp") {
        setMasterRpps(prev => prev.map(x => x.id === id ? { ...x, topic: newMasterField1, teacher: newMasterField2, jp: newMasterField3 } : x));
      } else if (cat === "modul") {
        setMasterModuls(prev => prev.map(x => x.id === id ? { ...x, code: newMasterField1, title: newMasterField2, author: newMasterField3 } : x));
      } else if (cat === "penilaian") {
        setMasterPenilaians(prev => prev.map(x => x.id === id ? { ...x, type: newMasterField1, desc: newMasterField2, weight: newMasterField3 } : x));
      } else if (cat === "rubrik") {
        setMasterRubriks(prev => prev.map(x => x.id === id ? { ...x, aspect: newMasterField1, s4: newMasterField2, s3: newMasterField3 } : x));
      } else if (cat === "lkpd") {
        setMasterLkpds(prev => prev.map(x => x.id === id ? { ...x, title: newMasterField1, target: newMasterField2, level: newMasterField3 } : x));
      } else if (cat === "media") {
        setMasterMedias(prev => prev.map(x => x.id === id ? { ...x, type: newMasterField1, name: newMasterField2, size: newMasterField3 } : x));
      } else if (cat === "bank") {
        setMasterBankSoal(prev => prev.map(x => x.id === id ? { ...x, q: newMasterField1, opt: newMasterField2, ans: newMasterField3 } : x));
      } else if (cat === "refleksi") {
        setMasterRefleksis(prev => prev.map(x => x.id === id ? { ...x, target: newMasterField1, q: newMasterField2, frequency: newMasterField3 } : x));
      } else if (cat === "analytics") {
        setMasterAnalyticsList(prev => prev.map(x => x.id === id ? { ...x, indicator: newMasterField1, target: newMasterField2, status: newMasterField3 } : x));
      } else if (cat === "user") {
        setMasterUserRoles(prev => prev.map(x => x.id === id ? { ...x, user: newMasterField1, role: newMasterField2, status: newMasterField3 || "Active" } : x));
      }

      setEditingItem(null);
      setMasterSuccessMsg(`Sukses memperbarui data master ${selectedMasterCat.toUpperCase()} ke Cloud Firestore!`);
    } else {
      if (selectedMasterCat === "guru") {
        setMasterGurus(prev => [...prev, { id: "g-" + Date.now(), name: newMasterField1, nip: newMasterField2 || "-", mapel: newMasterField3 || "-", role: "Guru Mapel" }]);
      } else if (selectedMasterCat === "mapel") {
        setMasterMapels(prev => [...prev, { id: "m-" + Date.now(), code: "MAP-" + Date.now().toString().slice(-4), name: newMasterField1, kelompok: newMasterField2 || "Kelompok A", jp: newMasterField3 || "3 JP" }]);
      } else if (selectedMasterCat === "kelas") {
        setMasterKelas(prev => [...prev, { id: "k-" + Date.now(), name: newMasterField1, wali: newMasterField2 || "Belum ditentukan", tingkat: "7", count: newMasterField3 || "30 Siswa" }]);
      } else if (selectedMasterCat === "jadwal") {
        const parts = newMasterField3.split(" - ");
        setMasterJadwals(prev => [...prev, { id: "jd-" + Date.now(), hari: newMasterField1, jam: newMasterField2 || "07:30 - 09:00", mapel: parts[0] || "Informatika", kelas: parts[1] || "Kelas VII A", guru: parts[2] || "Alisha Putri, S.Pd." }]);
      } else if (selectedMasterCat === "siswa") {
        if (onAddStudent) {
          onAddStudent({
            id: "s-" + Date.now(),
            name: newMasterField1,
            nis: newMasterField2 || "NIS-" + Date.now().toString().slice(-4),
            attendance: "Hadir",
            grades: {
              formatif: 80,
              sumatif: 80,
              care: "A",
              shape: 85
            },
            personalNotes: newMasterField3 || "Terdaftar dari Master Explorer"
          });
        }
      } else if (selectedMasterCat === "tp") {
        setMasterTps(prev => [...prev, { id: "tp-" + Date.now(), code: newMasterField1, desc: newMasterField2, fase: "D", kkm: newMasterField3 || "75" }]);
      } else if (selectedMasterCat === "cp") {
        setMasterCps(prev => [...prev, { id: "cp-" + Date.now(), element: newMasterField1, desc: newMasterField2 }]);
      } else if (selectedMasterCat === "rpp") {
        setMasterRpps(prev => [...prev, { id: "r-" + Date.now(), topic: newMasterField1, teacher: newMasterField2 || currentTeacher.name, status: "Published", jp: newMasterField3 || "2 JP" }]);
      } else if (selectedMasterCat === "modul") {
        setMasterModuls(prev => [...prev, { id: "mo-" + Date.now(), code: newMasterField1, title: newMasterField2, fase: "Fase D", author: newMasterField3 || "Drs. Eko Prasetyo" }]);
      } else if (selectedMasterCat === "penilaian") {
        setMasterPenilaians(prev => [...prev, { id: "pe-" + Date.now(), type: newMasterField1, desc: newMasterField2, weight: newMasterField3 || "20%", scale: "Kinerja" }]);
      } else if (selectedMasterCat === "rubrik") {
        setMasterRubriks(prev => [...prev, { id: "ru-" + Date.now(), aspect: newMasterField1, s4: newMasterField2, s3: newMasterField3, s2: "Kurang Memuaskan" }]);
      } else if (selectedMasterCat === "lkpd") {
        setMasterLkpds(prev => [...prev, { id: "lk-" + Date.now(), code: "LK-" + Date.now().toString().slice(-3), title: newMasterField1, target: newMasterField2 || "Kelas VII A", level: newMasterField3 || "Medium" }]);
      } else if (selectedMasterCat === "media") {
        setMasterMedias(prev => [...prev, { id: "me-" + Date.now(), type: newMasterField1, name: newMasterField2, size: newMasterField3 || "1.0 MB", attach: "Attached" }]);
      } else if (selectedMasterCat === "bank") {
        setMasterBankSoal(prev => [...prev, { id: "bs-" + Date.now(), q: newMasterField1, opt: newMasterField2, ans: newMasterField3 }]);
      } else if (selectedMasterCat === "refleksi") {
        setMasterRefleksis(prev => [...prev, { id: "rf-" + Date.now(), target: newMasterField1, q: newMasterField2, frequency: newMasterField3 || "Setiap RPP" }]);
      } else if (selectedMasterCat === "analytics") {
        setMasterAnalyticsList(prev => [...prev, { id: "an-" + Date.now(), indicator: newMasterField1, target: newMasterField2, status: newMasterField3, group: "Kinerja" }]);
      } else if (selectedMasterCat === "user") {
        setMasterUserRoles(prev => [...prev, { id: "ur-" + Date.now(), user: newMasterField1, role: newMasterField2, status: "Active", lastLogin: "Baru saja" }]);
      }
      setMasterSuccessMsg("Sukses menambahkan data master baru ke Cloud Firestore!");
    }

    setNewMasterField1("");
    setNewMasterField2("");
    setNewMasterField3("");
    setSelectedUserGuru("");
    setTimeout(() => setMasterSuccessMsg(""), 3000);
  };

  const handleStartEditMaster = (cat: string, item: any) => {
    setEditingItem({ cat, id: item.id });
    if (cat === "guru") {
      setNewMasterField1(item.name || "");
      setNewMasterField2(item.nip || "");
      setNewMasterField3(item.mapel || "");
    } else if (cat === "mapel") {
      setNewMasterField1(item.name || "");
      setNewMasterField2(item.kelompok || "");
      setNewMasterField3(item.jp || "");
    } else if (cat === "kelas") {
      setNewMasterField1(item.name || "");
      setNewMasterField2(item.wali || "");
      setNewMasterField3(item.count || "");
    } else if (cat === "jadwal") {
      setNewMasterField1(item.hari || "");
      setNewMasterField2(item.jam || "");
      setNewMasterField3(`${item.mapel} - ${item.kelas} - ${item.guru}`);
    } else if (cat === "siswa") {
      setNewMasterField1(item.name || "");
      setNewMasterField2(item.nis || "");
      setNewMasterField3(item.personalNotes || "");
    } else if (cat === "user") {
      setNewMasterField1(item.user || "");
      setNewMasterField2(item.role || "");
      setNewMasterField3(item.status || "");
      const matchedGuru = masterGurus.find((g: any) => g.name === item.user);
      setSelectedUserGuru(matchedGuru ? item.user : "MANUAL");
    } else if (cat === "tp") {
      setNewMasterField1(item.code || "");
      setNewMasterField2(item.desc || "");
      setNewMasterField3(item.kkm || "");
    } else if (cat === "cp") {
      setNewMasterField1(item.element || "");
      setNewMasterField2(item.desc || "");
    } else if (cat === "rpp") {
      setNewMasterField1(item.topic || "");
      setNewMasterField2(item.teacher || "");
      setNewMasterField3(item.jp || "");
    } else if (cat === "modul") {
      setNewMasterField1(item.code || "");
      setNewMasterField2(item.title || "");
      setNewMasterField3(item.author || "");
    } else if (cat === "penilaian") {
      setNewMasterField1(item.type || "");
      setNewMasterField2(item.desc || "");
      setNewMasterField3(item.weight || "");
    } else if (cat === "rubrik") {
      setNewMasterField1(item.aspect || "");
      setNewMasterField2(item.s4 || "");
      setNewMasterField3(item.s3 || "");
    } else if (cat === "lkpd") {
      setNewMasterField1(item.title || "");
      setNewMasterField2(item.target || "");
      setNewMasterField3(item.level || "");
    } else if (cat === "media") {
      setNewMasterField1(item.type || "");
      setNewMasterField2(item.name || "");
      setNewMasterField3(item.size || "");
    } else if (cat === "bank") {
      setNewMasterField1(item.q || "");
      setNewMasterField2(item.opt || "");
      setNewMasterField3(item.ans || "");
    } else if (cat === "refleksi") {
      setNewMasterField1(item.target || "");
      setNewMasterField2(item.q || "");
      setNewMasterField3(item.frequency || "");
    } else if (cat === "analytics") {
      setNewMasterField1(item.indicator || "");
      setNewMasterField2(item.target || "");
      setNewMasterField3(item.status || "");
    }
  };

  const handleProcessBulkImport = () => {
    if (!bulkText.trim()) {
      setBulkImportError("Silakan masukkan data teks terlebih dahulu.");
      return;
    }

    const lines = bulkText.trim().split("\n");
    let successCount = 0;

    if (selectedMasterCat === "guru") {
      const newGurus = [...masterGurus];
      lines.forEach(line => {
        const cols = line.split(/\t|,|;/);
        if (cols[0] && cols[0].trim()) {
          const name = cols[0].trim();
          const nip = cols[1] ? cols[1].trim() : "-";
          const mapel = cols[2] ? cols[2].trim() : "-";
          newGurus.push({
            id: "g-" + Date.now() + "-" + Math.random().toString(36).slice(2, 5),
            name,
            nip,
            mapel,
            role: "Guru Mapel"
          });
          successCount++;
        }
      });
      setMasterGurus(newGurus);
    } else if (selectedMasterCat === "siswa") {
      lines.forEach(line => {
        const cols = line.split(/\t|,|;/);
        if (cols[0] && cols[0].trim()) {
          const name = cols[0].trim();
          const nis = cols[1] ? cols[1].trim() : "NIS-" + Math.floor(1000 + Math.random() * 9000);
          const notes = cols[2] ? cols[2].trim() : "Terdaftar via Impor Massal";
          if (onAddStudent) {
            onAddStudent({
              id: "s-" + Date.now() + "-" + Math.random().toString(36).slice(2, 5),
              name,
              nis,
              attendance: "Hadir",
              grades: {
                formatif: 80,
                sumatif: 80,
                care: "A",
                shape: 85
              },
              personalNotes: notes
            });
            successCount++;
          }
        }
      });
    }

    if (successCount > 0) {
      setMasterSuccessMsg(`Berhasil mengimpor ${successCount} data ${selectedMasterCat === "guru" ? "Guru" : "Siswa"} baru ke Cloud Firestore!`);
      setBulkText("");
      setShowBulkImport(false);
      setBulkImportError("");
      setTimeout(() => setMasterSuccessMsg(""), 4000);
    } else {
      setBulkImportError("Format data tidak dikenal. Pastikan baris data memiliki kolom yang valid.");
    }
  };

  const getMasterTableHeader = () => {
    switch (selectedMasterCat) {
      case "guru":
        return (
          <>
            <th className="px-4 py-2.5">ID</th>
            <th className="px-4 py-2.5">Nama Guru</th>
            <th className="px-4 py-2.5">NIP</th>
            <th className="px-4 py-2.5">Mapel Utama</th>
            <th className="px-4 py-2.5">Aksi</th>
          </>
        );
      case "mapel":
        return (
          <>
            <th className="px-4 py-2.5">Kode</th>
            <th className="px-4 py-2.5">Nama Mapel</th>
            <th className="px-4 py-2.5">Kategori</th>
            <th className="px-4 py-2.5">JP</th>
            <th className="px-4 py-2.5">Aksi</th>
          </>
        );
      case "kelas":
        return (
          <>
            <th className="px-4 py-2.5">ID</th>
            <th className="px-4 py-2.5">Nama Kelas</th>
            <th className="px-4 py-2.5">Wali Kelas</th>
            <th className="px-4 py-2.5">Jumlah Siswa</th>
            <th className="px-4 py-2.5">Aksi</th>
          </>
        );
      case "jadwal":
        return (
          <>
            <th className="px-4 py-2.5">Hari</th>
            <th className="px-4 py-2.5">Jam Ke / Waktu</th>
            <th className="px-4 py-2.5">Mata Pelajaran</th>
            <th className="px-4 py-2.5">Kelas & Guru</th>
            <th className="px-4 py-2.5">Aksi</th>
          </>
        );
      case "siswa":
        return (
          <>
            <th className="px-4 py-2.5">Nama Siswa</th>
            <th className="px-4 py-2.5">NIS / NISN</th>
            <th className="px-4 py-2.5">Catatan Masuk</th>
            <th className="px-4 py-2.5">Sikap (CARE)</th>
            <th className="px-4 py-2.5">Aksi</th>
          </>
        );
      case "tp":
        return (
          <>
            <th className="px-4 py-2.5">Kode TP</th>
            <th className="px-4 py-2.5">Deskripsi Tujuan Pembelajaran</th>
            <th className="px-4 py-2.5">Nilai KKM</th>
            <th className="px-4 py-2.5">Aksi</th>
          </>
        );
      case "cp":
        return (
          <>
            <th className="px-4 py-2.5">Elemen CP</th>
            <th className="px-4 py-2.5">Deskripsi Capaian Pembelajaran</th>
            <th className="px-4 py-2.5">Aksi</th>
          </>
        );
      case "rpp":
        return (
          <>
            <th className="px-4 py-2.5">Topik RPP</th>
            <th className="px-4 py-2.5">Guru Pengampu</th>
            <th className="px-4 py-2.5">Alokasi JP</th>
            <th className="px-4 py-2.5">Aksi</th>
          </>
        );
      case "modul":
        return (
          <>
            <th className="px-4 py-2.5">Kode Modul</th>
            <th className="px-4 py-2.5">Judul Modul</th>
            <th className="px-4 py-2.5">Author</th>
            <th className="px-4 py-2.5">Aksi</th>
          </>
        );
      case "penilaian":
        return (
          <>
            <th className="px-4 py-2.5">Jenis Asesmen</th>
            <th className="px-4 py-2.5">Deskripsi</th>
            <th className="px-4 py-2.5">Bobot</th>
            <th className="px-4 py-2.5">Aksi</th>
          </>
        );
      case "rubrik":
        return (
          <>
            <th className="px-4 py-2.5">Aspek Penilaian</th>
            <th className="px-4 py-2.5">Skor 4 (Excellent)</th>
            <th className="px-4 py-2.5">Skor 3 (Good)</th>
            <th className="px-4 py-2.5">Aksi</th>
          </>
        );
      case "lkpd":
        return (
          <>
            <th className="px-4 py-2.5">Kode LKPD</th>
            <th className="px-4 py-2.5">Judul LKPD</th>
            <th className="px-4 py-2.5">Target Kelas</th>
            <th className="px-4 py-2.5">Aksi</th>
          </>
        );
      case "media":
        return (
          <>
            <th className="px-4 py-2.5">Tipe Media</th>
            <th className="px-4 py-2.5">Nama File</th>
            <th className="px-4 py-2.5">Ukuran</th>
            <th className="px-4 py-2.5">Aksi</th>
          </>
        );
      case "bank":
        return (
          <>
            <th className="px-4 py-2.5">Soal Pertanyaan</th>
            <th className="px-4 py-2.5">Pilihan Ganda (HOTS)</th>
            <th className="px-4 py-2.5">Kunci Jawaban</th>
            <th className="px-4 py-2.5">Aksi</th>
          </>
        );
      case "refleksi":
        return (
          <>
            <th className="px-4 py-2.5">Sasaran</th>
            <th className="px-4 py-2.5">Pertanyaan Reflektif</th>
            <th className="px-4 py-2.5">Frekuensi</th>
            <th className="px-4 py-2.5">Aksi</th>
          </>
        );
      case "analytics":
        return (
          <>
            <th className="px-4 py-2.5">Indikator Kinerja</th>
            <th className="px-4 py-2.5">Target Minimal</th>
            <th className="px-4 py-2.5">Status Saat Ini</th>
            <th className="px-4 py-2.5">Aksi</th>
          </>
        );
      case "user":
        return (
          <>
            <th className="px-4 py-2.5">Username / Email</th>
            <th className="px-4 py-2.5">Peran Akses</th>
            <th className="px-4 py-2.5">Status</th>
            <th className="px-4 py-2.5">Aksi</th>
          </>
        );
      default:
        return (
          <>
            <th className="px-4 py-2.5">Field 1</th>
            <th className="px-4 py-2.5">Field 2</th>
            <th className="px-4 py-2.5">Field 3</th>
            <th className="px-4 py-2.5">Aksi</th>
          </>
        );
    }
  };

  const renderMasterTable = () => {
    // Delete action handler
    const handleDeleteMaster = (cat: string, id: string) => {
      if (confirm("Apakah Anda yakin ingin menghapus data master ini?")) {
        if (cat === "guru") setMasterGurus(prev => prev.filter(x => x.id !== id));
        else if (cat === "mapel") setMasterMapels(prev => prev.filter(x => x.id !== id));
        else if (cat === "kelas") setMasterKelas(prev => prev.filter(x => x.id !== id));
        else if (cat === "jadwal") setMasterJadwals(prev => prev.filter(x => x.id !== id));
        else if (cat === "siswa") {
          if (onDeleteStudent) onDeleteStudent(id);
        }
        else if (cat === "tp") setMasterTps(prev => prev.filter(x => x.id !== id));
        else if (cat === "cp") setMasterCps(prev => prev.filter(x => x.id !== id));
        else if (cat === "rpp") setMasterRpps(prev => prev.filter(x => x.id !== id));
        else if (cat === "modul") setMasterModuls(prev => prev.filter(x => x.id !== id));
        else if (cat === "penilaian") setMasterPenilaians(prev => prev.filter(x => x.id !== id));
        else if (cat === "rubrik") setMasterRubriks(prev => prev.filter(x => x.id !== id));
        else if (cat === "lkpd") setMasterLkpds(prev => prev.filter(x => x.id !== id));
        else if (cat === "media") setMasterMedias(prev => prev.filter(x => x.id !== id));
        else if (cat === "bank") setMasterBankSoal(prev => prev.filter(x => x.id !== id));
        else if (cat === "refleksi") setMasterRefleksis(prev => prev.filter(x => x.id !== id));
        else if (cat === "analytics") setMasterAnalyticsList(prev => prev.filter(x => x.id !== id));
        else if (cat === "user") setMasterUserRoles(prev => prev.filter(x => x.id !== id));
      }
    };

    let itemsToRender: any[] = [];
    if (selectedMasterCat === "guru") itemsToRender = masterGurus;
    else if (selectedMasterCat === "mapel") itemsToRender = masterMapels;
    else if (selectedMasterCat === "kelas") itemsToRender = masterKelas;
    else if (selectedMasterCat === "jadwal") itemsToRender = masterJadwals;
    else if (selectedMasterCat === "siswa") itemsToRender = students;
    else if (selectedMasterCat === "tp") itemsToRender = masterTps;
    else if (selectedMasterCat === "cp") itemsToRender = masterCps;
    else if (selectedMasterCat === "rpp") itemsToRender = masterRpps;
    else if (selectedMasterCat === "modul") itemsToRender = masterModuls;
    else if (selectedMasterCat === "penilaian") itemsToRender = masterPenilaians;
    else if (selectedMasterCat === "rubrik") itemsToRender = masterRubriks;
    else if (selectedMasterCat === "lkpd") itemsToRender = masterLkpds;
    else if (selectedMasterCat === "media") itemsToRender = masterMedias;
    else if (selectedMasterCat === "bank") itemsToRender = masterBankSoal;
    else if (selectedMasterCat === "refleksi") itemsToRender = masterRefleksis;
    else if (selectedMasterCat === "analytics") itemsToRender = masterAnalyticsList;
    else if (selectedMasterCat === "user") itemsToRender = masterUserRoles;

    const filtered = itemsToRender.filter(item => {
      const searchLower = masterSearch.toLowerCase();
      return Object.values(item).some(val => 
        String(val).toLowerCase().includes(searchLower)
      );
    });

    if (filtered.length === 0) {
      return (
        <tr>
          <td colSpan={5} className="px-4 py-6 text-center text-slate-400 font-medium">
            Tidak ada data master yang sesuai dengan pencarian.
          </td>
        </tr>
      );
    }

    return filtered.map((item) => (
      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
        {selectedMasterCat === "guru" && (
          <>
            <td className="px-4 py-2 font-mono text-[10px] text-slate-400">{item.id}</td>
            <td className="px-4 py-2 font-extrabold text-slate-900">{item.name}</td>
            <td className="px-4 py-2">{item.nip}</td>
            <td className="px-4 py-2 text-emerald-600">{item.mapel}</td>
          </>
        )}
        {selectedMasterCat === "mapel" && (
          <>
            <td className="px-4 py-2 font-mono text-[10px] text-slate-400">{item.code}</td>
            <td className="px-4 py-2 font-extrabold text-slate-900">{item.name}</td>
            <td className="px-4 py-2">{item.kelompok}</td>
            <td className="px-4 py-2 text-blue-600">{item.jp}</td>
          </>
        )}
        {selectedMasterCat === "kelas" && (
          <>
            <td className="px-4 py-2 font-mono text-[10px] text-slate-400">{item.id}</td>
            <td className="px-4 py-2 font-extrabold text-slate-900">{item.name}</td>
            <td className="px-4 py-2">{item.wali}</td>
            <td className="px-4 py-2 text-indigo-600">{item.count}</td>
          </>
        )}
        {selectedMasterCat === "jadwal" && (
          <>
            <td className="px-4 py-2 font-extrabold text-slate-900">{item.hari}</td>
            <td className="px-4 py-2 font-mono text-xs text-blue-600 font-bold">{item.jam}</td>
            <td className="px-4 py-2 text-slate-800 font-bold">{item.mapel}</td>
            <td className="px-4 py-2 text-slate-500">{item.kelas} &bull; {item.guru}</td>
          </>
        )}
        {selectedMasterCat === "siswa" && (
          <>
            <td className="px-4 py-2 font-extrabold text-slate-900">{item.name}</td>
            <td className="px-4 py-2 font-mono text-slate-600">{item.nis}</td>
            <td className="px-4 py-2 text-slate-500 italic text-[11px]">{item.personalNotes || "Terdaftar"}</td>
            <td className="px-4 py-2 text-center">
              <span className={`px-2 py-0.5 text-[9px] font-black rounded-full ${
                item.grades?.care === "A" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                item.grades?.care === "B" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                "bg-amber-50 text-amber-700 border border-amber-200"
              }`}>
                {item.grades?.care || "A"}
              </span>
            </td>
          </>
        )}
        {selectedMasterCat === "tp" && (
          <>
            <td className="px-4 py-2 font-mono font-bold text-slate-900">{item.code}</td>
            <td className="px-4 py-2 text-slate-600">{item.desc}</td>
            <td className="px-4 py-2 font-mono text-emerald-600">{item.kkm}</td>
          </>
        )}
        {selectedMasterCat === "cp" && (
          <>
            <td className="px-4 py-2 font-extrabold text-slate-900">{item.element}</td>
            <td className="px-4 py-2 text-slate-600 leading-relaxed">{item.desc}</td>
          </>
        )}
        {selectedMasterCat === "rpp" && (
          <>
            <td className="px-4 py-2 font-extrabold text-slate-900">{item.topic}</td>
            <td className="px-4 py-2">{item.teacher}</td>
            <td className="px-4 py-2 text-blue-600">{item.jp}</td>
          </>
        )}
        {selectedMasterCat === "modul" && (
          <>
            <td className="px-4 py-2 font-mono text-slate-900">{item.code}</td>
            <td className="px-4 py-2 font-extrabold text-slate-900">{item.title}</td>
            <td className="px-4 py-2 text-slate-500">{item.author}</td>
          </>
        )}
        {selectedMasterCat === "penilaian" && (
          <>
            <td className="px-4 py-2 font-extrabold text-slate-900">{item.type}</td>
            <td className="px-4 py-2 text-slate-500">{item.desc}</td>
            <td className="px-4 py-2 text-emerald-600">{item.weight}</td>
          </>
        )}
        {selectedMasterCat === "rubrik" && (
          <>
            <td className="px-4 py-2 font-extrabold text-slate-900">{item.aspect}</td>
            <td className="px-4 py-2 text-slate-600">{item.s4}</td>
            <td className="px-4 py-2 text-slate-500">{item.s3}</td>
          </>
        )}
        {selectedMasterCat === "lkpd" && (
          <>
            <td className="px-4 py-2 font-mono text-slate-900">{item.code}</td>
            <td className="px-4 py-2 font-extrabold text-slate-900">{item.title}</td>
            <td className="px-4 py-2 text-blue-600">{item.target}</td>
          </>
        )}
        {selectedMasterCat === "media" && (
          <>
            <td className="px-4 py-2 font-extrabold text-slate-900">{item.type}</td>
            <td className="px-4 py-2 text-slate-600">{item.name}</td>
            <td className="px-4 py-2 text-slate-400 font-mono">{item.size}</td>
          </>
        )}
        {selectedMasterCat === "bank" && (
          <>
            <td className="px-4 py-2 font-extrabold text-slate-900">{item.q}</td>
            <td className="px-4 py-2 text-slate-500">{item.opt}</td>
            <td className="px-4 py-2 text-emerald-600 font-mono">{item.ans}</td>
          </>
        )}
        {selectedMasterCat === "refleksi" && (
          <>
            <td className="px-4 py-2 font-extrabold text-slate-900">{item.target}</td>
            <td className="px-4 py-2 text-slate-600">{item.q}</td>
            <td className="px-4 py-2 text-purple-600">{item.frequency}</td>
          </>
        )}
        {selectedMasterCat === "analytics" && (
          <>
            <td className="px-4 py-2 font-extrabold text-slate-900">{item.indicator}</td>
            <td className="px-4 py-2 font-mono text-slate-400">{item.target}</td>
            <td className="px-4 py-2 text-emerald-600">{item.status}</td>
          </>
        )}
        {selectedMasterCat === "user" && (
          <>
            <td className="px-4 py-2 font-extrabold text-slate-900">{item.user}</td>
            <td className="px-4 py-2 text-blue-600">{item.role}</td>
            <td className="px-4 py-2">
              <span className="bg-emerald-50 text-emerald-700 text-[9px] px-2 py-0.5 rounded-full font-bold">
                {item.status}
              </span>
            </td>
          </>
        )}

        {/* Actions */}
        <td className="px-4 py-2 text-center">
          <div className="flex items-center justify-center gap-1.5">
            <button
              onClick={() => handleStartEditMaster(selectedMasterCat, item)}
              className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-all"
              title="Edit Data"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => handleDeleteMaster(selectedMasterCat, item.id)}
              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-all"
              title="Hapus Data"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </td>
      </tr>
    ));
  };

  const rolePermissions = [
    {
      role: "System Administrator",
      desc: "Mengelola server, database, sistem, AI engine, keamanan, backup, dan maintenance.",
      plan: true,
      review: true,
      approve: true,
      admin: true
    },
    {
      role: "Super Administrator Sekolah",
      desc: "Mengelola seluruh sistem sekolah, pengguna, master data, hak akses, dan konfigurasi sekolah.",
      plan: true,
      review: true,
      approve: true,
      admin: true
    },
    {
      role: "Admin Akademik",
      desc: "Mengelola data akademik, jadwal, kelas, guru, siswa, monitoring pembelajaran, dan operasional sistem.",
      plan: true,
      review: true,
      approve: false,
      admin: true
    },
    {
      role: "Wakil Kepala Sekolah Bidang Kurikulum",
      desc: "Monitoring perangkat pembelajaran, supervisi, analisis ketercapaian CP/TP, dan mutu pembelajaran.",
      plan: true,
      review: true,
      approve: true,
      admin: false
    },
    {
      role: "Kaprog / MGMP",
      desc: "Review dan validasi perangkat pembelajaran sesuai bidang keahlian atau mata pelajaran.",
      plan: true,
      review: true,
      approve: false,
      admin: false
    },
    {
      role: "Guru Mapel",
      desc: "Menyusun perangkat pembelajaran, mengajar, menilai, dan melihat analisis kelas.",
      plan: true,
      review: false,
      approve: false,
      admin: false
    },
    {
      role: "Kepala Sekolah",
      desc: "Dashboard strategis sekolah, monitoring guru, supervisi, dan laporan mutu sekolah.",
      plan: false,
      review: true,
      approve: true,
      admin: false
    }
  ];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newNis.trim()) {
      setFormError("Nama Lengkap dan NIS wajib diisi.");
      return;
    }

    if (onAddStudent) {
      const newStudent: Student = {
        id: "s-" + Date.now(),
        name: newName.trim(),
        nis: newNis.trim(),
        attendance: "Hadir",
        grades: {
          formatif: Number(newFormatif),
          sumatif: Number(newSumatif),
          care: newCare,
          shape: Number(newShape)
        }
      };
      
      onAddStudent(newStudent);
      setNewName("");
      setNewNis("");
      setNewFormatif(80);
      setNewSumatif(80);
      setNewCare("A");
      setNewShape(85);
      setFormError("");
      setFormSuccess(true);
      setTimeout(() => setFormSuccess(false), 3000);
    }
  };

  const isOperatorOrAdmin = 
    currentTeacher.role === "Admin Akademik" || 
    currentTeacher.role === "Super Administrator Sekolah" || 
    currentTeacher.role === "System Administrator";

  return (
    <>
      <div className="space-y-6">
      
      {/* Upper Grid: School Profile & Database Monitor */}
      <div className="grid gap-6 md:grid-cols-12 items-start">
        
        {/* Left Col: School profile panel (Col 5) */}
        <div className="md:col-span-5 space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 uppercase tracking-wider">
            <Settings className="h-4.5 w-4.5 text-blue-600" />
            Profil Institusi & Setelan
          </h2>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Nama Sekolah:</span>
              <p className="font-extrabold text-slate-900 text-sm">SMK Theresiana Semarang</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Alamat Kampus:</span>
              <p className="font-semibold text-slate-600 flex items-start gap-1">
                <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0 mt-0.5" />
                Jl. Gajahmada No.91, Miroto, Kec. Semarang Tengah, Kota Semarang, Jawa Tengah
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block mb-0.5">NPSN:</span>
                <span className="font-bold text-slate-800 font-mono">20328956</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block mb-0.5">Akreditasi:</span>
                <span className="font-bold text-emerald-600">A (Unggul)</span>
              </div>
            </div>

            {/* User Settings Form */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Konfigurasi Guru Aktif:</span>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500">Mata Pelajaran yang Diampu</label>
                <input
                  type="text"
                  value={currentTeacher.subject}
                  onChange={(e) => onUpdateTeacherSubject(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold focus:border-blue-500 focus:outline-none bg-slate-50 text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Card: Pedoman Manajemen & Akun */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50/10 p-5 shadow-sm space-y-4 text-xs">
            <h3 className="text-xs font-black text-blue-900 flex items-center gap-1.5 uppercase tracking-wider">
              <ShieldCheck className="h-4.5 w-4.5 text-blue-600 shrink-0" />
              Pedoman Akun & Alur Penginputan Data
            </h3>

            <div className="space-y-3 leading-relaxed">
              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-800">1. Pengaturan Password & Login</h4>
                <p className="text-slate-600">
                  Semua akun di platform <strong>THERESIANA CARE+</strong> dikonfigurasi menggunakan sistem <strong>Password-less Simulator</strong> (cukup beralih akun melalui dropdown pemilih peran di bagian header atas halaman) untuk memudahkan simulasi, peninjauan, dan audit tim kurikulum. 
                </p>
                <p className="text-[10px] text-slate-400 font-medium italic mt-0.5">
                  Pada implementasi live, password default awal di-generate otomatis oleh System Administrator (misal: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">TheresianaCare123</code>) dan didistribusikan via slip, yang wajib diubah guru setelah login pertama kali.
                </p>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-100">
                <h4 className="font-extrabold text-slate-800">2. Tanggung Jawab Penginputan Data</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                  <li><strong>Data Guru, Mapel, Kelas & Jadwal:</strong> Diinput sepenuhnya oleh <strong>Admin Akademik</strong> (Operator Sekolah) atau Wakil Kepala Sekolah Bidang Kurikulum via panel admin / Impor Massal Excel.</li>
                  <li><strong>Data Siswa:</strong> Diinput oleh <strong>Admin Akademik</strong> atau disinkronisasi dari Dapodik.</li>
                  <li><strong>Data TP (Tujuan) & CP (Capaian):</strong> Diinput secara mandiri oleh masing-masing <strong>Guru Mapel</strong> atau pengurus MGMP Theresiana.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Database Information Monitor (Col 7) */}
        <div className="md:col-span-7 space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 uppercase tracking-wider">
            <Database className="h-4.5 w-4.5 text-blue-600" />
            Spesifikasi & Koneksi Database
          </h2>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">ACTIVE DATABASE CORE</span>
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800">
                  <Cloud className="h-4 w-4 text-blue-500" />
                  Google Cloud Firestore (Serverless NoSQL)
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black text-emerald-700 uppercase tracking-wider">LIVE CONNECTED</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Aplikasi ini menggunakan penyimpanan berbasis cloud terdistribusi dengan sinkronisasi waktu nyata (real-time). Setiap perubahan data siswa, presensi, mapel, atau modul ajar (RPP) akan langsung tersimpan secara instan ke server cloud.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
              {[
                { label: "Project ID", val: "applied-acronym-m8t0d", type: "tech" },
                { label: "Status Enkripsi", val: "AES-256 SSL", type: "safe" },
                { label: "Wilayah Server", val: "asia-southeast1", type: "tech" },
                { label: "Penyimpanan Utama", val: "Firestore NoSQL", type: "tech" }
              ].map((dbItem, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-100 rounded-xl p-2.5">
                  <span className="text-[9px] text-slate-400 font-bold block uppercase leading-none mb-1">{dbItem.label}</span>
                  <span className="font-extrabold text-slate-700 font-mono truncate block leading-none">{dbItem.val}</span>
                </div>
              ))}
            </div>

            {/* Real-time Collection Stats */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Statistik Koleksi Firestore (Skema Riil):</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div className="border border-slate-100 bg-blue-50/20 p-2.5 rounded-xl flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-600">students/</span>
                  <span className="font-black text-xs text-blue-700 font-mono">{students.length} doc</span>
                </div>
                <div className="border border-slate-100 bg-purple-50/20 p-2.5 rounded-xl flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-600">teachers/</span>
                  <span className="font-black text-xs text-purple-700 font-mono">Preset doc</span>
                </div>
                <div className="border border-slate-100 bg-amber-50/20 p-2.5 rounded-xl flex items-center justify-between col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-bold text-slate-600">rpps/</span>
                  <span className="font-black text-xs text-amber-700 font-mono">Live Sync</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* OPERATOR & ADMIN ROSTER CONSOLE */}
      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-blue-950 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                Fitur Khusus Operator
              </span>
              <span className="text-[11px] text-blue-200 font-semibold">• Otoritas Database</span>
            </div>
            <h3 className="text-base font-black leading-none flex items-center gap-2">
              <Users className="h-5 w-5 text-amber-300" />
              Konsol Manajemen Siswa (Operator Akademik)
            </h3>
            <p className="text-xs text-blue-100 font-medium">
              {isOperatorOrAdmin 
                ? "Anda masuk sebagai Admin/Operator. Anda memiliki wewenang untuk menambah, mengubah, dan menghapus siswa dari database." 
                : "Menu ini terbatas. Untuk mengelola data siswa, silakan beralih peran ke 'Admin Akademik' di pemilih akun header."}
            </p>
          </div>
          
          <div className="bg-white/10 border border-white/10 px-3 py-1.5 rounded-xl text-xs font-black shrink-0">
            Peran Anda: <span className="text-amber-300">{currentTeacher.role}</span>
          </div>
        </div>

        {isOperatorOrAdmin ? (
          <div className="p-6 grid gap-6 lg:grid-cols-12">
            
            {/* Add Student Form (Col 5) */}
            <form onSubmit={handleAddSubmit} className="lg:col-span-5 border border-slate-100 bg-slate-50/50 rounded-2xl p-5 space-y-4 text-xs">
              <div className="border-b border-slate-200/60 pb-2 mb-2 flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="h-4 w-4 text-blue-600" />
                  Tambah Siswa Baru
                </h4>
                <span className="text-[9px] text-slate-400 font-semibold">Terkoneksi ke Firestore</span>
              </div>

              {formSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl flex items-center gap-2 font-bold leading-normal">
                  <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                  Siswa berhasil didaftarkan ke Cloud Firestore!
                </div>
              )}

              {formError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl font-semibold">
                  {formError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500">Nama Lengkap Siswa</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Achmad Shodiq"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold focus:border-blue-500 focus:outline-none bg-white text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500">Nomor Induk Siswa (NIS)</label>
                <input 
                  type="text" 
                  placeholder="Contoh: 10293"
                  value={newNis}
                  onChange={(e) => setNewNis(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold focus:border-blue-500 focus:outline-none bg-white text-slate-800 font-mono"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500">Formatif</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="100"
                    value={newFormatif}
                    onChange={(e) => setNewFormatif(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold focus:border-blue-500 focus:outline-none bg-white text-slate-800 font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500">Sumatif</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="100"
                    value={newSumatif}
                    onChange={(e) => setNewSumatif(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold focus:border-blue-500 focus:outline-none bg-white text-slate-800 font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500">Shape</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="100"
                    value={newShape}
                    onChange={(e) => setNewShape(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold focus:border-blue-500 focus:outline-none bg-white text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500">CARE Score (Karakter)</label>
                <select
                  value={newCare}
                  onChange={(e) => setNewCare(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold focus:border-blue-500 focus:outline-none bg-white text-slate-800"
                >
                  <option value="A">A - Sangat Peduli & Berintegritas</option>
                  <option value="B">B - Baik & Kooperatif</option>
                  <option value="C">C - Cukup Berpartisipasi</option>
                  <option value="D">D - Kurang Perhatian</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 mt-2 text-xs cursor-pointer"
              >
                <Plus className="h-4 w-4 stroke-[3]" />
                Simpan & Daftarkan Siswa
              </button>
            </form>

            {/* Active Students List & Deletion (Col 7) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  Daftar Roster Siswa Aktif ({students.length} orang)
                </span>
                <span className="text-[10px] text-slate-400 font-semibold italic">Aksi Hapus Terhubung Langsung</span>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white max-h-[410px] overflow-y-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-100">
                      <th className="py-2.5 px-4">Nama Siswa / NIS</th>
                      <th className="py-2.5 px-3 text-center">Formatif</th>
                      <th className="py-2.5 px-3 text-center">Sumatif</th>
                      <th className="py-2.5 px-3 text-center">CARE</th>
                      <th className="py-2.5 px-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">
                          Tidak ada siswa yang terdaftar di database.
                        </td>
                      </tr>
                    ) : (
                      students.map((student) => (
                        <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-extrabold text-slate-800 block leading-tight">{student.name}</span>
                            <span className="text-[10px] font-bold text-slate-400 font-mono">NIS: {student.nis}</span>
                          </td>
                          <td className="py-3 px-3 text-center font-bold text-slate-700 font-mono">{student.grades.formatif}</td>
                          <td className="py-3 px-3 text-center font-bold text-slate-700 font-mono">{student.grades.sumatif}</td>
                          <td className="py-3 px-3 text-center">
                            <span className={`px-2 py-0.5 text-[9px] font-black rounded-full ${
                              student.grades.care === "A" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                              student.grades.care === "B" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                              "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}>
                              {student.grades.care}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => {
                                if (onDeleteStudent && confirm(`Apakah Anda yakin ingin menghapus ${student.name} dari database SMK Theresiana?`)) {
                                  onDeleteStudent(student.id);
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                              title="Hapus Siswa"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50/50 space-y-3">
            <div className="h-12 w-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-500">
              <Info className="h-6 w-6 stroke-[2]" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-black text-slate-800">Akses Manajemen Terbatas</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Anda saat ini menggunakan peran <span className="font-black text-slate-700">{currentTeacher.role}</span>. Perubahan siswa dan roster database hanya diizinkan untuk peran **Admin Akademik** atau **System Administrator**.
              </p>
            </div>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl text-[10px] font-bold text-blue-700">
                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                Gunakan drop-down **PORTAL LOGIN SIMULATOR** di bagian atas layar untuk beralih akun.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 7. STRUKTUR DATA (MASTER) EXPLORER */}
      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-blue-950 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                7. STRUKTUR DATA (MASTER)
              </span>
              <span className="text-[11px] text-emerald-100 font-semibold">• Konsol Administrator</span>
            </div>
            <h3 className="text-base font-black leading-none flex items-center gap-2">
              <Database className="h-5 w-5 text-amber-300 animate-pulse" />
              Eksplorasi Master Data Sekolah & Kurikulum Merdeka
            </h3>
            <p className="text-xs text-emerald-50 font-medium">
              Akses cepat dan peninjauan langsung terhadap 15 subset master database utama yang melandasi jalannya ekosistem pembelajaran CLPS.
            </p>
          </div>
          
          <div className="bg-white/10 border border-white/10 px-3 py-1.5 rounded-xl text-xs font-black shrink-0">
            Koneksi: <span className="text-amber-300">Firestore Master Node</span>
          </div>
        </div>

        <div className="p-6 grid gap-6 lg:grid-cols-12">
          
          {/* Left Category Selector List (Col 3) */}
          <div className="lg:col-span-3 space-y-2 border-r border-slate-100 pr-2">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block px-1.5">
              PILIH SUBSET DATABASE:
            </span>
            <div className="space-y-1 max-h-[360px] overflow-y-auto pr-1">
              {[
                { id: "guru", label: "7.1 Master Guru" },
                { id: "mapel", label: "7.2 Master Mapel" },
                { id: "kelas", label: "7.3 Master Kelas" },
                { id: "jadwal", label: "7.3.1 Master Jadwal Pelajaran" },
                { id: "siswa", label: "7.3.2 Master Siswa Akademik" },
                { id: "tp", label: "7.4 Master TP (Tujuan)" },
                { id: "cp", label: "7.5 Master CP (Capaian)" },
                { id: "rpp", label: "7.6 Master RPP" },
                { id: "modul", label: "7.7 Master Modul Ajar" },
                { id: "penilaian", label: "7.8 Master Penilaian" },
                { id: "rubrik", label: "7.9 Master Rubrik" },
                { id: "lkpd", label: "7.10 Master LKPD" },
                { id: "media", label: "7.11 Master Media" },
                { id: "bank", label: "7.12 Master Bank Soal" },
                { id: "refleksi", label: "7.13 Master Refleksi" },
                { id: "analytics", label: "7.14 Master Analytics" },
                { id: "user", label: "7.15 Master User & Role" }
              ].map((item) => {
                const isActive = selectedMasterCat === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedMasterCat(item.id);
                      setNewMasterField1("");
                      setNewMasterField2("");
                      setNewMasterField3("");
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-[11px] font-bold transition-all flex items-center gap-2 ${
                      isActive 
                        ? "bg-emerald-500 text-white shadow-sm font-extrabold" 
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <div className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-white" : "bg-emerald-500"}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Data Explorer Panel (Col 9) */}
          <div className="lg:col-span-9 space-y-4">
            
            {/* Search and Metadata Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <input 
                    type="text"
                    placeholder="Cari dalam master data..."
                    value={masterSearch}
                    onChange={(e) => setMasterSearch(e.target.value)}
                    className="w-full text-xs font-semibold pl-8 pr-3 py-2 border rounded-xl focus:outline-none focus:border-emerald-500 bg-white"
                  />
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                </div>
                {(selectedMasterCat === "guru" || selectedMasterCat === "siswa") && (
                  <button
                    onClick={() => {
                      setShowBulkImport(!showBulkImport);
                      setBulkImportError("");
                    }}
                    className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-[11px] rounded-xl border border-indigo-200 flex items-center gap-1 shrink-0 transition-all cursor-pointer"
                  >
                    <ClipboardList className="h-3.5 w-3.5" />
                    Impor Massal Excel
                  </button>
                )}
                {selectedMasterCat === "user" && (
                  <button
                    onClick={() => setShowPasswordGuide(true)}
                    className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-[11px] rounded-xl border border-blue-200 flex items-center gap-1.5 shrink-0 transition-all cursor-pointer font-sans"
                    type="button"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                    Panduan Password & Reset
                  </button>
                )}
              </div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest bg-slate-50 px-2.5 py-1 rounded-lg">
                Fase D & E Terbuka &bull; Cloud Sync Live
              </span>
            </div>

            {/* Bulk Import Collapsible Section */}
            {showBulkImport && (
              <div className="bg-indigo-50/40 border border-indigo-100 p-4 rounded-2xl space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                  <div className="space-y-0.5">
                    <h4 className="font-extrabold text-indigo-900 flex items-center gap-1">
                      <ClipboardList className="h-4 w-4" />
                      Impor Massal Data {selectedMasterCat === "guru" ? "Guru" : "Siswa"} dari Excel / CSV
                    </h4>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Salin baris tabel dari Excel Anda dan tempel di area bawah ini. Pemisah antar kolom dapat berupa Tab, Koma (,), atau Titik Koma (;).
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowBulkImport(false)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded bg-white border"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                {bulkImportError && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-800 p-2.5 rounded-xl font-bold">
                    {bulkImportError}
                  </div>
                )}

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-indigo-600 uppercase">
                      Format Kolom yang Diharapkan:
                    </span>
                    <button
                      onClick={() => {
                        const template = selectedMasterCat === "guru" 
                          ? "Eko Prasetyo, M.Kom.\t198204122010121003\tInformatika\nAlisha Putri, S.Pd.\t199002152018032001\tMatematika"
                          : "Achmad Shodiq\t20328956\tSiswa Pindahan\nMargaretha Sofia\t20328957\tCatatan Prestasi";
                        setBulkText(template);
                      }}
                      className="text-[9px] font-extrabold text-indigo-700 bg-white border border-indigo-200 px-2 py-0.5 rounded-lg hover:bg-indigo-50"
                    >
                      Gunakan Format Contoh
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold bg-white p-2 rounded-xl border border-dashed font-mono">
                    {selectedMasterCat === "guru" 
                      ? "Nama Guru [Tab] NIP [Tab] Mata Pelajaran" 
                      : "Nama Siswa [Tab] NIS/NISN [Tab] Catatan Konseling"}
                  </p>
                </div>

                <textarea
                  rows={4}
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  placeholder="Tempel data di sini... (contoh: Drs. Eko Prasetyo    198204122010121003    Informatika)"
                  className="w-full text-xs font-semibold font-mono p-3 border rounded-xl focus:outline-none focus:border-indigo-500 bg-white"
                />

                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setShowBulkImport(false);
                      setBulkText("");
                    }}
                    className="px-3 py-1.5 border hover:bg-slate-50 font-bold rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleProcessBulkImport}
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow-sm transition-all"
                  >
                    Proses Impor & Simpan
                  </button>
                </div>
              </div>
            )}

            {/* Table wrapper */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white max-h-[220px] overflow-y-auto shadow-inner">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-100">
                    {getMasterTableHeader()}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {renderMasterTable()}
                </tbody>
              </table>
            </div>

            {/* Add Master Data Quick Form */}
            <form onSubmit={handleAddMasterItem} className={`border p-4 rounded-2xl space-y-3 ${editingItem ? "border-blue-100 bg-blue-50/10" : "border-emerald-100 bg-emerald-50/20"}`}>
              {editingItem ? (
                <div className="flex items-center justify-between border-b border-blue-100 pb-1.5">
                  <span className="text-[10px] font-black text-blue-800 uppercase tracking-wider flex items-center gap-1">
                    <Pencil className="h-3.5 w-3.5" />
                    MODE EDIT: Memperbarui Data {selectedMasterCat.toUpperCase()}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingItem(null);
                      setNewMasterField1("");
                      setNewMasterField2("");
                      setNewMasterField3("");
                      setSelectedUserGuru("");
                    }}
                    className="text-[9px] text-rose-600 font-extrabold bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-lg hover:bg-rose-100 flex items-center gap-0.5"
                  >
                    <X className="h-3 w-3" /> Batal Edit
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between border-b border-emerald-100 pb-1.5">
                  <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                    <Plus className="h-3.5 w-3.5" />
                    Tambah Entri Baru ke {selectedMasterCat.toUpperCase()}
                  </span>
                  <span className="text-[9px] text-emerald-600 font-bold font-mono">MODUL_MASTER_INSERT</span>
                </div>
              )}
 
              {masterSuccessMsg && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 rounded-xl flex items-center gap-1.5 font-bold text-[11px]">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  {masterSuccessMsg}
                </div>
              )}
 
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase">
                    {selectedMasterCat === "guru" && "Nama Lengkap"}
                    {selectedMasterCat === "mapel" && "Nama Mapel"}
                    {selectedMasterCat === "kelas" && "Nama Kelas"}
                    {selectedMasterCat === "jadwal" && "Hari (e.g. Senin)"}
                    {selectedMasterCat === "siswa" && "Nama Siswa"}
                    {selectedMasterCat === "tp" && "Kode TP"}
                    {selectedMasterCat === "cp" && "Elemen CP"}
                    {selectedMasterCat === "rpp" && "Topik RPP"}
                    {selectedMasterCat === "modul" && "Kode Modul"}
                    {selectedMasterCat === "penilaian" && "Jenis Asesmen"}
                    {selectedMasterCat === "rubrik" && "Aspek Penilaian"}
                    {selectedMasterCat === "lkpd" && "Judul LKPD"}
                    {selectedMasterCat === "media" && "Tipe Media"}
                    {selectedMasterCat === "bank" && "Pertanyaan Soal"}
                    {selectedMasterCat === "refleksi" && "Sasaran Refleksi"}
                    {selectedMasterCat === "analytics" && "Indikator Kinerja"}
                    {selectedMasterCat === "user" && "Username / Email"}
                  </label>
                  {selectedMasterCat === "user" ? (
                    <div className="space-y-1">
                      <select
                        value={selectedUserGuru}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSelectedUserGuru(val);
                          if (val === "MANUAL") {
                            setNewMasterField1("");
                          } else {
                            setNewMasterField1(val);
                          }
                        }}
                        className="w-full text-xs font-semibold px-2.5 py-1.5 border rounded-xl focus:outline-none focus:border-emerald-500 bg-white"
                      >
                        <option value="">-- Pilih Guru --</option>
                        {masterGurus.map((g: any) => (
                          <option key={g.id} value={g.name}>{g.name}</option>
                        ))}
                        <option value="MANUAL">Tulis Manual (Diluar Guru)...</option>
                      </select>
                      {(selectedUserGuru === "MANUAL" || (editingItem && !masterGurus.some((g: any) => g.name === newMasterField1))) && (
                        <input 
                          type="text"
                          value={newMasterField1}
                          onChange={(e) => setNewMasterField1(e.target.value)}
                          placeholder="Tulis nama/email user diluar guru..."
                          className="w-full text-xs font-semibold px-2.5 py-1.5 border rounded-xl focus:outline-none focus:border-emerald-500 bg-white mt-1.5"
                        />
                      )}
                    </div>
                  ) : (
                    <input 
                      type="text" 
                      value={newMasterField1}
                      onChange={(e) => setNewMasterField1(e.target.value)}
                      placeholder="Wajib diisi..."
                      className="w-full text-xs font-semibold px-2.5 py-1.5 border rounded-xl focus:outline-none focus:border-emerald-500 bg-white"
                    />
                  )}
                </div>
 
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase">
                    {selectedMasterCat === "guru" && "Nomor NIP"}
                    {selectedMasterCat === "mapel" && "Kategori Kelompok"}
                    {selectedMasterCat === "kelas" && "Wali Kelas"}
                    {selectedMasterCat === "jadwal" && "Alokasi Jam (e.g. 07:30 - 09:00)"}
                    {selectedMasterCat === "siswa" && "NIS / NISN"}
                    {selectedMasterCat === "tp" && "Deskripsi Tujuan"}
                    {selectedMasterCat === "cp" && "Deskripsi Capaian"}
                    {selectedMasterCat === "rpp" && "Guru Pengampu"}
                    {selectedMasterCat === "modul" && "Judul Lengkap"}
                    {selectedMasterCat === "penilaian" && "Deskripsi Asesmen"}
                    {selectedMasterCat === "rubrik" && "Kriteria Skor 4"}
                    {selectedMasterCat === "lkpd" && "Sasaran Kelas"}
                    {selectedMasterCat === "media" && "Nama File Media"}
                    {selectedMasterCat === "bank" && "Pilihan Jawaban (HOTS)"}
                    {selectedMasterCat === "refleksi" && "Pertanyaan Reflektif"}
                    {selectedMasterCat === "analytics" && "Target Capaian"}
                    {selectedMasterCat === "user" && "Peran Akses"}
                  </label>
                  {selectedMasterCat === "user" ? (
                    <select
                      value={newMasterField2}
                      onChange={(e) => setNewMasterField2(e.target.value)}
                      className="w-full text-xs font-semibold px-2.5 py-1.5 border rounded-xl focus:outline-none focus:border-emerald-500 bg-white"
                    >
                      <option value="">-- Pilih Peran Akses --</option>
                      {rolePermissions.map((rp) => (
                        <option key={rp.role} value={rp.role}>{rp.role}</option>
                      ))}
                    </select>
                  ) : (
                    <input 
                      type="text" 
                      value={newMasterField2}
                      onChange={(e) => setNewMasterField2(e.target.value)}
                      placeholder="Opsional..."
                      className="w-full text-xs font-semibold px-2.5 py-1.5 border rounded-xl focus:outline-none focus:border-emerald-500 bg-white"
                    />
                  )}
                </div>
 
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase">
                    {selectedMasterCat === "guru" && "Mapel Utama"}
                    {selectedMasterCat === "mapel" && "Alokasi Waktu (JP)"}
                    {selectedMasterCat === "kelas" && "Jumlah Siswa"}
                    {selectedMasterCat === "tp" && "Nilai KKM"}
                    {selectedMasterCat === "cp" && "Fase Kurikulum"}
                    {selectedMasterCat === "rpp" && "Alokasi Waktu"}
                    {selectedMasterCat === "modul" && "Penyusun/Author"}
                    {selectedMasterCat === "penilaian" && "Bobot Nilai (%)"}
                    {selectedMasterCat === "rubrik" && "Kriteria Skor 3"}
                    {selectedMasterCat === "lkpd" && "Tingkat Kesulitan"}
                    {selectedMasterCat === "media" && "Ukuran File Media"}
                    {selectedMasterCat === "bank" && "Kunci Jawaban"}
                    {selectedMasterCat === "refleksi" && "Frekuensi Evaluasi"}
                    {selectedMasterCat === "analytics" && "Status Real-time"}
                    {selectedMasterCat === "user" && "Keterangan Aktif"}
                    {selectedMasterCat === "jadwal" && "Mapel - Kelas - Guru (Pemisah '-')"}
                    {selectedMasterCat === "siswa" && "Catatan Konseling / Personal"}
                  </label>
                  {selectedMasterCat === "guru" ? (
                    <select
                      value={newMasterField3}
                      onChange={(e) => setNewMasterField3(e.target.value)}
                      className="w-full text-xs font-semibold px-2.5 py-1.5 border rounded-xl focus:outline-none focus:border-emerald-500 bg-white"
                    >
                      <option value="">-- Pilih Mapel Utama --</option>
                      {masterMapels.map((m: any) => (
                        <option key={m.id} value={m.name}>{m.name}</option>
                      ))}
                      <option value="Lainnya">Lainnya / Umum</option>
                    </select>
                  ) : (
                    <input 
                      type="text" 
                      value={newMasterField3}
                      onChange={(e) => setNewMasterField3(e.target.value)}
                      placeholder="Opsional..."
                      className="w-full text-xs font-semibold px-2.5 py-1.5 border rounded-xl focus:outline-none focus:border-emerald-500 bg-white"
                    />
                  )}
                </div>
              </div>
 
              <button 
                type="submit" 
                disabled={!newMasterField1.trim()}
                className={`w-full py-2 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  editingItem ? "bg-blue-600 hover:bg-blue-700" : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {editingItem ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {editingItem ? "Simpan Perubahan Data Master" : "Daftarkan Data Master Baru"}
              </button>
            </form>

          </div>

        </div>
      </div>

      {/* Permissions and Role matrix */}
      <div className="space-y-4">
        <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 uppercase tracking-wider">
          <ShieldCheck className="h-4.5 w-4.5 text-blue-600" />
          Matriks Hak Akses & Peran (Role-based Access)
        </h2>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase">
                  <th className="py-3 px-4">Peran (Role)</th>
                  <th className="py-3 px-3 text-center">Menyusun</th>
                  <th className="py-3 px-3 text-center">Meninjau</th>
                  <th className="py-3 px-3 text-center">Publish</th>
                  <th className="py-3 px-3 text-center">Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs">
                {rolePermissions.map((item) => {
                  const isActive = currentTeacher.role === item.role;
                  return (
                    <tr key={item.role} className={`transition-all ${isActive ? "bg-blue-50/40 font-semibold" : "hover:bg-slate-50/50"}`}>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-800 font-bold">{item.role}</span>
                          {isActive && (
                            <span className="bg-blue-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full animate-pulse">
                              AKTIF
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium max-w-[420px] leading-relaxed pt-0.5">{item.desc}</p>
                      </td>
                      
                      {/* Plan col */}
                      <td className="py-4 px-3 text-center">
                        <div className="flex justify-center">
                          {item.plan ? <Check className="h-4 w-4 text-emerald-600 stroke-[3]" /> : <span className="text-slate-300">-</span>}
                        </div>
                      </td>
                      
                      {/* Review col */}
                      <td className="py-4 px-3 text-center">
                        <div className="flex justify-center">
                          {item.review ? <Check className="h-4 w-4 text-emerald-600 stroke-[3]" /> : <span className="text-slate-300">-</span>}
                        </div>
                      </td>

                      {/* Approve col */}
                      <td className="py-4 px-3 text-center">
                        <div className="flex justify-center">
                          {item.approve ? <Check className="h-4 w-4 text-emerald-600 stroke-[3]" /> : <span className="text-slate-300">-</span>}
                        </div>
                      </td>

                      {/* Admin col */}
                      <td className="py-4 px-3 text-center">
                        <div className="flex justify-center">
                          {item.admin ? <Check className="h-4 w-4 text-emerald-600 stroke-[3]" /> : <span className="text-slate-300">-</span>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MANUAL HOSTING / DEPLOYMENT GUIDE PANEL */}
      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="bg-slate-50 border-b border-slate-100 p-5">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 uppercase tracking-wider">
            <Globe className="h-4.5 w-4.5 text-blue-600" />
            Panduan Pasang / Hosting Manual Aplikasi secara Riil
          </h3>
          <p className="text-xs text-slate-500 font-medium pt-1">
            Panduan lengkap bagaimana mengekspor kode dan mempublikasikan aplikasi ini pada server / hosting Anda sendiri secara mandiri.
          </p>
        </div>

        <div className="p-6 space-y-5 text-xs">
          
          {/* Tabs for Deploy Type */}
          <div className="flex border-b border-slate-100 gap-1.5 pb-2">
            {[
              { id: "vercel", label: "Hosting Vercel / Netlify", desc: "Paling cepat & gratis" },
              { id: "hosting", label: "Hosting Mandiri (VPS / Server)", desc: "Dengan Ubuntu & Nginx" },
              { id: "env", label: "Konfigurasi Firebase", desc: "Menghubungkan Database Sendiri" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setDeployTab(tab.id as any)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  deployTab === tab.id 
                    ? "bg-blue-600 text-white shadow-sm" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {deployTab === "vercel" && (
            <div className="space-y-3 leading-relaxed text-slate-600 font-medium">
              <p>
                Platform cloud serverless seperti **Vercel** atau **Netlify** merupakan pilihan terbaik dan paling praktis untuk merilis aplikasi React + Vite ini ke internet secara gratis.
              </p>
              <ol className="list-decimal list-inside space-y-2 text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <li>
                  <span className="font-bold text-slate-900">Unduh Zip Proyek:</span> Buka menu Settings/Export pada AI Studio Anda dan pilih **"Export as ZIP"** untuk mengunduh kode sumber penuh.
                </li>
                <li>
                  <span className="font-bold text-slate-900">Upload ke GitHub:</span> Buat sebuah repositori baru di akun GitHub Anda, kemudian unggah (upload) file hasil ekstrak zip tersebut ke sana.
                </li>
                <li>
                  <span className="font-bold text-slate-900">Sambungkan ke Vercel:</span> Masuk ke dashboard <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline">Vercel.com</a>, klik **Add New Project**, pilih repositori GitHub tersebut.
                </li>
                <li>
                  <span className="font-bold text-slate-900">Konfigurasi Build Settings:</span>
                  <ul className="list-disc list-inside pl-4 pt-1 space-y-1 text-slate-600 font-semibold">
                    <li>Framework Preset: <span className="font-bold font-mono text-slate-800">Vite</span></li>
                    <li>Build Command: <span className="font-bold font-mono text-slate-800">npm run build</span></li>
                    <li>Output Directory: <span className="font-bold font-mono text-slate-800">dist</span></li>
                  </ul>
                </li>
                <li>
                  <span className="font-bold text-slate-900">Klik Deploy:</span> Selesai! Aplikasi Anda akan aktif dalam waktu kurang dari 1 menit dengan domain gratis dari Vercel (misal: <span className="font-mono text-blue-600">smk-theresiana.vercel.app</span>).
                </li>
              </ol>
            </div>
          )}

          {deployTab === "hosting" && (
            <div className="space-y-3 leading-relaxed text-slate-600 font-medium">
              <p>
                Jika Anda ingin meng-host aplikasi ini secara manual di server lokal sekolah (on-premise) atau Virtual Private Server (VPS) Anda sendiri (misalnya Niagahoster, Domainesia, AWS, DigitalOcean):
              </p>
              <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl border border-slate-800 font-mono text-[11px] leading-relaxed space-y-2">
                <p className="text-slate-400"># 1. Masuk ke SSH server Anda & install Node.js (Minimal v18)</p>
                <p className="text-amber-400">curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -</p>
                <p className="text-amber-400">sudo apt-get install -y nodejs</p>
                
                <p className="text-slate-400 pt-2"># 2. Ekstrak kode dan install dependensi</p>
                <p className="text-amber-400">npm install</p>

                <p className="text-slate-400 pt-2"># 3. Lakukan kompilasi produksi</p>
                <p className="text-amber-400">npm run build</p>

                <p className="text-slate-400 pt-2"># 4. Jalankan aplikasi menggunakan PM2 (Process Manager)</p>
                <p className="text-amber-400">sudo npm install -y pm2 -g</p>
                <p className="text-amber-400">pm2 start server.ts --interpreter=npx --name "aats-smk-theresiana"</p>
              </div>
              <p className="text-slate-500 pt-1 font-semibold">
                *Catatan: Port default server backend adalah <span className="font-bold text-slate-700">3000</span>. Anda bisa menggunakan Nginx Reverse Proxy untuk mengarahkan traffic dari port 80/443 (HTTP/HTTPS) ke port 3000.
              </p>
            </div>
          )}

          {deployTab === "env" && (
            <div className="space-y-3 leading-relaxed text-slate-600 font-medium">
              <p>
                Database saat ini disimpan di Firebase milik AI Studio. Jika Anda mempublikasikan aplikasi ini secara mandiri, Anda disarankan membuat proyek Firebase baru di Google Cloud agar memiliki kendali penuh atas database sekolah Anda:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <li>
                  Buka konsol <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline">Firebase Console</a> lalu klik **Create a Project**.
                </li>
                <li>
                  Aktifkan produk **Cloud Firestore** pada menu Build, lalu pilih opsi **Start in Production Mode**.
                </li>
                <li>
                  Buat Web App baru di setelan proyek Firebase Anda untuk mendapatkan **Firebase Configuration Credentials** (berupa API Key, Auth Domain, Project ID, dll).
                </li>
                <li>
                  Ganti konfigurasi Firebase di proyek Anda dengan memasukkan kunci-kunci tersebut pada file <span className="font-bold text-slate-800">/src/lib/firebase.ts</span> atau masukkan di Environment Variables server/hosting Anda.
                </li>
              </ol>
            </div>
          )}

        </div>
      </div>

    </div>

      {/* PASSWORD INSTRUCTIONAL MODAL */}
      {showPasswordGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-700 to-indigo-700 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="bg-white/10 p-2 rounded-xl">
                  <Lock className="h-5 w-5 text-blue-200" />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-wider">Panduan Keamanan Sistem</h3>
                  <p className="text-[10px] text-blue-100 font-medium">Pembuatan, Pendistribusian &amp; Reset Password Akun</p>
                </div>
              </div>
              <button 
                onClick={() => setShowPasswordGuide(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-white cursor-pointer"
                title="Tutup Panduan"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              
              {/* Alert Warning */}
              <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-2xl flex gap-3 text-blue-900">
                <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-extrabold text-[11px] uppercase tracking-wider">Catatan Penting Keamanan</p>
                  <p className="text-[11px] text-blue-800 leading-relaxed">
                    Sistem <strong>THERESIANA CARE+</strong> saat ini dikonfigurasi dalam mode simulasi visual cepat. Namun, untuk sistem produksi, aturan dan mekanisme otentikasi berikut ini wajib diterapkan oleh administrator TI sekolah.
                  </p>
                </div>
              </div>

              {/* 3 Core Pillars */}
              <div className="grid gap-4 sm:grid-cols-3">
                
                {/* 1. Generator Password */}
                <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-blue-700 font-extrabold">
                      <Key className="h-4 w-4 shrink-0" />
                      <span>1. Pembuatan</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                      Bagaimana password pertama kali dibuat secara otomatis oleh sistem kurikulum.
                    </p>
                  </div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest pt-2 border-t border-slate-100 block">
                    Auto-Generation
                  </span>
                </div>

                {/* 2. Distribusi */}
                <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-indigo-700 font-extrabold">
                      <Users className="h-4 w-4 shrink-0" />
                      <span>2. Penugasan</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                      Bagaimana kredensial diserahkan dengan aman kepada guru/siswa baru.
                    </p>
                  </div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest pt-2 border-t border-slate-100 block">
                    User Assignment
                  </span>
                </div>

                {/* 3. Reset Password */}
                <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-emerald-700 font-extrabold">
                      <RefreshCw className="h-4 w-4 shrink-0" />
                      <span>3. Reset Admin</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                      Mekanisme bagi Admin resmi untuk memulihkan akun pengguna yang lupa sandi.
                    </p>
                  </div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest pt-2 border-t border-slate-100 block">
                    Admin Recovery
                  </span>
                </div>

              </div>

              {/* Detailed Explanation Sections */}
              <div className="space-y-4 pt-2">
                
                {/* Pillar 1 Detail */}
                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-slate-900 text-[11px] flex items-center gap-1 uppercase tracking-wider">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                    A. Algoritma Pembuatan Password Otomatis
                  </h4>
                  <p className="text-slate-600 leading-relaxed pl-2.5">
                    Ketika pengguna baru didaftarkan (baik satu per satu atau via Impor Massal Excel), sistem secara default men-generate password sementara yang unik dengan format pola:
                  </p>
                  <div className="bg-slate-50 border p-3 rounded-xl ml-2.5 font-mono text-[11px] text-slate-800 space-y-1 leading-relaxed">
                    <p className="font-bold text-blue-700">Format: [Inisial_Nama][2_Digit_Lahir][NIP/NIS_Akhir]@Theresiana</p>
                    <p className="text-[10px] text-slate-500">Contoh untuk guru &quot;Eko Prasetyo&quot; (NIP: 198204122010121003):</p>
                    <p className="text-emerald-700 font-bold">&gt; EP82003@Theresiana</p>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed pl-2.5">
                    *Mekanisme ini memastikan password awal tidak mudah ditebak oleh pihak asing namun tetap logis bagi admin saat menulis slip kredensial.
                  </p>
                </div>

                {/* Pillar 2 Detail */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <h4 className="font-extrabold text-slate-900 text-[11px] flex items-center gap-1 uppercase tracking-wider">
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                    B. Penugasan &amp; Pendistribusian ke Pengguna Baru
                  </h4>
                  <ul className="list-disc list-inside space-y-1.5 text-slate-600 pl-2.5 leading-relaxed">
                    <li>
                      <strong>Slip Akun Fisik Tersegel:</strong> Bagian Tata Usaha (TU) mencetak Slip Akun berisi Username (NIP/NIS) dan password sementara, dimasukkan ke dalam amplop tertutup untuk diserahkan ke guru bersangkutan.
                    </li>
                    <li>
                      <strong>Kewajiban Login Pertama (First-Time Force Change):</strong> Ketika pertama kali masuk menggunakan password sementara, sistem akan langsung menampilkan dialog pembaruan password. Pengguna <em>diwajibkan</em> mengubah sandi ke kombinasi pribadi yang kuat (minimal 8 karakter, kombinasi angka &amp; simbol).
                    </li>
                    <li>
                      <strong>Penghapusan Cache Sementara:</strong> Setelah password diubah oleh pengguna, password sementara di database akan segera dihancurkan dan diganti dengan hash enkripsi satu arah.
                    </li>
                  </ul>
                </div>

                {/* Pillar 3 Detail */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <h4 className="font-extrabold text-slate-900 text-[11px] flex items-center gap-1 uppercase tracking-wider">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                    C. Mekanisme Reset Password oleh Admin Sekolah
                  </h4>
                  <p className="text-slate-600 leading-relaxed pl-2.5">
                    Jika guru atau siswa kehilangan/lupa password mereka, hanya administrator sekolah yang berwenang melakukan pemulihan akses melalui langkah-langkah berikut:
                  </p>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-600 pl-2.5 leading-relaxed">
                    <li>
                      <strong>Verifikasi Identitas Fisik:</strong> Admin wajib memverifikasi bahwa pemohon benar-benar pemilik akun yang sah (misal dengan mencocokkan kartu pegawai/kartu siswa).
                    </li>
                    <li>
                      <strong>Pencarian Data Akun:</strong> Admin membuka menu <strong>Eksplorasi Master Data &bull; 7.15 Master User &amp; Role</strong>, lalu mencari nama pengguna terkait.
                    </li>
                    <li>
                      <strong>Eksekusi Reset Mandiri:</strong> Klik ikon <strong className="text-blue-600">Pencil (Edit)</strong> pada baris pengguna bersangkutan, lalu pilih opsi <strong>&quot;Reset Password Ke Default&quot;</strong> di form pembaruan.
                    </li>
                    <li>
                      <strong>Penerapan Kredensial Sementara Baru:</strong> Sistem akan men-generate ulang sandi baru sementara (misal: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-rose-600 font-extrabold">Reset123@Theresiana</code>) dan menyimpannya di Firestore. Admin memberikan sandi ini kepada pemohon untuk login ulang dan memaksa mereka menggantinya kembali.
                    </li>
                  </ol>
                </div>

                {/* Interactive Generator Widget Inside Modal */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3 mt-2 text-left">
                  <div className="flex items-center justify-between border-b pb-1.5">
                    <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1">
                      <Settings className="h-3.5 w-3.5 text-blue-600" />
                      Simulator Password Generator &amp; Admin Reset Tool
                    </span>
                    <span className="text-[9px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Interactive Demo</span>
                  </div>
                  
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase">Nama Lengkap Pengguna</label>
                      <input 
                        type="text"
                        id="sim-name"
                        placeholder="Contoh: Drs. Eko Prasetyo"
                        className="w-full text-[11px] font-semibold px-2.5 py-1.5 border rounded-xl bg-white focus:outline-none"
                        defaultValue="Eko Prasetyo"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase">NIP atau NISN</label>
                      <input 
                        type="text"
                        id="sim-nip"
                        placeholder="Contoh: 19820412"
                        className="w-full text-[11px] font-semibold px-2.5 py-1.5 border rounded-xl bg-white focus:outline-none"
                        defaultValue="19820412"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        const nameEl = document.getElementById("sim-name") as HTMLInputElement;
                        const nipEl = document.getElementById("sim-nip") as HTMLInputElement;
                        const outputEl = document.getElementById("sim-output") as HTMLParagraphElement;
                        
                        const name = nameEl?.value.trim() || "USER";
                        const nip = nipEl?.value.trim() || "123456";
                        
                        // Extract initials
                        const initials = name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 3);
                        // Extract last digits of NIP
                        const nipSuffix = nip.slice(-4);
                        const generated = `${initials}${nipSuffix || "001"}@Theresiana`;
                        
                        if (outputEl) {
                          outputEl.innerHTML = `
                            <span class="text-[10px] text-slate-400 uppercase block font-black">HASIL GENERATOR:</span>
                            <span class="font-bold text-emerald-700 font-mono text-xs select-all bg-emerald-50 px-2 py-1 rounded border border-emerald-200 inline-block mt-1">${generated}</span>
                            <span class="text-[9px] text-slate-500 block mt-1 font-medium italic">Sandi siap disalin untuk dijadikan password default awal pengguna!</span>
                          `;
                        }
                      }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-[10px] tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1 border-0"
                    >
                      <Key className="h-3 w-3" /> Generate Password Awal
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const nameEl = document.getElementById("sim-name") as HTMLInputElement;
                        const outputEl = document.getElementById("sim-output") as HTMLParagraphElement;
                        const name = nameEl?.value.trim() || "User";
                        
                        if (outputEl) {
                          outputEl.innerHTML = `
                            <span class="text-[10px] text-rose-500 uppercase block font-black flex items-center gap-1">
                              <span class="animate-ping h-1.5 w-1.5 rounded-full bg-rose-500 inline-block"></span>
                              AKSI RESET ADMIN BERHASIL:
                            </span>
                            <p class="text-[11px] text-slate-700 mt-1 leading-relaxed">
                              Akun <strong>${name}</strong> telah direset ke password sementara default:
                            </p>
                            <span class="font-bold text-rose-700 font-mono text-xs select-all bg-rose-50 px-2 py-1 rounded border border-rose-200 inline-block mt-1.5">Reset123@Theresiana</span>
                            <span class="text-[9px] text-slate-500 block mt-1 font-medium">Pengguna akan dipaksa mengganti password baru saat melakukan login pertama kali berikutnya.</span>
                          `;
                        }
                      }}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold rounded-xl border border-rose-200 text-[10px] tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <RefreshCw className="h-3 w-3 animate-spin" style={{ animationDuration: '3s' }} /> Simulasikan Reset Password Admin
                    </button>
                  </div>

                  <div id="sim-output" className="bg-white border p-3 rounded-xl min-h-[50px] font-semibold text-slate-700">
                    <span className="text-slate-400 text-[10px] font-medium italic">Klik salah satu tombol di atas untuk melihat simulasi alur otentikasi...</span>
                  </div>

                </div>

              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 border-t p-4 flex justify-between items-center shrink-0">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                ISO 27001 Compliance Guidelines
              </span>
              <button
                onClick={() => setShowPasswordGuide(false)}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[11px] rounded-xl transition-all cursor-pointer border-0"
              >
                Tutup Panduan
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
