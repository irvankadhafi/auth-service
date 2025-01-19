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
import { Resource } from "@/domain/entities/resource.entity";
import { Action } from "@/domain/entities/action.entity";
import { RolePermission } from "@/rbac/role-permission";
import { Permission } from "@/rbac/permission";

@Entity('users')
export class User {
    constructor(data?: Partial<User>) {
        if (data) {
            Object.assign(this, data);
        }
    }

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

    @Column({ default: true, name: 'is_active' })
    isActive!: boolean; // Tambahkan nama kolom yang hilang

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    // Tambahkan property rolePerm
    private rolePerm: RolePermission | null = null;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }

    hasAccess(resource: Resource, action: Action): boolean {
        if (this.rolePerm === null) {
            return false;
        }

        if (this.role === Role.INTERNAL_SERVICE) {
            this.role = Role.ADMIN;
        }

        return this.rolePerm.hasAccess(resource, action);
    }

    setPermission(perm: { RRA: Map<Role, Array<{ resource: string; action: string }>> } | null) {
        if (!perm) return;
        this.rolePerm = new RolePermission(this.role, new Permission(perm.RRA));
    }

    setRolePermission(rolePerm: RolePermission) {
        this.rolePerm = rolePerm;
    }

    getRolePermission(): { role: string; permissions: Array<{ resource: string; action: string }> } | null {
        if (!this.rolePerm) return null;

        // Ambil daftar permissions dari RolePermission
        const permissions = this.rolePerm.getPermissions();

        return {
            role: this.role, // Ambil role dari RolePermission
            permissions: permissions.map(perm => ({
                resource: perm.resource,
                action: perm.action
            }))
        };
    }


    isAdmin(): boolean {
        return this.role === Role.ADMIN;
    }
}