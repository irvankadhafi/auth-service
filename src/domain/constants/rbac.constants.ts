export const Roles = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    EMPLOYEE: 'EMPLOYEE',
    USER: 'USER'
} as const;

export const Resources = {
    USER: 'user',
    EMPLOYEE: 'employee',
    DEPARTMENT: 'department',
    ATTENDANCE: 'attendance',
} as const;

export const Actions = {
    CREATE: 'create',
    READ: 'read',
    UPDATE: 'update',
    DELETE: 'delete',
    READ_ALL: 'read_all',
    UPDATE_ALL: 'update_all',
    DELETE_ALL: 'delete_all',
} as const;