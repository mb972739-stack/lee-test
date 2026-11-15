import React, { useState } from 'react';
import {
  DailyReportPoint,
  formatStudyDuration,
} from '../utils/dailyReport';
import { CHARACTER_STAGES } from '../data/characterConfig';

interface ChartProps {
  series: DailyReportPoint[];
  selectedDate: string;
  onSelectDate: (dateKey: string) => void;
  dailyGoalMinutes?: number;
}

export const DailyStudyTimeChart: React.FC<ChartProps> = ({
  series,
  selectedDate,
  onSelectDate,
  dailyGoalMinutes = 30,
}) => {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const activeDate = hoveredDate || selectedDate;
  const activePoint = series.find((p) => p.date === activeDate) || series[series.length - 1];

  const maxMinutes = Math.max(
    dailyGoalMinutes + 10,
    ...series.map((p) => Math.ceil(p.studySeconds / 60))
  );
  // Round Y axis max to clean multiple of 15 or 10
  const yMax = Math.max(30, Math.ceil(maxMinutes / 15) * 15);
  const yTicks = [0, Math.round(yMax / 2), yMax];

  const chartW = 560;
  const chartH = 210;
  const padL = 40;
  const padR = 14;
  const padT = 18;
  const padB = 34;
  const plotW = chartW - padL - padR;
  const plotH = chartH - padT - padB;

  const goalY = padT + plotH - (dailyGoalMinutes / yMax) * plotH;
  const slotW = plotW / Math.max(1, series.length);
  const barW = Math.min(28, Math.max(12, slotW * 0.56));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 flex flex-col justify-between space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">일별 공부 시간</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            막대를 누르면 해당 날짜의 상세 리포트로 전환됩니다
          </p>
        </div>
        {activePoint && (
          <div className="text-right shrink-0">
            <div className="text-xs text-slate-500 tabular-nums">
              {activePoint.shortDate} ({activePoint.weekday})
            </div>
            <div className="text-sm font-bold text-slate-900 font-mono tabular-nums">
              {formatStudyDuration(activePoint.studySeconds)}
            </div>
          </div>
        )}
      </div>

      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${chartW} ${chartH}`}
          className="w-full h-52 select-none"
          role="img"
          aria-label="일별 공부 시간 막대 그래프"
        >
          {/* Horizontal grid & Y ticks */}
          {yTicks.map((tick) => {
            const y = padT + plotH - (tick / yMax) * plotH;
            return (
              <g key={tick}>
                <line
                  x1={padL}
                  y1={y}
                  x2={chartW - padR}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                />
                <text
                  x={padL - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-slate-400 text-[10px] font-mono tabular-nums"
                >
                  {tick}분
                </text>
              </g>
            );
          })}

          {/* Daily goal reference line */}
          <line
            x1={padL}
            y1={goalY}
            x2={chartW - padR}
            y2={goalY}
            stroke="#0284c7"
            strokeWidth="1.25"
            strokeDasharray="4 4"
          />
          <text
            x={chartW - padR}
            y={goalY - 5}
            textAnchor="end"
            className="fill-sky-700 text-[10px] font-semibold tabular-nums"
          >
            목표 {dailyGoalMinutes}분
          </text>

          {/* Bars */}
          {series.map((point, idx) => {
            const cx = padL + slotW * idx + slotW / 2;
            const mins = point.studySeconds / 60;
            const barH = mins > 0 ? Math.max(4, (mins / yMax) * plotH) : 0;
            const barY = padT + plotH - barH;
            const isSelected = point.date === selectedDate;
            const isHovered = point.date === hoveredDate;
            const metGoal = mins >= dailyGoalMinutes;

            const fillColor = isSelected
              ? '#4338ca'
              : metGoal
              ? '#059669'
              : mins > 0
              ? '#6366f1'
              : '#e2e8f0';

            return (
              <g
                key={point.date}
                className="cursor-pointer"
                onClick={() => onSelectDate(point.date)}
                onMouseEnter={() => setHoveredDate(point.date)}
                onMouseLeave={() => setHoveredDate(null)}
              >
                {/* Invisible hit column for easier clicking */}
                <rect
                  x={padL + slotW * idx}
                  y={padT}
                  width={slotW}
                  height={plotH + padB}
                  fill="transparent"
                />

                {/* Selected column subtle backdrop */}
                {isSelected && (
                  <rect
                    x={cx - barW / 2 - 4}
                    y={padT}
                    width={barW + 8}
                    height={plotH}
                    rx="6"
                    fill="#eef2ff"
                    opacity="0.7"
                  />
                )}

                {/* Actual bar or zero baseline tick */}
                {barH > 0 ? (
                  <rect
                    x={cx - barW / 2}
                    y={barY}
                    width={barW}
                    height={barH}
                    rx="4"
                    fill={fillColor}
                    opacity={isHovered && !isSelected ? 0.85 : 1}
                    className="transition-opacity duration-150"
                  />
                ) : (
                  <rect
                    x={cx - barW / 2}
                    y={padT + plotH - 2}
                    width={barW}
                    height={2}
                    rx="1"
                    fill={isSelected ? '#4338ca' : '#cbd5e1'}
                  />
                )}

                {/* Value label above bar on select/hover */}
                {(isSelected || isHovered) && mins > 0 && (
                  <text
                    x={cx}
                    y={Math.max(padT + 10, barY - 6)}
                    textAnchor="middle"
                    className="fill-slate-800 text-[10px] font-bold font-mono tabular-nums"
                  >
                    {Math.round(mins * 10) / 10}분
                  </text>
                )}

                {/* X-axis label */}
                <text
                  x={cx}
                  y={chartH - 14}
                  textAnchor="middle"
                  className={`text-[10px] font-mono tabular-nums ${
                    isSelected ? 'fill-indigo-700 font-bold' : 'fill-slate-500'
                  }`}
                >
                  {series.length <= 7 || idx % 2 === 0 || isSelected ? point.shortDate : ''}
                </text>
                <text
                  x={cx}
                  y={chartH - 3}
                  textAnchor="middle"
                  className={`text-[9px] ${
                    isSelected ? 'fill-indigo-700 font-semibold' : 'fill-slate-400'
                  }`}
                >
                  {series.length <= 7 || idx % 2 === 0 || isSelected ? point.weekday : ''}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Compact unboxed legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-indigo-500 inline-block" />
            <span>학습 진행</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600 inline-block" />
            <span>목표 달성 ({dailyGoalMinutes}분 이상)</span>
          </span>
        </div>
        <span className="font-mono tabular-nums text-slate-600">
          기간 합계 {formatStudyDuration(series.reduce((s, p) => s + p.studySeconds, 0))}
        </span>
      </div>
    </div>
  );
};

export const DailyAccuracyChart: React.FC<ChartProps> = ({
  series,
  selectedDate,
  onSelectDate,
}) => {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const activeDate = hoveredDate || selectedDate;
  const activePoint = series.find((p) => p.date === activeDate) || series[series.length - 1];

  const chartW = 560;
  const chartH = 210;
  const padL = 40;
  const padR = 14;
  const padT = 18;
  const padB = 34;
  const plotW = chartW - padL - padR;
  const plotH = chartH - padT - padB;

  const slotW = plotW / Math.max(1, series.length);
  const yTicks = [0, 50, 80, 100];

  const pointsWithCoords = series.map((p, idx) => {
    const x = padL + slotW * idx + slotW / 2;
    const y =
      p.accuracyPercent !== null
        ? padT + plotH - (p.accuracyPercent / 100) * plotH
        : null;
    return { point: p, idx, x, y };
  });

  const validPoints = pointsWithCoords.filter((item) => item.y !== null) as Array<{
    point: DailyReportPoint;
    idx: number;
    x: number;
    y: number;
  }>;

  const polylinePoints = validPoints.map((v) => `${v.x},${v.y}`).join(' ');
  const areaPath =
    validPoints.length >= 2
      ? `M ${validPoints[0].x},${padT + plotH} ${validPoints
          .map((v) => `L ${v.x},${v.y}`)
          .join(' ')} L ${validPoints[validPoints.length - 1].x},${padT + plotH} Z`
      : '';

  const totalSolved = series.reduce((s, p) => s + p.questionsSolved, 0);
  const totalCorrect = series.reduce((s, p) => s + p.correctCount, 0);
  const periodAccuracy =
    totalSolved > 0 ? Math.round((totalCorrect / totalSolved) * 1000) / 10 : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 flex flex-col justify-between space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">일별 정답률 추이</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            응시한 날짜의 문항 정답률(%) 변화를 확인합니다
          </p>
        </div>
        {activePoint && (
          <div className="text-right shrink-0">
            <div className="text-xs text-slate-500 tabular-nums">
              {activePoint.shortDate} ({activePoint.weekday})
            </div>
            <div className="text-sm font-bold text-slate-900 font-mono tabular-nums">
              {activePoint.accuracyPercent !== null
                ? `${activePoint.accuracyPercent}% (${activePoint.correctCount}/${activePoint.questionsSolved})`
                : '응시 기록 없음'}
            </div>
          </div>
        )}
      </div>

      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${chartW} ${chartH}`}
          className="w-full h-52 select-none"
          role="img"
          aria-label="일별 정답률 변화 그래프"
        >
          <defs>
            <linearGradient id="accuracyAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Gridlines */}
          {yTicks.map((tick) => {
            const y = padT + plotH - (tick / 100) * plotH;
            const isTarget = tick === 80;
            return (
              <g key={tick}>
                <line
                  x1={padL}
                  y1={y}
                  x2={chartW - padR}
                  y2={y}
                  stroke={isTarget ? '#059669' : '#e2e8f0'}
                  strokeWidth={isTarget ? '1.25' : '1'}
                  strokeDasharray={isTarget ? '4 4' : undefined}
                />
                <text
                  x={padL - 8}
                  y={y + 4}
                  textAnchor="end"
                  className={`text-[10px] font-mono tabular-nums ${
                    isTarget ? 'fill-emerald-700 font-semibold' : 'fill-slate-400'
                  }`}
                >
                  {tick}%
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          {areaPath && <path d={areaPath} fill="url(#accuracyAreaGrad)" />}

          {/* Connecting line */}
          {validPoints.length >= 2 && (
            <polyline
              fill="none"
              stroke="#059669"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={polylinePoints}
            />
          )}

          {/* Day nodes & X-axis */}
          {pointsWithCoords.map(({ point, idx, x, y }) => {
            const isSelected = point.date === selectedDate;
            const isHovered = point.date === hoveredDate;
            const acc = point.accuracyPercent;
            const nodeColor =
              acc === null
                ? '#cbd5e1'
                : acc >= 80
                ? '#059669'
                : acc >= 60
                ? '#d97706'
                : '#dc2626';

            return (
              <g
                key={point.date}
                className="cursor-pointer"
                onClick={() => onSelectDate(point.date)}
                onMouseEnter={() => setHoveredDate(point.date)}
                onMouseLeave={() => setHoveredDate(null)}
              >
                <rect
                  x={padL + slotW * idx}
                  y={padT}
                  width={slotW}
                  height={plotH + padB}
                  fill="transparent"
                />

                {isSelected && (
                  <line
                    x1={x}
                    y1={padT}
                    x2={x}
                    y2={padT + plotH}
                    stroke="#6366f1"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                )}

                {y !== null ? (
                  <>
                    {isSelected && (
                      <circle cx={x} cy={y} r="9" fill="#eef2ff" stroke="#4f46e5" strokeWidth="1.5" />
                    )}
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected || isHovered ? 5.5 : 4.5}
                      fill="#ffffff"
                      stroke={nodeColor}
                      strokeWidth="2.5"
                    />
                    {(isSelected || isHovered) && (
                      <text
                        x={x}
                        y={Math.max(padT + 10, y - 10)}
                        textAnchor="middle"
                        className="fill-slate-900 text-[10px] font-bold font-mono tabular-nums"
                      >
                        {acc}%
                      </text>
                    )}
                  </>
                ) : (
                  <circle
                    cx={x}
                    cy={padT + plotH - 4}
                    r="3"
                    fill="#ffffff"
                    stroke={isSelected ? '#4f46e5' : '#cbd5e1'}
                    strokeWidth="1.5"
                  />
                )}

                <text
                  x={x}
                  y={chartH - 14}
                  textAnchor="middle"
                  className={`text-[10px] font-mono tabular-nums ${
                    isSelected ? 'fill-indigo-700 font-bold' : 'fill-slate-500'
                  }`}
                >
                  {series.length <= 7 || idx % 2 === 0 || isSelected ? point.shortDate : ''}
                </text>
                <text
                  x={x}
                  y={chartH - 3}
                  textAnchor="middle"
                  className={`text-[9px] ${
                    isSelected ? 'fill-indigo-700 font-semibold' : 'fill-slate-400'
                  }`}
                >
                  {series.length <= 7 || idx % 2 === 0 || isSelected ? point.weekday : ''}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-emerald-600 bg-white inline-block" />
            <span>80% 이상 우수</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-amber-600 bg-white inline-block" />
            <span>60~79% 안정권</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-slate-300 bg-white inline-block" />
            <span>미응시</span>
          </span>
        </div>
        <span className="font-mono tabular-nums text-slate-600">
          {periodAccuracy !== null
            ? `기간 평균 ${periodAccuracy}% (${totalCorrect}/${totalSolved})`
            : '기간 내 응시 기록 없음'}
        </span>
      </div>
    </div>
  );
};

export const DailyCharacterGrowthChart: React.FC<ChartProps> = ({
  series,
  selectedDate,
  onSelectDate,
}) => {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const activeDate = hoveredDate || selectedDate;
  const activePoint = series.find((p) => p.date === activeDate) || series[series.length - 1];

  const minLv = Math.max(1, Math.min(...series.map((p) => p.startLevel)) - 1);
  const maxLvRaw = Math.max(...series.map((p) => p.endLevel));
  const maxLv = Math.max(minLv + 3, maxLvRaw + 1);
  const lvSpan = Math.max(1, maxLv - minLv);

  const maxExp = Math.max(100, ...series.map((p) => p.expGained));

  const chartW = 920;
  const chartH = 225;
  const padL = 48;
  const padR = 20;
  const padT = 22;
  const levelAreaH = 118;
  const expGap = 16;
  const expAreaH = 34;
  const padB = 35;

  const expTopY = padT + levelAreaH + expGap;
  const plotW = chartW - padL - padR;
  const slotW = plotW / Math.max(1, series.length);

  // Integer Y ticks for levels
  const tickStep = lvSpan > 8 ? Math.ceil(lvSpan / 4) : lvSpan > 4 ? 2 : 1;
  const yTicks: number[] = [];
  for (let lv = minLv; lv <= maxLv; lv += tickStep) {
    yTicks.push(lv);
  }
  if (yTicks[yTicks.length - 1] !== maxLv) {
    yTicks.push(maxLv);
  }

  const levelToY = (lv: number) => padT + levelAreaH - ((lv - minLv) / lvSpan) * levelAreaH;

  const lineCoords = series.map((p, idx) => {
    const x = padL + slotW * idx + slotW / 2;
    return {
      point: p,
      idx,
      x,
      yStart: levelToY(p.startLevel),
      yEnd: levelToY(p.endLevel),
    };
  });

  const polylineStr = lineCoords.map((c) => `${c.x},${c.yEnd}`).join(' ');
  const totalExpWindow = series.reduce((s, p) => s + p.expGained, 0);
  const totalLevelsWindow = series.reduce((s, p) => s + p.levelGained, 0);

  const activeStageInfo =
    CHARACTER_STAGES.find((s) => s.stage === (activePoint?.endStage || 1)) || CHARACTER_STAGES[0];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            일간 캐릭터 레벨 성장 &amp; 획득 EXP 추이
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            날짜별 시작 레벨 → 도달 레벨 변화와 하루 동안 획득한 경험치(EXP)를 보여줍니다
          </p>
        </div>

        {activePoint && (
          <div className="flex items-center gap-3 text-xs bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 shrink-0">
            <div className="font-mono tabular-nums font-bold text-slate-900">
              {activePoint.shortDate} ({activePoint.weekday})
            </div>
            <span className="text-slate-300" aria-hidden="true">|</span>
            <div className="font-mono tabular-nums text-indigo-700 font-bold">
              {activePoint.levelGained > 0
                ? `Lv.${activePoint.startLevel} → Lv.${activePoint.endLevel} (+${activePoint.levelGained})`
                : `Lv.${activePoint.endLevel}`}
            </div>
            <span className="text-slate-300" aria-hidden="true">|</span>
            <div className="font-mono tabular-nums text-amber-700 font-semibold">
              +{activePoint.expGained} EXP
            </div>
            <span className="text-slate-300 hidden sm:inline" aria-hidden="true">|</span>
            <div className="text-slate-600 hidden sm:block">
              {activeStageInfo.name}
            </div>
          </div>
        )}
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartW} ${chartH}`}
          className="w-full min-w-[540px] h-56 select-none"
          role="img"
          aria-label="일간 캐릭터 레벨 성장 및 경험치 차트"
        >
          {/* Level gridlines */}
          {yTicks.map((lv) => {
            const y = levelToY(lv);
            return (
              <g key={lv}>
                <line
                  x1={padL}
                  y1={y}
                  x2={chartW - padR}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                />
                <text
                  x={padL - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-slate-400 text-[10px] font-mono tabular-nums"
                >
                  Lv.{lv}
                </text>
              </g>
            );
          })}

          {/* EXP section baseline & label */}
          <line
            x1={padL}
            y1={expTopY + expAreaH}
            x2={chartW - padR}
            y2={expTopY + expAreaH}
            stroke="#e2e8f0"
            strokeWidth="1"
          />
          <text
            x={padL - 8}
            y={expTopY + expAreaH / 2 + 3}
            textAnchor="end"
            className="fill-amber-700 text-[9px] font-semibold font-mono"
          >
            EXP
          </text>

          {/* Character level progression line */}
          {lineCoords.length >= 2 && (
            <polyline
              fill="none"
              stroke="#4f46e5"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={polylineStr}
            />
          )}

          {/* Daily points, vertical level jump stems, & EXP bars */}
          {lineCoords.map(({ point, idx, x, yStart, yEnd }) => {
            const isSelected = point.date === selectedDate;
            const isHovered = point.date === hoveredDate;
            const barW = Math.min(24, Math.max(10, slotW * 0.44));
            const expH =
              point.expGained > 0 ? Math.max(4, (point.expGained / maxExp) * expAreaH) : 0;

            return (
              <g
                key={point.date}
                className="cursor-pointer"
                onClick={() => onSelectDate(point.date)}
                onMouseEnter={() => setHoveredDate(point.date)}
                onMouseLeave={() => setHoveredDate(null)}
              >
                <rect
                  x={padL + slotW * idx}
                  y={padT}
                  width={slotW}
                  height={chartH - padT}
                  fill="transparent"
                />

                {isSelected && (
                  <rect
                    x={padL + slotW * idx + 4}
                    y={padT - 6}
                    width={Math.max(10, slotW - 8)}
                    height={levelAreaH + expGap + expAreaH + 10}
                    rx="8"
                    fill="#eef2ff"
                    opacity="0.6"
                  />
                )}

                {/* Vertical jump highlight when level increased that day */}
                {point.levelGained > 0 && (
                  <line
                    x1={x}
                    y1={yStart}
                    x2={x}
                    y2={yEnd}
                    stroke="#059669"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                )}

                {/* Start level dot (if leveled up that day) */}
                {point.levelGained > 0 && (
                  <circle cx={x} cy={yStart} r="3.5" fill="#ffffff" stroke="#059669" strokeWidth="2" />
                )}

                {/* End level node */}
                {isSelected && (
                  <circle cx={x} cy={yEnd} r="9" fill="#ffffff" stroke="#4f46e5" strokeWidth="1.5" />
                )}
                <circle
                  cx={x}
                  cy={yEnd}
                  r={point.levelGained > 0 || isSelected || isHovered ? 5 : 3.5}
                  fill={point.levelGained > 0 ? '#059669' : '#4f46e5'}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />

                {/* Level delta label */}
                {(point.levelGained > 0 || isSelected || isHovered) && (
                  <text
                    x={x}
                    y={Math.max(12, yEnd - 10)}
                    textAnchor="middle"
                    className={`text-[10px] font-bold font-mono tabular-nums ${
                      point.levelGained > 0 ? 'fill-emerald-700' : 'fill-slate-700'
                    }`}
                  >
                    {point.levelGained > 0 ? `+${point.levelGained} Lv` : `Lv.${point.endLevel}`}
                  </text>
                )}

                {/* EXP bar */}
                {expH > 0 ? (
                  <rect
                    x={x - barW / 2}
                    y={expTopY + expAreaH - expH}
                    width={barW}
                    height={expH}
                    rx="3"
                    fill={isSelected ? '#d97706' : '#f59e0b'}
                    opacity={isHovered || isSelected ? 1 : 0.78}
                  />
                ) : (
                  <rect
                    x={x - barW / 2}
                    y={expTopY + expAreaH - 2}
                    width={barW}
                    height={2}
                    rx="1"
                    fill="#cbd5e1"
                  />
                )}

                {/* X-axis */}
                <text
                  x={x}
                  y={chartH - 16}
                  textAnchor="middle"
                  className={`text-[10px] font-mono tabular-nums ${
                    isSelected ? 'fill-indigo-700 font-bold' : 'fill-slate-500'
                  }`}
                >
                  {point.shortDate}
                </text>
                <text
                  x={x}
                  y={chartH - 4}
                  textAnchor="middle"
                  className={`text-[9px] ${
                    isSelected ? 'fill-indigo-700 font-semibold' : 'fill-slate-400'
                  }`}
                >
                  {point.weekday}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Stage milestone reference & summary footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs text-slate-500">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span>
            진화 단계 기준: 1단계 알몬(Lv.1~4) · 2단계 몽이(Lv.5~11) · 3단계 루디(Lv.12~24) · 4단계 아르카나(Lv.25+)
          </span>
        </div>
        <div className="font-mono tabular-nums text-slate-700 font-semibold">
          기간 성장 +{totalLevelsWindow} Lv · 총 +{totalExpWindow} EXP
        </div>
      </div>
    </div>
  );
};
