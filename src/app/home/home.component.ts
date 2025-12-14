import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stopot2',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  title = 'JOGAR STOP NUNCA FOI TÃO INTERATIVO!';
  description =
    'Conhecido como Stop, Adedanha ou Adedonha, o Stopots multiplica a diversão com interação e tecnologia.';

  clickSound!: HTMLAudioElement;

  constructor(private router: Router) {
    if (typeof window !== 'undefined') {
      this.clickSound = new Audio('assets/sounds/click.wav');
    }
  }

  jogar() {
    if (this.clickSound) {
      this.clickSound.currentTime = 0;
      this.clickSound.play();
    }

    // navegação Angular (não corta o som)
    this.router.navigate(['/navegacao']);
  }
}
