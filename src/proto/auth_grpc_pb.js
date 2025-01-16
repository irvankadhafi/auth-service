// GENERATED CODE -- DO NOT EDIT!

// Original file comments:
// proto/auth.proto
'use strict';
var grpc = require('@grpc/grpc-js');
var auth_pb = require('./auth_pb.js');

function serialize_auth_AuthenticateAccessTokenRequest(arg) {
  if (!(arg instanceof auth_pb.AuthenticateAccessTokenRequest)) {
    throw new Error('Expected argument of type auth.AuthenticateAccessTokenRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_auth_AuthenticateAccessTokenRequest(buffer_arg) {
  return auth_pb.AuthenticateAccessTokenRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_auth_FindByIdRequest(arg) {
  if (!(arg instanceof auth_pb.FindByIdRequest)) {
    throw new Error('Expected argument of type auth.FindByIdRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_auth_FindByIdRequest(buffer_arg) {
  return auth_pb.FindByIdRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_auth_FindRolePermissionRequest(arg) {
  if (!(arg instanceof auth_pb.FindRolePermissionRequest)) {
    throw new Error('Expected argument of type auth.FindRolePermissionRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_auth_FindRolePermissionRequest(buffer_arg) {
  return auth_pb.FindRolePermissionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_auth_RolePermission(arg) {
  if (!(arg instanceof auth_pb.RolePermission)) {
    throw new Error('Expected argument of type auth.RolePermission');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_auth_RolePermission(buffer_arg) {
  return auth_pb.RolePermission.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_auth_User(arg) {
  if (!(arg instanceof auth_pb.User)) {
    throw new Error('Expected argument of type auth.User');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_auth_User(buffer_arg) {
  return auth_pb.User.deserializeBinary(new Uint8Array(buffer_arg));
}


var AuthServiceService = exports.AuthServiceService = {
  findUserById: {
    path: '/auth.AuthService/FindUserById',
    requestStream: false,
    responseStream: false,
    requestType: auth_pb.FindByIdRequest,
    responseType: auth_pb.User,
    requestSerialize: serialize_auth_FindByIdRequest,
    requestDeserialize: deserialize_auth_FindByIdRequest,
    responseSerialize: serialize_auth_User,
    responseDeserialize: deserialize_auth_User,
  },
  authenticateAccessToken: {
    path: '/auth.AuthService/AuthenticateAccessToken',
    requestStream: false,
    responseStream: false,
    requestType: auth_pb.AuthenticateAccessTokenRequest,
    responseType: auth_pb.User,
    requestSerialize: serialize_auth_AuthenticateAccessTokenRequest,
    requestDeserialize: deserialize_auth_AuthenticateAccessTokenRequest,
    responseSerialize: serialize_auth_User,
    responseDeserialize: deserialize_auth_User,
  },
  findRolePermission: {
    path: '/auth.AuthService/FindRolePermission',
    requestStream: false,
    responseStream: false,
    requestType: auth_pb.FindRolePermissionRequest,
    responseType: auth_pb.RolePermission,
    requestSerialize: serialize_auth_FindRolePermissionRequest,
    requestDeserialize: deserialize_auth_FindRolePermissionRequest,
    responseSerialize: serialize_auth_RolePermission,
    responseDeserialize: deserialize_auth_RolePermission,
  },
};

exports.AuthServiceClient = grpc.makeGenericClientConstructor(AuthServiceService);
