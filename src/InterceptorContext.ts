import { IProxyCall } from './Proxy/IProxyCall';
import { ICallContext } from './Proxy/ICallContext';
import { IMock } from './IMock';
import { CurrentInterceptContext } from './CurrentInterceptContext';
import { MockBehavior } from './Mock';
import * as _ from 'lodash';

export enum InterceptionAction { Continue, Stop }

export interface IInterceptStrategy<T> {
    handleIntercept(invocation: ICallContext, ctx: InterceptorContext<T>, localCtx: CurrentInterceptContext<T>): InterceptionAction;
}

export class InterceptorContext<T> {
    private _actualInvocations: Array<ICallContext> = [];
    private _orderedCalls: Array<IProxyCall<T>> = [];

    constructor(public behavior: MockBehavior, public mock: IMock<T>) { }

    addInvocation(invocation: ICallContext) { this._actualInvocations.push(invocation); }
    actualInvocations() { return this._actualInvocations; }
    clearInvocations() { this._actualInvocations = []; }

    addOrderedCall(call: IProxyCall<T>) { this._orderedCalls.push(call); }
    removeOrderedCall(call: IProxyCall<T>) {
        _.filter(this._orderedCalls, (x: IProxyCall<T>) => {
            return x.id !== call.id;
        });
    }
    orderedCalls() { return this._orderedCalls; }
}

