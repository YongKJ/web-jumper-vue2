import {GenUtil} from "@/common/util/GenUtil";

export class DemoTest {

    private constructor() {
    }

    private static readonly _EXCEL_FILE = GenUtil.arrayToMapList(require("@/common/resoureces/json/training-data.json"));

    static get EXCEL_FILE(): Array<Map<string, any>> {
        return this._EXCEL_FILE;
    }
}