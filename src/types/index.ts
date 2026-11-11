export type Grade = '중1' | '중2' | '중3';

export type Semester = '1학기' | '2학기';

export type ExamType = '중간고사' | '기말고사';

// 과목 순서: 수학 -> 영어 -> 국어 -> 과학
export type Subject = '수학' | '영어' | '국어' | '과학';

export const SUBJECT_ORDER: Subject[] = ['수학', '영어', '국어', '과학'];

export type BookType = '100bal100jung' | 'blacklabel' | 'hybrid';

export type DifficultyLevel = '기본' | '100발100중 실전' | '블랙라벨 Step2' | '블랙라벨 Step3 킬러';

// 주요 중학교 교과서 출판사
export type TextbookPublisher =
  | '미래엔'
  | '천재교육'
  | '비상교육'
  | '동아출판'
  | '지학사'
  | '좋은책신사고'
  | '금성출판사'
  | 'YBM'
  | 'NE능률'
  | '창비'
  | '공통/표준';

export interface SubjectTextbookSetting {
  publisher: TextbookPublisher;
  authorOrEdition?: string; // 예: 미래엔(신항균), 천재(이재영)
  selectedUnits: string[]; // 지정된 시험범위 단원명 목록
  scopeDescription: string; // 예: "1단원 소인수분해 ~ 2단원 일차방정식 (교과서 p.12 ~ p.85)"
  updatedAt: string;
}

export interface Question {
  id: string;
  grade: Grade;
  semester: Semester;
  examType: ExamType;
  subject: Subject;
  unit: string;
  publisher?: TextbookPublisher;
  bookSource: '100bal100jung' | 'blacklabel';
  difficultyLevel: DifficultyLevel;
  stepLevel?: 1 | 2 | 3 | 4; // 단계별 난이도 (1단계 기본 -> 2단계 빈출 -> 3단계 응용 -> 4단계 킬러)
  scoreWeight?: number; // 시험 배점 (예: 4점, 5점, 6점)
  upgradeRound?: number; // 문제 업그레이드 회차 (1차, 2차, 3차 ...)
  title: string;
  questionText: string;
  passage?: string; // 영어/국어 지문 또는 과학 실험 자료
  formulaOrCode?: string;
  options: string[];
  correctAnswerIndex: number; // 0-based
  explanation: string;
  trapPoint: string;
  coreFormula: string;
}

export interface ExamSession {
  id: string;
  title: string;
  grade: Grade;
  semester: Semester;
  examType: ExamType;
  subject: Subject;
  publisher?: TextbookPublisher;
  selectedUnits?: string[]; // 지정된 단원 범위
  scopeDescription?: string;
  bookType: BookType;
  timerMinutes: number;
  totalQuestions: number;
  startedAt: string;
  completedAt?: string;
  answers: Record<number, number>; // questionIndex -> selectedOptionIndex
  flagged: Record<number, boolean>;
  score?: number; // 0 ~ 100
  timeSpentSeconds?: number;
  questions: Question[];
}

export interface WrongNoteItem {
  id: string;
  examId: string;
  examTitle: string;
  grade: Grade;
  semester: Semester;
  examType: ExamType;
  subject: Subject;
  publisher?: TextbookPublisher;
  question: Question;
  userAnswerIndex: number | null;
  createdAt: string;
  isMastered: boolean;
  reviewCount: number;
  studentMemo?: string;
  similarQuestions?: Question[];
}

export interface CharacterStats {
  intelligence: number; // 지력 (수학 풀이로 대폭 상승)
  vocabulary: number;   // 어휘력 (영어/국어 풀이로 상승)
  inquiry: number;      // 탐구력 (과학 풀이로 상승)
  concentration: number;// 집중력 (타이머 실전 완주)
}

export interface CharacterState {
  name: string;
  level: number;
  exp: number;
  maxExp: number;
  stage: 1 | 2 | 3 | 4;
  stats: CharacterStats;
  streakDays: number;
  lastStudyDate: string;
  wisdomBerries: number;
  studyFeverGauge: number; // 0 ~ 100 공부 열공 게이지
  feverModeActive: boolean; // 100% 도달 시 열공 버닝 모드
  totalStudyMinutes: number; // 누적 공부 시간(분)
  badges: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    unlockedAt?: string;
  }>;
}

export interface StudentProfile {
  id: string;
  name: string;
  grade: Grade;
  schoolName?: string;
  // 학생별 고정 유지되는 응시 기준
  activeGrade: Grade;
  activeSemester: Semester;
  activeExamType: ExamType;
  // 과목별 등록된 교과서 출판사 및 시험범위 설정
  textbookSettings: Record<Subject, SubjectTextbookSetting>;
  character: CharacterState;
  wrongNotes: WrongNoteItem[];
  examHistory: ExamSession[];
  createdAt: string;
  lastLoginAt: string;
}
