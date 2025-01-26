abstract class ShiftGearBehavior {
    abstract increase(num:1|2|3):boolean
    abstract decrease():boolean
}

class Shimano105 implements ShiftGearBehavior {
    private startGear = 0;

    private SHIFTS_COUNT = 24;

    increase(num:1|2|3):boolean {
        if (this.startGear + num <= this.SHIFTS_COUNT) {
            this.startGear += num;
            return true;
        }
        return false;
    }

    decrease():boolean {
        if (this.startGear -1 >= 0) {
            this.startGear -= 1;
            return true;
        }
        return false;
    }
}

class FixedGear implements ShiftGearBehavior {
    increase(num:1|2|3):boolean {
        return false;
    }

    decrease():boolean {
        return false;
    }
}

class Bicycle {
    constructor(shiftGearBehavior:ShiftGearBehavior) {
        this.shiftGearBehavior = shiftGearBehavior;
    }

    public shiftGearBehavior:ShiftGearBehavior;

    public performIncrease(num:1|2|3):boolean {
        return this.shiftGearBehavior.increase(num);
    }

    public performDecrease():boolean {
        return this.shiftGearBehavior.decrease();
    }

    public bell():string {
        return 'Ring Ring'
    }
}

class GiantTCR extends Bicycle {
    constructor() {
        super(new Shimano105());
    }
}

class Tsunami extends Bicycle {
    constructor() {
        super(new FixedGear());
    }
}

export const testStrategy = () => {
    const myTcr = new GiantTCR();
    const myTsunami = new Tsunami();

    console.log(myTcr.bell())
    console.log(myTsunami.performIncrease(2));
    console.log(myTcr.performIncrease(2));
}