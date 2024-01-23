import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { CreateUserDto /* UpdateUserDto */ , LoginUserDto} from './dto';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  private readonly logger = new Logger('AuthService');

  constructor (
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    // para poder generar el jwt hay que utilizar el servicio de jwt
    private readonly jwtService: JwtService,

    private readonly configService: ConfigService
  ) {}


  async createUser (createUserDto: CreateUserDto) {

    try {

      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create( {
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });

      await this.userRepository.save( user );
      delete user.password;

      return { ...user,
        token: this.getJwtToken({ id: user.id, fullName: user.fullName }) 
      };

    } catch (error) {
      this.handleDBException(error);
    }


  }

  async loginUser (loginUserDto: LoginUserDto){


      const { password, email} = loginUserDto

      const user = await this.userRepository.findOne({
        where: {email},
        select: { email: true, password: true, id: true, fullName: true}  
      });


      if (!user ){
        throw new UnauthorizedException('Credentials are not valid (email) ')
      }
      
      if( !bcrypt.compareSync(password, user.password )){
        throw new UnauthorizedException('Credentials are not valid (passwort) ')
      }

      const { email: rest } = user

      return { email: rest,
      token: this.getJwtToken({ id: user.id, fullName: user.fullName }) 
    }
  }

  async checkAuthStatus( user: User){

    delete user.isActive 
    delete user.roles

    return {
      ...user,
      token: this.getJwtToken({ id: user.id, fullName: user.fullName })
    };
  }


  private getJwtToken( payload: JwtPayload){
    const token = this.jwtService.sign(payload);
    return token ;
  }


  private handleDBException ( error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }

}
