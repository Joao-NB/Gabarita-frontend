// src/app/home/home.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  title = 'JOGAR STOP NUNCA FOI TÃO INTERATIVO!';
  description =
    'Conhecido como Stop, Adedanha ou Adedonha, o Stopots multiplica a diversão com interação e tecnologia.';

  clickSound!: HTMLAudioElement;
  backendUrl = 'https://gabarita-backend.onrender.com'; // backend no Render

  constructor(private router: Router) {
    if (typeof window !== 'undefined') {
      this.clickSound = new Audio('assets/sounds/click.wav');
    }
  }

  private playClick() {
    if (this.clickSound) {
      this.clickSound.currentTime = 0;
      this.clickSound.play();
    }
  }

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

      console.log('Usuário atual (anônimo):', userId);
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
