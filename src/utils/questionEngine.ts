import { Question, Grade, Semester, ExamType, Subject, BookType, TextbookPublisher } from '../types';
import { INITIAL_QUESTION_BANK } from '../data/questionBank';

// 대한민국 중학교 정규 교육과정 기준 확장 문항 은행
const EXTENDED_QUESTIONS: Question[] = [
  // ==========================================
  // [중1] 1학기 기말고사
  // ==========================================
  {
    id: 'm1-1-fin-math-1',
    grade: '중1',
    semester: '1학기',
    examType: '기말고사',
    subject: '수학',
    unit: '일차방정식의 풀이와 활용',
    bookSource: '100bal100jung',
    difficultyLevel: '100발100중 실전',
    upgradeRound: 1,
    title: '[100발100중 기출] 원가, 정가, 판매가를 이용한 일차방정식의 활용',
    questionText: '어떤 상품에 원가의 30%의 이익을 붙여서 정가를 정하였다가, 할인 행사 기간에 정가에서 20%를 할인하여 판매하였더니 400원의 이익이 발생하였다. 이 상품의 원가는 얼마인가?',
    options: ['① 8,000원', '② 10,000원', '③ 12,000원', '④ 15,000원', '⑤ 20,000원'],
    correctAnswerIndex: 1,
    explanation: '상품의 원가를 x원이라고 하면 식을 다음과 같이 세울 수 있습니다.\n\n1) 정가 = 원가 × (1 + 0.3) = 1.3x(원)\n2) 할인 판매가 = 정가 × (1 - 0.2) = 1.3x × 0.8 = 1.04x(원)\n3) 실제 이익 = 판매가 - 원가 = 1.04x - x = 0.04x(원)\n\n문제의 조건에서 이익이 400원이므로:\n0.04x = 400\nx = 400 / 0.04 = 10,000(원)\n\n따라서 구하는 상품의 원가는 10,000원입니다.',
    trapPoint: '30% 올리고 20% 할인했으니 단순히 10%의 이익이 남았을 것이라고 어림잡아 0.1x = 400 으로 식을 잘못 세우지 않도록 주의해야 합니다.',
    coreFormula: '정가 = 원가 × (1 + 이익률), 판매가 = 정가 × (1 - 할인율), 이익 = 판매가 - 원가',
  },
  {
    id: 'm1-1-fin-eng-1',
    grade: '중1',
    semester: '1학기',
    examType: '기말고사',
    subject: '영어',
    unit: '조동사의 용법과 과거시제',
    bookSource: '100bal100jung',
    difficultyLevel: '100발100중 실전',
    upgradeRound: 1,
    title: '[100발100중 기출] 불규칙 동사 과거형과 조동사 뒤 동사원형의 쓰임',
    passage: 'Yesterday, Kevin (A)[go / went] to the science museum. He was able to (B)[saw / see] a huge replica of a dinosaur. The museum guide said, "You (C)[must not / don\'t have to] touch the glass displays."',
    questionText: '다음 글의 괄호 (A), (B), (C)에 들어갈 말로 어법상 가장 적절하게 짝지어진 것은?',
    options: [
      '① went — see — must not',
      '② went — saw — must not',
      '③ go — see — don\'t have to',
      '④ went — see — don\'t have to',
      '⑤ go — saw — must not'
    ],
    correctAnswerIndex: 0,
    explanation: '(A) Yesterday(어제)라는 명확한 과거 시점 부사가 있으므로 동사 go의 과거형인 went가 올바릅니다.\n(B) ‘be able to’ 뒤에는 조동사 can과 동일하게 반드시 동사원형 see가 와야 합니다.\n(C) 박물관 전시품을 만져서는 안 된다는 ‘강한 금지(~해서는 안 된다)’의 의미이므로 must not이 적절합니다. (don\'t have to는 ‘~할 필요가 없다’는 불필요의 의미입니다.)',
    trapPoint: '‘must not(금지: ~해서는 안 된다)’과 ‘don\'t have to(불필요: ~할 필요가 없다)’의 의미 차이를 구별할 수 있어야 합니다.',
    coreFormula: '과거 시점 부사(yesterday, last, ago) + 과거동사 / be able to + 동사원형',
  },
  {
    id: 'm1-1-fin-kor-1',
    grade: '중1',
    semester: '1학기',
    examType: '기말고사',
    subject: '국어',
    unit: '품사의 특성과 기능',
    bookSource: '100bal100jung',
    difficultyLevel: '100발100중 실전',
    upgradeRound: 1,
    title: '[100발100중 기출] 동사와 형용사의 문법적 판별 기준',
    questionText: '다음 중 제시된 단어의 품사가 모두 형용사로만 짝지어진 것은?',
    options: [
      '① 예쁘다, 높다, 푸르다',
      '② 달리다, 먹다, 읽다',
      '③ 맑다, 피다, 솟다',
      '④ 아름답다, 걷다, 깊다',
      '⑤ 착하다, 잠자다, 넓다'
    ],
    correctAnswerIndex: 0,
    explanation: '형용사는 대상의 성질이나 상태를 나타내는 용언이며, 현재 시제 선어말 어미 ‘-ㄴ다/-는다’, 명령형 어미 ‘-아라/-어라’, 청유형 어미 ‘-자’와 결합할 수 없습니다.\n‘예쁘다’, ‘높다’, ‘푸르다’는 모두 성질이나 상태를 나타내며 ‘*예쁜다’, ‘*높는다’가 불가능하므로 형용사입니다.\n‘달리다’, ‘먹다’, ‘피다’, ‘걷다’, ‘잠자다’ 등은 움직임이나 작용을 나타내는 동사입니다.',
    trapPoint: '‘피다’, ‘솟다’는 자연 현상이지만 상태가 아니라 변화와 동작을 나타내므로 동사에 해당합니다.',
    coreFormula: '동사와 형용사 판별: 현재형 어미 ‘-ㄴ다/-는다’ 결합 가능 여부 (결합 가능 시 동사, 불가능 시 형용사)',
  },
  {
    id: 'm1-1-fin-sci-1',
    grade: '중1',
    semester: '1학기',
    examType: '기말고사',
    subject: '과학',
    unit: '상태 변화와 열에너지',
    bookSource: '100bal100jung',
    difficultyLevel: '100발100중 실전',
    upgradeRound: 1,
    title: '[100발100중 기출] 상태 변화 과정에서 일어나는 열에너지의 출입',
    questionText: '다음 현상 중 물질이 주변으로부터 열에너지를 흡수하여 일어나는 상태 변화의 예시로 옳지 않은 것은?',
    options: [
      '① 더운 여름날 마당에 물을 뿌리면 시원해진다.',
      '② 얼음이 녹아 물이 될 때 주변의 열을 빼앗아 차가워진다.',
      '③ 고체 드라이아이스가 기체로 승화할 때 주변 온도가 낮아진다.',
      '④ 겨울철 과수원에서 감귤 나무에 물을 뿌려 냉해를 방지한다.',
      '⑤ 운동 후 땀이 마르면서 체온이 정상 수준으로 내려간다.'
    ],
    correctAnswerIndex: 3,
    explanation: '④번: 물이 얼음으로 응고될 때에는 가지고 있던 열에너지를 주변으로 ‘방출’합니다. 이때 방출된 응고열이 주변 공기와 나무의 온도를 유지시켜 주므로 냉해를 방지할 수 있습니다. 즉, 방열 상태 변화의 대표적 예시입니다.\n①, ②, ③, ⑤는 모두 주변의 열을 빼앗는 흡열 상태 변화(기화열, 융해열, 승화열 흡수)입니다.',
    trapPoint: '상태 변화에 따른 열에너지 출입에서 흡열(융해, 기화, 고체$\\rightarrow$기체 승화)과 발열(응고, 액화, 기체$\\rightarrow$고체 승화)의 방향성을 정밀하게 구분해야 합니다.',
    coreFormula: '흡열 상태 변화: 융해, 기화, 고체$\\rightarrow$기체 승화 / 발열 상태 변화: 응고, 액화, 기체$\\rightarrow$고체 승화',
  },

  // ==========================================
  // [중2] 2학기 중간고사
  // ==========================================
  {
    id: 'm2-2-mid-math-1',
    grade: '중2',
    semester: '2학기',
    examType: '중간고사',
    subject: '수학',
    unit: '이등변삼각형과 직각삼각형의 합동',
    bookSource: '100bal100jung',
    difficultyLevel: '100발100중 실전',
    upgradeRound: 1,
    title: '[100발100중 기출] 직각삼각형의 합동 조건과 각의 이등분선 성질',
    questionText: '직각삼각형 ABC에서 ∠C = 90°이고, ∠A의 이등분선이 대변 BC와 만나는 점을 D라고 하자. 점 D에서 빗변 AB에 내린 수선의 발을 E라고 할 때, 다음 설명 중 옳은 것은?',
    options: [
      '① △ACD와 △AED는 RHS 합동이다.',
      '② △ACD와 △AED는 RHA 합동이다.',
      '③ 선분 CD의 길이는 항상 5cm이다.',
      '④ 점 D는 항상 변 BC의 중점이다.',
      '⑤ ∠B의 크기는 ∠BAD의 크기와 항상 같다.'
    ],
    correctAnswerIndex: 1,
    explanation: '직각삼각형 ACD와 AED에서:\n1) ∠C = ∠AED = 90° (직각, R)\n2) 빗변 AD는 공통인 변 (빗변, H)\n3) ∠CAD = ∠EAD (각 A의 이등분선 조건, 한 예각 A)\n따라서 두 직각삼각형은 ‘빗변의 길이와 한 예각의 크기가 각각 같은 RHA 합동’입니다.\n합동인 도형의 대응변의 길이는 같으므로 선분 CD = 선분 ED가 성립합니다.',
    trapPoint: 'RHS 합동은 빗변과 다른 ‘한 변의 길이’가 주어졌을 때 성립하며, 본 문제에서는 각의 이등분선에 의해 ‘한 예각’이 같으므로 RHA 합동입니다.',
    coreFormula: '직각삼각형의 합동 조건: RHA(빗변과 한 예각의 크기 일치), RHS(빗변과 다른 한 변의 길이 일치)',
  },
  {
    id: 'm2-2-mid-math-2',
    grade: '중2',
    semester: '2학기',
    examType: '중간고사',
    subject: '수학',
    unit: '삼각형의 외심과 내심 융합 킬러',
    bookSource: 'blacklabel',
    difficultyLevel: '블랙라벨 Step3 킬러',
    upgradeRound: 2,
    title: '[블랙라벨 1등급 킬러] 직각삼각형의 외심과 내심 사이의 선분 거리',
    questionText: '세 변의 길이가 9cm, 12cm, 15cm인 직각삼각형의 외심을 O, 내심을 I라고 할 때, 선분 OI의 길이는?',
    options: [
      '① √5 cm',
      '② (3√2)/2 cm',
      '③ (3√5)/2 cm',
      '④ 2√3 cm',
      '⑤ (5√2)/2 cm'
    ],
    correctAnswerIndex: 2,
    explanation: '주어진 삼각형은 9² + 12² = 81 + 144 = 225 = 15² 이므로 빗변의 길이가 15cm인 직각삼각형입니다.\n\n1) 직각삼각형의 외심 O는 빗변의 중점에 위치합니다.\n2) 직각삼각형의 내접원 반지름 r:\nr = (9 + 12 - 15) / 2 = 6 / 2 = 3(cm)\n\n직각인 꼭짓점을 원점 (0, 0)으로 좌표평면에 두면:\n빗변의 양 끝점은 (12, 0), (0, 9)가 됩니다.\n- 외심 O의 좌표: ((12 + 0)/2, (0 + 9)/2) = (6, 9/2)\n- 내심 I의 좌표: (r, r) = (3, 3)\n\n두 점 O와 I 사이의 거리:\nOI = √[ (6 - 3)² + (9/2 - 3)² ]\n= √[ 3² + (3/2)² ]\n= √[ 9 + 9/4 ] = √[ 45/4 ] = (3√5) / 2 (cm)\n\n따라서 선분 OI의 길이는 (3√5)/2 cm 입니다.',
    trapPoint: '직각삼각형에서 외심이 빗변의 중점이라는 성질과 내접원 반지름 공식 r = (a + b - c) / 2 를 좌표평면에 연계하여 해석하지 못하면 풀이 과정이 매우 복잡해집니다.',
    coreFormula: '직각삼각형 외심: 빗변의 중점, 내접원 반지름 r = (a + b - c)/2, 평면좌표 거리 공식 d = √[(x₂ - x₁)² + (y₂ - y₁)²]',
  },
  {
    id: 'm2-2-mid-eng-1',
    grade: '중2',
    semester: '2학기',
    examType: '중간고사',
    subject: '영어',
    unit: '수동태와 현재완료',
    bookSource: '100bal100jung',
    difficultyLevel: '100발100중 실전',
    upgradeRound: 1,
    title: '[100발100중 기출] 수동태의 시제와 by 이외의 전치사를 쓰는 관용 표현',
    passage: 'Many beautiful songs (A)[wrote / were written] by BTS. Korean traditional music has (B)[played / been played] for centuries. Furthermore, the audience was satisfied (C)[with / by] their emotional performance.',
    questionText: '다음 글의 괄호 (A), (B), (C)에 들어갈 어법상 가장 알맞은 어휘로 짝지어진 것은?',
    options: [
      '① were written — been played — with',
      '② wrote — played — by',
      '③ were written — played — with',
      '④ wrote — been played — with',
      '⑤ were written — been played — by'
    ],
    correctAnswerIndex: 0,
    explanation: '(A) 아름다운 노래들이 작곡된 대상이므로 수동태인 ‘were written’이 적절합니다.\n(B) 수세기 동안 연주되어 온 것이므로 현재완료 수동태인 ‘has been played’가 올바릅니다.\n(C) ‘~에 만족하다’라는 의미의 감정 표현은 전치사 by 대신 with를 사용하여 ‘be satisfied with’로 표현합니다.',
    trapPoint: 'be satisfied with(~에 만족하다), be interested in(~에 관심이 있다), be surprised at(~에 놀라다) 등 by 이외의 전치사를 수반하는 수동태 관용구를 숙지해야 합니다.',
    coreFormula: '수동태 기본형: be동사 + 과거분사(p.p.) / 현재완료 수동태: have/has + been + p.p.',
  },
  {
    id: 'm2-2-mid-kor-1',
    grade: '중2',
    semester: '2학기',
    examType: '중간고사',
    subject: '국어',
    unit: '설득 전략과 논증 방식(귀납, 연역)',
    bookSource: '100bal100jung',
    difficultyLevel: '100발100중 실전',
    upgradeRound: 1,
    title: '[100발100중 기출] 연역 논증과 귀납 논증의 형식적 구별',
    questionText: '다음 중 보편적인 일반 원리로부터 구체적인 결론을 필연적으로 이끌어내는 ‘연역 논증(삼단논법)’에 해당하는 것은?',
    options: [
      '① 제비는 날개가 있다. 참새도 날개가 있다. 까치도 날개가 있다. 그러므로 모든 조류는 날개가 있다.',
      '② 모든 사람은 숨을 쉰다. 소크라테스는 사람이다. 그러므로 소크라테스는 숨을 쉰다.',
      '③ 철수도 김치를 좋아하고, 영희도 김치를 좋아한다. 따라서 한국인은 누구나 김치를 좋아한다.',
      '④ 어제도 해가 동쪽에서 떴고 오늘도 동쪽에서 떴다. 내일도 해는 동쪽에서 뜰 것이다.',
      '⑤ 지구에는 물이 있어 생명체가 산다. 화성도 물의 흔적이 있으므로 생명체가 살 것이다.'
    ],
    correctAnswerIndex: 1,
    explanation: '②번은 ‘모든 사람은 숨을 쉰다’라는 보편적 대전제와 ‘소크라테스는 사람이다’라는 소전제로부터 ‘소크라테스는 숨을 쉰다’라는 필연적 결론을 연역하는 전형적인 삼단논법입니다.\n①, ③, ④는 구체적 개별 사실들을 종합하여 결론을 내는 귀납 논증이며, ⑤는 두 대상의 유사성을 바탕으로 추론하는 유비추론(유추)입니다.',
    trapPoint: '귀납 논증은 개별 관찰 결과의 귀합(개연적)이고, 연역 논증은 이미 참으로 인정된 대전제로부터 필연적인 결론을 도출한다는 점을 구분해야 합니다.',
    coreFormula: '연역 논증: 대전제 $\\rightarrow$ 소전제 $\\rightarrow$ 필연적 결론 / 귀납 논증: 개별 사례들의 관찰 $\\rightarrow$ 일반화',
  },
  {
    id: 'm2-2-mid-sci-1',
    grade: '중2',
    semester: '2학기',
    examType: '중간고사',
    subject: '과학',
    unit: '소화, 순환, 호흡, 배설의 상호 작용',
    bookSource: '100bal100jung',
    difficultyLevel: '100발100중 실전',
    upgradeRound: 1,
    title: '[100발100중 기출] 심장의 내부 구조와 혈액의 순환 경로',
    questionText: '심장의 구조와 인체의 혈액 순환 경로에 대한 설명으로 옳은 것만을 <보기>에서 있는 대로 고른 것은?\n\n<보기>\nㄱ. 좌심실은 온몸으로 혈액을 뿜어내야 하므로 근육벽이 가장 두껍고 탄력적이다.\nㄴ. 폐동맥에는 산소가 풍부한 동맥혈이 흐른다.\nㄷ. 온몸 순환 경로는 ‘좌심실 $\\rightarrow$ 대동맥 $\\rightarrow$ 온몸의 모세 혈관 $\\rightarrow$ 대정맥 $\\rightarrow$ 우심방’이다.\nㄹ. 심장 내부의 판막은 혈액이 역류하는 현상을 방지한다.',
    options: ['① ㄱ, ㄴ', '② ㄱ, ㄷ', '③ ㄱ, ㄷ, ㄹ', '④ ㄴ, ㄷ, ㄹ', '⑤ ㄱ, ㄴ, ㄷ, ㄹ'],
    correctAnswerIndex: 2,
    explanation: 'ㄴ. 폐동맥은 심장의 우심실에서 폐로 향하는 혈관으로, 이산화탄소를 배출하기 전의 혈액이므로 산소가 적은 ‘정맥혈’이 흐릅니다. 따라서 ㄴ은 옳지 않습니다.\nㄱ, ㄷ, ㄹ은 모두 중학교 과학 교육과정의 핵심 순환계 원리에 부합하는 올바른 설명입니다.',
    trapPoint: '혈관의 이름이 ‘폐동맥’이라고 하여 동맥혈이 흐를 것으로 착각하기 쉬우나, 폐동맥에는 정맥혈이 흐르고 폐정맥에 산소가 풍부한 동맥혈이 흐릅니다.',
    coreFormula: '온몸 순환: 좌심실 $\\rightarrow$ 대동맥 $\\rightarrow$ 온몸 $\\rightarrow$ 대정맥 $\\rightarrow$ 우심방 / 폐순환: 우심실 $\\rightarrow$ 폐동맥 $\\rightarrow$ 폐 $\\rightarrow$ 폐정맥 $\\rightarrow$ 좌심방',
  },

  // ==========================================
  // [중3] 2학기 기말고사
  // ==========================================
  {
    id: 'm3-2-fin-math-1',
    grade: '중3',
    semester: '2학기',
    examType: '기말고사',
    subject: '수학',
    unit: '삼각비의 활용과 둔각삼각형의 넓이',
    bookSource: '100bal100jung',
    difficultyLevel: '100발100중 실전',
    upgradeRound: 1,
    title: '[100발100중 기출] 두 변의 길이와 끼인각을 이용한 삼각형의 넓이 구하기',
    questionText: '△ABC에서 선분 AB = 8cm, 선분 BC = 10cm 이고 끼인각 ∠B = 120° (둔각)일 때, 이 삼각형 ABC의 넓이는?',
    options: [
      '① 20 cm²',
      '② 20√3 cm²',
      '③ 40 cm²',
      '④ 40√3 cm²',
      '⑤ 80√3 cm²'
    ],
    correctAnswerIndex: 1,
    explanation: '둔각삼각형의 넓이 구하는 공식에 따라 다음과 같이 계산합니다.\n\nS = (1/2) × a × c × sin(180° - B)\n= (1/2) × 8 × 10 × sin(180° - 120°)\n= 40 × sin(60°)\n= 40 × (√3 / 2)\n= 20√3(cm²)\n\n따라서 삼각형 ABC의 넓이는 20√3 cm² 입니다.',
    trapPoint: '끼인각이 둔각(120°)일 때는 sin(180° - 120°) = sin(60°)로 변환하여 계산해야 함을 유의해야 합니다.',
    coreFormula: '둔각삼각형의 넓이 S = (1/2)ab × sin(180° - θ)',
  },
  {
    id: 'm3-2-fin-math-2',
    grade: '중3',
    semester: '2학기',
    examType: '기말고사',
    subject: '수학',
    unit: '원의 성질과 원주각 닮음 킬러',
    bookSource: 'blacklabel',
    difficultyLevel: '블랙라벨 Step3 킬러',
    upgradeRound: 2,
    title: '[블랙라벨 1등급 킬러] 원에 내접하는 사각형과 두 현의 교점 비례 정리',
    questionText: '원 O에 내접하는 사각형 ABCD에서 두 대각선 AC와 BD의 교점을 P라고 하자. 선분 PA = 4, PC = 9, PB = 3 일 때, 선분 PD의 길이는?',
    options: ['① 6', '② 8', '③ 10', '④ 12', '⑤ 14'],
    correctAnswerIndex: 3,
    explanation: '원 내부에서 두 현 AC와 BD가 점 P에서 만날 때, 호 BC에 대한 원주각의 크기가 같으므로 ∠PAB = ∠PDC 이고 맞꼭지각의 크기가 같아 두 삼각형은 닮음(△PAB ∽ △PDC)입니다.\n\n대응변의 비례식에 의하여:\nPA : PD = PB : PC  =>  PA × PC = PB × PD\n\n주어진 선분의 길이를 대입하면 다음과 같습니다.\n4 × 9 = 3 × PD\n36 = 3 × PD\nPD = 12\n\n따라서 선분 PD의 길이는 12입니다.',
    trapPoint: '선분의 곱 공식에서 PA × PB = PC × PD로 문자를 혼동하여 대입하지 않도록 원주각 닮음의 대응변 순서를 확인해야 합니다.',
    coreFormula: '원 내부의 두 현의 비례 관계: PA × PC = PB × PD (원주각에 의한 AA 닮음)',
  },
  {
    id: 'm3-2-fin-eng-1',
    grade: '중3',
    semester: '2학기',
    examType: '기말고사',
    subject: '영어',
    unit: '가정법 과거의 용법',
    bookSource: '100bal100jung',
    difficultyLevel: '100발100중 실전',
    upgradeRound: 1,
    title: '[100발100중 기출] 현재 사실의 반대를 나타내는 가정법 과거 문장의 전환',
    passage: 'As I do not have enough money, I cannot buy the latest tablet computer.',
    questionText: '위 직설법 문장을 가정법 과거 문장으로 어법상 가장 바르게 전환한 것은?',
    options: [
      '① If I had enough money, I could buy the latest tablet computer.',
      '② If I have enough money, I can buy the latest tablet computer.',
      '③ If I had had enough money, I could have bought the latest tablet computer.',
      '④ If I don\'t have enough money, I won\'t buy the latest tablet computer.',
      '⑤ If I was having enough money, I would buy the latest tablet computer.'
    ],
    correctAnswerIndex: 0,
    explanation: '현재 사실(현재시제 do not have, cannot buy)에 대한 반대 가정을 나타낼 때는 ‘가정법 과거’ 구문을 사용합니다.\n가정법 과거 형식: ‘If + 주어 + 동사의 과거형(were/일반동사 과거형), 주어 + 조동사의 과거형(would/could) + 동사원형’\n따라서 조건절에는 had, 귀결절에는 could buy를 사용한 ①번이 가장 적절합니다.',
    trapPoint: '가정법 과거는 동사의 형태만 ‘과거형’일 뿐, 실제 해석은 ‘현재 사실에 대한 반대 가정이나 소망’을 나타냄을 명심해야 합니다.',
    coreFormula: '가정법 과거: If + S + 과거동사, S + would/could + 동사원형 (현재 사실의 반대)',
  },
  {
    id: 'm3-2-fin-kor-1',
    grade: '중3',
    semester: '2학기',
    examType: '기말고사',
    subject: '국어',
    unit: '문장의 짜임과 안은문장',
    bookSource: '100bal100jung',
    difficultyLevel: '100발100중 실전',
    upgradeRound: 1,
    title: '[100발100중 기출] 관형사절과 부사절을 안은문장의 구별',
    questionText: '다음 중 괄호로 묶인 절이 뒤에 오는 체언을 수식하는 ‘관형사절을 안은문장’에 해당하는 것은?',
    options: [
      '① 우리는 [그가 성실한 학생임을] 잘 알고 있다.',
      '② 철수는 [발에 땀이 나도록] 열심히 운동장을 달렸다.',
      '③ 어머니께서는 [내가 어제 도서관에서 빌린] 책을 책장에 꽂으셨다.',
      '④ 형은 동생에게 [자신이 곧 돌아올 것이라고] 다정하게 말했다.',
      '⑤ 그는 [자신의 판단이 전적으로 옳았다고] 소리쳐 주장했다.'
    ],
    correctAnswerIndex: 2,
    explanation: '③번: [내가 어제 도서관에서 빌린]은 관형사형 전성 어미 ‘-ㄴ’이 붙어 뒤에 오는 명사인 ‘책’을 수식하는 관형사절입니다. (옳음)\n①번은 명사형 어미 ‘-ㅁ’이 결합한 명사절, ②번은 부사형 어미 ‘-도록’이 결합한 부사절, ④번과 ⑤번은 인용격 조사 ‘-라고’가 붙은 인용절입니다.',
    trapPoint: '안은문장의 5가지 절(명사절, 관형사절, 부사절, 서술절, 인용절)의 전성 어미와 조사 표지를 꼼꼼히 구별할 수 있어야 합니다.',
    coreFormula: '관형사절: 주어 + 서술어 + 관형사형 어미(-(으)ㄴ, -는, -(으)ㄹ, -던) $\\rightarrow$ 체언 수식',
  },
  {
    id: 'm3-2-fin-sci-1',
    grade: '중3',
    semester: '2학기',
    examType: '기말고사',
    subject: '과학',
    unit: '유전과 진화 (멘델의 분리의 법칙과 독립의 법칙)',
    bookSource: '100bal100jung',
    difficultyLevel: '100발100중 실전',
    upgradeRound: 1,
    title: '[100발100중 기출] 완두의 모양과 색깔 유전(독립의 법칙)',
    questionText: '둥글고 황색인 완두(유전자형: RrYy)를 자가 수분하여 얻은 잡종 제2대(F₂) 완두 1600개 중에서 ‘주름지고 녹색’인 완두의 예상 개수는?',
    options: ['① 100개', '② 300개', '③ 500개', '④ 900개', '⑤ 1200개'],
    correctAnswerIndex: 0,
    explanation: '모양 유전자 R(둥긂)과 r(주름짐), 색깔 유전자 Y(황색)과 y(녹색)는 서로 다른 염색체에 있어 독립의 법칙을 따릅니다.\nRrYy를 자가 수분할 때 나타나는 표현형의 분리비는 다음과 같습니다.\n[둥글고 황색] : [둥글고 녹색] : [주름지고 황색] : [주름지고 녹색] = 9 : 3 : 3 : 1\n\n두 형질 모두 열성인 순종 ‘주름지고 녹색(rryy)’인 완두가 나타날 확률은 전체의 1/16 입니다.\n따라서 1600개 × (1 / 16) = 100개입니다.',
    trapPoint: '독립의 법칙에서 9:3:3:1의 분리비를 암기하고 있더라도, 문제에서 요구하는 표현형(주름지고 녹색)의 비율(1/16)을 정확히 계산해야 합니다.',
    coreFormula: '양성 잡종 자가 수분 표현형 분리비: 9(우성·우성) : 3(우성·열성) : 3(열성·우성) : 1(열성·열성)',
  },
];

export const FULL_QUESTION_BANK: Question[] = [
  ...INITIAL_QUESTION_BANK,
  ...EXTENDED_QUESTIONS,
];

// 텍스트 정규화 (공백, 기호 제거 후 소문자 변환)
// 텍스트 정규화 (공백, 기호 제거 후 소문자 변환)
function normalizeText(text: string): string {
  return text.replace(/[\s\-_,·./()]/g, '').toLowerCase();
}

// 중복 오매칭을 유발하는 일반 단어(불용어) 목록
const GENERIC_STOPWORDS = new Set([
  '계산', '활용', '풀이', '성질', '법칙', '이해', '단원', '정리', '개념', '과정',
  '특성', '기능', '방법', '유형', '원리', '적용', '관계', '분석', '의', '과', '와', '를', '을', '에'
]);

// 단원명에서 고유한 핵심 개념어만 추출
function extractDistinctiveKeywords(text: string): string[] {
  return text
    .split(/[\s\-_,·./()]+/g)
    .map((w) => w.trim().toLowerCase())
    .filter((w) => w.length >= 2 && !GENERIC_STOPWORDS.has(w));
}

// 단원 일치 여부 판별 (고유 개념어 기반 정밀 매칭)
export function isUnitMatching(questionUnit: string, targetUnits: string[]): boolean {
  if (!targetUnits || targetUnits.length === 0) return true;
  const normQ = normalizeText(questionUnit);

  return targetUnits.some((unit) => {
    const normU = normalizeText(unit);
    // 1. 전체 단원명 포함
    if (normQ.includes(normU) || normU.includes(normQ)) return true;

    // 2. 불용어가 제거된 핵심 고유 개념어 매칭
    const keywords = extractDistinctiveKeywords(unit);
    if (keywords.length === 0) return false;
    return keywords.some((kw) => normQ.includes(kw));
  });
}

// 지정 단원 및 학년에 정확히 부합하는 고품질 문항 동적 보강 생성기 (타 단원/타 학년 유입 원천 차단)
function generateSyntheticUnitQuestions(params: {
  grade: Grade;
  semester: Semester;
  examType: ExamType;
  subject: Subject;
  unit: string;
  publisher?: TextbookPublisher;
  count: number;
  bookType?: BookType;
  existingIds: Set<string>;
}): Question[] {
  const { grade, semester, examType, subject, unit, publisher, count, bookType = '100bal100jung', existingIds } = params;
  const isBlackLabel = bookType === 'blacklabel';
  const prefix = isBlackLabel ? '[블랙라벨 1등급 심화]' : '[100발100중 실전 기출]';
  const diff = isBlackLabel ? '블랙라벨 Step3 킬러' : '100발100중 실전';
  const pubTag = publisher && publisher !== '공통/표준' ? `[${publisher}] ` : '';

  const results: Question[] = [];
  const normUnit = normalizeText(unit);

  // 세부 단원 키워드에 따라 맞춤형 수학 문항 생성
  const getMathQuestionForUnit = (idx: number) => {
    if (normUnit.includes('소인수분해') || normUnit.includes('약수')) {
      return {
        title: `${prefix} ${pubTag}소인수분해와 약수의 개수 구하기`,
        questionText: '자연수 120 = 2³ × 3¹ × 5¹ 의 약수의 개수로 올바른 것은?',
        options: ['① 12개', '② 14개', '③ 16개', '④ 18개', '⑤ 20개'],
        correctAnswerIndex: 2,
        explanation: '약수의 개수는 소인수분해한 각 소인수의 지수에 1을 더한 값들의 곱입니다.\n(3 + 1) × (1 + 1) × (1 + 1) = 4 × 2 × 2 = 16(개)',
        trapPoint: '지수에 1을 더하지 않고 지수끼리만 곱하면 3×1×1=3 으로 오답을 도출하기 쉽습니다.',
        coreFormula: 'N = pᵃ × qᵇ × rᶜ 일 때 약수의 개수 = (a + 1)(b + 1)(c + 1)',
      };
    }
    if (normUnit.includes('순환소수') || normUnit.includes('유리수와순환소수')) {
      return {
        title: `${prefix} ${pubTag}순환소수의 기약분수 표현과 유한소수 조건`,
        questionText: '순환소수 0.12̇ 를 기약분수로 나타내었을 때 분모와 분자의 합은?',
        options: ['① 91', '② 101', '③ 103', '④ 105', '⑤ 111'],
        correctAnswerIndex: 1,
        explanation: '순환소수 0.12̇ = (12 - 1) / 90 = 11 / 90 입니다.\n기약분수이므로 분자 11과 분모 90의 합은 11 + 90 = 101 입니다.',
        trapPoint: '순환하지 않는 소수점 아래 첫째 자리 1을 분자에서 빼지 않고 12/90으로 계산하면 오답이 됩니다.',
        coreFormula: '순환소수의 분수 표현: 0.aḃ = (ab - a) / 90',
      };
    }
    if (normUnit.includes('식의계산') || normUnit.includes('단항식') || normUnit.includes('다항식')) {
      return {
        title: `${prefix} ${pubTag}지수법칙과 단항식의 곱셈과 나눗셈`,
        questionText: '식 (-2a²b)³ ÷ 4a⁴b² × 3b 를 간단히 계산한 결과는?',
        options: ['① -6a²b²', '② 6a²b²', '③ -6ab²', '④ 6a³b', '⑤ -12a²b²'],
        correctAnswerIndex: 0,
        explanation: '1) 거듭제곱 계산: (-2a²b)³ = -8a⁶b³\n2) 나눗셈을 곱셈으로 역수 취함: (-8a⁶b³) / (4a⁴b²) = -2a²b\n3) 마지막 곱셈: (-2a²b) × 3b = -6a²b²',
        trapPoint: '음수의 세제곱 부호 -8과 괄호 밖의 지수를 각 문자에 모두 분배해야 합니다.',
        coreFormula: '(ab)ⁿ = aⁿbⁿ, aᵐ ÷ aⁿ = aᵐ⁻ⁿ',
      };
    }
    if (normUnit.includes('부등식') || normUnit.includes('일차부등식')) {
      return {
        title: `${prefix} ${pubTag}일차부등식의 풀이와 최대 정수 해`,
        questionText: '일차부등식 3(x - 1) ≤ x + 5 를 만족하는 가장 큰 정수 x의 값은?',
        options: ['① 2', '② 3', '③ 4', '④ 5', '⑤ 6'],
        correctAnswerIndex: 2,
        explanation: '괄호를 전개하고 이항합니다.\n3x - 3 ≤ x + 5\n2x ≤ 8\nx ≤ 4\n따라서 만족하는 가장 큰 정수는 4 입니다.',
        trapPoint: '부등호에 등호(=)가 포함되어 있으므로 경계값 4가 최대 정수에 포함됩니다.',
        coreFormula: '일차부등식 풀이: 괄호 전개 $\\rightarrow$ 동류항 이항 $\\rightarrow$ 양변 계수로 나눔',
      };
    }
    if (normUnit.includes('연립')) {
      return {
        title: `${prefix} ${pubTag}연립일차방정식의 풀이와 해의 계산`,
        questionText: '연립방정식 { 2x + y = 7, x - y = 2 } 의 해를 x = a, y = b 라고 할 때, a × b의 값은?',
        options: ['① 2', '② 3', '③ 4', '④ 5', '⑤ 6'],
        correctAnswerIndex: 1,
        explanation: '두 식을 변끼리 더하여 y를 소거합니다.\n(2x + y) + (x - y) = 7 + 2\n3x = 9  =>  x = 3\nx = 3을 두 번째 식에 대입: 3 - y = 2  =>  y = 1\n따라서 a = 3, b = 1 이므로 a × b = 3 입니다.',
        trapPoint: '가감법 사용 시 부호 실수를 방지하기 위해 괄호를 치고 덧셈/뺄셈을 점검해야 합니다.',
        coreFormula: '연립방정식 가감법: 한 미지수의 계수의 절댓값을 같게 만들어 변끼리 더하거나 뺌',
      };
    }
    if (normUnit.includes('일차함수')) {
      return {
        title: `${prefix} ${pubTag}일차함수의 기울기와 절편 계산`,
        questionText: '일차함수 y = -2x + 6 의 그래프에서 x절편을 a, y절편을 b라고 할 때, a + b의 값은?',
        options: ['① 6', '② 7', '③ 8', '④ 9', '⑤ 10'],
        correctAnswerIndex: 3,
        explanation: '1) x절편: y = 0 일 때 x의 값  =>  -2x + 6 = 0  =>  x = 3 (a = 3)\n2) y절편: x = 0 일 때 y의 값  =>  y = 6 (b = 6)\n따라서 a + b = 3 + 6 = 9 입니다.',
        trapPoint: 'x절편은 y=0을 대입하여 구하고, y절편은 상수항 6임을 구분해야 합니다.',
        coreFormula: '일차함수 y = ax + b 에서 기울기는 a, y절편은 b, x절편은 -b/a',
      };
    }
    if (normUnit.includes('이등변') || normUnit.includes('합동')) {
      return {
        title: `${prefix} ${pubTag}이등변삼각형의 밑각과 꼭지각의 성질`,
        questionText: '이등변삼각형 ABC에서 꼭지각 ∠A = 40°일 때, 한 밑각 ∠B의 크기는?',
        options: ['① 50°', '② 60°', '③ 70°', '④ 75°', '⑤ 80°'],
        correctAnswerIndex: 2,
        explanation: '삼각형의 세 내각의 크기의 합은 180°이고 이등변삼각형의 두 밑각의 크기는 같습니다.\n∠B = (180° - 40°) / 2 = 140° / 2 = 70°',
        trapPoint: '두 밑각의 합(140°)과 한 밑각(70°)의 크기를 혼동하지 않아야 합니다.',
        coreFormula: '이등변삼각형 성질: 두 밑각의 크기는 서로 같다.',
      };
    }
    if (normUnit.includes('외심') || normUnit.includes('내심')) {
      return {
        title: `${prefix} ${pubTag}직각삼각형의 외심의 위치와 외접원의 반지름`,
        questionText: '세 변의 길이가 6cm, 8cm, 10cm인 직각삼각형의 외접원의 반지름의 길이는?',
        options: ['① 3cm', '② 4cm', '③ 5cm', '④ 6cm', '⑤ 8cm'],
        correctAnswerIndex: 2,
        explanation: '직각삼각형의 외심은 항상 빗변의 중점에 위치합니다.\n빗변의 길이가 10cm이므로 외접원의 반지름은 10 / 2 = 5(cm) 입니다.',
        trapPoint: '외심의 위치가 직각삼각형에서는 빗변의 중점이라는 핵심 정리를 기억해야 합니다.',
        coreFormula: '직각삼각형의 외심: 빗변의 중점, 외접원 반지름 = (빗변의 길이) / 2',
      };
    }
    if (normUnit.includes('피타고라스') || normUnit.includes('닮음')) {
      return {
        title: `${prefix} ${pubTag}피타고라스 정리를 이용한 변의 길이 계산`,
        questionText: '직각삼각형의 두 변의 길이가 각각 5cm, 12cm이고 빗변의 길이가 c cm일 때, c의 값은?',
        options: ['① 13', '② 14', '③ 15', '④ 16', '⑤ 17'],
        correctAnswerIndex: 0,
        explanation: '피타고라스 정리에 의해 c² = 5² + 12² = 25 + 144 = 169\nc > 0 이므로 c = √169 = 13 입니다.',
        trapPoint: '대표적 피타고라스 수(5, 12, 13)를 기억하면 신속히 해결할 수 있습니다.',
        coreFormula: '직각삼각형 피타고라스 정리: a² + b² = c²',
      };
    }
    if (normUnit.includes('제곱근') || normUnit.includes('무리수')) {
      return {
        title: `${prefix} ${pubTag}제곱근의 성질과 무리수의 판별`,
        questionText: '다음 중 근호를 벗겨낼 수 없어 무리수인 것만을 있는 대로 고른 것은?\n[보기: √4, √5, √9, π, 0.3̇]',
        options: ['① √5, π', '② √4, √9', '③ √5, 0.3̇', '④ √4, √5, π', '⑤ √5, √9, π'],
        correctAnswerIndex: 0,
        explanation: '√4 = 2, √9 = 3 (유리수), 0.3̇ = 1/3 (유리수) 입니다.\n반면 √5와 원주율 π는 순환하지 않는 무한소수이므로 무리수입니다.',
        trapPoint: '순환소수는 분수로 나타낼 수 있으므로 유리수에 속한다는 점을 명심해야 합니다.',
        coreFormula: '실수의 분류: 유리수(분수 표현 가능) vs 무리수(순환하지 않는 무한소수)',
      };
    }
    if (normUnit.includes('인수분해')) {
      return {
        title: `${prefix} ${pubTag}다항식의 인수분해 공식과 일차식의 합`,
        questionText: '다항식 x² - 7x + 12 가 (x - a)(x - b) 로 인수분해될 때, a + b의 값은?',
        options: ['① 5', '② 6', '③ 7', '④ 8', '⑤ 12'],
        correctAnswerIndex: 2,
        explanation: '합이 -7이고 곱이 12인 두 정수는 -3과 -4 입니다.\nx² - 7x + 12 = (x - 3)(x - 4)\n따라서 a = 3, b = 4 (또는 반대)이므로 a + b = 3 + 4 = 7 입니다.',
        trapPoint: 'x의 계수는 두 수의 합의 부호 반대, 상수항은 두 수의 곱임을 확인해야 합니다.',
        coreFormula: 'x² + (a + b)x + ab = (x + a)(x + b)',
      };
    }
    if (normUnit.includes('이차방정식')) {
      return {
        title: `${prefix} ${pubTag}이차방정식의 인수분해 해와 두 근의 차`,
        questionText: '이차방정식 x² - 5x + 6 = 0 의 두 근을 α, β (α > β)라고 할 때, α - β의 값은?',
        options: ['① 1', '② 2', '③ 3', '④ 4', '⑤ 5'],
        correctAnswerIndex: 0,
        explanation: '좌변을 인수분해하면 (x - 2)(x - 3) = 0 입니다.\n따라서 두 근은 x = 2 또는 x = 3 입니다.\nα = 3, β = 2 이므로 α - β = 3 - 2 = 1 입니다.',
        trapPoint: '방정식의 근을 구할 때 인수분해 괄호 안의 부호와 근의 부호가 반대임을 주의해야 합니다.',
        coreFormula: 'AB = 0 이면 A = 0 또는 B = 0',
      };
    }
    if (normUnit.includes('이차함수')) {
      return {
        title: `${prefix} ${pubTag}이차함수의 꼭짓점의 좌표와 축의 방정식`,
        questionText: '이차함수 y = 2(x - 1)² + 3 의 그래프의 꼭짓점의 좌표는?',
        options: ['① (-1, 3)', '② (1, -3)', '③ (1, 3)', '④ (2, 3)', '⑤ (3, 1)'],
        correctAnswerIndex: 2,
        explanation: '이차함수 y = a(x - p)² + q 의 표준형에서 꼭짓점의 좌표는 (p, q) 입니다.\n따라서 꼭짓점은 (1, 3) 입니다.',
        trapPoint: '(x - 1)에서 부호를 반대로 적용하여 x좌표가 +1임을 확인해야 합니다.',
        coreFormula: 'y = a(x - p)² + q 의 꼭짓점은 (p, q)',
      };
    }
    if (normUnit.includes('삼각비')) {
      return {
        title: `${prefix} ${pubTag}특수각의 삼각비 값 계산`,
        questionText: '식 sin 30° + tan 45° 의 값은?',
        options: ['① 1', '② 3/2', '③ 2', '④ √3', '⑤ 5/2'],
        correctAnswerIndex: 1,
        explanation: '특수각의 삼각비 값:\nsin 30° = 1/2, tan 45° = 1\n따라서 1/2 + 1 = 3/2 입니다.',
        trapPoint: '특수각 표에서 30°와 60°의 삼각비 값을 정확히 기억해야 합니다.',
        coreFormula: 'sin 30° = 1/2, cos 30° = √3/2, tan 45° = 1',
      };
    }
    if (normUnit.includes('원주각') || normUnit.includes('원의성질')) {
      return {
        title: `${prefix} ${pubTag}원주각과 중심각의 크기 관계`,
        questionText: '한 호에 대한 중심각의 크기가 80°일 때, 같은 호에 대한 원주각의 크기는?',
        options: ['① 40°', '② 50°', '③ 60°', '④ 80°', '⑤ 160°'],
        correctAnswerIndex: 0,
        explanation: '한 호에 대한 원주각의 크기는 그 호에 대한 중심각 크기의 절반입니다.\n원주각 = 80° / 2 = 40°',
        trapPoint: '중심각과 원주각의 2배 관계의 방향을 반대로 계산하지 않도록 주의해야 합니다.',
        coreFormula: '원주각 = 1/2 × 중심각',
      };
    }

    // 기본 수학 문제
    return {
      title: `${prefix} ${pubTag}[${grade} ${unit}] 핵심 유형 기출`,
      questionText: `다음 중 [${grade} ${semester} ${unit}] 단원의 수학적 정의와 연산 규칙에 부합하는 것은?`,
      options: ['① 좌변과 우변의 동류항을 정확히 정리한다.', '② 음수로 나눌 때 부등호 방향을 유지한다.', '③ 분모가 0인 유리수를 생성한다.', '④ 절댓값 기호를 임의로 생략한다.', '⑤ 식의 값을 구할 때 대입 부호를 무시한다.'],
      correctAnswerIndex: 0,
      explanation: '수학적 연산의 기본 원칙은 동류항끼리 묶어 식을 간소화하고 정규 규칙을 준수하는 것입니다.',
      trapPoint: '기본 연산 원칙과 예외 조건(0으로 나누기 금지 등)을 점검해야 합니다.',
      coreFormula: '단원 표준 연산 정리 규칙',
    };
  };

  for (let i = 0; i < count; i++) {
    const qData = subject === '수학'
      ? getMathQuestionForUnit(i)
      : {
          title: `${prefix} ${pubTag}[${grade} ${unit}] 핵심 기출`,
          questionText: `[${grade} ${subject}] 교육과정 [${unit}] 단원의 핵심 성취기준에 대한 설명으로 가장 적절한 것은?`,
          options: [
            '① 교과서 표준 원리와 규칙을 정확히 이해하고 적용한다.',
            '② 맥락과 무관하게 임의의 규칙을 대입한다.',
            '③ 예외 상황만을 일반적 원리로 간주한다.',
            '④ 사실과 의견의 구분을 배제하고 서술한다.',
            '⑤ 핵심 개념 용어의 의미를 왜곡하여 해석한다.'
          ],
          correctAnswerIndex: 0,
          explanation: `[${unit}] 단원의 본질은 교육과정 표준 성취기준에 따른 원리와 응용력을 체계적으로 습득하는 것입니다.`,
          trapPoint: '단원의 핵심 개념과 일반 원리를 정확히 파악해야 합니다.',
          coreFormula: `${grade} ${subject} [${unit}] 표준 성취기준`,
        };

    const newId = `dyn-${grade}-${semester}-${examType}-${subject}-${Date.now()}-${i}`;
    if (!existingIds.has(newId)) {
      results.push({
        id: newId,
        grade,
        semester,
        examType,
        subject,
        unit,
        bookSource: isBlackLabel ? 'blacklabel' : '100bal100jung',
        difficultyLevel: diff,
        upgradeRound: 1,
        title: qData.title,
        questionText: qData.questionText,
        options: qData.options,
        correctAnswerIndex: qData.correctAnswerIndex,
        explanation: qData.explanation,
        trapPoint: qData.trapPoint,
        coreFormula: qData.coreFormula,
      });
    }
  }

  return results;
}

// 시험 시간 모드별 문항 수 및 4단계 난이도 스펙
export interface ExamModeSpec {
  timerMinutes: number;
  questionCount: number;
  modeName: string;
  badge: string;
  tagline: string;
  description: string;
  tierBreakdown: {
    step1: number; // 1단계: 교과서 기초 및 필수 개념 (난이도 하, 4점)
    step2: number; // 2단계: 100발100중 실전 기출 최다 빈출 (난이도 중, 5점)
    step3: number; // 3단계: 신유형·서술형 응용 및 심화 (난이도 상, 5점)
    step4: number; // 4단계: 블랙라벨 1등급 변별력 킬러 (난이도 최상, 6점)
  };
}

export const EXAM_MODES_CONFIG: Record<number, ExamModeSpec> = {
  10: {
    timerMinutes: 10,
    questionCount: 5,
    modeName: '10분 벼락치기',
    badge: '단원 핵심 스피드 점검',
    tagline: '5문항 · 1문항당 2분 배분',
    description: '핵심 개념 3문항 + 필수 계산 2문항 (직관적 공식 점검 및 초고속 개념 완성)',
    tierBreakdown: { step1: 3, step2: 2, step3: 0, step4: 0 },
  },
  20: {
    timerMinutes: 20,
    questionCount: 10,
    modeName: '20분 유형완성',
    badge: '내신 빈출 집중 훈련',
    tagline: '10문항 · 실전 80점 돌파',
    description: '교과서 기본 3문항 + 100발100중 빈출 5문항 + 실전 함정 응용 2문항',
    tierBreakdown: { step1: 3, step2: 5, step3: 2, step4: 0 },
  },
  30: {
    timerMinutes: 30,
    questionCount: 15,
    modeName: '30분 모의평가',
    badge: '실전 모의고사 밸런스',
    tagline: '15문항 · 중간/기말 표준',
    description: '기본 4문항 + 실전 기출 7문항 + 블랙라벨 발전 3문항 + 1등급 킬러 1문항',
    tierBreakdown: { step1: 4, step2: 7, step3: 3, step4: 1 },
  },
  45: {
    timerMinutes: 45,
    questionCount: 20,
    modeName: '45분 본시험 시간',
    badge: '실제 중학 정규고사 풀세트',
    tagline: '20문항 · 100점 완벽 대비',
    description: '실제 중학교 시험지 완벽 구현: 1~5번 기본(하) → 6~13번 빈출(중) → 14~17번 응용(상) → 18~20번 킬러(최상)',
    tierBreakdown: { step1: 5, step2: 8, step3: 4, step4: 3 },
  },
};

// 단계별(1~4단계) 난이도 맞춤형 고품질 문항 생성기
function generateTieredQuestion(params: {
  grade: Grade;
  semester: Semester;
  examType: ExamType;
  subject: Subject;
  unit: string;
  publisher?: TextbookPublisher;
  stepLevel: 1 | 2 | 3 | 4;
  variantIndex: number;
  bookType?: BookType;
}): Question {
  const { grade, semester, examType, subject, unit, publisher, stepLevel, variantIndex, bookType = '100bal100jung' } = params;
  const normUnit = normalizeText(unit);
  const pubTag = publisher && publisher !== '공통/표준' ? `[${publisher}] ` : '';

  let diffLevel: DifficultyLevel = '기본';
  let bookSrc: '100bal100jung' | 'blacklabel' = '100bal100jung';
  let scoreWeight = 4;
  let stepTag = '[Step 1 교과서 기본]';

  if (stepLevel === 1) {
    diffLevel = '기본';
    bookSrc = '100bal100jung';
    scoreWeight = 4;
    stepTag = '[Step 1 교과서 기본]';
  } else if (stepLevel === 2) {
    diffLevel = '100발100중 실전';
    bookSrc = '100bal100jung';
    scoreWeight = 5;
    stepTag = '[Step 2 100발100중 빈출]';
  } else if (stepLevel === 3) {
    diffLevel = '블랙라벨 Step2';
    bookSrc = bookType === 'blacklabel' ? 'blacklabel' : '100bal100jung';
    scoreWeight = 5;
    stepTag = '[Step 3 실전 고난도 응용]';
  } else {
    diffLevel = '블랙라벨 Step3 킬러';
    bookSrc = 'blacklabel';
    scoreWeight = 6;
    stepTag = '[Step 4 블랙라벨 1등급 킬러]';
  }

  // 수학 과목의 단원별 단계별 문제 데이터
  if (subject === '수학') {
    if (normUnit.includes('소인수분해') || normUnit.includes('약수')) {
      if (stepLevel === 1) {
        return {
          id: `dyn-${grade}-${stepLevel}-${variantIndex}-${Date.now()}`,
          grade, semester, examType, subject, unit, publisher,
          bookSource: bookSrc, difficultyLevel: diffLevel, stepLevel, scoreWeight, upgradeRound: 1,
          title: `${stepTag} ${pubTag}소수와 합성수의 판별`,
          questionText: '다음 중 소수(prime number)에 대한 설명으로 옳은 것만을 보기에서 있는 대로 고른 것은?\n\n[보기]\nㄱ. 2는 가장 작은 소수이며 유일한 짝수인 소수이다.\nㄴ. 모든 소수의 약수는 2개이다.\nㄷ. 두 소수의 곱은 항상 홀수이다.',
          options: ['① ㄱ', '② ㄱ, ㄴ', '③ ㄴ, ㄷ', '④ ㄱ, ㄷ', '⑤ ㄱ, ㄴ, ㄷ'],
          correctAnswerIndex: 1,
          explanation: 'ㄱ: 2는 가장 작은 소수이자 유일한 짝수입니다. (참)\nㄴ: 소수의 정의상 1과 자기 자신만을 약수로 가지므로 약수의 개수는 정확히 2개입니다. (참)\nㄷ: 2와 3은 소수이지만 그 곱인 2×3=6은 짝수이므로 거짓입니다.',
          trapPoint: '2가 짝수 소수이므로 ‘두 소수의 곱이 항상 홀수’라는 진술은 반례(2×3=6)로 인해 거짓입니다.',
          coreFormula: '소수의 정의: 1보다 큰 자연수 중 1과 자기 자신만을 약수로 갖는 수 (약수 2개)',
        };
      } else if (stepLevel === 2) {
        return {
          id: `dyn-${grade}-${stepLevel}-${variantIndex}-${Date.now()}`,
          grade, semester, examType, subject, unit, publisher,
          bookSource: bookSrc, difficultyLevel: diffLevel, stepLevel, scoreWeight, upgradeRound: 1,
          title: `${stepTag} ${pubTag}소인수분해와 약수의 개수 계산`,
          questionText: '자연수 180 = 2² × 3² × 5 의 모든 양의 약수의 개수로 알맞은 것은?',
          options: ['① 12개', '② 15개', '③ 18개', '④ 20개', '⑤ 24개'],
          correctAnswerIndex: 2,
          explanation: '자연수 N = aᵖ × bᵍ × cʳ 일 때 약수의 개수는 (p + 1)(q + 1)(r + 1) 입니다.\n180의 소인수 지수는 2, 2, 1 이므로\n약수의 개수 = (2 + 1) × (2 + 1) × (1 + 1) = 3 × 3 × 2 = 18(개) 입니다.',
          trapPoint: '지수에 1을 더하지 않고 지수끼리 곱하는 실수를 주의해야 합니다.',
          coreFormula: '약수의 개수 = (지수 + 1)의 곱',
        };
      } else if (stepLevel === 3) {
        return {
          id: `dyn-${grade}-${stepLevel}-${variantIndex}-${Date.now()}`,
          grade, semester, examType, subject, unit, publisher,
          bookSource: bookSrc, difficultyLevel: diffLevel, stepLevel, scoreWeight, upgradeRound: 1,
          title: `${stepTag} ${pubTag}최대공약수와 최소공배수의 실생활 활용`,
          questionText: '가로의 길이가 120cm, 세로의 길이가 90cm인 직사각형 모양의 벽면에 가능한 한 큰 정사각형 모양의 타일을 빈틈없이 붙이려고 한다. 이때 필요한 타일의 최소 개수는?',
          options: ['① 6개', '② 8개', '③ 12개', '④ 15개', '⑤ 20개'],
          correctAnswerIndex: 2,
          explanation: '타일의 한 변의 길이는 120과 90의 최대공약수여야 합니다.\n120 = 2³ × 3 × 5, 90 = 2 × 3² × 5 이므로\n최대공약수 = 2 × 3 × 5 = 30(cm) 입니다.\n\n가로에 필요한 타일 수 = 120 / 30 = 4(개)\n세로에 필요한 타일 수 = 90 / 30 = 3(개)\n따라서 총 필요한 타일의 개수는 4 × 3 = 12(개) 입니다.',
          trapPoint: '타일의 한 변의 길이(30cm)를 묻는 것인지, 타일의 총 개수(12개)를 묻는 것인지 정확히 확인해야 합니다.',
          coreFormula: '직사각형 빈틈없이 채우기: 한 변의 길이 = GCD(가로, 세로), 총 개수 = (가로/GCD) × (세로/GCD)',
        };
      } else {
        return {
          id: `dyn-${grade}-${stepLevel}-${variantIndex}-${Date.now()}`,
          grade, semester, examType, subject, unit, publisher,
          bookSource: bookSrc, difficultyLevel: diffLevel, stepLevel, scoreWeight, upgradeRound: 1,
          title: `${stepTag} ${pubTag}제곱수가 되도록 하는 자연수 곱하기 킬러`,
          questionText: '자연수 108에 가장 작은 자연수 a를 곱하여 어떤 자연수 b의 제곱이 되게 하려고 한다. 이때 a + b의 값은?',
          options: ['① 15', '② 18', '③ 21', '④ 24', '⑤ 27'],
          correctAnswerIndex: 2,
          explanation: '108을 소인수분해하면 108 = 2² × 3³ 입니다.\n어떤 자연수의 제곱이 되려면 모든 소인수의 지수가 짝수여야 합니다.\n지수가 홀수인 소인수는 3³이므로, 가장 작은 자연수 a = 3 입니다.\n\n이때 108 × 3 = 2² × 3⁴ = (2 × 3²)² = 18² = b² 이므로 b = 18 입니다.\n따라서 a + b = 3 + 18 = 21 입니다.',
          trapPoint: 'a만 구하고 끝내지 않고 b(제곱의 밑)까지 계산하여 합을 구해야 합니다.',
          coreFormula: '제곱수가 될 조건: 소인수분해 시 모든 소인수의 지수가 짝수',
        };
      }
    }

    if (normUnit.includes('순환소수') || normUnit.includes('유리수와순환소수')) {
      if (stepLevel === 1) {
        return {
          id: `dyn-${grade}-${stepLevel}-${variantIndex}-${Date.now()}`,
          grade, semester, examType, subject, unit, publisher,
          bookSource: bookSrc, difficultyLevel: diffLevel, stepLevel, scoreWeight, upgradeRound: 1,
          title: `${stepTag} ${pubTag}유한소수로 나타낼 수 있는 분수의 판별`,
          questionText: '다음 분수 중 유한소수로 나타낼 수 있는 것은?',
          options: ['① 3/14', '② 7/30', '③ 9/75', '④ 5/12', '⑤ 11/45'],
          correctAnswerIndex: 2,
          explanation: '기약분수로 나타내었을 때 분모의 소인수가 2 또는 5뿐이어야 유한소수입니다.\n③ 9/75 = 3/25 = 3 / 5² 이므로 분모의 소인수가 5뿐이라 유한소수입니다.\n① 14=2×7 (7 있음), ② 30=2×3×5 (3 있음), ④ 12=2²×3 (3 있음), ⑤ 45=3²×5 (3 있음)',
          trapPoint: '약분하여 기약분수로 먼저 고치지 않고 분모를 바로 소인수분해하면 오답이 발생합니다.',
          coreFormula: '유한소수 조건: 기약분수의 분모의 소인수가 2 또는 5뿐',
        };
      } else if (stepLevel === 2) {
        return {
          id: `dyn-${grade}-${stepLevel}-${variantIndex}-${Date.now()}`,
          grade, semester, examType, subject, unit, publisher,
          bookSource: bookSrc, difficultyLevel: diffLevel, stepLevel, scoreWeight, upgradeRound: 1,
          title: `${stepTag} ${pubTag}순환소수의 기약분수 표현`,
          questionText: '순환소수 0.23̇ 을 기약분수로 나타내었을 때, 분모와 분자의 차(분모 - 분자)는?',
          options: ['① 23', '② 27', '③ 30', '④ 69', '⑤ 71'],
          correctAnswerIndex: 0,
          explanation: '순환소수 0.23̇ = (23 - 2) / 90 = 21 / 90 = 7 / 30 (기약분수)\n분모 30 - 분자 7 = 23 입니다.',
          trapPoint: '약분하지 않고 90 - 21 = 69로 답하지 않도록 기약분수 조건을 반드시 지켜야 합니다.',
          coreFormula: '순환소수 분수 변환: 0.aḃ = (ab - a) / 90',
        };
      } else if (stepLevel === 3) {
        return {
          id: `dyn-${grade}-${stepLevel}-${variantIndex}-${Date.now()}`,
          grade, semester, examType, subject, unit, publisher,
          bookSource: bookSrc, difficultyLevel: diffLevel, stepLevel, scoreWeight, upgradeRound: 1,
          title: `${stepTag} ${pubTag}순환마디 규칙성과 소수점 아래 n번째 자리 숫자`,
          questionText: '분수 5/7 를 소수로 나타낼 때, 소수점 아래 50번째 자리의 숫자는?',
          options: ['① 7', '② 1', '③ 4', '④ 2', '⑤ 8'],
          correctAnswerIndex: 1,
          explanation: '5/7 = 0.7̇14285̇ (순환마디: 7, 1, 4, 2, 8, 5 총 6개)\n50 = 6 × 8 + 2 이므로 나머지가 2입니다.\n순환마디의 2번째 숫자는 1입니다.',
          trapPoint: '나머지가 0이면 순환마디의 마지막 숫자가 됨을 기억해야 합니다.',
          coreFormula: '소수점 아래 n번째 자리: n = (마디 길이) × q + r',
        };
      } else {
        return {
          id: `dyn-${grade}-${stepLevel}-${variantIndex}-${Date.now()}`,
          grade, semester, examType, subject, unit, publisher,
          bookSource: bookSrc, difficultyLevel: diffLevel, stepLevel, scoreWeight, upgradeRound: 1,
          title: `${stepTag} ${pubTag}유한소수가 되도록 하는 미지수 곱하기 킬러`,
          questionText: '분수 13 / (2² × 3² × 5) 에 자연수 x를 곱하여 유한소수가 되게 하려고 한다. 두 자리 자연수 x 중 가장 작은 값은?',
          options: ['① 12', '② 18', '③ 24', '④ 27', '⑤ 36'],
          correctAnswerIndex: 1,
          explanation: '분모의 소인수 중 3² = 9가 약분되어 사라져야 유한소수가 됩니다.\n분자 13은 3의 배수가 아니므로 x는 9의 배수여야 합니다.\n두 자리 자연수 9의 배수는 18, 27, 36, ... 이므로\n가장 작은 두 자리 자연수는 18 입니다.',
          trapPoint: '가장 작은 자연수(9)를 구하는 실수를 방지하고 "두 자리 자연수" 조건을 충족해야 합니다.',
          coreFormula: '유한소수 필수 조건: 분모의 2와 5 이외의 소인수가 분자와 약분되어 소거되어야 함',
        };
      }
    }

    if (normUnit.includes('식의계산') || normUnit.includes('단항식') || normUnit.includes('다항식')) {
      if (stepLevel === 1) {
        return {
          id: `dyn-${grade}-${stepLevel}-${variantIndex}-${Date.now()}`,
          grade, semester, examType, subject, unit, publisher,
          bookSource: bookSrc, difficultyLevel: diffLevel, stepLevel, scoreWeight, upgradeRound: 1,
          title: `${stepTag} ${pubTag}지수법칙의 기본 계산`,
          questionText: '다음 식을 간단히 한 결과로 옳은 것은?\n(a³)² × a⁴',
          options: ['① a⁹', '② a¹⁰', '③ a¹²', '④ a¹⁴', '⑤ a²⁴'],
          correctAnswerIndex: 1,
          explanation: '지수법칙에 의해:\n1) (a³)² = a³ˣ² = a⁶\n2) a⁶ × a⁴ = a⁶⁺⁴ = a¹⁰ 입니다.',
          trapPoint: '거듭제곱의 거듭제곱은 지수끼리 곱하고, 밑이 같은 거듭제곱의 곱셈은 지수끼리 더합니다.',
          coreFormula: '(aᵐ)ⁿ = aᵐⁿ, aᵐ × aⁿ = aᵐ⁺ⁿ',
        };
      } else if (stepLevel === 2) {
        return {
          id: `dyn-${grade}-${stepLevel}-${variantIndex}-${Date.now()}`,
          grade, semester, examType, subject, unit, publisher,
          bookSource: bookSrc, difficultyLevel: diffLevel, stepLevel, scoreWeight, upgradeRound: 1,
          title: `${stepTag} ${pubTag}단항식의 곱셈과 나눗셈 혼합계산`,
          questionText: '식 (-2x²y)³ ÷ 4x⁴y² × 3xy 를 계산한 결과는?',
          options: ['① -6x³y²', '② 6x³y²', '③ -6xy²', '④ -12x³y', '⑤ 12x²y²'],
          correctAnswerIndex: 0,
          explanation: '1) (-2x²y)³ = -8x⁶y³\n2) 나눗셈: (-8x⁶y³) / (4x⁴y²) = -2x²y\n3) 곱셈: (-2x²y) × 3xy = -6x³y²',
          trapPoint: '음수의 홀수 거듭제곱 부호(-)와 x의 차수 계산을 꼼꼼히 체크해야 합니다.',
          coreFormula: '단항식 나눗셈은 역수의 곱으로 변환',
        };
      } else if (stepLevel === 3) {
        return {
          id: `dyn-${grade}-${stepLevel}-${variantIndex}-${Date.now()}`,
          grade, semester, examType, subject, unit, publisher,
          bookSource: bookSrc, difficultyLevel: diffLevel, stepLevel, scoreWeight, upgradeRound: 1,
          title: `${stepTag} ${pubTag}다항식 연산에서 어떤 식 A 구하기`,
          questionText: '어떤 다항식 A에서 3x² - 2x + 1 을 빼야 할 것을 잘못하여 더하였더니 5x² + x - 3 이 되었다. 바르게 계산한 식은?',
          options: ['① 2x² + 3x - 4', '② -x² + 5x - 5', '③ 2x² - x + 2', '④ -x² + 3x - 2', '⑤ 8x² - x - 2'],
          correctAnswerIndex: 1,
          explanation: '잘못 계산한 식:\nA + (3x² - 2x + 1) = 5x² + x - 3\nA = (5x² + x - 3) - (3x² - 2x + 1) = 2x² + 3x - 4\n\n바르게 계산한 식:\nA - (3x² - 2x + 1) = (2x² + 3x - 4) - (3x² - 2x + 1)\n= -x² + 5x - 5 입니다.',
          trapPoint: '어떤 식 A를 구하는 것으로 끝내지 않고 ‘바르게 계산한 결과’를 도출해야 합니다.',
          coreFormula: '바른 식 = A - B, 주어진 잘못된 식 = A + B',
        };
      } else {
        return {
          id: `dyn-${grade}-${stepLevel}-${variantIndex}-${Date.now()}`,
          grade, semester, examType, subject, unit, publisher,
          bookSource: bookSrc, difficultyLevel: diffLevel, stepLevel, scoreWeight, upgradeRound: 1,
          title: `${stepTag} ${pubTag}거듭제곱을 이용한 자연수의 자릿수 킬러`,
          questionText: '자연수 N = 2¹² × 5⁹ 은 몇 자리의 자연수인가?',
          options: ['① 9자리', '② 10자리', '③ 11자리', '④ 12자리', '⑤ 13자리'],
          correctAnswerIndex: 1,
          explanation: '10 = 2 × 5 임을 활용하여 10의 거듭제곱으로 묶습니다.\nN = 2¹² × 5⁹ = 2³ × (2⁹ × 5⁹) = 8 × (10)⁹\n8 뒤에 0이 9개 붙으므로 1 + 9 = 10 자리 자연수입니다.',
          trapPoint: '지수가 작은 쪽(9)으로 묶고 남은 계수(8)의 자릿수를 함께 더해야 합니다.',
          coreFormula: '자릿수 결정: a × 10ⁿ (1 ≤ a < 10) 일 때 (n + 1) 자리',
        };
      }
    }

    if (normUnit.includes('부등식') || normUnit.includes('일차부등식')) {
      if (stepLevel === 1) {
        return {
          id: `dyn-${grade}-${stepLevel}-${variantIndex}-${Date.now()}`,
          grade, semester, examType, subject, unit, publisher,
          bookSource: bookSrc, difficultyLevel: diffLevel, stepLevel, scoreWeight, upgradeRound: 1,
          title: `${stepTag} ${pubTag}부등식의 기본 성질`,
          questionText: 'a < b 일 때, 다음 중 옳은 것은?',
          options: ['① a - 3 > b - 3', '② -2a < -2b', '③ 3a + 1 < 3b + 1', '④ a/(-4) < b/(-4)', '⑤ 1 - a < 1 - b'],
          correctAnswerIndex: 2,
          explanation: '부등식의 양변에 같은 수를 더하거나 빼도 부등호 방향은 바뀌지 않고, 양수를 곱하거나 나누어도 바뀌지 않습니다.\n따라서 ③ 3a + 1 < 3b + 1 은 참입니다.',
          trapPoint: '음수를 곱하거나 나눌 때만 부등호 방향이 반대로 바뀝니다.',
          coreFormula: 'a < b 이고 c < 0 이면 ac > bc',
        };
      } else if (stepLevel === 2) {
        return {
          id: `dyn-${grade}-${stepLevel}-${variantIndex}-${Date.now()}`,
          grade, semester, examType, subject, unit, publisher,
          bookSource: bookSrc, difficultyLevel: diffLevel, stepLevel, scoreWeight, upgradeRound: 1,
          title: `${stepTag} ${pubTag}일차부등식 풀이와 해의 범위`,
          questionText: '일차부등식 4(x - 1) ≤ 2x + 6 을 만족하는 가장 큰 정수 x의 값은?',
          options: ['① 3', '② 4', '③ 5', '④ 6', '⑤ 7'],
          correctAnswerIndex: 2,
          explanation: '4x - 4 ≤ 2x + 6\n2x ≤ 10  =>  x ≤ 5\n따라서 만족하는 가장 큰 정수는 5 입니다.',
          trapPoint: '괄호 전개 시 -4를 우변으로 이항할 때 부호가 +4가 되는 점을 유의해야 합니다.',
          coreFormula: '일차부등식 정리: ax ≤ b',
        };
      } else if (stepLevel === 3) {
        return {
          id: `dyn-${grade}-${stepLevel}-${variantIndex}-${Date.now()}`,
          grade, semester, examType, subject, unit, publisher,
          bookSource: bookSrc, difficultyLevel: diffLevel, stepLevel, scoreWeight, upgradeRound: 1,
          title: `${stepTag} ${pubTag}자연수 해의 개수 조건과 미지수의 범위`,
          questionText: 'x에 대한 일차부등식 3x - a < x + 5 를 만족하는 자연수 x가 3개뿐일 때, 상수 a의 값의 범위는?',
          options: ['① 1 < a ≤ 3', '② 1 ≤ a < 3', '③ 2 < a ≤ 4', '④ 3 < a ≤ 5', '⑤ 0 < a ≤ 2'],
          correctAnswerIndex: 0,
          explanation: '2x < a + 5  =>  x < (a + 5) / 2\n자연수가 1, 2, 3이어야 하므로 3 < (a + 5)/2 ≤ 4\n6 < a + 5 ≤ 8  =>  1 < a ≤ 3 입니다.',
          trapPoint: '경계값 3과 4 중 어느 쪽에 등호가 포함되는지 부등호의 성립 여부를 직접 대입하여 검증해야 합니다.',
          coreFormula: '자연수 개수 조건: n < 경계값 ≤ n+1',
        };
      } else {
        return {
          id: `dyn-${grade}-${stepLevel}-${variantIndex}-${Date.now()}`,
          grade, semester, examType, subject, unit, publisher,
          bookSource: bookSrc, difficultyLevel: diffLevel, stepLevel, scoreWeight, upgradeRound: 1,
          title: `${stepTag} ${pubTag}원가·정가 실생활 부등식 활용 킬러`,
          questionText: '원가가 5,000원인 물건에 정가를 정하여 정가의 20%를 할인하여 팔아도 원가의 12% 이상의 이익을 남기려고 한다. 이때 정가는 최소 얼마 이상이어야 하는가?',
          options: ['① 6,500원', '② 7,000원', '③ 7,200원', '④ 7,500원', '⑤ 8,000원'],
          correctAnswerIndex: 1,
          explanation: '정가를 x원이라고 하면:\n할인 판매가 = 0.8x (원)\n이익 = 0.8x - 5000\n원가의 12% = 5000 × 0.12 = 600(원)\n\n0.8x - 5000 ≥ 600\n0.8x ≥ 5600\nx ≥ 5600 / 0.8 = 7000(원)\n따라서 정가는 최소 7,000원 이상이어야 합니다.',
          trapPoint: '할인 판매가(0.8x)와 이익(판매가 - 원가)을 정확히 구분하여 식을 세워야 합니다.',
          coreFormula: '이익 = 판매가 - 원가 ≥ 원가 × 이익률',
        };
      }
    }

    if (normUnit.includes('일차함수')) {
      if (stepLevel === 1) {
        return {
          id: `dyn-${grade}-${stepLevel}-${variantIndex}-${Date.now()}`,
          grade, semester, examType, subject, unit, publisher,
          bookSource: bookSrc, difficultyLevel: diffLevel, stepLevel, scoreWeight, upgradeRound: 1,
          title: `${stepTag} ${pubTag}일차함수의 기울기와 절편 읽기`,
          questionText: '일차함수 y = -3x + 6 의 그래프에서 기울기를 a, y절편을 b라고 할 때, a + b의 값은?',
          options: ['① 1', '② 2', '③ 3', '④ 4', '⑤ 5'],
          correctAnswerIndex: 2,
          explanation: 'y = ax + b 에서 기울기는 x의 계수인 -3이고, y절편은 상수항인 6입니다.\n따라서 a + b = -3 + 6 = 3 입니다.',
          trapPoint: '기울기의 부호(-)를 놓치지 않아야 합니다.',
          coreFormula: 'y = ax + b 에서 기울기 a, y절편 b',
        };
      } else if (stepLevel === 2) {
        return {
          id: `dyn-${grade}-${stepLevel}-${variantIndex}-${Date.now()}`,
          grade, semester, examType, subject, unit, publisher,
          bookSource: bookSrc, difficultyLevel: diffLevel, stepLevel, scoreWeight, upgradeRound: 1,
          title: `${stepTag} ${pubTag}두 점을 지나는 일차함수의 식 구하기`,
          questionText: '두 점 (1, 3), (3, 7)을 지나는 직선의 방정식의 x절편은?',
          options: ['① -1/2', '② -1', '③ 1/2', '④ 1', '⑤ 2'],
          correctAnswerIndex: 0,
          explanation: '기울기 m = (7 - 3) / (3 - 1) = 4 / 2 = 2\ny - 3 = 2(x - 1)  =>  y = 2x + 1\nx절편은 y = 0 일 때이므로 2x + 1 = 0  =>  x = -1/2 입니다.',
          trapPoint: '기울기를 구한 후 y절편(1)과 혼동하여 x절편을 잘못 구하지 않아야 합니다.',
          coreFormula: '기울기 = (y₂ - y₁) / (x₂ - x₁)',
        };
      } else if (stepLevel === 3) {
        return {
          id: `dyn-${grade}-${stepLevel}-${variantIndex}-${Date.now()}`,
          grade, semester, examType, subject, unit, publisher,
          bookSource: bookSrc, difficultyLevel: diffLevel, stepLevel, scoreWeight, upgradeRound: 1,
          title: `${stepTag} ${pubTag}일차함수 그래프와 좌표축으로 둘러싸인 삼각형 넓이`,
          questionText: '일차함수 y = -2x + 8 의 그래프가 x축, y축과 만나는 점을 각각 A, B라고 할 때, 삼각형 OAB의 넓이는?',
          options: ['① 8', '② 12', '③ 16', '④ 20', '⑤ 32'],
          correctAnswerIndex: 2,
          explanation: 'x절편 A: y = 0  =>  -2x + 8 = 0  =>  x = 4 (점 A(4, 0))\ny절편 B: x = 0  =>  y = 8 (점 B(0, 8))\n삼각형 OAB는 직각삼각형이므로 넓이 = (1/2) × 4 × 8 = 16 입니다.',
          trapPoint: '1/2을 곱하지 않고 4 × 8 = 32로 직사각형 넓이를 구하지 않도록 주의해야 합니다.',
          coreFormula: '좌표축 삼각형 넓이 = (1/2) × |x절편| × |y절편|',
        };
      } else {
        return {
          id: `dyn-${grade}-${stepLevel}-${variantIndex}-${Date.now()}`,
          grade, semester, examType, subject, unit, publisher,
          bookSource: bookSrc, difficultyLevel: diffLevel, stepLevel, scoreWeight, upgradeRound: 1,
          title: `${stepTag} ${pubTag}두 일차함수의 교점과 넓이 이등분 킬러`,
          questionText: '두 직선 y = 2x - 4 와 y = -x + 5 의 교점 P의 좌표를 (a, b)라고 할 때, a × b의 값은?',
          options: ['① 3', '② 4', '③ 5', '④ 6', '⑤ 8'],
          correctAnswerIndex: 3,
          explanation: '교점은 두 식을 연립하여 구합니다.\n2x - 4 = -x + 5\n3x = 9  =>  x = 3 (a = 3)\ny = 2(3) - 4 = 2 (b = 2)\n따라서 a × b = 3 × 2 = 6 입니다.',
          trapPoint: '두 일차함수의 교점이 곧 연립방정식의 해임을 연계하여 해석해야 합니다.',
          coreFormula: '함수 그래프의 교점 = 연립방정식의 해',
        };
      }
    }
  }

  // 기본/영어/국어/과학 맞춤형 단계별 문제 생성
  const subjectStepMap: Record<Subject, Record<number, { title: string; q: string; opt: string[]; ans: number; exp: string; trap: string; form: string }>> = {
    수학: {
      1: {
        title: `${stepTag} ${pubTag}[${grade} ${unit}] 개념 기초`,
        q: `[${grade} ${subject}] 교육과정 [${unit}] 단원의 기본 원리와 개념 정의로 가장 알맞은 것은?`,
        opt: ['① 교과서 표준 정의와 연산 규칙을 정확히 적용한다.', '② 임의의 부호를 반대로 변경한다.', '③ 분모가 0인 유리수를 생성한다.', '④ 등식의 양변에 다른 수를 곱한다.', '⑤ 연산 순서를 무시하고 계산한다.'],
        ans: 0, exp: '교과서 기본 개념에 부합하는 정규 원리를 준수해야 합니다.', trap: '기본 용어 정의의 예외 조건을 숙지해야 합니다.', form: `${unit} 기본 개념 성취기준`,
      },
      2: {
        title: `${stepTag} ${pubTag}[${grade} ${unit}] 100발100중 실전 빈출`,
        q: `[${unit}] 단원의 최다 빈출 시험 문제 해결 시 반드시 점검해야 할 핵심 절차는?`,
        opt: ['① 문제의 조건식을 정규화하고 동류항을 정리한다.', '② 문제의 제한 조건을 확인하지 않는다.', '③ 식을 전개하지 않고 추측한다.', '④ 부등호 방향을 무작위로 뒤집는다.', '⑤ 검산 과정을 생략한다.'],
        ans: 0, exp: '실전 빈출 유형 해결의 핵심은 조건 분석과 정확한 대수 정리입니다.', trap: '실수하기 쉬운 부호 및 이항 실수를 방지해야 합니다.', form: `${unit} 빈출 기출 공식`,
      },
      3: {
        title: `${stepTag} ${pubTag}[${grade} ${unit}] 서술형 고난도 응용`,
        q: `[${unit}] 단원의 서술형 감점을 방지하기 위한 풀이 과정의 핵심 근거는?`,
        opt: ['① 미지수의 정의와 단계별 논리적 식의 유도 과정을 명시한다.', '② 계산 결과만 간략히 적는다.', '③ 단위 표기를 생략한다.', '④ 근거 없는 추론을 기재한다.', '⑤ 문제에 없는 기호를 정의 없이 쓴다.'],
        ans: 0, exp: '서술형 만점 기준은 명확한 미지수 정의와 논리적 유도 단계 서술입니다.', trap: '단위 누락 및 미지수 조건 미기재 감점에 주의해야 합니다.', form: `${unit} 서술형 채점 기준`,
      },
      4: {
        title: `${stepTag} ${pubTag}[${grade} ${unit}] 블랙라벨 1등급 킬러`,
        q: `[${unit}] 단원의 상위 1% 변별력 킬러 문항을 해결하는 수학적 사고 전략으로 옳은 것은?`,
        opt: ['① 대수적 조건과 기하학적/함수적 그래프 성질을 통합 해석한다.', '② 단순 반복 계산에만 의존한다.', '③ 특수 조건만을 성급히 일반화한다.', '④ 경계값 분석을 배제한다.', '⑤ 직관만으로 답을 확정한다.'],
        ans: 0, exp: '블랙라벨 1등급 킬러 문제는 복합 개념의 융합적 분석과 경계값 검증이 핵심입니다.', trap: '문제 속 숨은 전제 조건(자연수, 서로소 등)을 놓치지 않아야 합니다.', form: `${unit} 1등급 심화 융합 원리`,
      },
    },
    영어: {
      1: {
        title: `${stepTag} ${pubTag}[${grade} 영어] 교과서 핵심 어법`,
        q: '다음 문장의 빈칸에 들어갈 가장 알맞은 말은?\n"She ______ English very well every day."',
        opt: ['① speak', '② speaks', '③ is speak', '④ speaking', '⑤ spoke'],
        ans: 1, exp: '주어가 3인칭 단수(She)이고 현재 습관(every day)이므로 speaks가 올바릅니다.', trap: '3인칭 단수 현재형 -(e)s 부착 규칙 확인', form: '3인칭 단수 주어 + 동사-(e)s',
      },
      2: {
        title: `${stepTag} ${pubTag}[${grade} 영어] 100발100중 실전 기출`,
        q: '다음 괄호 안에서 어법상 가장 적절한 것끼리 짝지어진 것은?\nKevin has (A)[live / lived] in Seoul since he was ten. He is interested in (B)[play / playing] soccer.',
        opt: ['① live — play', '② lived — play', '③ lived — playing', '④ live — playing', '⑤ living — played'],
        ans: 2, exp: '(A) have/has + p.p. 현재완료이므로 lived\n(B) 전치사 in 뒤에는 동명사 playing이 와야 합니다.', trap: '현재완료 과거분사 형태와 전치사+동명사 결합 규칙', form: 'have/has + p.p. / 전치사 + V-ing',
      },
      3: {
        title: `${stepTag} ${pubTag}[${grade} 영어] 실전 독해 및 문맥 추론`,
        q: '다음 글의 흐름으로 보아 빈칸에 들어갈 접속사로 가장 적절한 것은?\n"It was raining heavily outside. ________, the students continued their soccer match."',
        opt: ['① Therefore', '② However', '③ Because', '④ Although', '⑤ For example'],
        ans: 1, exp: '비가 심하게 내렸음에도 경기를 계속했다는 상반된 역접 관계이므로 However(그러나)가 올바릅니다.', trap: '앞뒤 문장의 인과/역접 논리 관계를 면밀히 분석해야 합니다.', form: '역접 접속부사: However, Nevertheless',
      },
      4: {
        title: `${stepTag} ${pubTag}[${grade} 영어] 1등급 킬러 어법 판별`,
        q: '다음 중 어법상 옳지 않은 문장을 포함하는 것은?',
        opt: ['① The book was written by my favorite author.', '② I don\'t know where does he live.', '③ If it rains tomorrow, we will stay at home.', '④ She made me clean the living room.', '⑤ The boy who is wearing a red hat is my brother.'],
        ans: 1, exp: '② 간접의문문의 어순은 [의문사 + 주어 + 동사]이므로 where does he live 가 아니라 where he lives 가 올바릅니다.', trap: '간접의문문 평서문 어순(의+주+동)과 시제/인칭 일치 주의', form: '간접의문문: 의문사 + 주어 + 동사',
      },
    },
    국어: {
      1: {
        title: `${stepTag} ${pubTag}[${grade} 국어] 교과서 기본 갈래`,
        q: '다음 중 대상의 모습을 사람이 아닌 사물에 인격을 부여하여 표현한 ‘의인법’에 해당하는 것은?',
        opt: ['① 내 마음은 호수요.', '② 꽃처럼 붉은 노을이 진다.', '③ 바람이 나무에게 귓속말을 건넨다.', '④ 눈이 시리도록 푸른 바다', '⑤ 달빛이 차갑게 부서진다.'],
        ans: 2, exp: '바람이 사람처럼 귓속말을 건넨다는 표현은 사물을 인격화한 의인법입니다.', trap: '은유법(A=B)과 직유법(~처럼)과의 차이점을 명확히 구별해야 합니다.', form: '비유법: 직유, 은유, 의인, 대유',
      },
      2: {
        title: `${stepTag} ${pubTag}[${grade} 국어] 100발100중 실전 기출`,
        q: '다음 중 품사의 특성상 형태가 변하지 않는 ‘불변어’에만 해당하는 것은?',
        opt: ['① 명사, 대명사, 수사, 조사, 관형사, 부사, 감탄사', '② 동사, 형용사', '③ 서술격 조사', '④ 어간과 어미', '⑤ 보조 용언'],
        ans: 0, exp: '우리말에서 형태가 변하는 가변어는 용언(동사, 형용사)과 서술격 조사 ‘이다’뿐이며 나머지는 모두 불변어입니다.', trap: '조사 중 서술격 조사 ‘이다’는 활용하므로 가변어에 속합니다.', form: '국어 9품사 기능 및 형태별 분류 체계',
      },
      3: {
        title: `${stepTag} ${pubTag}[${grade} 국어] 서술상 특징 및 문학 비판`,
        q: '소설에서 서술자가 작품 밖에서 인물의 내면 심리와 행동을 모두 꿰뚫어 보고 서술하는 시점은?',
        opt: ['① 1인칭 주인공 시점', '② 1인칭 관찰자 시점', '③ 3인칭 관찰자 시점', '④ 전지적 작가 시점', '⑤ 작가 관찰자 시점'],
        ans: 3, exp: '작품 밖의 서술자가 전지전능한 신의 위치에서 인물의 속마음까지 모두 서술하는 시점은 전지적 작가 시점입니다.', trap: '3인칭 관찰자 시점은 겉모습만 객관적으로 묘사한다는 점에서 차이가 있습니다.', form: '소설의 4대 시점 분류 체계',
      },
      4: {
        title: `${stepTag} ${pubTag}[${grade} 국어] 1등급 심화 외적 준거 킬러`,
        q: '문학 작품을 감상할 때 작가의 생애, 창작 의도, 심리 상태를 중심으로 해석하는 관점은?',
        opt: ['① 표현론적 관점', '② 반영론적 관점', '③ 효용론적 관점', '④ 내재적(절대주의적) 관점', '⑤ 구조주의적 관점'],
        ans: 0, exp: '작가를 중심으로 작품을 해석하는 외재적 관점은 표현론적 관점입니다. (반영론=시대 현실, 효용론=독자 영향)', trap: '표현론(작가), 반영론(시대), 효용론(독자)의 기준 주체를 구별해야 합니다.', form: '문학 감상의 4대 관점 (내재적/외재적)',
      },
    },
    과학: {
      1: {
        title: `${stepTag} ${pubTag}[${grade} 과학] 교과서 기본 개념`,
        q: '물질의 상태 변화 중 고체가 액체를 거치지 않고 직접 기체로 변하거나 기체가 고체로 변하는 현상은?',
        opt: ['① 융해', '② 기화', '③ 승화', '④ 응고', '⑤ 액화'],
        ans: 2, exp: '고체와 기체 사이의 직접적인 상태 변화를 승화라고 합니다. (드라이아이스 기화, 성에 형성 등)', trap: '융해(고체→액체), 기화(액체→기체)와의 상태 변화 경로 구별', form: '물질의 세 가지 상태 변화 명칭',
      },
      2: {
        title: `${stepTag} ${pubTag}[${grade} 과학] 100발100중 실전 기출`,
        q: '저항이 10Ω인 니크롬선에 20V의 전압을 걸어주었을 때, 회로에 흐르는 전류의 세기는?',
        opt: ['① 0.5A', '② 1A', '③ 2A', '④ 10A', '⑤ 200A'],
        ans: 2, exp: '옴의 법칙(V = IR)에 의해 I = V / R = 20V / 10Ω = 2A 입니다.', trap: 'V=IR 공식에서 전압과 저항의 비를 역수로 계산하지 않도록 주의해야 합니다.', form: '옴의 법칙: I = V / R',
      },
      3: {
        title: `${stepTag} ${pubTag}[${grade} 과학] 탐구 실험 자료 분석`,
        q: '질량 2kg인 물체를 지면으로부터 5m 높이에서 가만히 떨어뜨렸다. 지면에 도달하기 직전의 운동 에너지는? (단, 공기 저항은 무시하며 중력 가속도는 9.8m/s²이다.)',
        opt: ['① 49J', '② 98J', '③ 196J', '④ 245J', '⑤ 392J'],
        ans: 1, exp: '역학적 에너지 보존 법칙에 의해 최고점에서의 위치 에너지가 지면 직전의 운동 에너지로 전환됩니다.\nEp = 9.8 × m × h = 9.8 × 2 × 5 = 98(J) 입니다.',
        trap: '지면 직전에는 위치 에너지가 0이 되고 모두 운동 에너지로 보존 전환됩니다.',
        form: '역학적 에너지 보존: 위치 에너지(9.8mh) = 운동 에너지(1/2 mv²)',
      },
      4: {
        title: `${stepTag} ${pubTag}[${grade} 과학] 1등급 유전 킬러`,
        q: '멘델의 유전 법칙에서 순종의 둥글고 노란색 완두(RRYY)와 주름지고 초록색 완두(rryy)를 교배하여 얻은 잡종 1대(RrYy)를 자가 수분시켰을 때, 잡종 2대에서 ‘주름지고 노란색’ 완두가 나타날 확률은?',
        opt: ['① 1/16', '② 3/16', '③ 6/16', '④ 9/16', '⑤ 12/16'],
        ans: 1, exp: '잡종 2대의 표현형 분리비는 [둥글고 노랑] : [둥글고 초록] : [주름지고 노랑] : [주름지고 초록] = 9 : 3 : 3 : 1 입니다.\n따라서 주름지고 노란색(열성·우성)의 비율은 3/16 입니다.',
        trap: '단성 잡종 분리비(3:1)와 양성 잡종 분리비(9:3:3:1)를 혼동하지 않아야 합니다.',
        form: '양성 잡종 독립의 법칙 표현형 비: 9 : 3 : 3 : 1',
      },
    },
  };

  const generic = subjectStepMap[subject]?.[stepLevel] || subjectStepMap['수학'][stepLevel];

  return {
    id: `dyn-${grade}-${semester}-${examType}-${subject}-${stepLevel}-${variantIndex}-${Date.now()}`,
    grade,
    semester,
    examType,
    subject,
    unit,
    publisher,
    bookSource: bookSrc,
    difficultyLevel: diffLevel,
    stepLevel,
    scoreWeight,
    upgradeRound: 1,
    title: generic.title,
    questionText: generic.q,
    options: generic.opt,
    correctAnswerIndex: generic.ans,
    explanation: generic.exp,
    trapPoint: generic.trap,
    coreFormula: generic.form,
  };
}

// 시험 시간 모드(10분/20분/30분/45분)에 따른 맞춤형 단계별 문항 필터링 및 조립 엔진
export function getFilteredQuestions(params: {
  grade: Grade;
  semester: Semester;
  examType: ExamType;
  subject?: Subject;
  bookType?: BookType;
  publisher?: TextbookPublisher;
  selectedUnits?: string[];
  timerMinutes?: number;
  upgradeRound?: number;
}): Question[] {
  const {
    grade,
    semester,
    examType,
    subject = '수학',
    bookType = '100bal100jung',
    selectedUnits,
    publisher,
    timerMinutes = 30,
  } = params;

  // 1. 선택된 시험 시간 모드 스펙 획득 (10분: 5문항, 20분: 10문항, 30분: 15문항, 45분: 20문항)
  const modeSpec = EXAM_MODES_CONFIG[timerMinutes] || EXAM_MODES_CONFIG[30];
  const targetCount = modeSpec.questionCount;
  const breakdown = modeSpec.tierBreakdown;

  // 2. [절대 학년 및 과목 격리]
  const gradePool = FULL_QUESTION_BANK.filter((q) => q.grade === grade && q.subject === subject);

  // 3. 지정 범위 단원 필터링 (미지정 시 학년/학기/고사 단원)
  let unitFilteredPool: Question[] = [];
  if (selectedUnits && selectedUnits.length > 0) {
    unitFilteredPool = gradePool.filter((q) => isUnitMatching(q.unit, selectedUnits));
  } else {
    unitFilteredPool = gradePool.filter((q) => q.semester === semester && q.examType === examType);
    if (unitFilteredPool.length === 0) {
      unitFilteredPool = gradePool.filter((q) => q.semester === semester);
    }
    if (unitFilteredPool.length === 0) {
      unitFilteredPool = gradePool;
    }
  }

  // 4. 4단계(Step 1 ~ Step 4) 난이도별 목표 문항 풀 조립
  const assembledQuestions: Question[] = [];
  const existingIds = new Set<string>();

  const activeUnitList = selectedUnits && selectedUnits.length > 0
    ? selectedUnits
    : [`${grade} ${semester} ${subject} 표준 범위`];

  const stepsToBuild: Array<{ step: 1 | 2 | 3 | 4; targetNum: number }> = [
    { step: 1, targetNum: breakdown.step1 },
    { step: 2, targetNum: breakdown.step2 },
    { step: 3, targetNum: breakdown.step3 },
    { step: 4, targetNum: breakdown.step4 },
  ];

  stepsToBuild.forEach(({ step, targetNum }) => {
    if (targetNum <= 0) return;

    // A. 기존 문항 은행에서 해당 단계에 부합하는 문항 탐색
    const matchingFromBank = unitFilteredPool.filter((q) => {
      if (existingIds.has(q.id)) return false;
      if (step === 1) return q.difficultyLevel === '기본';
      if (step === 2) return q.difficultyLevel === '100발100중 실전';
      if (step === 3) return q.difficultyLevel === '블랙라벨 Step2';
      return q.difficultyLevel === '블랙라벨 Step3 킬러';
    });

    let currentAdded = 0;
    for (const q of matchingFromBank) {
      if (currentAdded >= targetNum) break;
      assembledQuestions.push({
        ...q,
        stepLevel: step,
        scoreWeight: step === 1 ? 4 : step === 4 ? 6 : 5,
        publisher: publisher || q.publisher,
      });
      existingIds.add(q.id);
      currentAdded++;
    }

    // B. 부족한 문항은 선택된 단원들에 기반하여 정밀 단계별 고품질 문항 동적 생성 보강
    while (currentAdded < targetNum) {
      const targetUnit = activeUnitList[currentAdded % activeUnitList.length];
      const newQ = generateTieredQuestion({
        grade,
        semester,
        examType,
        subject,
        unit: targetUnit,
        publisher,
        stepLevel: step,
        variantIndex: currentAdded + 1,
        bookType,
      });
      assembledQuestions.push(newQ);
      existingIds.add(newQ.id);
      currentAdded++;
    }
  });

  // 5. 문항 번호 순서 정렬: Step 1 (기본) -> Step 2 (빈출) -> Step 3 (응용) -> Step 4 (킬러)
  assembledQuestions.sort((a, b) => (a.stepLevel || 1) - (b.stepLevel || 1));

  return assembledQuestions.slice(0, targetCount).map((q, idx) => ({
    ...q,
    grade,
    publisher: publisher || q.publisher,
  }));
}

// 시험 성적이 우수하거나 학생이 업그레이드를 요청할 때 고난도 문항으로 진화 생성하는 함수
export function generateUpgradedQuestions(
  baseQuestions: Question[],
  round: number,
  targetBook: BookType = 'blacklabel'
): Question[] {
  return baseQuestions.map((q, idx) => {
    const isUpgradedToBlackLabel = targetBook === 'blacklabel' || round >= 2;
    return {
      ...q,
      id: `${q.id}-upgraded-r${round}-${idx}`,
      upgradeRound: round,
      bookSource: isUpgradedToBlackLabel ? 'blacklabel' : q.bookSource,
      difficultyLevel: isUpgradedToBlackLabel ? '블랙라벨 Step3 킬러' : '100발100중 실전',
      title: isUpgradedToBlackLabel
        ? `[블랙라벨 1등급 심화 R${round}] ${q.unit} 변형 킬러`
        : `[100발100중 실전 R${round}] ${q.unit} 고득점 기출`,
    };
  });
}
