export class Service {
    isFunctional: boolean;
    isLoggingEnabled: boolean;


    constructor(isFunctional: boolean, isLoggingEnabled: boolean) {
        this.isFunctional = isFunctional;
        this.isLoggingEnabled = isLoggingEnabled;
    }

    toggleFunctional() {
        this.isFunctional = !this.isFunctional;
    }

    doSomething(): void {
        if (this.isLoggingEnabled) {
            console.log(`Service functional: ${this.isFunctional}`)
        }
        if (this.isFunctional) {
            return;
        }
        throw new Error('Internal Error');
    }
}