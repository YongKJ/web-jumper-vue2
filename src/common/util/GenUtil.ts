import {DataUtil} from "@/common/util/DataUtil";
import {StreamInfo} from "@/common/pojo/dto/StreamInfo";
import {LogUtil} from "@/common/util/LogUtil";
import {Log} from "@/common/pojo/dto/Log";

export class GenUtil {

    private constructor() {
    }

    public static randomNum(minNum: number, maxNum: number): number {
        switch (arguments.length) {
            case 1:
                return parseInt(String(Math.random() * minNum + 1), 10);
            case 2:
                return parseInt(String(Math.random() * (maxNum - minNum + 1) + minNum), 10);
            default:
                return 0;
        }
    }

    public static async initBitrate(rtcDirec: string, streams: Array<StreamInfo>, transceiver?: RTCRtpTransceiver): Promise<void> {
        if (typeof transceiver === "undefined") return;
        let stream = <StreamInfo>streams.find(stream => stream.rtcDirec === rtcDirec);
        stream.bitrate.value = "0 kbits/sec";
        LogUtil.loggerLine(Log.of("GenUtil", "initBitrate", "transceiver", transceiver));
        if (stream.bitrate.timer) return;
        stream.bitrate.timer = setInterval(async () => {
            let stats = await transceiver.receiver.getStats();
            stats.forEach((res: Record<string, any>) => {
                if (!this.isIncomingMedia(res)) return;
                stream.bitrate.bsnow = res.bytesReceived;
                stream.bitrate.tsnow = res.timestamp;
                if (stream.bitrate.bsbefore === null || stream.bitrate.tsbefore === null) {
                    stream.bitrate.bsbefore = stream.bitrate.bsnow;
                    stream.bitrate.tsbefore = stream.bitrate.tsnow;
                } else {
                    let timePassed = <number>stream.bitrate.tsnow - stream.bitrate.tsbefore;
                    let bitRate = Math.round((<number>stream.bitrate.bsnow - stream.bitrate.bsbefore) * 8 / timePassed);
                    stream.bitrate.value = bitRate + ' kbits/sec';
                    stream.bitrate.bsbefore = stream.bitrate.bsnow;
                    stream.bitrate.tsbefore = stream.bitrate.tsnow;
                }
            });
            LogUtil.loggerLine(Log.of("GenUtil", "initBitrate", "bitrate.value", stream.bitrate.value));
        }, 1000);
    }

    private static isIncomingMedia(res: Record<string, any>): boolean {
        if ((res.mediaType === "video" || res.id.toLowerCase().indexOf("video") > -1) &&
            res.type === "inbound-rtp" && res.id.indexOf("rtcp") < 0) {
            return true;
        } else if (res.type == 'ssrc' && res.bytesReceived &&
            (res.googCodecName === "VP8" || res.googCodecName === "")) {
            return true;
        }
        return false;
    }

    public static timer(func: () => void, time: number): void {
        setTimeout(func, time);
    }

    public static createLinkTag(url: string, fileName: string): void {
        let ele = document.createElement('a');
        ele.download = fileName;
        ele.href = url;
        ele.style.display = 'none';
        document.body.appendChild(ele);
        ele.click();
        document.body.removeChild(ele);
    }

    public static sleep(waitTimeInMs: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, waitTimeInMs));
    }

    public static strToNumber(str?: string | null | number): number {
        return typeof str === "string" ? Number(str) : (typeof str === "undefined" || str == null ? 0 : str);
    }

    public static isJson<T>(obj: T): boolean {
        return typeof obj !== "undefined" && obj !== null && (<Record<string, any>>obj).constructor === {}.constructor;
    }

    public static arrayToObjList<T>(lstData: Array<Record<string, any> | Map<string, any>>, clazz: (new () => T) | T): Array<T> {
        let lstObj = new Array<T>();
        for (let data of lstData) {
            lstObj.push(
                this.isJson(data) ?
                    this.recToObj(data, clazz) :
                    this.mapToObj(<Map<string, any>>data, clazz)
            );
        }
        return lstObj;
    }

    public static mapToObj<T>(mapData: Map<string, any>, clazz: (new () => T) | T): T {
        let entity = typeof clazz === "function" ?
            new (<new () => T>clazz)() : clazz;
        let methodNames = DataUtil.getPrototypes(clazz);
        for (let methodName of methodNames) {
            entity[<keyof T>methodName] = mapData.get(methodName);
        }
        return entity;
    }

    public static recToObj<T>(recData: Record<string, any>, clazz: (new () => T) | T): T {
        let entity = typeof clazz === "function" ?
            new (<new () => T>clazz)() : clazz;
        let methodNames = DataUtil.getPrototypes(clazz);
        for (let methodName of methodNames) {
            entity[<keyof T>methodName] = recData[methodName];
        }
        return entity;
    }

    public static arrayToMapList<T>(lstObj: Array<T>): Array<Map<string, any>> {
        let lstData = new Array<Map<string, any>>();
        for (let obj of lstObj) {
            lstData.push(
                !(this.isJson(obj)) ?
                    this.objToMap(obj) :
                    this.recToMap(obj)
            );
        }
        return lstData;
    }

    public static recToMap(recData: Record<string, any>): Map<string, any> {
        let mapData = new Map<string, any>();
        for (let key of Object.keys(recData)) {
            mapData.set(key, recData[key]);
        }
        return mapData;
    }

    public static objToMap<T>(obj: T): Map<string, any> {
        let mapData = new Map<string, any>();
        let methodNames = DataUtil.getPrototypes(obj);
        for (let methodName of methodNames) {
            mapData.set(methodName, obj[<keyof T>methodName]);
        }
        return mapData;
    }

    public static recToStr(record: Record<string, any> | Array<Record<string, any>>, pretty?: boolean): string {
        return typeof pretty === "undefined" ? JSON.stringify(record) : JSON.stringify(record, null, 2);
    }

    public static arrayToRecList<T>(lstObj: Array<T>): Array<Record<string, any>> {
        let lstData = new Array<Record<string, any>>();
        for (let obj of lstObj) {
            lstData.push(
                !(obj instanceof Map) ?
                    this.objToRecord(obj) :
                    this.mapToRecord(<Map<string, any>>obj)
            );
        }
        return lstData;
    }

    public static objToRecord<T>(obj: T): Record<string, any> {
        let recData: Record<string, any> = {};
        let methodNames = DataUtil.getPrototypes(obj);
        for (let methodName of methodNames) {
            recData[methodName] = obj[<keyof T>methodName];
        }
        return recData;
    }

    public static mapToRecord(mapData: Map<string, any>): Record<string, any> {
        let recData: Record<string, any> = {};
        let regStr = "^[+-]?\\d*(\\.\\d*)?(e[+-]?\\d+)?$";
        let regex = new RegExp(regStr);
        for (let [key, value] of mapData) {
            recData[key] = regex.test(value) ? this.strToNumber(value) : value;
        }
        return recData;
    }

    public static strToRecord(str: string): Record<string, any> | Array<Record<string, any>> {
        return JSON.parse(str);
    }

    public static getKeys(data: Map<string, any> | Record<string, any>): Array<string> {
        if (GenUtil.isJson(data)) {
            return Object.keys(data);
        }
        let lstKey = new Array<string>();
        for (let key of data.keys()) {
            lstKey.push(key);
        }
        return lstKey;
    }

    public static getUrlKey(key: string): string | undefined {
        let url = window.location.href;
        if (url.indexOf("?") !== -1) {
            let cs_str = url.split('?')[1];
            let cs_arr = cs_str.split('&');
            let cs: Record<string, any> = {};
            for (let i = 0; i < cs_arr.length; i++) {
                cs[cs_arr[i].split('=')[0]] = cs_arr[i].split('=')[1];
            }
            return (<Record<string, any>>cs)[key];
        }
        return '';
    }

}