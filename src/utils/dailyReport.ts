import {
  DailyStudyLog,
  DailySubjectStats,
  ExamSession,
  StudentProfile,
  Subject,
  SUBJECT_ORDER,
} from '../types';

const WEEKDAY_KO = ['일', '월', '화', '수', '목', '금', '토'];

export function getLocalDateKey(dateInput: Date | string = new Date()): string {
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (Number.isNaN(d.getTime())) {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')}`;
  }
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateKey(dateKey: string): Date {
  const [y, m, d] = dateKey.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1, 12, 0, 0, 0);
}

export function shiftDateKey(dateKey: string, deltaDays: number): string {
  const date = parseDateKey(dateKey);
  date.setDate(date.getDate() + deltaDays);
  return getLocalDateKey(date);
}

export function getDateRangeKeys(endDateKey: string, daysCount: number): string[] {
  const keys: string[] = [];
  for (let i = daysCount - 1; i >= 0; i--) {
    keys.push(shiftDateKey(endDateKey, -i));
  }
  return keys;
}

export function formatShortDateLabel(dateKey: string): { shortDate: string; weekday: string; fullDate: string } {
  const d = parseDateKey(dateKey);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const weekday = WEEKDAY_KO[d.getDay()] || '';
  return {
    shortDate: `${month}/${day}`,
    weekday,
    fullDate: `${d.getFullYear()}년 ${month}월 ${day}일 (${weekday})`,
  };
}

export function formatStudyDuration(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.round(totalSeconds));
  if (safeSeconds === 0) return '0분';
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  if (hours > 0) {
    return minutes > 0 ? `${hours}시간 ${minutes}분` : `${hours}시간`;
  }
  if (minutes > 0) {
    return seconds > 0 ? `${minutes}분 ${seconds}초` : `${minutes}분`;
  }
  return `${seconds}초`;
}

export function formatMinutesDecimal(totalSeconds: number): number {
  return Math.round((Math.max(0, totalSeconds) / 60) * 10) / 10;
}

export function getStageForLevel(level: number): 1 | 2 | 3 | 4 {
  if (level >= 25) return 4;
  if (level >= 12) return 3;
  if (level >= 5) return 2;
  return 1;
}

export function getSessionCorrectCount(session: ExamSession): number {
  if (typeof session.correctCount === 'number') return session.correctCount;
  return session.questions.reduce((acc, q, idx) => {
    return acc + (session.answers[idx] === q.correctAnswerIndex ? 1 : 0);
  }, 0);
}

export function getSessionDurationSeconds(session: ExamSession): number {
  if (typeof session.timeSpentSeconds === 'number' && session.timeSpentSeconds > 0) {
    return session.timeSpentSeconds;
  }
  if (session.completedAt && session.startedAt) {
    const diff = Math.round(
      (new Date(session.completedAt).getTime() - new Date(session.startedAt).getTime()) / 1000
    );
    if (diff > 0 && diff <= session.timerMinutes * 60) {
      return diff;
    }
  }
  return (session.timerMinutes || 10) * 60;
}

export interface DailyReportPoint {
  date: string;
  shortDate: string;
  weekday: string;
  fullDate: string;
  studySeconds: number;
  studyMinutes: number;
  examsCompleted: number;
  questionsSolved: number;
  correctCount: number;
  accuracyPercent: number | null; // null이면 해당 날짜 응시 없음
  expGained: number;
  startLevel: number;
  endLevel: number;
  levelGained: number;
  startStage: 1 | 2 | 3 | 4;
  endStage: 1 | 2 | 3 | 4;
  wrongNotesMastered: number;
  berriesFed: number;
  hasActivity: boolean;
  isBeforeCreation: boolean;
  bySubject: Partial<Record<Subject, DailySubjectStats>>;
  sessions: ExamSession[];
}

export function buildDailyLogMap(student: StudentProfile): Map<string, {
  log: DailyStudyLog;
  sessions: ExamSession[];
}> {
  const map = new Map<string, { log: DailyStudyLog; sessions: ExamSession[] }>();
  const storedLogs = student.dailyLogs || {};

  // Group exam sessions by local date
  const sessionsByDate = new Map<string, ExamSession[]>();
  (student.examHistory || []).forEach((session) => {
    const key = getLocalDateKey(session.completedAt || session.startedAt);
    const list = sessionsByDate.get(key) || [];
    list.push(session);
    sessionsByDate.set(key, list);
  });

  // 1. Seed with stored dailyLogs
  Object.entries(storedLogs).forEach(([dateKey, log]) => {
    map.set(dateKey, {
      log: {
        ...log,
        bySubject: log.bySubject ? { ...log.bySubject } : {},
      },
      sessions: sessionsByDate.get(dateKey) || [],
    });
  });

  // 2. Backfill any dates that only have examHistory (older sessions before dailyLogs existed)
  sessionsByDate.forEach((sessions, dateKey) => {
    if (map.has(dateKey)) return;

    let studySeconds = 0;
    let questionsSolved = 0;
    let correctCount = 0;
    let expGained = 0;
    const bySubject: Partial<Record<Subject, DailySubjectStats>> = {};

    sessions.forEach((s) => {
      const sec = getSessionDurationSeconds(s);
      const qCount = s.totalQuestions || s.questions.length;
      const corr = getSessionCorrectCount(s);
      const score = s.score ?? (qCount > 0 ? Math.round((corr / qCount) * 100) : 0);
      const estExp = Math.round(score * 1.5 + (score === 100 ? 50 : 0));

      studySeconds += sec;
      questionsSolved += qCount;
      correctCount += corr;
      expGained += estExp;

      const prevSub = bySubject[s.subject] || {
        studySeconds: 0,
        examsCompleted: 0,
        questionsSolved: 0,
        correctCount: 0,
      };
      bySubject[s.subject] = {
        studySeconds: prevSub.studySeconds + sec,
        examsCompleted: prevSub.examsCompleted + 1,
        questionsSolved: prevSub.questionsSolved + qCount,
        correctCount: prevSub.correctCount + corr,
      };
    });

    const fallbackLevel = student.character.level || 1;
    const fallbackStage = getStageForLevel(fallbackLevel);

    map.set(dateKey, {
      log: {
        date: dateKey,
        studySeconds,
        examsCompleted: sessions.length,
        questionsSolved,
        correctCount,
        expGained,
        startLevel: fallbackLevel,
        endLevel: fallbackLevel,
        startStage: fallbackStage,
        endStage: fallbackStage,
        wrongNotesMastered: 0,
        berriesFed: 0,
        bySubject,
      },
      sessions,
    });
  });

  return map;
}

export function buildDailyReportSeries(
  student: StudentProfile,
  endDateKey: string,
  daysCount: number
): DailyReportPoint[] {
  const rangeKeys = getDateRangeKeys(endDateKey, daysCount);
  const logMap = buildDailyLogMap(student);
  const createdKey = getLocalDateKey(student.createdAt || new Date());

  // Collect all known logged dates sorted ascending to determine level progression across rest days
  const allLoggedDates = Array.from(logMap.keys()).sort();

  // Helper: estimate character level at the end of any given dateKey
  const resolveLevelSnapshot = (dateKey: string): { startLevel: number; endLevel: number } => {
    const exact = logMap.get(dateKey)?.log;
    if (exact) {
      return { startLevel: exact.startLevel, endLevel: exact.endLevel };
    }
    // Find the latest logged date strictly before dateKey
    let prevDate: string | null = null;
    for (let i = allLoggedDates.length - 1; i >= 0; i--) {
      if (allLoggedDates[i] < dateKey) {
        prevDate = allLoggedDates[i];
        break;
      }
    }
    if (prevDate) {
      const prevEnd = logMap.get(prevDate)!.log.endLevel;
      return { startLevel: prevEnd, endLevel: prevEnd };
    }
    // Find earliest logged date after dateKey
    const nextDate = allLoggedDates.find((d) => d > dateKey);
    if (nextDate) {
      const nextStart = logMap.get(nextDate)!.log.startLevel;
      return { startLevel: nextStart, endLevel: nextStart };
    }
    const currentLv = student.character.level || 1;
    return { startLevel: currentLv, endLevel: currentLv };
  };

  return rangeKeys.map((dateKey) => {
    const entry = logMap.get(dateKey);
    const { shortDate, weekday, fullDate } = formatShortDateLabel(dateKey);
    const isBeforeCreation = dateKey < createdKey && !entry;

    if (!entry) {
      const { startLevel, endLevel } = resolveLevelSnapshot(dateKey);
      return {
        date: dateKey,
        shortDate,
        weekday,
        fullDate,
        studySeconds: 0,
        studyMinutes: 0,
        examsCompleted: 0,
        questionsSolved: 0,
        correctCount: 0,
        accuracyPercent: null,
        expGained: 0,
        startLevel,
        endLevel,
        levelGained: 0,
        startStage: getStageForLevel(startLevel),
        endStage: getStageForLevel(endLevel),
        wrongNotesMastered: 0,
        berriesFed: 0,
        hasActivity: false,
        isBeforeCreation,
        bySubject: {},
        sessions: [],
      };
    }

    const { log, sessions } = entry;
    const accuracyPercent =
      log.questionsSolved > 0
        ? Math.round((log.correctCount / log.questionsSolved) * 1000) / 10
        : null;

    // Normalize subject map in standard order
    const normalizedBySubject: Partial<Record<Subject, DailySubjectStats>> = {};
    SUBJECT_ORDER.forEach((sub) => {
      if (log.bySubject?.[sub]) {
        normalizedBySubject[sub] = log.bySubject[sub];
      }
    });

    const hasActivity =
      log.studySeconds > 0 ||
      log.examsCompleted > 0 ||
      log.expGained > 0 ||
      (log.wrongNotesMastered || 0) > 0 ||
      (log.berriesFed || 0) > 0;

    return {
      date: dateKey,
      shortDate,
      weekday,
      fullDate,
      studySeconds: log.studySeconds,
      studyMinutes: formatMinutesDecimal(log.studySeconds),
      examsCompleted: log.examsCompleted,
      questionsSolved: log.questionsSolved,
      correctCount: log.correctCount,
      accuracyPercent,
      expGained: log.expGained,
      startLevel: log.startLevel,
      endLevel: log.endLevel,
      levelGained: Math.max(0, log.endLevel - log.startLevel),
      startStage: log.startStage || getStageForLevel(log.startLevel),
      endStage: log.endStage || getStageForLevel(log.endLevel),
      wrongNotesMastered: log.wrongNotesMastered || 0,
      berriesFed: log.berriesFed || 0,
      hasActivity,
      isBeforeCreation,
      bySubject: normalizedBySubject,
      sessions,
    };
  });
}
