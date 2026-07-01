/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  writeBatch
} from "firebase/firestore";
import { db } from "./firebase";
import { Student, Teacher, RPP, FileAttachment } from "../types";

// Collection references
const TEACHERS_COL = "teachers";
const STUDENTS_COL = "students";
const RPPS_COL = "rpps";
const FILES_COL = "files";

// Prepopulated Default Data for Seeding
const DEFAULT_TEACHER: Teacher = {
  id: "teacher-1",
  name: "Drs. Eko Prasetyo, M.Kom.",
  nip: "19820412 201012 1 003",
  role: "Guru Mapel",
  subject: "Informatika"
};

const DEFAULT_STUDENTS: Student[] = [
  { id: "s1", name: "Achmad Shodiq", nis: "10293", attendance: "Hadir", grades: { formatif: 85, sumatif: 78, care: "A", shape: 88 } },
  { id: "s2", name: "Alisha Putri", nis: "10294", attendance: "Hadir", grades: { formatif: 92, sumatif: 90, care: "A", shape: 94 } },
  { id: "s3", name: "Bimo Wicaksono", nis: "10295", attendance: "Hadir", grades: { formatif: 65, sumatif: 60, care: "B", shape: 70 } },
  { id: "s4", name: "Citra Lestari", nis: "10296", attendance: "Hadir", grades: { formatif: 80, sumatif: 82, care: "A", shape: 85 } },
  { id: "s5", name: "Deni Saputra", nis: "10297", attendance: "Sakit", grades: { formatif: 70, sumatif: 68, care: "C", shape: 64 } },
  { id: "s6", name: "Eka Rahmawati", nis: "10298", attendance: "Hadir", grades: { formatif: 95, sumatif: 96, care: "A", shape: 98 } }
];

const DEFAULT_RPPS: RPP[] = [
  {
    id: "rpp-default",
    mataPelajaran: "Informatika",
    kelas: "X",
    fase: "E",
    materi: "Berpikir Komputasional - Pencarian (Searching)",
    jp: 2,
    metode: "Diskusi kelompok, Simulasi Kartu, Praktik Mandiri",
    model: "Problem Based Learning (PBL)",
    content: `# MODUL AJAR INFORMATIKA
## A. IDENTITAS MODUL
* **Mata Pelajaran:** Informatika
* **Kelas / Fase:** X / E
* **Elemen:** Berpikir Komputasional
* **Alokasi Waktu:** 2 JP (2 x 45 Menit)

## B. KOMPETENSI AWAL
Siswa telah memahami konsep algoritma sederhana dan pemecahan masalah dasar dalam kehidupan sehari-hari.

## C. PROFIL PELAJAR PANCASILA
* Mandiri
* Bernalar Kritis
* Kreatif

## D. TUJUAN PEMBELAJARAN (TP)
1. Peserta didik mampu menjelaskan konsep pencarian (searching) dengan tepat.
2. Peserta didik mampu membedakan algoritma Linear Search dan Binary Search secara runtut.
3. Peserta didik mampu memecahkan kasus pencarian data dalam kehidupan nyata.

## E. LANGKAH PEMBELAJARAN
### 1. Pendahuluan (10 Menit)
* Orientasi kelas, doa pembuka, absensi.
* **Apersepsi:** Menanyakan siswa tentang cara mencari nomor kontak di HP.
* **Motivasi:** Menjelaskan pentingnya kecepatan algoritma pencarian di era Big Data.

### 2. Kegiatan Inti (70 Menit)
* **Orientasi Masalah:** Guru memberikan tumpukan kartu acak kepada siswa dan meminta mereka mencari angka tertentu.
* **Organisasi Belajar:** Siswa berkelompok membandingkan pencarian berurutan dengan membelah dua tumpukan (Binary Search).
* **Penyelidikan Mandiri:** Siswa mengisi LKPD yang disediakan.

### 3. Penutup (10 Menit)
* Guru dan siswa merefleksikan hasil pembelajaran.
* Guru memberikan tugas remedial bagi siswa di bawah KKM 75.`,
    lkpdContent: `# LEMBAR KERJA PESERTA DIDIK (LKPD)
### Judul Kegiatan: Eksplorasi Algoritma Searching
**Mata Pelajaran:** Informatika  
**Kelas:** X  
**Alokasi Waktu:** 30 Menit  

---

#### A. PETUNJUK BELAJAR
1. Selesaikan LKPD ini secara berkelompok (3-4 orang).
2. Gunakan tumpukan kartu angka yang disediakan guru sebagai alat bantu visual.

#### B. LANGKAH KERJA
1. Atur 10 kartu angka secara berurutan: **12, 18, 24, 30, 36, 42, 48, 54, 60, 66**.
2. Cari kartu berangka **48** menggunakan metode **Linear Search** (dari ujung kiri satu per satu). Catat berapa kali perbandingan dilakukan.
3. Cari angka yang sama menggunakan metode **Binary Search** (pilih nilai tengah, buang bagian yang tidak mungkin). Catat berapa kali perbandingan dilakukan.

#### C. PERTANYAAN DISKUSI (HOTS)
1. Metode pencarian manakah yang lebih cepat jika data sudah dalam keadaan terurut rapi? Mengapa?
2. Jika data acak dan tidak terurut, apakah kita bisa menggunakan Binary Search langsung? Jelaskan alasannya!`,
    rubrikContent: `# RUBRIK PENILAIAN & ASESMEN FORMATIF
### Elemen: Berpikir Komputasional - Searching

| Aspek Penilaian | Sangat Baik (Skor 4) | Baik (Skor 3) | Cukup (Skor 2) | Perlu Bimbingan (Skor 1) |
| :--- | :--- | :--- | :--- | :--- |
| **Pemahaman Teori** | Mampu menjelaskan perbedaan Linear & Binary Search secara komprehensif. | Mampu membedakan dengan benar namun penjelasannya kurang lengkap. | Mengerti konsep dasar namun tertukar dalam beberapa langkah logis. | Belum memahami perbedaan kedua metode pencarian. |
| **Keterampilan Praktik** | Mampu melakukan simulasi pencarian dengan kartu tanpa kesalahan langkah. | Melakukan simulasi dengan benar tetapi membutuhkan bimbingan kecil. | Melakukan simulasi dengan bantuan intensif dari guru. | Belum mampu melakukan simulasi mandiri. |
| **Kolaborasi Kelompok** | Sangat aktif memimpin diskusi kelompok dan bertanggung jawab. | Berpartisipasi aktif dalam pengerjaan tugas kelompok. | Kurang berpartisipasi dan cenderung pasif dalam kelompok. | Menyerahkan seluruh pekerjaan kepada teman sekelompok. |`,
    createdAt: "15/06/2026",
    status: "Published"
  }
];

const DEFAULT_FILES: FileAttachment[] = [
  { id: "f-ppt", name: "Slide_Presentasi_Searching.pptx", type: "PPT", size: "3.4 MB", createdAt: "15/06/2026", rppId: "rpp-default", content: "Slide presentasi interaktif mencakup skema visual Binary Search dengan pohon pencarian biner." },
  { id: "f-lkpd", name: "LKPD_Pertemuan_3_Informatika.pdf", type: "LKPD", size: "480 KB", createdAt: "15/06/2026", rppId: "rpp-default", content: "Lembar Kerja Siswa interaktif berisi 3 studi kasus nyata pencarian data barang inventaris." },
  { id: "f-mind", name: "Mindmap_Alur_Berpikir_Komputasional.png", type: "Mindmap", size: "1.2 MB", createdAt: "14/06/2026", rppId: "rpp-default", content: "Infografis peta konsep visual yang memetakan korelasi antara dekomposisi, pengenalan pola, abstraksi, dan algoritma." }
];

/**
 * Sync / Seed database if empty
 */
export async function seedDatabaseIfEmpty() {
  try {
    const teachersSnap = await getDocs(collection(db, TEACHERS_COL));
    if (teachersSnap.empty) {
      console.log("[Firebase] Seeding default teacher...");
      await setDoc(doc(db, TEACHERS_COL, DEFAULT_TEACHER.id), DEFAULT_TEACHER);
    }

    const studentsSnap = await getDocs(collection(db, STUDENTS_COL));
    if (studentsSnap.empty) {
      console.log("[Firebase] Seeding default students...");
      const batch = writeBatch(db);
      DEFAULT_STUDENTS.forEach(student => {
        batch.set(doc(db, STUDENTS_COL, student.id), student);
      });
      await batch.commit();
    }

    const rppsSnap = await getDocs(collection(db, RPPS_COL));
    if (rppsSnap.empty) {
      console.log("[Firebase] Seeding default RPPs...");
      const batch = writeBatch(db);
      DEFAULT_RPPS.forEach(rpp => {
        batch.set(doc(db, RPPS_COL, rpp.id), rpp);
      });
      await batch.commit();
    }

    const filesSnap = await getDocs(collection(db, FILES_COL));
    if (filesSnap.empty) {
      console.log("[Firebase] Seeding default files...");
      const batch = writeBatch(db);
      DEFAULT_FILES.forEach(file => {
        batch.set(doc(db, FILES_COL, file.id), file);
      });
      await batch.commit();
    }
    console.log("[Firebase] Database initialization checks completed successfully.");
  } catch (err) {
    console.error("[Firebase] Error during database seeding:", err);
  }
}

/**
 * Teacher operations
 */
export async function getTeacher(): Promise<Teacher> {
  const snap = await getDocs(collection(db, TEACHERS_COL));
  if (snap.empty) {
    return DEFAULT_TEACHER;
  }
  return snap.docs[0].data() as Teacher;
}

export async function saveTeacher(teacher: Teacher): Promise<void> {
  await setDoc(doc(db, TEACHERS_COL, teacher.id), teacher);
}

/**
 * Student operations
 */
export async function getStudents(): Promise<Student[]> {
  const snap = await getDocs(collection(db, STUDENTS_COL));
  if (snap.empty) {
    return DEFAULT_STUDENTS;
  }
  return snap.docs.map(doc => doc.data() as Student);
}

export async function saveStudent(student: Student): Promise<void> {
  await setDoc(doc(db, STUDENTS_COL, student.id), student);
}

export async function deleteStudent(id: string): Promise<void> {
  await deleteDoc(doc(db, STUDENTS_COL, id));
}

export async function saveStudentsBatch(studentsList: Student[]): Promise<void> {
  const batch = writeBatch(db);
  studentsList.forEach(student => {
    batch.set(doc(db, STUDENTS_COL, student.id), student);
  });
  await batch.commit();
}

/**
 * RPP Modul Ajar operations
 */
export async function getRPPs(): Promise<RPP[]> {
  const snap = await getDocs(collection(db, RPPS_COL));
  if (snap.empty) {
    return DEFAULT_RPPS;
  }
  // Sort by createdAt or maintain list
  return snap.docs.map(doc => doc.data() as RPP);
}

export async function saveRPP(rpp: RPP): Promise<void> {
  await setDoc(doc(db, RPPS_COL, rpp.id), rpp);
}

export async function deleteRPP(id: string): Promise<void> {
  await deleteDoc(doc(db, RPPS_COL, id));
}

/**
 * File attachment operations
 */
export async function getFiles(): Promise<FileAttachment[]> {
  const snap = await getDocs(collection(db, FILES_COL));
  if (snap.empty) {
    return DEFAULT_FILES;
  }
  return snap.docs.map(doc => doc.data() as FileAttachment);
}

export async function saveFile(file: FileAttachment): Promise<void> {
  await setDoc(doc(db, FILES_COL, file.id), file);
}

export async function deleteFile(id: string): Promise<void> {
  await deleteDoc(doc(db, FILES_COL, id));
}
