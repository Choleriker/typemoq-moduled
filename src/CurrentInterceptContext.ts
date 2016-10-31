import { IProxyCall } from './Proxy/IProxyCall';

export class CurrentInterceptContext<T> {
    call: IProxyCall<T>;
}
