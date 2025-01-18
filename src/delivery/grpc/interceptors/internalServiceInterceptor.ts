// src/delivery/grpc/interceptors/internalServiceInterceptor.ts
import * as grpc from '@grpc/grpc-js';
import { Context } from '@/utils/context';

export const internalServiceInterceptor = (
    handler: (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) => void
) => {
    return (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) => {
        const metadata = call.metadata;

        // Cek apakah permintaan berasal dari internal service
        const isInternalService = metadata.get('x-internal-service').includes('true');

        if (isInternalService) {
            // Set role INTERNAL_SERVICE di context
            Context.run({
                user: {
                    userId: 0, // User ID khusus untuk internal service
                    role: 'INTERNAL_SERVICE',
                    permissions: new Map<string, Set<string>>() // Bypass RBAC
                }
            }, () => {
                // Lanjutkan ke handler
                handler(call, callback);
            });
        } else {
            // Lanjutkan tanpa mengubah context
            handler(call, callback);
        }
    };
};