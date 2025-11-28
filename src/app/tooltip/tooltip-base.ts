import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from "@angular/core";
import { MatCard } from "@angular/material/card";

export { TooltipBase }

@Component({
    template: '',
    standalone: false
})
abstract class TooltipBase implements AfterViewInit {
    public visible : boolean = false;
    private _left: number = 0;
    private _top: number = 0;
    private _minLeft: number = 0;
    private _topDiff: number = 0;

    public constructor(private _changeDetectorRef : ChangeDetectorRef) {
    }
    
    ngAfterViewInit (): void {
        this._minLeft = this.tooltip!.nativeElement.getBoundingClientRect().width / 2;
        this._topDiff = window.innerHeight - this.tooltip!.nativeElement.getBoundingClientRect().height;
        this._changeDetectorRef.detectChanges();
    }
    public get left(): number {
        if (this._minLeft > this._left) {
            return this._minLeft;
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
        if (this._topDiff < 0)
        {
            return window.scrollY;
        }
        let maxTop = this._topDiff + window.scrollY;
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