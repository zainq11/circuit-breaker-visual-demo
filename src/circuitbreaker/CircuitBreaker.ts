export type Supplier<T> = () => T;

export class CallNotAllowedError extends Error {
}

export class CircuitBreaker {
    resetTimeout: number;
    failureThreshold: number;
    failureCounter: number;
    lastFailureTime: number | null;
    state: 'OPEN' | 'CLOSED' | 'HALF-OPEN';

    static decorate<T>(circuitBreaker: CircuitBreaker, t: Supplier<T>): Supplier<T> {
        return () => {
            const state = circuitBreaker.state;
            switch (state) {
                case 'OPEN':
                    if (circuitBreaker.lastFailureTime != null
                        && Date.now() - circuitBreaker.lastFailureTime > circuitBreaker.resetTimeout) {
                        circuitBreaker.state = 'HALF-OPEN';
                    }
                    throw new CallNotAllowedError('circuit open');
                    break;
                case 'CLOSED':
                case 'HALF-OPEN':
                    try {
                        const result = t();
                        if (state === 'HALF-OPEN') {
                            circuitBreaker.reset();
                        }
                        return result;
                    } catch (e) {
                        console.log('Recording failure', circuitBreaker.failureCounter);
                        circuitBreaker.recordFailure();
                        throw e;
                    }
                    break;
                default:
                    throw new TypeError('Incorrect circuit breaker state');
                    break;
            }
        }
    }

    constructor(resetTimeout: number, failureThreshold: number) {
        this.resetTimeout = resetTimeout;
        this.failureThreshold = failureThreshold;
        this.failureCounter = 0;
        this.lastFailureTime = null;
        this.state = 'CLOSED';
    }

    // state(): 'OPEN' | 'CLOSED' | 'HALF-OPEN' {
    //     if (this.failureCounter >= this.failureThreshold) {
    //         if (this.lastFailureTime != null && Date.now() - this.lastFailureTime > this.resetTimeout) {
    //             return 'HALF-OPEN';
    //         }
    //         return 'OPEN';
    //     }
    //     return 'CLOSED';
    // }

    recordFailure(): void {
        this.failureCounter++;
        this.lastFailureTime = Date.now();
        if (this.failureCounter >= this.failureThreshold) {
            this.state = 'OPEN';
        }
    }

    reset(): void {
        this.failureCounter = 0;
        this.lastFailureTime = null;
        this.state = 'CLOSED';
    }
}
