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

function serialize_auth_FindByIDRequest(arg) {
  if (!(arg instanceof auth_pb.FindByIDRequest)) {
    throw new Error('Expected argument of type auth.FindByIDRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_auth_FindByIDRequest(buffer_arg) {
  return auth_pb.FindByIDRequest.deserializeBinary(new Uint8Array(buffer_arg));
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
  findUserByID: {
    path: '/auth.AuthService/FindUserByID',
    requestStream: false,
    responseStream: false,
    requestType: auth_pb.FindByIDRequest,
    responseType: auth_pb.User,
    requestSerialize: serialize_auth_FindByIDRequest,
    requestDeserialize: deserialize_auth_FindByIDRequest,
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
