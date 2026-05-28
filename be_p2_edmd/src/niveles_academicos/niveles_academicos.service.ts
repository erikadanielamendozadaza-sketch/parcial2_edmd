import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateNivelAcademicoDto } from './dto/create-nivel_academico.dto';
import { UpdateNivelAcademicoDto } from './dto/update-nivel_academico.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NivelAcademico } from './entities/nivel_academico.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NivelesAcademicosService {
  constructor(
    @InjectRepository(NivelAcademico)
    private nivelesAcademicosRepository: Repository<NivelAcademico>,
  ) {}

  async create(
    createNivelAcademicoDto: CreateNivelAcademicoDto,
  ): Promise<NivelAcademico> {
    let nivel_academico = await this.nivelesAcademicosRepository.findOneBy({
      nombre: createNivelAcademicoDto.nombre.trim(),
    });
    if (nivel_academico)
      throw new ConflictException('El nivel académico ya existe');
    nivel_academico = new NivelAcademico();
    Object.assign(nivel_academico, createNivelAcademicoDto);
    return this.nivelesAcademicosRepository.save(nivel_academico);
  }

  async findAll(): Promise<NivelAcademico[]> {
    return this.nivelesAcademicosRepository.find({ order: { nombre: 'ASC' } });
  }

  async findOne(id: number): Promise<NivelAcademico> {
    const nivel_academico = await this.nivelesAcademicosRepository.findOneBy({
      id,
    });
    if (!nivel_academico)
      throw new NotFoundException('El nivel académico no existe');
    return nivel_academico;
  }

  async update(
    id: number,
    updateNivelesAcademicoDto: UpdateNivelAcademicoDto,
  ): Promise<NivelAcademico> {
    const nivel_academico = await this.findOne(id);
    Object.assign(nivel_academico, updateNivelesAcademicoDto);
    return this.nivelesAcademicosRepository.save(nivel_academico);
  }

  async remove(id: number): Promise<NivelAcademico> {
    const nivel_academico = await this.findOne(id);
    return this.nivelesAcademicosRepository.softRemove(nivel_academico);
  }
}
