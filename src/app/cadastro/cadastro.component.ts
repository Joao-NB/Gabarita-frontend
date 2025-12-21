import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importante para diretivas básicas
import { Router } from '@angular/router'; // 1. Importar o Router

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent {
  email: string = '';
  password: string = '';

  // 2. Injetar o Router no construtor
  constructor(private router: Router) {}

  // 3. Criar o método que o seu HTML está tentando chamar
  irParaHome(): void {
    this.router.navigate(['/']);
  }

  onLogin(): void {
    console.log('E-mail:', this.email);
    console.log('Senha:', this.password);
  }
}