import {AddWorksheetOptions, Cell, CellValue, Column, Style, Workbook, Worksheet, WorksheetViewFrozen} from "exceljs";
import {ReadableWebToNodeStream} from "readable-web-to-node-stream";
import {FileUtil} from "@/common/util/FileUtil";
import {Coords} from "../pojo/po/Coords";
import {GenUtil} from "@/common/util/GenUtil";
import * as XLSX from "xlsx";
import {WorkSheet} from "xlsx";

export class ExcelUtil {

    //写workbook
    private static workbook: Workbook | null = null;
    //行高
    private static height: number = 36;
    //数据行
    private static dataRow: number = -1;
    //自动设置列宽
    private static widthAuto: boolean = true;
    //单元格合并列表
    private static lstRange: Array<Record<string, any>> = [];
    //列宽列表
    private static lstColInfo: Array<Column> = [];
    //行高列表
    private static lstRowInfo: Array<Record<string, any>> = [];
    //列表冻结
    private static freezeInfo = <AddWorksheetOptions>{};
    //单元格数据列表
    private static lstValue: Array<Array<Cell>> = [];
    //图片数据列表
    private static lstPicture: Array<Record<string, any>> = [];
    //样式列表
    private static lstCellStyle: Array<Style> = [];
    //移动方向：上、右、下、左
    private static readonly MOVE: Array<Array<number>> = [[0, 1], [1, 0], [0, -1], [-1, 0]];

    private static async getBuffer(excel: File): Promise<ArrayBuffer> {
        const reader = new FileReader();
        reader.readAsArrayBuffer(excel);
        return new Promise<ArrayBuffer>(resolve => {
            reader.onload = e => resolve(<Buffer>e.target?.result);
        });
    }

    private static async getSheetByExceljs(excel: string | File, sheetName: string | number): Promise<Worksheet> {
        if (typeof excel === "string") {
            if (excel.endsWith(".csv")) {
                return await new Workbook().csv.readFile(excel);
            } else {
                let workbook = await new Workbook().xlsx.readFile(excel);
                if (typeof sheetName === "number") sheetName += 1;
                return workbook.getWorksheet(sheetName);
            }
        } else {
            if (excel.name.endsWith(".csv")) {
                return await new Workbook().csv.read(
                    <any>new ReadableWebToNodeStream(excel.stream())
                );
            } else {
                let workbook = await new Workbook().xlsx.load(await excel.arrayBuffer());
                if (typeof sheetName === "number") sheetName += 1;
                return workbook.getWorksheet(sheetName);
            }
        }
    }

    private static async getSheetBySheetjs(excel: string | File, sheetName: string | number): Promise<WorkSheet> {
        let workbook = typeof excel === "string" ? XLSX.readFile(excel) : XLSX.read(await excel.arrayBuffer());
        sheetName = typeof sheetName === "number" ? workbook.SheetNames[sheetName] : sheetName;
        return workbook.Sheets[sheetName];
    }

    private static async getSheetJson(excel: string | File, sheetName: string | number): Promise<Array<Array<any>>> {
        let name = typeof excel === "string" ? excel : excel.name;
        let sheet = name.endsWith(".xls") ? await this.getSheetBySheetjs(excel, sheetName) :
            await this.getSheetByExceljs(excel, sheetName);
        this.lstRange = (!name.endsWith(".xls") ? this.getMerges(<Worksheet>sheet) : (<WorkSheet>sheet)["!merges"]) || [];
        return !name.endsWith(".xls") ? <Array<Array<any>>>sheet.getSheetValues() :
            <Array<Array<any>>>XLSX.utils.sheet_to_json(sheet, {header: 1});
    }

    public static async toMapSheet(excel: string | File, headerRow?: number, headerCol?: number, headerLastCol?: number, dataRow?: number, dataLastRow?: number, extraData?: Map<string, string>): Promise<Map<string, Array<Map<string, string | number>>>> {
        if (typeof excel !== "string" && excel.name.endsWith(".json")) {
            let recData = <Array<Record<string, any>>>GenUtil.strToRecord(await excel.text());
            return new Map<string, Array<Map<string, string | number>>>([
                ["Sheet0", GenUtil.arrayToMapList(recData)]
            ]);
        }
        let workbook = typeof excel === "string" ? XLSX.readFile(excel) : XLSX.read(
            excel.name.endsWith(".csv") ? await excel.text() : await excel.arrayBuffer(),
            excel.name.endsWith(".csv") ? {type: "string"} : undefined
        );
        let mapSheet = new Map<string, Array<Map<string, string | number>>>();
        for (let sheetName of workbook.SheetNames) {
            let sheet = workbook.Sheets[sheetName];
            let sheetData = await this.toMapBySheet(
                sheet, headerRow,
                headerCol, headerLastCol,
                dataRow, dataLastRow, extraData
            );
            mapSheet.set(sheetName, sheetData);
        }
        return mapSheet;
    }

    public static async toMap(excel: string | File, sheetName: string | number, headerRow?: number, headerCol?: number, headerLastCol?: number, dataRow?: number, dataLastRow?: number, extraData?: Map<string, string>): Promise<Array<Map<string, string | number>>> {
        let sheet = await this.getSheetBySheetjs(excel, sheetName);
        return this.toMapBySheet(sheet, headerRow, headerCol, headerLastCol, dataRow, dataLastRow, extraData);
    }

    //获取excel表数据
    private static async toMapBySheet(sheet: WorkSheet, headerRow?: number, headerCol?: number, headerLastCol?: number, dataRow?: number, dataLastRow?: number, extraData?: Map<string, string>): Promise<Array<Map<string, string | number>>> {
        //表数据转数组数据
        let sheetJson = <Array<Array<any>>>XLSX.utils.sheet_to_json(sheet, {header: 1});

        //数据初始化
        headerRow = headerRow || 0;
        headerCol = headerCol || 0;
        dataRow = dataRow || headerRow + 1;
        this.lstRange = sheet["!merges"] || [];
        dataLastRow = dataLastRow || sheetJson.length;
        extraData = extraData || new Map<string, string>();
        headerLastCol = headerLastCol || sheetJson[headerRow].length;

        //列号列表
        let lstHeaderCol: Array<number> = [];
        for (let i = headerCol; i < headerLastCol; i++) {
            lstHeaderCol.push(i);
        }
        //行号列表
        let lstDataRow: Array<number> = [];
        for (let i = dataRow; i < dataLastRow; i++) {
            lstDataRow.push(i);
        }
        return this.getSheetData(sheetJson, headerRow, lstHeaderCol, lstDataRow, extraData);
    }

    //excel表数据解析
    private static getSheetData(sheet: Array<Array<any>>, headerRow: number, headerCol: Array<number>, dataRow: Array<number>, extraData: Map<string, string>): Array<Map<string, string | number>> {
        //获取列头与列号的对应关系
        let mapHeader = new Map<string, number>();
        for (let col of headerCol) {
            this.getSheetHeader(sheet, mapHeader, headerRow, col);
        }
        //根据列头与列号关系解析表格数据
        let lstData = new Array<Map<string, string | number>>();
        for (let row of dataRow) {
            let map = this.getSheetBody(sheet, mapHeader, row);
            if (map.size == 0) continue;
            //添加外部数据
            extraData.forEach((v, k) => map.set(k, v));
            lstData.push(map);
        }
        return lstData;
    }

    //列头与列号对应关系
    private static getSheetHeader(sheet: Array<Array<any>>, mapHeader: Map<string, number>, row: number, col: number) {
        //格式化字符串数据
        let value: string = (sheet[row][col] + "").trim();
        mapHeader.set(value, col);
    }

    //获取与列头对应的列数据
    private static getSheetBody(sheet: Array<Array<any>>, mapHeader: Map<string, number>, row: number): Map<string, string | number> {
        let map = new Map<string, string | number>();
        if (row > sheet.length) {
            return map;
        }
        let regStr = "^[+-]?\\d*(\\.\\d*)?(e[+-]?\\d+)?$";
        let regex = new RegExp(regStr);
        for (let [header, col] of mapHeader) {
            //格式化字符串数据
            let value = (sheet[row][col] + "").trim();
            if (value.length == 0) {
                //尝试获取单元格数据
                value = this.getMergedCellValue(sheet, row, col);
            }
            if (value === "undefined") continue;
            if (value.length == 0) continue;
            map.set(header, regex.test(value) ? GenUtil.strToNumber(<string>value) : value);
        }
        return map;
    }

    private static getMerges(sheet: Worksheet): Array<Record<string, any>> {
        let merges = (<Record<string, any>>sheet)["_merges"];
        let ranges = new Array<Record<string, any>>();
        for (let key in merges) {
            if (!merges.hasOwnProperty(key)) continue;
            let model = <Record<string, any>>merges[key];
            let s = {r: model.top - 1, c: model.left - 1};
            let e = {r: model.bottom - 1, c: model.right - 1};
            ranges.push({s: s, e: e});
        }
        return ranges;
    }

    //获取合并单元格数据
    private static getMergedCellValue(sheet: Array<Array<any>>, row: number, col: number): string {
        for (let range of this.lstRange) {
            let minCell = range.s;
            let maxCell = range.e;
            if (minCell.r <= row && row <= maxCell.r &&
                minCell.c <= col && col <= maxCell.c) {
                //格式化字符串数据
                return (sheet[minCell.r][minCell.c] + "").trim();
            }
        }
        return "";
    }

    //行高、列宽初始化
    private static init(rowSize: number, colSize: number): void {
        this.dataRow = -1;
        this.lstRange = [];
        this.lstValue = [];
        this.lstColInfo = [];
        this.lstRowInfo = [];
        this.lstPicture = [];
        this.lstCellStyle = [];
        this.freezeInfo = <AddWorksheetOptions>{};
        for (let i = 0; i < rowSize; i++) {
            this.lstValue.push([]);
            this.lstRowInfo.push({});
            for (let j = 0; j < colSize; j++) {
                if (i == 0) {
                    this.lstColInfo.push(<Column>{});
                }
                this.lstValue[i].push(<Cell>{value: ""});
            }
        }
        this.initCellStyle();
    }

    //样式列表初始化
    private static initCellStyle(): void {
        let lstColor = ["FFF2F2F2", "FFFAFAFA", "FFD4D4D4"];
        this.lstCellStyle.push(this.chooseCellStyle(lstColor, 0));
        this.lstCellStyle.push(this.chooseCellStyle(lstColor, 1));
        this.lstCellStyle.push(this.chooseCellStyle(lstColor, 2));
    }

    //单元格样式选择
    private static chooseCellStyle(lstColor: Array<string>, choose: number): Style {
        let cellStyle = <Style>{};
        cellStyle.alignment = {};
        cellStyle.border = {};
        cellStyle.font = {};
        if (choose == 0) {
            //设置表头字体样式：粗体、大小
            cellStyle.font = {bold: true, size: 11};
            //设置背景色
            cellStyle.fill = {type: 'pattern', fgColor: {argb: lstColor[0]}, pattern: "solid"};
        } else if (choose == 1) {
            //设置数据显示字体样式：大小
            cellStyle.font = {size: 10};
            //设置背景色
            cellStyle.fill = {type: 'pattern', fgColor: {argb: lstColor[1]}, pattern: "solid"};
        } else if (choose == 2) {
            //设置数据显示字体样式：大小
            cellStyle.font = {size: 10};
        }
        //设置字体: 微软雅黑
        cellStyle.font.name = "Microsoft YaHei";
        //设置居中：垂直居中、水平居中
        cellStyle.alignment.vertical = "middle";
        cellStyle.alignment.horizontal = "center";
        //设置边框宽度、颜色
        cellStyle.border.top = {style: "thin", color: {argb: lstColor[2]}};
        cellStyle.border.bottom = {style: "thin", color: {argb: lstColor[2]}};
        cellStyle.border.left = {style: "thin", color: {argb: lstColor[2]}};
        cellStyle.border.right = {style: "thin", color: {argb: lstColor[2]}};
        return cellStyle;
    }

    //图片数据写入
    public static writePicture(rowIndex: number, rowOffset: number, colIndex: number, colOffset: number, filePath: string): void {
        //写入单元格数据并设置单元格样式
        let cellStyle = this.getCellStyle(this.dataRow, rowIndex);
        for (let row = rowIndex; row <= rowIndex + rowOffset; row++) {
            for (let col = colIndex; col <= colIndex + colOffset; col++) {
                if (this.widthAuto) {
                    //自动设置列宽
                    this.lstColInfo[col] = <Column>{width: this.getWidthColByAuto(col, "")};
                }
                this.saveCellValue(row, col, cellStyle, "");
                if (col == 0) {
                    //设置行高
                    this.lstRowInfo[row] = {height: this.height};
                }
            }
        }
        let image: Record<string, any> = {};
        let index = filePath.lastIndexOf(".");
        let number = this.lstPicture.length + 1;
        let suffix = filePath.substring(index + 1);
        image.editAs = "oneCell";
        image.extension = suffix;
        image.base64 = FileUtil.readFile(filePath);
        image.name = "image" + number + "." + suffix;
        image.tl = {row: rowIndex + 1, col: colIndex + 1};
        image.br = {row: rowIndex + rowOffset, col: colIndex + colOffset};
        this.lstPicture.push(image);
    }

    //表格数据写入
    public static writeCellData(rowIndex: number, colIndex: number, cellData: string): void {
        if (typeof cellData === "undefined" || cellData == null) cellData = "";
        //写入单元格数据并设置单元格样式
        let cellStyle = this.getCellStyle(this.dataRow, rowIndex);
        if (this.widthAuto) {
            //自动设置列宽
            this.lstColInfo[colIndex] = <Column>{width: this.getWidthColByAuto(colIndex, cellData)};
        }
        this.saveCellValue(rowIndex, colIndex, cellStyle, cellData);
        if (colIndex == 0) {
            //设置行高
            this.lstRowInfo[rowIndex] = {height: this.height};
        }
    }

    //表头数据写入
    public static writeHeader(lstHeader: Array<Array<string>>, widthCol?: number, dataCol?: number, lstExcludeRow?: Array<number>): void {
        let colSize = lstHeader.length;
        let rowSize = lstHeader[0].length;
        this.init(rowSize, colSize);
        this.dataRow = rowSize;
        this.widthAuto = widthCol == null;
        let lstFlag = this.getFlagArray(rowSize, colSize);
        for (let row = 0; row < rowSize; row++) {
            for (let col = 0; col < colSize; col++) {
                if (!lstFlag[row][col]) {
                    lstFlag[row][col] = true;

                    let lstCoords = new Array<Coords>();
                    lstCoords.push(Coords.of(lstHeader, row, col));
                    if (typeof lstExcludeRow === "undefined" || lstExcludeRow.length == 0 || !lstExcludeRow.includes(row)) {
                        this.checkMergeRange(lstHeader, lstFlag, lstCoords, row, col, lstHeader[col][row]);
                    }

                    this.merge(lstCoords, widthCol);
                }
            }
        }
        //单元格冻结：从上往下，冻结 dataRow 行；从左往右，冻结 dataCol 列
        this.freezeInfo = <AddWorksheetOptions>{views: [{xSplit: dataCol || 0, ySplit: this.dataRow, state: "frozen"}]};
    }

    //单元格合并范围递归检查
    private static checkMergeRange(lstHeader: Array<Array<string>>, lstFlag: Array<Array<boolean>>, lstCoords: Array<Coords>, x: number, y: number, value: string): void {
        let colSize = lstHeader.length;
        let rowSize = lstHeader[0].length;
        for (let move of this.MOVE) {
            let moveX = x + move[0];
            let moveY = y + move[1];
            if (0 <= moveX && moveX < rowSize && 0 <= moveY && moveY < colSize && !lstFlag[moveX][moveY]) {
                if (lstHeader[moveY][moveX] === value) {
                    lstFlag[moveX][moveY] = true;
                    lstCoords.push(Coords.of(lstHeader, moveX, moveY));
                    this.checkMergeRange(lstHeader, lstFlag, lstCoords, moveX, moveY, value);
                }
            }
        }
    }

    //单元格合并
    private static merge(lstCoords: Array<Coords>, widthCol?: number): void {
        //单元格坐标排序
        lstCoords.sort((c1, c2) => {
            if (c1.x > c2.x || c1.y > c2.y) {
                return 1;
            } else if (c1.x < c2.x || c1.y < c2.y) {
                return -1;
            } else {
                return 0;
            }
        });
        for (let coords of lstCoords) {
            //设置列宽
            this.lstColInfo[coords.y] = <Column>{width: widthCol || this.getWidthColByAuto(coords.y, coords.value)};
            //设置行高
            this.lstRowInfo[coords.x] = {height: this.height};
            //写入单元格数据并设置单元格样式
            let cellStyle = this.getCellStyle(this.dataRow, coords.x);
            this.saveHeaderCellValue(coords.x, coords.y, cellStyle, coords.value);
        }
        //合并单元格
        if (lstCoords.length > 1) {
            let minCoords = lstCoords[0];
            let maxCoords = lstCoords[lstCoords.length - 1];
            this.lstRange.push({s: {r: minCoords.x, c: minCoords.y}, e: {r: maxCoords.x, c: maxCoords.y}})
        }
    }

    //自动设置列宽
    private static getWidthColByAuto(col: number, value: string): number {
        let widthCol = this.lstColInfo[col]?.width || 0;
        let tempWidthCol = this.getWidthCol(value);
        if (widthCol < tempWidthCol) {
            widthCol = tempWidthCol;
        }
        return widthCol;
    }

    //根据字符串获取列宽
    private static getWidthCol(value: string): number {
        let chineseSum = 0;
        let englishSum = 0;
        let charSum = 0;
        for (let i = 0; i < value.length; i++) {
            if (this.isChineseChar(value.charCodeAt(i))) {
                chineseSum += 2;
                charSum += 2;
            } else {
                englishSum += 1;
                charSum += 1;
            }
        }
        charSum = charSum > 1 ? 13 + charSum - 1 : 13;
        if (chineseSum == 0 && englishSum > 0) {
            charSum += 4;
        } else if (chineseSum > 0 && englishSum > 0) {
            let percent = englishSum / chineseSum;
            if (percent < 0.2) {
                charSum -= 2;
            } else if (percent > 0.8) {
                charSum += 2;
            }
        }
        return charSum;
    }

    //判断是否为中文字符
    private static isChineseChar(charCode: number): boolean {
        return !(0 <= charCode && charCode <= 128);
    }

    //表头单元格数据写入
    private static saveHeaderCellValue(rowIndex: number, colIndex: number, cellStyle: Style, value: string): void {
        this.lstValue[rowIndex][colIndex] = <Cell>{value: value, style: cellStyle};
    }

    //表格单元格数据写入
    private static saveCellValue(rowIndex: number, colIndex: number, cellStyle: Style, value: string): void {
        if (rowIndex >= this.lstValue.length) {
            for (let i = this.lstValue.length; i <= rowIndex; i++) {
                this.lstValue.push([]);
            }
        }
        if (colIndex >= this.lstValue[rowIndex].length) {
            for (let i = this.lstValue[rowIndex].length; i <= colIndex; i++) {
                this.lstValue[rowIndex].push(<Cell>{value: "", style: cellStyle});
            }
        }
        this.lstValue[rowIndex][colIndex].value = value;
    }

    //表头标记矩阵初始化
    private static getFlagArray(rowSize: number, colSize: number): Array<Array<boolean>> {
        let lstFlag = new Array<Array<boolean>>();
        for (let i = 0; i < rowSize; i++) {
            let flags = new Array<boolean>();
            for (let j = 0; j < colSize; j++) {
                flags.push(false);
            }
            lstFlag.push(flags);
        }
        return lstFlag;
    }

    //获取单元格样式
    private static getCellStyle(dataRow: number, rowIndex: number): Style {
        //单元格样式：带斑马纹表格
        let cellStyle;
        if (dataRow === -1 || rowIndex < dataRow) {
            //表头样式
            cellStyle = this.lstCellStyle[0];
        } else {
            //数据样式
            if (dataRow % 2 == 0) {
                if (rowIndex % 2 == 0) {
                    cellStyle = this.lstCellStyle[2];
                } else {
                    cellStyle = this.lstCellStyle[1];
                }
            } else {
                if (rowIndex % 2 != 0) {
                    cellStyle = this.lstCellStyle[2];
                } else {
                    cellStyle = this.lstCellStyle[1];
                }
            }
        }
        return cellStyle;
    }

    //数据写入到表中
    public static packSheet(name?: string, dataRow?: string, dataCol?: string): void {
        if (this.workbook == null) {
            this.workbook = new Workbook();
        }
        if (typeof dataRow !== "undefined" && typeof dataCol !== "undefined") {
            dataRow = dataRow.length === 0 ? "0" : dataRow;
            dataCol = dataCol.length === 0 ? "0" : dataCol;
            (<WorksheetViewFrozen>this.freezeInfo.views[0]).ySplit = GenUtil.strToNumber(dataRow);
            (<WorksheetViewFrozen>this.freezeInfo.views[0]).xSplit = GenUtil.strToNumber(dataCol);
        }
        let sheet = this.workbook.addWorksheet(name, this.freezeInfo);
        //设置列宽
        sheet.columns = this.lstColInfo;
        for (let rowData of this.lstValue) {
            let colIndex = 1;
            let cellStyle: CellValue | null = null;
            let rowValues = new Array<CellValue>()
            for (let cell of rowData) {
                cellStyle = <CellValue>cell.style;
                rowValues[colIndex++] = cell.value;
            }
            let row = sheet.addRow(rowValues);
            //设置行样式
            row.eachCell(cell => cell.style = <any>cellStyle);
            // 设置行高
            row.height = this.lstRowInfo[row.number - 1].height;
        }
        for (let range of this.lstRange) {
            //合并单元格
            sheet.mergeCells(
                range.s.r + 1, range.s.c + 1,
                range.e.r + 1, range.e.c + 1
            );
        }
        for (let i = 0; i < this.lstPicture.length; i++) {
            let picture = <any>this.lstPicture[i];
            //添加图片
            sheet.addImage(i + 1, picture);
        }
    }

    //导出excel文件
    public static async write(fileName: string): Promise<void> {
        await this.workbook?.xlsx.writeFile(fileName);
        this.workbook = null;
    }

    //导出excel文件
    public static async writeBuffer(): Promise<Buffer> {
        let buffer = await this.workbook?.xlsx.writeBuffer({
            zip: {compressionOptions: {level: 9}}
        });
        this.workbook = null;
        return <Buffer>buffer;
    }

}