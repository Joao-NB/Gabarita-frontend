import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormNavegacaoComponent } from '../form-navegacao/form-navegacao.component';
import { QuizService } from '../_services/quiz.service';
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
  correctCount = 0;
  wrongCount = 0;
  isBrowser = typeof window !== 'undefined';

  somAcerto!: HTMLAudioElement;
  somErro!: HTMLAudioElement;
  somClick!: HTMLAudioElement;

  frasesAcerto: string[] = [
    '✔️ Acertou! Mandou bem!',
    '🎯 Perfeito! Você é fera!',
    '✨ Boom! Gabaritou!',
    '💡 Eureka! Acertou!',
    '🔥 Que tiro! Muito bem!',
    '😎 Acerto de mestre!',
    '🎉 Mandou super bem!',
    '👍 Hit! Acertou na mosca!',
    '🥳 Uau! Isso sim é conhecimento!',
    '🏆 Ganhador de ouro!'
  ];

  frasesErro: string[] = [
    '❌ Errou! Mas não desista!',
    '😅 Ops, quase lá!',
    '💥 Quem nunca, né?',
    '⚡ Tentativa falha, mas vamos!',
    '🫣 Não foi dessa vez!',
    '🤔 Humm… quase acertou!',
    '😬 Erro detectado! Tente novamente!',
    '💡 Dica: a próxima é sua!',
    '😜 Errar faz parte!',
    '🔥 Não desanime, vamos de novo!'
  ];

  constructor(
    private quizService: QuizService,
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
      const respostaSalva = localStorage.getItem('respostaSalva');
      if (!respostaSalva) {
        this.erro = 'Nenhuma questão encontrada.';
        return;
      }

      const data = JSON.parse(respostaSalva);
      this.questoes = data.questoes || [];
      this.perguntaAtual = 0;
      this.respostaSelecionada = null;
      this.feedback = null;
      this.mostrarExplicacao = false;
      this.pontuacao = 0;
      this.correctCount = 0;
      this.wrongCount = 0;

      if (this.isBrowser) {
        gsap.to('#barra-progresso', { width: '0%', duration: 0.5 });
      }
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
      const indexAleatorio = Math.floor(Math.random() * this.frasesAcerto.length);
      this.feedback = this.frasesAcerto[indexAleatorio];

      this.mostrarExplicacao = true;
      this.pontuacao++;
      this.correctCount++;
      this.somAcerto.play();

      gsap.fromTo(
        '#feedback',
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }
      );

      gsap.to('#barra-progresso', {
        width: `${((this.perguntaAtual + 1) / this.questoes.length) * 100}%`,
        duration: 0.5,
      });

      this.scrollSuave('feedback');
    } else {
      const indexErro = Math.floor(Math.random() * this.frasesErro.length);
      this.feedback = this.frasesErro[indexErro];

      this.wrongCount++;
      this.somErro.play();

      gsap.fromTo(
        `#alt-${letra} .alternativa-texto`,
        { x: -5 },
        { x: 5, repeat: 5, yoyo: true, duration: 0.1, force3D: true }
      );

      this.scrollSuave('feedback');
    }
  }

  scrollSuave(elementId: string) {
    if (!this.isBrowser) return;

    setTimeout(() => {
      const el = document.getElementById(elementId);
      const container = document.querySelector('.pergunta-container');
      
      if (el && container) {
        const targetPos = el.offsetTop - 50;
        container.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    }, 300);
  }

  proximaPergunta() {
    if (!this.temProximaPergunta()) return;

    this.perguntaAtual++;
    this.respostaSelecionada = null;
    this.feedback = null;
    this.mostrarExplicacao = false;
    this.somClick.play();

    const container = document.querySelector('.pergunta-container');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }

    gsap.from('.pergunta-container', {
      opacity: 0,
      y: 20,
      duration: 0.4,
    });

    // Se for a última pergunta, finaliza automaticamente
    if (!this.temProximaPergunta()) {
      this.finalizarQuiz();
    }
  }

  temProximaPergunta() {
    return this.perguntaAtual < this.questoes.length - 1;
  }

  reiniciarQuiz() {
    this.carregarQuiz();
    this.somClick.play();
    
    const container = document.querySelector('.pergunta-container');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  async finalizarQuiz() {
    const quizId = localStorage.getItem('quizId');
    if (!quizId) return;

    try {
      const response = await this.quizService
        .submitQuiz(quizId, this.pontuacao, this.correctCount, this.wrongCount)
        .toPromise();

      console.log('Quiz submetido:', response);
    } catch (err) {
      console.error('Erro ao submeter quiz:', err);
    }
  }

  irParaHome() {
    this.router.navigate(['/']);
  }
}
