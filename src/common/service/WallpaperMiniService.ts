import Vue from "vue";
import {CommonService} from "@/common/service/CommonService";
import {Class} from "@/common/pojo/enum/Class";

export class WallpaperMiniService extends CommonService<WallpaperMiniService> {

    public constructor(vue: Vue) {
        super(vue);
    }

    public initData(): void {
        this.screenResizeWatch();
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