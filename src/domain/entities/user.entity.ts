import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type UserRole = 'SUPER_ADMIN' | 'KUMPARAN_ADMIN' | 'SPACE_ADMIN' | 'MEMBER' | 'INTERNAL_SERVICE';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    fullName: string;

    @Column({
        type: 'enum',
        enum: ['SUPER_ADMIN', 'KUMPARAN_ADMIN', 'SPACE_ADMIN', 'MEMBER', 'INTERNAL_SERVICE'],
        default: 'MEMBER'
    })
    role: UserRole;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    constructor(
        email: string,
        password: string,
        fullName: string,
        role: UserRole = 'MEMBER'
    ) {
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.role = role;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}