import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Esto hace que el servicio esté disponible en toda la app sin re-importarlo
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Exportalo para que otros módulos lo usen
})
export class PrismaModule {}
