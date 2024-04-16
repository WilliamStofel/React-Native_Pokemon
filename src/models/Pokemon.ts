export default class Pokemon {
    id: any;
    nome:string;
    vida:string;
    ataque:string;
    peso: string;
    altura: string;
  
    constructor(
      id: any,
      nome:string,
      vida:string,
      ataque:string,
      peso: string,
      altura: string
    ) {
      this.id = id;
      this.nome = nome;
      this.vida = vida;
      this.ataque = ataque;
      this.peso = peso;
      this.altura = altura;
    }
  }