import { RoleEnum } from '@constant/common';
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: RoleEnum[]) => SetMetadata('roles', roles);
