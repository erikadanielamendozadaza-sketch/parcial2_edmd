import { NivelAcademico } from "src/niveles_academicos/entities/nivel_academico.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('programas')
export class Programa {
    @PrimaryGeneratedColumn('identity')
    id:number;

    @Column('integer', {name: 'id_nivel_academico'})
    idNivelAcademico:number;

    @Column('varchar', { length: 100 })
    nombre:string;

    @Column('varchar', { length: 2000 })
    descripcion:string;

    @Column('int', { default: 0 })
    version:number;

    @Column('int', { default: 0 })
    duracionMeses:number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    costo:number;

    @Column('date')
    fechaInicio:Date;

    @Column('varchar', { length: 20 })
    estado:string;

    @CreateDateColumn({ name: 'fecha_creacion' })
    fechaCreacion: Date;

    @UpdateDateColumn({ name: 'fecha_modificacion' })
    fechaModificacion: Date;

    @DeleteDateColumn({ name: 'fecha_eliminacion' })
    fechaEliminacion: Date;

    @ManyToOne(() => NivelAcademico, (nivel) => nivel.programas)
    @JoinColumn({ name: 'id_nivel_academico' })
    nivelAcademico: NivelAcademico;
}