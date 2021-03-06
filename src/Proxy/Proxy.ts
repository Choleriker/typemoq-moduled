﻿import { MockException, MockExceptionReason } from './../Error/MockException';
import { ICallContext } from './ICallContext';
import {
    MethodInfo,
    MethodInvocation,
    PropertyInfo,
    ValueGetterInvocation,
    ValueSetterInvocation,
    MethodGetterInvocation,
    MethodSetterInvocation
} from './Invocation';
import { Utils } from './../Common/Utils';
import { Consts } from './../Consts';
import { PropertyRetriever } from './../Common/PropertyRetriever';
import { ICallInterceptor } from './ICallInterceptor';
import { IProxy } from './IProxy';
import * as _ from 'lodash';

export class Proxy<T> implements IProxy {

    readonly ___id = Consts.IPROXY_ID_VALUE;

    static of<U>(instance: U, interceptor: ICallInterceptor): Proxy<U> {
        Proxy.check(instance);

        let result: any;

        if (_.isFunction(instance)) {
            let funcName = Utils.functionName(instance);
            result = Proxy.methodProxyValue(interceptor, instance, funcName, null);
        } else {
            result = new Proxy(interceptor, instance);
        }

        return result;
    }

    static isProxy(obj: any): boolean {
        if (!_.isUndefined(obj) &&
            !_.isUndefined(obj[Consts.IPROXY_ID_NAME]) && obj[Consts.IPROXY_ID_NAME] === Consts.IPROXY_ID_VALUE) {
            return true;
        } else {
            return false;
        }
    }

    private static check<U>(instance: U): void {
        Proxy.checkNotNull(instance);

        // allow only primitive objects and functions
        let ok = false;
        if (_.isFunction(instance) ||
            (_.isObject(instance) && !Proxy.isPrimitiveObject(instance)))
            ok = true;

        if (!ok)
            throw new MockException(MockExceptionReason.InvalidProxyArg,
                instance, 'InvalidProxyArgument Exception', 'Argument should be a function or a non primitive object');
    }

    private static checkNotNull<U>(instance: U): void {
        if (_.isNull(instance))
            throw new MockException(MockExceptionReason.InvalidProxyArg,
                instance, 'InvalidProxyArgument Exception', 'Argument cannot be null');
    }

    private static isPrimitiveObject(obj: Object): boolean {
        let result = false;

        if (_.isFunction(obj) ||
            _.isArray(obj) ||
            _.isDate(obj) ||
            _.isNull(obj))
            result = true;

        return result;
    }

    private static methodProxyValue<U>(
        interceptor: ICallInterceptor,
        instance: U,
        propName: string,
        propDesc: PropertyDescriptor): () => any {

        function proxy() {
            let method = new MethodInfo(instance, propName, propDesc);
            let invocation: ICallContext = new MethodInvocation(method, arguments);
            interceptor.intercept(invocation);
            return invocation.returnValue;
        }
        return proxy;
    }

    private check<U>(instance: U): void {
        Proxy.checkNotNull(instance);

        // allow only non primitive objects
        let ok = false;
        if (!_.isFunction(instance) &&
            (_.isObject(instance) && !Proxy.isPrimitiveObject(instance)))
            ok = true;

        if (!ok)
            throw new MockException(MockExceptionReason.InvalidProxyArg,
                instance, 'InvalidProxyArgument Exception', 'Argument should be a non primitive object');
    }

    private constructor(interceptor: ICallInterceptor, instance: T) {
        this.check(instance);
        let that = this;

        let props = PropertyRetriever.getOwnAndPrototypeEnumerablesAndNonenumerables(instance);
        _.each(props, prop => {

            if (_.isFunction(prop.desc.value)) {
                let propDesc: PropertyDescriptor = {
                    configurable: prop.desc.configurable,
                    enumerable: prop.desc.enumerable,
                    writable: prop.desc.writable
                };

                this.defineMethodProxy(that, interceptor, instance, prop.name, propDesc);
            } else {
                let propDesc: PropertyDescriptor = {
                    configurable: prop.desc.configurable,
                    enumerable: prop.desc.enumerable
                };

                if (prop.desc.value !== undefined) {
                    this.defineValuePropertyProxy(that, interceptor, instance, prop.name, prop.desc.value, propDesc);
                } else {
                    this.defineGetSetPropertyProxy(that, interceptor, instance, prop.name, prop.desc.get, prop.desc.set, propDesc);
                }
            }

        });
    }

    private defineMethodProxy(
        that: Object,
        interceptor: ICallInterceptor,
        instance: T,
        propName: string,
        propDesc: PropertyDescriptor = { configurable: false, enumerable: true, writable: false }) {

        propDesc.value = Proxy.methodProxyValue(interceptor, instance, propName, propDesc);

        this.defineProperty(that, propName, propDesc);
    }

    private defineValuePropertyProxy(
        that: Object,
        interceptor: ICallInterceptor,
        instance: T,
        propName: string,
        propValue: any,
        propDesc: PropertyDescriptor = { configurable: false, enumerable: true }) {

        function getProxy(): any {
            let method = new PropertyInfo(instance, propName);
            let invocation: ICallContext = new ValueGetterInvocation(method, propValue);
            interceptor.intercept(invocation);
            return invocation.returnValue;
        }
        propDesc.get = getProxy;

        function setProxy(v: any): void {
            let method = new PropertyInfo(instance, propName);
            let invocation: ICallContext = new ValueSetterInvocation(method, arguments);
            interceptor.intercept(invocation);
        }
        propDesc.set = setProxy;

        this.defineProperty(that, propName, propDesc);
    }

    private defineGetSetPropertyProxy(
        that: Object,
        interceptor: ICallInterceptor,
        instance: T,
        propName: string,
        get?: () => any,
        set?: (v: any) => void,
        propDesc: PropertyDescriptor = { configurable: false, enumerable: true }) {

        function getProxy(): any {
            let method = new PropertyInfo(instance, propName);
            let invocation: ICallContext = new MethodGetterInvocation(method, get);
            interceptor.intercept(invocation);
            return invocation.returnValue;
        }
        propDesc.get = getProxy;

        function setProxy(v: any): void {
            let method = new PropertyInfo(instance, propName);
            let invocation: ICallContext = new MethodSetterInvocation(method, set, arguments);
            interceptor.intercept(invocation);
        }
        propDesc.set = setProxy;

        this.defineProperty(that, propName, propDesc);
    }

    private defineProperty(obj: Object, name: string, desc: PropertyDescriptor) {
        try {
            Object.defineProperty(obj, name, desc);
        } catch (e) {
            console.log(e.message);
        }
    }
}
