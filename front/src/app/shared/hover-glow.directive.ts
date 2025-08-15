// src/app/shared/hover-glow.directive.ts
import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[bbGlow]',
  standalone: true
})
export class HoverGlowDirective {
  constructor(private el: ElementRef<HTMLElement>) {}

  @HostListener('mousemove', ['$event'])
  onMove(e: MouseEvent) {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.el.nativeElement.style.setProperty('--mx', `${x}px`);
    this.el.nativeElement.style.setProperty('--my', `${y}px`);
  }

  @HostListener('mouseleave')
  onLeave() {
    this.el.nativeElement.style.removeProperty('--mx');
    this.el.nativeElement.style.removeProperty('--my');
  }
}
