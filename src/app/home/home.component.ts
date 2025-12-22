import { Component, AfterViewInit, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { gsap } from 'gsap';

type Aba = 'anonimo' | 'autenticado';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {

  @ViewChild('logo', { static: true }) logo!: ElementRef<HTMLImageElement>;

  abaAtiva: Aba = 'anonimo';
  nickname: string = '';
  menuAberto = false;

  avatarList = [
    { src: '../assets/images/avatar1.png', bg: '#4ade80' },
    { src: '../assets/images/avatar2.png', bg: '#60a5fa' }
  ];
  avatarIndex = 0;
  avatarSelecionado = this.avatarList[0].src;
  avatarBackground = this.avatarList[0].bg;

  clickSound!: HTMLAudioElement;
  backendUrl = 'https://gabarita-backend.onrender.com';

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.clickSound = new Audio('assets/sounds/click.wav');
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.animarLogo();
    }
  }

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

  trocarAvatar() {
    this.playClick();
    this.avatarIndex = (this.avatarIndex + 1) % this.avatarList.length;
    this.avatarSelecionado = this.avatarList[this.avatarIndex].src;
    this.avatarBackground = this.avatarList[this.avatarIndex].bg;
  }

  async jogar() {
    this.playClick();

    if (!this.nickname.trim()) {
      alert('Digite um nickname antes de começar!');
      return;
    }

    try {
      let userId = localStorage.getItem('userId');

      if (!userId) {
        const response = await fetch(`${this.backendUrl}/api/users/anonymous`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nickname: this.nickname,
            avatar: this.avatarSelecionado
          })
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Erro desconhecido');
        }

        const data = await response.json();
        console.log('Resposta do backend:', data);

        // TypeScript-safe: garantir que userId seja string
        const newUserId: string = data.user.id;
        localStorage.setItem('userId', newUserId);
        localStorage.setItem('token', data.token);
        userId = newUserId;
      }

      this.router.navigate(['/navegacao']);
    } catch (error: any) {
      console.error('Erro ao criar usuário anônimo:', error.message);
      alert('Não foi possível criar o usuário anônimo: ' + error.message);
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
