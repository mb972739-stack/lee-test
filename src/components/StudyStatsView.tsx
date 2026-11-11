import React from 'react';
import { useStudy } from '../context/StudyContext';
import { BarChart2, Flame, Award, Clock, BookOpen, CheckCircle2, TrendingUp } from 'lucide-react';
import { SUBJECT_ORDER } from '../types';

export const StudyStatsView: React.FC = () => {
  const { currentStudent, setActiveTab } = useStudy();

  const history = currentStudent.examHistory;
  const totalExams = history.length;
  const avgScore = totalExams > 0 ? Math.round(history.reduce((acc, h) => acc + (h.score || 0), 0) / totalExams) : 0;
  const totalStudyMinutes = currentStudent.character.totalStudyMinutes;
  const masteredNotesCount = currentStudent.wrongNotes.filter((n) => n.isMastered).length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold text-indigo-600 flex items-center gap-1.5">
            <BarChart2 className="w-3.5 h-3.5" />
            <span>학습 분석 리포트</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
            {currentStudent.name} 학생의 모의고사 성취도
          </h2>
          <p className="text-xs text-slate-500">
            {currentStudent.schoolName || '중학교'} · {currentStudent.grade}
          </p>
        </div>

        <button
          onClick={() => setActiveTab('exam_config')}
          className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors"
        >
          모의고사 응시하기
        </button>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>응시 모의고사</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
            {totalExams}회
          </div>
          <div className="text-[11px] text-slate-400">평균 {avgScore}점</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <Clock className="w-4 h-4 text-sky-600" />
            <span>누적 집중 시간</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
            {totalStudyMinutes}분
          </div>
          <div className="text-[11px] text-slate-400">타이머 실전 훈련</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>오답 정복 완료</span>
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 tabular-nums">
            {masteredNotesCount}개
          </div>
          <div className="text-[11px] text-slate-400">총 {currentStudent.wrongNotes.length}개 중</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>열공 연속 출석</span>
          </div>
          <div className="text-2xl font-extrabold text-amber-600 tabular-nums">
            {currentStudent.character.streakDays}일째
          </div>
          <div className="text-[11px] text-slate-400">매일 꾸준한 실천</div>
        </div>
      </div>

      {/* Subject Performance Breakdown (수학 -> 영어 -> 국어 -> 과학) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h3 className="font-extrabold text-slate-900 text-sm">과목별 성취도 분석 (표준 순서)</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SUBJECT_ORDER.map((sub) => {
            const subjectExams = history.filter((h) => h.subject === sub);
            const count = subjectExams.length;
            const subAvg = count > 0 ? Math.round(subjectExams.reduce((acc, h) => acc + (h.score || 0), 0) / count) : 0;
            const wrongCount = currentStudent.wrongNotes.filter((n) => n.subject === sub).length;

            return (
              <div key={sub} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900">{sub}</span>
                  <span className="text-slate-500 tabular-nums">
                    응시 {count}회 · 평균 {subAvg > 0 ? `${subAvg}점` : '미응시'}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${subAvg}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-500 flex justify-between">
                  <span>오답노트 등록: {wrongCount}개</span>
                  <span>{sub === '수학' ? '100발100중 · 블랙라벨' : '내신 기출'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Exam History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h3 className="font-extrabold text-slate-900 text-sm">최근 응시 내역</h3>

        {history.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            아직 응시한 모의고사 기록이 없습니다.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {history.map((h) => (
              <div key={h.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div>
                  <div className="font-bold text-slate-900">{h.title}</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    {h.grade} {h.semester} {h.examType} · {h.subject} · {h.timerMinutes}분
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono font-extrabold text-base text-indigo-600 tabular-nums">
                    {h.score}점
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {new Date(h.startedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
