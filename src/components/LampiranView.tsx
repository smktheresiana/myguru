/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  FolderOpen, 
  Search, 
  Filter, 
  Eye, 
  Download, 
  MoreHorizontal, 
  FileText, 
  Plus, 
  Bell,
  Trash2,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { FileAttachment } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface LampiranViewProps {
  files: FileAttachment[];
  onUploadFile: (file: FileAttachment) => void;
  onDeleteFile: (id: string) => void;
}

export default function LampiranView({ files: defaultFiles, onUploadFile, onDeleteFile }: LampiranViewProps) {
  
  // Local list matching mockup Section 4
  const [activeMenu, setActiveMenu] = useState("lkpd");
  const [searchTerm, setSearchTerm] = useState("");

  const [files, setFiles] = useState([
    { id: "lf1", name: "LKPD_Individu_P3.pdf", type: "PDF", size: "1.2 MB" },
    { id: "lf2", name: "LKPD_Kelompok_P3.pdf", type: "PDF", size: "1.5 MB" },
    { id: "lf3", name: "Kunci_Jawaban_P3.pdf", type: "PDF", size: "850 KB" },
    { id: "lf4", name: "Rubrik_LKPD_P3.pdf", type: "PDF", size: "620 KB" }
  ]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredFiles = files.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNewFileMock = () => {
    const name = prompt("Masukkan Nama File Baru:", "LKPD_Materi_Baru_P3.pdf");
    if (!name) return;
    const newF = {
      id: "lf-" + Date.now(),
      name,
      type: "PDF",
      size: "450 KB"
    };
    setFiles(prev => [newF, ...prev]);
  };

  const handleDeleteLocal = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="bg-[#f8fafc] rounded-3xl border border-slate-200/60 shadow-xl overflow-hidden">
      
      {/* SECTION HEADER BAR */}
      <div className="bg-orange-500 px-6 py-4 flex items-center justify-between border-b border-orange-600/50">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-full bg-white text-orange-500 flex items-center justify-center font-extrabold text-sm shadow-sm">
            4
          </div>
          <div>
            <span className="text-white font-extrabold text-sm uppercase tracking-wider block">LAMPIRAN (REPOSITORY)</span>
            <span className="text-orange-100 text-[10px] font-medium block">Pusat Penyimpanan Berkas & Lembar Kerja Siswa Terintegrasi</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleAddNewFileMock}
            className="text-[10px] font-bold px-3 py-1 rounded-xl bg-white text-orange-600 border border-white/10 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <Plus className="h-3 w-3" />
            Upload File
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 min-h-[580px]">
        
        {/* LOCAL SIDEBAR (Orange / Charcoal Theme) */}
        <div className="xl:col-span-3 bg-slate-900 text-slate-300 p-4 flex flex-col justify-between border-r border-slate-800">
          <div className="space-y-4">
            <div className="px-3 pb-2 border-b border-slate-800 flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-orange-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">REPOSITORY FILES</span>
            </div>

            <nav className="space-y-1">
              {[
                { id: "lkpd", label: "LKPD", active: true },
                { id: "ppt", label: "PPT", active: false },
                { id: "bahan_ajar", label: "Bahan Ajar", active: false },
                { id: "video", label: "Video", active: false },
                { id: "mind_map", label: "Mind Map", active: false },
                { id: "infografis", label: "Infografis", active: false },
                { id: "rubrik", label: "Rubrik", active: false },
                { id: "asesmen", label: "Asesmen", active: false },
                { id: "bank_soal", label: "Bank Soal", active: false },
                { id: "media", label: "Media", active: false },
                { id: "referensi", label: "Referensi", active: false },
                { id: "semua_file", label: "Semua File", active: false }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => alert(`Kategori Lampiran difilter ke: ${item.label}`)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left ${
                    item.id === activeMenu
                      ? "bg-orange-500 text-white shadow-md shadow-orange-900/10 font-bold"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                  }`}
                >
                  <div className={`h-1.5 w-1.5 rounded-full ${item.id === activeMenu ? "bg-white" : "bg-slate-700"}`} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-800 mt-6 space-y-1">
            <span className="text-[9px] text-orange-400 font-bold uppercase block">Kapasitas Sisa</span>
            <p className="text-[10px] text-slate-400 leading-normal">9.2 GB sisa dari 10 GB kuota SMK Theresiana.</p>
          </div>
        </div>

        {/* WORKSPACE AREA (Right) */}
        <div className="xl:col-span-9 p-6 flex flex-col bg-white justify-between">
          
          <div className="space-y-6">
            {/* Header Panel (Title and Actions) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h1 className="text-lg font-bold text-slate-900">LKPD Pertemuan 3</h1>
                <p className="text-xs text-slate-400 font-semibold pt-0.5">Daftar lampiran lembar kerja siswa untuk menunjang sintaks PBL kelas VII A.</p>
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

            {/* ACTION SEARCH BAR ROW (Exactly like mockup Section 4) */}
            <div className="flex gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/50">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Cari lampiran..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-1.5 text-xs font-semibold focus:outline-none focus:border-orange-500 placeholder-slate-400 shadow-sm"
                />
              </div>
              
              <button 
                onClick={() => alert("Menampilkan setelan penyaringan berkas...")}
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-4 py-1.5 rounded-xl transition-all flex items-center gap-2 shadow-sm"
              >
                <Filter className="h-3.5 w-3.5 text-slate-400" />
                Filter
              </button>
            </div>

            {/* HIGH FIDELITY TABLE WORKSPACE (Exactly matching table rows/columns in mockup Section 4) */}
            <div className="border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-5">Nama File</th>
                    <th className="py-3.5 px-4">Tipe</th>
                    <th className="py-3.5 px-4">Ukuran</th>
                    <th className="py-3.5 px-5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-semibold">
                  {filteredFiles.map((file) => (
                    <tr key={file.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-5 flex items-center gap-2.5">
                        <FileText className="h-4.5 w-4.5 text-orange-500 shrink-0" />
                        <span className="font-bold text-slate-800 truncate max-w-[200px] sm:max-w-xs">{file.name}</span>
                      </td>
                      <td className="py-4 px-4 text-slate-500 font-mono text-[10px] font-bold">{file.type}</td>
                      <td className="py-4 px-4 text-slate-500">{file.size}</td>
                      <td className="py-4 px-5 text-right space-x-1">
                        <button 
                          onClick={() => alert(`Membuka berkas: ${file.name}`)}
                          className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg transition-colors"
                          title="View file"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => alert(`Mengunduh berkas: ${file.name}`)}
                          className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg transition-colors"
                          title="Download file"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteLocal(file.id)}
                          className="p-1.5 hover:bg-red-50 text-red-500 hover:text-red-700 rounded-lg transition-colors"
                          title="Delete file"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredFiles.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400">
                        Tidak ada berkas ditemukan untuk pencarian "{searchTerm}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-[11px] text-slate-500 leading-relaxed font-semibold italic flex items-center gap-2 mt-6">
            <span className="h-2 w-2 rounded-full bg-orange-500 shrink-0" />
            <span>Dokumen di atas sinkron secara otomatis dengan Smart TV Kelas VII A dan Tablet murid.</span>
          </div>

        </div>

      </div>

    </div>
  );
}
