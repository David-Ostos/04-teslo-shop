import { Controller, Delete, Get } from '@nestjs/common';

import { SeedService } from './seed.service';

import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interfaces';


@Controller('seed')
export class SeedController {
  constructor (private readonly seedService: SeedService) {}

  @Get()
  // @Auth( ValidRoles.admin )
  async excecuteSeed () {
    return await this.seedService.runSeed();
  }

  @Delete('delete')
  @Auth( ValidRoles.admin )
  async deleteAll () {
    await this.seedService.deleteAll();

    return 'success delete all';
  }
}
