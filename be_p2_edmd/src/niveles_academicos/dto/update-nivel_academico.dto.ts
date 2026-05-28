import { PartialType } from '@nestjs/mapped-types';
import { CreateNivelAcademicoDto } from './create-nivel_academico.dto';

export class UpdateNivelAcademicoDto extends PartialType(CreateNivelAcademicoDto) {}
