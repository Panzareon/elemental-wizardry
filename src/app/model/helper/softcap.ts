export { SoftCap }

class SoftCap {
    public caps : [number, number][] = [];
    public constructor(cap : number, afterCapMultiplier: number, public baseMultiplier: number = 1) {
        this.addCap(cap, afterCapMultiplier);
    }

    public addCap(cap : number, afterCapMultiplier: number) : SoftCap{
        this.caps.push([cap, afterCapMultiplier]);
        this.caps.sort((a, b) => a[0] - b[0]);
        return this;
    }

    public getValue(value: number) : number {
        return this.getValueInternal(value) * this.baseMultiplier;
    }
    private getValueInternal(value: number) : number {
        var remainingValue = value;
        var previousCapDelta = 0;
        var result = 0;
        var previousMultiplier = 1;
        for (let cap of this.caps) {
            if (remainingValue + previousCapDelta < cap[0]) {
                return result + remainingValue * previousMultiplier;
            }

            let delta = cap[0] - previousCapDelta;
            result += delta * previousMultiplier;
            remainingValue -= delta;
            previousCapDelta += delta;
            previousMultiplier = cap[1];
        }

        return result + remainingValue * previousMultiplier;
    }
}