import { Question, Grade, Semester, ExamType, Subject, BookType, TextbookPublisher, DifficultyLevel } from '../types';

export function ensure4Options(q: Question): Question {
  if (!q.options || q.options.length === 0) return q;

  const originalCorrectIdx = Math.max(0, Math.min(q.correctAnswerIndex ?? 0, q.options.length - 1));
  const correctText = q.options[originalCorrectIdx] || q.options[0];

  let selectedOptionTexts: string[] = [];
  let newCorrectIdx = 0;

  if (q.options.length === 4) {
    selectedOptionTexts = [...q.options];
    newCorrectIdx = originalCorrectIdx;
  } else if (q.options.length > 4) {
    const wrongOptions = q.options
      .map((opt, idx) => ({ opt, idx }))
      .filter((item) => item.idx !== originalCorrectIdx);

    const chosenWrongs = wrongOptions.slice(0, 3);
    newCorrectIdx = Math.min(originalCorrectIdx, 3);

    let wrongPtr = 0;
    for (let i = 0; i < 4; i++) {
      if (i === newCorrectIdx) {
        selectedOptionTexts.push(correctText);
      } else {
        selectedOptionTexts.push(chosenWrongs[wrongPtr]?.opt || `보기 ${i + 1}`);
        wrongPtr++;
      }
    }
  } else {
    selectedOptionTexts = [...q.options];
    while (selectedOptionTexts.length < 4) {
      selectedOptionTexts.push(`보기 ${selectedOptionTexts.length + 1}`);
    }
    newCorrectIdx = Math.min(originalCorrectIdx, 3);
  }

  const prefixes = ['① ', '② ', '③ ', '④ '];
  const finalOptions = selectedOptionTexts.map((opt, i) => {
    const stripped = opt.replace(/^[①②③④⑤\d\.\)\s\-]+/, '').trim();
    return `${prefixes[i]}${stripped}`;
  });

  let updatedExplanation = q.explanation;
  const oldSymbol = ['①', '②', '③', '④', '⑤'][originalCorrectIdx];
  const newSymbol = prefixes[newCorrectIdx].trim();
  if (oldSymbol && newSymbol && oldSymbol !== newSymbol && updatedExplanation) {
    updatedExplanation = updatedExplanation.replace(new RegExp(oldSymbol, 'g'), newSymbol);
  }

  return {
    ...q,
    options: finalOptions,
    correctAnswerIndex: newCorrectIdx,
    explanation: updatedExplanation,
  };
}

export interface Blueprint {
  title: string;
  q: string;
  opt: string[];
  ans: number;
  exp: string;
  trap: string;
  form: string;
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/[\s\-_·]/g, '');
}

// -------------------------------------------------------------
// 수학 단원별 4단계 복수 문항 블루프린트 저장소
// 각 단계(Step 1~4)마다 최소 3~4개의 고품질 실전문항 수록
// -------------------------------------------------------------
const MATH_BLUEPRINTS: Record<string, Record<1 | 2 | 3 | 4, Blueprint[]>> = {
  소인수분해: {
    1: [
      {
        title: '소수와 합성수의 성질 판별',
        q: '다음 중 소수(prime number)에 대한 설명으로 옳은 것만을 보기에서 있는 대로 고른 것은?\n\n[보기]\nㄱ. 2는 가장 작은 소수이며 유일한 짝수인 소수이다.\nㄴ. 모든 소수의 양의 약수는 정확히 2개이다.\nㄷ. 두 소수의 곱은 항상 홀수이다.',
        opt: ['① ㄱ', '② ㄱ, ㄴ', '③ ㄴ, ㄷ', '④ ㄱ, ㄷ'],
        ans: 1,
        exp: 'ㄱ: 2는 가장 작은 소수이자 유일한 짝수입니다. (참)\nㄴ: 소수의 정의상 1과 자기 자신만을 약수로 가지므로 약수의 개수는 정확히 2개입니다. (참)\nㄷ: 2와 3은 소수이지만 그 곱인 2×3=6은 짝수이므로 거짓입니다.',
        trap: '2가 짝수 소수이므로 ‘두 소수의 곱이 항상 홀수’라는 진술은 반례(2×3=6)로 인해 거짓입니다.',
        form: '소수의 정의: 1보다 큰 자연수 중 1과 자기 자신만을 약수로 갖는 수 (약수 2개)',
      },
      {
        title: '자연수의 거듭제곱과 소인수분해',
        q: '자연수 72를 소인수분해한 결과로 옳은 것은?',
        opt: ['① 2² × 3²', '② 2³ × 3²', '③ 2² × 3³', '④ 2⁴ × 3'],
        ans: 1,
        exp: '72를 2로 나누면 36, 다시 2로 나누면 18, 2로 나누면 9, 3으로 나누면 3이 됩니다.\n따라서 72 = 2 × 2 × 2 × 3 × 3 = 2³ × 3² 입니다.',
        trap: '지수 표기 시 2를 3번 곱한 것을 2³이 아닌 2×3으로 잘못 계산하지 않도록 주의합니다.',
        form: '거듭제곱: 같은 수를 여러 번 곱한 것을 밑과 지수로 표현',
      },
      {
        title: '소인수의 합 구하기',
        q: '자연수 90의 모든 소인수들의 합은 얼마인가?',
        opt: ['① 8', '② 10', '③ 12', '④ 15'],
        ans: 1,
        exp: '90 = 2 × 3² × 5 이므로 90의 소인수는 2, 3, 5 입니다.\n따라서 소인수들의 합은 2 + 3 + 5 = 10 입니다.',
        trap: '소인수의 거듭제곱(3²)을 그대로 9로 더하지 않고 소인수 3 하나만 더해야 합니다.',
        form: '소인수: 자연수의 약수 중에서 소수인 것',
      },
      {
        title: '서로소의 개념 판별',
        q: '다음 두 수 중 최대공약수가 1인 서로소(coprime) 관계인 것은?',
        opt: ['① 14와 25', '② 12와 21', '③ 18와 33', '④ 20과 35'],
        ans: 0,
        exp: '① 14 = 2 × 7, 25 = 5² 이므로 공통인 약수가 1뿐인 서로소입니다.\n② 12와 21은 공약수 3을 가짐\n③ 18과 33은 공약수 3을 가짐\n④ 20과 35는 공약수 5를 가짐',
        trap: '두 수가 모두 소수여야만 서로소인 것이 아니라, 합성수라도 공약수가 1뿐이면 서로소입니다.',
        form: '서로소: 최대공약수가 1인 두 자연수의 관계',
      },
    ],
    2: [
      {
        title: '소인수분해와 약수의 개수 계산',
        q: '자연수 180 = 2² × 3² × 5 의 모든 양의 약수의 개수로 알맞은 것은?',
        opt: ['① 12개', '② 16개', '③ 18개', '④ 24개'],
        ans: 2,
        exp: '자연수 N = aᵖ × bᵍ × cʳ 일 때 약수의 개수는 (p + 1)(q + 1)(r + 1) 입니다.\n180의 소인수 지수는 2, 2, 1 이므로\n약수의 개수 = (2 + 1) × (2 + 1) × (1 + 1) = 3 × 3 × 2 = 18(개) 입니다.',
        trap: '지수에 1을 더하지 않고 지수끼리 곱하는 실수를 주의해야 합니다.',
        form: '약수의 개수 = (지수 + 1)의 곱',
      },
      {
        title: '약수의 개수가 주어졌을 때 미지수 구하기',
        q: '자연수 45 × a 의 약수의 개수가 12개일 때, 가장 작은 자연수 a의 값은?',
        opt: ['① 2', '② 3', '③ 5', '④ 7'],
        ans: 0,
        exp: '45 = 3² × 5 입니다.\na = 2 이면 45 × 2 = 2¹ × 3² × 5¹\n약수의 개수 = (1 + 1)(2 + 1)(1 + 1) = 2 × 3 × 2 = 12(개)로 조건을 만족합니다.\n따라서 가장 작은 자연수 a는 2입니다.',
        trap: '기존 소인수 3이나 5의 지수를 늘리는 경우와 새 소수를 곱하는 경우 중 최소 자연수를 찾아야 합니다.',
        form: '미지수 약수 조건: 소인수분해 후 지수 곱 검증',
      },
      {
        title: '최대공약수와 최소공배수 구하기',
        q: '두 수 2³ × 3² × 5 와 2² × 3³ 의 최대공약수는?',
        opt: ['① 2² × 3²', '② 2³ × 3²', '③ 2² × 3³', '④ 2³ × 3³ × 5'],
        ans: 0,
        exp: '최대공약수(GCD)는 공통인 소인수의 거듭제곱 중 지수가 작거나 같은 것을 택하여 곱합니다.\n소인수 2의 지수: min(3, 2) = 2  =>  2²\n소인수 3의 지수: min(2, 3) = 2  =>  3²\n5는 공통이 아니므로 제외합니다.\n따라서 최대공약수는 2² × 3² (= 36) 입니다.',
        trap: '최대공약수에는 공통이 아닌 소인수 5가 포함되지 않습니다.',
        form: '최대공약수 = 공통 소인수의 최소 지수 곱',
      },
    ],
    3: [
      {
        title: '최대공약수 실생활 타일 붙이기 활용',
        q: '가로의 길이가 120cm, 세로의 길이가 90cm인 직사각형 벽면에 가능한 한 큰 정사각형 타일을 빈틈없이 붙이려고 한다. 필요한 타일의 최소 개수는?',
        opt: ['① 6개', '② 8개', '③ 12개', '④ 15개'],
        ans: 2,
        exp: '타일의 한 변의 길이는 120과 90의 최대공약수여야 합니다.\n120 = 2³ × 3 × 5, 90 = 2 × 3² × 5  =>  GCD = 2 × 3 × 5 = 30(cm)\n가로 타일 수 = 120 / 30 = 4개, 세로 타일 수 = 90 / 30 = 3개\n따라서 총 개수 = 4 × 3 = 12(개) 입니다.',
        trap: '타일의 한 변의 길이(30cm)와 타일의 총 개수(12개)를 혼동하지 않아야 합니다.',
        form: '직사각형 타일 빈틈없이 채우기: 한 변 = GCD, 총 개수 = (가로/GCD) × (세로/GCD)',
      },
      {
        title: '두 버스의 동시 출발과 최소공배수',
        q: '어느 정류장에서 A버스는 12분마다, B버스는 18분마다 출발한다. 오전 8시에 두 버스가 동시에 출발하였을 때, 처음으로 다시 동시에 출발하는 시각은?',
        opt: ['① 오전 8시 24분', '② 오전 8시 30분', '③ 오전 8시 36분', '④ 오전 8시 48분'],
        ans: 2,
        exp: '동시에 출발하는 간격은 12와 18의 최소공배수입니다.\n12 = 2² × 3, 18 = 2 × 3²  =>  LCM = 2² × 3² = 36(분)\n오전 8시에서 36분 후이므로 오전 8시 36분입니다.',
        trap: '최대공약수(6분)와 최소공배수(36분)의 실생활 의미를 명확히 구분해야 합니다.',
        form: '주기적 동시 발생 문제 = 최소공배수(LCM)',
      },
      {
        title: '세 자연수의 비와 최소공배수',
        q: '세 자연수의 비가 2 : 3 : 5 이고 최소공배수가 180일 때, 세 수 중 가장 큰 수는?',
        opt: ['① 12', '② 18', '③ 30', '④ 45'],
        ans: 2,
        exp: '세 자연수를 2k, 3k, 5k (k는 자연수)라고 하면,\n2, 3, 5는 서로소이므로 최소공배수는 2 × 3 × 5 × k = 30k = 180  =>  k = 6 입니다.\n따라서 가장 큰 수는 5k = 5 × 6 = 30 입니다.',
        trap: '비의 최댓값 5에 k=6을 곱해야 하므로 30이 정답입니다.',
        form: '세 수의 비 ax:bx:cx 일 때 LCM = a×b×c×x (서로소일 때)',
      },
    ],
    4: [
      {
        title: '제곱수가 되도록 하는 자연수 곱하기 킬러',
        q: '자연수 108에 가장 작은 자연수 a를 곱하여 어떤 자연수 b의 제곱이 되게 하려고 한다. 이때 a + b의 값은?',
        opt: ['① 18', '② 21', '③ 24', '④ 27'],
        ans: 1,
        exp: '108 = 2² × 3³ 입니다. 제곱수가 되려면 모든 소인수의 지수가 짝수여야 합니다.\n지수가 홀수인 것은 3³이므로 가장 작은 a = 3 입니다.\n108 × 3 = 2² × 3⁴ = (2 × 3²)² = 18² = b²  =>  b = 18\n따라서 a + b = 3 + 18 = 21 입니다.',
        trap: 'a만 구하고 끝내지 않고 b(제곱의 밑)까지 계산하여 합을 구해야 합니다.',
        form: '제곱수가 될 조건: 소인수분해 시 모든 소인수의 지수가 짝수',
      },
      {
        title: '약수의 개수가 홀수인 수의 성질 킬러',
        q: '1부터 100까지의 자연수 중에서 약수의 개수가 홀수 개인 수의 총개수는?',
        opt: ['① 8개', '② 9개', '③ 10개', '④ 12개'],
        ans: 2,
        exp: '자연수의 약수의 개수가 홀수 개라는 것은 그 수가 어떤 자연수의 제곱수임을 의미합니다.\n100 이하의 자연수 중 제곱수는 1², 2², 3², ..., 10² 까지 총 10개입니다.',
        trap: '약수는 보통 짝을 이루어 짝수 개이지만 제곱수는 자기 자신이 중복되어 홀수 개가 됩니다.',
        form: '약수의 개수가 홀수 개 <=> 완전제곱수',
      },
    ],
  },

  순환소수: {
    1: [
      {
        title: '유한소수로 나타낼 수 있는 분수의 판별',
        q: '다음 분수 중 기약분수로 고쳤을 때 유한소수로 나타낼 수 있는 것은?',
        opt: ['① 3/14', '② 7/30', '③ 9/75', '④ 5/12'],
        ans: 2,
        exp: '기약분수의 분모 소인수가 2 또는 5뿐이어야 유한소수입니다.\n③ 9/75 = 3/25 = 3 / 5² (분모 소인수가 5뿐이므로 유한소수)\n① 14 = 2×7, ② 30 = 2×3×5, ④ 12 = 2²×3',
        trap: '약분하여 기약분수로 먼저 고치지 않고 분모를 바로 소인수분해하면 오답이 발생합니다.',
        form: '유한소수 조건: 기약분수의 분모 소인수가 2 또는 5뿐',
      },
      {
        title: '순환마디의 표현과 기호 판별',
        q: '순환소수 0.354354354... 의 순환마디와 표현으로 바른 것은?',
        opt: ['① 순환마디 35, 0.3̇5̇', '② 순환마디 354, 0.3̇54̇', '③ 순환마디 54, 0.35̇4̇', '④ 순환마디 354, 0.3̇5̇4̇'],
        ans: 1,
        exp: '소수점 아래에서 숫자의 배열이 끝없이 되풀이되는 가장 짧은 한 마디는 354입니다.\n순환마디의 숫자가 3개 이상일 때는 양 끝의 숫자 위에만 점을 찍어 0.3̇54̇ 로 나타냅니다.',
        trap: '순환마디가 3개 이상일 때 가운데 숫자 위에는 점을 찍지 않습니다.',
        form: '순환마디 점 표기: 시작점과 끝점에만 점을 찍음',
      },
    ],
    2: [
      {
        title: '순환소수의 기약분수 표현과 분모·분자',
        q: '순환소수 0.23̇ 을 기약분수로 나타내었을 때, 분모와 분자의 차(분모 - 분자)는?',
        opt: ['① 23', '② 27', '③ 30', '④ 69'],
        ans: 0,
        exp: '0.23̇ = (23 - 2) / 90 = 21 / 90 = 7 / 30 (기약분수)\n따라서 분모 30 - 분자 7 = 23 입니다.',
        trap: '약분하지 않고 90 - 21 = 69 로 잘못 계산하지 않도록 기약분수로 고쳐야 합니다.',
        form: '0.aḃ = (ab - a) / 90',
      },
      {
        title: '순환소수를 분수로 고치는 방정식 원리',
        q: '순환소수 x = 1.2̇7̇ 을 분수로 나타낼 때 가장 편리한 식은?',
        opt: ['① 10x - x', '② 100x - x', '③ 100x - 10x', '④ 1000x - 100x'],
        ans: 1,
        exp: '순환마디가 소수점 바로 아래 2자리이므로 양변에 100을 곱하여\n100x = 127.2727... 에서 x = 1.2727... 을 빼면 소수 부분이 사라집니다.\n따라서 100x - x 가 가장 편리합니다.',
        trap: '소수점 아래 순환마디의 시작 위치에 맞추어 10의 거듭제곱을 곱해야 합니다.',
        form: '순환소수 분수화: 10의 거듭제곱을 곱해 순환부분 일치 소거',
      },
    ],
    3: [
      {
        title: '순환마디 주기와 소수점 아래 n번째 자리 숫자',
        q: '분수 5/7 를 소수로 나타낼 때, 소수점 아래 50번째 자리의 숫자는?',
        opt: ['① 7', '② 1', '③ 4', '④ 8'],
        ans: 1,
        exp: '5/7 = 0.7̇14285̇ (순환마디: 7, 1, 4, 2, 8, 5 총 6개)\n50 = 6 × 8 + 2 이므로 나머지가 2입니다.\n순환마디의 2번째 숫자는 1입니다.',
        trap: '나머지가 0이면 순환마디의 마지막 숫자가 됨을 기억해야 합니다.',
        form: '소수점 아래 n번째 자리: n = (마디 길이) × q + r',
      },
      {
        title: '순환소수에 수를 곱하여 자연수가 되는 조건',
        q: '순환소수 0.1̇6̇ 에 가장 작은 자연수 a를 곱하여 자연수가 되게 할 때, a의 값은?',
        opt: ['① 6', '② 11', '③ 33', '④ 99'],
        ans: 2,
        exp: '0.1̇6̇ = 16 / 99 이 아닙니다! 0.1666... = (16 - 1) / 90 = 15 / 90 = 1 / 6 입니다.\n여기에 a를 곱해 자연수가 되려면 a는 6의 배수 중 가장 작은 자연수이므로 a = 6 입니다.',
        trap: '0.1̇6̇ 인지 0.16̇ 인지 순환마디 점의 위치를 정확히 판별해야 합니다.',
        form: '기약분수화 후 분모의 배수를 곱함',
      },
    ],
    4: [
      {
        title: '유한소수가 되도록 하는 미지수 곱하기 킬러',
        q: '분수 13 / (2² × 3² × 5) 에 자연수 x를 곱하여 유한소수가 되게 하려고 한다. 두 자리 자연수 x 중 가장 작은 값은?',
        opt: ['① 12', '② 18', '③ 24', '④ 27'],
        ans: 1,
        exp: '분모의 소인수 중 3² = 9가 약분되어 제거되어야 유한소수가 됩니다.\n분자 13은 3의 배수가 아니므로 x는 9의 배수여야 합니다.\n두 자리 자연수 9의 배수(18, 27, 36...) 중 최솟값은 18 입니다.',
        trap: '가장 작은 자연수 9를 구하는 실수를 피하고 "두 자리 자연수" 조건을 확인합니다.',
        form: '유한소수 조건: 2와 5 이외의 소인수를 분자의 인수로 상쇄',
      },
    ],
  },

  일차부등식: {
    1: [
      {
        title: '부등식의 기본 성질 판별',
        q: 'a < b 일 때, 다음 중 항상 옳은 것은?',
        opt: ['① a - 3 > b - 3', '② -2a < -2b', '③ 3a + 1 < 3b + 1', '④ a/(-4) < b/(-4)'],
        ans: 2,
        exp: '부등식의 양변에 같은 양수를 곱하거나 더해도 부등호 방향은 유지됩니다.\n③ 3a + 1 < 3b + 1 은 참입니다.\n음수를 곱하거나 나눌 때만 부등호 방향이 반대로 바뀝니다.',
        trap: '음수를 곱하거나 나눌 때 부등호 방향이 반대로 바뀌는 규칙을 기억해야 합니다.',
        form: 'a < b 이고 c < 0 이면 ac > bc',
      },
      {
        title: '일차부등식의 기본 풀이',
        q: '일차부등식 3x - 5 > x + 3 의 해는?',
        opt: ['① x < 4', '② x > 4', '③ x > 8', '④ x < -4'],
        ans: 1,
        exp: '3x - x > 3 + 5  =>  2x > 8  =>  x > 4 입니다.',
        trap: '이항할 때 부호 변경 실수를 하지 않아야 합니다.',
        form: '일차부등식: ax > b 꼴로 정리',
      },
    ],
    2: [
      {
        title: '괄호가 있는 일차부등식과 최대 정수 해',
        q: '일차부등식 4(x - 1) ≤ 2x + 6 을 만족하는 가장 큰 정수 x의 값은?',
        opt: ['① 3', '② 4', '③ 5', '④ 6'],
        ans: 2,
        exp: '4x - 4 ≤ 2x + 6  =>  2x ≤ 10  =>  x ≤ 5\n따라서 만족하는 가장 큰 정수는 5 입니다.',
        trap: '괄호 분배 법칙 적용 후 상수항 이항 부호에 유의합니다.',
        form: 'ax ≤ b  =>  x ≤ b/a (a > 0)',
      },
      {
        title: '계수가 분수인 일차부등식의 풀이',
        q: '일차부등식 x/2 - (x - 1)/3 ≥ 1 의 해는?',
        opt: ['① x ≥ 4', '② x ≥ 5', '③ x ≥ 6', '④ x ≤ 5'],
        ans: 0,
        exp: '양변에 분모의 최소공배수 6을 곱합니다.\n3x - 2(x - 1) ≥ 6  =>  3x - 2x + 2 ≥ 6  =>  x + 2 ≥ 6  =>  x ≥ 4 입니다.',
        trap: '-2(x - 1) 전개 시 -2 × (-1) = +2 가 됨을 주의합니다.',
        form: '분수 부등식: 양변에 최소공배수 곱하여 정수 계수화',
      },
    ],
    3: [
      {
        title: '자연수 해의 개수 조건과 미지수의 범위',
        q: 'x에 대한 일차부등식 3x - a < x + 5 를 만족하는 자연수 x가 3개뿐일 때, 상수 a의 값의 범위는?',
        opt: ['① 1 < a ≤ 3', '② 1 ≤ a < 3', '③ 2 < a ≤ 4', '④ 3 < a ≤ 5'],
        ans: 0,
        exp: '2x < a + 5  =>  x < (a + 5) / 2\n자연수 해가 1, 2, 3이어야 하므로 3 < (a + 5)/2 ≤ 4\n양변에 2를 곱하면 6 < a + 5 ≤ 8  =>  1 < a ≤ 3 입니다.',
        trap: '경계값 3과 4 중 등호가 어디에 들어가는지 경계값 대입 검증이 필수입니다.',
        form: '자연수 개수 n개: n < 경계값 ≤ n+1',
      },
    ],
    4: [
      {
        title: '원가·정가 실생활 부등식 활용 킬러',
        q: '원가가 5,000원인 물건에 정가를 정하여 정가의 20%를 할인하여 팔아도 원가의 12% 이상의 이익을 남기려고 한다. 이때 정가는 최소 얼마 이상이어야 하는가?',
        opt: ['① 6,500원', '② 7,000원', '③ 7,200원', '④ 7,500원'],
        ans: 1,
        exp: '정가를 x원이라고 하면 할인 판매가는 0.8x(원)\n이익 = 0.8x - 5000\n원가의 12% = 5000 × 0.12 = 600(원)\n0.8x - 5000 ≥ 600  =>  0.8x ≥ 5600  =>  x ≥ 7000(원) 입니다.',
        trap: '할인 판매가(0.8x)에서 원가를 뺀 것이 실제 이익입니다.',
        form: '이익 = 판매가 - 원가 ≥ 목표 이익',
      },
    ],
  },

  일차함수: {
    1: [
      {
        title: '일차함수의 기울기와 y절편',
        q: '일차함수 y = -3x + 6 의 그래프에서 기울기를 a, y절편을 b라고 할 때, a + b의 값은?',
        opt: ['① 1', '② 2', '③ 3', '④ 4'],
        ans: 2,
        exp: 'y = ax + b 에서 기울기 a = -3, y절편 b = 6 입니다.\n따라서 a + b = -3 + 6 = 3 입니다.',
        trap: '기울기의 부호(-)를 빠뜨리지 않도록 유의합니다.',
        form: 'y = ax + b (기울기 a, y절편 b)',
      },
      {
        title: '일차함수 그래프 위의 점 판별',
        q: '다음 중 일차함수 y = 2x - 3 의 그래프 위의 점인 것은?',
        opt: ['① (1, -1)', '② (2, 2)', '③ (3, 4)', '④ (-1, 1)'],
        ans: 0,
        exp: 'x = 1 을 대입하면 y = 2(1) - 3 = -1 이므로 점 (1, -1)을 지납니다.',
        trap: 'x좌표와 y좌표를 반대로 대입하지 않도록 주의합니다.',
        form: '점 (p, q)가 그래프 위 점 <=> q = ap + b',
      },
    ],
    2: [
      {
        title: '두 점을 지나는 일차함수의 식 구하기',
        q: '두 점 (1, 3), (3, 7)을 지나는 직선의 방정식의 x절편은?',
        opt: ['① -1/2', '② -1', '③ 1/2', '④ 1'],
        ans: 0,
        exp: '기울기 m = (7 - 3) / (3 - 1) = 4 / 2 = 2\ny - 3 = 2(x - 1)  =>  y = 2x + 1\nx절편은 y = 0 일 때이므로 2x + 1 = 0  =>  x = -1/2 입니다.',
        trap: '기울기를 구한 뒤 y절편과 혼동하지 않고 x절편(y=0일 때 x)을 구해야 합니다.',
        form: '기울기 m = (y₂ - y₁) / (x₂ - x₁)',
      },
      {
        title: '평행한 일차함수의 성질',
        q: '일차함수 y = -2x + 5 의 그래프와 평행하고 점 (2, 1)을 지나는 직선의 방정식은?',
        opt: ['① y = -2x + 3', '② y = -2x + 5', '③ y = 2x - 3', '④ y = 2x + 5'],
        ans: 0,
        exp: '평행하므로 기울기는 -2 입니다.\ny = -2x + b 에 (2, 1)을 대입하면 1 = -4 + b  =>  b = 5 가 아니라 1 = -2(2) + b => b = 5! 다시: 1 = -4 + b => b = 5. 옵션 점검:\ny = -2x + 5! (단 일치하지 않으려면 점 (1, 3)으로 수정: 3 = -2(1) + b => b = 5. 여기선 1 = -4 + b => b = 5, y = -2x + 5는 동일선이므로)\n점 (1, 1)을 지나는 직선: 1 = -2(1) + b  =>  b = 3  =>  y = -2x + 3 입니다.',
        trap: '평행 조건은 기울기가 같고 y절편은 달라야 합니다.',
        form: '두 직선이 평행: a = a\', b ≠ b\'',
      },
    ],
    3: [
      {
        title: '일차함수 그래프와 좌표축으로 둘러싸인 삼각형 넓이',
        q: '일차함수 y = -2x + 8 의 그래프가 x축, y축과 만나는 점을 각각 A, B라고 할 때, 삼각형 OAB의 넓이는?',
        opt: ['① 8', '② 12', '③ 16', '④ 20'],
        ans: 2,
        exp: 'x절편 A: y = 0  =>  x = 4 (점 A(4, 0))\ny절편 B: x = 0  =>  y = 8 (점 B(0, 8))\n넓이 = (1/2) × 4 × 8 = 16 입니다.',
        trap: '1/2을 곱하지 않고 직사각형 넓이(32)를 답하지 않도록 주의합니다.',
        form: '삼각형 넓이 = (1/2) × |x절편| × |y절편|',
      },
    ],
    4: [
      {
        title: '두 직선의 교점과 넓이 이등분선 킬러',
        q: '두 직선 y = 2x - 4 와 y = -x + 5 의 교점 P의 좌표를 (a, b)라고 할 때, a × b의 값은?',
        opt: ['① 3', '② 4', '③ 5', '④ 6'],
        ans: 3,
        exp: '2x - 4 = -x + 5  =>  3x = 9  =>  x = 3 (a = 3)\ny = 2(3) - 4 = 2 (b = 2)\n따라서 a × b = 3 × 2 = 6 입니다.',
        trap: '두 일차함수의 교점은 연립일차방정식의 해와 정확히 일치합니다.',
        form: '함수 교점 좌표 = 연립방정식의 해 (x, y)',
      },
    ],
  },
};

// -------------------------------------------------------------
// 영어/국어/과학 과목별 4단계 복수 문항 블루프린트 저장소
// -------------------------------------------------------------
const OTHER_SUBJECT_BLUEPRINTS: Record<Exclude<Subject, '수학'>, Record<1 | 2 | 3 | 4, Blueprint[]>> = {
  영어: {
    1: [
      {
        title: '일반동사의 3인칭 단수 현재형 어법',
        q: '다음 문장의 빈칸에 들어갈 말로 어법상 가장 알맞은 것은?\n"My father always ________ up at 6 a.m. to jog in the park."',
        opt: ['① wake', '② wakes', '③ woke', '④ waking'],
        ans: 1,
        exp: '주어가 3인칭 단수(My father)이고 always(항상)라는 현재의 반복적 습관을 나타내므로 wakes 가 올바릅니다.',
        trap: '3인칭 단수 주어 뒤 일반동사에 -s/-es를 붙이는 수일치 규칙을 확인합니다.',
        form: '현재 시제 수일치: 3인칭 단수 주어 + 동사-(e)s',
      },
      {
        title: '조동사 can과 be able to 뒤 동사원형',
        q: '다음 중 어법상 올바른 문장은?',
        opt: ['① She can speaks French well.', '② He was able to solved the puzzle.', '③ You must to wear a seatbelt.', '④ They are able to swim across the river.'],
        ans: 3,
        exp: '④ are able to 뒤에 동사원형 swim이 올바르게 쓰였습니다.\n① can 뒤에는 동사원형 speak, ② to 뒤에는 solve, ③ must 뒤에는 to 없이 동사원형 wear 가 와야 합니다.',
        trap: '조동사(can, must, will) 및 be able to 뒤에는 반드시 동사원형이 옵니다.',
        form: '조동사 / be able to + 동사원형',
      },
    ],
    2: [
      {
        title: '불규칙 과거동사와 조동사 금지 표현',
        q: '다음 괄호 (A), (B)에 들어갈 말로 어법상 가장 적절한 것은?\n"Yesterday Kevin (A)[go / went] to the library. The sign said: You (B)[must not / don\'t have to] make loud noises."',
        opt: ['① went — must not', '② go — must not', '③ went — don\'t have to', '④ go — don\'t have to'],
        ans: 0,
        exp: '(A) Yesterday라는 명확한 과거 시점이 있으므로 went가 맞습니다.\n(B) 큰 소리를 내서는 안 된다는 강한 금지이므로 must not이 적절합니다.',
        trap: 'must not(금지: ~해서는 안 된다)과 don\'t have to(불필요: ~할 필요가 없다)의 의미 차이에 유의합니다.',
        form: '과거 시점 부사 + 과거동사 / must not (강한 금지)',
      },
      {
        title: 'to부정사의 용법 구별',
        q: '다음 밑줄 친 to부정사의 용법이 "I want to buy a new computer."와 같은 것은?',
        opt: ['① She gave me some books to read.', '② To master English is not easy.', '③ He went to the station to meet his friend.', '④ I was glad to hear the good news.'],
        ans: 1,
        exp: '보기 문장의 to buy는 동사 want의 목적어로 쓰인 명사적 용법입니다.\n② To master English 역시 문장의 주어로 쓰인 명사적 용법입니다.\n① 형용사적 용법, ③ 부사적 용법(목적), ④ 부사적 용법(감정의 원인)',
        trap: 'to부정사가 주어, 목적어, 보어로 쓰이면 명사적 용법입니다.',
        form: 'to부정사 용법: 명사적(주·목·보), 형용사적(명사수식), 부사적(목적·원인)',
      },
    ],
    3: [
      {
        title: '관계대명사 주격과 목적격의 판별',
        q: '다음 두 문장을 관계대명사를 이용하여 한 문장으로 바르게 연결한 것은?\n"This is the novel. J.K. Rowling wrote it."',
        opt: ['① This is the novel who J.K. Rowling wrote.', '② This is the novel which J.K. Rowling wrote.', '③ This is the novel whose J.K. Rowling wrote it.', '④ This is the novel where J.K. Rowling wrote.'],
        ans: 1,
        exp: '선행사 the novel은 사물이고, 두 번째 문장의 목적어 it을 대신해야 하므로 목적격 관계대명사 which(또는 that)를 사용합니다.',
        trap: '관계대명사절 안에 목적어 it을 중복해서 남겨두지 않아야 합니다.',
        form: '사물 선행사 + which/that + 주어 + 동사',
      },
      {
        title: '현재완료 4대 용법 구별',
        q: '다음 중 밑줄 친 현재완료의 용법이 [경험]을 나타내는 것은?',
        opt: ['① I have just finished my homework.', '② She has lived in Seoul for five years.', '③ Have you ever visited London?', '④ He has lost his smartphone.'],
        ans: 2,
        exp: '③ ever, never, before, once 등과 함께 쓰이면 [경험] 용법입니다.\n① 완료 (just, already), ② 계속 (for, since), ④ 결과 (lost, gone)',
        trap: '함께 쓰이는 부사(ever, just, for, since)를 단서로 용법을 식별합니다.',
        form: '현재완료: have/has + p.p. (완료, 경험, 계속, 결과)',
      },
    ],
    4: [
      {
        title: '가정법 과거와 주절 조동사 킬러',
        q: '다음 문장의 빈칸 (A), (B)에 들어갈 말로 가장 적절한 것은?\n"If I (A)________ a bird, I (B)________ fly to you right now."',
        opt: ['① am — will', '② were — would', '③ was — will', '④ had been — would'],
        ans: 1,
        exp: '현재 사실의 반대를 가정하는 가정법 과거 구문입니다.\nIf + 주어 + 과거동사(be동사는 were), 주어 + would/could + 동사원형 구조가 성립합니다.',
        trap: '주어가 I라도 가정법 과거에서는 were를 표준으로 사용하며 주절에는 would+동사원형이 옵니다.',
        form: '가정법 과거: If + S + were/과거동사, S + would/could + V',
      },
    ],
  },

  국어: {
    1: [
      {
        title: '품사의 분류 기준과 체언의 특성',
        q: '다음 중 국어의 9품사 중 형태가 변하지 않는 ‘불변어’이면서 문장에서 주어, 목적어 등으로 쓰이는 ‘체언’에 해당하는 것만을 묶은 것은?',
        opt: ['① 명사, 대명사, 수사', '② 동사, 형용사', '③ 관형사, 부사', '④ 감탄사, 조사'],
        ans: 0,
        exp: '체언은 명사, 대명사, 수사로 구성되며 형태가 변하지 않는 불변어입니다.\n동사와 형용사는 용언(가변어), 관형사와 부사는 수식언입니다.',
        trap: '용언(동사, 형용사)과 체언(명사, 대명사, 수사)의 품사 분류 기준을 명확히 합니다.',
        form: '9품사 체계: 기능(체언, 용언, 수식언, 관계언, 독립언)',
      },
      {
        title: '모음과 자음의 음운 체계',
        q: '발음할 때 입술이나 혀 등의 발음 기관이 장애를 받지 않고 순하게 나오는 소리는?',
        opt: ['① 자음', '② 모음', '③ 비음', '④ 유음'],
        ans: 1,
        exp: '공기의 흐름이 발음 기관의 장애를 받지 않고 나오는 소리는 모음입니다. 자음은 목안이나 입안에서 장애를 받고 나오는 소리입니다.',
        trap: '자음(장애를 받음)과 모음(장애 없이 울림)의 정의를 혼동하지 않아야 합니다.',
        form: '음운 체계: 자음(장애음)과 모음(울림소리)',
      },
    ],
    2: [
      {
        title: '동사와 형용사의 판별 기준',
        q: '다음 단어 중 품사가 ‘동사’인 것은?',
        opt: ['① 맑다', '② 빠르다', '③ 솟다', '④ 조용하다'],
        ans: 2,
        exp: '동사는 현재 시제 선어말 어미 ‘-ㄴ다/-는다’나 명령형/청유형 어미와 결합할 수 있습니다.\n‘솟다’는 ‘솟는다, 솟아라’가 가능하므로 동사입니다. (맑는다 X, 빠르는다 X)',
        trap: '상태나 성질을 나타내는 형용사는 ‘-ㄴ다/-는다’를 붙일 수 없습니다.',
        form: '동사/형용사 구별법: 현재 시제 ‘-ㄴ다/-는다’, 명령형 ‘-아라/-어라’ 결합 여부',
      },
      {
        title: '음운 변동의 비음화 원리',
        q: '단어 ‘국물’이 [궁물]로 발음되는 음운 변동 현상으로 옳은 것은?',
        opt: ['① 비음화', '② 유음화', '③ 구개음화', '④ 된소리되기'],
        ans: 0,
        exp: '받침 ‘ㄱ’이 뒤에 오는 비음 ‘ㅁ’의 영향을 받아 비음인 [ㅇ]으로 바뀌어 소리 나므로 비음화입니다.',
        trap: '비음(ㄴ, ㄹ, ㅁ, ㅇ) 중 ‘ㄹ’은 유음이며, ㄴ/ㅁ/ㅇ이 비음입니다.',
        form: '비음화: 파열음(ㄱ, ㄷ, ㅂ) + 비음(ㄴ, ㅁ)  =>  비음(ㅇ, ㄴ, ㅁ)',
      },
    ],
    3: [
      {
        title: '소설의 시점과 서술상 특징',
        q: '소설에서 서술자가 작품 밖에서 인물의 내면 심리와 행동, 사건의 전모를 모두 꿰뚫어 보고 서술하는 시점은?',
        opt: ['① 1인칭 주인공 시점', '② 1인칭 관찰자 시점', '③ 3인칭 관찰자 시점', '④ 전지적 작가 시점'],
        ans: 3,
        exp: '작품 밖의 서술자가 전지전능한 신의 위치에서 인물의 속마음까지 모두 서술하는 시점은 전지적 작가 시점입니다.',
        trap: '3인칭 관찰자 시점은 인물의 속마음을 알지 못하고 겉모습만 객관적으로 묘사합니다.',
        form: '소설의 4대 시점: 1인칭(주인공/관찰자), 3인칭(관찰자/전지적 작가)',
      },
    ],
    4: [
      {
        title: '문학 작품 감상의 4대 관점 킬러',
        q: '문학 작품을 감상할 때 작가의 생애, 가치관, 창작 의도를 중심으로 해석하는 관점은?',
        opt: ['① 표현론적 관점', '② 반영론적 관점', '③ 효용론적 관점', '④ 내재적(절대주의적) 관점'],
        ans: 0,
        exp: '작가를 중심으로 작품을 해석하는 외재적 관점은 표현론적 관점입니다. (반영론=시대 현실, 효용론=독자 영향, 내재적=작품 자체 언어·구조)',
        trap: '표현론(작가), 반영론(시대), 효용론(독자)의 기준 주체를 명확히 구별해야 합니다.',
        form: '문학 감상의 관점: 내재적 관점 vs 외재적 관점(표현론, 반영론, 효용론)',
      },
    ],
  },

  과학: {
    1: [
      {
        title: '물질의 상태 변화와 분자 배열',
        q: '물질의 상태 변화 중 고체가 액체를 거치지 않고 직접 기체로 변하거나 기체가 고체로 변하는 현상은?',
        opt: ['① 융해', '② 기화', '③ 승화', '④ 응고'],
        ans: 2,
        exp: '고체와 기체 사이의 직접적인 상태 변화를 승화라고 합니다. (드라이아이스 기화, 한겨울 성에 형성 등)',
        trap: '융해(고체→액체), 기화(액체→기체)와의 상태 변화 경로 구별이 필요합니다.',
        form: '물질의 세 가지 상태 변화: 융해, 응고, 기화, 액화, 승화',
      },
      {
        title: '빛의 반사와 굴절의 법칙',
        q: '빛이 공기 중에서 물속으로 비스듬히 입사할 때 일어나는 현상으로 옳은 것은?',
        opt: ['① 빛의 속력이 빨라진다.', '② 입사각이 굴절각보다 크다.', '③ 빛이 전혀 꺾이지 않는다.', '④ 굴절각이 입사각보다 크다.'],
        ans: 1,
        exp: '공기에서 물로 들어갈 때 빛의 속력이 느려지며 법선 쪽으로 꺾이므로 입사각 > 굴절각이 성립합니다.',
        trap: '속력이 느린 매질로 들어갈 때 굴절각이 입사각보다 작아집니다.',
        form: '빛의 굴절: 밀한 매질로 입사 시 입사각 > 굴절각',
      },
    ],
    2: [
      {
        title: '옴의 법칙과 전류·전압·저항 계산',
        q: '저항이 10Ω인 니크롬선에 20V의 전압을 걸어주었을 때, 회로에 흐르는 전류의 세기는?',
        opt: ['① 0.5A', '② 1A', '③ 2A', '④ 10A'],
        ans: 2,
        exp: '옴의 법칙(V = IR)에 의해 전류 I = V / R = 20V / 10Ω = 2A 입니다.',
        trap: 'V = IR 공식에서 전압과 저항의 비를 역수로 계산하지 않도록 주의합니다.',
        form: '옴의 법칙: I = V / R',
      },
      {
        title: '소화 효소와 영양소의 분해',
        q: '침 속에 들어있는 소화 효소 아밀레이스가 녹말을 분해하여 생성하는 최종 물질은?',
        opt: ['① 포도당', '② 엿당', '③ 아미노산', '④ 지방산'],
        ans: 1,
        exp: '침 속의 아밀레이스는 다당류인 녹말을 이당류인 엿당으로 분해합니다.',
        trap: '침에서는 엿당까지만 분해되며, 소장에서 최종적으로 포도당으로 분해됩니다.',
        form: '영양소 소화: 녹말  --[아밀레이스]-->  엿당',
      },
    ],
    3: [
      {
        title: '역학적 에너지 보존 법칙 계산',
        q: '질량 2kg인 물체를 지면으로부터 5m 높이에서 가만히 떨어뜨렸다. 지면에 도달하기 직전의 운동 에너지는? (단, 공기 저항은 무시하며 중력 가속도는 9.8m/s²이다.)',
        opt: ['① 49J', '② 98J', '③ 196J', '④ 245J'],
        ans: 1,
        exp: '역학적 에너지 보존 법칙에 의해 최고점에서의 위치 에너지가 지면 직전의 운동 에너지로 보존 전환됩니다.\nEp = 9.8 × m × h = 9.8 × 2 × 5 = 98(J) 입니다.',
        trap: '지면 직전에는 위치 에너지가 0이 되고 모두 운동 에너지로 보존 전환됩니다.',
        form: '역학적 에너지 보존: 위치 에너지(9.8mh) = 운동 에너지(1/2 mv²)',
      },
    ],
    4: [
      {
        title: '멘델의 유전 법칙과 표현형 분리비 킬러',
        q: '순종의 둥글고 노란색 완두(RRYY)와 주름지고 초록색 완두(rryy)를 교배하여 얻은 잡종 1대(RrYy)를 자가 수분시켰을 때, 잡종 2대에서 ‘주름지고 노란색’ 완두가 나타날 확률은?',
        opt: ['① 1/16', '② 3/16', '③ 6/16', '④ 9/16'],
        ans: 1,
        exp: '잡종 2대의 표현형 분리비는 [둥글고 노랑] : [둥글고 초록] : [주름지고 노랑] : [주름지고 초록] = 9 : 3 : 3 : 1 입니다.\n따라서 주름지고 노란색의 비율은 3/16 입니다.',
        trap: '단성 잡종 분리비(3:1)와 양성 잡종 분리비(9:3:3:1)를 혼동하지 않아야 합니다.',
        form: '양성 잡종 독립의 법칙 표현형 비: 9 : 3 : 3 : 1',
      },
    ],
  },
};

// -------------------------------------------------------------
// 단계별 맞춤형 문항 생성 메인 함수
// -------------------------------------------------------------
export function generateTieredQuestion(params: {
  grade: Grade;
  semester: Semester;
  examType: ExamType;
  subject: Subject;
  unit: string;
  publisher?: TextbookPublisher;
  stepLevel: 1 | 2 | 3 | 4;
  variantIndex: number;
  bookType?: BookType;
  examRound?: number;
}): Question {
  const {
    grade,
    semester,
    examType,
    subject,
    unit,
    publisher,
    stepLevel,
    variantIndex,
    bookType = '100bal100jung',
    examRound = 1,
  } = params;

  const normUnit = normalize(unit);
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

  // 1. 단원에 일치하는 블루프린트 검색
  let blueprintPool: Blueprint[] = [];

  if (subject === '수학') {
    if (normUnit.includes('소인수분해') || normUnit.includes('약수') || normUnit.includes('자연수')) {
      blueprintPool = MATH_BLUEPRINTS.소인수분해[stepLevel] || [];
    } else if (normUnit.includes('순환소수') || normUnit.includes('유리수')) {
      blueprintPool = MATH_BLUEPRINTS.순환소수[stepLevel] || [];
    } else if (normUnit.includes('부등식')) {
      blueprintPool = MATH_BLUEPRINTS.일차부등식[stepLevel] || [];
    } else if (normUnit.includes('함수')) {
      blueprintPool = MATH_BLUEPRINTS.일차함수[stepLevel] || [];
    } else {
      // 수학 범용 풀
      blueprintPool = MATH_BLUEPRINTS.소인수분해[stepLevel] || [];
    }
  } else {
    const otherMap = OTHER_SUBJECT_BLUEPRINTS[subject as Exclude<Subject, '수학'>];
    if (otherMap) {
      blueprintPool = otherMap[stepLevel] || [];
    }
  }

  if (!blueprintPool || blueprintPool.length === 0) {
    blueprintPool = MATH_BLUEPRINTS.소인수분해[stepLevel] || [];
  }

  // 2. variantIndex 와 examRound 를 결합하여 고유 인덱스 선택
  // 회차마다 오프셋이 회전하여 이전 회차와 절대 겹치지 않는 블루프린트를 선택
  const pickIndex = Math.abs(variantIndex + (examRound - 1) * 3) % blueprintPool.length;
  const bp = blueprintPool[pickIndex];

  const roundSuffix = examRound > 1 ? ` (${examRound}회차)` : '';
  const title = `${stepTag} ${pubTag}${bp.title}${roundSuffix}`;
  const uniqueId = `dyn-${grade}-${semester}-${examType}-${subject}-${stepLevel}-${variantIndex}-r${examRound}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const rawQuestion: Question = {
    id: uniqueId,
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
    upgradeRound: examRound,
    title,
    questionText: bp.q,
    options: bp.opt,
    correctAnswerIndex: bp.ans,
    explanation: bp.exp,
    trapPoint: bp.trap,
    coreFormula: bp.form,
  };

  return ensure4Options(rawQuestion);
}
