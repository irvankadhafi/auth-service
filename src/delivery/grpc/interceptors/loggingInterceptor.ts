import * as grpc from '@grpc/grpc-js';

export const loggingInterceptor = (
    handler: (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) => void
) => {
    return (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) => {
        console.log(`Received request for method: ${call.getPath()}`);
        handler(call, callback);
    };
};