import { Component, AfterViewInit, ViewChild, ViewChildren, QueryList, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { gsap } from 'gsap';
import { isPlatformBrowser } from '@angular/common';
import { FormNavegacaoComponent } from '../form-navegacao/form-navegacao.component';

@Component({
  selector: 'app-navegacao',
  standalone: true,
  imports: [FormNavegacaoComponent],
  templateUrl: './navegacao.component.html',
  styleUrls: ['./navegacao.component.scss'],
})
export class NavegacaoComponent implements AfterViewInit {
  @ViewChild('logo', { static: true }) logo!: ElementRef<HTMLImageElement>;
  @ViewChildren('particle1, particle2, particle3, particle4') particles!: QueryList<ElementRef<HTMLSpanElement>>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // =========================
    // Logo flutuar + pulse glow suave + pausa
    // =========================
    gsap.to(this.logo.nativeElement, {
      y: -10,                // float
      scale: 1.05,            // pulse suave
      filter: "drop-shadow(0 0 8px rgba(255,255,255,0.25)) drop-shadow(0 0 16px rgba(255,255,255,0.15))",
      duration: 3,            // mais lento
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      repeatDelay: 0.5,       // pausa no topo e fundo do ciclo
      onUpdate: function () {
        const t = this['progress']();
        const glow = 8 + 8 * Math.sin(t * Math.PI * 2);
        (this['targets']()[0] as HTMLElement).style.filter =
          `drop-shadow(0 0 ${glow}px rgba(255,255,255,0.25)) drop-shadow(0 0 ${glow*2}px rgba(255,255,255,0.15))`;
      }
    });

    // =========================
    // Partículas animadas (vertical + opacity)
    // =========================
    const particleConfigs = [
      { el: this.particles.get(0)?.nativeElement, y: -140, duration: 10, opacityMin: 0.3, opacityMax: 1 },
      { el: this.particles.get(1)?.nativeElement, y: -180, duration: 8, opacityMin: 0.2, opacityMax: 0.9 },
      { el: this.particles.get(2)?.nativeElement, y: -200, duration: 12, opacityMin: 0.3, opacityMax: 1 },
      { el: this.particles.get(3)?.nativeElement, y: -160, duration: 9, opacityMin: 0.2, opacityMax: 0.8 },
    ];

    particleConfigs.forEach(config => {
      if (!config.el) return;

      gsap.to(config.el, {
        y: config.y,
        duration: config.duration,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        repeatDelay: 0.3  // pequena pausa nas partículas também
      });

      gsap.to(config.el, {
        opacity: config.opacityMax,
        duration: config.duration / 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        repeatDelay: 0.3
      });
    });
  }
}
