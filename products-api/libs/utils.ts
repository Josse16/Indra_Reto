const REGION = 'us-east-1';

let _region: string | undefined = undefined;

export function getVariable(variable: string): string {
    const value = process.env[variable];

    if (!value) {
        throw new InternalServerError(`GET_VARIABLE_${variable}`, `Variable not exist: ${variable}`);
    }

    return value;
}

export class GenericError extends Error {
    readonly httpStatus: number = 999;
    readonly errorCode: string;
    readonly userMessage: string;
    readonly systemMessage: string;

    constructor(errorCode: string, systemMessage: string, userMessage?: string) {
        super(systemMessage);
        this.errorCode = `ERROR_${this.httpStatus}_${errorCode}`;
        this.systemMessage = systemMessage;
        this.userMessage = userMessage ?? systemMessage;

        Object.setPrototypeOf(this, GenericError.prototype);
    }
}

export class InternalServerError extends GenericError {
    readonly httpStatus = 500;

    constructor(errorCode: string, systemMessage: string, userMessage?: string) {
        super(errorCode, systemMessage, userMessage);

        Object.setPrototypeOf(this, InternalServerError.prototype);
    }
}