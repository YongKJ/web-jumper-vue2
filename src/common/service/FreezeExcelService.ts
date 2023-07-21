import {VisualizedAnalysisService} from "@/common/service/VisualizedAnalysisService";
import {CommonService} from "@/common/service/CommonService";
import {Class} from "@/common/pojo/enum/Class";
import Vue from "vue";

export class FreezeExcelService extends CommonService<FreezeExcelService> {

    private _dataRow: string;
    private _dataCol: string;
    private _names: Array<string>;
    private _sheetNames: Array<string>;
    private _freezeExcelVisible: boolean;

    public constructor(vue: Vue) {
        super(vue);
        this._dataRow = "";
        this._dataCol = "";
        this._freezeExcelVisible = false;
        this._names = new Array<string>();
        this._sheetNames = new Array<string>();
    }

    public async freezeExcelChange(): Promise<void> {
        await this.getService(VisualizedAnalysisService).exportExcelData();
        this.dialogCloseChange();
    }

    public dialogCancelChange(): void {
        this.info("取消导出！");
        this.dialogCloseChange();
    }

    public dialogCloseChange(doneFunc?: () => void): void {
        this._dataRow = "";
        this._dataCol = "";
        this._freezeExcelVisible = false;
        if (typeof doneFunc !== "undefined") doneFunc();
    }

    get freezeExcelVisible(): boolean {
        return this._freezeExcelVisible;
    }

    get dataRow(): string {
        return this._dataRow;
    }

    set dataRow(value: string) {
        this._dataRow = value;
    }

    get dataCol(): string {
        return this._dataCol;
    }

    set dataCol(value: string) {
        this._dataCol = value;
    }

    set freezeExcelVisible(value: boolean) {
        this._dataRow = "";
        this._dataCol = "";
        this._freezeExcelVisible = value;
        this._names = new Array<string>();
        this._sheetNames = this.getService(VisualizedAnalysisService).sheetNames;
        if (this._sheetNames.length === 1) this._names = Array.of(this._sheetNames[0]);
    }

    get sheetNames(): Array<string> {
        return this._sheetNames;
    }

    get names(): Array<string> {
        return this._names;
    }

    set names(value: Array<string>) {
        this._names = value;
    }

    protected getClassName(): string {
        return Class.FreezeExcelService;
    }

    static get class(): string {
        return Class.FreezeExcelService;
    }

}