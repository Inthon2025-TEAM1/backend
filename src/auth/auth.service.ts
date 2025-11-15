import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async findByFirebaseUid(uid: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { firebaseUid: uid } });
  }

  async createFromFirebase(firebaseUser: any): Promise<User> {
    const user = this.userRepository.create({
      firebaseUid: firebaseUser.uid,
      email: firebaseUser.email ?? null,
      name: firebaseUser.name ?? firebaseUser.displayName ?? null,
      profileImage: firebaseUser.picture ?? null,
      // 필요한 필드만 명시적으로 입력!
    });

    return await this.userRepository.save(user);
  }

  async findOrCreateFromFirebase(firebaseUser: any): Promise<User> {
    let user = await this.findByFirebaseUid(firebaseUser.uid);

    if (!user) {
      user = await this.createFromFirebase(firebaseUser);
    }

    return user;
  }
}
