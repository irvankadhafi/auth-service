// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require("@grpc/grpc-js");
var auth_service_pb = require('./auth_service_pb.js');
var user_pb = require('./user_pb.js');

function serialize_auth_AuthenticateAccessTokenRequest(arg) {
  if (!(arg instanceof auth_service_pb.AuthenticateAccessTokenRequest)) {
    throw new Error('Expected argument of type auth.AuthenticateAccessTokenRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_auth_AuthenticateAccessTokenRequest(buffer_arg) {
  return auth_service_pb.AuthenticateAccessTokenRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_auth_AuthenticateAccessTokenResponse(arg) {
  if (!(arg instanceof auth_service_pb.AuthenticateAccessTokenResponse)) {
    throw new Error('Expected argument of type auth.AuthenticateAccessTokenResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_auth_AuthenticateAccessTokenResponse(buffer_arg) {
  return auth_service_pb.AuthenticateAccessTokenResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_auth_CreateUserRequest(arg) {
  if (!(arg instanceof user_pb.CreateUserRequest)) {
    throw new Error('Expected argument of type auth.CreateUserRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_auth_CreateUserRequest(buffer_arg) {
  return user_pb.CreateUserRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_auth_FindByIdRequest(arg) {
  if (!(arg instanceof auth_service_pb.FindByIdRequest)) {
    throw new Error('Expected argument of type auth.FindByIdRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_auth_FindByIdRequest(buffer_arg) {
  return auth_service_pb.FindByIdRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_auth_FindRolePermissionRequest(arg) {
  if (!(arg instanceof auth_service_pb.FindRolePermissionRequest)) {
    throw new Error('Expected argument of type auth.FindRolePermissionRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_auth_FindRolePermissionRequest(buffer_arg) {
  return auth_service_pb.FindRolePermissionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_auth_FindUserByEmailRequest(arg) {
  if (!(arg instanceof user_pb.FindUserByEmailRequest)) {
    throw new Error('Expected argument of type auth.FindUserByEmailRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_auth_FindUserByEmailRequest(buffer_arg) {
  return user_pb.FindUserByEmailRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_auth_RolePermission(arg) {
  if (!(arg instanceof auth_service_pb.RolePermission)) {
    throw new Error('Expected argument of type auth.RolePermission');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_auth_RolePermission(buffer_arg) {
  return auth_service_pb.RolePermission.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_auth_User(arg) {
  if (!(arg instanceof user_pb.User)) {
    throw new Error('Expected argument of type auth.User');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_auth_User(buffer_arg) {
  return user_pb.User.deserializeBinary(new Uint8Array(buffer_arg));
}


// =============================================
// SERVICE DEFINITION
// =============================================
//
var AuthServiceService = exports.AuthServiceService = {
  findUserById: {
    path: '/auth.AuthService/FindUserById',
    requestStream: false,
    responseStream: false,
    requestType: auth_service_pb.FindByIdRequest,
    responseType: user_pb.User,
    requestSerialize: serialize_auth_FindByIdRequest,
    requestDeserialize: deserialize_auth_FindByIdRequest,
    responseSerialize: serialize_auth_User,
    responseDeserialize: deserialize_auth_User,
  },
  createUser: {
    path: '/auth.AuthService/CreateUser',
    requestStream: false,
    responseStream: false,
    requestType: user_pb.CreateUserRequest,
    responseType: user_pb.User,
    requestSerialize: serialize_auth_CreateUserRequest,
    requestDeserialize: deserialize_auth_CreateUserRequest,
    responseSerialize: serialize_auth_User,
    responseDeserialize: deserialize_auth_User,
  },
  findUserByEmail: {
    path: '/auth.AuthService/FindUserByEmail',
    requestStream: false,
    responseStream: false,
    requestType: user_pb.FindUserByEmailRequest,
    responseType: user_pb.User,
    requestSerialize: serialize_auth_FindUserByEmailRequest,
    requestDeserialize: deserialize_auth_FindUserByEmailRequest,
    responseSerialize: serialize_auth_User,
    responseDeserialize: deserialize_auth_User,
  },
  authenticateAccessToken: {
    path: '/auth.AuthService/AuthenticateAccessToken',
    requestStream: false,
    responseStream: false,
    requestType: auth_service_pb.AuthenticateAccessTokenRequest,
    responseType: auth_service_pb.AuthenticateAccessTokenResponse,
    requestSerialize: serialize_auth_AuthenticateAccessTokenRequest,
    requestDeserialize: deserialize_auth_AuthenticateAccessTokenRequest,
    responseSerialize: serialize_auth_AuthenticateAccessTokenResponse,
    responseDeserialize: deserialize_auth_AuthenticateAccessTokenResponse,
  },
  findRolePermission: {
    path: '/auth.AuthService/FindRolePermission',
    requestStream: false,
    responseStream: false,
    requestType: auth_service_pb.FindRolePermissionRequest,
    responseType: auth_service_pb.RolePermission,
    requestSerialize: serialize_auth_FindRolePermissionRequest,
    requestDeserialize: deserialize_auth_FindRolePermissionRequest,
    responseSerialize: serialize_auth_RolePermission,
    responseDeserialize: deserialize_auth_RolePermission,
  },
};

exports.AuthServiceClient = grpc.makeGenericClientConstructor(AuthServiceService);
