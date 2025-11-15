import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { QuizService } from '../quiz/quiz.service';

// AI 서비스에 전송할 데이터 형태
export interface WeaknessAnalysisRequest {
  userId: number;
  attempts: AttemptData[];
  statistics: {
    totalAttempts: number;
    correctCount: number;
    wrongCount: number;
    accuracyRate: number;
    wrongByChapter: Record<number, number>;
    wrongByType: Record<string, number>;
  };
}

export interface AttemptData {
  attemptId: number;
  quizId: number;
  chapterId: number;
  grade: number;
  questionType: string;
  questionText: string;
  correctAnswer: string;
  selectedAnswer: string;
  isCorrect: boolean;
  explanation: string;
  createdAt: string;
}

export interface WeaknessAnalysisResponse {
  weaknesses: Weakness[];
  recommendations: string[];
  overallScore: number;
  improvementAreas: string[];
}

export interface Weakness {
  category: string;
  chapterId: number;
  chapterName?: string;
  problemCount: number;
  accuracyRate: number;
  commonMistakes: string[];
  priority: 'high' | 'medium' | 'low';
}

@Injectable()
export class AiService {
  private readonly openai: OpenAI;

  constructor(
    private readonly quizService: QuizService,
    private readonly configService: ConfigService,
  ) {
    // OpenAI 클라이언트 초기화
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY가 설정되지 않았습니다.');
    }
    this.openai = new OpenAI({ apiKey });
  }

  /**
   * 유저의 풀이 내역을 가져와서 AI 분석 요청 형태로 변환
   */
  async prepareAnalysisData(childId: number): Promise<WeaknessAnalysisRequest> {
    // 1. 모든 풀이 내역 가져오기
    const attempts = await this.quizService.getAttempts(childId);

    if (attempts.length === 0) {
      throw new Error('풀이 내역이 없습니다.');
    }

    // 2. 문제 정보를 포함한 AttemptData 배열 생성
    const attemptDataList: AttemptData[] = [];

    for (const attempt of attempts) {
      // QuizAttempt에 question relation이 없으므로, quizId로 문제 정보 조회
      const question = await this.quizService.getQuestionById(attempt.quizId);
      
      if (!question) continue;

      const questionText =
        typeof question.question === 'string'
          ? question.question
          : (question.question as any)?.text || '';

      attemptDataList.push({
        attemptId: attempt.id,
        quizId: attempt.quizId,
        chapterId: question.chapterId,
        grade: question.grade,
        questionType: question.type,
        questionText,
        correctAnswer: question.answer,
        selectedAnswer: attempt.selectedChoice,
        isCorrect: attempt.isCorrect,
        explanation: question.explain,
        createdAt: attempt.createdAt.toISOString(),
      });
    }

    // 3. 통계 계산
    const statistics = this.calculateStatistics(attemptDataList);

    return {
      userId: childId,
      attempts: attemptDataList,
      statistics,
    };
  }

  /**
   * 통계 계산
   */
  private calculateStatistics(attempts: AttemptData[]) {
    const totalAttempts = attempts.length;
    const correctCount = attempts.filter((a) => a.isCorrect).length;
    const wrongCount = totalAttempts - correctCount;
    const accuracyRate = totalAttempts > 0 ? (correctCount / totalAttempts) * 100 : 0;

    // 챕터별 틀린 문제 수
    const wrongByChapter: Record<number, number> = {};
    attempts
      .filter((a) => !a.isCorrect)
      .forEach((a) => {
        wrongByChapter[a.chapterId] = (wrongByChapter[a.chapterId] || 0) + 1;
      });

    // 문제 유형별 틀린 문제 수
    const wrongByType: Record<string, number> = {};
    attempts
      .filter((a) => !a.isCorrect)
      .forEach((a) => {
        wrongByType[a.questionType] = (wrongByType[a.questionType] || 0) + 1;
      });

    return {
      totalAttempts,
      correctCount,
      wrongCount,
      accuracyRate: Math.round(accuracyRate * 100) / 100, // 소수점 2자리
      wrongByChapter,
      wrongByType,
    };
  }

  /**
   * AI 서비스에 약점 분석 요청 (OpenAI 직접 호출)
   */
  async analyzeWeakness(
    childId: number,
  ): Promise<WeaknessAnalysisResponse> {
    // 1. 데이터 준비
    const analysisData = await this.prepareAnalysisData(childId);

    const attempts = analysisData.attempts;
    const stats = analysisData.statistics;

    if (attempts.length === 0) {
      return {
        weaknesses: [],
        recommendations: ['풀이 내역이 없습니다. 문제를 풀어보세요!'],
        overallScore: 0.0,
        improvementAreas: [],
      };
    }

    // 2. OpenAI API 직접 호출
    try {
      const prompt = this.createAnalysisPrompt(attempts, stats);

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              '당신은 수학 교육 전문가입니다. 학생의 퀴즈 풀이 내역을 분석하여 약점을 파악하고 개인화된 학습 추천을 제공합니다. 응답은 반드시 JSON 형식으로 제공해야 합니다.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      });

      const resultJson = JSON.parse(
        response.choices[0].message.content || '{}',
      );

      return this.parseOpenAIResponse(resultJson, stats.accuracyRate);
    } catch (error) {
      // OpenAI API 호출 실패 시 기본 분석 결과 반환
      console.error('OpenAI API 호출 실패:', error);
      return this.generateFallbackAnalysis(attempts, stats);
    }
  }

  /**
   * OpenAI API에 전송할 프롬프트 생성
   */
  private createAnalysisPrompt(
    attempts: AttemptData[],
    stats: WeaknessAnalysisRequest['statistics'],
  ): string {
    // 틀린 문제만 필터링
    const wrongAttempts = attempts.filter((a) => !a.isCorrect);

    // 챕터별로 틀린 문제 그룹화
    const chapterWrongQuestions: Record<number, any[]> = {};
    for (const attempt of wrongAttempts) {
      const chapterId = attempt.chapterId;
      if (!chapterWrongQuestions[chapterId]) {
        chapterWrongQuestions[chapterId] = [];
      }

      // 문제 텍스트, 선택한 답, 정답만 포함 (해설 제외)
      chapterWrongQuestions[chapterId].push({
        question: attempt.questionText,
        selected: attempt.selectedAnswer,
        correct: attempt.correctAnswer,
      });
    }

    // 챕터별 통계 계산
    const chapterStats: Record<
      number,
      { total: number; correct: number; wrong: number }
    > = {};

    for (const attempt of attempts) {
      const chapterId = attempt.chapterId;
      if (!chapterStats[chapterId]) {
        chapterStats[chapterId] = { total: 0, correct: 0, wrong: 0 };
      }

      chapterStats[chapterId].total++;
      if (attempt.isCorrect) {
        chapterStats[chapterId].correct++;
      } else {
        chapterStats[chapterId].wrong++;
      }
    }

    let prompt = `
다음은 학생의 수학 퀴즈 풀이 내역입니다. 틀린 문제들을 분석하여 약점을 파악하고 학습 추천을 제공해주세요.

## 전체 통계
- 총 풀이 수: ${stats.totalAttempts}
- 전체 정확도: ${stats.accuracyRate.toFixed(2)}%

## 챕터별 틀린 문제
`;

    // 각 챕터의 모든 틀린 문제를 포함
    for (const chapterId of Object.keys(chapterWrongQuestions)
      .map(Number)
      .sort()) {
      const wrongQuestions = chapterWrongQuestions[chapterId];
      const chapterStat =
        chapterStats[chapterId] || { total: 0, correct: 0, wrong: 0 };
      const accuracy =
        chapterStat.total > 0
          ? (chapterStat.correct / chapterStat.total) * 100
          : 0;

      prompt += `
### 챕터 ${chapterId}
- 총 문제 수: ${chapterStat.total}
- 정확도: ${accuracy.toFixed(2)}%
- 틀린 문제 목록 (총 ${wrongQuestions.length}개):
`;

      // 모든 틀린 문제 포함 (제한 없음)
      wrongQuestions.forEach((wrongQ, i) => {
        prompt += `
  ${i + 1}. 문제: ${wrongQ.question}
     학생이 선택한 답: ${wrongQ.selected}
     정답: ${wrongQ.correct}
`;
      });
    }

    prompt += `

## 문제 유형별 통계
`;
    for (const [qType, count] of Object.entries(stats.wrongByType)) {
      prompt += `- ${qType}: ${count}개 틀림\n`;
    }

    prompt += `
## 분석 요청사항

다음 JSON 형식으로 응답해주세요:
{
  "weaknesses": [
    {
      "category": "챕터 1",
      "chapterId": 1,
      "problemCount": 5,
      "accuracyRate": 40.5,
      "commonMistakes": ["실수 패턴 1", "실수 패턴 2"],
      "priority": "high"
    }
  ],
  "recommendations": [
    "구체적인 학습 추천 사항 1",
    "구체적인 학습 추천 사항 2"
  ],
  "overallScore": 65.5,
  "improvementAreas": ["챕터 1", "챕터 2"]
}

### 분석 기준:
1. **우선순위(priority)**: 
   - "high": 정확도 50% 미만이거나 개선이 시급한 영역
   - "medium": 정확도 50-70% 사이의 영역
   - "low": 정확도 70% 이상의 영역

2. **commonMistakes**: 틀린 문제들을 분석하여 자주 나타나는 실수 패턴을 2-3개 추출

3. **recommendations**: 학생의 약점을 바탕으로 구체적이고 실행 가능한 학습 추천 사항을 3-5개 제공

4. **improvementAreas**: 우선순위가 "high"인 약점의 category 목록

응답은 반드시 유효한 JSON 형식이어야 합니다.
`;

    return prompt;
  }

  /**
   * OpenAI API 응답을 WeaknessAnalysisResponse로 변환
   */
  private parseOpenAIResponse(
    resultJson: any,
    overallScore: number,
  ): WeaknessAnalysisResponse {
    const weaknesses: Weakness[] = (resultJson.weaknesses || []).map(
      (weaknessData: any) => ({
        category: weaknessData.category || '',
        chapterId: weaknessData.chapterId || 0,
        chapterName: weaknessData.chapterName,
        problemCount: weaknessData.problemCount || 0,
        accuracyRate: parseFloat(weaknessData.accuracyRate || 0),
        commonMistakes: weaknessData.commonMistakes || [],
        priority: weaknessData.priority || 'medium',
      }),
    );

    const recommendations = resultJson.recommendations || [
      '계속 노력하세요!',
    ];
    const improvementAreas = resultJson.improvementAreas || [];

    // overallScore가 없으면 기본값 사용
    const finalOverallScore =
      resultJson.overallScore !== undefined
        ? parseFloat(resultJson.overallScore)
        : overallScore;

    return {
      weaknesses,
      recommendations,
      overallScore: finalOverallScore,
      improvementAreas,
    };
  }

  /**
   * OpenAI API 호출 실패 시 기본 분석 결과 생성
   */
  private generateFallbackAnalysis(
    attempts: AttemptData[],
    stats: WeaknessAnalysisRequest['statistics'],
  ): WeaknessAnalysisResponse {
    const wrongAttempts = attempts.filter((a) => !a.isCorrect);

    // 챕터별 약점 분석
    const chapterStats: Record<
      number,
      { total: number; correct: number; wrong: number; mistakes: string[] }
    > = {};

    for (const attempt of attempts) {
      const chapterId = attempt.chapterId;
      if (!chapterStats[chapterId]) {
        chapterStats[chapterId] = {
          total: 0,
          correct: 0,
          wrong: 0,
          mistakes: [],
        };
      }

      chapterStats[chapterId].total++;
      if (attempt.isCorrect) {
        chapterStats[chapterId].correct++;
      } else {
        chapterStats[chapterId].wrong++;
        if (attempt.explanation) {
          chapterStats[chapterId].mistakes.push(attempt.explanation);
        }
      }
    }

    const weaknesses: Weakness[] = Object.entries(chapterStats).map(
      ([chapterId, data]) => {
        const accuracy =
          data.total > 0 ? (data.correct / data.total) * 100 : 0;

        let priority: 'high' | 'medium' | 'low';
        if (accuracy < 50) {
          priority = 'high';
        } else if (accuracy < 70) {
          priority = 'medium';
        } else {
          priority = 'low';
        }

        return {
          category: `챕터 ${chapterId}`,
          chapterId: Number(chapterId),
          problemCount: data.wrong,
          accuracyRate: Math.round(accuracy * 100) / 100,
          commonMistakes: data.mistakes.slice(0, 3),
          priority,
        };
      },
    );

    // 정확도가 낮은 순으로 정렬
    weaknesses.sort((a, b) => a.accuracyRate - b.accuracyRate);

    const recommendations: string[] = [];
    if (stats.accuracyRate >= 80) {
      recommendations.push('전반적으로 우수한 성과를 보이고 있습니다!');
    } else if (stats.accuracyRate >= 60) {
      recommendations.push('꾸준한 학습이 필요합니다.');
    } else {
      recommendations.push('기초를 탄탄히 다지는 것이 중요합니다.');
    }

    const highPriority = weaknesses.filter((w) => w.priority === 'high');
    if (highPriority.length > 0) {
      recommendations.push(
        `${highPriority[0].category}에 대한 추가 학습이 필요합니다.`,
      );
    }

    const improvementAreas = weaknesses
      .filter((w) => w.priority === 'high')
      .map((w) => w.category);

    return {
      weaknesses,
      recommendations,
      overallScore: stats.accuracyRate,
      improvementAreas,
    };
  }
}

