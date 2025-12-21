import { Component, AfterViewInit, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { gsap } from 'gsap';

type Aba = 'anonimo' | 'autenticado';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {

  @ViewChild('logo', { static: true }) logo!: ElementRef<HTMLImageElement>;
  @ViewChild('avatarEl') avatarEl!: ElementRef<HTMLDivElement>;

  abaAtiva: Aba = 'anonimo';
  menuAberto = false; // Controle do modal do menu

  /** PERSONAGENS */
  personagens = ['🧠', '📘', '🚀', '🧩', '🎓'];
  personagemIndex = 0;

  get personagemAtual() {
    return this.personagens[this.personagemIndex];
  }

  clickSound!: HTMLAudioElement;
  backendUrl = 'https://gabarita-backend.onrender.com';

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.clickSound = new Audio('assets/sounds/click.wav');
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.animarLogo();
    }
  }

  /** LOGO */
  private animarLogo(): void {
    gsap.to(this.logo.nativeElement, {
      y: -15,
      scale: 1.05,
      duration: 3,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      repeatDelay: 0.5
    });
  }

  /** CLICK */
  private playClick() {
    if (this.clickSound) {
      this.clickSound.currentTime = 0;
      this.clickSound.play();
    }
  }

  toggleMenu() {
    this.playClick();
    this.menuAberto = !this.menuAberto;
  }

  selecionarAba(aba: Aba) {
    this.playClick();
    this.abaAtiva = aba;
  }

  /** 🔄 TROCAR PERSONAGEM */
  trocarPersonagem() {
    this.playClick();

    this.personagemIndex =
      (this.personagemIndex + 1) % this.personagens.length;

    if (this.avatarEl) {
      gsap.fromTo(
        this.avatarEl.nativeElement,
        { scale: 0.6, rotate: -15, opacity: 0 },
        { scale: 1, rotate: 0, opacity: 1, duration: 0.35, ease: 'back.out(2)' }
      );
    }
  }

  /** JOGAR */
  async jogar() {
    this.playClick();
    try {
      let userId = localStorage.getItem('userId');
      if (!userId) {
        const response = await fetch(`${this.backendUrl}/api/users/anonymous`, {
          method: 'POST',
        });
        const data = await response.json();
        userId = String(data.userId);
        localStorage.setItem('userId', userId);
      }
      this.router.navigate(['/navegacao']);
    } catch (error) {
      console.error('Erro ao criar usuário anônimo:', error);
    }
  }

  logar() {
    this.playClick();
    this.router.navigate(['/login']);
  }

  cadastrar() {
    this.playClick();
    this.router.navigate(['/cadastro']);
  }
}