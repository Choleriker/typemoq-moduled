import { ICallContext } from './ICallContext';
import { Times } from './../Times';
import { IAction1 } from '../Common';

export interface IProxyCall<T> {
    id: string;
    setupExpression: IAction1<T>;
    setupCall: ICallContext;
    isVerifiable: boolean;
    expectedCallCount: Times;
    isInvoked: boolean;
    callCount: number;
    evaluatedSuccessfully(): void;

    matches(call: ICallContext): boolean;
    execute(call: ICallContext): void;
}

