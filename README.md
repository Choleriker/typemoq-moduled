# typemoq-moduled

This is a mocking framework for typescript and a port of the excellent implementation of [typemoq](https://github.com/florinn/typemoq). This original typemoq implementation was not usable with my angular 2 application.

## Why?

Someone maybe will ask why we need a mocking framework for untyped languages like javascript. We can simply mock like this:

```typescript
let mockedObject = {
    methodToMock: () => {}
}

```
And your mock is finished.

> But is untyped, you have no automatic refactoring possibility later on the original object.

But what is with the new spyOn() provided by jasmine which is used in many applications?

> The spys are attached in an intyped way too.

## Installation

Use NPM to install typemoq-moduled:

```cmd
npm install --save-dev typemoq-moduled 
```

## Usage

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
