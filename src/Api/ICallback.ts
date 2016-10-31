import { IReturnsThrows } from './IReturns';
import { IAction, IAction1 } from '../Common';

export interface ICallback<T, TResult> {
    callback(action: IAction): IReturnsThrows<T, TResult>;
    callback(action: IAction1<T>): IReturnsThrows<T, TResult>;
}
