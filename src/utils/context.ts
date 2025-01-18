// src/utils/context.ts
import { AsyncLocalStorage } from 'node:async_hooks';
import { User } from '@/domain/entities/user.entity';

interface RequestContext {
    user: User | null;
}

const asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

export const Context = {
    run: (context: RequestContext, callback: () => void) => {
        asyncLocalStorage.run(context, callback);
    },
    get: (): RequestContext | undefined => {
        return asyncLocalStorage.getStore();
    },
    setUser: (user: User | null) => {
        const store = asyncLocalStorage.getStore();
        if (store) {
            store.user = user;
        }
    },
    getUser: (): User | null => {
        const store = asyncLocalStorage.getStore();
        return store?.user || null;
    },
};