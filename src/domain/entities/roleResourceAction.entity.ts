import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Role } from '@/utils/constants';
import { Resource } from './resource.entity';
import { Action } from './action.entity';

@Entity('role_resource_actions')
export class RoleResourceAction {
    @PrimaryColumn({
        type: 'enum',
        enum: Role
    })
    role!: Role;

    @PrimaryColumn()
    resource!: string;

    @PrimaryColumn()
    action!: string;

    @ManyToOne(() => Resource)
    @JoinColumn({ name: 'resource' })
    resourceRef!: Resource;

    @ManyToOne(() => Action)
    @JoinColumn({ name: 'action' })
    actionRef!: Action;
}