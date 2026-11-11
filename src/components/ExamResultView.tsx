import React from 'react';
import { useStudy } from '../context/StudyContext';
import {
  Trophy,
  ArrowRight,
  RefreshCw,
  FileText,
  Flame,
  Sparkles,
  CheckCircle2,
  XCircle,
  TrendingUp,
} from 'lucide-react';
import { CHARACTER_STAGES } from '../data/characterConfig';

export const ExamResultView: React.FC = () => {
  const { currentExam, currentStudent, setActiveTab, upgradeCurrentExam, feverGauge } = useStudy();

  if (!currentExam || currentExam.score === undefined) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <p className="text-slate-600">완료된 시험 결과가 없습니다.</p>
        <button
          onClick={() => setActiveTab('exam_config')}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-sm"
        >
          새로운 모의고사 시작
        </button>
      </div>
    );
  }

  const score = currentExam.score;
  const currentStage = CHARACTER_STAGES.find((s) => s.stage === currentStudent.character.stage) || CHARACTER_STAGES[0];

  const wrongCount = currentExam.questions.filter(
    (q, idx) => currentExam.answers[idx] !== q.correctAnswerIndex
  ).length;

  const getScoreMessage = () => {
    if (score === 100) return { title: '100점 만점 완벽 마스터!', desc: '에듀원 100발100중 최고 득점 달성! 이제 블랙라벨 최고난도 킬러에 도전할 준비가 되었습니다.' };
    if (score >= 80) return { title: '1등급 최상위권 달성!', desc: '우수한 실력입니다. 틀린 문항 꼼꼼히 복습하고 심화 업그레이드로 실력을 굳혀보세요.' };
    if (score >= 60) return { title: '안정적인 실전 내신권!', desc: '기본기가 훌륭합니다. 오답노트에서 핵심 개념을 짚고 넘어가면 다음엔 90점 이상 가능합니다!' };
    return { title: '성장의 기회 발견!', desc: '틀린 문제는 약점을 발견해 더 강해질 수 있는 보물입니다. 오답노트 클리닉을 시작해보세요!' };
  };

  const message = getScoreMessage();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Score Header Card */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl text-white p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-indigo-300 text-xs font-semibold">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/30">
                {currentExam.grade} {currentExam.semester} {currentExam.examType}
              </span>
              <span>·</span>
              <span>{currentExam.subject}</span>
              <span>·</span>
              <span>{currentExam.bookType === 'blacklabel' ? '블랙라벨 심화' : '100발100중 기출'}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {message.title}
            </h2>
            <p className="text-xs sm:text-sm text-indigo-200/90 max-w-lg leading-relaxed">
              {message.desc}
            </p>

            <div className="pt-2 flex items-center justify-center md:justify-start gap-4 text-xs text-indigo-200">
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>열공 게이지: <strong className="text-white">{feverGauge}%</strong></span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>획득 경험치: <strong className="text-white">+{Math.round(score * 1.5)} EXP</strong></span>
              </div>
            </div>
          </div>

          {/* Big Score Circle */}
          <div className="flex flex-col items-center shrink-0">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white/10 border-4 border-indigo-400/50 flex flex-col items-center justify-center shadow-inner">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono">
                {score}
              </span>
              <span className="text-xs font-semibold text-indigo-200 mt-0.5">/ 100점</span>
            </div>
            <div className="mt-2 text-xs text-indigo-300 font-medium">
              맞힌 문항: {currentExam.questions.length - wrongCount} / {currentExam.questions.length}
            </div>
          </div>
        </div>
      </div>

      {/* Action Strip: Upgrade or Go to Wrong Notes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Upgrade Exam Action */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-purple-700 font-bold text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>블랙라벨 1등급 심화로 문제 업그레이드</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              현재 시험 범위를 바탕으로 고난도 변별력 킬러 문항(Round 2)을 생성하여 실력을 한 단계 더 업그레이드합니다.
            </p>
          </div>

          <button
            onClick={() => upgradeCurrentExam('blacklabel')}
            className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>블랙라벨 최고난도 심화 도전 (Round 2)</span>
          </button>
        </div>

        {/* Wrong Note Action */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
              <FileText className="w-4 h-4" />
              <span>자동 생성된 오답노트 확인</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              이번 시험에서 틀린 <strong>{wrongCount}개 문항</strong>이 오답노트에 담겼습니다. AI 1:1 과외 해설과 유사 문제를 풀어보세요.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('wrong_notes')}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>오답노트 복습하러 가기 ({wrongCount}개)</span>
          </button>
        </div>
      </div>

      {/* Question by Question Review */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-extrabold text-slate-900 text-sm">문항별 채점 결과 상세 분석</h3>
          <span className="text-xs text-slate-500">
            총 {currentExam.questions.length}문항
          </span>
        </div>

        <div className="space-y-3">
          {currentExam.questions.map((q, idx) => {
            const userAns = currentExam.answers[idx];
            const isCorrect = userAns === q.correctAnswerIndex;

            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition-all ${
                  isCorrect
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : 'bg-red-50/40 border-red-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                    )}
                    <div>
                      <span className="font-bold text-xs text-slate-900 mr-2">
                        {idx + 1}번. {q.title}
                      </span>
                      <span className="text-[11px] text-slate-500">[{q.unit}]</span>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      isCorrect ? 'text-emerald-700 bg-emerald-100' : 'text-red-700 bg-red-100'
                    }`}
                  >
                    {isCorrect ? '정답 (+20점)' : '오답 (오답노트 등록)'}
                  </span>
                </div>

                <div className="mt-2 text-xs text-slate-700 space-y-1">
                  <div className="flex items-center gap-4 text-[11px]">
                    <span>
                      내 마킹: <strong className={isCorrect ? 'text-emerald-700' : 'text-red-600'}>
                        {userAns !== undefined ? q.options[userAns] : '미작성'}
                      </strong>
                    </span>
                    <span>·</span>
                    <span>
                      정답: <strong className="text-slate-900">{q.options[q.correctAnswerIndex]}</strong>
                    </span>
                  </div>

                  {!isCorrect && (
                    <div className="mt-2 p-2.5 bg-white rounded-lg border border-red-100 text-[11px] text-slate-600">
                      <strong className="text-red-600">오답 함정 분석: </strong>
                      {q.trapPoint}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-center gap-3 pt-2">
        <button
          onClick={() => setActiveTab('exam_config')}
          className="py-2.5 px-5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>새 모의고사 응시하기</span>
        </button>
      </div>
    </div>
  );
};
