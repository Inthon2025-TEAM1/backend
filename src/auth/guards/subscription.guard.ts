import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { User } from '../../user/user.entity';
import { isPast } from 'date-fns';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    if (isPast(user.expiresAt)) {
      throw new HttpException(
        'Subscription period has expired. Please renew the subscription.',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    return true;
  }
}
