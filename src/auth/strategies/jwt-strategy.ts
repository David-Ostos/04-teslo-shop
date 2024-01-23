import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';

import { User } from '../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';


// como es un probider hay que llamarlo en el auth.module.ts para que haga llamado a la estrategia
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  // al crear un constructor personalizado, se necesita llamar al padre y definir el jwt secret
  constructor(
    @InjectRepository( User)
    private readonly userRepository: Repository<User>,

    configService: ConfigService

  ){

    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    })

  }
  
  // esa validacion se llama si el jwt no a expirado y el jwt hace mash con el payload
  async validate( payload: JwtPayload):Promise<User>{

    const { id } = payload;

    const user = await this.userRepository.findOneBy({ id }); ;

    if ( !user ){
      throw new UnauthorizedException('Token not valid');
    }

    if ( !user.isActive ){
      throw new UnauthorizedException('User is inactive, talk with an admin');
    }
  
    return user ;
  }

}
