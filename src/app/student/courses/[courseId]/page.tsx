"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  Circle,
  PlayCircle,
  Download,
  Save,
  ChevronLeft,
  ChevronRight,
  FileText,
  Clock,
  Sparkles,
  Loader2,
  Award,
} from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  order: number;
  duration: string;
  videoUrl?: string | null;
  content?: string | null;
  pdfUrl?: string | null;
  completed?: boolean;
}

interface Module {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

export default function StudentCoursePlayerPage({
  params,
}: {
  params: { courseId: string };
}) {
  const [modules, setModules] = useState<Module[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [studentNote, setStudentNote] = useState("");
  const [noteSaved, setNoteSaved] = useState(false);

  // Initial load
  useEffect(() => {
    // Standard mock modules for AMC
    const initialModules: Module[] = [
      {
        id: "mod-1",
        title: "Module 1: Clinical Foundations & Medical Terminology",
        order: 1,
        lessons: [
          {
            id: "les-1",
            title: "Lesson 1: Introduction to US Healthcare RCM & Medical Coding Roles",
            order: 1,
            duration: "45 mins",
            videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
            content: `### Welcome to Medical Coding Officers Academy (MCOA)
In this fundamental lecture, Dr. Jeevanantham introduces the global revenue cycle framework. 

**Key Concepts Covered:**
1. Payer, Provider, and Patient triad in US Healthcare
2. Difference between Inpatient (Facility) and Outpatient (Professional) billing
3. The role of AAPC CPC and AHIMA CCS credentials
4. Ethical code sequencing and compliance basics.`,
            pdfUrl: "/materials/mcoa_m1_l1_introduction.pdf",
            completed: true,
          },
          {
            id: "les-2",
            title: "Lesson 2: Anatomical Directional Terms & Body Planes",
            order: 2,
            duration: "55 mins",
            videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
            content: `### Anatomical Terminology for Medical Coders
Understanding directional planes is critical for procedural coding (CPT) and inpatient approaches (ICD-10-PCS).

**Key Points:**
- Anterior (Ventral) vs Posterior (Dorsal)
- Medial, Lateral, Proximal, Distal
- Sagittal, Coronal, and Transverse sections
- Major body cavities: Cranial, Thoracic, Abdominal, Pelvic.`,
            pdfUrl: "/materials/mcoa_m1_l2_anatomy.pdf",
            completed: true,
          },
          {
            id: "les-3",
            title: "Lesson 3: Pathophysiology & Diagnostic Laboratory Tests",
            order: 3,
            duration: "60 mins",
            videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
            content: `### Pathophysiology & Lab Values
How to link physician diagnostic findings with lab results:
- Complete Blood Count (CBC) with differential
- Comprehensive Metabolic Panel (CMP)
- Arterial Blood Gas (ABG) for respiratory failure
- Microbiology culture and sensitivity interpretations.`,
            pdfUrl: "/materials/mcoa_m1_l3_patho.pdf",
            completed: true,
          },
        ],
      },
      {
        id: "mod-2",
        title: "Module 2: ICD-10-CM Diagnosis Coding Mastery",
        order: 2,
        lessons: [
          {
            id: "les-4",
            title: "Lesson 4: Official Guidelines for Coding and Reporting (OGCR)",
            order: 1,
            duration: "65 mins",
            videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
            content: `### ICD-10-CM Conventions & General Rules
- Excludes1 (Not coded here!) vs Excludes2 (Not included here)
- "Code First" and "Use Additional Code" instructions
- Signs and symptoms vs definitive diagnoses
- Acute and chronic condition sequencing priority.`,
            pdfUrl: "/materials/mcoa_m2_l4_guidelines.pdf",
            completed: false,
          },
          {
            id: "les-5",
            title: "Lesson 5: Chapter 2 Neoplasms & Histology Cross-Referencing",
            order: 2,
            duration: "70 mins",
            videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
            content: `### Neoplasm Coding Strategies
- Malignant Primary vs Secondary (Metastatic)
- Carcinoma in Situ vs Benign vs Uncertain Behavior
- Sequencing surgical excision vs chemotherapy encounters
- Pathology report dissection.`,
            pdfUrl: "/materials/mcoa_m2_l5_neoplasms.pdf",
            completed: false,
          },
          {
            id: "les-6",
            title: "Lesson 6: Chapter 4 Endocrine & Diabetes Manifestations",
            order: 3,
            duration: "60 mins",
            videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
            content: `### Diabetes Mellitus (E08 - E13)
- Type 1 (E10) vs Type 2 (E11) diabetes
- Combination codes for nephropathy, retinopathy, and neuropathy
- Insulin dependence (Z79.4) vs oral hypoglycemic agents (Z79.84).`,
            pdfUrl: "/materials/mcoa_m2_l6_diabetes.pdf",
            completed: false,
          },
        ],
      },
    ];

    setModules(initialModules);
    // Set active lesson to lesson 4 (first incomplete)
    setActiveLesson(initialModules[1].lessons[0]);
    setLoading(false);
  }, []);

  const handleToggleComplete = async (lesson: Lesson) => {
    setUpdating(true);
    const newStatus = !lesson.completed;

    try {
      await fetch("/api/student/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: lesson.id,
          completed: newStatus,
        }),
      });

      // Update local state
      setModules((prev) =>
        prev.map((mod) => ({
          ...mod,
          lessons: mod.lessons.map((l) =>
            l.id === lesson.id ? { ...l, completed: newStatus } : l
          ),
        }))
      );

      if (activeLesson && activeLesson.id === lesson.id) {
        setActiveLesson({ ...activeLesson, completed: newStatus });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveNote = () => {
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2500);
  };

  const totalLessons = modules.flatMap((m) => m.lessons).length;
  const completedLessons = modules.flatMap((m) => m.lessons).filter((l) => l.completed).length;
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  if (loading) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center space-y-2">
        <Loader2 className="w-8 h-8 animate-spin text-mcoa-amethyst" />
        <span className="text-xs text-gray-500">Opening MCOA Classroom...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-inter">
      {/* Top Breadcrumb & Progress Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-2 text-xs">
          <Link href="/student" className="text-gray-500 hover:text-mcoa-midnight font-medium">
            Student Space
          </Link>
          <span className="text-gray-300">/</span>
          <span className="font-bold text-mcoa-midnight">
            Advanced Medical Coding Masterclass
          </span>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-right">
            <span className="text-[11px] text-gray-500">Progress: </span>
            <span className="font-bold text-mcoa-amethyst text-xs">
              {completedLessons} / {totalLessons} Lessons ({progressPercent}%)
            </span>
          </div>
          <div className="w-24 bg-gray-200 rounded-full h-2">
            <div
              className="bg-mcoa-gold h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Player & Curriculum Tree */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left / Main Column: Active Lesson Viewport */}
        <div className="lg:col-span-8 space-y-6">
          {activeLesson ? (
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Responsive Video Container */}
              <div className="relative aspect-video bg-mcoa-midnight flex items-center justify-center">
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white space-y-3 bg-gradient-to-br from-mcoa-midnight via-[#302263] to-mcoa-amethyst">
                  <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-mcoa-gold flex items-center justify-center text-mcoa-gold shadow-gold">
                    <PlayCircle className="w-10 h-10" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-mcoa-gold">
                      High-Definition Video Lecture
                    </span>
                    <h2 className="font-montserrat font-bold text-lg sm:text-xl mt-1 max-w-lg">
                      {activeLesson.title}
                    </h2>
                    <div className="text-xs text-white/70 mt-1 flex items-center justify-center space-x-2">
                      <Clock className="w-3.5 h-3.5 text-mcoa-gold" />
                      <span>Duration: {activeLesson.duration}</span>
                      <span>•</span>
                      <span>Faculty: Dr. Jeevanantham Mariappan</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lesson Controls Bar */}
              <div className="p-4 sm:p-6 bg-gray-50/70 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleComplete(activeLesson)}
                    disabled={updating}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition ${
                      activeLesson.completed
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-mcoa-midnight text-white hover:bg-mcoa-amethyst shadow-sm"
                    }`}
                  >
                    {activeLesson.completed ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Completed (Click to Reopen)</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-4 h-4 text-mcoa-gold" />
                        <span>Mark Lesson as Completed</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Downloading official lecture study guide PDF...");
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 transition flex items-center space-x-1.5 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5 text-mcoa-amethyst" />
                    <span>Download Study Notes PDF</span>
                  </a>
                </div>
              </div>

              {/* Lesson Text Content */}
              <div className="p-6 sm:p-8 space-y-4">
                <h3 className="font-montserrat font-bold text-base text-mcoa-midnight">
                  Lecture Summary & Official Guidelines
                </h3>
                <div className="prose prose-sm max-w-none text-xs sm:text-sm text-gray-700 leading-relaxed space-y-3 font-inter whitespace-pre-line bg-mcoa-pearl/30 p-5 rounded-2xl border border-mcoa-lavender/30">
                  {activeLesson.content}
                </div>
              </div>

              {/* Personal Notes Section */}
              <div className="p-6 sm:p-8 border-t border-gray-100 space-y-3 bg-gray-50/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs font-bold text-mcoa-midnight">
                    <FileText className="w-4 h-4 text-mcoa-amethyst" />
                    <span>My Personal Lecture Notes</span>
                  </div>
                  {noteSaved && (
                    <span className="text-[11px] font-bold text-emerald-600 animate-fadeIn">
                      ✔ Notes Saved to Account
                    </span>
                  )}
                </div>
                <textarea
                  rows={3}
                  value={studentNote}
                  onChange={(e) => setStudentNote(e.target.value)}
                  placeholder="Record your personal notes, mnemonics, or questions for Dr. Rajesh during the live Saturday session..."
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-mcoa-amethyst"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveNote}
                    className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-mcoa-midnight text-white hover:bg-mcoa-amethyst transition flex items-center space-x-1.5"
                  >
                    <Save className="w-3.5 h-3.5 text-mcoa-gold" />
                    <span>Save My Notes</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
              <p className="text-sm text-gray-500">Select a lesson from the curriculum to begin.</p>
            </div>
          )}
        </div>

        {/* Right Column: Module & Lesson Tree */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-gray-200 shadow-sm p-6 space-y-6 sticky top-24">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-mcoa-amethyst">
              Course Structure
            </span>
            <h3 className="font-montserrat font-bold text-base text-mcoa-midnight mt-0.5">
              Curriculum Modules
            </h3>
          </div>

          <div className="space-y-5">
            {modules.map((mod) => (
              <div key={mod.id} className="space-y-2">
                <div className="font-montserrat font-bold text-xs text-mcoa-midnight bg-mcoa-pearl p-2.5 rounded-lg border border-mcoa-lavender/30">
                  {mod.title}
                </div>

                <div className="space-y-1 pl-1">
                  {mod.lessons.map((les) => (
                    <button
                      key={les.id}
                      onClick={() => setActiveLesson(les)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs transition flex items-start space-x-2.5 ${
                        activeLesson?.id === les.id
                          ? "bg-mcoa-midnight text-white shadow-sm font-semibold"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      {les.completed ? (
                        <CheckCircle2
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            activeLesson?.id === les.id ? "text-mcoa-gold" : "text-emerald-600"
                          }`}
                        />
                      ) : (
                        <Circle
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            activeLesson?.id === les.id ? "text-white/50" : "text-gray-300"
                          }`}
                        />
                      )}
                      <div className="flex-1">
                        <div className="leading-snug">{les.title}</div>
                        <div
                          className={`text-[10px] mt-0.5 ${
                            activeLesson?.id === les.id ? "text-mcoa-gold" : "text-gray-400"
                          }`}
                        >
                          {les.duration}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
