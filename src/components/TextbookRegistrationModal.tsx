import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { Subject, TextbookPublisher, SUBJECT_ORDER, SubjectTextbookSetting } from '../types';
import { PUBLISHER_OPTIONS_BY_SUBJECT, DEFAULT_TEXTBOOK_SETTINGS } from '../data/textbooks';
import { getAvailableUnits, getDefaultUnitsForExam } from '../data/curriculumUnits';
import { BookMarked, X, Check, CheckSquare, Square, Sparkles, Building2, HelpCircle } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface TextbookRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSubject?: Subject;
}

export const TextbookRegistrationModal: React.FC<TextbookRegistrationModalProps> = ({
  isOpen,
  onClose,
  defaultSubject = '수학',
}) => {
  const { currentStudent, updateTextbookSetting } = useStudy();

  const [activeSubject, setActiveSubject] = useState<Subject>(defaultSubject);

  const studentGrade = currentStudent.activeGrade || currentStudent.grade || '중2';
  const studentSemester = currentStudent.activeSemester || '1학기';
  const studentExamType = currentStudent.activeExamType || '중간고사';

  const studentSettings = currentStudent.textbookSettings || DEFAULT_TEXTBOOK_SETTINGS;
  const currentSetting = studentSettings[activeSubject] || DEFAULT_TEXTBOOK_SETTINGS[activeSubject];

  const availableUnits = getAvailableUnits(
    studentGrade,
    studentSemester,
    activeSubject,
    studentExamType
  );
  const availableNames = availableUnits.map((u) => u.name);

  const [selectedPublisher, setSelectedPublisher] = useState<TextbookPublisher>(currentSetting.publisher);
  const [selectedUnits, setSelectedUnits] = useState<string[]>(() => {
    const saved = currentSetting.selectedUnits || [];
    const valid = saved.filter((u) => availableNames.includes(u));
    return valid.length > 0 ? valid : getDefaultUnitsForExam(studentGrade, studentSemester, studentExamType, activeSubject);
  });
  const [scopeDesc, setScopeDesc] = useState<string>(currentSetting.scopeDescription || '');

  if (!isOpen) return null;

  // When subject tab changes, load that subject's saved settings and validate units against current grade
  const handleSubjectChange = (sub: Subject) => {
    setActiveSubject(sub);
    const setting = studentSettings[sub] || DEFAULT_TEXTBOOK_SETTINGS[sub];
    setSelectedPublisher(setting.publisher);
    const subAvailable = getAvailableUnits(studentGrade, studentSemester, sub, studentExamType);
    const subAvailableNames = subAvailable.map((u) => u.name);
    const validSaved = setting?.selectedUnits?.filter((u) => subAvailableNames.includes(u)) || [];
    setSelectedUnits(
      validSaved.length > 0
        ? validSaved
        : getDefaultUnitsForExam(studentGrade, studentSemester, studentExamType, sub)
    );
    setScopeDesc(setting.scopeDescription || '');
  };

  const toggleUnit = (unitName: string) => {
    sounds.playClick();
    setSelectedUnits((prev) =>
      prev.includes(unitName) ? prev.filter((u) => u !== unitName) : [...prev, unitName]
    );
  };

  const handleSelectAllUnits = () => {
    sounds.playClick();
    setSelectedUnits(availableUnits.map((u) => u.name));
  };

  const handleSelectMidtermUnits = () => {
    sounds.playClick();
    setSelectedUnits(getDefaultUnitsForExam(studentGrade, studentSemester, '중간고사', activeSubject));
  };

  const handleSelectFinalUnits = () => {
    sounds.playClick();
    setSelectedUnits(getDefaultUnitsForExam(studentGrade, studentSemester, '기말고사', activeSubject));
  };

  const handleClearUnits = () => {
    sounds.playClick();
    setSelectedUnits([]);
  };

  const handleSave = () => {
    const finalUnits = selectedUnits.length > 0
      ? selectedUnits
      : getDefaultUnitsForExam(studentGrade, studentSemester, studentExamType, activeSubject);

    const updated: SubjectTextbookSetting = {
      publisher: selectedPublisher,
      selectedUnits: finalUnits,
      scopeDescription: scopeDesc.trim() || `${studentGrade} ${studentSemester} ${studentExamType} 지정 범위`,
      updatedAt: new Date().toISOString(),
    };
    updateTextbookSetting(activeSubject, updated);
    onClose();
  };

  const publisherOptions = PUBLISHER_OPTIONS_BY_SUBJECT[activeSubject] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {currentStudent.name} 학생의 교과서 출판사 &amp; 시험범위 등록
              </h3>
              <p className="text-xs text-slate-500">
                학교별 교과서 출판사와 이번 시험범위를 등록하면 해당 범위에서만 집중 출제됩니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subject Tabs (Strictly: 수학 -> 영어 -> 국어 -> 과학) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
          {SUBJECT_ORDER.map((sub, idx) => {
            const isTabActive = activeSubject === sub;
            const subSetting = studentSettings[sub];
            return (
              <button
                key={sub}
                onClick={() => handleSubjectChange(sub)}
                className={`flex-1 min-w-20 py-2 px-3 rounded-lg text-xs font-bold transition-all text-center ${
                  isTabActive
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>0{idx + 1}. {sub}</span>
                {subSetting && (
                  <span className="block text-[10px] text-slate-400 font-normal truncate mt-0.5">
                    {subSetting.publisher}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto space-y-5 pr-1 flex-1">
          {/* Section 1: 교과서 출판사 선택 */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>1. {activeSubject} 교과서 출판사 선택</span>
              </label>
              <span className="text-[11px] text-slate-400">100발100중 출판사별 기출 반영</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {publisherOptions.map((pub) => {
                const isSelected = selectedPublisher === pub.publisher;
                return (
                  <button
                    key={pub.publisher}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setSelectedPublisher(pub.publisher);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold shadow-xs ring-1 ring-indigo-500'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold flex items-center justify-between">
                      <span>{pub.publisher}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">
                      {pub.authorNote}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: 시험범위 단원 다중 선택 */}
          <div className="space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />
                <span>
                  2. 시험범위 단원 선택 ({selectedUnits.length} / {availableUnits.length}개 선택됨)
                </span>
              </label>
              <div className="flex items-center flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  onClick={handleSelectMidtermUnits}
                  className="px-2 py-0.5 rounded border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer text-[11px]"
                >
                  중간고사 범위
                </button>
                <button
                  type="button"
                  onClick={handleSelectFinalUnits}
                  className="px-2 py-0.5 rounded border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer text-[11px]"
                >
                  기말고사 범위
                </button>
                <button
                  type="button"
                  onClick={handleSelectAllUnits}
                  className="text-indigo-600 hover:underline font-semibold text-[11px] cursor-pointer"
                >
                  전체 선택
                </button>
                <span className="text-slate-300">·</span>
                <button
                  type="button"
                  onClick={handleClearUnits}
                  className="text-slate-500 hover:underline text-[11px] cursor-pointer"
                >
                  선택 해제
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-52 overflow-y-auto p-1 border border-slate-100 rounded-xl bg-slate-50/50">
              {availableUnits.map((unit) => {
                const isChecked = selectedUnits.includes(unit.name);
                const isMidterm = unit.examType === '중간고사';
                return (
                  <div
                    key={unit.id}
                    onClick={() => toggleUnit(unit.name)}
                    className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                      isChecked
                        ? 'border-indigo-300 bg-white text-indigo-950 font-bold shadow-2xs'
                        : 'border-slate-200 bg-white/70 hover:bg-white text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
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
                        <div className="text-[10px] text-slate-400 font-normal truncate mt-0.5">
                          {unit.keyTopics.slice(0, 2).join(' · ')}
                        </div>
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded shrink-0 ml-1.5 ${isChecked ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-400'}`}>
                      {isChecked ? '출제 포함' : '제외'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: 시험범위 상세 쪽수 및 메모 */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span>3. 시험범위 상세 쪽수 / 학습지 메모 (선택)</span>
            </label>
            <input
              type="text"
              value={scopeDesc}
              onChange={(e) => setScopeDesc(e.target.value)}
              placeholder="예: 교과서 p.12 ~ p.84, 학교 프린트 1~3호 포함"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs text-slate-900"
            />
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-3">
          <div className="text-xs text-slate-500">
            등록 시: <strong>{selectedPublisher} {activeSubject}</strong> · {selectedUnits.length}개 단원
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50"
            >
              닫기
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>교과서 &amp; 시험범위 저장</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
