// src/domain/entities/user.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BeforeInsert,
    BeforeUpdate
} from 'typeorm';
import { Role } from '@/utils/constants';
import bcrypt from "bcrypt";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.EMPLOYEE
    })
    role!: Role;

    @Column({ default: true })

    @CreateDateColumn({ name: 'created_at' }) // Sesuaikan nama kolom
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' }) // Sesuaikan nama kolom
    updatedAt!: Date;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }
}