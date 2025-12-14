import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormNavegacaoComponent } from '../form-navegacao/form-navegacao.component';
import { LocalStorageService } from '../_services/local-storage.service';
import { gsap } from 'gsap';

interface Pergunta {
  enunciado: string;
  alternativas: { [key: string]: string };
  respostaCorreta: string;
  explicacao?: string;
}

@Component({
  selector: 'app-perguntas',
  standalone: true,
  imports: [CommonModule, FormNavegacaoComponent],
  templateUrl: './perguntas.component.html',
  styleUrls: ['./perguntas.component.css'],
})
export class PerguntasComponent implements OnInit {
  questoes: Pergunta[] = [];
  carregando = true;
  erro: string | null = null;

  perguntaAtual = 0;
  respostaSelecionada: string | null = null;
  feedback: string | null = null;
  mostrarExplicacao = false;

  pontuacao = 0;
  isBrowser = typeof window !== 'undefined';

  // ======== SONS ========
  somAcerto!: HTMLAudioElement;
  somErro!: HTMLAudioElement;
  somClick!: HTMLAudioElement;

  constructor(
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.isBrowser) {
      this.carregarQuiz();

      this.somAcerto = new Audio('assets/sounds/certo.wav');
      this.somErro = new Audio('assets/sounds/erro.mp3');
      this.somClick = new Audio('assets/sounds/click.wav');
    } else {
      this.carregando = false;
    }
  }

  // 🔹 Método chamado ao gerar novo quiz
  carregarQuiz() {
    this.carregando = true;
    try {
      const respostaSalva = this.localStorageService.getItem('respostaSalva');
      if (!respostaSalva) {
        this.erro = 'Nenhuma questão encontrada. Volte e gere o quiz.';
        this.carregando = false;
        return;
      }

      const data =
        typeof respostaSalva === 'string' ? JSON.parse(respostaSalva) : respostaSalva;

      if (data.questoes && data.questoes.length > 0) {
        this.questoes = data.questoes;

        // 🔹 Reset completo do estado do quiz
        this.perguntaAtual = 0;
        this.respostaSelecionada = null;
        this.feedback = null;
        this.mostrarExplicacao = false;
        this.pontuacao = 0;
        gsap.to(`#barra-progresso`, { width: '0%', duration: 0.5 });
      } else {
        this.erro = 'Nenhuma questão disponível.';
      }
    } catch (err) {
      console.error(err);
      this.erro = 'Erro ao carregar questões.';
    } finally {
      this.carregando = false;
    }
  }

  selecionarAlternativa(letra: string) {
    if (this.respostaSelecionada) return;

    this.respostaSelecionada = letra;
    const pergunta = this.questoes[this.perguntaAtual];

    if (letra === pergunta.respostaCorreta) {
      this.feedback = '✔️ Acertou!';
      this.mostrarExplicacao = true;
      this.pontuacao++;
      if (this.isBrowser) this.somAcerto.play();

      gsap.fromTo('#feedback', { scale: 0 }, { scale: 1.3, duration: 0.5, ease: 'elastic.out(1,0.5)' });
      gsap.to(`#barra-progresso`, { width: `${((this.perguntaAtual + 1)/this.questoes.length)*100}%`, duration: 0.5 });
    } else {
      this.feedback = '❌ Errou! Tente novamente';
      if (this.isBrowser) this.somErro.play();

      gsap.fromTo(`#alt-${letra}`, { x: -10 }, { x: 10, duration: 0.1, repeat: 5, yoyo: true });
    }
  }

  proximaPergunta() {
    if (this.temProximaPergunta()) {
      this.perguntaAtual++;
      this.respostaSelecionada = null;
      this.feedback = null;
      this.mostrarExplicacao = false;

      gsap.from('.pergunta-container', { opacity: 0, y: 50, duration: 0.5 });
      if (this.isBrowser) this.somClick.play();
    }
  }

  temProximaPergunta(): boolean {
    return this.perguntaAtual < this.questoes.length - 1;
  }

  reiniciarQuiz() {
    this.perguntaAtual = 0;
    this.respostaSelecionada = null;
    this.feedback = null;
    this.mostrarExplicacao = false;
    this.pontuacao = 0;
    gsap.to(`#barra-progresso`, { width: '0%', duration: 0.5 });

    if (this.isBrowser) this.somClick.play();
  }

  // 🔹 Voltar para home ao clicar na logo
  irParaHome() {
    this.router.navigate(['/']); // ajuste se sua rota home for '/home'
  }

  exibirConfete() {
    const colors = ['#F87171','#34D399','#60A5FA','#FBBF24','#A78BFA'];
    for (let i = 0; i < 50; i++) {
      const confete = document.createElement('div');
      confete.classList.add('confete');
      confete.style.backgroundColor = colors[Math.floor(Math.random()*colors.length)];
      confete.style.left = Math.random()*window.innerWidth + 'px';
      confete.style.top = '0px';
      document.body.appendChild(confete);

      gsap.to(confete, { y: window.innerHeight + 50, rotation: Math.random()*360, duration: 3 + Math.random()*2, ease: 'power1.in', onComplete: () => confete.remove() });
    }
  }
}
