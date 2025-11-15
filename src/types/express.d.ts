import { DecodedIdToken } from 'firebase-admin/auth';
import { User } from 'src/user/user.entity';

declare global {
  namespace Express {
    interface Request {
      user?: DecodedIdToken; // Firebase 토큰 정보
      dbUser?: User; // DB에서 조회한 실제 User 엔티티
    }
  }
}
