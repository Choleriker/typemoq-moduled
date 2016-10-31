import { ICallContext } from './Proxy/ICallContext';
import { MockException, MockExceptionReason } from './Error/MockException';
import { ICallInterceptor } from './Proxy/ICallInterceptor';

export class InterceptorSetup<T> implements ICallInterceptor {
    private _interceptedCall: ICallContext;

    get interceptedCall() { return this._interceptedCall; }

    intercept(invocation: ICallContext) {
        if (this._interceptedCall) {
            throw new MockException(MockExceptionReason.MoreThanOneSetup,
                invocation, 'MoreThanOneSetupExpression Exception', 'Setup should contain only one expression');
        }

        this._interceptedCall = invocation;
    }
}
