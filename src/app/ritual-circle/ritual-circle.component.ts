import { Component, ElementRef, Input } from '@angular/core';
import { Spell } from '../model/spell';

@Component({
  selector: 'app-ritual-circle',
  templateUrl: './ritual-circle.component.html',
  styleUrls: ['./ritual-circle.component.less']
})
export class RitualCircleComponent {
  private isAnimating : boolean = false;
  constructor(private elem: ElementRef){}

  public startAnimation() {
    if (this.isAnimating) {
      return;
    }
    let animationElements = this.elem.nativeElement.querySelectorAll("animateTransform");
    animationElements.forEach((element: SVGAnimationElement) => {
      element.beginElement();
    });
    this.isAnimating = true;
  }

  public stopAnimation() {
    if (!this.isAnimating) {
      return;
    }
    let animationElements = this.elem.nativeElement.querySelectorAll("animateTransform");
    animationElements.forEach((element: SVGAnimationElement) => {
      element.endElement();
    });
    this.isAnimating = false;
  }
}
