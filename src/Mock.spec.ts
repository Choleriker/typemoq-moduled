import { Mock } from './Mock';

describe('Utils', () => {
    describe('Mock', () => {
        it('instanceOf()', () => {
            let mock = Mock.ofInstance(() => -1);

            // record
            mock.setup(x => x()).returns(() => 0);
            // // replay
            expect(mock.object()).toBe(0);
            expect(mock.object()).toBe(0);
            expect(mock.object()).toBe(0);
        });
    });
});
