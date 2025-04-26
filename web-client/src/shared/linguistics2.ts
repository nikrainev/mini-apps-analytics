type LambdaFuncType = (word:string, arg?:LambdaFuncType) => LambdaFuncType

const lambda = (word:string, arg?:LambdaFuncType):LambdaFuncType|undefined => {
    let resultSentance = word;
    return arg;
};

const MARY = 'mary';

const y = 'Mary';
const x = 'John';

const love = lambda(
    'loves',
    lambda(x, lambda(y))
);

abstract class BaseItem {
    word:string = '';
    abstract getSentence(): string;

    abstract getType():string;
}


class E implements BaseItem {
    constructor(word:string) {
        this.word = word;
    }

    public getSentence():string {
        return this.word;
    }

    public getType():string {
        return 'e';
    }

    word: string = '';
}

class Lambda implements BaseItem {
    lambda?: BaseItem;

    constructor(word: BaseItem, lambda?: BaseItem) {
        this.word = word.word;
        this.lambda = lambda;
    }

    word: string = '';

    public getType() {
        if (!this.lambda) {
            return 'e';
        }

        return 'e';
    };

    public getSentence(): string {
        if (this.lambda) {
            return `${this.word} ${this.lambda.getSentence()}`;
        }
        return this.word;
    }
}

export const test = () => {
    const MARY = new E('mary');
    const JOHN = new E('john');

    const loveJohn = new Lambda(new Lambda(new E('love'), JOHN), MARY);
};
