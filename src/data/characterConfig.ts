export interface CharacterStageInfo {
  stage: 1 | 2 | 3 | 4;
  title: string;
  name: string;
  minLevel: number;
  maxLevel: number;
  imageSrc: string;
  description: string;
  specialPerk: string;
  evolutionCelebration: string;
}

export const CHARACTER_STAGES: CharacterStageInfo[] = [
  {
    stage: 1,
    title: '신비의 지혜알',
    name: '알몬 (Eggmon)',
    minLevel: 1,
    maxLevel: 4,
    imageSrc: '/src/assets/images/study_character_stage1_1794386760719.jpg',
    description: '시험공부를 시작하면 지혜의 빛을 내뿜으며 부화할 준비를 하는 신비로운 학문의 알입니다.',
    specialPerk: '시험 완료 시 기본 경험치 10% 추가 획득',
    evolutionCelebration: '알에 금이 가며 귀여운 꼬리와 안경이 보이기 시작합니다!',
  },
  {
    stage: 2,
    title: '열공 새싹 아기용',
    name: '몽이 (Mongi)',
    minLevel: 5,
    maxLevel: 11,
    imageSrc: '/src/assets/images/study_character_stage2_1794386762428.jpg',
    description: '100발100중 기출문제를 풀며 안경을 고쳐 쓰고 부지런히 수학 공식을 필기하는 아기 드래곤입니다.',
    specialPerk: '100발100중 실전 문제 정답 시 집중력 +5 상승',
    evolutionCelebration: '몽이가 무럭무럭 자라 마법 학사모를 착용했습니다!',
  },
  {
    stage: 3,
    title: '학사 연구원',
    name: '루디 (Rudy)',
    minLevel: 12,
    maxLevel: 24,
    imageSrc: '/src/assets/images/study_character_stage3_1794386762200.jpg',
    description: '빛나는 마법 깃펜으로 오답을 명쾌하게 파헤치고 블랙라벨 심화 문제에 거침없이 도전하는 학자입니다.',
    specialPerk: '블랙라벨 심화 문항 정답 시 지력 +10 및 추가 열매 획득',
    evolutionCelebration: '루디의 몸 주위로 별빛 지혜의 마법진이 활성화되었습니다!',
  },
  {
    stage: 4,
    title: '대현자 아크마스터',
    name: '아르카나 (Arcana)',
    minLevel: 25,
    maxLevel: 99,
    imageSrc: '/src/assets/images/study_character_stage4_1794386761933.jpg',
    description: '전과목을 마스터하고 고난도 킬러 문항도 한눈에 꿰뚫어 보는 전설의 지혜 드래곤 마스터입니다.',
    specialPerk: '모든 오답노트 유사 문제 생성 시 1등급 킬러 모드 자동 해금',
    evolutionCelebration: '축하합니다! 전설의 대현자 경지에 도달했습니다!',
  },
];

export const INITIAL_BADGES = [
  {
    id: 'first_exam',
    name: '첫 시험 완주',
    description: '처음으로 타이머를 켜고 실전 모의고사를 완주했습니다.',
    icon: '🎯',
  },
  {
    id: 'math_ace',
    name: '100발100중 명사수',
    description: '수학 모의고사에서 90점 이상의 우수한 성적을 거두었습니다.',
    icon: '🏹',
  },
  {
    id: 'blacklabel_slayer',
    name: '블랙라벨 정복자',
    description: '블랙라벨 최고난도 킬러 문제를 성공적으로 풀었습니다.',
    icon: '👑',
  },
  {
    id: 'wrong_note_master',
    name: '오답 클리닉 마스터',
    description: '오답노트 복습 및 유사 문제를 5개 이상 클리어했습니다.',
    icon: '📝',
  },
  {
    id: 'study_streak_3',
    name: '3일 연속 열공 불꽃',
    description: '3일 연속으로 중학 모의고사를 풀고 출석을 달성했습니다.',
    icon: '🔥',
  },
  {
    id: 'all_rounder',
    name: '전과목 마스터',
    description: '수학, 영어, 국어, 과학 4과목을 모두 한 번 이상 완주했습니다.',
    icon: '🌟',
  },
];

export const CHARACTER_DIALOGUES = [
  '틀린 문제는 네가 더 똑똑해질 수 있는 보물이야!',
  '100발100중 실전 기출로 기본기를 탄탄하게 다져보자!',
  '블랙라벨 심화 문제도 차근차근 풀면 반드시 길이 보여.',
  '오늘도 시험 타이머 켜고 끝까지 집중해 보자. 파이팅!',
  '오답노트를 복습할 때마다 내 마법 경험치가 쑥쑥 올라가!',
  '실전처럼 연습하고 시험장에서는 연습처럼 차분하게!',
];
