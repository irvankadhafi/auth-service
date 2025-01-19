// package: auth
// file: auth_service.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as auth_service_pb from "./auth_service_pb";
import * as user_pb from "./user_pb";

interface IAuthServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    findUserById: IAuthServiceService_IFindUserById;
    createUser: IAuthServiceService_ICreateUser;
    findUserByEmail: IAuthServiceService_IFindUserByEmail;
    authenticateAccessToken: IAuthServiceService_IAuthenticateAccessToken;
    findRolePermission: IAuthServiceService_IFindRolePermission;
}

interface IAuthServiceService_IFindUserById extends grpc.MethodDefinition<auth_service_pb.FindByIdRequest, user_pb.User> {
    path: "/auth.AuthService/FindUserById";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<auth_service_pb.FindByIdRequest>;
    requestDeserialize: grpc.deserialize<auth_service_pb.FindByIdRequest>;
    responseSerialize: grpc.serialize<user_pb.User>;
    responseDeserialize: grpc.deserialize<user_pb.User>;
}
interface IAuthServiceService_ICreateUser extends grpc.MethodDefinition<user_pb.CreateUserRequest, user_pb.User> {
    path: "/auth.AuthService/CreateUser";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<user_pb.CreateUserRequest>;
    requestDeserialize: grpc.deserialize<user_pb.CreateUserRequest>;
    responseSerialize: grpc.serialize<user_pb.User>;
    responseDeserialize: grpc.deserialize<user_pb.User>;
}
interface IAuthServiceService_IFindUserByEmail extends grpc.MethodDefinition<user_pb.FindUserByEmailRequest, user_pb.User> {
    path: "/auth.AuthService/FindUserByEmail";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<user_pb.FindUserByEmailRequest>;
    requestDeserialize: grpc.deserialize<user_pb.FindUserByEmailRequest>;
    responseSerialize: grpc.serialize<user_pb.User>;
    responseDeserialize: grpc.deserialize<user_pb.User>;
}
interface IAuthServiceService_IAuthenticateAccessToken extends grpc.MethodDefinition<auth_service_pb.AuthenticateAccessTokenRequest, auth_service_pb.AuthenticateAccessTokenResponse> {
    path: "/auth.AuthService/AuthenticateAccessToken";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<auth_service_pb.AuthenticateAccessTokenRequest>;
    requestDeserialize: grpc.deserialize<auth_service_pb.AuthenticateAccessTokenRequest>;
    responseSerialize: grpc.serialize<auth_service_pb.AuthenticateAccessTokenResponse>;
    responseDeserialize: grpc.deserialize<auth_service_pb.AuthenticateAccessTokenResponse>;
}
interface IAuthServiceService_IFindRolePermission extends grpc.MethodDefinition<auth_service_pb.FindRolePermissionRequest, auth_service_pb.RolePermission> {
    path: "/auth.AuthService/FindRolePermission";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<auth_service_pb.FindRolePermissionRequest>;
    requestDeserialize: grpc.deserialize<auth_service_pb.FindRolePermissionRequest>;
    responseSerialize: grpc.serialize<auth_service_pb.RolePermission>;
    responseDeserialize: grpc.deserialize<auth_service_pb.RolePermission>;
}

export const AuthServiceService: IAuthServiceService;

export interface IAuthServiceServer extends grpc.UntypedServiceImplementation {
    findUserById: grpc.handleUnaryCall<auth_service_pb.FindByIdRequest, user_pb.User>;
    createUser: grpc.handleUnaryCall<user_pb.CreateUserRequest, user_pb.User>;
    findUserByEmail: grpc.handleUnaryCall<user_pb.FindUserByEmailRequest, user_pb.User>;
    authenticateAccessToken: grpc.handleUnaryCall<auth_service_pb.AuthenticateAccessTokenRequest, auth_service_pb.AuthenticateAccessTokenResponse>;
    findRolePermission: grpc.handleUnaryCall<auth_service_pb.FindRolePermissionRequest, auth_service_pb.RolePermission>;
}

export interface IAuthServiceClient {
    findUserById(request: auth_service_pb.FindByIdRequest, callback: (error: grpc.ServiceError | null, response: user_pb.User) => void): grpc.ClientUnaryCall;
    findUserById(request: auth_service_pb.FindByIdRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: user_pb.User) => void): grpc.ClientUnaryCall;
    findUserById(request: auth_service_pb.FindByIdRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: user_pb.User) => void): grpc.ClientUnaryCall;
    createUser(request: user_pb.CreateUserRequest, callback: (error: grpc.ServiceError | null, response: user_pb.User) => void): grpc.ClientUnaryCall;
    createUser(request: user_pb.CreateUserRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: user_pb.User) => void): grpc.ClientUnaryCall;
    createUser(request: user_pb.CreateUserRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: user_pb.User) => void): grpc.ClientUnaryCall;
    findUserByEmail(request: user_pb.FindUserByEmailRequest, callback: (error: grpc.ServiceError | null, response: user_pb.User) => void): grpc.ClientUnaryCall;
    findUserByEmail(request: user_pb.FindUserByEmailRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: user_pb.User) => void): grpc.ClientUnaryCall;
    findUserByEmail(request: user_pb.FindUserByEmailRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: user_pb.User) => void): grpc.ClientUnaryCall;
    authenticateAccessToken(request: auth_service_pb.AuthenticateAccessTokenRequest, callback: (error: grpc.ServiceError | null, response: auth_service_pb.AuthenticateAccessTokenResponse) => void): grpc.ClientUnaryCall;
    authenticateAccessToken(request: auth_service_pb.AuthenticateAccessTokenRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: auth_service_pb.AuthenticateAccessTokenResponse) => void): grpc.ClientUnaryCall;
    authenticateAccessToken(request: auth_service_pb.AuthenticateAccessTokenRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: auth_service_pb.AuthenticateAccessTokenResponse) => void): grpc.ClientUnaryCall;
    findRolePermission(request: auth_service_pb.FindRolePermissionRequest, callback: (error: grpc.ServiceError | null, response: auth_service_pb.RolePermission) => void): grpc.ClientUnaryCall;
    findRolePermission(request: auth_service_pb.FindRolePermissionRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: auth_service_pb.RolePermission) => void): grpc.ClientUnaryCall;
    findRolePermission(request: auth_service_pb.FindRolePermissionRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: auth_service_pb.RolePermission) => void): grpc.ClientUnaryCall;
}

export class AuthServiceClient extends grpc.Client implements IAuthServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public findUserById(request: auth_service_pb.FindByIdRequest, callback: (error: grpc.ServiceError | null, response: user_pb.User) => void): grpc.ClientUnaryCall;
    public findUserById(request: auth_service_pb.FindByIdRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: user_pb.User) => void): grpc.ClientUnaryCall;
    public findUserById(request: auth_service_pb.FindByIdRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: user_pb.User) => void): grpc.ClientUnaryCall;
    public createUser(request: user_pb.CreateUserRequest, callback: (error: grpc.ServiceError | null, response: user_pb.User) => void): grpc.ClientUnaryCall;
    public createUser(request: user_pb.CreateUserRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: user_pb.User) => void): grpc.ClientUnaryCall;
    public createUser(request: user_pb.CreateUserRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: user_pb.User) => void): grpc.ClientUnaryCall;
    public findUserByEmail(request: user_pb.FindUserByEmailRequest, callback: (error: grpc.ServiceError | null, response: user_pb.User) => void): grpc.ClientUnaryCall;
    public findUserByEmail(request: user_pb.FindUserByEmailRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: user_pb.User) => void): grpc.ClientUnaryCall;
    public findUserByEmail(request: user_pb.FindUserByEmailRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: user_pb.User) => void): grpc.ClientUnaryCall;
    public authenticateAccessToken(request: auth_service_pb.AuthenticateAccessTokenRequest, callback: (error: grpc.ServiceError | null, response: auth_service_pb.AuthenticateAccessTokenResponse) => void): grpc.ClientUnaryCall;
    public authenticateAccessToken(request: auth_service_pb.AuthenticateAccessTokenRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: auth_service_pb.AuthenticateAccessTokenResponse) => void): grpc.ClientUnaryCall;
    public authenticateAccessToken(request: auth_service_pb.AuthenticateAccessTokenRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: auth_service_pb.AuthenticateAccessTokenResponse) => void): grpc.ClientUnaryCall;
    public findRolePermission(request: auth_service_pb.FindRolePermissionRequest, callback: (error: grpc.ServiceError | null, response: auth_service_pb.RolePermission) => void): grpc.ClientUnaryCall;
    public findRolePermission(request: auth_service_pb.FindRolePermissionRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: auth_service_pb.RolePermission) => void): grpc.ClientUnaryCall;
    public findRolePermission(request: auth_service_pb.FindRolePermissionRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: auth_service_pb.RolePermission) => void): grpc.ClientUnaryCall;
}
