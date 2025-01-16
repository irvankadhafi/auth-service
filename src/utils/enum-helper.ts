// src/utils/enum-helper.ts
import { Role } from '@/utils/constants';

export class EnumHelper {
    static isValidRole(role: string): role is Role {
        return Object.values(Role).includes(role as Role);
    }

    static toRole(role: string): Role {
        if (!this.isValidRole(role)) {
            throw new Error(`Invalid role: ${role}`);
        }
        return role as Role;
    }
}