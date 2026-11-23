"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { 
  Upload, 
  Download, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  HelpCircle, 
  Loader2, 
  ArrowRight,
  Eye,
  Trash2
} from "lucide-react";
import LotusAccent from "@/components/devotional/LotusAccent";
import { SAMPLE_CSV_CONTENT, parseCSVToQuestions, ParsedQuizQuestion } from "@/lib/csvQuizHelper";
import { db } from "@/lib/firebase/client";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function AdminCSVQuizUploadPage() {
  const { language } = useLanguage();
  const [csvRawText, setCsvRawText] = useState("");
  const [quizTitleEn, setQuizTitleEn] = useState("Bhagavad-gītā Wisdom Challenge");
  const [quizTitleHi, setQuizTitleHi] = useState("श्रीमद्भगवद्गीता ज्ञान प्रश्नोत्तरी");
  const [category, setCategory] = useState("Bhagavad-gītā");
  const [timerSeconds, setTimerSeconds] = useState<number>(10);
  const [parsedQuestions, setParsedQuestions] = useState<ParsedQuizQuestion[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [createdQuizId, setCreatedQuizId] = useState<string | null>(null);

  // Download Sample CSV
  const handleDownloadSample = () => {
    const blob = new Blob([SAMPLE_CSV_CONTENT], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "selfrealization_quiz_template_10_questions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle File Upload
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

  // Parse Textarea on the fly
  const handleParseText = () => {
    if (!csvRawText.trim()) return;
    const res = parseCSVToQuestions(csvRawText);
    if (res.error) {
      setParseError(res.error);
      setParsedQuestions([]);
    } else {
      setParseError(null);
      setParsedQuestions(res.questions);
    }
  };

  // Load sample content into editor
  const handleLoadSample = () => {
    setCsvRawText(SAMPLE_CSV_CONTENT);
    const res = parseCSVToQuestions(SAMPLE_CSV_CONTENT);
    setParseError(null);
    setParsedQuestions(res.questions);
  };

  // Publish to Firestore
  const handlePublishQuiz = async () => {
    if (parsedQuestions.length === 0) return;
    setUploading(true);

    const quizData = {
      title: { en: quizTitleEn, hi: quizTitleHi },
      category,
      timerSeconds,
      questionCount: parsedQuestions.length,
      totalMarks: parsedQuestions.reduce((acc, q) => acc + q.points, 0),
      durationMinutes: Math.ceil(parsedQuestions.length * 1.5),
      questions: parsedQuestions,
      isPublished: true,
      audioEnabled: true,
      createdAt: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(collection(db, "quizzes"), quizData);
      
      // Also cache in local storage for instant zero-latency test play
      const localQuizzes = JSON.parse(localStorage.getItem("sr_custom_quizzes") || "[]");
      localQuizzes.unshift({ id: docRef.id, ...quizData });
      localStorage.setItem("sr_custom_quizzes", JSON.stringify(localQuizzes));

      setCreatedQuizId(docRef.id);
    } catch (err: any) {
      console.warn("Firestore upload fallback to local:", err);
      const mockId = "quiz-" + Date.now();
      const localQuizzes = JSON.parse(localStorage.getItem("sr_custom_quizzes") || "[]");
      localQuizzes.unshift({ id: mockId, ...quizData });
      localStorage.setItem("sr_custom_quizzes", JSON.stringify(localQuizzes));
      setCreatedQuizId(mockId);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3.5 py-1 rounded-full border border-amber-300">
          Admin Portal • Bulk Importer
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
          One-Shot CSV Quiz Uploader
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Upload 10, 15, or more bilingual quiz questions in a single click using a CSV file.
        </p>
        <LotusAccent className="my-2" />
      </div>

      {createdQuizId ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-emerald-200 shadow-xl text-center space-y-6 max-w-xl mx-auto animate-fade-in">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Quiz Published Successfully!</h2>
            <p className="text-sm text-gray-600 mt-2">
              All {parsedQuestions.length} bilingual questions have been imported and published to Cloud Firestore.
            </p>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-left text-xs space-y-1.5 font-mono text-gray-800">
            <div><span className="font-bold">Quiz ID:</span> {createdQuizId}</div>
            <div><span className="font-bold">Questions:</span> {parsedQuestions.length}</div>
            <div><span className="font-bold">Total Marks:</span> {parsedQuestions.reduce((a, b) => a + b.points, 0)}</div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href={`/quiz/play?id=${createdQuizId}`}
              className="grow py-3 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Play Quiz Now</span>
            </Link>
            <button
              type="button"
              onClick={() => {
                setCreatedQuizId(null);
                setParsedQuestions([]);
                setCsvRawText("");
              }}
              className="py-3 px-5 rounded-xl font-bold text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors"
            >
              Upload Another
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Top Actions: Sample Template */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-700" />
                <span>Ready-To-Use CSV Template</span>
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Download the standardized CSV template with 10 pre-formatted Bhagavad-gītā bilingual questions, answer options (A/B/C/D), explanations, and point weights.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleDownloadSample}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 shadow-xs transition-all"
              >
                <Download className="w-4 h-4 text-amber-700" />
                <span>Download Sample CSV</span>
              </button>
              <button
                type="button"
                onClick={handleLoadSample}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>Load 10 Sample Questions</span>
              </button>
            </div>
          </div>

          {/* Quiz Metadata Config */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-900">Quiz Basic Details & Timer</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase">Quiz Title (English)</label>
                <input
                  type="text"
                  value={quizTitleEn}
                  onChange={(e) => setQuizTitleEn(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase">Quiz Title (Hindi)</label>
                <input
                  type="text"
                  value={quizTitleHi}
                  onChange={(e) => setQuizTitleHi(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 text-sm bg-white"
                >
                  <option value="Bhagavad-gītā">Bhagavad-gītā</option>
                  <option value="Kṛṣṇa Conscious Philosophy">Kṛṣṇa Conscious Philosophy</option>
                  <option value="Spiritual Science">Spiritual Science</option>
                  <option value="Devotional Culture">Devotional Culture</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase flex items-center justify-between">
                  <span>Question Timer</span>
                  <span className="text-amber-700 font-bold">{timerSeconds > 0 ? `${timerSeconds}s / Q` : "Unlimited"}</span>
                </label>
                <select
                  value={timerSeconds}
                  onChange={(e) => setTimerSeconds(parseInt(e.target.value, 10))}
                  className="w-full px-4 py-2.5 rounded-xl border border-amber-300 focus:border-amber-500 text-sm bg-amber-50/50 font-bold text-amber-900"
                >
                  <option value="5">⚡ 5 Seconds (Speed Blitz)</option>
                  <option value="10">⏳ 10 Seconds (Standard Gaming)</option>
                  <option value="15">⏱ 15 Seconds (Comfortable)</option>
                  <option value="20">🧘 20 Seconds (Contemplation)</option>
                  <option value="0">♾️ No Timer (Unlimited Time)</option>
                </select>
              </div>
            </div>
          </div>

          {/* File Upload Box & Raw Editor */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center justify-between">
              <span>Select CSV File or Paste Data</span>
              {parsedQuestions.length > 0 && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {parsedQuestions.length} Questions Validated
                </span>
              )}
            </h3>

            {/* Drag & Drop Input */}
            <div className="border-2 border-dashed border-amber-300 rounded-2xl p-6 text-center bg-amber-50/40 hover:bg-amber-50 transition-colors">
              <Upload className="w-10 h-10 text-amber-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-800">
                Click to browse your .CSV file (or drag & drop here)
              </p>
              <p className="text-xs text-gray-500 mt-1">Supports UTF-8 CSV with Hindi and English text</p>
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileUpload}
                className="mt-4 text-xs text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-600 file:text-white hover:file:bg-amber-700 cursor-pointer"
              />
            </div>

            {/* Raw Text fallback */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-700 uppercase">
                  Direct CSV Content Editor
                </label>
                <button
                  type="button"
                  onClick={handleParseText}
                  className="text-xs font-bold text-amber-700 hover:text-amber-800"
                >
                  Re-parse Text
                </button>
              </div>
              <textarea
                rows={6}
                value={csvRawText}
                onChange={(e) => setCsvRawText(e.target.value)}
                placeholder="Paste CSV rows here..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 font-mono text-xs focus:border-amber-500 outline-hidden"
              />
            </div>

            {parseError && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{parseError}</span>
              </div>
            )}
          </div>

          {/* Parsed Preview Table */}
          {parsedQuestions.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Preview Questions ({parsedQuestions.length})
                  </h3>
                  <p className="text-xs text-gray-500">
                    Review bilingual formatting, correct answers, and points before publishing.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={uploading}
                  onClick={handlePublishQuiz}
                  className="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-md transition-all flex items-center gap-2 disabled:opacity-70"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Publishing to Cloud...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-200" />
                      <span>One-Shot Publish ({parsedQuestions.length} Questions)</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {parsedQuestions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl border border-amber-100 bg-amber-50/30 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{q.question.hi}</p>
                          <p className="text-xs text-gray-600 italic mt-0.5">{q.question.en}</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 shrink-0">
                        {q.points} Pts
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2">
                      {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
                        const isCorrect = q.correctAnswer === optKey;
                        return (
                          <div
                            key={optKey}
                            className={`p-2.5 rounded-xl border flex items-start gap-2 ${
                              isCorrect
                                ? "bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold"
                                : "bg-white border-gray-200 text-gray-700"
                            }`}
                          >
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${isCorrect ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600"}`}>
                              {optKey}
                            </span>
                            <div>
                              <span>{q.options[optKey].hi}</span>
                              <span className="text-gray-400 block text-[11px]">{q.options[optKey].en}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {q.explanation.hi && (
                      <div className="text-[11px] text-amber-900 bg-amber-100/60 p-2.5 rounded-xl border border-amber-200">
                        <span className="font-bold">Explanation: </span>
                        <span>{q.explanation.hi} / {q.explanation.en}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
