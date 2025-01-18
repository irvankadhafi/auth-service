// src/delivery/grpc/utils/handlerWrapper.ts
import * as grpc from '@grpc/grpc-js';
import { internalServiceInterceptor } from '../interceptors/internalServiceInterceptor';
import {loggingInterceptor} from "@/delivery/grpc/interceptors/loggingInterceptor";

export const wrapHandler = (
    handler: (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) => void
) => {
    return internalServiceInterceptor(loggingInterceptor(handler));
};