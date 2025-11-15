import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { QuizService } from '../quiz/quiz.service';
import { QuizAttempt } from '../quiz/quiz-attempt.entity';
import { QuizQuestion } from '../quiz/quiz-question.entity';

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
  private readonly aiServiceUrl: string;
  private readonly httpClient: AxiosInstance;

  constructor(
    private readonly quizService: QuizService,
    private readonly configService: ConfigService,
  ) {
    // AI 서비스 URL (환경변수에서 가져오거나 기본값 사용)
    this.aiServiceUrl =
      this.configService.get<string>('AI_SERVICE_URL') ||
      'http://localhost:8000';
    
    // Axios 인스턴스 생성
    this.httpClient = axios.create({
      baseURL: this.aiServiceUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
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
   * AI 서비스에 약점 분석 요청
   */
  async analyzeWeakness(
    childId: number,
  ): Promise<WeaknessAnalysisResponse> {
    // 1. 데이터 준비
    const analysisData = await this.prepareAnalysisData(childId);

    // 2. AI 서비스에 HTTP 요청
    try {
      const response = await this.httpClient.post<WeaknessAnalysisResponse>(
        '/analyze/weakness',
        analysisData,
      );

      return response.data;
    } catch (error) {
      // AI 서비스가 없거나 오류가 발생한 경우, 기본 분석 결과 반환
      console.error('AI 서비스 호출 실패:', error);
      return this.generateDefaultAnalysis(analysisData);
    }
  }

  /**
   * AI 서비스가 없을 때 기본 분석 결과 생성
   */
  private generateDefaultAnalysis(
    data: WeaknessAnalysisRequest,
  ): WeaknessAnalysisResponse {
    const wrongAttempts = data.attempts.filter((a) => !a.isCorrect);

    // 챕터별 약점 분석
    const chapterStats: Record<
      number,
      { count: number; mistakes: string[] }
    > = {};

    wrongAttempts.forEach((attempt) => {
      if (!chapterStats[attempt.chapterId]) {
        chapterStats[attempt.chapterId] = { count: 0, mistakes: [] };
      }
      chapterStats[attempt.chapterId].count++;
      if (attempt.explanation) {
        chapterStats[attempt.chapterId].mistakes.push(attempt.explanation);
      }
    });

    const weaknesses: Weakness[] = Object.entries(chapterStats).map(
      ([chapterId, stats]) => {
        const totalChapterAttempts = data.attempts.filter(
          (a) => a.chapterId === Number(chapterId),
        ).length;
        const accuracyRate =
          totalChapterAttempts > 0
            ? ((totalChapterAttempts - stats.count) / totalChapterAttempts) *
              100
            : 0;

        return {
          category: `챕터 ${chapterId}`,
          chapterId: Number(chapterId),
          problemCount: stats.count,
          accuracyRate: Math.round(accuracyRate * 100) / 100,
          commonMistakes: stats.mistakes.slice(0, 3), // 상위 3개만
          priority:
            accuracyRate < 50
              ? 'high'
              : accuracyRate < 70
                ? 'medium'
                : 'low',
        };
      },
    );

    // 정확도 순으로 정렬 (낮은 것부터)
    weaknesses.sort((a, b) => a.accuracyRate - b.accuracyRate);

    const recommendations = weaknesses
      .filter((w) => w.priority === 'high')
      .map((w) => `${w.category}에 대한 추가 학습이 필요합니다.`);

    return {
      weaknesses,
      recommendations: recommendations.length > 0
        ? recommendations
        : ['전반적으로 잘하고 있습니다! 계속 노력하세요.'],
      overallScore: data.statistics.accuracyRate,
      improvementAreas: weaknesses
        .filter((w) => w.priority === 'high')
        .map((w) => w.category),
    };
  }
}

