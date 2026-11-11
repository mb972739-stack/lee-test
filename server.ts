import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini Client with required User-Agent
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Similar questions generator endpoint
app.post('/api/generate-similar-questions', async (req: Request, res: Response) => {
  try {
    const {
      originalQuestion,
      subject = '수학',
      grade = '중2',
      unit = '방정식과 부등식',
      difficulty = '블랙라벨_스텝2_종합사고',
      bookType = 'blacklabel',
      count = 2,
    } = req.body;

    const bookGuide = bookType === 'blacklabel'
      ? '블랙라벨(BLACK LABEL) 수학 스타일: 내신 1등급 변별력을 위한 최고난도 심화 문항. 단순 공식 대입이 아닌 다단계 종합 사고력, 조건 분석, 미지수 2개 이상 복합 추론 또는 기하와 대수의 융합이 필요한 킬러 문항 스타일.'
      : '에듀원 100발100중(100BAL 100JUNG) 수학 스타일: 학교 중간/기말고사 100점 만점을 겨냥한 전국 중학교 기출 빈출 유형. 실전 내신 표준 및 교과서 심화 핵심 유형을 완벽히 다지는 정교한 실전문항.';

    if (!ai) {
      // Fallback response if GEMINI_API_KEY is not configured
      return res.json({
        success: true,
        questions: [
          {
            id: `sim-${Date.now()}-1`,
            bookType: bookType || 'blacklabel',
            subject: subject,
            grade: grade,
            unit: unit,
            difficultyLabel: bookType === 'blacklabel' ? '블랙라벨 Step 2 종합사고' : '100발100중 실전 기출',
            title: `[${bookType === 'blacklabel' ? '블랙라벨 심화변형' : '100발100중 기출변형'}] ${unit} 유사 발전 문제`,
            questionText: `${unit} 단원에서 출제된 오답 유형의 심화 발전 문제입니다.\n[문제] 조건에 맞는 미지수의 값을 구하고 조건을 만족하는 자연수 x의 최댓값을 구하시오.`,
            options: [
              '① 3',
              '② 5',
              '③ 7',
              '④ 9',
              '⑤ 12'
            ],
            correctAnswerIndex: 2,
            explanation: `[풀이]\n주어진 조건식을 정리하면 부등식 2x - 3 ≤ 11이 성립합니다.\n2x ≤ 14 이므로 x ≤ 7 입니다.\n따라서 조건을 만족하는 자연수 x의 최댓값은 7입니다.`,
            trapPoint: '등호 포함 여부(≤ 와 <)를 꼼꼼히 확인하지 않아 6 또는 8로 오답을 고르기 쉽습니다.',
            keyConcept: `${unit} 핵심 정리 및 조건 분기 사고력`,
            isGeneratedByAI: false,
          }
        ]
      });
    }

    const prompt = `당신은 대한민국 중학교 수학 전문 일타 강사이자 교재 집필위원(에듀원 100발100중 및 블랙라벨 전문)입니다.
학생이 오답을 낸 다음 문제와 단원을 바탕으로, 취약점을 완벽히 메우고 실력을 끌어올릴 수 있는 유사 변형 문제를 ${count}개 생성해 주세요.

[기준 교재 및 난이도 가이드]
${bookGuide}
- 목표 난이도: ${difficulty}
- 대상 학년: ${grade}
- 과목/단원: ${subject} / ${unit}
- 원본 오답 문제 요약:
"${originalQuestion || '기본 조건식과 미지수 활용 문제'}"

[요구사항]
1. 반드시 실제 한국 중학교 수학 교육과정(2022/2015 개정)에 정확히 부합하는 정통 중학 수학 문제를 출제하세요.
2. 5지선다 객관식(①~⑤)으로 보기를 제공하세요.
3. 정답 인덱스(0~4)와 명쾌하고 친절한 풀이 과정(explanation), 학생들이 자주 빠지는 함정(trapPoint), 핵심 개념 공식(keyConcept)을 포함하세요.
4. 난이도가 ${bookType === 'blacklabel' ? '블랙라벨 심화' : '100발100중 실전'}인 만큼, 계산 실수 유발점이 아닌 논리적 풀이 구조를 훌륭히 담아주세요.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: '대한민국 중학교 교육과정(에듀원 100발100중, 블랙라벨) 전문 출제 위원으로서 국립국어원 한글 맞춤법, 띄어쓰기 규정 및 정규 교과서 표준 어휘를 완벽히 준수하여 정교하고 수학적·논리적으로 오류가 없는 유사 변형 문제를 JSON 규격으로 반환합니다.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: '문제 소제목 (예: [블랙라벨 심화 킬러] 일차부등식의 활용)' },
              questionText: { type: Type.STRING, description: '중학생 눈높이에 맞춘 문제 지문 본문' },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '5지선다형 객관식 보기 5개 (예: ["① 4", "② 6", "③ 8", "④ 10", "⑤ 12"])'
              },
              correctAnswerIndex: { type: Type.INTEGER, description: '정답 보기 번호 인덱스 (0, 1, 2, 3, 4 중 하나)' },
              explanation: { type: Type.STRING, description: '단계별 정밀 풀이 해설' },
              trapPoint: { type: Type.STRING, description: '학생들이 흔히 착각하는 오답 함정' },
              keyConcept: { type: Type.STRING, description: '핵심 수학 공식 또는 정리' },
            },
            required: ['title', 'questionText', 'options', 'correctAnswerIndex', 'explanation', 'trapPoint', 'keyConcept'],
          },
        },
      },
    });

    const parsed = JSON.parse(response.text || '[]');
    const formatted = parsed.map((item: any, idx: number) => ({
      ...item,
      id: `ai-gen-${Date.now()}-${idx}`,
      bookType: bookType,
      subject: subject,
      grade: grade,
      unit: unit,
      difficultyLabel: bookType === 'blacklabel' ? '블랙라벨 1등급 심화' : '100발100중 실전기출',
      isGeneratedByAI: true,
    }));

    return res.json({ success: true, questions: formatted });
  } catch (error: any) {
    console.error('Error generating similar questions:', error);
    return res.status(500).json({
      success: false,
      error: error.message || '유사 문제 생성 중 오류가 발생했습니다.'
    });
  }
});

// AI Tutor detailed question clinic endpoint
app.post('/api/ai-tutor-explain', async (req: Request, res: Response) => {
  try {
    const { questionText, options, correctAnswer, myAnswer, subject = '수학', bookType = '100bal100jung' } = req.body;

    if (!ai) {
      return res.json({
        success: true,
        explanation: {
          tutorGreeting: "친구야 반가워! 이 문제는 100발100중 내신 시험에서도 단골로 출제되는 핵심 유형이야.",
          stepByStep: [
            "1단계: 먼저 구하고자 하는 미지수를 정확히 x로 정해봐.",
            "2단계: 문제에서 주어진 조건을 관계식(방정식 또는 부등식)으로 표현하자.",
            "3단계: 양변을 정리하고 이항 법칙을 조심스럽게 적용해."
          ],
          trapAnalysis: `네가 고른 ${myAnswer || '보기'}는 부호 처리나 마지막 단위 변환에서 자주 일어나는 대표적인 함정이었어!`,
          secretTip: "시험장에서 문제 끝의 '자연수', '정수', '이상/이하' 조건에 반드시 동그라미를 치는 습관을 들여봐!"
        }
      });
    }

    const prompt = `중학교 ${subject} 선생님으로서, 학생이 시험 중 틀린 문제를 아주 친절하고 명쾌하게 1:1 과외하듯이 해설해 주세요.
출제 교재 기준: ${bookType === 'blacklabel' ? '블랙라벨(최고난도 심화)' : '에듀원 100발100중(내신 실전)'}

[문제 내용]
${questionText}

[보기]
${(options || []).join('\n')}

[정답]: ${correctAnswer}
[학생이 고른 오답]: ${myAnswer || '미선택/오답'}

다음 4가지 구성으로 친절하게 설명해 주세요:
1. tutorGreeting: 따뜻한 격려와 함께 이 문제의 출제 의도 한 줄
2. stepByStep: 3~4단계로 나눈 명쾌한 풀이 과정 배열
3. trapAnalysis: 학생이 고른 오답에 빠진 이유와 실수 방지법
4. secretTip: 시험장에서 1초 만에 확인하는 꿀팁 & 핵심 공식`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: '대한민국 중학생의 자존감을 북돋아주고 수학적 사고력을 키워주는 최고의 친절한 AI 과외 선생님입니다.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tutorGreeting: { type: Type.STRING },
            stepByStep: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            trapAnalysis: { type: Type.STRING },
            secretTip: { type: Type.STRING }
          },
          required: ['tutorGreeting', 'stepByStep', 'trapAnalysis', 'secretTip']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, explanation: parsed });
  } catch (error: any) {
    console.error('AI Tutor explain error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || '해설 생성 중 오류가 발생했습니다.'
    });
  }
});

// Mount Vite or serve static files
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`StudyQuest Full-Stack Server running on port ${port}`);
  });
}

startServer();
