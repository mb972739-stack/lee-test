import { Subject, TextbookPublisher, SubjectTextbookSetting, Grade, Semester, ExamType } from '../types';
import { getDefaultUnitsForExam } from './curriculumUnits';

export interface PublisherOption {
  publisher: TextbookPublisher;
  authorNote: string;
  isPopular?: boolean;
}

export const PUBLISHER_OPTIONS_BY_SUBJECT: Record<Subject, PublisherOption[]> = {
  수학: [
    { publisher: '미래엔', authorNote: '신항균 외', isPopular: true },
    { publisher: '천재교육', authorNote: '이준열 외', isPopular: true },
    { publisher: '비상교육', authorNote: '김원경 외', isPopular: true },
    { publisher: '동아출판', authorNote: '강옥기 외', isPopular: true },
    { publisher: '좋은책신사고', authorNote: '고성은 외' },
    { publisher: '지학사', authorNote: '신동윤 외' },
    { publisher: '금성출판사', authorNote: '배종수 외' },
    { publisher: '공통/표준', authorNote: '전국 공통 표준 교육과정' },
  ],
  영어: [
    { publisher: '동아출판', authorNote: '윤정미 외', isPopular: true },
    { publisher: '천재교육', authorNote: '이재영 외', isPopular: true },
    { publisher: 'YBM', authorNote: '송미정 / 박준언 외', isPopular: true },
    { publisher: '비상교육', authorNote: '김진완 외', isPopular: true },
    { publisher: 'NE능률', authorNote: '김성곤 외', isPopular: true },
    { publisher: '미래엔', authorNote: '최연희 외' },
    { publisher: '지학사', authorNote: '양현권 외' },
    { publisher: '공통/표준', authorNote: '전국 공통 표준 교육과정' },
  ],
  국어: [
    { publisher: '천재교육', authorNote: '박영목 / 노미숙 외', isPopular: true },
    { publisher: '미래엔', authorNote: '신유식 외', isPopular: true },
    { publisher: '비상교육', authorNote: '김태철 외', isPopular: true },
    { publisher: '동아출판', authorNote: '이은영 외' },
    { publisher: '창비', authorNote: '이도영 외' },
    { publisher: '지학사', authorNote: '이삼형 외' },
    { publisher: '공통/표준', authorNote: '전국 공통 표준 교육과정' },
  ],
  과학: [
    { publisher: '미래엔', authorNote: '김성진 외', isPopular: true },
    { publisher: '비상교육', authorNote: '임태훈 외', isPopular: true },
    { publisher: '천재교육', authorNote: '노태희 외', isPopular: true },
    { publisher: '동아출판', authorNote: '김희백 외' },
    { publisher: '지학사', authorNote: '정대홍 외' },
    { publisher: '금성출판사', authorNote: '김익균 외' },
    { publisher: '공통/표준', authorNote: '전국 공통 표준 교육과정' },
  ],
};

// 학생의 학년, 학기, 고사 구분에 맞춘 표준 교과서 및 단원 설정 생성 함수
export function getStandardTextbookSettings(
  grade: Grade = '중2',
  semester: Semester = '1학기',
  examType: ExamType = '중간고사'
): Record<Subject, SubjectTextbookSetting> {
  return {
    수학: {
      publisher: '미래엔',
      authorOrEdition: '신항균 외',
      selectedUnits: getDefaultUnitsForExam(grade, semester, examType, '수학'),
      scopeDescription: `${grade} ${semester} ${examType} 표준 범위`,
      updatedAt: new Date().toISOString(),
    },
    영어: {
      publisher: '동아출판',
      authorOrEdition: '윤정미 외',
      selectedUnits: getDefaultUnitsForExam(grade, semester, examType, '영어'),
      scopeDescription: `${grade} ${semester} ${examType} 표준 범위`,
      updatedAt: new Date().toISOString(),
    },
    국어: {
      publisher: '천재교육',
      authorOrEdition: '박영목 외',
      selectedUnits: getDefaultUnitsForExam(grade, semester, examType, '국어'),
      scopeDescription: `${grade} ${semester} ${examType} 표준 범위`,
      updatedAt: new Date().toISOString(),
    },
    과학: {
      publisher: '미래엔',
      authorOrEdition: '김성진 외',
      selectedUnits: getDefaultUnitsForExam(grade, semester, examType, '과학'),
      scopeDescription: `${grade} ${semester} ${examType} 표준 범위`,
      updatedAt: new Date().toISOString(),
    },
  };
}

export const DEFAULT_TEXTBOOK_SETTINGS: Record<Subject, SubjectTextbookSetting> = getStandardTextbookSettings(
  '중2',
  '1학기',
  '중간고사'
);
