import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { Subject, SUBJECT_ORDER } from '../types';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  HelpCircle,
  TrendingUp,
  Printer,
  Trash2,
  BookOpen,
  ArrowRight,
  Brain,
  MessageSquare,
  Check,
  X,
  Loader2,
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export const WrongNotesView: React.FC = () => {
  const {
    wrongNotes,
    toggleMasterNote,
    updateNoteMemo,
    deleteNote,
    generateSimilarQuestionsForNote,
    solveSimilarQuestionInNote,
    askAiTutorForNote,
    currentStudent,
    setActiveTab,
  } = useStudy();

  const [selectedSubject, setSelectedSubject] = useState<Subject | 'all'>('all');
  const [filterMastered, setFilterMastered] = useState<'all' | 'needs_review' | 'mastered'>('all');
  const [loadingAiNoteId, setLoadingAiNoteId] = useState<string | null>(null);
  const [tutorDataMap, setTutorDataMap] = useState<Record<string, any>>({});
  const [generatingSimilarId, setGeneratingSimilarId] = useState<string | null>(null);
  const [solvedSimAnswers, setSolvedSimAnswers] = useState<Record<string, { choice: number; result?: boolean }>>({});

  // Filter notes
  const filteredNotes = wrongNotes.filter((note) => {
    if (selectedSubject !== 'all' && note.subject !== selectedSubject) return false;
    if (filterMastered === 'needs_review' && note.isMastered) return false;
    if (filterMastered === 'mastered' && !note.isMastered) return false;
    return true;
  });

  const totalCount = wrongNotes.length;
  const masteredCount = wrongNotes.filter((n) => n.isMastered).length;
  const masteryPercent = totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0;

  const handleAskTutor = async (noteId: string) => {
    setLoadingAiNoteId(noteId);
    const result = await askAiTutorForNote(noteId);
    if (result) {
      setTutorDataMap((prev) => ({ ...prev, [noteId]: result }));
    }
    setLoadingAiNoteId(null);
  };

  const handleGenerateSimilar = async (noteId: string, bookType: '100bal100jung' | 'blacklabel') => {
    setGeneratingSimilarId(`${noteId}-${bookType}`);
    await generateSimilarQuestionsForNote(noteId, bookType);
    setGeneratingSimilarId(null);
  };

  const handleSolveSimilar = (noteId: string, questionId: string, choiceIndex: number) => {
    const res = solveSimilarQuestionInNote(noteId, questionId, choiceIndex);
    setSolvedSimAnswers((prev) => ({
      ...prev,
      [questionId]: { choice: choiceIndex, result: res.isCorrect },
    }));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header & Mastery Status Gauge */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                {currentStudent.name} 학생의 자동 오답노트
              </h2>
              <p className="text-xs text-slate-500">
                모의고사에서 틀린 문제를 모아 AI 맞춤 유사 문제와 함께 완벽히 정복합니다.
              </p>
            </div>
          </div>
        </div>

        {/* Print & Action */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-right">
            <div className="text-xs text-slate-500">오답 정복률</div>
            <div className="text-base font-extrabold text-indigo-600 tabular-nums">
              {masteredCount} / {totalCount}개 ({masteryPercent}%)
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className="py-2 px-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors no-print cursor-pointer"
            title="오답노트 출력하기"
          >
            <Printer className="w-4 h-4" />
            <span>프린트</span>
          </button>
        </div>
      </div>

      {/* Mastery Progress Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-slate-600">오답 극복 마스터 게이지</span>
          <span className="text-indigo-600">{masteryPercent}% 완료</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${masteryPercent}%` }}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 no-print">
        {/* Subject Filter (Strictly: 수학 -> 영어 -> 국어 -> 과학) */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto max-w-full">
          <button
            onClick={() => setSelectedSubject('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedSubject === 'all'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            전체 과목
          </button>
          {SUBJECT_ORDER.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedSubject === sub
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* Mastery Filter */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setFilterMastered('all')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              filterMastered === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            전체 ({totalCount})
          </button>
          <button
            onClick={() => setFilterMastered('needs_review')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              filterMastered === 'needs_review' ? 'bg-white text-amber-700 shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            복습 필요 ({totalCount - masteredCount})
          </button>
          <button
            onClick={() => setFilterMastered('mastered')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              filterMastered === 'mastered' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            정복 완료 ({masteredCount})
          </button>
        </div>
      </div>

      {/* Wrong Note Cards List */}
      {filteredNotes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            {wrongNotes.length === 0
              ? '아직 등록된 오답이 없습니다!'
              : '해당 조건의 오답 노트가 없습니다.'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            실전 모의고사를 풀면 틀린 문제가 여기에 자동으로 등록되어 AI 유사 문제 및 과외 해설이 제공됩니다.
          </p>
          <button
            onClick={() => setActiveTab('exam_config')}
            className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
          >
            실전 모의고사 풀러 가기
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredNotes.map((note, index) => {
            const q = note.question;
            const tutorExplain = tutorDataMap[note.id];
            const isGeneratingThis = generatingSimilarId?.startsWith(note.id);

            return (
              <div
                key={note.id}
                className={`bg-white rounded-2xl border shadow-xs p-6 space-y-5 transition-all ${
                  note.isMastered
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Note Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-amber-500 text-white font-extrabold flex items-center justify-center text-xs">
                      #{index + 1}
                    </span>
                    <span className="text-xs font-bold text-indigo-700 px-2.5 py-0.5 rounded-md bg-indigo-50">
                      {note.grade} {note.semester} {note.examType}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {note.subject} · {q.unit}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                        q.bookSource === 'blacklabel'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {q.difficultyLevel}
                    </span>
                  </div>

                  {/* Actions: Mastery Toggle & Delete */}
                  <div className="flex items-center gap-2 no-print self-end sm:self-auto">
                    <button
                      onClick={() => toggleMasterNote(note.id)}
                      className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        note.isMastered
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{note.isMastered ? '정복 완료 (+30 EXP)' : '복습 완료 표시'}</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm('이 오답 노트를 삭제하시겠습니까?')) {
                          deleteNote(note.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50"
                      title="오답 삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Question Details */}
                <div className="space-y-2">
                  <div className="font-bold text-sm text-slate-800">{q.title}</div>
                  <p className="text-sm sm:text-base font-medium text-slate-900 leading-relaxed whitespace-pre-line">
                    {q.questionText}
                  </p>

                  {q.passage && (
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-serif leading-relaxed">
                      {q.passage}
                    </div>
                  )}

                  {/* Options List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                    {q.options.map((opt, optIdx) => {
                      const isCorrect = optIdx === q.correctAnswerIndex;
                      const isMyPick = optIdx === note.userAnswerIndex;

                      return (
                        <div
                          key={optIdx}
                          className={`p-2.5 rounded-lg border flex items-center justify-between ${
                            isCorrect
                              ? 'border-emerald-300 bg-emerald-50 text-emerald-900 font-bold'
                              : isMyPick
                              ? 'border-red-300 bg-red-50 text-red-900 font-bold'
                              : 'border-slate-100 bg-slate-50/50 text-slate-600'
                          }`}
                        >
                          <span>{opt}</span>
                          <span className="text-[10px]">
                            {isCorrect && '✓ 정답'}
                            {isMyPick && !isCorrect && '✗ 내 오답'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Solution & Trap Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                      <span>단계별 정밀 해설</span>
                    </div>
                    <p className="text-slate-600 whitespace-pre-line leading-relaxed text-[11px]">
                      {q.explanation}
                    </p>
                  </div>

                  <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/80 space-y-1.5">
                    <div className="font-bold text-amber-900 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>오답 함정 포인트 &amp; 공식</span>
                    </div>
                    <p className="text-amber-800 leading-relaxed text-[11px]">
                      <strong>함정: </strong>{q.trapPoint}
                    </p>
                    <div className="pt-1 text-[11px] text-amber-900 font-semibold">
                      핵심: {q.coreFormula}
                    </div>
                  </div>
                </div>

                {/* AI Tutor Explanation Box (if requested) */}
                {tutorExplain && (
                  <div className="p-4 bg-indigo-50/80 rounded-xl border border-indigo-200 text-xs space-y-2.5">
                    <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                      <Brain className="w-4 h-4 text-indigo-600" />
                      <span>AI 1:1 과외 선생님 클리닉</span>
                    </div>
                    <p className="text-indigo-800 italic">
                      "{tutorExplain.tutorGreeting}"
                    </p>

                    <div className="space-y-1 bg-white p-3 rounded-lg border border-indigo-100 text-slate-700">
                      <div className="font-semibold text-indigo-950">선생님의 3단계 해법:</div>
                      {tutorExplain.stepByStep?.map((step: string, sIdx: number) => (
                        <div key={sIdx} className="text-[11px] text-slate-600">
                          {step}
                        </div>
                      ))}
                    </div>

                    <div className="text-[11px] text-indigo-900">
                      <strong>실수 탈출 꿀팁: </strong>{tutorExplain.secretTip}
                    </div>
                  </div>
                )}

                {/* Interactive AI Similar Questions Section */}
                {note.similarQuestions && note.similarQuestions.length > 0 && (
                  <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
                        <TrendingUp className="w-4 h-4 text-purple-600" />
                        <span>오답 기반 난이도 상승 AI 유사 문제 ({note.similarQuestions.length}개)</span>
                      </div>
                      <span className="text-[11px] text-purple-700 font-medium">정답 시 +40 EXP &amp; 게이지 충전</span>
                    </div>

                    <div className="space-y-4">
                      {note.similarQuestions.map((simQ, simIdx) => {
                        const solvedStatus = solvedSimAnswers[simQ.id];
                        return (
                          <div key={simQ.id} className="bg-white p-4 rounded-xl border border-purple-100 shadow-xs space-y-2.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-purple-950">
                                유사 {simIdx + 1}. {simQ.title}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-semibold text-[10px]">
                                {(simQ as any).difficultyLabel || simQ.difficultyLevel || '심화 변형'}
                              </span>
                            </div>

                            <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line">
                              {simQ.questionText}
                            </p>

                            {/* Options */}
                            <div className="space-y-1.5 pt-1">
                              {simQ.options.map((opt, optIdx) => {
                                const isChosen = solvedStatus?.choice === optIdx;
                                return (
                                  <button
                                    key={optIdx}
                                    onClick={() => handleSolveSimilar(note.id, simQ.id, optIdx)}
                                    disabled={solvedStatus !== undefined}
                                    className={`w-full p-2.5 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${
                                      isChosen
                                        ? solvedStatus?.result
                                          ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold'
                                          : 'border-red-400 bg-red-50 text-red-950 font-bold'
                                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                                    }`}
                                  >
                                    <span>{opt}</span>
                                    {isChosen && (
                                      <span>
                                        {solvedStatus?.result ? (
                                          <span className="text-emerald-600 flex items-center gap-0.5">
                                            <Check className="w-3.5 h-3.5" /> 정답! (+40 EXP)
                                          </span>
                                        ) : (
                                          <span className="text-red-500 flex items-center gap-0.5">
                                            <X className="w-3.5 h-3.5" /> 오답 (다시 확인)
                                          </span>
                                        )}
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Explanation shown after solving */}
                            {solvedStatus && (
                              <div className="p-3 bg-slate-50 rounded-lg text-[11px] text-slate-600 leading-relaxed border border-slate-100">
                                <strong className="text-slate-800">해설: </strong>{simQ.explanation}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Bottom Action Bar for Note Card */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 no-print">
                  {/* AI Generation Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleGenerateSimilar(note.id, '100bal100jung')}
                      disabled={isGeneratingThis}
                      className="py-1.5 px-3 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {generatingSimilarId === `${note.id}-100bal100jung` ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                      <span>100발100중 실전 유사문제</span>
                    </button>

                    <button
                      onClick={() => handleGenerateSimilar(note.id, 'blacklabel')}
                      disabled={isGeneratingThis}
                      className="py-1.5 px-3 rounded-lg border border-purple-300 bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {generatingSimilarId === `${note.id}-blacklabel` ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
                      )}
                      <span>블랙라벨 1등급 심화 유사문제 (난이도 상승)</span>
                    </button>

                    <button
                      onClick={() => handleAskTutor(note.id)}
                      disabled={loadingAiNoteId === note.id}
                      className="py-1.5 px-3 rounded-lg border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {loadingAiNoteId === note.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <MessageSquare className="w-3.5 h-3.5" />
                      )}
                      <span>1:1 AI 과외 해설</span>
                    </button>
                  </div>

                  {/* Student Reflection Memo */}
                  <div className="w-full sm:w-auto flex-1 max-w-sm">
                    <input
                      type="text"
                      defaultValue={note.studentMemo || ''}
                      onBlur={(e) => updateNoteMemo(note.id, e.target.value)}
                      placeholder="나만의 실수 반성 메모 (예: 부호 실수 주의)"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
