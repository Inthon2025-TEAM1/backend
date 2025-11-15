export class MentoringRequestDto {
  childId: number;
  title: string;
  childName: string;
  childAge: string; // 중1, 중2, 중3
  requirement: string;
}

export class UpdateMentoringStatusDto {
  status: 'matched' | 'rejected';
  mentorName?: string;
}
