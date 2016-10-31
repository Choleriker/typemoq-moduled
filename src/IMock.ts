import { Times } from './Times';
import { MethodCallReturn } from './MethodCallReturn';
import { Mock, MockBehavior } from './Mock';
import { IFunc2 } from './Common';

export interface IMock<T> {
    readonly object: T;
    readonly name: string;
    readonly behavior: MockBehavior;
    callBase: boolean;
    setup<TResult>(expression: IFunc2<T, TResult>): MethodCallReturn<T, TResult>;
    verify<TResult>(expression: IFunc2<T, TResult>, times: Times): void;
    verifyAll(): void;
    reset(): void;
}
