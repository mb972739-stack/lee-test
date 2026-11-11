import { Grade, Semester, ExamType, Subject } from '../types';

export interface CurriculumUnitInfo {
  id: string;
  name: string;
  grade: Grade;
  semester: Semester;
  subject: Subject;
  examType?: ExamType;
  description: string;
  keyTopics: string[];
}

export const CURRICULUM_UNITS: CurriculumUnitInfo[] = [
  // ==========================================
  // [중1] 1학기 수학
  // ==========================================
  {
    id: 'm1-1-math-u1',
    name: '소인수분해와 약수의 개수',
    grade: '중1',
    semester: '1학기',
    examType: '중간고사',
    subject: '수학',
    description: '소수와 합성수, 거듭제곱, 소인수분해, 최대공약수와 최소공배수',
    keyTopics: ['소인수분해', '약수의 개수 구하기', '최대공약수·최소공배수의 활용'],
  },
  {
    id: 'm1-1-math-u2',
    name: '정수와 유리수의 연산',
    grade: '중1',
    semester: '1학기',
    examType: '중간고사',
    subject: '수학',
    description: '양수와 음수, 절댓값, 수직선, 정수와 유리수의 사칙계산',
    keyTopics: ['절댓값의 성질', '수직선 위 두 점 사이의 거리', '부호가 다른 수의 덧셈·곱셈'],
  },
  {
    id: 'm1-1-math-u3',
    name: '문자의 사용과 식의 계산',
    grade: '중1',
    semester: '1학기',
    examType: '기말고사',
    subject: '수학',
    description: '문자를 사용한 식, 식의 값, 일차식과 수의 곱셈·나눗셈, 동류항 계산',
    keyTopics: ['곱셈·나눗셈 기호의 생략', '식의 값 구하기', '일차식의 덧셈과 뺄셈'],
  },
  {
    id: 'm1-1-math-u4',
    name: '일차방정식의 풀이와 활용',
    grade: '중1',
    semester: '1학기',
    examType: '기말고사',
    subject: '수학',
    description: '방정식과 항등식, 등식의 성질, 일차방정식 풀이, 거리·속력·시간·원가·정가 실생활 활용',
    keyTopics: ['등식의 성질', '이항과 일차방정식 풀이', '원가·정가 및 소금물 농도 활용'],
  },

  // ==========================================
  // [중1] 2학기 수학
  // ==========================================
  {
    id: 'm1-2-math-u1',
    name: '좌표평면과 그래프',
    grade: '중1',
    semester: '2학기',
    examType: '중간고사',
    subject: '수학',
    description: '순서쌍과 좌표, 사분면, 그래프의 이해, 정비례와 반비례',
    keyTopics: ['사분면 위의 점 판별', '정비례 관계식 y=ax', '반비례 관계식 y=a/x'],
  },
  {
    id: 'm1-2-math-u2',
    name: '기본 도형과 작도',
    grade: '중1',
    semester: '2학기',
    examType: '기말고사',
    subject: '수학',
    description: '점·선·면·각, 맞꼭지각, 수직과 평행선, 삼각형의 작도와 합동조건',
    keyTopics: ['동위각과 엇각', '평행선 사이의 꺾인 선', '삼각형의 합동조건(SSS, SAS, ASA)'],
  },
  {
    id: 'm1-2-math-u3',
    name: '평면도형과 입체도형의 성질',
    grade: '중1',
    semester: '2학기',
    examType: '기말고사',
    subject: '수학',
    description: '다각형의 대각선과 내각/외각의 합, 원과 부채꼴의 넓이/호의 길이, 기둥과 뿔의 겉넓이와 부피',
    keyTopics: ['부채꼴 호의 길이와 넓이', '입체도형 겉넓이와 부피'],
  },

  // ==========================================
  // [중2] 1학기 수학
  // ==========================================
  {
    id: 'm2-1-math-u1',
    name: '유리수와 순환소수',
    grade: '중2',
    semester: '1학기',
    examType: '중간고사',
    subject: '수학',
    description: '유한소수와 무한소수, 순환소수의 분수 표현, 유한소수가 될 조건',
    keyTopics: ['기약분수의 분모 소인수가 2 또는 5', '순환소수를 분수로 나타내기'],
  },
  {
    id: 'm2-1-math-u2',
    name: '식의 계산과 단항식·다항식',
    grade: '중2',
    semester: '1학기',
    examType: '중간고사',
    subject: '수학',
    description: '지수법칙, 단항식의 곱셈과 나눗셈, 다항식의 덧셈과 뺄셈, 곱셈공식 기초',
    keyTopics: ['지수의 곱·합·거듭제곱 법칙', '다항식의 사칙연산과 괄호 전개'],
  },
  {
    id: 'm2-1-math-u3',
    name: '일차부등식과 연립일차방정식의 활용',
    grade: '중2',
    semester: '1학기',
    examType: '기말고사',
    subject: '수학',
    description: '부등식의 성질, 일차부등식 풀이, 연립일차방정식 가감법·대입법 및 소금물·나이·일의 양 활용',
    keyTopics: ['음수를 곱하거나 나눌 때 부등호 방향 반전', '정수 해의 개수 조건', '소금물 농도 활용'],
  },
  {
    id: 'm2-1-math-u4',
    name: '일차함수와 그래프',
    grade: '중2',
    semester: '1학기',
    examType: '기말고사',
    subject: '수학',
    description: '함수의 개념, 일차함수 y=ax+b의 그래프, 기울기와 절편, 일차함수와 일차방정식의 관계',
    keyTopics: ['기울기와 x절편·y절편', '두 직선의 교점과 연립방정식의 해', '삼각형의 넓이 이등분'],
  },

  // ==========================================
  // [중2] 2학기 수학
  // ==========================================
  {
    id: 'm2-2-math-u1',
    name: '이등변삼각형과 직각삼각형의 합동',
    grade: '중2',
    semester: '2학기',
    examType: '중간고사',
    subject: '수학',
    description: '이등변삼각형의 성질, 직각삼각형의 합동(RHA, RHS), 각의 이등분선의 성질',
    keyTopics: ['이등변삼각형의 밑각과 꼭지각의 이등분선', '직각삼각형 RHA·RHS 합동 증명'],
  },
  {
    id: 'm2-2-math-u2',
    name: '삼각형의 외심과 내심',
    grade: '중2',
    semester: '2학기',
    examType: '중간고사',
    subject: '수학',
    description: '삼각형의 외접원과 외심, 내접원과 내심의 성질 및 넓이 공식 연계',
    keyTopics: ['직각삼각형 외심의 위치(빗변 중점)', '내접원 반지름 공식 r=(a+b-c)/2', '외심·내심 각도'],
  },
  {
    id: 'm2-2-math-u3',
    name: '도형의 닮음과 피타고라스 정리',
    grade: '중2',
    semester: '2학기',
    examType: '기말고사',
    subject: '수학',
    description: '닮음비, 삼각형의 닮음조건(AA, SAS, SSS), 평행선과 선분의 길이 비, 피타고라스 정리 a²+b²=c²',
    keyTopics: ['AA 닮음 삼각형 비례식', '직각삼각형 공식 a²=x*c', '피타고라스 수(3-4-5, 5-12-13)'],
  },
  {
    id: 'm2-2-math-u4',
    name: '경우의 수와 확률',
    grade: '중2',
    semester: '2학기',
    examType: '기말고사',
    subject: '수학',
    description: '사건과 경우의 수, 합의 법칙과 곱의 법칙, 확률의 기본 성질과 덧셈/곱셈 정리',
    keyTopics: ['경우의 수 곱의 법칙', '적어도 하나는 ~일 확률(여사건)'],
  },

  // ==========================================
  // [중3] 1학기 수학
  // ==========================================
  {
    id: 'm3-1-math-u1',
    name: '제곱근의 뜻과 성질',
    grade: '중3',
    semester: '1학기',
    examType: '중간고사',
    subject: '수학',
    description: '제곱근의 정의, 근호의 성질, 무리수와 실수, 수직선 위의 실수의 대소 관계',
    keyTopics: ['√(a²) = |a| 의 부호 판정', '제곱근의 곱셈과 나눗셈', '분모의 유리화'],
  },
  {
    id: 'm3-1-math-u2',
    name: '다항식의 곱셈과 인수분해',
    grade: '중3',
    semester: '1학기',
    examType: '중간고사',
    subject: '수학',
    description: '곱셈공식 4대 유형, 공통인수 묶기, 완전제곱식, 합차공식, 대각선 분해법',
    keyTopics: ['완전제곱식이 될 조건', '복잡한 식의 치환 인수분해', '수 계산에 인수분해 활용'],
  },
  {
    id: 'm3-1-math-u3',
    name: '이차방정식의 풀이와 활용',
    grade: '중3',
    semester: '1학기',
    examType: '기말고사',
    subject: '수학',
    description: '인수분해에 의한 풀이, 제곱근과 완전제곱식에 의한 풀이, 근의 공식, 판별식과 근과 계수의 관계',
    keyTopics: ['근의 공식 x=(-b±√(b²-4ac))/2a', '중근을 가질 조건 b²-4ac=0', '정수근 부정방정식'],
  },
  {
    id: 'm3-1-math-u4',
    name: '이차함수와 그래프',
    grade: '중3',
    semester: '1학기',
    examType: '기말고사',
    subject: '수학',
    description: '이차함수 y=ax²의 그래프, 평행이동 y=a(x-p)²+q, 일반형 y=ax²+bx+c, 꼭짓점과 축의 방정식',
    keyTopics: ['표준형 변형과 꼭짓점 좌표', '축의 방정식 x=-b/(2a)', '그래프와 사각형 넓이'],
  },

  // ==========================================
  // [중3] 2학기 수학
  // ==========================================
  {
    id: 'm3-2-math-u1',
    name: '삼각비의 뜻과 특수각의 값',
    grade: '중3',
    semester: '2학기',
    examType: '중간고사',
    subject: '수학',
    description: '직각삼각형의 삼각비(sin, cos, tan), 30°·45°·60°의 특수각 삼각비, 사분원과 임의의 예각 삼각비',
    keyTopics: ['sin, cos, tan의 정의', '특수각(30°, 45°, 60°) 표 암기', '입체도형에서의 삼각비'],
  },
  {
    id: 'm3-2-math-u2',
    name: '삼각비의 활용과 둔각삼각형의 넓이',
    grade: '중3',
    semester: '2학기',
    examType: '중간고사',
    subject: '수학',
    description: '직각삼각형의 변의 길이 구하기, 일반 삼각형의 높이와 변의 길이, 삼각형과 사각형의 넓이',
    keyTopics: ['예각·둔각삼각형 넓이 S=1/2 ab sinθ', '평행사변형 넓이 S=ab sinθ', '건물 높이 측정'],
  },
  {
    id: 'm3-2-math-u3',
    name: '원의 성질과 원주각',
    grade: '중3',
    semester: '2학기',
    examType: '기말고사',
    subject: '수학',
    description: '원의 중심과 현의 수직이등분선, 접선의 성질, 원주각과 중심각의 관계(1/2), 원에 내접하는 사각형',
    keyTopics: ['원주각 = 1/2 중심각', '지름에 대한 원주각 90°', '원에 내접하는 사각형 대각의 합 180°'],
  },
  {
    id: 'm3-2-math-u4',
    name: '대푯값과 산포도(통계)',
    grade: '중3',
    semester: '2학기',
    examType: '기말고사',
    subject: '수학',
    description: '평균, 중앙값, 최빈값, 편차, 분산과 표준편차, 산점도와 상관관계',
    keyTopics: ['편차의 합은 항상 0', '분산과 표준편차 구하기'],
  },

  // ==========================================
  // 영어 교과 단원 (전학년)
  // ==========================================
  {
    id: 'eng-m1-1-u1',
    name: 'be동사와 일반동사의 현재시제',
    grade: '중1',
    semester: '1학기',
    examType: '중간고사',
    subject: '영어',
    description: '주어의 인칭과 수에 따른 동사 형태 변화, 부정문과 의문문 만들기',
    keyTopics: ['3인칭 단수 현재형 -(e)s', 'do/does 조동사 활용', 'be동사 수일치'],
  },
  {
    id: 'eng-m1-1-u2',
    name: '조동사의 용법과 과거시제',
    grade: '중1',
    semester: '1학기',
    examType: '기말고사',
    subject: '영어',
    description: 'can, may, must, should 조동사, 규칙 및 불규칙 동사의 과거형',
    keyTopics: ['조동사 뒤 동사원형', 'must not(금지) vs don\'t have to(불필요)', '불규칙 과거동사'],
  },
  {
    id: 'eng-m2-1-u1',
    name: 'to부정사의 형용사적·명사적 용법',
    grade: '중2',
    semester: '1학기',
    examType: '중간고사',
    subject: '영어',
    description: '명사를 수식하는 to부정사, 전치사를 동반하는 수식 구문, 가주어-진주어 it~to 구문',
    keyTopics: ['명사 + to부정사 + 필수 전치사', '목적을 나타내는 부사적 용법', 'it is 형용사 to부정사'],
  },
  {
    id: 'eng-m2-1-u2',
    name: '동명사의 쓰임과 접속사',
    grade: '중2',
    semester: '1학기',
    examType: '기말고사',
    subject: '영어',
    description: '동명사를 목적어로 취하는 동사, to부정사/동명사 동시 취하는 동사, 시간/이유/조건 접속사',
    keyTopics: ['enjoy, finish, practice + v-ing', 'when, because, if 부사절 접속사'],
  },
  {
    id: 'eng-m2-2-u1',
    name: '수동태와 현재완료시제',
    grade: '중2',
    semester: '2학기',
    examType: '중간고사',
    subject: '영어',
    description: '능동태의 수동태 전환, be+p.p., by 이외의 전치사 숙어, have+p.p. 완료·경험·계속·결과',
    keyTopics: ['be+p.p. 수동태 전환', 'be satisfied with 등 관용구', '현재완료 4대 용법'],
  },
  {
    id: 'eng-m2-2-u2',
    name: '비교급과 최상급 및 접속사 that',
    grade: '중2',
    semester: '2학기',
    examType: '기말고사',
    subject: '영어',
    description: '원급/비교급/최상급 규칙 및 불규칙 변화, as~as 원급 비교, 명사절 접속사 that',
    keyTopics: ['the + 최상급 of/in', 'as 형용사 as possible', '명사절 접속사 that'],
  },
  {
    id: 'eng-m3-1-u1',
    name: '관계대명사와 명사절 접속사',
    grade: '중3',
    semester: '1학기',
    examType: '중간고사',
    subject: '영어',
    description: '주격/목적격/소유격 관계대명사, 관계대명사 what(선행사 포함), 관계대명사 생략 조건',
    keyTopics: ['what (선행사 X, 불완전한 절)', 'that (명사절, 완전한 절)', '목적격 관계대명사 생략'],
  },
  {
    id: 'eng-m3-1-u2',
    name: '분사구문과 접속사',
    grade: '중3',
    semester: '1학기',
    examType: '기말고사',
    subject: '영어',
    description: '현재분사와 과거분사 수식, 부사절의 분사구문 전환(접속사 생략, 주어 일치, v-ing)',
    keyTopics: ['분사구문 만드는 법', '수동 분사구문 (Being) p.p.', '감정 분사 interesting vs interested'],
  },
  {
    id: 'eng-m3-2-u1',
    name: '가정법 과거와 조건문',
    grade: '중3',
    semester: '2학기',
    examType: '중간고사',
    subject: '영어',
    description: '현재 사실의 반대를 나타내는 가정법 과거, If+S+과거동사, S+would/could+동사원형',
    keyTopics: ['If I were you...', 'I wish + 가정법', '직설법과 가정법 상호 전환'],
  },
  {
    id: 'eng-m3-2-u2',
    name: '조동사+have p.p.와 특수구문',
    grade: '중3',
    semester: '2학기',
    examType: '기말고사',
    subject: '영어',
    description: '과거 사실에 대한 추측/후회 must/cannot/should have p.p., 강조 구문, 도치 구문',
    keyTopics: ['should have p.p. (~했어야 했는데)', 'must have p.p. (~했음에 틀림없다)'],
  },

  // ==========================================
  // 국어 교과 단원 (전학년)
  // ==========================================
  {
    id: 'kor-m1-1-u1',
    name: '시의 심상과 비유적 표현',
    grade: '중1',
    semester: '1학기',
    examType: '중간고사',
    subject: '국어',
    description: '비유하기(직유법, 은유법, 의인법, 대유법), 시의 분위기와 운율, 반어법과 역설법 기초',
    keyTopics: ['직유와 은유의 차이', '의인법과 활유법', '반어법과 역설법 구별'],
  },
  {
    id: 'kor-m1-1-u2',
    name: '품사의 특성과 기능',
    grade: '중1',
    semester: '1학기',
    examType: '기말고사',
    subject: '국어',
    description: '9품사 체계(명사, 대명사, 수사, 조사, 동사, 형용사, 관형사, 부사, 감탄사)',
    keyTopics: ['동사와 형용사 판별 기준', '관형사와 형용사 구별', '조사의 결합 양상'],
  },
  {
    id: 'kor-m2-1-u1',
    name: '담화와 어휘의 체계',
    grade: '중2',
    semester: '1학기',
    examType: '중간고사',
    subject: '국어',
    description: '고유어, 한자어, 외래어의 어휘 체계, 상황과 대상에 따른 담화 관습과 예절',
    keyTopics: ['고유어와 한자어의 대응', '외래어와 외국어의 구별', '담화 맥락의 이해'],
  },
  {
    id: 'kor-m2-1-u2',
    name: '한글의 창제 원리와 음운 체계',
    grade: '중2',
    semester: '1학기',
    examType: '기말고사',
    subject: '국어',
    description: '자음 기본자(발음기관 상형)와 가획의 원리, 모음 기본자(삼재 상형)와 합성의 원리',
    keyTopics: ['자음의 상형과 가획', '모음의 천지인 삼재 상형', '초출자와 재출자'],
  },
  {
    id: 'kor-m2-2-u1',
    name: '설득 전략과 논증 방식(귀납·연역)',
    grade: '중2',
    semester: '2학기',
    examType: '중간고사',
    subject: '국어',
    description: '삼단논법(연역 논증), 사례 중심의 귀납 논증, 유사성 기반의 유비논증(유추)',
    keyTopics: ['대전제-소전제-결론 연역 삼단논법', '귀납의 일반화 오류', '타당성과 건전성'],
  },
  {
    id: 'kor-m2-2-u2',
    name: '갈등의 양상과 소설의 서사 구조',
    grade: '중2',
    semester: '2학기',
    examType: '기말고사',
    subject: '국어',
    description: '내적 갈등과 외적 갈등(인물 대 인물, 인물 대 사회, 인물 대 자연), 소설의 복선과 결말',
    keyTopics: ['인물 내적 갈등', '사회적 인습과의 갈등', '복선과 암시'],
  },
  {
    id: 'kor-m3-1-u1',
    name: '음운 변동의 유형(교체, 탈락, 첨가, 축약)',
    grade: '중3',
    semester: '1학기',
    examType: '중간고사',
    subject: '국어',
    description: '비음화, 유음화, 구개음화, 음절의 끝소리 규칙, 자음군 단순화, 사잇소리 현상',
    keyTopics: ['비음화(ㄱ,ㄷ,ㅂ+ㄴ,ㅁ)', '유음화(ㄴ+ㄹ)', '구개음화(ㄷ,ㅌ+ㅣ)', '음운 개수 보존'],
  },
  {
    id: 'kor-m3-1-u2',
    name: '통일성 있는 글쓰기와 설득 전략',
    grade: '중3',
    semester: '1학기',
    examType: '기말고사',
    subject: '국어',
    description: '문단 구성의 원리(통일성, 완결성, 일관성), 논리적 글쓰기 절차와 반론 꺾기',
    keyTopics: ['문단의 중심 내용과 뒷받침 내용', '접속 표현의 적절성', '타당한 근거'],
  },
  {
    id: 'kor-m3-2-u1',
    name: '문장의 짜임과 안은문장',
    grade: '중3',
    semester: '2학기',
    examType: '중간고사',
    subject: '국어',
    description: '홑문장과 겹문장, 이어진문장(대등, 종속), 안은문장(명사절, 관형사절, 부사절, 서술절, 인용절)',
    keyTopics: ['관형사절 표지 -(으)ㄴ, -는, -(으)ㄹ, -던', '부사절 -도록, -게', '인용절 -라고/-고'],
  },
  {
    id: 'kor-m3-2-u2',
    name: '국어의 변천과 맞춤법 규정',
    grade: '중3',
    semester: '2학기',
    examType: '기말고사',
    subject: '국어',
    description: '중세 국어와 현대 국어의 차이, 한글 맞춤법 총칙(소리대로 적되 어법에 맞도록 함), 띄어쓰기 규정',
    keyTopics: ['훈민정음 어제 서문', '소리대로 적기와 형태소 밝혀 적기', '조사와 의존명사 띄어쓰기'],
  },

  // ==========================================
  // 과학 교과 단원 (전학년)
  // ==========================================
  {
    id: 'sci-m1-1-u1',
    name: '지권의 구조와 암석의 순환',
    grade: '중1',
    semester: '1학기',
    examType: '중간고사',
    subject: '과학',
    description: '지구계, 지진파 탐사, 지각-맨틀-외핵-내핵 층상 구조, 화성암·퇴적암·변성암 순환',
    keyTopics: ['모호로비치치 불연속면', 'S파와 외핵 액체 상태', '화성암의 분류(화산암, 심성암)'],
  },
  {
    id: 'sci-m1-1-u2',
    name: '상태 변화와 열에너지',
    grade: '중1',
    semester: '1학기',
    examType: '기말고사',
    subject: '과학',
    description: '물질의 세 가지 상태, 상태 변화와 입자 배열, 융해열·기화열·승화열 흡수와 응고열·액화열 방출',
    keyTopics: ['상태 변화 시 질량 보존', '가열·냉각 곡선의 수평 구간(녹는점, 끓는점)', '냉해 방지 응고열'],
  },
  {
    id: 'sci-m2-1-u1',
    name: '물질의 구성과 이온식',
    grade: '중2',
    semester: '1학기',
    examType: '중간고사',
    subject: '과학',
    description: '원소와 원자, 분자, 주기율표, 이온의 형성과 이온식, 앙금 생성 반응',
    keyTopics: ['불꽃 반응색(나트륨 노랑, 구리 청록)', '양이온과 음이온의 전하', 'AgCl, BaSO₄ 앙금 반응'],
  },
  {
    id: 'sci-m2-1-u2',
    name: '전기와 자기 (옴의 법칙)',
    grade: '중2',
    semester: '1학기',
    examType: '기말고사',
    subject: '과학',
    description: '마찰 전기, 정전기 유도, 전압·전류·저항과 옴의 법칙(V=IR), 저항의 직렬·병렬 연결, 전류의 자기 작용',
    keyTopics: ['옴의 법칙 V=IR', '직렬 연결과 병렬 연결의 합성 저항', '전자기력과 오른손 법칙'],
  },
  {
    id: 'sci-m2-2-u1',
    name: '식물과 에너지 (광합성과 호흡)',
    grade: '중2',
    semester: '2학기',
    examType: '중간고사',
    subject: '과학',
    description: '잎의 구조와 기공, 광합성에 필요한 물질과 생성물, 식물의 호흡과 기체 교환, 증산 작용',
    keyTopics: ['광합성 장소 엽록체', '증산 작용과 물 상승의 원동력', 'BTB 용액 색깔 변화'],
  },
  {
    id: 'sci-m2-2-u2',
    name: '소화, 순환, 호흡, 배설의 상호 작용',
    grade: '중2',
    semester: '2학기',
    examType: '기말고사',
    subject: '과학',
    description: '영양소와 소화 효소, 심장의 구조와 온몸·폐순환, 기체 교환, 오줌의 생성과 배설',
    keyTopics: ['소화 효소 아밀레이스, 펩신, 라이페이스', '동맥혈과 정맥혈', '네프론 여과·재흡수·분비'],
  },
  {
    id: 'sci-m3-1-u1',
    name: '화학 반응의 규칙과 일정 성분비 법칙',
    grade: '중3',
    semester: '1학기',
    examType: '중간고사',
    subject: '과학',
    description: '물리 변화와 화학 변화, 화학 반응식 완성, 질량 보존 법칙, 일정 성분비 법칙, 기체 반응 법칙',
    keyTopics: ['화학 반응식 계수 맞추기', '질량 보존 법칙', '구리와 산소의 결합 질량비 4:1'],
  },
  {
    id: 'sci-m3-1-u2',
    name: '운동과 에너지 (역학적 에너지 보존)',
    grade: '중3',
    semester: '1학기',
    examType: '기말고사',
    subject: '과학',
    description: '속력과 등속 직선 운동, 자유 낙하 운동, 일과 위치 에너지, 운동 에너지, 역학적 에너지 보존',
    keyTopics: ['위치 에너지 mgh', '운동 에너지 1/2 mv²', '자유 낙하 도달 속력 v=√(2gh)'],
  },
  {
    id: 'sci-m3-2-u1',
    name: '자극과 반응 (신경계와 호르몬)',
    grade: '중3',
    semester: '2학기',
    examType: '중간고사',
    subject: '과학',
    description: '감각 기관(눈, 귀, 코, 혀, 피부), 뉴런과 중추/말초 신경계, 무조건 반사, 호르몬과 항상성(혈당량, 체온)',
    keyTopics: ['뉴런의 구조와 흥분 전달', '무조건 반사의 중추(척수, 연수)', '인슐린과 글루카곤 혈당량 조절'],
  },
  {
    id: 'sci-m3-2-u2',
    name: '유전과 진화 (멘델의 분리의 법칙과 독립의 법칙)',
    grade: '중3',
    semester: '2학기',
    examType: '기말고사',
    subject: '과학',
    description: '유전자와 염색체, 멘델의 유전 법칙(우열의 원리, 분리의 법칙, 독립의 법칙), 사람의 유전',
    keyTopics: ['단성잡종 분리의 법칙 3:1', '양성잡종 독립의 법칙 9:3:3:1', '미맹과 ABO식 혈액형'],
  },
];

// 학년, 학기, 과목에 해당하는 교육과정 단원 목록 반환 함수
export function getAvailableUnits(
  grade: Grade,
  semester: Semester,
  subject: Subject,
  examType?: ExamType
): CurriculumUnitInfo[] {
  // 1. 학년, 학기, 과목 일치 단원 필터링
  const match = CURRICULUM_UNITS.filter(
    (u) => u.grade === grade && u.semester === semester && u.subject === subject
  );

  if (match.length > 0) {
    if (examType) {
      // 지정 고사(중간/기말)와 일치하는 단원을 맨 앞쪽으로 우선 정렬
      return [...match].sort((a, b) => {
        const aMatch = a.examType === examType ? 1 : 0;
        const bMatch = b.examType === examType ? 1 : 0;
        return bMatch - aMatch;
      });
    }
    return match;
  }

  // 폴백: 학년과 과목 일치 단원
  const byGrade = CURRICULUM_UNITS.filter((u) => u.grade === grade && u.subject === subject);
  if (byGrade.length > 0) return byGrade;

  return CURRICULUM_UNITS.filter((u) => u.subject === subject);
}

// 특정 학년, 학기, 시험 구분(중간/기말), 과목에 따른 기본 추천 시험범위 단원명 목록 반환
export function getDefaultUnitsForExam(
  grade: Grade,
  semester: Semester,
  examType: ExamType,
  subject: Subject
): string[] {
  const units = getAvailableUnits(grade, semester, subject);

  // 해당 고사 구분(중간고사 vs 기말고사)에 정확히 일치하는 단원 선별
  const exactExamUnits = units.filter((u) => u.examType === examType);
  if (exactExamUnits.length > 0) {
    return exactExamUnits.map((u) => u.name);
  }

  // 일치하는 특정 고사 태그가 없으면 해당 학기 전체 단원 반환
  return units.map((u) => u.name);
}
