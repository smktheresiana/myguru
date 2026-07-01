import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize GoogleGenAI safely
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
} else {
  console.warn("Peringatan: GEMINI_API_KEY tidak ditemukan di environment variable.");
}

app.use(express.json());

// API: Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", hasAi: !!ai });
});

// Helper for Gemini AI generation
async function queryGemini(prompt: string, systemInstruction?: string): Promise<string> {
  if (!ai) {
    throw new Error("Layanan AI belum dikonfigurasi. Silakan tambahkan GEMINI_API_KEY di panel Secrets.");
  }
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: systemInstruction ? { systemInstruction } : undefined,
    });
    return response.text || "Tidak ada respon dari AI.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Gagal menghubungi Gemini AI.");
  }
}

// API: Generate RPP (Modul Ajar)
app.post("/api/generate/rpp", async (req, res) => {
  const { mataPelajaran, kelas, fase, materi, jp, metode, model } = req.body;
  
  if (!mataPelajaran || !materi) {
    return res.status(400).json({ error: "Mata pelajaran dan materi harus diisi." });
  }

  const prompt = `Buatkan Rencana Pelaksanaan Pembelajaran (RPP) / Modul Ajar Kurikulum Merdeka yang lengkap, mendalam, dan terstruktur sesuai standar SMK.
Mata Pelajaran: ${mataPelajaran}
Kelas / Fase: Kelas ${kelas} / Fase ${fase}
Materi Pokok: ${materi}
Alokasi Waktu: ${jp} JP
Model Pembelajaran: ${model || "Project Based Learning (PjBL)"}
Metode: ${metode || "Diskusi, Praktik, Demonstrasi, Tanya Jawab"}

RPP harus memuat komponen-komponen berikut dalam format Markdown yang rapi:
1. IDENTITAS MODUL (Mata Pelajaran, Kelas/Semester, Alokasi Waktu, Elemen/Domain)
2. KOMPETENSI AWAL (Pengetahuan dasar siswa sebelum materi ini)
3. PROFIL PELAJAR PANCASILA (Pilih yang relevan, maks 3)
4. SARANA DAN PRASARANA (Alat, bahan, media pembelajaran)
5. TARGET PESERTA DIDIK & MODEL PEMBELAJARAN
6. TUJUAN PEMBELAJARAN (TP)
7. PEMAHAMAN BERMAKNA & PERTANYAAN PEMANTIK
8. KEGIATAN PEMBELAJARAN (Langkah rinci, menit per tahap):
   - Pendahuluan (Orientasi, Apersepsi, Motivasi, Ice Breaking)
   - Kegiatan Inti (Sintaks Model Pembelajaran yang dipilih secara rinci)
   - Penutup (Simpulan, Refleksi Siswa & Guru, Tindak Lanjut)
9. ASESMEN (Diagnostik, Formatif, Sumatif)
10. LEMBAR REFLEKSI GURU & SISWA`;

  const systemInstruction = "Anda adalah seorang pakar kurikulum pendidikan kejuruan (SMK) di Indonesia. Buat modul ajar yang praktis, kontekstual, siap pakai, dan berkualitas tinggi dengan bahasa Indonesia yang profesional dan komunikatif.";

  try {
    const content = await queryGemini(prompt, systemInstruction);
    res.json({ content });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// API: Generate LKPD (Lembar Kerja Peserta Didik)
app.post("/api/generate/lkpd", async (req, res) => {
  const { mataPelajaran, kelas, materi, rppContent } = req.body;

  if (!mataPelajaran || !materi) {
    return res.status(400).json({ error: "Mata pelajaran dan materi harus diisi." });
  }

  const prompt = `Buatkan Lembar Kerja Peserta Didik (LKPD) yang menarik, interaktif, dan menantang berdasarkan informasi berikut:
Mata Pelajaran: ${mataPelajaran}
Kelas: ${kelas}
Materi Pokok: ${materi}

${rppContent ? `Konteks RPP:\n${rppContent}\n` : ""}

LKPD harus berisi:
1. Judul Kegiatan yang Menarik
2. Petunjuk Belajar bagi Siswa
3. Kompetensi Dasar/Indikator Pencapaian
4. Teori/Materi Ringkas Penunjang
5. Alat dan Bahan (jika ada praktikum)
6. Langkah Kerja (Sistematis & Jelas)
7. Pertanyaan Diskusi/Latihan Analitis (3-5 soal HOTS - Higher Order Thinking Skills)
8. Lembar Penilaian Mandiri/Kelompok (Sederhana)`;

  const systemInstruction = "Anda adalah instruktur laboratorium dan pengajar kreatif SMK. Susun LKPD dalam format Markdown yang interaktif, mudah dipahami siswa, dan mendorong kemampuan berpikir kritis serta kolaborasi.";

  try {
    const content = await queryGemini(prompt, systemInstruction);
    res.json({ content });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// API: Generate Rubrik & Asesmen
app.post("/api/generate/rubrik", async (req, res) => {
  const { mataPelajaran, materi, tipeAsesmen, rppContent } = req.body;

  if (!mataPelajaran || !materi) {
    return res.status(400).json({ error: "Mata pelajaran dan materi harus diisi." });
  }

  const prompt = `Buatkan rubrik penilaian dan instrumen asesmen lengkap untuk:
Mata Pelajaran: ${mataPelajaran}
Materi: ${materi}
Tipe Asesmen yang Diinginkan: ${tipeAsesmen || "Formatif (Penilaian Kinerja)"}

${rppContent ? `Konteks RPP:\n${rppContent}\n` : ""}

Sajikan dalam format Markdown yang rapi dengan tabel rubrik yang mendefinisikan kriteria, aspek, dan rentang skor (Sangat Baik/4, Baik/3, Cukup/2, Perlu Bimbingan/1). Tambahkan juga contoh instrumen berupa soal (jika tes tertulis) atau lembar observasi (jika praktik/proyek).`;

  const systemInstruction = "Anda adalah ahli evaluasi pendidikan dan penjaminan mutu sekolah. Buat rubrik asesmen yang adil, objektif, dan terukur berdasarkan kriteria pembelajaran abad ke-21.";

  try {
    const content = await queryGemini(prompt, systemInstruction);
    res.json({ content });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// API: Generate AI Recommendations / Refleksi
app.post("/api/generate/rekomendasi", async (req, res) => {
  const { studentName, currentGrade, subject, notes, state } = req.body;

  const prompt = `Analisis dan buatkan rencana tindak lanjut ${state || "Remedial"} personal untuk siswa berikut:
Nama Siswa: ${studentName || "Siswa A"}
Nilai Terakhir: ${currentGrade || 65} / 100 (Kriteria Kelulusan Minimal: 75)
Mata Pelajaran: ${subject || "Informatika"}
Catatan Kinerja/Kelemahan: ${notes || "Kurang memahami konsep perulangan dan logika percabangan."}

Sediakan:
1. Diagnosis singkat akar masalah kesulitan belajar siswa
2. Materi khusus yang perlu didalami ulang
3. Strategi Pembelajaran Alternatif (misal peer tutoring, visual aid, dll)
4. Tugas/Latihan Mandiri yang disederhanakan namun tetap relevan
5. Soal Evaluasi remedial terfokus`;

  const systemInstruction = "Anda adalah guru BK (Bimbingan Konseling) dan guru mata pelajaran yang empatik dan suportif. Berikan rekomendasi bimbingan belajar personal yang memotivasi siswa.";

  try {
    const content = await queryGemini(prompt, systemInstruction);
    res.json({ content });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// API: General Chat / AI Assistant Panel
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Pesan tidak boleh kosong." });
  }

  const prompt = history && history.length > 0 
    ? `${history.map((h: any) => `${h.role === "user" ? "User" : "AI"}: ${h.text}`).join("\n")}\nUser: ${message}\nAI:`
    : message;

  const systemInstruction = "Anda adalah AATS AI Assistant, asisten cerdas yang berdedikasi membantu guru-guru di SMK Theresiana Semarang dalam menyusun materi, RPP, LKPD, memberikan rekomendasi kelas, memberikan ide ice breaking, dan menjawab berbagai kendala proses belajar mengajar. Berbahasalah secara sopan, penuh hormat, membantu, dan solutif.";

  try {
    const content = await queryGemini(prompt, systemInstruction);
    res.json({ content });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Setup Vite or production static files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  if (process.env.VERCEL !== "1") {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[AATS] Server berjalan di http://localhost:${PORT}`);
    });
  }
}

startServer();

export default app;
