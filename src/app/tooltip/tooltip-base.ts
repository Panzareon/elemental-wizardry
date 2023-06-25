import { Component, ElementRef, ViewChild } from "@angular/core";
import { MatCard } from "@angular/material/card";

export { TooltipBase }

@Component({template: ''})
abstract class TooltipBase {
    public visible : boolean = false;
    private _left: number = 0;
    private _top: number = 0;
    public get left(): number {
        let minLeft = this.tooltip?.nativeElement.getBoundingClientRect().width / 2;
        if (minLeft > this._left) {
            return minLeft;
        }
        return this._left;
    }
    public set left(value: number) {
        this._left = value;
    }
    public get top(): number {
        if (this.tooltip === undefined) {
            return this._top;
        }
        let topDiff = window.innerHeight - this.tooltip.nativeElement.getBoundingClientRect().height;
        if (topDiff < 0)
        {
            return window.scrollY;
        }
        let maxTop = topDiff + window.scrollY;
        if (maxTop < this._top) {
            return maxTop;
        }
        return this._top;
    }
    public set top(value: number) {
        this._top = value;
    }
    public get movedPosition() : boolean {
        return this._top != this.top || this._left != this.left;
    }
    @ViewChild(MatCard, { read: ElementRef }) tooltip?: ElementRef;
}