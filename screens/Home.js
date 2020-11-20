import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, AsyncStorage } from 'react-native';
import { Card, Input, Block, Button, NavBar } from 'galio-framework';
import axios from 'axios';

import MapboxGL from "@react-native-mapbox-gl/maps";

import Puzzle from '../components/Puzzle.js';
import PuzzleCreator from '../components/PuzzleCreator';
import UserAccount from '../components/UserAccount';
import DummyUserPuzzles from '../components/UserPuzzles';
import Marker from '../components/Marker';
import Rewards from '../components/Rewards';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoiemRlYnJpbmUiLCJhIjoiY2l5czc3ZTJpMDAwOTMzbGZpYmVkaHRtcyJ9.xh51OlwX5gd23KemtpOReg'
);

const styledMap = 'mapbox://styles/zdebrine/ckdv7d3c31vmq19mq8sxr7bv1';

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: '600',
    color: 'white',
  },
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: "black"
  },
  map: {
    flex: 1
  },
  close: {
    position: 'absolute',
    alignItems: "center",
    width: 40,
    height: 40,
    bottom: 200,
    right: '50%',
    left: '50%'

  },
});

const Home = () => {

  const [zoomLevel, setZoomLevel] = useState(15);
  const [puzzle, setPuzzle] = useState(null);
  const [puzzleCreator, setPuzzleCreator] = useState(false);
  const [accountView, setAccountView] = useState(null);
  const [rewardView, setRewardView] = useState(false);
  const [correct, setCorrect] = useState([]);
  const [position, setPosition] = useState(null);
  const [UserPuzzles, setUserPuzzles] = useState(DummyUserPuzzles);

  useEffect(() => {
    axios.get('http://10.0.0.45:9003/puzzle')
      .then((response) => {
        setUserPuzzles(response.data);
      })
  }, []);

  useEffect(() => {
    console.log('Getting solved puzzles');
    (async () => {
      try {
        const value = await AsyncStorage.getItem('solvedPuzzles');
        if (value !== null) {
          let solvedArray = []
          value.split(',').forEach(id => solvedArray.push(id));
          setCorrect(solvedArray);
        }
      } catch (error) {
        // Error retrieving data
        console.log(error)
      }
    })();
  }, []);

  const _savePuzzles = async (solved) => {
    try {
      await AsyncStorage.setItem('solvedPuzzles', `${solved}`);
    } catch (error) {
      console.log(error)
      // Error saving data
    }
  }

  const createPuzzle = (e): void => {
    setPuzzle(e.geometry.coordinates);
  };

  const openPuzzleCreator = (e): void => {
    setPosition(e.geometry.coordinates);
    setPuzzleCreator(true);
  };

  const closeModal = (): void => {
    setPuzzle(null);
    setPuzzleCreator(false);
    setAccountView(null);
    setRewardView(false);
    setPosition(null);
  }

  const openAccount = (): void => {
    setAccountView(true);
  }

  const openRewards = (): void => {
    setRewardView(true);
  }

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <MapboxGL.MapView
          onLongPress={e => { openPuzzleCreator(e) }}
          // onPress={closeModal}
          style={styles.map}
          styleURL={styledMap}
        >
          <NavBar left={
            <>
              <TouchableOpacity onPress={openAccount}>
                <Image
                  source={{ uri: 'https://i.ibb.co/1mCS6GS/settings.png' }}
                  style={{ width: 40, height: 40, marginTop: 70 }}
                />
              </TouchableOpacity>
            </>
          }
            title={
              <>
                <TouchableOpacity onPress={openRewards}>
                  <Image
                    source={{ uri: 'https://i.ibb.co/LZx43xX/star.png' }}
                    style={{ width: 40, height: 40, marginTop: 70 }}
                  />
                </TouchableOpacity>
              </>
            }
            transparent={true} />
          <MapboxGL.Camera
            followZoomLevel={zoomLevel}
            followUserLocation
          />
          <MapboxGL.UserLocation onPress={openAccount} />
          {UserPuzzles.map(userPuzzle => (
            <Marker correct={correct} userPuzzle={userPuzzle} setPuzzle={setPuzzle} />
          ))}
        </MapboxGL.MapView>
        {puzzle !== null ? (
          <>
            <Puzzle
              id={puzzle.id}
              riddle={puzzle.riddle}
              title={puzzle.title}
              answer={puzzle.answer}
              close={closeModal}
              setCorrect={setCorrect}
              correct={correct}
              _savePuzzles={_savePuzzles}
            />
          </>
        ) : puzzleCreator === true ? (
          <>
            <PuzzleCreator close={closeModal} position={position} username='IggyBiggums' />
          </>
        ) : accountView !== null ? (
          <>
            <UserAccount close={closeModal} numberSolved={correct.length} />
          </>
        ) : rewardView !== false ? (
          <>
            <Rewards close={closeModal} numberSolved={correct.length} />
          </>
        ) :
                <Text> </Text>
        }
      </View>
    </View>
  );
}

export default Home;