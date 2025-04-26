export interface IObserver {
    subscribe: (cb:(data:any) => void) => void,
    unSubscribe: (cb:(data:any) => void) => void,
}

export class Observer implements IObserver {
    private subscriptions: Map<((data:any) => void), undefined> = new Map();

    public emitMessage() {
        this.subscriptions.forEach((_, key) => {
            key('data');
        });
    }

    public subscribe (cb:(data:any) => void) {
        this.subscriptions.set(cb, undefined);
    };

    public unSubscribe (cb:(data:any) => void) {
        this.subscriptions.delete(cb);
    }
}
