
export class Log {

    private _className: string;
    private _methodName: string;
    private _paramName: string;
    private _value: any;

    private constructor(className: string, methodName: string, paramName: string, value: any) {
        this._className = className;
        this._methodName = methodName;
        this._paramName = paramName;
        this._value = value;
    }

    public static of(className: string, methodName: string, paramName: string, value: any): Log {
        return new Log(className, methodName, paramName, value);
    }

    get className(): string {
        return this._className;
    }

    set className(value: string) {
        this._className = value;
    }

    get methodName(): string {
        return this._methodName;
    }

    set methodName(value: string) {
        this._methodName = value;
    }

    get paramName(): string {
        return this._paramName;
    }

    set paramName(value: string) {
        this._paramName = value;
    }

    get value(): any {
        return this._value;
    }

    set value(value: any) {
        this._value = value;
    }

}