import { type ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from '../entities/user.entity';


export const GetRawHeaders = createParamDecorator(
  (data: User, ctx: ExecutionContext) => {

    const req = ctx.switchToHttp().getRequest();

    const rawHeaders = req.rawHeaders;
    console.log({ rawHeaders });

    return { rawHeaders };
  }
);
