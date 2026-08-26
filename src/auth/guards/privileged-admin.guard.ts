import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { isPrivilegedAdmin } from '../../common/helpers/privileged-access.helper';
import { JwtPayload } from '../types/jwt.types';

@Injectable()
export class PrivilegedAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user }: { user?: JwtPayload } = context.switchToHttp().getRequest();

    if (!user || !isPrivilegedAdmin(user)) {
      throw new ForbiddenException('Access to this resource is restricted.');
    }

    return true;
  }
}
