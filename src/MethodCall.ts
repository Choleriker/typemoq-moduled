import { MatchValue } from './Match/MatchValue';
import { IMatch } from './Match/IMatch';
import { MockException, MockExceptionReason } from './Error/MockException';
import { Exception } from './Error/Exception';
import { ICallContext } from './Proxy/ICallContext';
import { IVerifies } from './Api/IVerifies';
import { IProxyCall } from './Proxy/IProxyCall';
import { Times } from './Times';
import { Consts } from './Consts';
import { Mock } from './Mock';
import { InterceptorSetup } from './InterceptorSetup';
import { IAction, IFunc2, IAction1 } from './Common';
import * as _ from 'lodash';

export class MethodCall<T, TResult> implements IProxyCall<T>, IVerifies {

    protected _id: string;
    protected _setupCall: ICallContext;
    protected _setupCallback: IAction;
    protected _isVerifiable: boolean;
    protected _expectedCallCount: Times;
    protected _isInvoked: boolean;
    protected _callCount: number = 0;
    protected _thrownException: Exception;
    protected _evaluatedSuccessfully: boolean;

    constructor(public mock: Mock<T>, private _setupExpression: IFunc2<T, TResult>) {
        this._id = this.generateId();

        let interceptor = new InterceptorSetup();
        let proxy = Mock.proxyFactory.createProxy<T>(interceptor, mock.targetInstance);

        _setupExpression(proxy);

        if (interceptor.interceptedCall) {
            let ic = interceptor.interceptedCall;

            let newArgs = this.transformToMatchers(ic.args);
            Object.defineProperty(newArgs, 'callee',
                { get: () => ic.args.callee, set: value => null });
            ic.args = <IArguments><any>newArgs;

            this._setupCall = ic;
        } else {
            throw new MockException(MockExceptionReason.InvalidSetup,
                this._setupExpression, 'InvalidSetupExpression Exception', 'Invalid setup expression');
        }
    }

    // IProxyCall

    get id(): string { return this._id; }
    get setupExpression(): IAction1<T> { return this._setupExpression; }
    get setupCall(): ICallContext { return this._setupCall; }
    get isVerifiable(): boolean { return this._isVerifiable; }
    get expectedCallCount(): Times { return this._expectedCallCount; }
    get isInvoked(): boolean { return this._isInvoked; }
    get callCount(): number { return this._callCount; }

    evaluatedSuccessfully() {
        this._evaluatedSuccessfully = true;
    }

    matches(call: ICallContext): boolean {
        let match = false;

        if (this._setupCall.property && call && call.property &&
            this._setupCall.property.name === call.property.name) {

            if (this._setupCall.args.length === call.args.length) {

                match = true;

                _.each(this.setupCall.args, (x, index) => {
                    let setupArg = <IMatch>x;
                    let callArg = call.args[index];

                    if (match && !setupArg.___matches(callArg))
                        match = false;
                });

            }
        }

        return match;
    }

    execute(call: ICallContext): void {
        this._isInvoked = true;

        if (this._setupCallback != null) {
            this._setupCallback.apply(this, call.args);
        }

        if (this._thrownException != null) {
            throw this._thrownException;
        }

        this._callCount++;
    }

    // IVerifies

    verifiable(times: Times = Times.atLeastOnce()): void {
        this._isVerifiable = true;
        this._expectedCallCount = times;
    }

    private generateId() {
        return 'MethodCall<' + _.uniqueId() + '>';
    }

    private transformToMatchers(args: IArguments): Array<IMatch> {
        let newArgs: Array<IMatch> = [];

        _.each(args, a => {
            if (!_.isObject(a)) {
                let newArg = new MatchValue(a);
                newArgs.push(newArg);
            } else {
                if (!_.isUndefined(a[Consts.IMATCH_MATCHES_NAME]) &&
                    !_.isUndefined(a[Consts.IMATCH_ID_NAME]) && a[Consts.IMATCH_ID_NAME] === Consts.IMATCH_ID_VALUE) {
                    newArgs.push(<IMatch>a);
                } else {
                    throw new MockException(MockExceptionReason.InvalidMatcher,
                        a, 'InvalidMatcher Exception', 'Invalid match object');
                }
            }
        });

        return newArgs;
    }

}

