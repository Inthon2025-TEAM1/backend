import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '../../user/user.entity';

export class CreateUserReqDto {
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole.PARENT | UserRole.CHILD | UserRole.MENTOR;
}
