
export class StreamFile {

    private _name: string;
    private _percentage: number;
    private _raw: File;
    private _size: number;
    private _status: string;
    private _uid: number;

    public constructor(name?: string, percentage?: number, raw?: File, size?: number, status?: string, uid?: number) {
        this._name = name || "";
        this._percentage = percentage || 0;
        this._raw = raw || new File([], "");
        this._size = size || 0;
        this._status = status || "";
        this._uid = uid || 0;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get percentage(): number {
        return this._percentage;
    }

    set percentage(value: number) {
        this._percentage = value;
    }

    get raw(): File {
        return this._raw;
    }

    set raw(value: File) {
        this._raw = value;
    }

    get size(): number {
        return this._size;
    }

    set size(value: number) {
        this._size = value;
    }

    get status(): string {
        return this._status;
    }

    set status(value: string) {
        this._status = value;
    }

    get uid(): number {
        return this._uid;
    }

    set uid(value: number) {
        this._uid = value;
    }
}