import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faBook, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { LocalStorageService } from '../_services/local-storage.service';

@Component({
  selector: 'app-form-navegacao',
  standalone: true,
  imports: [FontAwesomeModule, FormsModule, CommonModule],
  templateUrl: './form-navegacao.component.html',
  styleUrls: ['./form-navegacao.component.css'],
})
export class FormNavegacaoComponent {
  @Output() quizGerado = new EventEmitter<void>();

  faBars = faBars;
  faBook = faBook;
  faArrowRight = faArrowRight;

  materia = 'materia';
  assunto = '';
  carregando = false;
  erroFormulario: string | null = null; // ✅ nova variável para exibir erro

  clickSound!: HTMLAudioElement;

  opcoesMateria = [
    { value: 'matematica', label: 'Matemática' },
    { value: 'portugues', label: 'Português' },
    { value: 'historia', label: 'História' },
    { value: 'geografia', label: 'Geografia' },
    { value: 'fisica', label: 'Física' },
    { value: 'quimica', label: 'Química' },
    { value: 'biologia', label: 'Biologia' },
    { value: 'ingles', label: 'Inglês' },
    { value: 'espanhol', label: 'Espanhol' },
    { value: 'filosofia', label: 'Filosofia' },
    { value: 'sociologia', label: 'Sociologia' },
    { value: 'artes', label: 'Artes' },
    { value: 'educacao_fisica', label: 'Educação Física' },
    { value: 'materia', label: 'Matéria' },
  ];

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
    if (typeof window !== 'undefined') {
      this.clickSound = new Audio('assets/sounds/click.wav');
    }
  }

  async onSubmit() {
    // Limpa erro anterior
    this.erroFormulario = null;

    if (this.materia !== 'materia' && this.assunto.trim() !== '') {
      if (this.clickSound) {
        this.clickSound.currentTime = 0;
        this.clickSound.play();
      }

      this.carregando = true;

      const dados = {
        materia: this.materia,
        assunto: this.assunto.trim(),
      };

      try {
        const response = await fetch(
          'https://gabarita-backend.onrender.com/api/quiz',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados),
          }
        );

        if (!response.ok) {
          throw new Error('Erro na requisição: ' + response.statusText);
        }

        const data = await response.json();
        this.localStorageService.setItem(
          'respostaSalva',
          JSON.stringify(data)
        );

        this.quizGerado.emit();
        this.router.navigate(['/perguntas']);
      } catch (error) {
        console.error(
          'Erro ao enviar dados ou armazenar localStorage:',
          error
        );
      } finally {
        this.carregando = false;
      }
    } else {
      // Caso usuário não tenha selecionado matéria ou assunto
      this.erroFormulario = '⚠️ Selecione a matéria e digite o assunto antes de continuar!';
    }
  }
}
