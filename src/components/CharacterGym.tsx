import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { CHARACTER_STAGES, CHARACTER_DIALOGUES } from '../data/characterConfig';
import {
  Sparkles,
  Flame,
  Award,
  Zap,
  Heart,
  Brain,
  BookOpen,
  Compass,
  Hourglass,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const CharacterGym: React.FC = () => {
  const { currentStudent, feverGauge, feverModeActive, feedWisdomBerry, setActiveTab } = useStudy();

  const character = currentStudent.character;
  const currentStage = CHARACTER_STAGES.find((s) => s.stage === character.stage) || CHARACTER_STAGES[0];
  const nextStage = CHARACTER_STAGES.find((s) => s.stage === (character.stage + 1) as any);

  const [dialogue, setDialogue] = useState<string>(() => {
    return CHARACTER_DIALOGUES[Math.floor(Math.random() * CHARACTER_DIALOGUES.length)];
  });
  const [feedMessage, setFeedMessage] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleTalk = () => {
    const randomQuote = CHARACTER_DIALOGUES[Math.floor(Math.random() * CHARACTER_DIALOGUES.length)];
    setDialogue(randomQuote);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleFeed = () => {
    const res = feedWisdomBerry();
    setFeedMessage(res.message);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
    setTimeout(() => setFeedMessage(null), 4000);
  };

  const expPercent = Math.min(100, Math.round((character.exp / character.maxExp) * 100));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Top Profile Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="text-xs font-semibold text-indigo-600 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{currentStudent.name} 학생의 파트너 펫 연구소</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            {currentStage.name} <span className="text-indigo-600 text-lg">Lv.{character.level}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {currentStage.description}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('exam_config')}
            className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>모의고사 풀고 레벨업</span>
          </button>
        </div>
      </div>

      {/* Main Showcase Grid: Character Stage & Gauges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Character Portrait & Interaction Deck (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 flex flex-col items-center text-center space-y-6">
          {/* Speech Bubble */}
          <div
            onClick={handleTalk}
            className="w-full max-w-md p-3.5 bg-indigo-50 border border-indigo-200 rounded-2xl text-xs sm:text-sm font-semibold text-indigo-900 shadow-xs relative cursor-pointer hover:bg-indigo-100/70 transition-colors"
          >
            <span>💬 "{dialogue}"</span>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-indigo-50 border-r border-b border-indigo-200 rotate-45" />
          </div>

          {/* Big Character Stage Image */}
          <div className="relative group cursor-pointer" onClick={handleTalk}>
            <div
              className={`w-52 h-52 sm:w-64 sm:h-64 rounded-3xl overflow-hidden bg-gradient-to-b from-indigo-50 to-slate-100 border-4 border-indigo-200 shadow-lg p-2 transition-transform duration-300 ${
                isAnimating ? 'scale-105 rotate-1' : 'hover:scale-102'
              }`}
            >
              <img
                src={currentStage.imageSrc}
                alt={currentStage.name}
                className="w-full h-full object-cover rounded-2xl"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Stage Badge on Avatar */}
            <div className="absolute top-4 right-4 bg-slate-900/80 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs shadow-md">
              Stage {character.stage} / 4
            </div>

            {feverModeActive && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1 animate-bounce">
                <Flame className="w-3.5 h-3.5 fill-white" />
                <span>열공 버닝 모드 발동 중!</span>
              </div>
            )}
          </div>

          {/* Evolution Path Indicator */}
          <div className="w-full space-y-2">
            <div className="flex justify-between text-xs text-slate-500 font-semibold">
              <span>진화 단계: {currentStage.title}</span>
              {nextStage ? (
                <span>다음 진화까지: Lv.{nextStage.minLevel} ({Math.max(0, nextStage.minLevel - character.level)} 레벨 남음)</span>
              ) : (
                <span className="text-purple-600 font-bold">최고 단계 도달!</span>
              )}
            </div>

            {/* Stage Evolution Dots */}
            <div className="grid grid-cols-4 gap-2">
              {CHARACTER_STAGES.map((s) => {
                const isPassed = character.stage >= s.stage;
                const isCurrent = character.stage === s.stage;
                return (
                  <div
                    key={s.stage}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      isCurrent
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold shadow-xs'
                        : isPassed
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                        : 'border-slate-100 bg-slate-50 text-slate-400'
                    }`}
                  >
                    <div className="text-[10px] text-slate-400">Stage {s.stage}</div>
                    <div className="text-xs truncate">{s.title}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Feed Berry Action */}
          <div className="w-full pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-amber-50/60 rounded-2xl border border-amber-200">
            <div className="text-left">
              <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <span>지혜의 열매 보유: </span>
                <span className="text-base font-extrabold text-amber-700">{character.wisdomBerries}개</span>
              </div>
              <p className="text-[11px] text-amber-700/80">
                열매를 먹이면 경험치 +35와 집중력 스탯이 오릅니다.
              </p>
            </div>

            <button
              onClick={handleFeed}
              disabled={character.wisdomBerries <= 0}
              className="w-full sm:w-auto py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:pointer-events-none text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>열매 먹이기</span>
            </button>
          </div>

          {feedMessage && (
            <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 animate-fadeIn">
              {feedMessage}
            </div>
          )}
        </div>

        {/* Growth Gauges & RPG Stats (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* EXP & Level Gauge Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">경험치 성장 게이지</span>
              <span className="font-bold text-indigo-600 tabular-nums">
                {character.exp} / {character.maxExp} EXP ({expPercent}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-sky-400 rounded-full transition-all duration-500"
                style={{ width: `${expPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              모의고사 풀기, 오답노트 복습, AI 유사 문제 정답 시 경험치가 상승합니다.
            </p>
          </div>

          {/* Study Fever Gauge Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Flame className={`w-4 h-4 ${feverModeActive ? 'text-amber-500' : 'text-slate-400'}`} />
                <span>열공 집중 게이지</span>
              </span>
              <span className="font-extrabold text-amber-600 tabular-nums">
                {feverGauge}% {feverModeActive && '(버닝 활성!)'}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  feverModeActive
                    ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 animate-pulse'
                    : 'bg-gradient-to-r from-amber-400 to-orange-500'
                }`}
                style={{ width: `${feverGauge}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              100% 충전 시 버닝 모드가 활성화되어 추가 경험치와 지혜의 열매를 획득합니다!
            </p>
          </div>

          {/* RPG 4 Core Stats */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Brain className="w-4 h-4 text-indigo-600" />
              <span>{currentStudent.name}의 학습 능력치 (RPG Stats)</span>
            </h4>

            <div className="space-y-3 text-xs">
              {/* Intelligence: Math */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-700">
                  <span className="font-semibold flex items-center gap-1">
                    <Brain className="w-3.5 h-3.5 text-purple-600" />
                    지력 (수학·블랙라벨)
                  </span>
                  <span className="font-extrabold text-purple-700">{character.stats.intelligence}pt</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: `${Math.min(100, character.stats.intelligence * 2)}%` }}
                  />
                </div>
              </div>

              {/* Vocabulary: English / Korean */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-700">
                  <span className="font-semibold flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                    어휘력 (영어·국어)
                  </span>
                  <span className="font-extrabold text-sky-700">{character.stats.vocabulary}pt</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-sky-500 rounded-full"
                    style={{ width: `${Math.min(100, character.stats.vocabulary * 2)}%` }}
                  />
                </div>
              </div>

              {/* Inquiry: Science */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-700">
                  <span className="font-semibold flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-emerald-600" />
                    탐구력 (과학)
                  </span>
                  <span className="font-extrabold text-emerald-700">{character.stats.inquiry}pt</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${Math.min(100, character.stats.inquiry * 2)}%` }}
                  />
                </div>
              </div>

              {/* Concentration: Timer */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-700">
                  <span className="font-semibold flex items-center gap-1">
                    <Hourglass className="w-3.5 h-3.5 text-amber-600" />
                    집중력 (타이머 실전 완주)
                  </span>
                  <span className="font-extrabold text-amber-700">{character.stats.concentration}pt</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${Math.min(100, character.stats.concentration * 2)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Badges Collection */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>획득 뱃지 보관함</span>
            </h4>

            <div className="grid grid-cols-2 gap-2.5">
              {character.badges.map((b) => {
                const isUnlocked = Boolean(b.unlockedAt);
                return (
                  <div
                    key={b.id}
                    className={`p-3 rounded-xl border text-left space-y-1 transition-all ${
                      isUnlocked
                        ? 'bg-amber-50/40 border-amber-200 shadow-2xs'
                        : 'bg-slate-50/60 border-slate-100 opacity-50'
                    }`}
                  >
                    <div className="text-xl">{b.icon}</div>
                    <div className="font-bold text-xs text-slate-900">{b.name}</div>
                    <p className="text-[10px] text-slate-500 leading-tight">{b.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
