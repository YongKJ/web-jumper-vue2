import {GenUtil} from "@/common/util/GenUtil";

export class VisualizedAnalysis {

    private constructor() {
    }

    private static readonly _EXCEL_DATA = GenUtil.arrayToMapList(require("@/common/resources/json/training-data.json"));

    static get EXCEL_DATA(): Array<Map<string, any>> {
        return this._EXCEL_DATA;
    }
}