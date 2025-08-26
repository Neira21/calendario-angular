import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateActivityDto {
  @ApiProperty({
    description: 'Título de la actividad',
    example: 'Reunión con el equipo',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'Descripción detallada de la actividad',
    example:
      'Revisión de avances del proyecto y planificación de próximas tareas.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Fecha y hora de la actividad',
    example: '2024-08-30T15:30:00.000Z',
  })
  @IsDateString()
  date: string;
}
