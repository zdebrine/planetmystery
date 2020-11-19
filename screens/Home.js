import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, AsyncStorage } from 'react-native';
import { Card, Input, Block, Button, NavBar } from 'galio-framework';

import MapboxGL from "@react-native-mapbox-gl/maps";

import Puzzle from '../components/Puzzle.js';
import PuzzleCreator from '../components/PuzzleCreator';
import UserAccount from '../components/UserAccount';
import UserPuzzles from '../components/UserPuzzles';
import Marker from '../components/Marker';

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
  const [accountView, setAccountView] = useState(true);
  const [correct, setCorrect] = useState([]);

  const onUserMarkerPress = (): void => {
    Alert.alert('You pressed on the user location annotation');
  };

  const createPuzzle = (e): void => {
    setPuzzle(e.geometry.coordinates);
  };

  const openPuzzleCreator = (e): void => {
    setPuzzleCreator(true);
  };

  const closeModal = (): void => {
    setPuzzle(null);
    setPuzzleCreator(false);
    setAccountView(null);
  }

  const openAccount = (): void => {
    setAccountView(true);
  }

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <MapboxGL.MapView
          onLongPress={openPuzzleCreator}
          // onPress={closeModal}
          style={styles.map}
          styleURL={styledMap}
        >
          <TouchableOpacity onPress={openAccount}>
            <NavBar left={<Image
              source={{ uri: 'https://i.ibb.co/XLGmZrt/star.png' }}
              style={{ width: 40, height: 40, marginTop: 70 }}
            />}
              transparent={true} />
          </TouchableOpacity>
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
              correct={correct} />
          </>
        ) : puzzleCreator === true ? (
          <>
            <PuzzleCreator close={closeModal} />
          </>
        ) : accountView !== null ? (
          <>
            <UserAccount close={closeModal} />
          </>
        ) :
              <Text> </Text>
        }
      </View>
    </View>
  );
}

export default Home;