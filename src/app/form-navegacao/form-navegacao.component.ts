import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faBook, faArrowRight, faSearch } from '@fortawesome/free-solid-svg-icons';
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
  faSearch = faSearch;

  materia = ''; 
  assunto = '';
  carregando = false;
  erroFormulario: string | null = null;
  buscaMateria = '';
  abrirDropdown = false;

  clickSound!: HTMLAudioElement;

  opcoesMateria = [
    // --- GERAIS E ACADÊMICAS ---
    { value: 'administracao', label: 'Administração' },
    { value: 'artes', label: 'Artes' },
    { value: 'biologia', label: 'Biologia' },
    { value: 'ciencias_sociais', label: 'Ciências Sociais' },
    { value: 'ciencias_gerais', label: 'Ciências Gerais' },
    { value: 'comunicacao', label: 'Comunicação' },
    { value: 'contabilidade', label: 'Contabilidade' },
    { value: 'design', label: 'Design' },
    { value: 'direito', label: 'Direito' },
    { value: 'economia', label: 'Economia' },
    { value: 'educacao_fisica', label: 'Educação Física' },
    { value: 'enfermagem', label: 'Enfermagem' },
    { value: 'estatistica', label: 'Estatística' },
    { value: 'filosofia', label: 'Filosofia' },
    { value: 'fisica', label: 'Física' },
    { value: 'geografia', label: 'Geografia' },
    { value: 'historia', label: 'História' },
    { value: 'ingles', label: 'Inglês' },
    { value: 'literatura', label: 'Literatura' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'matematica', label: 'Matemática' },
    { value: 'medicina', label: 'Medicina' },
    { value: 'musica', label: 'Música' },
    { value: 'pedagogia', label: 'Pedagogia' },
    { value: 'portugues', label: 'Português' },
    { value: 'psicologia', label: 'Psicologia' },
    { value: 'quimica', label: 'Química' },
    { value: 'sociologia', label: 'Sociologia' },
    
    // --- TECNOLOGIA DA INFORMAÇÃO (TI) ---
    { value: 'algoritmos', label: 'Algoritmos e Estrutura de Dados' },
    { value: 'arquitetura_software', label: 'Arquitetura de Software' },
    { value: 'banco_dados', label: 'Banco de Dados (SQL/NoSQL)' },
    { value: 'backend', label: 'Back-end Development' },
    { value: 'blockchain', label: 'Blockchain & Web3' },
    { value: 'cloud_computing', label: 'Cloud Computing (AWS/Azure)' },
    { value: 'cybersecurity', label: 'Cibersegurança' },
    { value: 'data_science', label: 'Data Science' },
    { value: 'devops', label: 'DevOps' },
    { value: 'engenharia_software', label: 'Engenharia de Software' },
    { value: 'frontend', label: 'Front-end Development' },
    { value: 'games', label: 'Desenvolvimento de Games' },
    { value: 'ia', label: 'Inteligência Artificial' },
    { value: 'infraestrutura', label: 'Infraestrutura de TI' },
    { value: 'iot', label: 'Internet das Coisas (IoT)' },
    { value: 'mobile', label: 'Mobile Development (iOS/Android)' },
    { value: 'redes', label: 'Redes de Computadores' },
    { value: 'sistemas_operacionais', label: 'Sistemas Operacionais' },
    { value: 'ux_ui', label: 'UX / UI Design' },

    // --- LINGUAGENS E FRAMEWORKS ---
    { value: 'angular', label: 'Angular' },
    { value: 'csharp', label: 'C# / .NET' },
    { value: 'cpp', label: 'C++' },
    { value: 'docker', label: 'Docker & Kubernetes' },
    { value: 'java', label: 'Java' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'node', label: 'Node.js' },
    { value: 'python', label: 'Python' },
    { value: 'react', label: 'React / React Native' },
    { value: 'typescript', label: 'TypeScript' },

    // --- ENTRETENIMENTO ---
    { value: 'filmes', label: 'Filmes e Séries' },
    { value: 'cultura_pop', label: 'Cultura Pop' },
  ].sort((a, b) => a.label.localeCompare(b.label));

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
    if (typeof window !== 'undefined') {
      this.clickSound = new Audio('assets/sounds/click.wav');
    }
  }

  get materiasFiltradas() {
    if (!this.buscaMateria.trim()) return this.opcoesMateria;
    return this.opcoesMateria.filter((m) =>
      m.label.toLowerCase().includes(this.buscaMateria.toLowerCase())
    );
  }

  selecionarMateria(m: { value: string; label: string }) {
    this.materia = m.value;
    this.buscaMateria = m.label;
    this.abrirDropdown = false;
  }

  onSubmit() {
    this.erroFormulario = null;

    if (this.materia && this.materia !== '' && this.assunto.trim() !== '') {
      this.enviarQuiz();
    } else {
      this.erroFormulario = '⚠️ Selecione a matéria e digite o assunto antes de continuar!';
      setTimeout(() => {
        this.erroFormulario = null;
      }, 5000);
    }
  }

  private async enviarQuiz() {
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
      const response = await fetch('https://gabarita-backend.onrender.com/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });

      if (!response.ok) {
        throw new Error('Erro na requisição: ' + response.statusText);
      }

      const data: any = await response.json();
      this.localStorageService.setItem('respostaSalva', JSON.stringify(data));

      this.quizGerado.emit();
      this.router.navigate(['/perguntas']);
    } catch (error) {
      console.error('Erro ao enviar dados:', error);
    } finally {
      this.carregando = false;
    }
  }
}