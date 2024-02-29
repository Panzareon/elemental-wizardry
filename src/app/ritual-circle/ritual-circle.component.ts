import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-ritual-circle',
  templateUrl: './ritual-circle.component.html',
  styleUrls: ['./ritual-circle.component.less']
})
export class RitualCircleComponent {
  constructor(private elem: ElementRef){}

  public startAnimation() {
    let animationElements = this.elem.nativeElement.querySelectorAll("animateTransform");
    animationElements.forEach((element: SVGAnimationElement) => {
      element.beginElement();
    });
  }
}
