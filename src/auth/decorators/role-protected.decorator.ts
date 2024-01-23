import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../interfaces';
import { RoleTypes } from '../types/RolesTypes';

export const META_ROLES = 'roles';
// type ARGS_ROLES = ['admin'] | ['user'] | ['super-user'] | [];


export const RoleProtected = (...args: ValidRoles[] ) => {

  return SetMetadata(META_ROLES, args);
};
