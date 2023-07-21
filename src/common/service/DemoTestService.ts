import {CommonService} from "@/common/service/CommonService";
import Vue from "vue";
import {Class} from "@/common/pojo/enum/Class";
import {LogUtil} from "@/common/util/LogUtil";
import {Log} from "@/common/pojo/dto/Log";
import {WallpaperPlusService} from "@/common/service/WallpaperPlusService";
import {DemoTest} from "@/common/pojo/po/DemoTest";
import {StreamFile} from "@/common/pojo/dto/StreamFile";
import {ExcelUtil} from "@/common/util/ExcelUtil";
import autobind from "autobind-decorator";
import {GenUtil} from "@/common/util/GenUtil";

export class DemoTestService extends CommonService<DemoTestService> {

    private _key: number;
    private _url: string;
    private _show: boolean;
    private _pageSize: number;
    private _userName: string;
    private _password: string;
    private _musicFlag: boolean;
    private _pageNumber: number;
    private _totalRecord: number;
    private _files: Array<StreamFile>;
    private _audios: Array<Record<string, any>>;
    private excelFile: Array<Map<string, any>>;

    public constructor(vue: Vue) {
        super(vue);
        this._key = 1;
        this._url = "";
        this._show = false;
        this._userName = "";
        this._password = "";
        this._pageSize = 10;
        this._pageNumber = 1;
        this._musicFlag = true;
        this._totalRecord = 30;
        this.excelFile = DemoTest.EXCEL_FILE;
        this._files = new Array<StreamFile>();
        this._audios = Array.of({
            lrc: "",
            artist: "本兮",
            name: "让寂寞别走",
            cover: "https://m.yongkj.cn/audio_default.png",
            url: "https://file.yongkj.cn/fileSystem/admin/Music/%E6%9C%AC%E5%85%AE%20-%20%E8%AE%A9%E5%AF%82%E5%AF%9E%E5%88%AB%E8%B5%B0%20%20mqms2%20.mp3",
        }, {

            lrc: "",
            artist: "本兮&单小源",
            name: "你在看孤独的风景",
            cover: "https://m.yongkj.cn/audio_default.png",
            url: "https://file.yongkj.cn/fileSystem/admin/Music/%E6%9C%AC%E5%85%AE%26%E5%8D%95%E5%B0%8F%E6%BA%90%20-%20%E4%BD%A0%E5%9C%A8%E7%9C%8B%E5%AD%A4%E7%8B%AC%E7%9A%84%E9%A3%8E%E6%99%AF%20%20mqms2%20.mp3",
        });
    }

    public initData(): void {
        GenUtil.timer(() => this.getRef("aplayer").play(), 300);
        this.getService(WallpaperPlusService).on("test", msg => {
            this.info(msg);
            LogUtil.loggerLine(Log.of("DemoTestService", "testEvent", "msg", msg));
        });
        // LogUtil.loggerLine(Log.of("DemoTestService", "initData", "message", this.vue.$message));
        LogUtil.loggerLine(Log.of("DemoTestService", "initData", "excelFile", this.excelFile));
        LogUtil.loggerLine(Log.of("DemoTestService", "initData", "vue", this.vue));
        LogUtil.loggerLine(Log.of("DemoTestService", "initData", "WallpaperPlusService", this.getService(WallpaperPlusService)));
    }

    public changeFiles(file: StreamFile, fileList: Array<StreamFile>): void {
        DemoTestService.readExcel(file.raw).then();
        LogUtil.loggerLine(Log.of("JanusStreamTestService", "changeFiles", "file", file));
        LogUtil.loggerLine(Log.of("JanusStreamTestService", "changeFiles", "fileList", fileList));
    }

    private static async readExcel(excel: File): Promise<void> {
        let lstData = await ExcelUtil.toMap(excel, 0);
        LogUtil.loggerLine(Log.of("JanusStreamTestService", "changeFiles", "lstData", lstData));
    }

    public uploadFiles(): void {

    }

    public reset(): void {

    }

    public register(): void {

    }

    public login(): void {

    }

    public connect(): void {

    }

    public disconnect(): void {

    }

    public handleButtonClick(): void {
        this._show = true;
        this._userName = "Hello world!";
        this._password = "Hello world!";
        // this.service.userName = "Hello world!";
        // this.service.password = "Hello world!";
        this.getService(WallpaperPlusService).emit("test", "Hello world！");
    }

    @autobind
    public pageNumberChange(pageNumber: number): void {
        LogUtil.loggerLine(Log.of("DemoTestService", "pageNumberChange", "pageNumber", pageNumber));
    }

    public pageSizeChange(pageSize: number): void {
        LogUtil.loggerLine(Log.of("DemoTestService", "pageSizeChange", "pageSize", pageSize));
    }

    get pageSize(): number {
        return this._pageSize;
    }

    get totalRecord(): number {
        return this._totalRecord;
    }

    get show(): boolean {
        return this._show;
    }

    get key(): number {
        return this._key;
    }

    get pageNumber(): number {
        return this._pageNumber;
    }

    set pageNumber(value: number) {
        this._pageNumber = value;
    }

    get audios(): Array<Record<string, any>> {
        return this._audios;
    }

    get musicFlag(): boolean {
        return this._musicFlag;
    }

    get userName(): string {
        return this._userName;
    }

    set userName(value: string) {
        this._userName = value;
    }

    get password(): string {
        return this._password;
    }

    set password(value: string) {
        this._password = value;
    }

    get files(): Array<StreamFile> {
        return this._files;
    }

    set files(value: Array<StreamFile>) {
        this._files = value;
    }

    get url(): string {
        return this._url;
    }

    protected getClassName(): string {
        return Class.DemoTestService;
    }

    static get class(): string {
        return Class.DemoTestService;
    }

}