// GENERATED CODE -- DO NOT EDIT!

// package: auth
// file: auth_service.proto

import * as auth_service_pb from "./auth_service_pb";
import * as user_pb from "./user_pb";
import * as grpc from "@grpc/grpc-js";

interface IAuthServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
  findUserById: grpc.MethodDefinition<auth_service_pb.FindByIdRequest, user_pb.User>;
  createUser: grpc.MethodDefinition<user_pb.CreateUserRequest, user_pb.User>;
  findUserByEmail: grpc.MethodDefinition<user_pb.FindUserByEmailRequest, user_pb.User>;
  authenticateAccessToken: grpc.MethodDefinition<auth_service_pb.AuthenticateAccessTokenRequest, auth_service_pb.AuthenticateAccessTokenResponse>;
  findRolePermission: grpc.MethodDefinition<auth_service_pb.FindRolePermissionRequest, auth_service_pb.RolePermission>;
}

export const AuthServiceService: IAuthServiceService;

export interface IAuthServiceServer extends grpc.UntypedServiceImplementation {
  findUserById: grpc.handleUnaryCall<auth_service_pb.FindByIdRequest, user_pb.User>;
  createUser: grpc.handleUnaryCall<user_pb.CreateUserRequest, user_pb.User>;
  findUserByEmail: grpc.handleUnaryCall<user_pb.FindUserByEmailRequest, user_pb.User>;
  authenticateAccessToken: grpc.handleUnaryCall<auth_service_pb.AuthenticateAccessTokenRequest, auth_service_pb.AuthenticateAccessTokenResponse>;
  findRolePermission: grpc.handleUnaryCall<auth_service_pb.FindRolePermissionRequest, auth_service_pb.RolePermission>;
}

export class AuthServiceClient extends grpc.Client {
  constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
  findUserById(argument: auth_service_pb.FindByIdRequest, callback: grpc.requestCallback<user_pb.User>): grpc.ClientUnaryCall;
  findUserById(argument: auth_service_pb.FindByIdRequest, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<user_pb.User>): grpc.ClientUnaryCall;
  findUserById(argument: auth_service_pb.FindByIdRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<user_pb.User>): grpc.ClientUnaryCall;
  createUser(argument: user_pb.CreateUserRequest, callback: grpc.requestCallback<user_pb.User>): grpc.ClientUnaryCall;
  createUser(argument: user_pb.CreateUserRequest, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<user_pb.User>): grpc.ClientUnaryCall;
  createUser(argument: user_pb.CreateUserRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<user_pb.User>): grpc.ClientUnaryCall;
  findUserByEmail(argument: user_pb.FindUserByEmailRequest, callback: grpc.requestCallback<user_pb.User>): grpc.ClientUnaryCall;
  findUserByEmail(argument: user_pb.FindUserByEmailRequest, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<user_pb.User>): grpc.ClientUnaryCall;
  findUserByEmail(argument: user_pb.FindUserByEmailRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<user_pb.User>): grpc.ClientUnaryCall;
  authenticateAccessToken(argument: auth_service_pb.AuthenticateAccessTokenRequest, callback: grpc.requestCallback<auth_service_pb.AuthenticateAccessTokenResponse>): grpc.ClientUnaryCall;
  authenticateAccessToken(argument: auth_service_pb.AuthenticateAccessTokenRequest, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<auth_service_pb.AuthenticateAccessTokenResponse>): grpc.ClientUnaryCall;
  authenticateAccessToken(argument: auth_service_pb.AuthenticateAccessTokenRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<auth_service_pb.AuthenticateAccessTokenResponse>): grpc.ClientUnaryCall;
  findRolePermission(argument: auth_service_pb.FindRolePermissionRequest, callback: grpc.requestCallback<auth_service_pb.RolePermission>): grpc.ClientUnaryCall;
  findRolePermission(argument: auth_service_pb.FindRolePermissionRequest, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<auth_service_pb.RolePermission>): grpc.ClientUnaryCall;
  findRolePermission(argument: auth_service_pb.FindRolePermissionRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<auth_service_pb.RolePermission>): grpc.ClientUnaryCall;
}
