import React, {useCallback, useEffect, useState} from 'react';
import './App.css';
import words from './data/words.json';
import Man from "./components/Man";
import Word from "./components/Word";
import Keyboard from "./components/Keyboard";

function App() {
    const [wordToGuess, setWordToGuess] = useState<string>(() => {
        return words[Math.floor(Math.random() * words.length)]
    });
    const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
    const incorrectLetters = guessedLetters.filter(letter => !wordToGuess.includes(letter));
    const isLoser = incorrectLetters.length >= 6                                                            // gg
    const isWinner = wordToGuess.split("").every(letter => guessedLetters.includes(letter)) // wp
    const addGuessedLetters = useCallback((letter: string) => {
        if (guessedLetters.includes(letter)) return
        setGuessedLetters(currentLetters => [...currentLetters, letter]);
    }, [guessedLetters])

    useEffect(() => {
        const handler = (event: KeyboardEvent) => {
            const key = event.key;
            console.log(key)
            if (!key.match(/^[a-z]/)) return
            event.preventDefault();
            addGuessedLetters(key);
        }
        document.addEventListener("keypress", handler);
        return () => {
            document.removeEventListener("keypress", handler)
        }
    }, [guessedLetters])
    console.log(wordToGuess);
    return (
        <div style={{
            maxWidth: "800px",
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            margin: "0 auto",
            alignItems: "center"
        }}>
            <div style={{fontSize: "2rem", textAlign: "center"}}>
                {isWinner && "Wow, Well played"}
                {isLoser && "Ooops, what a shame"}
            </div>
            <Man numberOfMistakes={incorrectLetters.length}/>
            <Word
                reveal={isLoser}
                wordToGuess={wordToGuess}
                guessedLetters={guessedLetters}
            />
            <div style={{alignSelf: "stretch"}}>
                <Keyboard
                    disabled={isWinner || isLoser}
                    activeLetters={guessedLetters.filter(letter => wordToGuess.includes(letter))}
                    inActiveLetters={incorrectLetters}
                    addGuessedLetters={addGuessedLetters}
                />
            </div>
        </div>
    );
}

export default App;