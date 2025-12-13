  import { Component } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { Router } from '@angular/router';
  import { FormsModule, NgForm } from '@angular/forms';
  import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
  import {
    faBars,
    faBook,
    faArrowRight,
  } from '@fortawesome/free-solid-svg-icons';
  import { ApiGeminiService } from '../_services/api-gemini.service';
  import { GeminiSend } from '../_models/geminiSend';
  import { LocalStorageService } from '../_services/local-storage.service';
  @Component({
    selector: 'app-form-navegacao',
    standalone: true,
    imports: [FontAwesomeModule, FormsModule, CommonModule],
    templateUrl: './form-navegacao.component.html',
    styleUrl: './form-navegacao.component.css',
  })
  export class FormNavegacaoComponent {
    faBars = faBars;
    faBook = faBook;
    faArrowRight = faArrowRight;

    opcoesMateria = [
      {
        value: 'matematica',
        label: 'Matemática',
      },
      {
        value: 'portugues',
        label: 'Português',
      },
      {
        value: 'historia',
        label: 'História',
      },
      {
        value: 'geografia',
        label: 'Geografia',
      },
      {
        value: 'fisica',
        label: 'Física',
      },
      {
        value: 'quimica',
        label: 'Química',
      },
      {
        value: 'biologia',
        label: 'Biologia',
      },
      {
        value: 'ingles',
        label: 'Inglês',
      },
      {
        value: 'espanhol',
        label: 'Espanhol',
      },
      {
        value: 'filosofia',
        label: 'Filosofia',
      },
      {
        value: 'sociologia',
        label: 'Sociologia',
      },
      {
        value: 'artes',
        label: 'Artes',
      },
      {
        value: 'educacao_fisica',
        label: 'Educação Física',
      },
      {
        value: 'materia',
        label: 'Matéria',
      },
    ];

    constructor(private router: Router, private localStorageService: LocalStorageService) {}
    

    materia = 'materia';
    assunto = 'assunto';

    async onSubmit() {
      if (this.materia !== 'materia' && this.assunto !== 'assunto') {
        const dados = {
          materia: this.materia,
          assunto: this.assunto,
        };

        try {
          const response = await fetch(
            'https://gabarita-backend-steel.vercel.app/api/quiz',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(dados),
            }
          );

          if (!response.ok) {
            throw new Error('Erro na requisição: ' + response.statusText);
          }

          const data = await response.json();

          // Armazena a resposta em um cookie
          this.localStorageService.setItem('respostaSalva', data);
          console.log('Resposta salva no localStorage:', data);
          this.router.navigate(['/perguntas']



          );
        } catch (error) {
          console.error('Erro ao enviar dados ou armazenar cookie:', error);
        }
      }
  }
  
  }
