import { User, UserRole } from '../../user/user.entity';

export class CreateUserResDto {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  profileImage: string | null;
  candy: number;
  parentId: number | null;
  createdAt: Date;

  static fromEntity(user: User): CreateUserResDto {
    const dto = new CreateUserResDto();
    dto.id = user.id;
    dto.email = user.email;
    dto.name = user.name;
    dto.role = user.role;
    dto.profileImage = user.profileImage;
    dto.candy = user.candy;
    dto.parentId = user.parentId;
    dto.createdAt = user.createdAt;
    return dto;
  }
}
