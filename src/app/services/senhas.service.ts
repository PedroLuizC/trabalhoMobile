import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class SenhasService {

  constructor() { }

  private horaInicioExpediente: number = 7;
  private horaFimExpediente: number = 17;
  public horaAtendimento: { [senha: string]: Date } = {};
  
  public senhasGeral: number = 0;
  public senhasPrior: number = 0;
  public senhasExame: number = 0;
  public senhasTotal: number = 0;

  public senhasAtendidas: number = 0;
  public senhasAtendidasPriorSP: number = 0;

  public inputNovaSenha: string = '';
  public senhaChamada: string = '';
  public atendimentoEmAndamento: boolean = false;
  public senhaAtual: string | null = null;
  public tempoRestante: number = 0;
  public senhasChamadas: string[] = [];

  expedienteEmAndamento(): boolean {
    const horaAtual = new Date().getHours();
    return horaAtual >= this.horaInicioExpediente && horaAtual < this.horaFimExpediente;
  }

  iniciarAtendimento(senha: string) {
    this.senhaAtual = senha;
  }

  finalizarAtendimento() {
    this.senhaAtual = null;
  }

  atualizarTempoRestante(tempoRestante: number) {
    this.tempoRestante = tempoRestante;
  }
  
  registrarAtendimentoPriorSP() {
    this.senhasAtendidasPriorSP++;
  }

  descartarSenhasForaExpediente(): void {
    if (!this.expedienteEmAndamento()) {
      this.senhasArray = {
        'SG': [], 'SP': [],'SE': []
      };
    }
  }

  public senhasArray: { [key: string]: string[] } = {
    'SG': [],
    'SP': [],
    'SE': []
  };

  registrarAtendimento() {
    this.senhasAtendidas++;
  }

  somaGeral(tipoSenha: string) {
    this.senhasGeral++;
    this.senhasTotal++;
    this.novaSenha(tipoSenha);
  }
  
  somaPrior(tipoSenha: string) {
    this.senhasPrior++;
    this.senhasTotal++;
    this.novaSenha(tipoSenha);
  }
  
  somaExame(tipoSenha: string) {
    this.senhasExame++;
    this.senhasTotal++;
    this.novaSenha(tipoSenha);
  }
  
  novaSenha(tipoSenha: string = '') {
    if (this.expedienteEmAndamento()) {
      const dataAtual = new Date();
      const ano = dataAtual.getFullYear().toString().substring(2, 4);
      const mes = (dataAtual.getMonth() + 1).toString().padStart(2, '0');
      const dia = dataAtual.getDate().toString().padStart(2, '0');
      const hora = dataAtual.getHours().toString().padStart(2, '0');
      const minuto = dataAtual.getMinutes().toString().padStart(2, '0');
      const segundos = dataAtual.getSeconds().toString().padStart(2, '0');
  
      const numeroSenha = (this.senhasArray[tipoSenha].length + 1).toString().padStart(2, '0');
  
      this.inputNovaSenha = `${ano}${mes}${dia}-${tipoSenha}${numeroSenha}`;
      this.senhasArray[tipoSenha].push(this.inputNovaSenha);
    } else {
      this.descartarSenhasForaExpediente();
    }
  }
  
  
  pegaProximaSenha(): string | undefined {

    if (this.senhasArray['SP'].length > 0) {
      return this.senhasArray['SP'].shift();
    }
    else if (this.senhasArray['SE'].length > 0) {
      return this.senhasArray['SE'].shift();
    }
    else if (this.senhasArray['SG'].length > 0) {
      return this.senhasArray['SG'].shift();
    }
    else {
      return undefined;
    }
}

atualizarSenhaChamada(senha: string) {
  this.senhaChamada = senha;
  this.senhasChamadas.unshift(senha);
}


}

