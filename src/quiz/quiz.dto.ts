export interface QuizQuestionDto {
  grade: number;
  type: string;
  chapterId: number;
  question: object;
  choices: string[];
  answer: string;
  explain: string;
}
export class QuizQuestionListDto {
  quizs: QuizQuestionDto[];
}
