import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Center,  HStack,  Heading, Modal, VStack } from "native-base";
import { Input } from '../../components/input/Input';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from '../../components/button/Button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from 'react-native-tiny-toast';
import uuid from 'react-native-uuid';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../../router';
import {ActivityIndicator} from 'react-native'
import { ExcluirItemDialog } from '../../components/Dialog';
import Pokemon from "../../models/Pokemon";
import { PokemonService } from '../../Services/pokemon';


type FormDataProps = {
  id: any
  nome:string;
  base_experience:string;
  weight: string;
  height: string;
}

const schemaRegister = yup.object({
  nome: yup.string().required("Nome é obrigatório").min(3, "Informe no minimo 3 digitos"),
  base_experience: yup.string().required("Experiêcia ganhada ao ser derrotado").min(1, "Informe no minimo 1 número"),
  weight: yup.string().required("Peso é obrigatório").min(1, "Informe no minimo 1 número"),
  height: yup.string().required("Altura é obrigatório").min(1, "Informe no minimo 1 número"),

 
})

type UsuarioRouteProp = BottomTabScreenProps<RootTabParamList, 'Usuario'>;

export const Usuario = ({route, navigation}: UsuarioRouteProp ) => {

  const {control, handleSubmit, reset , setValue , formState: {errors}}  = useForm<FormDataProps>({
      resolver: yupResolver(schemaRegister) as any
  });
  
  const[loading, setloading] = useState(true);
  const [searcherID,setSearcherID] = useState(false);
  const [NomePokemon,setNomePokemon] = useState("");
  const [showDeleteDialog,setShowDeleteDialog] = useState(false);
  const [Pokemon, setPokemon] = useState<Pokemon>();
  const isEditing = !!route?.params?.id;


useEffect(() => {
  if(isEditing) {
    handlerSearcher(route.params.id)
    setSearcherID(true);
  }
  else{
    reset();
    setSearcherID(false);
    setloading(false);
  }
  return () => setloading(true);
}, [route, isEditing]
);


const handlerGetPokemon = async () => {
  try {
    
    //if (!NomePokemon) return;
    const Pokemon = await PokemonService.getPokemon(NomePokemon);
    if (Pokemon) {
      setPokemon(Pokemon);
      setValue("nome", Pokemon.nome);
      setValue("height", Pokemon.height.toString());
      setValue("weight", Pokemon.weight.toString());
      setValue("base_experience", Pokemon.base_experience.toString());
     
      setValue("id", Pokemon.id);
    }
  } catch (error: any) {
    
    Toast.showSuccess("Erro ao registrar usuário "+ error)
  }
};




  async function handlerRegister(data:FormDataProps){
    data.id = uuid.v4().toString();
    //console.log(data);
    try{
      
      const reponseData =  await AsyncStorage.getItem('@crud_form:usuario')
      const dbData = reponseData ? JSON.parse(reponseData!) : [];
      console.log(dbData);
      const previewData = [...dbData, data];

      await AsyncStorage.setItem('@crud_form:usuario', JSON.stringify(previewData))
      reset();
      handleList();
      Toast.showSuccess("Usuário registrado com sucesso")
      
    }catch (e){
      Toast.showSuccess("Erro ao registrar usuário "+e)
      reset();
    }


  }

  async function handlerSearcher(id:string){
    try{
      setloading(true)
     
      const responseData = await AsyncStorage.getItem('@crud_form:usuario')
      const dbData: FormDataProps[] = responseData? JSON.parse(responseData): [];

      const itemEncontrado = dbData?.find(item=> item.id === id)
      if(itemEncontrado){
        setPokemon({
          nome: itemEncontrado.nome,
          altura: itemEncontrado.height,
          id: itemEncontrado.id,
          peso: itemEncontrado.weight,
          ataque: itemEncontrado.base_experience,

        });
        setPokemon(itemEncontrado.id);
        Object.keys(itemEncontrado).forEach((key) => setValue(key as keyof FormDataProps,
          itemEncontrado?.[key as keyof FormDataProps] as string

        ));
      setSearcherID(true);
      

      }
      setloading(false);
    }
    catch(e){
      setSearcherID(false);
      console.log(e)
    }
  
  }

  async function handlerAlterRegister(data: FormDataProps){
    try {
      setloading(true)
      
      const reponseData =  await AsyncStorage.getItem('@crud_form:usuario')
      const dbData: FormDataProps[] = reponseData? JSON.parse(reponseData!) : [];
      const poke = dbData.findIndex((u) => u.id == data.id);
      if(poke >= 0){
        dbData.splice(poke, 1);
        const previewData = [...dbData, data];
        await AsyncStorage.setItem(
          "@crud_form:usuario",
          JSON.stringify(previewData)
        );        
        Toast.showSuccess("Usuário alterado com sucesso");
        setloading(false);
        setSearcherID(false);
        reset();
        handleList();
      
      }else{
        Toast.show("Registro não localizado.");
      }

    } catch (error) {
      
    }
  }


  async function handleList() {
    navigation.navigate('Home');
    
  }

  async function HandleDelete(data:FormDataProps) {
    try {
      setloading(true)
      const reponseData =  await AsyncStorage.getItem('@crud_form:usuario')
      const dbData: FormDataProps[] = reponseData? JSON.parse(reponseData!) : [];
      const indexRemove = dbData?.findIndex(item => item.id === data.id)
      console.log(indexRemove,dbData)
      if(indexRemove !== -1){
        dbData.splice(indexRemove,1);
        
        await AsyncStorage.setItem('@crud_form:usuario', JSON.stringify(dbData))
        Toast.showSuccess("Usuário excluído com sucesso");
        setShowDeleteDialog(false);
        setloading(false);
        setSearcherID(false);
        reset();
        handleList();
      
      }else{
        Toast.show("Registro não localizado.");
      }

    } catch (e) {
      console.log(e);
    }
    
  }

  if(loading) return <ActivityIndicator size="large" color = "#000fff"/>
  return (
    <KeyboardAwareScrollView>
    <VStack bgColor="gray.300" flex={1} px={5} pb={100}>
        <Center>
            <Heading my={5}>
                Cadastro de Pokemons
            </Heading>
          <Controller 
            control={control}
            name="nome"
            defaultValue=''
            render={({field: {onChange, value }})=>(
            <Input
              placeholder='Nome'
              
              errorMessage={errors.nome?.message}
              onChangeText={(value) => setNomePokemon(value)}
              onBlur={() => {
                handlerGetPokemon();
              }}
              defaultValue={NomePokemon}
            />
            )}
          />
          <Controller 
            control={control}
            name="base_experience"
            
            render={({field: {onChange, value }})=>(
            <Input
              placeholder='Experiência ganhada ao ser derrotado.'
              onChangeText={onChange}
              errorMessage={errors.base_experience?.message}
              value={value}

            />
            )}
          />
 
          <Controller 
            control={control}
            name="weight"
            
            render={({field: {onChange, value }})=>(
            <Input
              placeholder='peso em KG'
              onChangeText={onChange}
              
              errorMessage={errors.weight?.message}
              value={value}
     
            />
            )}
          />
           <Controller 
            control={control}
            name="height"
           
            render={({field: {onChange, value }})=>(
            <Input
              placeholder='altura em metros'
              onChangeText={onChange}
              defaultValue={Pokemon?.height}
              errorMessage={errors.height?.message}
              value={value}
           
            />
            )}
          />
          {searcherID ? (
            <VStack>
            <HStack>
              <Button rounded="md" shadow={3} title='Alterar' color='#F48B20' onPress={handleSubmit(handlerAlterRegister)} />
            </HStack>
            <HStack paddingTop={5}>
              <Button rounded="md" shadow={3} title='Excluir' color='#CC0707' onPress={() => setShowDeleteDialog(true)} />
            </HStack>
            </VStack>
          ) : (
            <Button title='Cadastrar' color='green.700' onPress={handleSubmit(handlerRegister)} />
          )}
          
        </Center>
      </VStack>
      <Modal isOpen= {showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
          <ExcluirItemDialog 
          isVisible = {showDeleteDialog}
          onCancel={() => setShowDeleteDialog(false)}
          onConfirm={handleSubmit(HandleDelete)}  
          />
        </Modal>
    </KeyboardAwareScrollView>
      
  );
  
}

