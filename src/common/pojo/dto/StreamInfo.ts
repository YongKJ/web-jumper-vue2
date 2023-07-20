import {Bitrate} from "@/common/pojo/dto/Bitrate";

export class StreamInfo {

    private _bitrate: Bitrate;
    private _rtcDirec: string;
    private _stream: MediaStream;

    public constructor(bitrate?: Bitrate, rtcDirec?: string, stream?: MediaStream) {
        this._rtcDirec = rtcDirec || "";
        this._bitrate = bitrate || new Bitrate();
        this._stream = stream || new MediaStream();
    }

    public static of(rtcDirec: string, stream: MediaStream, bitrate?: Bitrate): StreamInfo {
        return new StreamInfo(bitrate, rtcDirec, stream);
    }

    get bitrate(): Bitrate {
        return this._bitrate;
    }

    set bitrate(value: Bitrate) {
        this._bitrate = value;
    }

    get rtcDirec(): string {
        return this._rtcDirec;
    }

    set rtcDirec(value: string) {
        this._rtcDirec = value;
    }

    get stream(): MediaStream {
        return this._stream;
    }

    set stream(value: MediaStream) {
        this._stream = value;
    }
}