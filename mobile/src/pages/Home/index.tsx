import React, { useState, useEffect } from 'react';
import { View,ImageBackground, Image, StyleSheet, Text } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import {Feather as Icon} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'
import Select, {Item} from 'react-native-picker-select';
import axios from 'axios';

interface IGBEUFResponse {
  sigla: string;
}
interface IGBECityResponse {
  nome: string;
}

const Home = () => {
  const [ufs, setUfs] = useState<Item[]>([]);
  const [cities, setCities] = useState<Item[]>([]);

  const [selectedUF, setSelectedUF] = useState<string >('0');
  const [selectedCity, setSelectedCity] = useState<string>();

  useEffect(() => {
    axios.get<IGBEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome').then(response => {
      const ufInitials = response.data.map(uf => uf.sigla);
      const serializedUfs = ufInitials.map(uf => ({
        label: uf,
        value: uf,
      }))
      setUfs(serializedUfs);
    });
  },[]);
  useEffect(()=> {
    if(selectedUF === '0'){
      return;
    }
    axios.get<IGBECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`).then(response => {
      const cityNames = response.data.map(city => city.nome);
      const serializedCity = cityNames.map(city => ({
        label: city,
        value: city,
      }))
      setCities(serializedCity);
    })

  },[selectedUF]);

  const navigation = useNavigation();

  function handleNavigateToPoints(){
    navigation.navigate("Points",{
      uf: selectedUF,
      city: selectedCity
    })
  }

  return (
    <ImageBackground 
      source={require('../../assets/home-background.png')} 
      style={styles.container}
      imageStyle={{width:274, height: 368}}      
    >
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
      </View>

      <View style={styles.footer} >
        <Select 
          style={{
            viewContainer:styles.input,
            inputAndroid: {color: 'black'}            
          }}
          placeholder={{
            label: 'Selecione um estado',
            value: '0',
            color:'#b3b3b3'
          }}
          value={selectedUF}
          onValueChange={(value) => setSelectedUF(value)}
          items={ufs}
        />
        <Select 
          style={{
            viewContainer:styles.input,
            inputAndroid: {color: 'black'}            
          }}
          disabled={selectedUF === '0'}
          placeholder={{
            label: 'Selecione uma cidade',
            value: '0',
            color:'#b3b3b3'
          }}
          onValueChange={(value) => setSelectedCity(value)}
          items={cities}
        />
          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Icon name="arrow-right" color="#FFF" size={24} />
            </View>
            <Text style={styles.buttonText}>
              Entrar
            </Text>
          </RectButton>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 56,
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 8,
    justifyContent: 'center',
    paddingHorizontal: 24,
    color: 'red',
    fontSize: 14,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;
