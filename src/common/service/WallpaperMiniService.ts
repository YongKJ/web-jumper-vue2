import Vue from "vue";
import {CommonService} from "@/common/service/CommonService";
import {Class} from "@/common/pojo/enum/Class";
import {debounce} from "lodash-es";
import {LogUtil} from "@/common/util/LogUtil";
import {Log} from "@/common/pojo/dto/Log";
import {GenUtil} from "@/common/util/GenUtil";

export class WallpaperMiniService extends CommonService<WallpaperMiniService> {

    public constructor(vue: Vue) {
        super(vue);
    }

    public initData(): void {
        window.addEventListener("resize", debounce(async () => {
            let screenHeight = document.documentElement.clientHeight + "px";
            let tempScreenHeight = (document.documentElement.clientHeight + 20) + "px";
            LogUtil.loggerLine(Log.of("WallpaperPlusService", "initData", "screenHeight", screenHeight));
            do {
                await this.setStyleHeight();
                await GenUtil.sleep(333);
                LogUtil.loggerLine(Log.of("WallpaperPlusService", "initData", "styleHeight", WallpaperMiniService.styleHeight()));
            } while (tempScreenHeight !== WallpaperMiniService.styleHeight());
        }, 333));
    }

    private async getVerticalStrip(): Promise<Record<string, any>> {
        let scroll = undefined;
        do {
            scroll = this.getProp("scroll");
            await GenUtil.sleep(10);
        } while (typeof scroll === "undefined");
        if (typeof scroll === "undefined") return {};

        let children = (<Record<string, any>>scroll).$children;
        for (let child of children) {
            let className = <string>child.$el.className;
            if (!className.includes("vertical")) continue;
            return child;
        }
        return {};
    }

    private async setStyleHeight(): Promise<void> {
        let screenHeight = document.documentElement.clientHeight + "px";
        let scroll = <HTMLDivElement>document.getElementsByClassName("happy-scroll")[0];
        scroll.setAttribute("style", "height: " + screenHeight);

        let tempScreenWidth = (document.documentElement.clientWidth + 20) + "px";
        let tempScreenHeight = (document.documentElement.clientHeight + 20) + "px";
        const tempScroll = <HTMLDivElement>document.getElementsByClassName("happy-scroll-container")[0];
        tempScroll.setAttribute("style", "width: " + tempScreenWidth + "; height: " + tempScreenHeight);

        const strip = await this.getVerticalStrip();
        scroll = <HTMLDivElement>document.getElementsByClassName("happy-scroll")[0];
        const slotEle = <HTMLDivElement>document.getElementById("content-details");
        strip.computeStrip(slotEle.scrollHeight, scroll.clientHeight);
    }

    private static styleHeight(): string {
        const scroll = <HTMLDivElement>document.getElementsByClassName("happy-scroll-container")[0];
        return scroll.style.height;
    }

    public getBgImgStyle(bgImg: string): Record<string, any> {
        return {
            backgroundImage: 'url(' + bgImg + ')'
        };
    }

    public getScrollbarHeightStyle(): Record<string, any> {
        let screenHeight = document.documentElement.clientHeight;
        return {
            height: screenHeight + "px",
        };
    }

    public getMainWidthStyle(): Record<string, any> {
        let screenWidth = document.documentElement.clientWidth;
        return {
            width: screenWidth + "px"
        };
    }

    protected getClassName(): string {
        return Class.WallpaperMiniService;
    }

    static get class(): string {
        return Class.WallpaperMiniService;
    }

}