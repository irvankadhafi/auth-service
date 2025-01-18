import * as grpc from '@grpc/grpc-js';
import { Metadata } from '@grpc/grpc-js';
import { Context } from '@/utils/context';
import {Role} from "@/utils/constants";

export const internalServiceMiddleware = (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>, next: () => void) => {
    const metadata = call.metadata;

    // Cek apakah permintaan berasal dari internal service
    const isInternalService = metadata.get('x-internal-service').includes('true');

    if (isInternalService) {
        // Set role INTERNAL_SERVICE di context
        Context.run({
            user: {
                userId: 0,
                role: Role.INTERNAL_SERVICE,
                permissions: new Map<string, Set<string>>() // Bypass RBAC
            }
        }, next);
    } else {
        next();
    }
};