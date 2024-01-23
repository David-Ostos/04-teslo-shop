import { Controller, Post, Body, Get, UseGuards, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';

import { GetUser, GetRawHeaders } from './decorators';
import { User } from './entities/user.entity';
import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guards/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor (private readonly authService: AuthService) {}

  @Post('register')
  async create (@Body() createUserDto: CreateUserDto) {
    return await this.authService.createUser(createUserDto);
  }


  @Post('login')
  async loginUser (@Body() loginUserDto: LoginUserDto) {
    return await this.authService.loginUser(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  async checkAuthStatus (
  @GetUser() user: User
  ) {
    return await this.authService.checkAuthStatus( user );
  }


  @Get('private')
  @UseGuards(AuthGuard() )
  testingPrivateRoute (
  @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @GetRawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders
  // @Req() request: Express.Request  es para poder llamar el request completo
  ) {

    // console.log(request.user);
    return {
      ok: true,
      message: 'private hello world',
      user,
      userEmail,
      headers
    };
  }
  // @SetMetadata('roles', ['admin', 'super-user'])

  @Get('private2')
  @RoleProtected(ValidRoles.admin )
  @UseGuards(
    AuthGuard(),
    UserRoleGuard
  )
  privateRouter2 (
  @GetUser() user: User
  ) {
    return {
      ok: true,
      user
    };
  }


  @Get('private3')
  @Auth( ValidRoles.admin, ValidRoles.superUser )
  privateRouter3 (
  @GetUser() user: User
  ) {
    return {
      ok: true,
      user
    };
  }
}



