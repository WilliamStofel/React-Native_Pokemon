import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { styles } from './styles';
import React from 'react';

export type CardProps = {
  id: any
  nome:string;
  base_experience:string;
  weight: string;
  height: string;
}
type Props = {
  data: CardProps;
  onPress: () => void;
}

export function Card({ data, onPress }: Props) {
  
//console.log(data.nome)
  


  return (
    <View style={styles.container}>


      <View style={styles.content}>
        <View>
          <Text style={styles.nome}>
            {data.nome}
          </Text>
          <Text style={styles.email}>
          Peso: {data.weight} KG
          </Text>
          <Text style={styles.password}>
          Altura: {data.height} Metros
          </Text>

        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
      >
        <MaterialIcons
          name="edit"
          size={22}
          color="#888D97"
        />
      </TouchableOpacity>
    </View>
  );
}