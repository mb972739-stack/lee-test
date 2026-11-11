import React, { useState, useEffect } from 'react';
import { useStudy } from '../context/StudyContext';
import {
  Clock,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Send,
  AlertTriangle,
  Flame,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export const ExamRoom: React.FC = () => {
  const {
    currentExam,
    answerQuestion,
    toggleFlag,
    submitExam,
    feverGauge,
    feverModeActive,
    chargeFeverGauge,
    setActiveTab,
  } = useStudy();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    return (currentExam?.timerMinutes || 30) * 60;
  });
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // Sync timer and reset index when currentExam changes
  useEffect(() => {
    if (currentExam?.timerMinutes) {
      setSecondsLeft(currentExam.timerMinutes * 60);
      setCurrentIndex(0);
    }
  }, [currentExam?.id, currentExam?.timerMinutes]);

  // Countdown timer interval (pure state update only, zero side-effects inside callback)
  useEffect(() => {
    if (!currentExam) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [currentExam?.id]);

  // Safe side-effect execution: audio alerts, study fever gauge charge, and auto-submit
  useEffect(() => {
    if (!currentExam) return;

    if (secondsLeft === 300 || secondsLeft === 60) {
      sounds.playWarning();
    } else if (secondsLeft === 0) {
      sounds.playWarning();
      submitExam();
    } else if (secondsLeft > 0 && secondsLeft % 20 === 0) {
      chargeFeverGauge(1);
    }
  }, [secondsLeft, currentExam?.id]);

  // Fallback view when no exam is active (placed AFTER all hook declarations)
  if (!currentExam || !currentExam.questions || currentExam.questions.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <p className="text-slate-600">진행 중인 모의고사가 없습니다.</p>
        <button
          onClick={() => setActiveTab('exam_config')}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-sm cursor-pointer"
        >
          새로운 모의고사 시작
        </button>
      </div>
    );
  }

  const totalQuestions = currentExam.questions.length;
  const currentQ = currentExam.questions[currentIndex] || currentExam.questions[0];
  const selectedAnswer = currentExam.answers[currentIndex];
  const isFlagged = Boolean(currentExam.flagged[currentIndex]);

  const totalTimeSeconds = currentExam.timerMinutes * 60;
  const timeProgressPercent = Math.max(0, Math.min(100, ((totalTimeSeconds - secondsLeft) / totalTimeSeconds) * 100));

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(currentExam.answers).length;
  const unAnsweredCount = totalQuestions - answeredCount;

  const isLowTime = secondsLeft < 300; // less than 5 min
  const isCriticalTime = secondsLeft < 60; // less than 1 min

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Top Bar: Exam Title & Countdown Timer */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-18 z-30">
        <div>
          <div className="text-xs font-semibold text-indigo-600 flex items-center gap-1.5">
            <span>{currentExam.grade} {currentExam.semester} {currentExam.examType}</span>
            <span>·</span>
            <span>{currentExam.subject}</span>
            {currentExam.publisher && (
              <>
                <span>·</span>
                <span className="text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded font-medium">
                  {currentExam.publisher} 교과서
                </span>
              </>
            )}
            {currentExam.selectedUnits && currentExam.selectedUnits.length > 0 && (
              <>
                <span>·</span>
                <span className="text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded font-medium">
                  지정 {currentExam.selectedUnits.length}개 단원
                </span>
              </>
            )}
            <span>·</span>
            <span className="font-bold text-slate-800">
              {currentExam.bookType === 'blacklabel' ? '블랙라벨 1등급 심화' : '100발100중 기출'}
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 mt-0.5">
            {currentExam.title}
          </h2>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end">
          {/* Live Study Fever Gauge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <Flame className={`w-4 h-4 ${feverModeActive ? 'text-amber-500 animate-bounce' : 'text-slate-400'}`} />
            <div className="text-xs">
              <span className="text-slate-500 font-medium">열공 게이지: </span>
              <strong className="text-slate-900">{feverGauge}%</strong>
            </div>
          </div>

          {/* Timer Display */}
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono font-bold text-base transition-colors ${
              isCriticalTime
                ? 'bg-red-50 border-red-300 text-red-600 animate-pulse'
                : isLowTime
                ? 'bg-amber-50 border-amber-300 text-amber-700'
                : 'bg-indigo-50 border-indigo-200 text-indigo-700'
            }`}
          >
            <Clock className="w-4 h-4 shrink-0" />
            <span className="tabular-nums tracking-wider">{formatTime(secondsLeft)}</span>
          </div>

          <button
            onClick={() => setShowSubmitConfirm(true)}
            className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>답안 제출</span>
          </button>
        </div>
      </div>

      {/* Main Test Grid: Question Card (Left) + OMR Sheet (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Current Question (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 flex flex-col justify-between space-y-6 min-h-[520px]">
          <div className="space-y-4">
            {/* Question Meta Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-extrabold flex items-center justify-center text-sm">
                  {currentIndex + 1}
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200">
                  {currentQ.grade} {currentQ.semester}
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                  {currentQ.unit}
                </span>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                    currentQ.bookSource === 'blacklabel'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {currentQ.difficultyLevel}
                </span>
              </div>

              <button
                onClick={() => toggleFlag(currentIndex)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-colors ${
                  isFlagged
                    ? 'border-amber-400 bg-amber-50 text-amber-700'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isFlagged ? 'fill-amber-500 text-amber-500' : ''}`} />
                <span>{isFlagged ? '검토 표시됨' : '문제 검토표시'}</span>
              </button>
            </div>

            {/* Question Title & Text */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-600">{currentQ.title}</h3>
              <p className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed whitespace-pre-line">
                {currentQ.questionText}
              </p>
            </div>

            {/* Optional Passage (English / Korean / Science) */}
            {currentQ.passage && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm font-normal text-slate-800 whitespace-pre-line leading-relaxed font-serif">
                {currentQ.passage}
              </div>
            )}

            {/* 5-Choice Options */}
            <div className="space-y-2.5 pt-2">
              {currentQ.options.map((option, optIdx) => {
                const isSelected = selectedAnswer === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => answerQuestion(currentIndex, optIdx)}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 font-bold shadow-xs ring-1 ring-indigo-500'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80 text-slate-700 font-medium'
                    }`}
                  >
                    <span className="text-sm leading-snug">{option}</span>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-3 transition-colors ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-slate-300 group-hover:border-slate-400'
                      }`}
                    >
                      {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="py-2 px-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none font-semibold text-xs text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>이전 문제</span>
            </button>

            <span className="text-xs font-semibold text-slate-500 tabular-nums">
              {currentIndex + 1} / {totalQuestions}
            </span>

            <button
              onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
              disabled={currentIndex === totalQuestions - 1}
              className="py-2 px-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none font-semibold text-xs text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>다음 문제</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Interactive OMR Sheet (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-indigo-600" />
              <h4 className="font-extrabold text-sm text-slate-900">실시간 OMR 카드</h4>
            </div>
            <div className="text-[11px] text-slate-500">
              작성: <strong className="text-indigo-600">{answeredCount}</strong> / {totalQuestions}
            </div>
          </div>

          {/* Quick instructions */}
          <p className="text-[11px] text-slate-500 leading-tight">
            문항 번호나 보기를 누르면 해당 문항으로 바로 이동하거나 마킹할 수 있습니다.
          </p>

          {/* OMR Grid Rows */}
          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {currentExam.questions.map((_, qIdx) => {
              const ans = currentExam.answers[qIdx];
              const flagged = currentExam.flagged[qIdx];
              const isCurrent = currentIndex === qIdx;

              return (
                <div
                  key={qIdx}
                  className={`flex items-center justify-between p-2 rounded-xl transition-all ${
                    isCurrent
                      ? 'bg-indigo-50/70 border border-indigo-200'
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <button
                    onClick={() => setCurrentIndex(qIdx)}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-700 min-w-10 text-left"
                  >
                    <span>{String(qIdx + 1).padStart(2, '0')}.</span>
                    {flagged && <Bookmark className="w-3 h-3 fill-amber-500 text-amber-500" />}
                  </button>

                  {/* 5 OMR Bubbles */}
                  <div className="flex items-center gap-1.5">
                    {[0, 1, 2, 3, 4].map((choice) => {
                      const isMarked = ans === choice;
                      return (
                        <button
                          key={choice}
                          onClick={() => {
                            setCurrentIndex(qIdx);
                            answerQuestion(qIdx, choice);
                          }}
                          className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                            isMarked
                              ? 'bg-slate-900 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800'
                          }`}
                        >
                          {choice + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit Action Box */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            {unAnsweredCount > 0 ? (
              <div className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>아직 마킹하지 않은 문항이 <strong>{unAnsweredCount}개</strong> 있습니다.</span>
              </div>
            ) : (
              <div className="text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>모든 문항의 답안 마킹이 완료되었습니다!</span>
              </div>
            )}

            <button
              onClick={() => setShowSubmitConfirm(true)}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>답안지 최종 제출하기</span>
            </button>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">시험 답안지를 제출할까요?</h3>

            <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl">
              <div className="flex justify-between">
                <span>총 문항 수</span>
                <strong className="text-slate-900">{totalQuestions}문항</strong>
              </div>
              <div className="flex justify-between">
                <span>작성 완료</span>
                <strong className="text-emerald-600">{answeredCount}문항</strong>
              </div>
              {unAnsweredCount > 0 && (
                <div className="flex justify-between text-red-600 font-bold">
                  <span>미작성 문항</span>
                  <span>{unAnsweredCount}문항</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>남은 시간</span>
                <span className="font-mono text-slate-900 font-bold">{formatTime(secondsLeft)}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              제출 즉시 채점 결과가 산출되며, 틀린 문항은 <strong>자동 오답노트</strong>로 등록되어 AI 유사 문제 및 캐릭터 성장 경험치가 지급됩니다.
            </p>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50"
              >
                계속 풀기
              </button>
              <button
                onClick={() => {
                  setShowSubmitConfirm(false);
                  submitExam();
                }}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
              >
                제출 및 채점하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
