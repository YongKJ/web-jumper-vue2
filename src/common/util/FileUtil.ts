import PathUtil from "path";
import fs from "fs";
import {LogUtil} from "./LogUtil";
import {Log} from "../pojo/dto/Log";
import path from "path";

export class FileUtil {

    private constructor() {
    }

    public static appDir(isProd?: boolean): string {
        let launchName = require.main?.filename;
        if (typeof launchName === "undefined") {
            launchName = __filename;
        }
        let appDir = PathUtil.dirname(launchName);
        if (isProd) return appDir;
        return PathUtil.dirname(appDir);
    }

    public static getAbsPath(isProd: boolean, ...names: string[]): string {
        let path = this.appDir(isProd);
        for (let name of names) {
            path += PathUtil.sep + name;
        }
        return path;
    }

    public static exist(fileName: string): boolean {
        return fs.existsSync(fileName);
    }

    public static readFile(fileName: string): string {
        let fileContent = fs.readFileSync(fileName, 'binary');
        return Buffer.from(fileContent, 'binary').toString("base64");
    }

    public static read(fileName: string): string {
        return fs.readFileSync(fileName, "utf-8");
    }

    public static write(fileName: string, content: string): void {
        fs.writeFileSync(fileName, content);
    }

    public static list(fileName: string): Array<string> {
        try {
            fs.accessSync(fileName, fs.constants.R_OK);
            return fs.readdirSync(fileName);
        } catch (e) {
            LogUtil.loggerLine(Log.of("FileUtil", "list", "e", e));
            return new Array<string>();
        }
    }

    public static isFolder(fileName: string): boolean {
        return fs.statSync(fileName).isDirectory();
    }

    public static modDate(fileName: string): Date {
        return fs.statSync(fileName).mtime;
    }

    public static size(fileName: string): number {
        if (this.isFolder(fileName)) {
            return this.sizeFolder(fileName);
        }
        return fs.statSync(fileName).size;
    }

    public static mkdir(fileName: string): void {
        if (!this.exist(fileName)) {
            fs.mkdirSync(fileName, {recursive: true})
        }
    }

    public static copy(srcFileName: string, desFileName: string): void {
        if (this.isFolder(srcFileName)) {
            this.mkdir(desFileName);
            this.copyFolder(srcFileName, desFileName);
        } else {
            fs.copyFileSync(srcFileName, desFileName);
        }
    }

    private static copyFolder(srcFolderName: string, desFolderName: string): void {
        let files = this.list(srcFolderName);
        for (let file of files) {
            let srcNewFileName = srcFolderName + path.sep + file;
            let desNewFileName = desFolderName + path.sep + file;
            if (this.isFolder(srcNewFileName)) {
                this.mkdir(desNewFileName);
                this.copyFolder(srcNewFileName, desNewFileName);
            } else {
                this.copy(srcNewFileName, desNewFileName);
            }
        }
    }

    private static sizeFolder(fileName: string): number {
        let folderSize = 0;
        let files = this.list(fileName);
        for (let file of files) {
            let tempFileName = fileName + path.sep + file;
            if (this.isFolder(tempFileName)) {
                folderSize += this.sizeFolder(tempFileName);
            } else {
                folderSize += this.size(tempFileName);
            }
        }
        return folderSize;
    }

    public static modFile(path: string, regStr: string, value: string, isAll?: boolean): void {
        this.modifyFile(path, regStr, () => value, isAll);
    }

    public static modifyFile(path: string, regStr: string, valueFunc: (matchStr?: string) => string, isAll?: boolean): void {
        let regex = isAll ? new RegExp(regStr, "g") : new RegExp(regStr);
        let content = this.read(path).replace(regex, (allStr,  matchStr) => valueFunc(matchStr));
        this.write(path, content);
    }

    public static modContent(path: string, regStr: string, value: string, isAll?: boolean): void {
        this.modify(path, regStr, () => value, isAll);
    }

    public static modify(path: string, regStr: string, valueFunc: (matchStr?: string) => string, isAll?: boolean): void {
        let content = this.read(path);
        let contentArray = content.includes("\r\n") ?
            content.split("\r\n") : content.split("\n");
        let regex = new RegExp(regStr);
        for (let line of contentArray) {
            if (!regex.test(line)) continue;
            let lstMatch = line.match(regex);
            if (lstMatch == null) continue;
            let newLine = line.replace(lstMatch[1], valueFunc(lstMatch[1]));
            content = content.replace(line, newLine);
            if (typeof isAll === "undefined" || !isAll) {
                break;
            }
        }
        this.write(path, content);
    }

}