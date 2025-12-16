import { Controller, Get } from '@nestjs/common';
import { Public } from '@modules/auth/decorators/public.decorator';
import { AppService } from '../services/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
