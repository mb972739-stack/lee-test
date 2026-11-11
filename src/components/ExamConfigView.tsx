import React, { useState, useEffect } from 'react';
import { useStudy } from '../context/StudyContext';
import { Grade, Semester, ExamType, Subject, BookType, SUBJECT_ORDER } from '../types';
import {
  Clock,
  BookOpen,
  Award,
  Zap,
  Flame,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Lock,
  Building2,
  CheckSquare,
  Square,
  SlidersHorizontal,
  BookmarkCheck,
} from 'lucide-react';
import { CHARACTER_STAGES } from '../data/characterConfig';
import { DEFAULT_TEXTBOOK_SETTINGS } from '../data/textbooks';
import { getAvailableUnits, getDefaultUnitsForExam } from '../data/curriculumUnits';
import { getFilteredQuestions } from '../utils/questionEngine';
import { sounds } from '../utils/soundEffects';

interface ExamConfigViewProps {
  onOpenTextbookModal?: (subject?: Subject) => void;
}

export const ExamConfigView: React.FC<ExamConfigViewProps> = ({ onOpenTextbookModal }) => {
  const { currentStudent, startExam, feverGauge, feverModeActive, updateStudentExamTarget } = useStudy();

  // 학생별로 고정 유지되는 학년, 학기, 고사 설정 (영구 저장)
  const [selectedGrade, setSelectedGrade] = useState<Grade>(currentStudent.activeGrade || currentStudent.grade || '중2');
  const [selectedSemester, setSelectedSemester] = useState<Semester>(currentStudent.activeSemester || '1학기');
  const [selectedExamType, setSelectedExamType] = useState<ExamType>(currentStudent.activeExamType || '중간고사');

  const [selectedSubject, setSelectedSubject] = useState<Subject>('수학');
  const [selectedBookType, setSelectedBookType] = useState<BookType>('100bal100jung');
  const [selectedTimer, setSelectedTimer] = useState<number>(30); // 30분 기본

  // 학생 프로필이 전환되거나 외부에서 active 값이 변경될 때 상태 동기화
  useEffect(() => {
    const studentG = currentStudent.activeGrade || currentStudent.grade || '중2';
    const studentS = currentStudent.activeSemester || '1학기';
    const studentE = currentStudent.activeExamType || '중간고사';
    setSelectedGrade(studentG);
    setSelectedSemester(studentS);
    setSelectedExamType(studentE);
  }, [currentStudent.id, currentStudent.activeGrade, currentStudent.activeSemester, currentStudent.activeExamType]);

  // 현재 과목의 등록된 교과서 및 시험범위 설정
  const studentSettings = currentStudent.textbookSettings || DEFAULT_TEXTBOOK_SETTINGS;
  const currentSubjectSetting = studentSettings[selectedSubject] || DEFAULT_TEXTBOOK_SETTINGS[selectedSubject];

  // 현재 선택된 학년, 학기, 과목에 해당하는 교육과정 단원 목록 (선택된 고사 유형 우선 정렬)
  const availableUnits = getAvailableUnits(selectedGrade, selectedSemester, selectedSubject, selectedExamType);

  // 실시간 시험범위 지정 단원 목록
  const [activeUnits, setActiveUnits] = useState<string[]>(() => {
    return getDefaultUnitsForExam(selectedGrade, selectedSemester, selectedExamType, selectedSubject);
  });

  // 학년, 학기, 고사, 과목 변경 시 단원 목록 즉시 자동 재동기화
  useEffect(() => {
    const available = getAvailableUnits(selectedGrade, selectedSemester, selectedSubject, selectedExamType);
    const availableNames = available.map((u) => u.name);
    const savedSetting = studentSettings[selectedSubject];

    // 저장된 설정의 단원이 현재 학년/학기/과목의 단원 목록에 유효하게 속하는지 검증
    if (savedSetting && savedSetting.selectedUnits && savedSetting.selectedUnits.length > 0) {
      const validSaved = savedSetting.selectedUnits.filter((u) => availableNames.includes(u));
      // 저장된 단원이 1개 이상 유효하면 유지
      if (validSaved.length > 0) {
        setActiveUnits(validSaved);
        return;
      }
    }

    // 기본값: 현재 선택된 고사(중간/기말)에 해당하는 단원 자동 추천 선택
    const defaultUnits = getDefaultUnitsForExam(selectedGrade, selectedSemester, selectedExamType, selectedSubject);
    setActiveUnits(defaultUnits);
  }, [selectedSubject, selectedGrade, selectedSemester, selectedExamType, currentStudent.textbookSettings]);

  // 학년 변경 시 즉시 학생 프로필에 영구 고정 저장 및 시험범위 갱신
  const handleGradeChange = (grade: Grade) => {
    setSelectedGrade(grade);
    updateStudentExamTarget({ grade });
    const newUnits = getDefaultUnitsForExam(grade, selectedSemester, selectedExamType, selectedSubject);
    setActiveUnits(newUnits);
    sounds.playClick();
  };

  // 학기 변경 시 즉시 학생 프로필에 영구 고정 저장 및 시험범위 갱신
  const handleSemesterChange = (semester: Semester) => {
    setSelectedSemester(semester);
    updateStudentExamTarget({ semester });
    const newUnits = getDefaultUnitsForExam(selectedGrade, semester, selectedExamType, selectedSubject);
    setActiveUnits(newUnits);
    sounds.playClick();
  };

  // 고사(중간/기말) 변경 시 즉시 학생 프로필에 영구 고정 저장 및 시험범위 갱신
  const handleExamTypeChange = (examType: ExamType) => {
    setSelectedExamType(examType);
    updateStudentExamTarget({ examType });
    const newUnits = getDefaultUnitsForExam(selectedGrade, selectedSemester, examType, selectedSubject);
    setActiveUnits(newUnits);
    sounds.playClick();
  };

  // 과목 변경 시 즉시 시험범위 갱신
  const handleSubjectChange = (subject: Subject) => {
    setSelectedSubject(subject);
    const available = getAvailableUnits(selectedGrade, selectedSemester, subject, selectedExamType);
    const availableNames = available.map((u) => u.name);
    const savedSetting = studentSettings[subject];

    if (savedSetting && savedSetting.selectedUnits && savedSetting.selectedUnits.length > 0) {
      const valid = savedSetting.selectedUnits.filter((u) => availableNames.includes(u));
      if (valid.length > 0) {
        setActiveUnits(valid);
        sounds.playClick();
        return;
      }
    }
    const defaultUnits = getDefaultUnitsForExam(selectedGrade, selectedSemester, selectedExamType, subject);
    setActiveUnits(defaultUnits);
    sounds.playClick();
  };

  // 시험범위 단원 개별 토글
  const toggleUnitScope = (unitName: string) => {
    sounds.playClick();
    setActiveUnits((prev) =>
      prev.includes(unitName) ? prev.filter((u) => u !== unitName) : [...prev, unitName]
    );
  };

  // 시험범위 단원 전체 선택
  const handleSelectAllUnits = () => {
    sounds.playClick();
    setActiveUnits(availableUnits.map((u) => u.name));
  };

  // 중간고사 표준 범위 단원만 즉시 선택
  const handleSelectMidtermUnits = () => {
    sounds.playClick();
    const midtermUnits = getDefaultUnitsForExam(selectedGrade, selectedSemester, '중간고사', selectedSubject);
    setActiveUnits(midtermUnits);
  };

  // 기말고사 표준 범위 단원만 즉시 선택
  const handleSelectFinalUnits = () => {
    sounds.playClick();
    const finalUnits = getDefaultUnitsForExam(selectedGrade, selectedSemester, '기말고사', selectedSubject);
    setActiveUnits(finalUnits);
  };

  // 시험범위 단원 전체 해제
  const handleClearUnits = () => {
    sounds.playClick();
    setActiveUnits([]);
  };

  const currentStage = CHARACTER_STAGES.find((s) => s.stage === currentStudent.character.stage) || CHARACTER_STAGES[0];

  // 현재 설정된 학년/학기/고사/과목/단원 범위에 맞춘 실시간 출제 문항
  const previewQuestions = getFilteredQuestions({
    grade: selectedGrade,
    semester: selectedSemester,
    examType: selectedExamType,
    subject: selectedSubject,
    bookType: selectedBookType,
    publisher: currentSubjectSetting.publisher,
    selectedUnits: activeUnits.length > 0 ? activeUnits : getDefaultUnitsForExam(selectedGrade, selectedSemester, selectedExamType, selectedSubject),
  });

  const handleStart = () => {
    const finalUnits = activeUnits.length > 0
      ? activeUnits
      : getDefaultUnitsForExam(selectedGrade, selectedSemester, selectedExamType, selectedSubject);

    startExam({
      grade: selectedGrade,
      semester: selectedSemester,
      examType: selectedExamType,
      subject: selectedSubject,
      bookType: selectedBookType,
      timerMinutes: selectedTimer,
      publisher: currentSubjectSetting.publisher,
      selectedUnits: finalUnits,
      scopeDescription: currentSubjectSetting.scopeDescription,
      upgradeRound: 1,
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Hero Motivation Banner with Active Character */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{currentStudent.name} 학생 맞춤형 실전 모의고사 훈련실</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              실전 시험 타이머와 OMR 마킹으로<br />
              내신 100점 만점에 도전하세요!
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200/90 leading-relaxed">
              에듀원 <strong>100발100중</strong> 빈출 기출과 <strong>블랙라벨</strong> 1등급 심화 킬러 문제를 교과서 출판사와 시험범위에 맞춰 출제합니다.
              틀린 문제는 <strong>오답노트</strong>에 자동 기록되며 유사 변형 문제로 완전 학습을 지원합니다.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-indigo-200">
              <div className="flex items-center gap-1.5">
                <Flame className={`w-4 h-4 ${feverModeActive ? 'text-amber-400 animate-pulse' : 'text-indigo-400'}`} />
                <span>열공 게이지: <strong className="text-white">{feverGauge}%</strong></span>
              </div>
              <span>·</span>
              <div>
                파트너: <strong className="text-white">{currentStage.name} (Lv.{currentStudent.character.level})</strong>
              </div>
              <span>·</span>
              <div>
                누적 공부: <strong className="text-white">{currentStudent.character.totalStudyMinutes}분</strong>
              </div>
            </div>
          </div>

          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-white/10 border-2 border-indigo-400/40 p-1 shrink-0 self-center md:self-auto shadow-inner">
            <img
              src={currentStage.imageSrc}
              alt={currentStage.name}
              className="w-full h-full object-cover rounded-xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>

      {/* Main Exam Setup Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          {/* Step 1: 학년 / 학기 / 시험 구분 (학생별 영구 고정) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <span>01. 학년 및 시험 목표 설정</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  학생별 영구 고정됨
                </span>
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:inline">한 번 선택 시 자동 유지</span>
            </div>

            {/* 학년 선택 */}
            <div className="grid grid-cols-3 gap-3">
              {(['중1', '중2', '중3'] as Grade[]).map((grade) => (
                <button
                  key={grade}
                  onClick={() => handleGradeChange(grade)}
                  className={`py-3 px-4 rounded-xl border text-center transition-all font-bold text-sm cursor-pointer ${
                    selectedGrade === grade
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 shadow-xs ring-1 ring-indigo-500'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {grade}
                </button>
              ))}
            </div>

            {/* 학기 선택 */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              {(['1학기', '2학기'] as Semester[]).map((sem) => (
                <button
                  key={sem}
                  onClick={() => handleSemesterChange(sem)}
                  className={`py-2.5 px-4 rounded-xl border text-center transition-all font-semibold text-xs cursor-pointer ${
                    selectedSemester === sem
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 ring-1 ring-indigo-500'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {sem}
                </button>
              ))}
            </div>

            {/* 시험 구분 선택 */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              {(['중간고사', '기말고사'] as ExamType[]).map((exam) => (
                <button
                  key={exam}
                  onClick={() => handleExamTypeChange(exam)}
                  className={`py-2.5 px-4 rounded-xl border text-center transition-all font-semibold text-xs cursor-pointer ${
                    selectedExamType === exam
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 ring-1 ring-indigo-500'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {exam}
                </button>
              ))}
            </div>

            <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>
                <strong>{currentStudent.name}</strong> 학생의 타깃: <strong>{selectedGrade} · {selectedSemester} · {selectedExamType}</strong> (브라우저를 닫거나 다시 로그인해도 고정 유지됩니다)
              </span>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Step 2: 과목 선택 (수학 -> 영어 -> 국어 -> 과학 순서 엄수) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                02. 응시 과목 (수학 · 영어 · 국어 · 과학 순)
              </div>
              <span className="text-[11px] text-slate-400">지정 과목 표준 순서</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {SUBJECT_ORDER.map((subject, idx) => (
                <button
                  key={subject}
                  onClick={() => handleSubjectChange(subject)}
                  className={`py-3 px-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    selectedSubject === subject
                      ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 ring-1 ring-indigo-500 font-bold shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 font-medium'
                  }`}
                >
                  <span className="text-[10px] text-slate-400 font-semibold">0{idx + 1}</span>
                  <span className="text-sm">{subject}</span>
                </button>
              ))}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Step 3: 교과서 출판사 & 시험범위 단원 지정 카드 (요구사항 8, 9, 10) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-indigo-600" />
                <span>03. 교과서 출판사 &amp; 시험범위 지정</span>
              </div>
              {onOpenTextbookModal && (
                <button
                  type="button"
                  onClick={() => onOpenTextbookModal(selectedSubject)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>출판사/범위 등록 관리</span>
                </button>
              )}
            </div>

            {/* 현재 등록된 교과서 요약 배너 */}
            <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-indigo-600 text-white text-[11px] font-bold">
                    {selectedSubject} 교과서
                  </span>
                  <span className="font-bold text-sm text-slate-900">
                    {currentSubjectSetting.publisher}
                  </span>
                  <span className="text-xs text-slate-500">
                    ({selectedGrade} {selectedSemester})
                  </span>
                </div>
                <div className="text-xs text-slate-600">
                  범위 메모: <span className="font-semibold text-slate-800">{currentSubjectSetting.scopeDescription || '전 범위'}</span>
                </div>
              </div>

              {onOpenTextbookModal && (
                <button
                  type="button"
                  onClick={() => onOpenTextbookModal(selectedSubject)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 text-xs font-bold shrink-0 transition-colors cursor-pointer shadow-2xs"
                >
                  출판사 변경
                </button>
              )}
            </div>

            {/* 실시간 단원 범위 체크박스 선택기 */}
            <div className="space-y-2 pt-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <BookmarkCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>이번 시험에 출제할 단원 선택 ({activeUnits.length} / {availableUnits.length}개 선택됨)</span>
                </span>
                <div className="flex items-center flex-wrap gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={handleSelectMidtermUnits}
                    className={`px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                      selectedExamType === '중간고사'
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    중간고사 범위
                  </button>
                  <button
                    type="button"
                    onClick={handleSelectFinalUnits}
                    className={`px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                      selectedExamType === '기말고사'
                        ? 'bg-purple-50 border-purple-300 text-purple-700 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    기말고사 범위
                  </button>
                  <button
                    type="button"
                    onClick={handleSelectAllUnits}
                    className="text-indigo-600 hover:underline font-bold cursor-pointer"
                  >
                    전체 선택
                  </button>
                  <span className="text-slate-300">·</span>
                  <button
                    type="button"
                    onClick={handleClearUnits}
                    className="text-slate-500 hover:underline cursor-pointer"
                  >
                    전체 해제
                  </button>
                </div>
              </div>

              {/* 단원 목록 리스트 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto p-1 border border-slate-200/80 rounded-xl bg-slate-50/50">
                {availableUnits.map((unit) => {
                  const isChecked = activeUnits.includes(unit.name);
                  const isMidterm = unit.examType === '중간고사';
                  return (
                    <div
                      key={unit.id}
                      onClick={() => toggleUnitScope(unit.name)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isChecked
                          ? 'border-indigo-400 bg-white text-indigo-950 font-bold shadow-2xs ring-1 ring-indigo-200'
                          : 'border-slate-200 bg-white/70 hover:bg-white text-slate-600 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-indigo-600 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs truncate">{unit.name}</span>
                            {unit.examType && (
                              <span
                                className={`text-[9px] px-1.5 py-0.2 rounded font-semibold shrink-0 ${
                                  isMidterm
                                    ? 'bg-sky-50 text-sky-700 border border-sky-200'
                                    : 'bg-purple-50 text-purple-700 border border-purple-200'
                                }`}
                              >
                                {unit.examType}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded shrink-0 ml-1.5 ${isChecked ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-400'}`}>
                        {isChecked ? '출제 포함' : '제외'}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                * 체크된 지정 범위 내에서만 문제가 100% 엄격하게 필터링되어 출제됩니다. (다른 단원 및 학년 문제 완전 차단)
              </p>
            </div>

            {/* 실시간 출제 문항 즉시 반영 미리보기 */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>출제 문항 실시간 준비 완료 ({previewQuestions.length}문항)</span>
                  </span>
                </div>
                <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                  {selectedGrade} {selectedSemester} {selectedExamType} 기준
                </span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {previewQuestions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-2.5 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 shadow-2xs hover:border-indigo-300 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white font-bold text-[11px] shrink-0">
                        {idx + 1}번
                      </span>
                      <span className="font-semibold text-xs text-slate-800 truncate">
                        {q.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold truncate max-w-32">
                        {q.unit}
                      </span>
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        q.bookSource === 'blacklabel' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {q.bookSource === 'blacklabel' ? '블랙라벨 1등급' : '100발100중'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                <span>💡 학년·학기·단원을 변경하면 위 문제들이 <strong>즉시 해당 범위 문제로 새로고침</strong>됩니다.</span>
                <span className="font-bold text-indigo-600">{selectedGrade} {selectedSubject}</span>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Step 4: 출제 교재 기준 선택 (에듀원 100발100중 vs 블랙라벨) */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              04. 문제집 출제 기준
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => {
                  setSelectedBookType('100bal100jung');
                  sounds.playClick();
                }}
                className={`p-3.5 rounded-xl border text-left transition-all relative cursor-pointer ${
                  selectedBookType === '100bal100jung'
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 ring-1 ring-emerald-500'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold text-sm flex items-center justify-between text-slate-900">
                  <span>100발100중 실전</span>
                  {selectedBookType === '100bal100jung' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  에듀원 내신 기출 빈출 유형 중심, 교과서 100점 만점 대비
                </p>
              </button>

              <button
                onClick={() => {
                  setSelectedBookType('blacklabel');
                  sounds.playClick();
                }}
                className={`p-3.5 rounded-xl border text-left transition-all relative cursor-pointer ${
                  selectedBookType === 'blacklabel'
                    ? 'border-purple-600 bg-purple-50/70 text-purple-950 ring-1 ring-purple-500'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold text-sm flex items-center justify-between text-slate-900">
                  <span>블랙라벨 1등급 심화</span>
                  {selectedBookType === 'blacklabel' && (
                    <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  종합적 사고력 및 변별력 킬러 문항, 상위 1% 도전
                </p>
              </button>

              <button
                onClick={() => {
                  setSelectedBookType('hybrid');
                  sounds.playClick();
                }}
                className={`p-3.5 rounded-xl border text-left transition-all relative cursor-pointer ${
                  selectedBookType === 'hybrid'
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 ring-1 ring-indigo-500'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold text-sm flex items-center justify-between text-slate-900">
                  <span>하이브리드 종합</span>
                  {selectedBookType === 'hybrid' && (
                    <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  100발100중 실전 기출 + 블랙라벨 킬러 문항 골고루 출제
                </p>
              </button>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Step 5: 시험 제한시간 설정 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                05. 실전 시험 제한시간 타이머
              </div>
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                종료 5분/1분 전 알림
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { m: 10, label: '10분 벼락치기', desc: '단원 핵심 점검' },
                { m: 20, label: '20분 유형완성', desc: '빈출 집중 훈련' },
                { m: 30, label: '30분 모의평가', desc: '중간 실전 모의' },
                { m: 45, label: '45분 본시험 시간', desc: '실제 중학 시험시간' },
              ].map((t) => (
                <button
                  key={t.m}
                  onClick={() => {
                    setSelectedTimer(t.m);
                    sounds.playClick();
                  }}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedTimer === t.m
                      ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 ring-1 ring-indigo-500 font-bold'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 font-medium'
                  }`}
                >
                  <div className="text-sm font-bold">{t.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Summary & Start Action Card */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base">시험 응시 요약</h3>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">수험자</span>
                <span className="font-bold text-slate-900">{currentStudent.name} ({currentStudent.grade})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">목표 시험 (고정)</span>
                <span className="font-bold text-indigo-700">{selectedGrade} {selectedSemester} {selectedExamType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">응시 과목</span>
                <span className="font-bold text-indigo-600">{selectedSubject}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">교과서 출판사</span>
                <span className="font-bold text-slate-900">{currentSubjectSetting.publisher}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">지정 단원 범위</span>
                <span className="font-bold text-slate-900">{activeUnits.length}개 단원 선택됨</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">출제 교재</span>
                <span className="font-bold text-slate-900">
                  {selectedBookType === 'blacklabel'
                    ? '블랙라벨 1등급 심화'
                    : selectedBookType === '100bal100jung'
                    ? '100발100중 실전 기출'
                    : '하이브리드 종합'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">제한 시간</span>
                <span className="font-bold text-slate-900">{selectedTimer}분 카운트다운</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">OMR 카드</span>
                <span className="font-semibold text-emerald-600">실시간 마킹 지원</span>
              </div>
            </div>

            <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 text-xs text-indigo-900 space-y-1">
              <div className="font-bold flex items-center gap-1 text-indigo-700">
                <Zap className="w-3.5 h-3.5" />
                파트너 특수 효과: {currentStage.title}
              </div>
              <p className="text-[11px] text-indigo-800/80 leading-relaxed">
                {currentStage.specialPerk}
              </p>
            </div>

            <button
              onClick={handleStart}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>모의고사 시작하기</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Tips card */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs text-slate-600 space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span>성장 보상 팁</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-500 text-[11px] leading-relaxed">
              <li>제한 시간 내 완주 시 집중력 스탯 및 열공 게이지 대폭 충전</li>
              <li>틀린 문제는 제출 즉시 오답노트에 자동 정리됩니다.</li>
              <li>우수 점수 달성 시 블랙라벨 최고난도 킬러 문항으로 업그레이드!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
