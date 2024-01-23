import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role.guard';
import { ValidRoles } from '../interfaces';
import { RoleProtected } from './role-protected.decorator';
import { RoleTypes } from '../types/RolesTypes';


export function Auth (
  ...roles: ValidRoles[]
) {
  return applyDecorators(
    RoleProtected( ...roles ),
    UseGuards(AuthGuard(), UserRoleGuard )
  );
}

