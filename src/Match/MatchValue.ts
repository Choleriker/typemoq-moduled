﻿import { Consts } from './../Consts';
import { IMatch } from './IMatch';
import * as _ from 'lodash';

export class MatchValue<T> implements IMatch {

    readonly ___id = Consts.IMATCH_ID_VALUE;

    constructor(private _value: T) {
    }

    ___matches(object: any): boolean {
        let match = false;
        if (_.isEqual(this._value, object))
            match = true;
        return match;
    }
}
