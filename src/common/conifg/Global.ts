
export class Global {

    private static readonly _LOG_ENABLE: boolean = true;
    private static readonly _WEBRTC_PEER_BASE_URL = "https://esc.yongkj.cn";
    private static readonly _JANUS_GATEWAY_BASE_URL = "wss://janus.yongkj.cn";
    // private static readonly _JANUS_GATEWAY_BASE_URL = "wss://janus.conf.meetecho.com/ws";
    // private static readonly _JANUS_GATEWAY_BASE_URL = "wss://audio.whaleshub.cn:8989";

    static get LOG_ENABLE(): boolean {
        return this._LOG_ENABLE;
    }

    static get WEBRTC_PEER_BASE_URL(): string {
        return this._WEBRTC_PEER_BASE_URL;
    }

    static get JANUS_GATEWAY_BASE_URL(): string {
        return this._JANUS_GATEWAY_BASE_URL;
    }
}