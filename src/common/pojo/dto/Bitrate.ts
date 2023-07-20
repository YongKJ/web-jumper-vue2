
export class Bitrate {

    private _timer: any | number | null;
    private _bsnow: number | null;
    private _bsbefore: number | null;
    private _tsnow: number | null;
    private _tsbefore: number | null;
    private _value: string;

    public constructor(timer?: any | number | null, bsnow?: number | null, bsbefore?: number | null, tsnow?: number | null, tsbefore?: number | null, value?: string) {
        this._timer = timer || null;
        this._bsnow = bsnow || null;
        this._bsbefore = bsbefore || null;
        this._tsnow = tsnow || null;
        this._tsbefore = tsbefore || null;
        this._value = value || "";
    }

    public static of(timer: any | null, bsnow: number | null, bsbefore: number | null, tsnow: number | null, tsbefore: number | null, value: string): Bitrate {
        return new Bitrate(timer, bsnow, bsbefore, tsnow, tsbefore, value);
    }

    get timer(): any | number | null {
        return this._timer;
    }

    set timer(value: any | number | null) {
        this._timer = value;
    }

    get bsnow(): number | null {
        return this._bsnow;
    }

    set bsnow(value: number | null) {
        this._bsnow = value;
    }

    get bsbefore(): number | null {
        return this._bsbefore;
    }

    set bsbefore(value: number | null) {
        this._bsbefore = value;
    }

    get tsnow(): number | null {
        return this._tsnow;
    }

    set tsnow(value: number | null) {
        this._tsnow = value;
    }

    get tsbefore(): number | null {
        return this._tsbefore;
    }

    set tsbefore(value: number | null) {
        this._tsbefore = value;
    }

    get value(): string {
        return this._value;
    }

    set value(value: string) {
        this._value = value;
    }
}