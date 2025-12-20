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

  carregarQuiz() {
    this.carregando = true;

    try {
      const respostaSalva = this.localStorageService.getItem('respostaSalva');
      if (!respostaSalva) {
        this.erro = 'Nenhuma questão encontrada.';
        return;
      }

      const data =
        typeof respostaSalva === 'string'
          ? JSON.parse(respostaSalva)
          : respostaSalva;

      this.questoes = data.questoes || [];
      this.perguntaAtual = 0;
      this.respostaSelecionada = null;
      this.feedback = null;
      this.mostrarExplicacao = false;
      this.pontuacao = 0;

      gsap.to('#barra-progresso', { width: '0%', duration: 0.5 });
    } catch (e) {
      this.erro = 'Erro ao carregar quiz.';
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
      this.somAcerto.play();

      gsap.fromTo(
        '#feedback',
        { scale: 0 },
        { scale: 1.2, duration: 0.6, ease: 'elastic.out(1,0.6)' }
      );

      gsap.to('#barra-progresso', {
        width: `${((this.perguntaAtual + 1) / this.questoes.length) * 100}%`,
        duration: 0.5,
      });

      this.scrollSuave();
    } else {
      this.feedback = '❌ Errou! Tente novamente';
      this.somErro.play();

      gsap.fromTo(
        `#alt-${letra}`,
        { x: -10 },
        { x: 10, repeat: 5, yoyo: true, duration: 0.1 }
      );

      this.scrollSuave();
    }
  }

  scrollSuave() {
    if (!this.isBrowser) return;

    setTimeout(() => {
      const el = document.getElementById('feedback');
      if (el) {
        el.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }, 300); // MAIS suave
  }

  proximaPergunta() {
    if (!this.temProximaPergunta()) return;

    this.perguntaAtual++;
    this.respostaSelecionada = null;
    this.feedback = null;
    this.mostrarExplicacao = false;
    this.somClick.play();

    gsap.from('.pergunta-container', {
      opacity: 0,
      y: 40,
      duration: 0.4,
    });
  }

  temProximaPergunta() {
    return this.perguntaAtual < this.questoes.length - 1;
  }

  reiniciarQuiz() {
    this.carregarQuiz();
    this.somClick.play();
  }

  irParaHome() {
    this.router.navigate(['/']);
  }
}
