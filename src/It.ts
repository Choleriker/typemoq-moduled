import { MatchPred } from './Match/MatchPred';
import { MatchAnyObject, MatchAnyString, MatchAnyNumber, MatchAny } from './Match/MatchAny';
import { MatchValue } from './Match/MatchValue';
import { IMatch } from './Match/IMatch';
import { Ctor, IFunc2 } from './Common';

export class It {

    static isValue<T>(x: T): T {
        let matcher: IMatch = new MatchValue(x);
        return <any>matcher;
    }

    static isAnyObject<T>(x: Ctor<T>): T {
        let matcher: IMatch = new MatchAnyObject(x);
        return <any>matcher;
    }

    static isAny(): any {
        let matcher: IMatch = new MatchAny();
        return <any>matcher;
    }

    static isAnyString(): string {
        let matcher: IMatch = new MatchAnyString();
        return <any>matcher;
    }

    static isAnyNumber(): number {
        let matcher: IMatch = new MatchAnyNumber();
        return <any>matcher;
    }

    static is<T>(predicate: IFunc2<T, boolean>): T {
        let matcher: IMatch = new MatchPred(predicate);
        return <any>matcher;
    }
}
