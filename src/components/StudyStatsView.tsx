import React, { useMemo, useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { SUBJECT_ORDER } from '../types';
import { CHARACTER_STAGES } from '../data/characterConfig';
import {
  buildDailyLogMap,
  buildDailyReportSeries,
  formatShortDateLabel,
  formatStudyDuration,
  getLocalDateKey,
  getSessionCorrectCount,
  getSessionDurationSeconds,
  shiftDateKey,
} from '../utils/dailyReport';
import {
  DailyAccuracyChart,
  DailyCharacterGrowthChart,
  DailyStudyTimeChart,
} from './DailyReportCharts';
import {
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';

const DAILY_GOAL_MINUTES = 30;

export const StudyStatsView: React.FC = () => {
  const { currentStudent, setActiveTab } = useStudy();
  const todayKey = getLocalDateKey();

  const [selectedDate, setSelectedDate] = useState<string>(todayKey);
  const [rangeDays, setRangeDays] = useState<7 | 14>(7);
  const [subjectScope, setSubjectScope] = useState<'day' | 'all'>('day');
  const [imgError, setImgError] = useState(false);

  // Keep the chart window ending on today or the selectedDate if user stepped past today?
  // Always anchor window end so selectedDate is visible inside [end - rangeDays + 1, end]
  const windowEndDate = useMemo(() => {
    const minWindowStart = shiftDateKey(todayKey, -(rangeDays - 1));
    if (selectedDate >= minWindowStart && selectedDate <= todayKey) {
      return todayKey;
    }
    if (selectedDate > todayKey) return todayKey;
    return shiftDateKey(selectedDate, rangeDays - 1) > todayKey
      ? todayKey
      : shiftDateKey(selectedDate, Math.floor(rangeDays / 2));
  }, [selectedDate, todayKey, rangeDays]);

  const series = useMemo(
    () => buildDailyReportSeries(currentStudent, windowEndDate, rangeDays),
    [currentStudent, windowEndDate, rangeDays]
  );

  const selectedPoint = useMemo(() => {
    const found = series.find((p) => p.date === selectedDate);
    if (found) return found;
    // Fallback if selectedDate is outside current chart window
    return buildDailyReportSeries(currentStudent, selectedDate, 1)[0];
  }, [series, selectedDate, currentStudent]);

  // Latest active study date for quick jump in empty state
  const latestActiveDate = useMemo(() => {
    const map = buildDailyLogMap(currentStudent);
    const dates = Array.from(map.keys()).sort();
    return dates.length > 0 ? dates[dates.length - 1] : null;
  }, [currentStudent]);

  const selectedDateMeta = formatShortDateLabel(selectedDate);
  const isTodaySelected = selectedDate === todayKey;

  const char = currentStudent.character;
  const displayStageNum = selectedPoint.endStage || char.stage;
  const displayStage =
    CHARACTER_STAGES.find((s) => s.stage === displayStageNum) || CHARACTER_STAGES[0];
  const expPercent = Math.min(100, Math.round((char.exp / Math.max(1, char.maxExp)) * 100));

  // Daily goal progress for selected day
  const selectedStudyMinutes = selectedPoint.studySeconds / 60;
  const goalProgressPercent = Math.min(
    100,
    Math.round((selectedStudyMinutes / DAILY_GOAL_MINUTES) * 100)
  );
  const goalMet = selectedStudyMinutes >= DAILY_GOAL_MINUTES;

  // Period aggregate metrics
  const periodStudySeconds = series.reduce((sum, p) => sum + p.studySeconds, 0);
  const activeStudyDays = series.filter((p) => p.studySeconds > 0).length;
  const periodSolved = series.reduce((sum, p) => sum + p.questionsSolved, 0);
  const periodCorrect = series.reduce((sum, p) => sum + p.correctCount, 0);
  const periodAccuracy =
    periodSolved > 0 ? Math.round((periodCorrect / periodSolved) * 1000) / 10 : null;

  // Accuracy status descriptor (never hue-only)
  const getAccuracyStatus = (acc: number | null) => {
    if (acc === null) {
      return {
        label: '응시 기록 없음',
        toneClass: 'text-slate-500',
      };
    }
    if (acc >= 80) {
      return {
        label: '우수 (80% 이상 달성)',
        toneClass: 'text-emerald-700',
      };
    }
    if (acc >= 60) {
      return {
        label: '안정권 (오답 복습 권장)',
        toneClass: 'text-amber-700',
      };
    }
    return {
      label: '집중 보완 필요',
      toneClass: 'text-rose-700',
    };
  };

  const accuracyStatus = getAccuracyStatus(selectedPoint.accuracyPercent);

  const history = currentStudent.examHistory || [];
  const totalWrongNotes = currentStudent.wrongNotes.length;
  const masteredNotesCount = currentStudent.wrongNotes.filter((n) => n.isMastered).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Report Header & Date Controls */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-indigo-600">
            일간 학습 리포트 대시보드
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight text-balance">
            {currentStudent.name} 학생의 학습 성장 기록
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span>{currentStudent.schoolName || '중학교'}</span>
            <span aria-hidden="true">·</span>
            <span>
              {currentStudent.activeGrade || currentStudent.grade}{' '}
              {currentStudent.activeSemester || '1학기'}{' '}
              {currentStudent.activeExamType || '중간고사'}
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1 text-amber-700 font-semibold tabular-nums">
              <Flame className="w-3.5 h-3.5" />
              연속 학습 {char.streakDays}일째
            </span>
          </div>
        </div>

        {/* Date Picker & Period Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Stepper */}
          <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
            <button
              type="button"
              onClick={() => setSelectedDate(shiftDateKey(selectedDate, -1))}
              aria-label="이전 날짜"
              className="p-1.5 rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <label className="relative flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-slate-800 font-mono tabular-nums cursor-pointer whitespace-nowrap">
              <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>
                {selectedDateMeta.fullDate}
                {isTodaySelected ? ' · 오늘' : ''}
              </span>
              <input
                type="date"
                value={selectedDate}
                max={todayKey}
                onChange={(e) => {
                  if (e.target.value) setSelectedDate(e.target.value);
                }}
                aria-label="리포트 날짜 선택"
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </label>

            <button
              type="button"
              onClick={() => {
                if (selectedDate < todayKey) {
                  setSelectedDate(shiftDateKey(selectedDate, 1));
                }
              }}
              disabled={selectedDate >= todayKey}
              aria-label="다음 날짜"
              className="p-1.5 rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {!isTodaySelected && (
            <button
              type="button"
              onClick={() => setSelectedDate(todayKey)}
              className="py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 whitespace-nowrap shrink-0 cursor-pointer"
            >
              오늘로 이동
            </button>
          )}

          {/* 7-day / 14-day Segmented Control */}
          <div
            className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl"
            role="group"
            aria-label="조회 기간"
          >
            <button
              type="button"
              onClick={() => setRangeDays(7)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                rangeDays === 7
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              최근 7일
            </button>
            <button
              type="button"
              onClick={() => setRangeDays(14)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                rangeDays === 14
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              최근 14일
            </button>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('exam_config')}
            className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            모의고사 응시하기
          </button>
        </div>
      </section>

      {/* Hero Summary Strip: Selected Date Core 3 Metrics */}
      <section
        aria-label="선택한 날짜 핵심 지표"
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch"
      >
        {/* KPI 1: 공부한 시간 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              {isTodaySelected ? '오늘' : selectedDateMeta.shortDate} 공부한 시간
            </span>
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {formatStudyDuration(selectedPoint.studySeconds)}
            </div>
            <div className="text-xs text-slate-500 tabular-nums">
              모의고사 {selectedPoint.examsCompleted}회 완주 · 누적 총 {char.totalStudyMinutes}분
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <span className={goalMet ? 'font-semibold text-emerald-700' : 'text-slate-600'}>
                {goalMet
                  ? `일일 목표 달성 (${DAILY_GOAL_MINUTES}분 이상)`
                  : `일일 목표 ${DAILY_GOAL_MINUTES}분 기준`}
              </span>
              <span className="font-mono font-bold tabular-nums text-slate-800">
                {goalProgressPercent}%
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  goalMet ? 'bg-emerald-600' : 'bg-indigo-600'
                }`}
                style={{ width: `${goalProgressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* KPI 2: 정답률 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              {isTodaySelected ? '오늘' : selectedDateMeta.shortDate} 정답률
            </span>
            <Target className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {selectedPoint.accuracyPercent !== null
                ? `${selectedPoint.accuracyPercent}%`
                : '-- %'}
            </div>
            <div className="text-xs text-slate-500 tabular-nums">
              {selectedPoint.questionsSolved > 0
                ? `${selectedPoint.questionsSolved}문항 중 ${selectedPoint.correctCount}문항 정답`
                : '선택한 날짜에 푼 모의고사 문항이 없습니다'}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <span className={`font-semibold inline-flex items-center gap-1 ${accuracyStatus.toneClass}`}>
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>{accuracyStatus.label}</span>
            </span>
            <span className="font-mono tabular-nums text-slate-500">
              {rangeDays}일 평균 {periodAccuracy !== null ? `${periodAccuracy}%` : '-'}
            </span>
          </div>
        </div>

        {/* KPI 3: 성장한 캐릭터 레벨 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              성장한 캐릭터 레벨
            </span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden shrink-0 flex items-center justify-center">
              {!imgError ? (
                <img
                  src={displayStage.imageSrc}
                  alt={`${displayStage.name} 캐릭터 일러스트`}
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-indigo-600">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-[10px] font-bold">Lv.{selectedPoint.endLevel}</span>
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums flex items-baseline gap-2">
                <span>Lv.{selectedPoint.endLevel}</span>
                {selectedPoint.levelGained > 0 ? (
                  <span className="text-xs font-bold text-emerald-700">
                    (+{selectedPoint.levelGained} Lv 성장)
                  </span>
                ) : (
                  <span className="text-xs font-medium text-slate-500">
                    (시작 Lv.{selectedPoint.startLevel})
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-600 truncate mt-0.5">
                {displayStage.stage}단계 {displayStage.name} · 오늘 +{selectedPoint.expGained} EXP
              </div>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">현재 레벨 경험치 (Lv.{char.level})</span>
              <span className="font-mono font-bold tabular-nums text-slate-800">
                {char.exp} / {char.maxExp} EXP ({expPercent}%)
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-300"
                style={{ width: `${expPercent}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Period Micro-Summary Line */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-slate-500">
        <div>
          최근 {rangeDays}일 요약: 학습 활동 {activeStudyDays}일 · 총 공부{' '}
          <strong className="text-slate-800 font-mono tabular-nums">
            {formatStudyDuration(periodStudySeconds)}
          </strong>{' '}
          · 풀이 문항{' '}
          <strong className="text-slate-800 font-mono tabular-nums">
            {periodSolved}문항
          </strong>
        </div>
        <div>
          전체 오답 정복{' '}
          <strong className="text-slate-800 font-mono tabular-nums">
            {masteredNotesCount} / {totalWrongNotes}개
          </strong>
        </div>
      </div>

      {/* Primary Charts Grid: Study Time & Accuracy */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        <DailyStudyTimeChart
          series={series}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          dailyGoalMinutes={DAILY_GOAL_MINUTES}
        />
        <DailyAccuracyChart
          series={series}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
      </section>

      {/* Full-Width Chart 3: Character Level Growth & Daily EXP Timeline */}
      <section>
        <DailyCharacterGrowthChart
          series={series}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
      </section>

      {/* Lower Detail Section: Subject Breakdown + Selected Day Activity Log */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Subject Performance Breakdown (수학 -> 영어 -> 국어 -> 과학) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">과목별 성취도</h3>
              <p className="text-xs text-slate-500 mt-0.5">표준 순서 (수학 · 영어 · 국어 · 과학)</p>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setSubjectScope('day')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  subjectScope === 'day'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                선택일
              </button>
              <button
                type="button"
                onClick={() => setSubjectScope('all')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  subjectScope === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                전체 누적
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {SUBJECT_ORDER.map((sub) => {
              const daySub = selectedPoint.bySubject[sub];
              const allSubjectExams = history.filter((h) => h.subject === sub);
              const allSolved = allSubjectExams.reduce(
                (acc, s) => acc + (s.totalQuestions || s.questions.length),
                0
              );
              const allCorrect = allSubjectExams.reduce(
                (acc, s) => acc + getSessionCorrectCount(s),
                0
              );
              const allSeconds = allSubjectExams.reduce(
                (acc, s) => acc + getSessionDurationSeconds(s),
                0
              );

              const solved = subjectScope === 'day' ? daySub?.questionsSolved || 0 : allSolved;
              const correct = subjectScope === 'day' ? daySub?.correctCount || 0 : allCorrect;
              const seconds = subjectScope === 'day' ? daySub?.studySeconds || 0 : allSeconds;
              const examsCount =
                subjectScope === 'day' ? daySub?.examsCompleted || 0 : allSubjectExams.length;
              const acc = solved > 0 ? Math.round((correct / solved) * 1000) / 10 : null;
              const wrongCount = currentStudent.wrongNotes.filter((n) => n.subject === sub).length;

              return (
                <div key={sub} className="py-3.5 first:pt-1 last:pb-1 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{sub}</span>
                    <span className="text-slate-600 font-mono tabular-nums">
                      {acc !== null ? `정답률 ${acc}% (${correct}/${solved})` : '응시 기록 없음'}
                    </span>
                  </div>

                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        acc === null
                          ? 'bg-slate-200'
                          : acc >= 80
                          ? 'bg-emerald-600'
                          : acc >= 60
                          ? 'bg-indigo-600'
                          : 'bg-amber-600'
                      }`}
                      style={{ width: `${acc ?? 0}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 tabular-nums">
                    <span>
                      응시 {examsCount}회 · 공부 {formatStudyDuration(seconds)}
                    </span>
                    <span>누적 오답노트 {wrongCount}개</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Date Activity & Exam Sessions */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {selectedDateMeta.fullDate} 학습 상세 내역
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
                모의고사 {selectedPoint.examsCompleted}회 · 오답 정복{' '}
                {selectedPoint.wrongNotesMastered}개 · 지혜의 열매 {selectedPoint.berriesFed}회 급여
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('character')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" />
              <span>캐릭터 성장실 보기</span>
            </button>
          </div>

          {!selectedPoint.hasActivity && selectedPoint.sessions.length === 0 ? (
            <div className="py-10 px-4 text-center space-y-3">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-800">
                  {selectedDateMeta.shortDate} ({selectedDateMeta.weekday})에는 학습 기록이 없습니다
                </p>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  실전 모의고사를 완료하거나 오답노트를 복습하면 공부 시간, 문항별 정답률,
                  캐릭터 레벨 성장 내역이 이 날짜에 자동으로 기록됩니다.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('exam_config')}
                  className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <span>오늘 모의고사 시작하기</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                {latestActiveDate && latestActiveDate !== selectedDate && (
                  <button
                    type="button"
                    onClick={() => setSelectedDate(latestActiveDate)}
                    className="py-2 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs whitespace-nowrap cursor-pointer"
                  >
                    최근 학습일 ({formatShortDateLabel(latestActiveDate).shortDate}) 보기
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedPoint.sessions.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {selectedPoint.sessions.map((session) => {
                    const correct = getSessionCorrectCount(session);
                    const total = session.totalQuestions || session.questions.length;
                    const acc = total > 0 ? Math.round((correct / total) * 1000) / 10 : 0;
                    const durSec = getSessionDurationSeconds(session);
                    const completedTime = session.completedAt || session.startedAt;
                    const timeStr = new Date(completedTime).toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <div
                        key={session.id}
                        className="py-3.5 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="text-sm font-bold text-slate-900 truncate">
                            {session.title}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            <span>{session.subject}</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono tabular-nums">{timeStr} 완료</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono tabular-nums">
                              소요 {formatStudyDuration(durSec)}
                            </span>
                            {typeof session.characterLevelBefore === 'number' &&
                              typeof session.characterLevelAfter === 'number' && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span className="font-mono tabular-nums text-indigo-700 font-semibold">
                                    Lv.{session.characterLevelBefore} → Lv.{session.characterLevelAfter}
                                  </span>
                                </>
                              )}
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-baseline sm:items-end justify-between gap-2 shrink-0">
                          <div className="text-base font-extrabold text-slate-900 font-mono tabular-nums">
                            {session.score ?? Math.round(acc)}점
                          </div>
                          <div className="text-xs text-slate-500 font-mono tabular-nums">
                            정답률 {acc}% ({correct}/{total})
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-4 text-xs text-slate-600 leading-relaxed">
                  이 날은 모의고사 응시 대신 캐릭터 돌보기 또는 오답노트 복습으로{' '}
                  <strong className="font-mono tabular-nums text-slate-900">
                    +{selectedPoint.expGained} EXP
                  </strong>
                  를 획득했습니다.
                </div>
              )}

              {(selectedPoint.wrongNotesMastered > 0 || selectedPoint.berriesFed > 0) && (
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs text-slate-600">
                  {selectedPoint.wrongNotesMastered > 0 && (
                    <span>
                      오답노트 정복:{' '}
                      <strong className="text-emerald-700 font-mono tabular-nums">
                        {selectedPoint.wrongNotesMastered}문항 완료
                      </strong>
                    </span>
                  )}
                  {selectedPoint.berriesFed > 0 && (
                    <span>
                      지혜의 열매 급여:{' '}
                      <strong className="text-amber-700 font-mono tabular-nums">
                        {selectedPoint.berriesFed}회
                      </strong>
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
