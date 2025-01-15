// src/domain/entities/action.entity.ts
import { Entity, PrimaryColumn } from 'typeorm';

@Entity('actions')
export class Action {
    @PrimaryColumn()
    id!: string;
}