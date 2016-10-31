import { IVerifies } from './IVerifies';
import { IReturnsThrows } from './IReturns';
import { ICallback } from './ICallback';

export interface ISetup<T, TResult> extends ICallback<T, TResult>, IReturnsThrows<T, TResult>, IVerifies { }

