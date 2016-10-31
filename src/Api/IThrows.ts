import { Exception } from './../Error/Exception';
import { IVerifies } from './IVerifies';

export interface IThrows {
    throws<T extends Exception>(exception: T): IThrowsResult;
}

export interface IThrowsResult extends IVerifies {
}
