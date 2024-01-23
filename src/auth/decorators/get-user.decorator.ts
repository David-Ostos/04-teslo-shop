import { type ExecutionContext, createParamDecorator, InternalServerErrorException } from '@nestjs/common';


export const GetUser = createParamDecorator(
  (data: 'email' | 'fullName' | 'isActive' | 'roles' | 'id', ctx: ExecutionContext) => {

    const req = ctx.switchToHttp().getRequest();
    console.log(req);
    const user = req.user;

    if ( !user ) {
      throw new InternalServerErrorException('User not Found (request)');
    }

    return ( !data ) ? user : user[data];

  }
);
