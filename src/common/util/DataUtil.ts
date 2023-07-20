export class DataUtil {

    private static setProps<T, K extends keyof T>(obj: T, propName: K, value: any): void {
        if (typeof value !== "undefined") {
            obj[propName] = value;
        }
    }

    public static getPrototypes<T>(clazz: (new () => T) | T): Array<string> {
        let prototype = typeof clazz === "function" ?
            clazz.prototype : Object.getPrototypeOf(clazz);
        return Object.getOwnPropertyNames(prototype)
            .filter(methodName => methodName !== 'constructor');
    }

    private static convertObjectData<T>(data: Record<string, any>, clazz: (new () => T) | T): T {
        let entity = typeof clazz === "function" ?
            new (<new () => T>clazz)() : clazz;
        if (!data) return entity;
        let methodNames = this.getPrototypes(clazz);
        for (let methodName of methodNames) {
            if (!data.hasOwnProperty(methodName)) continue;
            this.setProps(entity, <keyof T>methodName, data[methodName]);
        }
        return entity;
    }

    private static convertArrayData<T>(lstData: Array<Record<string, any>>, clazz: (new () => T) | T): Array<T> {
        let dataArray = new Array<T>();
        for (let data of lstData) {
            dataArray.push(this.convertObjectData(data, clazz));
        }
        return dataArray;
    }

    public static convertData<T>(data: Record<string, any> | Array<Record<string, any>>, clazz: (new () => T) | T): T | Array<T> {
        if (data instanceof Array) {
            return this.convertArrayData(data, clazz);
        } else {
            return this.convertObjectData(data, clazz);
        }
    }

}