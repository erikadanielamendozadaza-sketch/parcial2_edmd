import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateNivelAcademicoDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El campo nombre no debe estar vacío' })
  @IsString({ message: 'El campo nombre debe ser de tip cadena' })
  @MaxLength(20, {
    message: 'El campo nombre no debe exceder los 20 caracteres',
  })
  @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
  readonly nombre: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'El campo descripcion debe ser de tipo cadena' })
  @MaxLength(500, {
    message: 'El campo descripcion no debe exceder los 500 caracteres',
  })
  @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
  readonly descripcion: string;
}
