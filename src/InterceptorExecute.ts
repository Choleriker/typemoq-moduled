import { MockException, MockExceptionReason } from './Error/MockException';
import { IProxyCall } from './Proxy/IProxyCall';
import { ICallContext } from './Proxy/ICallContext';
import { Times } from './Times';
import { CurrentInterceptContext } from './CurrentInterceptContext';
import { AddActualInvocation, ExtractProxyCall, ExecuteCall, InvokeBase, HandleMockRecursion } from './InterceptorStrategies';
import { IMock } from './IMock';
import { InterceptorContext, IInterceptStrategy, InterceptionAction } from './InterceptorContext';
import { ICallInterceptor } from './Proxy/ICallInterceptor';
import { MockBehavior } from './Mock';
import * as _ from 'lodash';


export class InterceptorExecute<T> implements ICallInterceptor {
    private _interceptorContext: InterceptorContext<T>;

    constructor(behavior: MockBehavior, mock: IMock<T>) {
        this._interceptorContext = new InterceptorContext(behavior, mock);
    }

    get interceptorContext(): InterceptorContext<T> { return this._interceptorContext; }

    intercept(invocation: ICallContext) {
        let localCtx = new CurrentInterceptContext();

        _.some(this.interceptionStrategies(), (strategy: IInterceptStrategy<T>) => {
            if (InterceptionAction.Stop === strategy.handleIntercept(invocation, this.interceptorContext, localCtx)) {
                return true;
            }
        });
    }

    addCall(call: IProxyCall<T>): void {
        this._interceptorContext.addOrderedCall(call);
    }

    verifyCall<T>(call: IProxyCall<T>, times: Times): void {
        let actualCalls: Array<ICallContext> = this._interceptorContext.actualInvocations();

        let callCount = _.filter(actualCalls, c => call.matches(c)).length;

        if (!times.verify(callCount)) {
            this.throwVerifyCallException(call.setupCall, times);
        }
    }

    verify(): void {
        let orderedCalls: Array<IProxyCall<T>> = this._interceptorContext.orderedCalls();

        let verifiables = _.filter(orderedCalls, c => c.isVerifiable);

        _.forEach(verifiables, v => {
            this.verifyCall(v, v.expectedCallCount);
        });
    }

    private interceptionStrategies(): _.List<IInterceptStrategy<T>> {
        let strategies: _.List<IInterceptStrategy<T>> = [
            new AddActualInvocation(),
            new ExtractProxyCall(),
            new ExecuteCall(),
            new InvokeBase(),
            new HandleMockRecursion()
        ];
        return strategies;
    }

    private throwVerifyCallException(call: ICallContext, times: Times) {
        let e = new MockException(MockExceptionReason.VerificationFailed,
            call, 'VerifyCall Exception', times.failMessage);
        throw e;
    }

}
