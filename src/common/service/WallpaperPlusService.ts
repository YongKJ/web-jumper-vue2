import {CommonService} from "@/common/service/CommonService";
import Vue from "vue";
import {Class} from "@/common/pojo/enum/Class";
import {Container, Engine} from "tsparticles-engine";
import {loadFull} from "tsparticles";
import {LogUtil} from "@/common/util/LogUtil";
import {Log} from "@/common/pojo/dto/Log";
import {ParticlesOptions} from "@/common/pojo/po/ParticlesOptions";

export class WallpaperPlusService extends CommonService<WallpaperPlusService> {

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

    public async particlesInit(engine: Engine): Promise<void> {
        await loadFull(engine);
    }

    public async particlesLoaded(container: Container): Promise<void> {
        LogUtil.loggerLine(Log.of("AnimatedWallpaperService", "particlesLoaded", "container", container));
    }

    public getParticlesConfig(): Record<string, any> {
        return ParticlesOptions.STYLE_ONE;
    }

    protected getClassName(): string {
        return Class.WallpaperPlusService;
    }

    static get class(): string {
        return Class.WallpaperPlusService;
    }

}