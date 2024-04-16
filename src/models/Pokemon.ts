export default class Pokemon {
    id: any;
    nome:string;
    base_experience:string;

    weight: string;
    height: string;
  
    constructor(
      id: any,
      nome:string,
      base_experience:string,

      weight: string,
      height: string
    ) {
      this.id = id;
      this.nome = nome;
      this.base_experience = base_experience;
     
      this.weight = weight;
      this.height = height;
    }
  }