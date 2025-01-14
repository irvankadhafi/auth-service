import { injectable } from 'tsyringe';
import { Repository } from 'typeorm';
import { AppDataSource } from '@/config/database';
import { RoleResourceAction } from '../entities/role-resource-action.entity';
import { Resource } from '../entities/resource.entity';
import { Action } from '../entities/action.entity';

@injectable()
export class RBACRepository {
    private rraRepository: Repository<RoleResourceAction>;
    private resourceRepository: Repository<Resource>;
    private actionRepository: Repository<Action>;

    constructor() {
        this.rraRepository = AppDataSource.getRepository(RoleResourceAction);
        this.resourceRepository = AppDataSource.getRepository(Resource);
        this.actionRepository = AppDataSource.getRepository(Action);
    }

    async createRoleResourceAction(role: string, resourceId: string, actionId: string): Promise<void> {
        const resource = await this.resourceRepository.findOneBy({ id: resourceId });
        const action = await this.actionRepository.findOneBy({ id: actionId });

        if (!resource || !action) {
            throw new Error('Resource or Action not found');
        }

        const rra = new RoleResourceAction(role, resource, action);
        await this.rraRepository.save(rra);
    }

    async getRolePermissions(role: string): Promise<RoleResourceAction[]> {
        return this.rraRepository.find({
            where: { role },
            relations: ['resource', 'action']
        });
    }

    async hasPermission(role: string, resourceId: string, actionId: string): Promise<boolean> {
        const permission = await this.rraRepository.findOne({
            where: {
                role,
                resource: { id: resourceId },
                action: { id: actionId }
            }
        });

        return !!permission;
    }
}