import { Entity, PrimaryColumn } from 'typeorm';

@Entity('resources')
export class Resource {
    @PrimaryColumn()
    id!: string;
}