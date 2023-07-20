import {BaseService} from "@/common/service/BaseService";
import {GenUtil} from "@/common/util/GenUtil";
import EventEmitter2 from "eventemitter2";
import Vue from "vue";
import {LogUtil} from "@/common/util/LogUtil";
import {Log} from "@/common/pojo/dto/Log";
import {Message} from "element-ui";

export abstract class CommonService<U> extends EventEmitter2 implements BaseService<U> {

    private readonly _vue: Vue;
    public static service: CommonService<any>;
    private static readonly _emitter = new EventEmitter2();
    private static readonly mapVue = new Map<string, Vue>();
    private static readonly mapData = new Map<string, any>();

    protected constructor(vue: Vue) {
        super();
        this._vue = vue;
        if (CommonService.mapVue.size === 0) CommonService.service = this;
        CommonService.mapVue.set(this.getServiceName() + (this.getProp("index") || 0), this.vue);
    }

    private getVue(name: string, index?: number): Vue {
        index = index || (name === this.getServiceName() ? (this.getProp("index") || 0) : 0);
        return <Vue>CommonService.mapVue.get(name + index);
    }

    private getServiceName(className?: string): string {
        if (typeof className === "undefined") {
            className = this.getClassName();
        }
        return className[0].toLowerCase() + className.substring(1);
    }

    protected abstract getClassName(): string;

    public hasService<T extends CommonService<any>>(clazz: new (vue: Vue) => T, index?: number): boolean {
        let serviceName = this.getServiceName((<Record<string, any>>clazz).class);
        let vue = this.getVue(serviceName, index || 0);
        return typeof vue !== "undefined";
    }

    public getService<T extends CommonService<any>>(clazz: new (vue: Vue) => T, index?: number): T {
        let serviceName = this.getServiceName((<Record<string, any>>clazz).class);
        let vue = this.getVue(serviceName, index || 0);
        return (<Record<string, any>>vue)[serviceName];
    }

    public success(msg: string) {
        Message.success(msg);
    }

    public warning(msg: string) {
        Message.warning(msg);
    }

    public error(msg: string) {
        Message.error(msg);
    }

    public info(msg: string) {
        Message.info(msg);
    }

    public toWebrtc(): void {
        this.toRouter("/webrtc");
    }

    public toStream(): void {
        this.toRouter("/stream");
    }

    public toAudio(): void {
        this.toRouter("/audio");
    }

    public toJanus(): void {
        this.toRouter("/janus");
    }

    public toTest() {
        this.toRouter("/test");
    }

    protected toRouter(path: string, query?: Record<string, any>): void {
        let uid = GenUtil.getUrlKey("uid");
        if (typeof uid !== "undefined" && uid.length > 0) {
            typeof query === "undefined" ? query = {uid: uid} : query.uid = uid;
        }
        this.vue.$router.push(typeof query === "undefined" ? {path: path} : {path: path, query: query}).then();
    }

    get service(): U {
        return (<Record<string, any>>this.vue)[this.getServiceName()];
    }

    get routerName(): string {
        return <string>this.vue.$router.currentRoute.name;
    }

    public getValue(name: string): any {
        return (<Record<string, any>>this.vue)[name];
    }

    public getProp(name: string): any {
        return this.vue.$props ? this.vue.$props[name] : undefined;
    }

    public getRef(name: string): any {
        return this.vue.$refs[name];
    }

    get emitter(): EventEmitter2 {
        return CommonService._emitter;
    }

    get vue(): Vue {
        return this._vue;
    }

}