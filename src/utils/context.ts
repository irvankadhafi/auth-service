// src/utils/context.ts
import { AsyncLocalStorage } from 'node:async_hooks';

interface RequestContext {
    user: {
        userId: number;
        role: string;
        permissions: Map<string, Set<string>>; // Map<Resource, Set<Action>>
    } | null;
}

const asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

export const Context = {
    run: (context: RequestContext, callback: () => void) => {
        asyncLocalStorage.run(context, callback);
    },
    get: (): RequestContext | undefined => {
        return asyncLocalStorage.getStore();
    },
    set: (key: keyof RequestContext, value: any) => {
        const store = asyncLocalStorage.getStore();
        if (store) {
            store[key] = value;
        }
    },
};