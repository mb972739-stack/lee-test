import React, { useState } from 'react';
import { StudyProvider, useStudy } from './context/StudyContext';
import { Header } from './components/Header';
import { ExamConfigView } from './components/ExamConfigView';
import { ExamRoom } from './components/ExamRoom';
import { ExamResultView } from './components/ExamResultView';
import { WrongNotesView } from './components/WrongNotesView';
import { CharacterGym } from './components/CharacterGym';
import { StudyStatsView } from './components/StudyStatsView';
import { StudentProfileModal } from './components/StudentProfileModal';
import { TextbookRegistrationModal } from './components/TextbookRegistrationModal';
import { EvolutionModal } from './components/EvolutionModal';
import { Subject } from './types';

const AppContent: React.FC = () => {
  const { activeTab } = useStudy();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [textbookModalOpen, setTextbookModalOpen] = useState(false);
  const [textbookModalSubject, setTextbookModalSubject] = useState<Subject>('수학');

  const handleOpenTextbookModal = (subject: Subject = '수학') => {
    setTextbookModalSubject(subject);
    setTextbookModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Bar */}
      <Header
        onOpenProfileModal={() => setProfileModalOpen(true)}
        onOpenTextbookModal={() => handleOpenTextbookModal('수학')}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 pb-16">
        {activeTab === 'exam_config' && (
          <ExamConfigView onOpenTextbookModal={handleOpenTextbookModal} />
        )}
        {activeTab === 'exam_room' && <ExamRoom />}
        {activeTab === 'exam_result' && <ExamResultView />}
        {activeTab === 'wrong_notes' && <WrongNotesView />}
        {activeTab === 'character' && <CharacterGym />}
        {activeTab === 'stats' && <StudyStatsView />}
      </main>

      {/* Modals */}
      <StudentProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
      <TextbookRegistrationModal
        isOpen={textbookModalOpen}
        onClose={() => setTextbookModalOpen(false)}
        defaultSubject={textbookModalSubject}
      />
      <EvolutionModal />

      {/* Clean Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="font-semibold text-slate-700">
            중학 열공 퀘스트 · 중1~중3 전학년 실전 모의고사 &amp; 성장 오답노트
          </div>
          <div className="text-slate-400">
            기준 교재: 에듀원 100발100중 · 블랙라벨 수학 | 과목순: 수학 · 영어 · 국어 · 과학
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <StudyProvider>
      <AppContent />
    </StudyProvider>
  );
}
