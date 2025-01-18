// src/delivery/grpc/interceptors/internalServiceInterceptor.ts
import * as grpc from '@grpc/grpc-js';
import { Context } from '@/utils/context';
import { User } from '@/domain/entities/user.entity';
import { Role } from '@/utils/constants';

export const internalServiceInterceptor = (
    handler: (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) => void
) => {
    return (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) => {
        const metadata = call.metadata;

        // Cek apakah permintaan berasal dari internal service
        const isInternalService = metadata.get('x-internal-service').includes('true');

        if (isInternalService) {
            // Buat instance User untuk internal service
            const internalServiceUser = new User();
            internalServiceUser.id = 0; // User ID khusus untuk internal service
            internalServiceUser.role = Role.INTERNAL_SERVICE;

            // Set user di context
            Context.run({ user: internalServiceUser }, () => {
                // Lanjutkan ke handler
                handler(call, callback);
            });
        } else {
            // Lanjutkan tanpa mengubah context
            handler(call, callback);
        }
    };
};