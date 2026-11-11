import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import {
  StudentProfile,
  CharacterState,
  Question,
  ExamSession,
  WrongNoteItem,
  Grade,
  Semester,
  ExamType,
  Subject,
  BookType,
  TextbookPublisher,
  SubjectTextbookSetting,
} from '../types';
import { INITIAL_BADGES, CHARACTER_STAGES } from '../data/characterConfig';
import { getFilteredQuestions, generateUpgradedQuestions, FULL_QUESTION_BANK } from '../utils/questionEngine';
import { DEFAULT_TEXTBOOK_SETTINGS, getStandardTextbookSettings } from '../data/textbooks';
import { sounds } from '../utils/soundEffects';

interface StudyContextType {
  // Profiles
  profiles: StudentProfile[];
  currentStudent: StudentProfile;
  loginOrSwitchStudent: (name: string, grade: Grade, schoolName?: string) => void;
  createStudentProfile: (name: string, grade: Grade, schoolName?: string) => void;
  deleteStudentProfile: (id: string) => void;
  updateTextbookSetting: (subject: Subject, setting: SubjectTextbookSetting) => void;
  updateStudentExamTarget: (params: { grade?: Grade; semester?: Semester; examType?: ExamType }) => void;

  // Active navigation tab
  activeTab: 'exam_config' | 'exam_room' | 'exam_result' | 'wrong_notes' | 'character' | 'stats';
  setActiveTab: (tab: 'exam_config' | 'exam_room' | 'exam_result' | 'wrong_notes' | 'character' | 'stats') => void;

  // Exam flow
  currentExam: ExamSession | null;
  startExam: (params: {
    grade: Grade;
    semester: Semester;
    examType: ExamType;
    subject: Subject;
    bookType: BookType;
    timerMinutes: number;
    publisher?: TextbookPublisher;
    selectedUnits?: string[];
    scopeDescription?: string;
    upgradeRound?: number;
  }) => void;
  answerQuestion: (questionIndex: number, choiceIndex: number) => void;
  toggleFlag: (questionIndex: number) => void;
  submitExam: () => void;
  upgradeCurrentExam: (targetBook?: BookType) => void;

  // Study Fever Gauge & Character Growth
  feverGauge: number;
  feverModeActive: boolean;
  chargeFeverGauge: (amount: number) => void;
  feedWisdomBerry: () => { success: boolean; message: string };
  triggerLevelUpCheck: (gainedExp: number) => void;

  // Wrong notes
  wrongNotes: WrongNoteItem[];
  toggleMasterNote: (noteId: string) => void;
  updateNoteMemo: (noteId: string, memo: string) => void;
  deleteNote: (noteId: string) => void;
  generateSimilarQuestionsForNote: (noteId: string, difficultyType: '100bal100jung' | 'blacklabel') => Promise<void>;
  solveSimilarQuestionInNote: (noteId: string, questionId: string, selectedAnswerIndex: number) => { isCorrect: boolean; expGained: number };
  askAiTutorForNote: (noteId: string) => Promise<any>;

  // Evolution Celebration Modal
  evolutionNotice: { isOpen: boolean; stage: 1 | 2 | 3 | 4; title: string; message: string } | null;
  closeEvolutionModal: () => void;
}

const DEFAULT_CHARACTER: CharacterState = {
  name: '루디',
  level: 1,
  exp: 0,
  maxExp: 100,
  stage: 1,
  stats: {
    intelligence: 10,
    vocabulary: 10,
    inquiry: 10,
    concentration: 10,
  },
  streakDays: 1,
  lastStudyDate: new Date().toISOString().split('T')[0],
  wisdomBerries: 3,
  studyFeverGauge: 25,
  feverModeActive: false,
  totalStudyMinutes: 0,
  badges: INITIAL_BADGES,
};

const DEFAULT_STUDENT: StudentProfile = {
  id: 'student-default-1',
  name: '김민수',
  grade: '중2',
  schoolName: '대한중학교',
  activeGrade: '중2',
  activeSemester: '1학기',
  activeExamType: '중간고사',
  textbookSettings: DEFAULT_TEXTBOOK_SETTINGS,
  character: DEFAULT_CHARACTER,
  wrongNotes: [],
  examHistory: [],
  createdAt: new Date().toISOString(),
  lastLoginAt: new Date().toISOString(),
};

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export const StudyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Profiles state
  const [profiles, setProfiles] = useState<StudentProfile[]>(() => {
    try {
      const saved = localStorage.getItem('studyquest_profiles_v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return [DEFAULT_STUDENT];
  });

  const [currentStudentId, setCurrentStudentId] = useState<string>(() => {
    try {
      const savedId = localStorage.getItem('studyquest_active_student_id_v1');
      if (savedId) return savedId;
    } catch {}
    return DEFAULT_STUDENT.id;
  });

  const currentStudent = profiles.find((p) => p.id === currentStudentId) || profiles[0] || DEFAULT_STUDENT;

  // Active Screen
  const [activeTab, setActiveTab] = useState<'exam_config' | 'exam_room' | 'exam_result' | 'wrong_notes' | 'character' | 'stats'>('exam_config');

  // Exam state
  const [currentExam, setCurrentExam] = useState<ExamSession | null>(null);

  // Evolution modal
  const [evolutionNotice, setEvolutionNotice] = useState<{
    isOpen: boolean;
    stage: 1 | 2 | 3 | 4;
    title: string;
    message: string;
  } | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('studyquest_profiles_v1', JSON.stringify(profiles));
      localStorage.setItem('studyquest_active_student_id_v1', currentStudentId);
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [profiles, currentStudentId]);

  // Helper to update current student profile
  const updateCurrentStudent = (updater: (prev: StudentProfile) => StudentProfile) => {
    setProfiles((prevList) =>
      prevList.map((p) => (p.id === currentStudent.id ? updater(p) : p))
    );
  };

  // Switch or create profile
  const loginOrSwitchStudent = (name: string, grade: Grade, schoolName?: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    const existing = profiles.find((p) => p.name === trimmed && p.grade === grade);
    if (existing) {
      setCurrentStudentId(existing.id);
      sounds.playSuccess();
    } else {
      createStudentProfile(trimmed, grade, schoolName);
    }
  };

  const createStudentProfile = (name: string, grade: Grade, schoolName?: string) => {
    const newProfile: StudentProfile = {
      id: `student-${Date.now()}`,
      name: name.trim(),
      grade: grade,
      schoolName: schoolName?.trim() || '중학교',
      activeGrade: grade,
      activeSemester: '1학기',
      activeExamType: '중간고사',
      textbookSettings: getStandardTextbookSettings(grade, '1학기', '중간고사'),
      character: {
        ...DEFAULT_CHARACTER,
        name: `${name.trim()}의 펫`,
      },
      wrongNotes: [],
      examHistory: [],
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    setProfiles((prev) => [...prev, newProfile]);
    setCurrentStudentId(newProfile.id);
    sounds.playFanfare();
    confetti({ particleCount: 50, spread: 60 });
  };

  const updateTextbookSetting = (subject: Subject, setting: SubjectTextbookSetting) => {
    updateCurrentStudent((student) => ({
      ...student,
      textbookSettings: {
        ...(student.textbookSettings || getStandardTextbookSettings(student.activeGrade || student.grade, student.activeSemester || '1학기', student.activeExamType || '중간고사')),
        [subject]: setting,
      },
    }));
    sounds.playSuccess();
  };

  const updateStudentExamTarget = (params: { grade?: Grade; semester?: Semester; examType?: ExamType }) => {
    updateCurrentStudent((student) => {
      const nextGrade = params.grade || student.grade;
      const nextSemester = params.semester || student.activeSemester || '1학기';
      const nextExamType = params.examType || student.activeExamType || '중간고사';

      // 학년이 변경되거나 기존 textbookSettings의 단원이 새 학년과 맞지 않을 경우 해당 학년 표준 범위로 리셋
      const gradeChanged = Boolean(params.grade && params.grade !== (student.activeGrade || student.grade));
      const nextTextbookSettings = gradeChanged
        ? getStandardTextbookSettings(nextGrade, nextSemester, nextExamType)
        : student.textbookSettings || getStandardTextbookSettings(nextGrade, nextSemester, nextExamType);

      return {
        ...student,
        grade: nextGrade,
        activeGrade: nextGrade,
        activeSemester: nextSemester,
        activeExamType: nextExamType,
        textbookSettings: nextTextbookSettings,
      };
    });
  };

  const deleteStudentProfile = (id: string) => {
    if (profiles.length <= 1) return;
    setProfiles((prev) => prev.filter((p) => p.id !== id));
    if (currentStudentId === id) {
      const remaining = profiles.filter((p) => p.id !== id);
      if (remaining[0]) setCurrentStudentId(remaining[0].id);
    }
  };

  // Study Fever Gauge Charge
  const chargeFeverGauge = (amount: number) => {
    updateCurrentStudent((student) => {
      const char = student.character;
      let newGauge = char.studyFeverGauge + amount;
      let feverActive = char.feverModeActive;
      let newBerries = char.wisdomBerries;
      let newExp = char.exp;

      if (newGauge >= 100) {
        newGauge = 100;
        if (!feverActive) {
          feverActive = true;
          newBerries += 1;
          newExp += 50;
          sounds.playFanfare();
          confetti({ particleCount: 60, spread: 70 });
        }
      }

      return {
        ...student,
        character: {
          ...char,
          studyFeverGauge: newGauge,
          feverModeActive: feverActive,
          wisdomBerries: newBerries,
          exp: newExp,
        },
      };
    });
  };

  // Level Up & Evolution Logic
  const triggerLevelUpCheck = (gainedExp: number) => {
    updateCurrentStudent((student) => {
      let char = { ...student.character };
      let exp = char.exp + gainedExp;
      let level = char.level;
      let maxExp = char.maxExp;
      let stage = char.stage;
      let evolved = false;

      while (exp >= maxExp && level < 99) {
        exp -= maxExp;
        level += 1;
        maxExp = level * 100;

        // Stage Evolution check
        let nextStage: 1 | 2 | 3 | 4 = 1;
        if (level >= 25) nextStage = 4;
        else if (level >= 12) nextStage = 3;
        else if (level >= 5) nextStage = 2;

        if (nextStage > stage) {
          stage = nextStage;
          evolved = true;
        }

        // Stat boosts on level up
        char.stats.intelligence += 2;
        char.stats.vocabulary += 2;
        char.stats.inquiry += 2;
        char.stats.concentration += 3;
      }

      if (level > char.level) {
        sounds.playFanfare();
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
        });

        if (evolved) {
          const stageInfo = CHARACTER_STAGES.find((s) => s.stage === stage);
          if (stageInfo) {
            setEvolutionNotice({
              isOpen: true,
              stage: stage,
              title: `${stageInfo.name}으로 진화 성공!`,
              message: stageInfo.evolutionCelebration,
            });
          }
        }
      }

      return {
        ...student,
        character: {
          ...char,
          level,
          exp,
          maxExp,
          stage,
        },
      };
    });
  };

  // Feed character wisdom berry
  const feedWisdomBerry = () => {
    if (currentStudent.character.wisdomBerries <= 0) {
      return { success: false, message: '지혜의 열매가 부족해요! 모의고사와 오답노트를 풀어 열매를 획득해 보세요.' };
    }

    updateCurrentStudent((student) => {
      const char = student.character;
      return {
        ...student,
        character: {
          ...char,
          wisdomBerries: char.wisdomBerries - 1,
          exp: char.exp + 35,
          studyFeverGauge: Math.min(100, char.studyFeverGauge + 15),
          stats: {
            ...char.stats,
            intelligence: char.stats.intelligence + 1,
            concentration: char.stats.concentration + 1,
          },
        },
      };
    });

    sounds.playSuccess();
    confetti({ particleCount: 35, spread: 50 });
    return { success: true, message: '냠냠! 지혜의 열매를 먹고 경험치 +35와 집중력 스탯이 상승했습니다!' };
  };

  const startExam = (params: {
    grade: Grade;
    semester: Semester;
    examType: ExamType;
    subject: Subject;
    bookType: BookType;
    timerMinutes: number;
    publisher?: TextbookPublisher;
    selectedUnits?: string[];
    scopeDescription?: string;
    upgradeRound?: number;
  }) => {
    const questions = getFilteredQuestions({
      grade: params.grade,
      semester: params.semester,
      examType: params.examType,
      subject: params.subject,
      bookType: params.bookType,
      publisher: params.publisher,
      selectedUnits: params.selectedUnits,
      timerMinutes: params.timerMinutes,
      upgradeRound: params.upgradeRound || 1,
    });

    const publisherLabel = params.publisher && params.publisher !== '공통/표준'
      ? `[${params.publisher} 교과서] `
      : '';

    const modeTag =
      params.timerMinutes === 10
        ? '[10분 벼락치기 5문항]'
        : params.timerMinutes === 20
        ? '[20분 유형완성 10문항]'
        : params.timerMinutes === 45
        ? '[45분 본시험 20문항]'
        : '[30분 모의평가 15문항]';

    const session: ExamSession = {
      id: `exam-${Date.now()}`,
      title: `${params.grade} ${params.semester} ${params.examType} [${params.subject}] ${modeTag} ${publisherLabel}${
        params.bookType === 'blacklabel'
          ? '블랙라벨 심화'
          : params.bookType === '100bal100jung'
          ? '100발100중 기출'
          : '내신 종합'
      }`,
      grade: params.grade,
      semester: params.semester,
      examType: params.examType,
      subject: params.subject,
      publisher: params.publisher,
      selectedUnits: params.selectedUnits,
      scopeDescription: params.scopeDescription,
      bookType: params.bookType,
      timerMinutes: params.timerMinutes,
      totalQuestions: questions.length,
      startedAt: new Date().toISOString(),
      answers: {},
      flagged: {},
      questions: questions,
    };

    setCurrentExam(session);
    setActiveTab('exam_room');
    chargeFeverGauge(5);
    sounds.playClick();
  };

  // Mark answer
  const answerQuestion = (questionIndex: number, choiceIndex: number) => {
    if (!currentExam) return;
    setCurrentExam((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        answers: {
          ...prev.answers,
          [questionIndex]: choiceIndex,
        },
      };
    });
    chargeFeverGauge(3);
    sounds.playClick();
  };

  // Toggle flag
  const toggleFlag = (questionIndex: number) => {
    if (!currentExam) return;
    setCurrentExam((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        flagged: {
          ...prev.flagged,
          [questionIndex]: !prev.flagged[questionIndex],
        },
      };
    });
    sounds.playClick();
  };

  // Submit Exam
  const submitExam = () => {
    if (!currentExam) return;

    let correctCount = 0;
    const newWrongNotes: WrongNoteItem[] = [];

    currentExam.questions.forEach((q, idx) => {
      const selected = currentExam.answers[idx];
      if (selected === q.correctAnswerIndex) {
        correctCount += 1;
      } else {
        newWrongNotes.push({
          id: `wrong-${Date.now()}-${idx}`,
          examId: currentExam.id,
          examTitle: currentExam.title,
          grade: currentExam.grade,
          semester: currentExam.semester,
          examType: currentExam.examType,
          subject: currentExam.subject,
          question: q,
          userAnswerIndex: selected !== undefined ? selected : null,
          createdAt: new Date().toISOString(),
          isMastered: false,
          reviewCount: 0,
        });
      }
    });

    const score = Math.round((correctCount / currentExam.questions.length) * 100);

    const completedSession: ExamSession = {
      ...currentExam,
      score,
      completedAt: new Date().toISOString(),
    };

    setCurrentExam(completedSession);

    // Calculate EXP & stats
    const baseExp = score * 1.5;
    const perfectBonus = score === 100 ? 50 : 0;
    const totalExp = Math.round(baseExp + perfectBonus);

    // Stat gains based on subject
    const subjectStatKey: keyof CharacterState['stats'] =
      currentExam.subject === '수학'
        ? 'intelligence'
        : currentExam.subject === '과학'
        ? 'inquiry'
        : currentExam.subject === '영어' || currentExam.subject === '국어'
        ? 'vocabulary'
        : 'concentration';

    updateCurrentStudent((student) => {
      const updatedHistory = [completedSession, ...student.examHistory];
      const mergedWrongNotes = [...newWrongNotes, ...student.wrongNotes];

      // Check badges
      const updatedBadges = [...student.character.badges];
      const firstExamBadge = updatedBadges.find((b) => b.id === 'first_exam');
      if (firstExamBadge && !firstExamBadge.unlockedAt) {
        firstExamBadge.unlockedAt = new Date().toISOString();
      }

      if (score >= 90 && currentExam.subject === '수학') {
        const mathBadge = updatedBadges.find((b) => b.id === 'math_ace');
        if (mathBadge && !mathBadge.unlockedAt) {
          mathBadge.unlockedAt = new Date().toISOString();
        }
      }

      if (currentExam.bookType === 'blacklabel' && score >= 80) {
        const blBadge = updatedBadges.find((b) => b.id === 'blacklabel_slayer');
        if (blBadge && !blBadge.unlockedAt) {
          blBadge.unlockedAt = new Date().toISOString();
        }
      }

      return {
        ...student,
        examHistory: updatedHistory,
        wrongNotes: mergedWrongNotes,
        character: {
          ...student.character,
          badges: updatedBadges,
          totalStudyMinutes: student.character.totalStudyMinutes + currentExam.timerMinutes,
          studyFeverGauge: Math.min(100, student.character.studyFeverGauge + 25),
          stats: {
            ...student.character.stats,
            [subjectStatKey]: student.character.stats[subjectStatKey] + Math.ceil(score / 20),
            concentration: student.character.stats.concentration + 3,
          },
        },
      };
    });

    triggerLevelUpCheck(totalExp);
    setActiveTab('exam_result');
    sounds.playFanfare();
  };

  // Upgrade Current Exam (Upgrade round & shift to Black Label)
  const upgradeCurrentExam = (targetBook: BookType = 'blacklabel') => {
    if (!currentExam) return;
    const nextRound = (currentExam.questions[0]?.upgradeRound || 1) + 1;
    const upgraded = generateUpgradedQuestions(currentExam.questions, nextRound, targetBook);

    const upgradedSession: ExamSession = {
      ...currentExam,
      id: `exam-upgraded-${Date.now()}`,
      title: `${currentExam.grade} ${currentExam.semester} ${currentExam.examType} [${currentExam.subject}] 블랙라벨 Step3 킬러 (R${nextRound})`,
      bookType: targetBook,
      answers: {},
      flagged: {},
      score: undefined,
      completedAt: undefined,
      startedAt: new Date().toISOString(),
      questions: upgraded,
    };

    setCurrentExam(upgradedSession);
    setActiveTab('exam_room');
    chargeFeverGauge(10);
    sounds.playSuccess();
    confetti({ particleCount: 50, spread: 60 });
  };

  // Wrong Note Management
  const toggleMasterNote = (noteId: string) => {
    updateCurrentStudent((student) => {
      const updatedNotes = student.wrongNotes.map((n) => {
        if (n.id === noteId) {
          const nextMastered = !n.isMastered;
          if (nextMastered) {
            triggerLevelUpCheck(30);
            sounds.playSuccess();
          }
          return {
            ...n,
            isMastered: nextMastered,
            reviewCount: n.reviewCount + 1,
          };
        }
        return n;
      });
      return {
        ...student,
        wrongNotes: updatedNotes,
      };
    });
  };

  const updateNoteMemo = (noteId: string, memo: string) => {
    updateCurrentStudent((student) => ({
      ...student,
      wrongNotes: student.wrongNotes.map((n) => (n.id === noteId ? { ...n, studentMemo: memo } : n)),
    }));
  };

  const deleteNote = (noteId: string) => {
    updateCurrentStudent((student) => ({
      ...student,
      wrongNotes: student.wrongNotes.filter((n) => n.id !== noteId),
    }));
    sounds.playClick();
  };

  // Generate Similar Questions for a Wrong Note
  const generateSimilarQuestionsForNote = async (
    noteId: string,
    difficultyType: '100bal100jung' | 'blacklabel'
  ) => {
    const targetNote = currentStudent.wrongNotes.find((n) => n.id === noteId);
    if (!targetNote) return;

    try {
      const res = await fetch('/api/generate-similar-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalQuestion: `${targetNote.question.title}: ${targetNote.question.questionText}`,
          subject: targetNote.subject,
          grade: targetNote.grade,
          unit: targetNote.question.unit,
          difficulty: difficultyType === 'blacklabel' ? '블랙라벨_스텝3_최고난도킬러' : '100발100중_실전기출',
          bookType: difficultyType,
          count: 2,
        }),
      });

      const data = await res.json();
      if (data.success && data.questions) {
        updateCurrentStudent((student) => ({
          ...student,
          wrongNotes: student.wrongNotes.map((n) =>
            n.id === noteId
              ? { ...n, similarQuestions: [...(n.similarQuestions || []), ...data.questions] }
              : n
          ),
        }));
        chargeFeverGauge(10);
        sounds.playSuccess();
      }
    } catch (e) {
      console.error('Failed to generate similar questions', e);
    }
  };

  // Solve a Similar Question inside a Wrong Note
  const solveSimilarQuestionInNote = (
    noteId: string,
    questionId: string,
    selectedAnswerIndex: number
  ) => {
    const note = currentStudent.wrongNotes.find((n) => n.id === noteId);
    if (!note || !note.similarQuestions) return { isCorrect: false, expGained: 0 };

    const targetQ = note.similarQuestions.find((q) => q.id === questionId);
    if (!targetQ) return { isCorrect: false, expGained: 0 };

    const isCorrect = selectedAnswerIndex === targetQ.correctAnswerIndex;
    const expGained = isCorrect ? 40 : 10;

    if (isCorrect) {
      triggerLevelUpCheck(expGained);
      chargeFeverGauge(15);
      sounds.playSuccess();
      confetti({ particleCount: 45, spread: 60 });
      // Also mark the parent note as reviewed and possibly mastered!
      updateCurrentStudent((student) => ({
        ...student,
        wrongNotes: student.wrongNotes.map((n) =>
          n.id === noteId ? { ...n, isMastered: true, reviewCount: n.reviewCount + 1 } : n
        ),
      }));
    } else {
      sounds.playWarning();
    }

    return { isCorrect, expGained };
  };

  // Ask AI Tutor 1:1 for a Wrong Note
  const askAiTutorForNote = async (noteId: string) => {
    const targetNote = currentStudent.wrongNotes.find((n) => n.id === noteId);
    if (!targetNote) return null;

    try {
      const res = await fetch('/api/ai-tutor-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionText: targetNote.question.questionText,
          options: targetNote.question.options,
          correctAnswer: targetNote.question.options[targetNote.question.correctAnswerIndex],
          myAnswer: targetNote.userAnswerIndex !== null ? targetNote.question.options[targetNote.userAnswerIndex] : '미표기',
          subject: targetNote.subject,
          bookType: targetNote.question.bookSource,
        }),
      });
      const data = await res.json();
      if (data.success && data.explanation) {
        sounds.playSuccess();
        return data.explanation;
      }
    } catch (e) {
      console.error('Failed to get tutor explanation', e);
    }
    return null;
  };

  const closeEvolutionModal = () => {
    setEvolutionNotice(null);
  };

  return (
    <StudyContext.Provider
      value={{
        profiles,
        currentStudent,
        loginOrSwitchStudent,
        createStudentProfile,
        deleteStudentProfile,
        updateTextbookSetting,
        updateStudentExamTarget,
        activeTab,
        setActiveTab,
        currentExam,
        startExam,
        answerQuestion,
        toggleFlag,
        submitExam,
        upgradeCurrentExam,
        feverGauge: currentStudent.character.studyFeverGauge,
        feverModeActive: currentStudent.character.feverModeActive,
        chargeFeverGauge,
        feedWisdomBerry,
        triggerLevelUpCheck,
        wrongNotes: currentStudent.wrongNotes,
        toggleMasterNote,
        updateNoteMemo,
        deleteNote,
        generateSimilarQuestionsForNote,
        solveSimilarQuestionInNote,
        askAiTutorForNote,
        evolutionNotice,
        closeEvolutionModal,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
};
