import Pokemon from "../models/Pokemon";

export class PokemonService {
  static async getPokemon(nome: string) {
    
    console.log('api ', nome.toLowerCase())
    if (nome.length < 3)
      throw new Error("Favor, informe um nome válido");
    try {
      
      
      
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${nome.toLowerCase().trim()}/`
        
      );
      
      const data = await response.json();
      
      if (!data.erro) {
        const address = new Pokemon(
          data.id,
          data.name,
          data.base_experience,
          data.weight = (parseFloat(data.weight)/10).toString(),
          data.height = (parseFloat(data.height)/10).toString(),
          //data.weight = (data.weight.parseFloat()/10).toString(),
          //data.height= (data.height.parseFloat()/10).toString()
          
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