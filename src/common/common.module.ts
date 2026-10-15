import { Global, Module } from '@nestjs/common';
import { ApiResponseService } from './helpers/api-response.helper';

@Global()
@Module({
  providers: [ApiResponseService],
  exports: [ApiResponseService],
})
export class CommonModule {}
