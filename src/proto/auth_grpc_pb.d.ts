// package: auth
// file: auth.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as auth_pb from "./auth_pb";

interface IAuthServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    findUserById: IAuthServiceService_IFindUserById;
    authenticateAccessToken: IAuthServiceService_IAuthenticateAccessToken;
    findRolePermission: IAuthServiceService_IFindRolePermission;
}

interface IAuthServiceService_IFindUserById extends grpc.MethodDefinition<auth_pb.FindByIdRequest, auth_pb.User> {
    path: "/auth.AuthService/FindUserById";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<auth_pb.FindByIdRequest>;
    requestDeserialize: grpc.deserialize<auth_pb.FindByIdRequest>;
    responseSerialize: grpc.serialize<auth_pb.User>;
    responseDeserialize: grpc.deserialize<auth_pb.User>;
}
interface IAuthServiceService_IAuthenticateAccessToken extends grpc.MethodDefinition<auth_pb.AuthenticateAccessTokenRequest, auth_pb.User> {
    path: "/auth.AuthService/AuthenticateAccessToken";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<auth_pb.AuthenticateAccessTokenRequest>;
    requestDeserialize: grpc.deserialize<auth_pb.AuthenticateAccessTokenRequest>;
    responseSerialize: grpc.serialize<auth_pb.User>;
    responseDeserialize: grpc.deserialize<auth_pb.User>;
}
interface IAuthServiceService_IFindRolePermission extends grpc.MethodDefinition<auth_pb.FindRolePermissionRequest, auth_pb.RolePermission> {
    path: "/auth.AuthService/FindRolePermission";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<auth_pb.FindRolePermissionRequest>;
    requestDeserialize: grpc.deserialize<auth_pb.FindRolePermissionRequest>;
    responseSerialize: grpc.serialize<auth_pb.RolePermission>;
    responseDeserialize: grpc.deserialize<auth_pb.RolePermission>;
}

export const AuthServiceService: IAuthServiceService;

export interface IAuthServiceServer extends grpc.UntypedServiceImplementation {
    findUserById: grpc.handleUnaryCall<auth_pb.FindByIdRequest, auth_pb.User>;
    authenticateAccessToken: grpc.handleUnaryCall<auth_pb.AuthenticateAccessTokenRequest, auth_pb.User>;
    findRolePermission: grpc.handleUnaryCall<auth_pb.FindRolePermissionRequest, auth_pb.RolePermission>;
}

export interface IAuthServiceClient {
    findUserById(request: auth_pb.FindByIdRequest, callback: (error: grpc.ServiceError | null, response: auth_pb.User) => void): grpc.ClientUnaryCall;
    findUserById(request: auth_pb.FindByIdRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: auth_pb.User) => void): grpc.ClientUnaryCall;
    findUserById(request: auth_pb.FindByIdRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: auth_pb.User) => void): grpc.ClientUnaryCall;
    authenticateAccessToken(request: auth_pb.AuthenticateAccessTokenRequest, callback: (error: grpc.ServiceError | null, response: auth_pb.User) => void): grpc.ClientUnaryCall;
    authenticateAccessToken(request: auth_pb.AuthenticateAccessTokenRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: auth_pb.User) => void): grpc.ClientUnaryCall;
    authenticateAccessToken(request: auth_pb.AuthenticateAccessTokenRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: auth_pb.User) => void): grpc.ClientUnaryCall;
    findRolePermission(request: auth_pb.FindRolePermissionRequest, callback: (error: grpc.ServiceError | null, response: auth_pb.RolePermission) => void): grpc.ClientUnaryCall;
    findRolePermission(request: auth_pb.FindRolePermissionRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: auth_pb.RolePermission) => void): grpc.ClientUnaryCall;
    findRolePermission(request: auth_pb.FindRolePermissionRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: auth_pb.RolePermission) => void): grpc.ClientUnaryCall;
}

export class AuthServiceClient extends grpc.Client implements IAuthServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public findUserById(request: auth_pb.FindByIdRequest, callback: (error: grpc.ServiceError | null, response: auth_pb.User) => void): grpc.ClientUnaryCall;
    public findUserById(request: auth_pb.FindByIdRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: auth_pb.User) => void): grpc.ClientUnaryCall;
    public findUserById(request: auth_pb.FindByIdRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: auth_pb.User) => void): grpc.ClientUnaryCall;
    public authenticateAccessToken(request: auth_pb.AuthenticateAccessTokenRequest, callback: (error: grpc.ServiceError | null, response: auth_pb.User) => void): grpc.ClientUnaryCall;
    public authenticateAccessToken(request: auth_pb.AuthenticateAccessTokenRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: auth_pb.User) => void): grpc.ClientUnaryCall;
    public authenticateAccessToken(request: auth_pb.AuthenticateAccessTokenRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: auth_pb.User) => void): grpc.ClientUnaryCall;
    public findRolePermission(request: auth_pb.FindRolePermissionRequest, callback: (error: grpc.ServiceError | null, response: auth_pb.RolePermission) => void): grpc.ClientUnaryCall;
    public findRolePermission(request: auth_pb.FindRolePermissionRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: auth_pb.RolePermission) => void): grpc.ClientUnaryCall;
    public findRolePermission(request: auth_pb.FindRolePermissionRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: auth_pb.RolePermission) => void): grpc.ClientUnaryCall;
}
