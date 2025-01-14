import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Resource } from './resource.entity';
import { Action } from './action.entity';

@Entity('role_resource_actions')
@Unique('rra_unique_idx', ['role', 'resource', 'action'])
export class RoleResourceAction {
    @Column({
        type: 'enum',
        enum: ['SUPER_ADMIN', 'EMPLOYEE', 'USER'],
        name: 'role'
    })
    role: string;

    @ManyToOne(() => Resource)
    @JoinColumn({ name: 'resource' })
    resource: Resource;

    @ManyToOne(() => Action)
    @JoinColumn({ name: 'action' })
    action: Action;

    constructor(role: string, resource: Resource, action: Action) {
        this.role = role;
        this.resource = resource;
        this.action = action;
    }
}