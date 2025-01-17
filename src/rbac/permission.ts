import {Resource} from "@/domain/entities/resource.entity";
import {Action} from "@/domain/entities/action.entity";

export class Permission {
    constructor(
        private resourceActions: Map<Resource, Set<Action>>
    ) {}

    hasAccess(resource: Resource, action: Action): boolean {
        const actions = this.resourceActions.get(resource);
        return actions ? actions.has(action) : false;
    }
}