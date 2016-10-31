import { It } from './It';
import { Mock, MockBehavior } from './Mock';
import { Times } from './Times';
import { GlobalMock } from './GlobalMock';
import { GlobalScope } from './GlobalScope';
import { MockException, MockExceptionReason } from './Error/MockException';

export class TypeMoq {
    static Mock = Mock;
    static MockBehavior = MockBehavior;
    static It = It;
    static Times = Times;
    static GlobalMock = GlobalMock;
    static GlobalScope = GlobalScope;
    static MockException = MockException;
    static MockExceptionReason = MockExceptionReason;
}
