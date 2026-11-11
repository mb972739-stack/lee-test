import React from 'react';
import { useStudy } from '../context/StudyContext';
import { CHARACTER_STAGES } from '../data/characterConfig';
import { Sparkles, Trophy, X, ArrowRight } from 'lucide-react';

export const EvolutionModal: React.FC = () => {
  const { evolutionNotice, closeEvolutionModal } = useStudy();

  if (!evolutionNotice || !evolutionNotice.isOpen) return null;

  const stage = CHARACTER_STAGES.find((s) => s.stage === evolutionNotice.stage) || CHARACTER_STAGES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-indigo-200 text-center space-y-5 relative">
        <button
          onClick={closeEvolutionModal}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>캐릭터 진화 달성!</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-slate-900">
          {stage.title} <span className="text-indigo-600">{stage.name}</span>
        </h3>

        {/* Evolved Character Image */}
        <div className="w-44 h-44 mx-auto rounded-3xl overflow-hidden bg-gradient-to-tr from-indigo-100 to-amber-100 border-4 border-indigo-300 shadow-lg p-2">
          <img
            src={stage.imageSrc}
            alt={stage.name}
            className="w-full h-full object-cover rounded-2xl"
            referrerPolicy="no-referrer"
          />
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
          {evolutionNotice.message}
        </p>

        <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-xs text-indigo-900 text-left">
          <div className="font-bold flex items-center gap-1 text-indigo-700">
            <Trophy className="w-3.5 h-3.5" />
            새로운 특수 효과 해금:
          </div>
          <div className="text-[11px] text-indigo-800/80 mt-0.5">
            {stage.specialPerk}
          </div>
        </div>

        <button
          onClick={closeEvolutionModal}
          className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span>계속 열공하기</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
