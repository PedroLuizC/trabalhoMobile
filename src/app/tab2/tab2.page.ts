import { Component } from '@angular/core';
import { SenhasService } from '../services/senhas.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})

export class Tab2Page {

  constructor(public senhasService: SenhasService) {}

  chamarCliente() {
    const proximaSenha = this.senhasService.pegaProximaSenha();
    if (proximaSenha) {
      const tipoSenhaMatch = proximaSenha.match(/[A-Z]+/);
      if (tipoSenhaMatch && tipoSenhaMatch.length > 0) {
        const tipoSenha = tipoSenhaMatch[0];
        let tempoEspera: number;
        switch (tipoSenha) {
          case 'SP':
            const tempoPadrao = 15;
            const variacao = 5;
            tempoEspera = tempoPadrao - variacao + Math.floor(Math.random() * (2 * variacao + 1));
            break;
          case 'SE':
            const randomValue = Math.random();
            tempoEspera = randomValue <= 0.9 ? 1 : 5;
            break;
          case 'SG':
            const tempoPadraoSG = 5;
            const variacaoSG = 3;
            tempoEspera = tempoPadraoSG - variacaoSG + Math.floor(Math.random() * (2 * variacaoSG + 1));
            break;
          default:
            tempoEspera = 0;
            break;
        }

        this.senhasService.iniciarAtendimento(proximaSenha);
        this.senhasService.horaAtendimento[proximaSenha] = new Date();

        let tempoRestante = tempoEspera * 60;
        this.senhasService.atualizarTempoRestante(tempoRestante);

        const intervalo = 1000;
        const timer = setInterval(() => {
          tempoRestante -= 1;
          this.senhasService.atualizarTempoRestante(tempoRestante);

          if (tempoRestante <= 0) {
            clearInterval(timer);
            this.senhasService.atualizarSenhaChamada(proximaSenha);
            const horaAtual = new Date();
            this.senhasService.finalizarAtendimento();
            this.senhasService.registrarAtendimento();
              if (tipoSenha === 'SP') {
                this.senhasService.registrarAtendimentoPriorSP();
             }
          }
        }, intervalo);

      } else {
        console.error("Não foi possível identificar o tipo de senha:", proximaSenha);
        }
    } else {
      alert('Não há senhas na fila.');
      }
  }
  
}

