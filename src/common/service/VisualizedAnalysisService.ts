import {CommonService} from "@/common/service/CommonService";
import {Class} from "@/common/pojo/enum/Class";
import {StreamFile} from "@/common/pojo/dto/StreamFile";
import Vue from "vue";
import {VisualizedAnalysis} from "@/common/pojo/po/VisualizedAnalysis";
import {GenUtil} from "@/common/util/GenUtil";
import autobind from "autobind-decorator";
import Plotly from "plotly.js-dist-min";
import {PlotData, Layout, Config, PlotlyHTMLElement} from "plotly.js-dist-min";
import {ExcelUtil} from "@/common/util/ExcelUtil";
import {FreezeExcelService} from "@/common/service/FreezeExcelService";
import {WallpaperPlusImage} from "@/common/pojo/po/WallpaperPlusImage";

export class VisualizedAnalysisService extends CommonService<VisualizedAnalysisService> {

    private _bgImg: any;
    private _xAxis: string;
    private bgImgIndex: number;
    private _sheetName: string;
    private _percentage: number;
    private _xAxisTitle: string;
    private _yAxisTitle: string;
    private _layoutTitle: string;
    private _yAxis: Array<string>;
    private readonly _url: string;
    private _fields: Array<string>;
    private file: StreamFile | null;
    private _files: Array<StreamFile>;
    private coord: Record<string, any>;
    private _sheetNames: Array<string>;
    private readonly bgImgs: Array<any>;
    private plotly: PlotlyHTMLElement | null;
    private _audios: Array<Record<string, any>>;
    private tempExcelData: Array<Map<string, any>>;
    private readonly coords: Array<Record<string, any>>;
    private readonly excelData: Array<Map<string, any>>;
    private readonly _colors: Array<Record<string, any>>;
    private mapSheets: Map<string, Array<Map<string, any>>>;

    public constructor(vue: Vue) {
        super(vue);
        this._url = "";
        this._xAxis = "";
        this.file = null;
        this.plotly = null;
        this.bgImgIndex = 0;
        this._sheetName = "";
        this._percentage = 25;
        this._xAxisTitle = "";
        this._yAxisTitle = "";
        this._layoutTitle = "";
        this._yAxis = new Array<string>();
        this._fields = new Array<string>();
        this._files = new Array<StreamFile>();
        this._sheetNames = new Array<string>();
        this._bgImg = WallpaperPlusImage.BACKGROUND;
        this.excelData = VisualizedAnalysis.EXCEL_DATA;
        this.tempExcelData = new Array<Map<string, any>>();
        this.mapSheets = new Map<string, Array<Map<string, any>>>();
        this._colors = Array.of(
            {color: '#5cb87a', percentage: 26},
            {color: '#e6a23c', percentage: 51},
            {color: '#1989fa', percentage: 76},
            {color: '#f56c6c', percentage: 100}
        );
        this.coords = Array.of(
            {width: 800, height: 600},
            {width: 1100, height: 700},
            {width: 1500, height: 800},
            {width: 1920, height: 947},
        );
        this.coord = this.coords[0];
        this.bgImgs = Array.of(
            WallpaperPlusImage.BACKGROUND,
            WallpaperPlusImage.BACKGROUND_TWO,
            WallpaperPlusImage.BACKGROUND_THREE,
            WallpaperPlusImage.BACKGROUND_FOUR,
            WallpaperPlusImage.BACKGROUND_FIVE,
            WallpaperPlusImage.BACKGROUND_SIX,
            WallpaperPlusImage.BACKGROUND_SEVEN,
            WallpaperPlusImage.BACKGROUND_EIGHT,
            WallpaperPlusImage.BACKGROUND_NINE,
            WallpaperPlusImage.BACKGROUND_TEN,
            WallpaperPlusImage.BACKGROUND_ELEVEN,
            WallpaperPlusImage.BACKGROUND_TWELVE,
            WallpaperPlusImage.BACKGROUND_THIRTEEN,
            WallpaperPlusImage.BACKGROUND_FOURTEEN,
            WallpaperPlusImage.BACKGROUND_FIFTEEN,
        );
        this._audios = Array.of({
            lrc: "",
            artist: "Jose Feliciano Vs Boney M",
            name: "Feliz Navidad",
            cover: "https://alpine.yongkj.cn/path/view?path=JoKwcghgRg4mAuBTGALANgVQF5oE4HUA1FAZQgFEB3ADwEUA7AIQC0BZARgElrgAmdwgBM0aYIQC28FIRzj8Aa0H4ohUYXph5tLIQDMwcexAAFWgF4zQA",
            url: "https://alpine.yongkj.cn/path/view?path=JoKwcghgRg4mAuBTGALANgVQF5oE4HUA1FAZQgFEB3SgWQBUAxEGgWwA8BHOgEQCFoYAKQASUbgC1BAJTqEA9uJgBGAM4QlaABoZNYaYQAOK4AGsAJirAm0DMPhQmo+NgUJmp4pePhRhYAJZSAAye+HSCaiyCAKxmAExmGFAYwACewG4kvgDGAMxSAHaSMgyU4hhguZ6CPjBszEqCcnTkYADCdCxSwHQFvOKIGIIAMqBgAPJQ5Db47IFxnBlmMGb4MQCKaGYgg4LcoACSSrCEdOsm0TRQjLl0mtkAnAAK6wC8r0A",
        }, {
            lrc: "",
            artist: "爵士轻音乐",
            name: "Feliz Navidad",
            cover: "https://alpine.yongkj.cn/path/view?path=JoKwcghgRg4mAuBTGALANgVQF5oE4HUA1FAZQgFEB3ADwEUA7AIQC0BZARgElrgAmdwgBM0aYIQC28FIRzj8Aa0H4ohUYXph5tLIQDMwcexAAFWgF4zQA",
            url: "https://alpine.yongkj.cn/path/view?path=JoKwcghgRg4mAuBTGALANgVQF5oE4HUA1FAZQgFEB3SgWQBUAxEGgWwA8BHOgYXjRIAaAJTSEATAAc2AaTEBrAKwATEvHgAtAHY1c2QrgCKABgaaMLAIz4AxmIbAoYpRigZgAT2CEVEBhIAiYMIgQuRGAJxAA",
        }, {
            lrc: "",
            artist: "Dido",
            name: "Thank You",
            cover: "https://alpine.yongkj.cn/path/view?path=JoKwcghgRg4mAuBTGALANgVQF5oE4HUA1FAZQgFEB3ADwEUA7AIQC0BZARgElrgAmdwgBM0aYIQC28FIRzj8Aa0H4ohUYXph5tLIQDMwcexAAFWgF4zQA",
            url: "https://alpine.yongkj.cn/path/view?path=JoKwcghgRg4mAuBTGALANgVQF5oE4HUA1FAZQgFEB3SgWQBUAxEGgWwA8BHOgEQCESAxgwAOACQDyMACY0MABgBShYBinT8DAKwBFNMICWNAIyEAdiTkZNUQsPixhKQnIBaWEhhcQhYsy4Ay2M7AcgBKYAAK2gC80UA",
        }, {
            lrc: "",
            artist: "jonny",
            name: "为国写华章",
            cover: "https://alpine.yongkj.cn/path/view?path=JoKwcghgRg4mAuBTGALANgVQF5oE4HUA1FAZQgFEB3ADwEUA7AIQC0BZARgElrgAmdwgBM0aYIQC28FIRzj8Aa0H4ohUYXph5tLIQDMwcexAAFWgF4zQA",
            url: "https://alpine.yongkj.cn/path/view?path=JoKwcghgRg4mAuBTGALANgVQF5oE4HUA1FAZQgFEB3SgWQBUAxEGgWwA8BHOgEQClKAJi17wwdQrwCKWAEIA7MBjYAHMCEIQBdANYBGfPgYQwhbQE86WDACYB+ATSiMAzHQAaAYwCcABUkBefyA",
        });
    }

    public initData(): void {
        this.changeBgImgIndex();
        GenUtil.timer(() => this.getRef("aplayer").play(), 1000);
    }

    public changeBgImgIndex(): void {
        this._bgImg = this.bgImgs[GenUtil.randomNum(0, 14)];
    }

    @autobind
    public async changeFiles(file: StreamFile, fileList: Array<StreamFile>): Promise<void> {
        if (!(file.name.endsWith(".xlsx") || file.name.endsWith(".xls") ||
            file.name.endsWith(".csv") || file.name.endsWith(".json"))) {
            this.warning("数据文件格式仅支持 XLSX、XLS、CSV、JSON！");
            fileList.pop();
            return;
        }
        if (fileList.length > 1) {
            this._files.pop();
            this._files.push(file);
        }
        this.file = file;
        this.resetVisualizedAnalysis();
        this._fields = new Array<string>();
        this.mapSheets = await ExcelUtil.toMapSheet(file.raw);
        this._sheetNames = GenUtil.getKeys(this.mapSheets);
        if (this._sheetNames.length === 1) {
            this._sheetName = this._sheetNames[0];
            this.tempExcelData = <Array<Map<string, any>>>this.mapSheets.get(this._sheetName);
            if (this.tempExcelData.length > 0) {
                this._fields = GenUtil.getKeys(this.tempExcelData[0]);
            }
        }
    }

    private isInputError(): boolean {
        if (this.file == null) {
            this.warning("请先选择本地数据文件！");
            return true;
        }
        if (this._xAxis.length === 0) {
            this.warning("请选择 X 轴方向数据！");
            return true;
        }
        if (this._yAxis.length === 0) {
            this.warning("请选择 Y 轴方向数据！");
            return true;
        }
        return false;
    }

    public async visualizedAnalysis(isDefault?: boolean): Promise<void> {
        if (this.plotly !== null) {
            let flag = this.file == null;
            this.updateTrace(flag).then();
            return;
        }
        if (!isDefault && this.isInputError()) return;
        let config = VisualizedAnalysisService.getConfig();
        let traces = this.getTracesData(isDefault);
        let layout = this.getLayout();
        this.plotly = await Plotly.newPlot("target", traces, layout, config);
    }

    public async updateTrace(isDefault?: boolean): Promise<void> {
        let layout = this.getLayout();
        let traces = this.getTracesData(isDefault);
        let config = VisualizedAnalysisService.getConfig();
        this.plotly = await Plotly.react("target", traces, layout, config);
    }

    private reLayout(): void {
        Plotly.relayout("target", this.getLayout()).then();
    }

    private static getConfig(): Config {
        let config = <Config>{};
        config.modeBarButtonsToAdd = ["toggleSpikelines"];
        return config;
    }

    private getLayout(): Layout {
        let layout = <Layout>{};
        layout.xaxis = {};
        layout.yaxis = {};
        layout.hovermode = "x";
        layout.width = this.coord.width;
        layout.height = this.coord.height;
        layout.showlegend = this._yAxis.length > 1;
        layout.yaxis.title = this._yAxis.length === 1 ? this._yAxis[0] :
            (this._yAxisTitle.length > 0 ? this._yAxisTitle : "training data");
        layout.xaxis.title = this._xAxisTitle.length > 1 ? this._xAxisTitle : this._xAxis;
        layout.title = this._layoutTitle.length > 0 ? this._layoutTitle : "visual analysis of training data";
        return layout;
    }

    private getTracesData(isDefault?: boolean): Array<PlotData> {
        let traces = new Array<PlotData>();
        let xData = (isDefault ? this.excelData : this.tempExcelData)
            .map(data => data.get(this.xAxis));
        let flag = !(typeof isDefault === "undefined" || !isDefault);
        for (let yKey of this._yAxis) {
            traces.push(this.getTraceData(flag, yKey, xData));
        }
        return traces;
    }

    private getTraceData(isDefault: boolean, yKey: string, xData: Array<string>): PlotData {
        let trace = <PlotData>{};
        let yData = (isDefault ? this.excelData : this.tempExcelData)
            .map(data => data.get(yKey));
        trace.showlegend = this._yAxis.length > 1;
        trace.type = "scatter";
        trace.mode = "lines";
        trace.xaxis = "x";
        trace.yaxis = "y";
        trace.name = yKey;
        trace.x = xData;
        trace.y = yData;
        return trace;
    }

    @autobind
    public removeFile(file: StreamFile, fileList: Array<StreamFile>): void {
        this.mapSheets = new Map<string, Array<Map<string, any>>>();
        this.tempExcelData = new Array<Map<string, any>>();
        this._sheetNames = new Array<string>();
        this._fields = new Array<string>();
        this.resetVisualizedAnalysis();
    }

    public uploadFiles(): void {

    }

    public resetVisualizedAnalysis(): void {
        if (this.plotly != null) Plotly.purge("target");
        this._yAxis = new Array<string>();
        this.coord = this.coords[0];
        this._percentage = 25;
        this._layoutTitle = "";
        this._xAxisTitle = "";
        this._yAxisTitle = "";
        this._sheetName = "";
        this.plotly = null;
        this._xAxis = "";
    }

    public switchSheetData(): void {
        if (this.plotly != null) Plotly.purge("target");
        this._yAxis = new Array<string>();
        this.coord = this.coords[0];
        this._percentage = 25;
        this._layoutTitle = "";
        this._xAxisTitle = "";
        this._yAxisTitle = "";
        this.plotly = null;
        this._xAxis = "";
    }

    public async exportExcelOperate(): Promise<void> {
        if (this.mapSheets.size === 0) {
            this.warning("请先选择本地数据文件！");
            return;
        }
        this.getService(FreezeExcelService).freezeExcelVisible = true;
    }

    public async exportExcelData(): Promise<void> {
        let sheetNames = this.getService(FreezeExcelService).names;
        for (let sheetName of sheetNames) {
            this.tempExcelData = <Array<Map<string, any>>>this.mapSheets.get(sheetName);
            let lstKey = GenUtil.getKeys(this.tempExcelData[0]);
            let lstHeader = new Array<Array<string>>();
            for (let key of lstKey) {
                lstHeader.push(Array.of(key));
            }
            let rowIndex = lstHeader[0].length;
            ExcelUtil.writeHeader(lstHeader);
            for (let i = 0; i < this.tempExcelData.length; i++, rowIndex++) {
                for (let j = 0, colIndex = 0; j < lstKey.length; j++, colIndex++) {
                    ExcelUtil.writeCellData(rowIndex, colIndex, this.tempExcelData[i].get(lstKey[j]));
                }
            }
            ExcelUtil.packSheet(sheetName,
                this.getService(FreezeExcelService).dataRow,
                this.getService(FreezeExcelService).dataCol
            );
        }
        let buffer = await ExcelUtil.writeBuffer();
        let url = URL.createObjectURL(new Blob([buffer]));
        let index = this.file?.name.lastIndexOf(".");
        let name = this.file?.name.substring(0, index);
        GenUtil.createLinkTag(url, name + ".xlsx");
    }

    public showDefaultData(): void {
        this.resetVisualizedAnalysis();
        this._layoutTitle = "visual analysis of training data";
        this._fields = GenUtil.getKeys(this.excelData[0]);
        this._yAxisTitle = "training data";
        this._yAxis = Array.of(
            "train_loss", "test_loss",
            "train_acc", "test_acc"
        );
        this.coord = this.coords[0];
        this._xAxisTitle = "epoch";
        this._percentage = 25;
        this._xAxis = "epoch";
        this.visualizedAnalysis(true).then();
    }

    public visualIncrease(): void {
        if (this.plotly == null) {
            if (!this.isInputError()) {
                this.warning("请点击先可视化按钮！");
            }
            return;
        }
        if (this._percentage == 100) return;
        this._percentage += 25;
        let num = this._percentage / 25;
        this.coord = this.coords[num - 1];
        this.reLayout();
    }

    public visualDecrease(): void {
        if (this.plotly == null) {
            if (!this.isInputError()) {
                this.warning("请点击先可视化按钮！");
            }
            return;
        }
        if (this._percentage == 25) return;
        this._percentage -= 25;
        let num = this._percentage / 25;
        this.coord = this.coords[num - 1];
        this.reLayout();
    }

    get audios(): Array<Record<string, any>> {
        return this._audios;
    }

    get bgImg(): any {
        return this._bgImg;
    }

    set bgImg(value: any) {
        this._bgImg = value;
    }

    get sheetName(): string {
        return this._sheetName;
    }

    set sheetName(value: string) {
        this._sheetName = value;
        this.switchSheetData();
        this.tempExcelData = <Array<Map<string, any>>>this.mapSheets.get(this._sheetName);
        if (this.tempExcelData.length > 0) {
            this._fields = GenUtil.getKeys(this.tempExcelData[0]);
        }
    }

    get sheetNames(): Array<string> {
        return this._sheetNames;
    }

    get colors(): Array<Record<string, any>> {
        return this._colors;
    }

    get percentage(): number {
        return this._percentage;
    }

    set percentage(value: number) {
        this._percentage = value;
    }

    get layoutTitle(): string {
        return this._layoutTitle;
    }

    set layoutTitle(value: string) {
        this._layoutTitle = value;
    }

    get xAxisTitle(): string {
        return this._xAxisTitle;
    }

    set xAxisTitle(value: string) {
        this._xAxisTitle = value;
    }

    get yAxisTitle(): string {
        return this._yAxisTitle;
    }

    set yAxisTitle(value: string) {
        this._yAxisTitle = value;
    }

    get yAxis(): Array<string> {
        return this._yAxis;
    }

    set yAxis(value: Array<string>) {
        this._yAxis = value;
    }

    get xAxis(): string {
        return this._xAxis;
    }

    set xAxis(value: string) {
        this._xAxis = value;
    }

    get url(): string {
        return this._url;
    }

    get files(): Array<StreamFile> {
        return this._files;
    }

    set files(value: Array<StreamFile>) {
        this._files = value;
    }

    get fields(): Array<string> {
        return this._fields;
    }

    protected getClassName(): string {
        return Class.VisualizedAnalysisService;
    }

    static get class(): string {
        return Class.VisualizedAnalysisService;
    }

}