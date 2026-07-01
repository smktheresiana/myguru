/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Student {
  id: string;
  name: string;
  nis: string;
  attendance: "Hadir" | "Sakit" | "Izin" | "Alfa";
  grades: {
    formatif: number;
    sumatif: number;
    care: string; // A, B, C, D
    shape: number; // 0-100
  };
  personalNotes?: string;
}

export interface Teacher {
  id: string;
  name: string;
  nip: string;
  role: "System Administrator" | "Super Administrator Sekolah" | "Admin Akademik" | "Wakil Kepala Sekolah Bidang Kurikulum" | "Kaprog / MGMP" | "Guru Mapel" | "Kepala Sekolah";
  subject: string;
}

export interface RPP {
  id: string;
  mataPelajaran: string;
  kelas: string;
  fase: string;
  materi: string;
  jp: number;
  metode: string;
  model: string;
  content: string;
  lkpdContent?: string;
  rubrikContent?: string;
  createdAt: string;
  status: "Draft" | "Review" | "Published";
}

export interface TeachingSession {
  id: string;
  rppId: string;
  currentStep: "Pendahuluan" | "Kegiatan Inti" | "Penutup" | "Refleksi";
  timerSeconds: number;
  isTimerRunning: boolean;
  notes: string;
  attendanceChecked: boolean;
}

export interface FileAttachment {
  id: string;
  name: string;
  type: "PDF" | "PPT" | "Video" | "LKPD" | "Rubrik" | "Mindmap" | "Infografis";
  size: string;
  createdAt: string;
  rppId?: string;
  content?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}
