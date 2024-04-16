import Pokemon from "../models/Pokemon";

export class PokemonService {
  static async getPokemon(nome: string) {
    
    console.log('api ', nome)
    if (nome.length < 3)
      throw new Error("Favor, informe um nome válido");
    try {
      console.log('teste')
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${nome}/`
        
      );
      
      const data = await response.json();
      console.log(data, 'teste')
      if (!data.erro) {
        const address = new Pokemon(
          data.name,
          data.hp,
          data.attack,
          data.weight,
          data.height,
          data.id
        );
        return address;
      } else {
        throw new Error(
          "Não foi encontrado nenhum pokemon com o nome informado."
        );
      }
    } catch (error: any) {
        console.log(error)
      if (error?.message) throw new Error(error?.message);
      throw new Error(error);
    }
  }
}