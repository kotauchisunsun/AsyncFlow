export class DuplicateDefinitionError implements Error {
    public name: string;
    public message: string;

    constructor() {
        this.name = 'DuplicateDefinitionError';
        this.message = '変数が多重定義されています';
    }

    public toString(): string {
        return `${this.name}:${this.message}`;
    }
}

export class JsObjectNotFound implements Error {
    public name: string;
    public message: string;

    constructor() {
        this.name = 'JsObjectNotFound';
        this.message = 'jsのオブジェクトが見つかりません。';
    }

    public toString(): string {
        return `${this.name}:${this.message}`;
    }
}

export class NotDefinedVariable implements Error {
    public name: string;
    public message: string;

    constructor() {
        this.name = 'NotDefinedVariable';
        this.message = '変数が宣言されていません';
    }

    public toString(): string {
        return `${this.name}:${this.message}`;
    }
}
