abstract class CycleRoute {
    desc:string = 'Empty Router';
    abstract getHoursDuration():number

    public getDesc():string {
        return this.desc;
    }
}

abstract class RoutePartsDecorator extends CycleRoute {
    public abstract getDesc():string;
}

class RoadBikeRoute extends CycleRoute{
    constructor() {
        super();
        this.desc = 'Road route'
    }

    public getHoursDuration(): number {
        return 1;
    }
}

class GravelRoute extends CycleRoute {
    constructor() {
        super();
        this.desc = 'Gravel route'
    }

    public getHoursDuration(): number {
        return 1.2;
    }
}

class BikerLevel extends RoutePartsDecorator {
    cycleRoute:CycleRoute;
    bikerLevel:1|2|3|4|5;

    constructor(bikerLevel:1|2|3|4|5, cycleRoute:CycleRoute) {
        super();
        this.cycleRoute = cycleRoute;
        this.bikerLevel = bikerLevel;
    }

    getDesc(): string {
        return `${this.cycleRoute.getDesc()} bikerLevel - ${this.bikerLevel}`;
    }

    getHoursDuration(): number {
        return this.cycleRoute.getHoursDuration() * (1 / Math.log2(this.bikerLevel + 1));
    }
}

class LengthKM extends RoutePartsDecorator {
    cycleRoute:CycleRoute;
    kilometers:number;
    private BASE_AVG_SPEED = 17;

    constructor(kilometers:number, cycleRoute:CycleRoute) {
        super();
        this.cycleRoute = cycleRoute;
        this.kilometers = kilometers;
    }

    getDesc(): string {
        return `${this.cycleRoute.getDesc()} Length - km - ${this.kilometers}`;
    }

    getHoursDuration(): number {
        return this.cycleRoute.getHoursDuration() * (this.kilometers / this.BASE_AVG_SPEED)
    }
}

export const testDecorator = () => {
    let weekEndRoute = new RoadBikeRoute();
    weekEndRoute = new BikerLevel(2, weekEndRoute);
    weekEndRoute = new LengthKM(100, weekEndRoute);
};