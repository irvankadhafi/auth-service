// package: auth
// file: auth.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class FindByIdRequest extends jspb.Message { 
    getId(): number;
    setId(value: number): FindByIdRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): FindByIdRequest.AsObject;
    static toObject(includeInstance: boolean, msg: FindByIdRequest): FindByIdRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: FindByIdRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): FindByIdRequest;
    static deserializeBinaryFromReader(message: FindByIdRequest, reader: jspb.BinaryReader): FindByIdRequest;
}

export namespace FindByIdRequest {
    export type AsObject = {
        id: number,
    }
}

export class AuthenticateAccessTokenRequest extends jspb.Message { 
    getAccessToken(): string;
    setAccessToken(value: string): AuthenticateAccessTokenRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): AuthenticateAccessTokenRequest.AsObject;
    static toObject(includeInstance: boolean, msg: AuthenticateAccessTokenRequest): AuthenticateAccessTokenRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: AuthenticateAccessTokenRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): AuthenticateAccessTokenRequest;
    static deserializeBinaryFromReader(message: AuthenticateAccessTokenRequest, reader: jspb.BinaryReader): AuthenticateAccessTokenRequest;
}

export namespace AuthenticateAccessTokenRequest {
    export type AsObject = {
        accessToken: string,
    }
}

export class FindRolePermissionRequest extends jspb.Message { 
    getRole(): string;
    setRole(value: string): FindRolePermissionRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): FindRolePermissionRequest.AsObject;
    static toObject(includeInstance: boolean, msg: FindRolePermissionRequest): FindRolePermissionRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: FindRolePermissionRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): FindRolePermissionRequest;
    static deserializeBinaryFromReader(message: FindRolePermissionRequest, reader: jspb.BinaryReader): FindRolePermissionRequest;
}

export namespace FindRolePermissionRequest {
    export type AsObject = {
        role: string,
    }
}

export class User extends jspb.Message { 
    getId(): number;
    setId(value: number): User;
    getEmail(): string;
    setEmail(value: string): User;
    getRole(): string;
    setRole(value: string): User;
    getCreatedAt(): string;
    setCreatedAt(value: string): User;
    getUpdatedAt(): string;
    setUpdatedAt(value: string): User;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): User.AsObject;
    static toObject(includeInstance: boolean, msg: User): User.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: User, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): User;
    static deserializeBinaryFromReader(message: User, reader: jspb.BinaryReader): User;
}

export namespace User {
    export type AsObject = {
        id: number,
        email: string,
        role: string,
        createdAt: string,
        updatedAt: string,
    }
}

export class Permission extends jspb.Message { 
    getResource(): string;
    setResource(value: string): Permission;
    getAction(): string;
    setAction(value: string): Permission;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Permission.AsObject;
    static toObject(includeInstance: boolean, msg: Permission): Permission.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Permission, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Permission;
    static deserializeBinaryFromReader(message: Permission, reader: jspb.BinaryReader): Permission;
}

export namespace Permission {
    export type AsObject = {
        resource: string,
        action: string,
    }
}

export class RolePermission extends jspb.Message { 
    getRole(): string;
    setRole(value: string): RolePermission;
    clearPermissionsList(): void;
    getPermissionsList(): Array<Permission>;
    setPermissionsList(value: Array<Permission>): RolePermission;
    addPermissions(value?: Permission, index?: number): Permission;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RolePermission.AsObject;
    static toObject(includeInstance: boolean, msg: RolePermission): RolePermission.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: RolePermission, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RolePermission;
    static deserializeBinaryFromReader(message: RolePermission, reader: jspb.BinaryReader): RolePermission;
}

export namespace RolePermission {
    export type AsObject = {
        role: string,
        permissionsList: Array<Permission.AsObject>,
    }
}
