# typemoq-moduled

This is a mocking framework for typescript and a port of the excellent implementation of [typemoq](https://github.com/florinn/typemoq). This original typemoq implementation was not working for me for testing angular 2 application code.

## Installation

Use NPM to install typemoq-moduled:

```cmd
npm install --save-dev typemoq-moduled 
```

### Usage

For detailed information how to use [typemoq](https://github.com/florinn/typemoq) review their [github repository](https://github.com/florinn/typemoq).

> You dont need to use the TypeMoq namespace export as described on their site. All needed classes and enums exported directly from the NPM package. You can use it as follows in your script:

```typescript
import { Mock, It } from 'typemoq-moduled';

let mock = Mock.ofInstance(() => -1);
// record
mock.setup(x => x()).returns(() => 0);
// replay
expect(mock.object()).toBe(0);
expect(mock.object()).toBe(0);
expect(mock.object()).toBe(0);

```

This is the ported record / replay example from the [typemoq repo](https://github.com/florinn/typemoq).
