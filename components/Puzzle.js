import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Keyboard, TouchableWithoutFeedback, AsyncStorage, Image, ScrollView } from 'react-native';
import { Card, Input, Block, Button, DeckSwiper } from 'galio-framework';

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        paddingTop: 100,
        paddingBottom: 30,
        padding: 40,
        width: '100%',
        height: '100%',
        bottom: 0,
        right: 0,
        backgroundColor: '#000000',
        opacity: 0.9,
    },
    dino: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 300,
        height: 220,
        marginBottom: 20,
    },
    swiper: {
        position: 'absolute',
        marginTop: 30,
        padding: 40,
        width: '100%',
        height: '100%',
        bottom: 0,
        right: 0,
    },
    sectionTitle: {
        fontSize: 40,
        fontWeight: '600',
        color: 'white',
        marginBottom: 50,
    },
    sectionBody: {
        fontSize: 26,
        fontWeight: '600',
        color: 'white',
        marginBottom: 20,
    },
    submitButton: {
        marginTop: 30,
        marginBottom: 100,
    },
    exit: {
        marginTop: -40,
        marginBottom: 10,
        left: 300,
    },
});

const Puzzle = ({ riddle, title, answer, close, id, setCorrect, correct, _savePuzzles }) => {

    const [userInput, setUserInput] = useState(null);

    const handleChange = (text) => {
        setUserInput(text.toLowerCase());
    };

    const checkAnswer = () => {
        if (userInput === answer.toLowerCase()) {
            correct.push(id);
            _savePuzzles(correct);
            close();
        }
    }

    return (
        <ScrollView style={styles.overlay}>
            <TouchableOpacity style={styles.exit} onPress={close}>
                <Text style={styles.sectionBody}>
                    x
                </Text>
            </TouchableOpacity>
            <Image
                id='dino'
                style={styles.dino}
                source={{
                    uri: 'https://i.ibb.co/nwmR5Vg/dino.png',
                }}
            />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Text style={styles.sectionTitle}>{title}</Text>
            </TouchableWithoutFeedback>
            <Text style={styles.sectionBody}>{riddle}</Text>
            {correct.includes(id) ? (
                <Input disabled onChangeText={(text) => { handleChange(text) }} placeholder="SOLVED" color={'green'} style={{ borderColor: 'green' }} placeholderTextColor={'green'} />
            )
                :
                (
                    <Input onChangeText={(text) => { handleChange(text) }} placeholder="Your answer" color={'red'} style={{ borderColor: 'red' }} placeholderTextColor={'red'} />
                )
            }
            <Button style={styles.submitButton} color="primary" onPress={checkAnswer}>SUBMIT</Button>
        </ScrollView>
    );
}
export default Puzzle;