// src/utils/constants.ts
export enum Role {
    ADMIN = 'ADMIN',
    MANAGER = 'MANAGER',
    EMPLOYEE = 'EMPLOYEE'
}

export const DEFAULT_RESOURCES = {
    USER: 'user',
    EMPLOYEE: 'employee',
    ATTENDANCE: 'attendance',
    SESSION: 'session',
    REPORT: 'report'
} as const;

export const DEFAULT_ACTIONS = {
    CREATE: 'create',
    READ: 'read',
    UPDATE: 'update',
    DELETE: 'delete',
    APPROVE: 'approve',
    REJECT: 'reject',
    SUBMIT: 'submit'
} as const;

export enum TokenType {
    ACCESS_TOKEN = 0,
    REFRESH_TOKEN = 1
}