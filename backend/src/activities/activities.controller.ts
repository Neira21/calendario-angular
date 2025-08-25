import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@ApiTags('activities')
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva actividad' })
  @ApiResponse({ status: 201, description: 'Actividad creada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  create(@Body(ValidationPipe) createActivityDto: CreateActivityDto) {
    return this.activitiesService.create(createActivityDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las actividades' })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description:
      'Fecha de inicio para filtrar actividades (formato: YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Fecha de fin para filtrar actividades (formato: YYYY-MM-DD)',
  })
  @ApiResponse({ status: 200, description: 'Lista de actividades.' })
  findAll(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    if (startDate && endDate) {
      return this.activitiesService.findByDateRange(startDate, endDate);
    }
    return this.activitiesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una actividad por ID' })
  @ApiParam({ name: 'id', description: 'ID de la actividad' })
  @ApiResponse({ status: 200, description: 'Actividad encontrada.' })
  @ApiResponse({ status: 404, description: 'Actividad no encontrada.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.activitiesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una actividad' })
  @ApiParam({ name: 'id', description: 'ID de la actividad' })
  @ApiResponse({
    status: 200,
    description: 'Actividad actualizada exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Actividad no encontrada.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateActivityDto: UpdateActivityDto,
  ) {
    return this.activitiesService.update(id, updateActivityDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una actividad' })
  @ApiParam({ name: 'id', description: 'ID de la actividad' })
  @ApiResponse({
    status: 200,
    description: 'Actividad eliminada exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Actividad no encontrada.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.activitiesService.remove(id);
  }
}
