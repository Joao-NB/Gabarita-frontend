import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild('scrollAnchor') scrollAnchor!: ElementRef;

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

      const data = typeof respostaSalva === 'string'
        ? JSON.parse(respostaSalva)
        : respostaSalva;

      this.questoes = data.questoes || [];
      this.perguntaAtual = 0;
      this.respostaSelecionada = null;
      this.feedback = null;
      this.mostrarExplicacao = false;
      this.pontuacao = 0;

      gsap.to('#barra-progresso', { width: '0%', duration: 0.5 });
    } finally {
      this.carregando = false;
    }
  }

  selecionarAlternativa(letra: string) {
    if (this.respostaSelecionada) return;

    this.respostaSelecionada = letra;
    const pergunta = this.questoes[this.perguntaAtual];
    const containerAlternativa = document.getElementById(`alt-${letra}`);
    const feedbackEl = document.getElementById('feedback');

    if (letra === pergunta.respostaCorreta) {
      this.feedback = '✔️ Acertou!';
      this.mostrarExplicacao = true;
      this.pontuacao++;
      this.somAcerto.play();

      if (feedbackEl) {
        feedbackEl.classList.remove('comemorar');
        void feedbackEl.offsetWidth;
        feedbackEl.classList.add('comemorar');
      }

      gsap.to('#barra-progresso', {
        width: `${((this.perguntaAtual + 1) / this.questoes.length) * 100}%`,
        duration: 0.5,
      });
    } else {
      this.feedback = '❌ Errou! Tente novamente';
      this.somErro.play();

      if (containerAlternativa) {
        containerAlternativa.classList.remove('tremer');
        void containerAlternativa.offsetWidth;
        containerAlternativa.classList.add('tremer');
      }
    }

    this.scrollParaBaixoSuave();
  }

  proximaPergunta() {
    this.perguntaAtual++;
    this.respostaSelecionada = null;
    this.feedback = null;
    this.mostrarExplicacao = false;

    this.somClick.play();
    this.scrollParaBaixoSuave();
  }

  reiniciarQuiz() {
    this.perguntaAtual = 0;
    this.respostaSelecionada = null;
    this.feedback = null;
    this.mostrarExplicacao = false;
    this.pontuacao = 0;

    this.somClick.play();
    this.scrollParaBaixoSuave();
  }

  scrollParaBaixoSuave() {
    setTimeout(() => {
      this.scrollAnchor?.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }, 100);
  }

  temProximaPergunta(): boolean {
    return this.perguntaAtual < this.questoes.length - 1;
  }

  irParaHome() {
    this.router.navigate(['/']);
  }
}
