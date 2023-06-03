import { Component, ElementRef, Input } from '@angular/core';
import { EventInfo } from '../model/wizard';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-popup-info',
  templateUrl: './popup-info.component.html',
  styleUrls: ['./popup-info.component.less']
})
export class PopupInfoComponent {
  private _positionX? : number;
  private _positionY? : number;
  constructor(private _elRef:ElementRef) {
  }

  public info!: EventInfo;
  public duration!: number;


  public get positionX() : number {
    if (this._positionX === undefined) {
      if (this.info.positionX !== undefined) {
        this._positionX = this.info.positionX;
      }
      else {
        let parentWidth = this._elRef.nativeElement.parentElement.parentElement.offsetWidth;
        this._positionX = Math.random() * parentWidth * 0.8 + parentWidth * 0.1;
      }
    }

    return this._positionX;
  }

  public get positionY() : number {
    if (this._positionY === undefined) {
      if (this.info.positionY !== undefined) {
        this._positionY = this.info.positionY;
      }
      else {
        let parentHeight = this._elRef.nativeElement.parentElement.parentElement.offsetHeight;
        this._positionY = Math.random() * parentHeight * 0.8 + parentHeight * 0.1;
      }
    }

    return this._positionY;
  }

}
