import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { Grade } from '../types';
import { X, UserPlus, Check, Trash2, GraduationCap, Sparkles } from 'lucide-react';
import { CHARACTER_STAGES } from '../data/characterConfig';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({ isOpen, onClose }) => {
  const { profiles, currentStudent, loginOrSwitchStudent, createStudentProfile, deleteStudentProfile } = useStudy();

  const [isRegistering, setIsRegistering] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [gradeInput, setGradeInput] = useState<Grade>('중2');
  const [schoolInput, setSchoolInput] = useState('');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    createStudentProfile(nameInput.trim(), gradeInput, schoolInput.trim());
    setNameInput('');
    setSchoolInput('');
    setIsRegistering(false);
    onClose();
  };

  const handleSelect = (p: typeof profiles[0]) => {
    loginOrSwitchStudent(p.name, p.grade, p.schoolName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">학생 프로필 &amp; 로그인</h3>
              <p className="text-xs text-slate-500">학생별로 오답노트와 캐릭터 성장이 분리 저장됩니다</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile List */}
        {!isRegistering ? (
          <div className="mt-4 space-y-3">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              등록된 학생 목록 ({profiles.length})
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {profiles.map((p) => {
                const isSelected = p.id === currentStudent.id;
                const stage = CHARACTER_STAGES.find((s) => s.stage === p.character.stage) || CHARACTER_STAGES[0];
                return (
                  <div
                    key={p.id}
                    onClick={() => handleSelect(p)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50/70 border-indigo-400 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                        <img
                          src={stage.imageSrc}
                          alt={p.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{p.name}</span>
                          <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 font-medium text-slate-700">
                            {p.grade}
                          </span>
                          {isSelected && (
                            <span className="text-xs text-indigo-600 font-semibold flex items-center gap-0.5">
                              <Check className="w-3.5 h-3.5" /> 현재 접속
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                          <span>{p.schoolName || '중학교'}</span>
                          <span>·</span>
                          <span>파트너 Lv.{p.character.level} ({stage.title})</span>
                          <span>·</span>
                          <span>오답 {p.wrongNotes.length}개</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {profiles.length > 1 && !isSelected && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`${p.name} 학생의 기록을 삭제하시겠습니까?`)) {
                              deleteStudentProfile(p.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="학생 삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setIsRegistering(true)}
              className="w-full mt-2 py-2.5 px-4 rounded-xl border-2 border-dashed border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-indigo-700 font-semibold text-sm flex items-center justify-center gap-2 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>새로운 학생 등록하기</span>
            </button>
          </div>
        ) : (
          /* Registration Form */
          <form onSubmit={handleCreate} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                학생 이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="예: 김민수, 이지은"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">학년 선택</label>
                <div className="flex rounded-xl bg-slate-100 p-1">
                  {(['중1', '중2', '중3'] as Grade[]).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGradeInput(g)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                        gradeInput === g
                          ? 'bg-white text-indigo-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">학교 이름 (선택)</label>
                <input
                  type="text"
                  value={schoolInput}
                  onChange={(e) => setSchoolInput(e.target.value)}
                  placeholder="예: 대왕중학교"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/60 text-xs text-amber-800 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                등록 즉시 <strong>Lv.1 신비의 지혜알(알몬)</strong> 파트너와 함께 공부 게이지 및 오답노트가 제공됩니다.
              </span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsRegistering(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50"
              >
                취소
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-xs transition-colors"
              >
                등록하고 공부 시작
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
