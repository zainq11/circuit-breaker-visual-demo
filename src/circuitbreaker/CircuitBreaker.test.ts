import {CallNotAllowedError, CircuitBreaker} from './CircuitBreaker';

test('simple pass through when closed', () => {
    let cb = new CircuitBreaker(1000, 2);
    const message = 'hello world';
    let protectedCall = CircuitBreaker.decorate(cb, () => message);

    expect(protectedCall()).toBe(message);
})

test('circuit trips when failure threshold reached', () => {
    let cb = new CircuitBreaker(1000, 1);
    let protectedCall = CircuitBreaker.decorate(cb, () => {
        throw new TypeError()
    });

    expect(protectedCall).toThrowError(TypeError);
    expect(protectedCall).toThrowError(CallNotAllowedError);
    expect(protectedCall).toThrowError(CallNotAllowedError);

})