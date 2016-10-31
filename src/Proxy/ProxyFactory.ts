import { Proxy } from './Proxy';
import { ICallInterceptor } from './ICallInterceptor';
import { IProxyFactory } from './IProxyFactory';

export class ProxyFactory implements IProxyFactory {
    createProxy<T>(interceptor: ICallInterceptor, instance: T): T {
        let proxy: T = <T><any>Proxy.of(instance, interceptor);
        return proxy;
    }
}
