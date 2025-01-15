import { Role, Resource, Action } from './constants';

export const defaultPermissions = [
    // Admin permissions
    { role: Role.ADMIN, resource: Resource.USER, action: Action.CREATE },
    { role: Role.ADMIN, resource: Resource.USER, action: Action.READ },
    { role: Role.ADMIN, resource: Resource.USER, action: Action.UPDATE },
    { role: Role.ADMIN, resource: Resource.USER, action: Action.DELETE },
    { role: Role.ADMIN, resource: Resource.EMPLOYEE, action: Action.CREATE },
    { role: Role.ADMIN, resource: Resource.EMPLOYEE, action: Action.READ },
    { role: Role.ADMIN, resource: Resource.EMPLOYEE, action: Action.UPDATE },
    { role: Role.ADMIN, resource: Resource.EMPLOYEE, action: Action.DELETE },
    { role: Role.ADMIN, resource: Resource.ATTENDANCE, action: Action.READ },
    { role: Role.ADMIN, resource: Resource.REPORT, action: Action.READ },

    // Manager permissions
    { role: Role.MANAGER, resource: Resource.EMPLOYEE, action: Action.READ },
    { role: Role.MANAGER, resource: Resource.ATTENDANCE, action: Action.READ },
    { role: Role.MANAGER, resource: Resource.ATTENDANCE, action: Action.APPROVE },
    { role: Role.MANAGER, resource: Resource.ATTENDANCE, action: Action.REJECT },
    { role: Role.MANAGER, resource: Resource.REPORT, action: Action.READ },

    // Employee permissions
    { role: Role.EMPLOYEE, resource: Resource.ATTENDANCE, action: Action.SUBMIT },
    { role: Role.EMPLOYEE, resource: Resource.ATTENDANCE, action: Action.READ },
];