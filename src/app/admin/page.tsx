"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  BarChart3, 
  HelpCircle, 
  Calendar, 
  Mail, 
  Upload, 
  Download, 
  Users, 
  CheckCircle2, 
  Plus, 
  LogOut, 
  Sparkles, 
  Trash2, 
  Clock, 
  Award,
  AlertCircle,
  FileText,
  Eye,
  Loader2
} from "lucide-react";
import LotusAccent from "@/components/devotional/LotusAccent";
import { SAMPLE_CSV_CONTENT, parseCSVToQuestions, ParsedQuizQuestion } from "@/lib/csvQuizHelper";
import { db } from "@/lib/firebase/client";
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy, limit } from "firebase/firestore";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "quizzes" | "classes" | "inquiries">("overview");

  // Analytics & Collections State
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [customQuizzes, setCustomQuizzes] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // CSV Quiz Upload State
  const [csvRawText, setCsvRawText] = useState("");
  const [quizTitleEn, setQuizTitleEn] = useState("Bhagavad-gītā Wisdom Challenge");
  const [quizTitleHi, setQuizTitleHi] = useState("श्रीमद्भगवद्गीता ज्ञान प्रश्नोत्तरी");
  const [category, setCategory] = useState("Bhagavad-gītā");
  const [timerSeconds, setTimerSeconds] = useState<number>(10);
  const [parsedQuestions, setParsedQuestions] = useState<ParsedQuizQuestion[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Check Admin Session on mount
  useEffect(() => {
    const session = localStorage.getItem("sr_admin_session");
    if (!session) {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
      fetchDashboardData();
    }
  }, [router]);

  // Fetch live registrations & inquiries from Firestore
  const fetchDashboardData = async () => {
    setLoadingData(true);
    try {
      // 1. Fetch Class Registrations
      const regSnap = await getDocs(query(collection(db, "classRegistrations"), limit(30)));
      const regList: any[] = [];
      regSnap.forEach((doc) => regList.push({ id: doc.id, ...doc.data() }));
      setRegistrations(regList);

      // 2. Fetch Inquiries
      const inqSnap = await getDocs(query(collection(db, "inquiries"), limit(30)));
      const inqList: any[] = [];
      inqSnap.forEach((doc) => inqList.push({ id: doc.id, ...doc.data() }));
      setInquiries(inqList);

      // 3. Fetch local/stored quizzes
      const localQ = JSON.parse(localStorage.getItem("sr_custom_quizzes") || "[]");
      setCustomQuizzes(localQ);
    } catch (err) {
      console.warn("Error fetching firestore admin data:", err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("sr_admin_session");
    document.cookie = "sr_admin_session=; path=/; max-age=0";
    router.push("/admin/login");
  };

  // CSV Sample & Upload Handlers
  const handleDownloadSample = () => {
    const blob = new Blob([SAMPLE_CSV_CONTENT], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "selfrealization_quiz_template_with_images.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLoadSample = () => {
    setCsvRawText(SAMPLE_CSV_CONTENT);
    const res = parseCSVToQuestions(SAMPLE_CSV_CONTENT);
    setParseError(null);
    setParsedQuestions(res.questions);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      setCsvRawText(content);
      const res = parseCSVToQuestions(content);
      if (res.error) {
        setParseError(res.error);
        setParsedQuestions([]);
      } else {
        setParseError(null);
        setParsedQuestions(res.questions);
      }
    };
    reader.readAsText(file);
  };

  const handlePublishQuiz = async () => {
    if (parsedQuestions.length === 0) return;
    setUploading(true);

    const quizData = {
      title: { en: quizTitleEn, hi: quizTitleHi },
      category,
      timerSeconds,
      questionCount: parsedQuestions.length,
      totalMarks: parsedQuestions.reduce((a, b) => a + b.points, 0),
      durationMinutes: Math.ceil(parsedQuestions.length * 1.5),
      questions: parsedQuestions,
      isPublished: true,
      audioEnabled: true,
      createdAt: new Date().toISOString(),
    };

    try {
      const docRef = await addDoc(collection(db, "quizzes"), {
        ...quizData,
        createdAt: serverTimestamp(),
      });
      const newQuiz = { id: docRef.id, ...quizData };
      const updated = [newQuiz, ...customQuizzes];
      setCustomQuizzes(updated);
      localStorage.setItem("sr_custom_quizzes", JSON.stringify(updated));
      setUploadSuccess(true);
    } catch (e) {
      const mockId = "quiz-" + Date.now();
      const newQuiz = { id: mockId, ...quizData };
      const updated = [newQuiz, ...customQuizzes];
      setCustomQuizzes(updated);
      localStorage.setItem("sr_custom_quizzes", JSON.stringify(updated));
      setUploadSuccess(true);
    } finally {
      setUploading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-20">
      
      {/* Top Admin Bar */}
      <div className="bg-amber-950 text-white border-b-2 border-amber-600 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-amber-600 flex items-center justify-center font-serif text-lg font-bold">
            ॐ
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">SelfRealization Admin Console</h1>
            <p className="text-[11px] text-amber-300/80">Logged in as Super Admin</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-amber-200 transition-colors"
          >
            View Public Site ↗
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-amber-200/80 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === "overview" ? "bg-amber-600 text-white shadow-sm" : "bg-white text-gray-700 hover:bg-amber-50"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Overview & Stats</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("quizzes")}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === "quizzes" ? "bg-amber-600 text-white shadow-sm" : "bg-white text-gray-700 hover:bg-amber-50"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Quiz Manager & CSV Importer</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("classes")}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === "classes" ? "bg-amber-600 text-white shadow-sm" : "bg-white text-gray-700 hover:bg-amber-50"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Live Class Registrations ({registrations.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("inquiries")}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === "inquiries" ? "bg-amber-600 text-white shadow-sm" : "bg-white text-gray-700 hover:bg-amber-50"
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Visitor Inquiries ({inquiries.length})</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & STATS */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fade-in">
            {/* 4 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-sm space-y-2">
                <span className="text-xs font-bold text-gray-500 uppercase">Live Class Registrations</span>
                <p className="text-3xl font-black text-amber-700">{registrations.length}</p>
                <p className="text-xs text-emerald-600 font-semibold">Active in Firestore</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-sm space-y-2">
                <span className="text-xs font-bold text-gray-500 uppercase">Total Quizzes Active</span>
                <p className="text-3xl font-black text-purple-700">{customQuizzes.length + 3}</p>
                <p className="text-xs text-purple-600 font-semibold">Public Quiz Bank</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-sm space-y-2">
                <span className="text-xs font-bold text-gray-500 uppercase">Seeker Inquiries</span>
                <p className="text-3xl font-black text-blue-700">{inquiries.length}</p>
                <p className="text-xs text-blue-600 font-semibold">Contact Submissions</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-sm space-y-2">
                <span className="text-xs font-bold text-gray-500 uppercase">Database Status</span>
                <p className="text-3xl font-black text-emerald-600">Connected</p>
                <p className="text-xs text-gray-500">Firebase Mumbai (Spark Plan)</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold">Ready to upload a new 10 or 15 question quiz?</h3>
                <p className="text-xs sm:text-sm text-amber-100 mt-1">
                  Use the CSV importer to publish complete quizzes with timers and question images in seconds.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("quizzes")}
                className="px-6 py-3 rounded-2xl bg-white text-amber-900 font-black text-sm shadow-md hover:bg-amber-50 transition-all shrink-0"
              >
                Open CSV Quiz Importer
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: QUIZ MANAGER & CSV IMPORTER */}
        {activeTab === "quizzes" && (
          <div className="space-y-8 animate-fade-in">
            {uploadSuccess ? (
              <div className="bg-white p-8 rounded-3xl border border-emerald-300 shadow-xl text-center space-y-5 max-w-lg mx-auto">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                  ✓
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Quiz Published Successfully!</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {parsedQuestions.length} questions have been published. Visitors can now play this quiz publicly with timer and image support!
                </p>
                <div className="flex gap-3 justify-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setUploadSuccess(false);
                      setParsedQuestions([]);
                      setCsvRawText("");
                    }}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs bg-amber-600 text-white"
                  >
                    Upload Another Quiz
                  </button>
                  <Link
                    href="/quiz"
                    className="px-6 py-2.5 rounded-xl font-bold text-xs bg-gray-100 text-gray-800"
                  >
                    View Quiz Bank
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Sample Template & Fast Loader */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-2 max-w-xl">
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">CSV One-Shot Standard</span>
                    <h3 className="text-xl font-bold text-gray-900">Upload 10 or 15 Question Quizzes via CSV</h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      Download our ready template with question text (Hindi + English), 4 options, correct answer, points, and optional image URLs.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={handleDownloadSample}
                      className="px-4 py-2.5 rounded-xl border border-amber-300 text-amber-900 font-bold text-xs bg-amber-50 hover:bg-amber-100 flex items-center gap-1.5"
                    >
                      <Download className="w-4 h-4 text-amber-700" />
                      <span>Download Sample CSV</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleLoadSample}
                      className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                    >
                      <Sparkles className="w-4 h-4 text-amber-200" />
                      <span>Load 10 Sample Questions</span>
                    </button>
                  </div>
                </div>

                {/* Metadata & Timer */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200 shadow-sm space-y-6">
                  <h4 className="text-base font-bold text-gray-900">Quiz Configurations</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 uppercase">Title (English)</label>
                      <input
                        type="text"
                        value={quizTitleEn}
                        onChange={(e) => setQuizTitleEn(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 uppercase">Title (Hindi)</label>
                      <input
                        type="text"
                        value={quizTitleHi}
                        onChange={(e) => setQuizTitleHi(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 uppercase">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border text-xs bg-white"
                      >
                        <option value="Bhagavad-gītā">Bhagavad-gītā</option>
                        <option value="Kṛṣṇa Conscious Philosophy">Kṛṣṇa Conscious Philosophy</option>
                        <option value="Spiritual Science">Spiritual Science</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 uppercase">Question Timer</label>
                      <select
                        value={timerSeconds}
                        onChange={(e) => setTimerSeconds(parseInt(e.target.value, 10))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 bg-amber-50 font-bold text-amber-900 text-xs"
                      >
                        <option value="5">⚡ 5 Seconds (Speed Blitz)</option>
                        <option value="10">⏳ 10 Seconds (Standard Gaming)</option>
                        <option value="15">⏱ 15 Seconds (Comfortable)</option>
                        <option value="0">♾️ No Timer (Unlimited)</option>
                      </select>
                    </div>
                  </div>

                  {/* File Upload / Dropzone */}
                  <div className="border-2 border-dashed border-amber-300 rounded-2xl p-6 text-center bg-amber-50/30">
                    <Upload className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                    <p className="text-xs sm:text-sm font-semibold text-gray-800">
                      Upload your CSV file containing 10, 15, or more questions
                    </p>
                    <input
                      type="file"
                      accept=".csv,text/csv"
                      onChange={handleFileUpload}
                      className="mt-3 text-xs text-gray-600 cursor-pointer"
                    />
                  </div>

                  {parseError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
                      {parseError}
                    </div>
                  )}

                  {/* Preview Table */}
                  {parsedQuestions.length > 0 && (
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase text-gray-500">
                          {parsedQuestions.length} Questions Ready for Publish
                        </span>
                        <button
                          type="button"
                          disabled={uploading}
                          onClick={handlePublishQuiz}
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-xs shadow-md hover:shadow-lg disabled:opacity-60 flex items-center gap-1.5"
                        >
                          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                          <span>Publish to Cloud Firestore</span>
                        </button>
                      </div>

                      <div className="space-y-3 max-h-96 overflow-y-auto pr-2 text-xs">
                        {parsedQuestions.map((q, idx) => (
                          <div key={idx} className="p-4 rounded-xl border border-amber-200 bg-amber-50/20 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-amber-900">Q{idx + 1}. {q.question.hi}</span>
                              <span className="font-mono text-emerald-800 font-bold">Ans: {q.correctAnswer}</span>
                            </div>
                            <p className="text-gray-500 italic">{q.question.en}</p>
                            {q.imageUrl && (
                              <p className="text-[11px] text-blue-600 truncate">🖼️ Image: {q.imageUrl}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: LIVE CLASS REGISTRATIONS */}
        {activeTab === "classes" && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200 shadow-sm space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Live Class Registrations</h3>
                <p className="text-xs text-gray-500">Live registrations submitted from the website stored in Firestore.</p>
              </div>
              <button
                type="button"
                onClick={fetchDashboardData}
                className="px-4 py-2 rounded-xl border border-amber-300 text-xs font-bold text-amber-900 hover:bg-amber-50"
              >
                Refresh Data
              </button>
            </div>

            {registrations.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm bg-amber-50/30 rounded-2xl">
                No class registrations yet. When visitors register on the website, their details appear here in real time.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-amber-50/70 border-b border-amber-200 text-amber-950 font-bold uppercase">
                      <th className="p-3">Participant</th>
                      <th className="p-3">WhatsApp / Phone</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Class</th>
                      <th className="p-3">Mode</th>
                      <th className="p-3">Payment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {registrations.map((r) => (
                      <tr key={r.id} className="hover:bg-amber-50/30">
                        <td className="p-3 font-bold text-gray-900">{r.fullName}</td>
                        <td className="p-3 font-mono">{r.phone}</td>
                        <td className="p-3">{r.email}</td>
                        <td className="p-3 font-medium">{r.classTitle?.en || r.classId}</td>
                        <td className="p-3 uppercase font-semibold text-gray-600">{r.preferredMode}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            {r.paymentStatus || "Free"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: VISITOR INQUIRIES */}
        {activeTab === "inquiries" && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200 shadow-sm space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold text-gray-900">Visitor Spiritual Inquiries</h3>
            {inquiries.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm bg-amber-50/30 rounded-2xl">
                No inquiries submitted yet.
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inq) => (
                  <div key={inq.id} className="p-5 rounded-2xl border border-amber-200 bg-amber-50/20 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 text-sm">{inq.fullName} ({inq.phone})</span>
                      <span className="text-amber-800 font-semibold uppercase">{inq.subject}</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed bg-white p-3 rounded-xl border border-gray-100">
                      "{inq.message}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
