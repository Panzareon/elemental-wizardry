import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Directive, ElementRef, EmbeddedViewRef, EnvironmentInjector, HostListener, Injector, Input, createComponent } from '@angular/core';
import { SpellTooltipComponent } from './spell-tooltip.component';
import { Spell } from 'src/app/model/spell';

@Directive({
  selector: '[appSpellTooltip]'
})
export class SpellTooltipDirective {

  @Input() spell! : Spell;

  private _componentRef: ComponentRef<SpellTooltipComponent>|null = null;
  private _showTimeout?: number;

  constructor(
    private _elementRef: ElementRef,
	  private _appRef: ApplicationRef, 
    private _environmentInjector: EnvironmentInjector,
	  private _injector: Injector) {
  }
  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.createTooltip();
  }
  @HostListener('touchstart')
  onTouchStart(): void {
    this.createTooltip();
  }

  private createTooltip() {
    if (this._componentRef === null) {
      this._componentRef = createComponent(SpellTooltipComponent, { environmentInjector: this._environmentInjector, elementInjector: this._injector });
      document.body.appendChild(this._componentRef.location.nativeElement);
      this._appRef.attachView(this._componentRef.hostView);
      this.setTooltipComponentProperties();
      this._showTimeout = window.setTimeout(() => this.showTooltip(), 500);
    }
  }

  private showTooltip() {
    if (this._componentRef !== null) {
      this._componentRef.instance.visible = true
    }
  }
  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.destroy();
  }

  @HostListener('touchend')
  onTouchEnd(): void {
    this.destroy();
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  destroy(): void {
    if (this._componentRef !== null) {
      window.clearTimeout(this._showTimeout);
      this._appRef.detachView(this._componentRef.hostView);
      this._componentRef.destroy();
      this._componentRef = null;
    }
  }
  private setTooltipComponentProperties() {
    if (this._componentRef !== null) {
      this._componentRef.instance.spell = this.spell;
      const {left, right, bottom} = 		  	
            this._elementRef.nativeElement.getBoundingClientRect();
      this._componentRef.instance.left = (right - left) / 2 + left;
      this._componentRef.instance.top = bottom;
    }
  }
}
