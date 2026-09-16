import { Module, Global } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { CloudinaryService } from './services/cloudinary.service';

@Global()
@Module({
  providers: [UserRepository, CloudinaryService],
  exports: [UserRepository, CloudinaryService],
})
export class CommonModule {}
