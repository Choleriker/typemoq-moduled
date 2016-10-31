import { ISetup } from './Api/ISetup';
import { IThrowsResult } from './Api/IThrows';
import { IReturnsThrows, IReturnsResult } from './Api/IReturns';
import { ICallContext } from './Proxy/ICallContext';
import { Mock } from './Mock';
import { MethodCall } from './MethodCall';
import { IFuncN, IFunc2, IActionN } from './Common';

export class MethodCallReturn<T, TResult> extends MethodCall<T, TResult> implements ISetup<T, TResult>, IReturnsResult<T> {

    protected _returnValueFunc: IFuncN<any, TResult>;
    hasReturnValue: boolean;
    protected _callBase: boolean;
    private readonly _overrideTarget: boolean;

    constructor(mock: Mock<T>, setupExpression: IFunc2<T, TResult>) {
        super(mock, setupExpression);

        this._overrideTarget = !mock.isGlobalInstance;
    }

    // overrides

    execute(call: ICallContext): void {
        super.execute(call);

        if (this._callBase)
            call.invokeBase(); else
            if (this.hasReturnValue)
                call.returnValue = this._returnValueFunc.apply(this, call.args);
    }

    // ISetup

    callback(action: IActionN<any>): IReturnsThrows<T, TResult> {
        this._setupCallback = action;
        return this;
    }

    throws(exception: Error): IThrowsResult {
        this._thrownException = exception;
        return this;
    }

    returns(valueFunc: IFuncN<any, TResult>): IReturnsResult<T> {
        this._returnValueFunc = valueFunc;
        this.hasReturnValue = true;
        if (this._overrideTarget) {
            let obj: Object = this.mock.targetInstance;
            let name: string = this.setupCall.property.name;
            let desc: PropertyDescriptor = this.setupCall.property.desc;
            if (desc) {
                desc.value = this._returnValueFunc;
                Object.defineProperty(obj, name, desc);
            }
        }
        return this;
    }

    callBase(): IReturnsResult<T> {
        this._callBase = true;
        return this;
    }
}
