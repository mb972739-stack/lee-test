import React from 'react';
import { useStudy } from '../context/StudyContext';
import { BookOpen, FileText, Sparkles, BarChart2, Flame, User, BookMarked } from 'lucide-react';
import { CHARACTER_STAGES } from '../data/characterConfig';

interface HeaderProps {
  onOpenProfileModal: () => void;
  onOpenTextbookModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenProfileModal, onOpenTextbookModal }) => {
  const { currentStudent, activeTab, setActiveTab, feverGauge, feverModeActive } = useStudy();

  const currentStage = CHARACTER_STAGES.find((s) => s.stage === currentStudent.character.stage) || CHARACTER_STAGES[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand Wordmark (Single element, no nested pills) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('exam_config')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                중학 열공 퀘스트
              </span>
              <div className="text-[11px] text-slate-500 font-medium hidden sm:block">
                100발100중 · 블랙라벨 모의고사
              </div>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Single-line, clean hover underline) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('exam_config')}
            className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === 'exam_config' || activeTab === 'exam_room' || activeTab === 'exam_result'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>실전 모의고사</span>
          </button>

          <button
            onClick={() => setActiveTab('wrong_notes')}
            className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === 'wrong_notes'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>성장 오답노트</span>
            {currentStudent.wrongNotes.length > 0 && (
              <span className="ml-1 text-[11px] px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded font-semibold">
                {currentStudent.wrongNotes.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('character')}
            className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === 'character'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>캐릭터 성장실</span>
            <span className="text-[11px] text-indigo-600 font-bold">
              Lv.{currentStudent.character.level}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === 'stats'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>학습 분석</span>
          </button>
        </nav>

        {/* Zone 3: Active Student & Study Fever Gauge */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Study Fever Gauge Bar */}
          <div
            onClick={() => setActiveTab('character')}
            title={`열공 게이지: ${feverGauge}% ${feverModeActive ? '(버닝 모드 가동 중!)' : ''}`}
            className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 cursor-pointer transition-colors"
          >
            <Flame
              className={`w-4 h-4 ${
                feverModeActive ? 'text-amber-500 animate-bounce' : 'text-slate-400'
              }`}
            />
            <div className="w-16 lg:w-20 bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  feverModeActive
                    ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                    : 'bg-indigo-500'
                }`}
                style={{ width: `${feverGauge}%` }}
              />
            </div>
            <span className="text-xs font-bold tabular-nums text-slate-700">
              {feverGauge}%
            </span>
          </div>

          {/* Textbook & Scope Quick Trigger */}
          {onOpenTextbookModal && (
            <button
              onClick={onOpenTextbookModal}
              title="학교별 교과서 출판사 & 시험범위 등록"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all text-xs font-semibold text-slate-700 cursor-pointer"
            >
              <BookMarked className="w-3.5 h-3.5 text-indigo-600" />
              <span>교과서·범위</span>
            </button>
          )}

          {/* Student Profile Switcher Trigger */}
          <button
            onClick={onOpenProfileModal}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all text-xs font-medium text-slate-700 group cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <span className="font-semibold text-slate-900 group-hover:text-indigo-700">
                {currentStudent.name}
              </span>
              <span className="text-slate-400 ml-1">({currentStudent.grade})</span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Secondary Navigation Row */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 px-2 py-2 bg-slate-50 text-xs font-medium text-slate-600">
        <button
          onClick={() => setActiveTab('exam_config')}
          className={`flex items-center gap-1 py-1 px-2 rounded ${
            activeTab === 'exam_config' || activeTab === 'exam_room' || activeTab === 'exam_result'
              ? 'text-indigo-600 font-bold bg-white shadow-xs'
              : ''
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>모의고사</span>
        </button>
        <button
          onClick={() => setActiveTab('wrong_notes')}
          className={`flex items-center gap-1 py-1 px-2 rounded ${
            activeTab === 'wrong_notes' ? 'text-indigo-600 font-bold bg-white shadow-xs' : ''
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>오답노트</span>
          {currentStudent.wrongNotes.length > 0 && (
            <span className="text-[10px] px-1 bg-amber-200 text-amber-900 rounded font-bold">
              {currentStudent.wrongNotes.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('character')}
          className={`flex items-center gap-1 py-1 px-2 rounded ${
            activeTab === 'character' ? 'text-indigo-600 font-bold bg-white shadow-xs' : ''
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>성장실</span>
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex items-center gap-1 py-1 px-2 rounded ${
            activeTab === 'stats' ? 'text-indigo-600 font-bold bg-white shadow-xs' : ''
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>통계</span>
        </button>
      </div>
    </header>
  );
};
