import { IAction } from '../Common';
export interface IUsingResult {
    with(action: IAction): void;
}
