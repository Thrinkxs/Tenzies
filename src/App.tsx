import {useState, useEffect} from "react"
import Dice from "./components/Dice"
import Won from "./components/Won"
import uniqid from 'uniqid'

// STYLESHEET
import "./App.css"

export default function App(){

    /**************STATES****************/
    const [dice, setDice] = useState(getDiceNum());
    const [tenzies, setTenzies] = useState(false)
    const [duration, setDuration] = useState(0);
    const [startGame, setStartGame] = useState(false);
    const [bestTime, setBestTime] = useState(localStorage.getItem("bestTime") ?? "0");

  
    /**************USE EFFECTS****************/
    //Effect to run if game is finished and all conditions met
    useEffect(()=>{
        const isAllHeld = dice.every(dice => dice.isHeld);
        const firstDice = dice[0].value;
        const isAllSameValue = dice.every(dice => dice.value === firstDice);
        if(isAllHeld && isAllSameValue) {
            setTenzies(true);
            setStartGame(false);
            setBestTime(prevBestTime => {
                const prevBestTimeNumber = Number(prevBestTime); 
                if(prevBestTimeNumber === 0 || duration < prevBestTimeNumber){ 
                    localStorage.setItem("bestTime", duration.toString()); 
                    return duration.toString();
                }
                else{
                    return prevBestTime;
                }
            });
        }
    }, [dice])

    //Effect to run timer
    useEffect(()=>{
        let timer:  number | undefined;
        if(startGame){
            timer = setInterval(() => {
                setDuration(duration => duration + 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [startGame]);


    /**************FUNCTIONS****************/

    function beginGame() {
        setStartGame(true)
    }

    function getRandomNum(){
        const randomNum = Math.ceil(Math.random() * 6)
        return randomNum
    }

    function getDiceNum(){
        const diceArray = []
        for (let i = 0; i < 10; i++){
            const randomNum ={id: uniqid(), value: getRandomNum(), isHeld: false}
            diceArray.push(randomNum);
        }
        return diceArray
    }

    function rollDice(){
        if(tenzies) {
            setDice(getDiceNum);
            setTenzies(false);
            setDuration(0)
        }
        else {
            setDice(oldDice => oldDice.map(dice => {
                return dice.isHeld ? dice : {...dice, value: getRandomNum()}
            }))
        }
    }

    function selectDice(id: string){
       setDice(oldDice => oldDice.map(dice => {
        if(tenzies) {
            return dice
        }
        else {
            return dice.id === id ? {...dice, isHeld: !dice.isHeld} : dice
        }
        
       }))
    }

    function convertToTimeFormat(num: string | number) {
        const time = new Date(0);
        time.setSeconds(Number(num)); // Convert num to number using Number() function
        const timeString = time.toISOString().substring(14, 19);
        return timeString
    }

    function resetBestTime() {
        localStorage.removeItem("bestTime");
        setBestTime("0");
    }

    /**************JSX ELEMENTS****************/
    const diceElement = dice.map(die => {
                                    return <Dice 
                                    key={die.id} 
                                    id={die.id} 
                                    value={die.value} 
                                    isHeld={die.isHeld} 
                                    handleSelect={()=>selectDice(die.id)}/>
    })
    const game = () => {
        if(!tenzies) {
            if(!startGame){
                return (
                    <>
                        <button className="roll--btn" onClick={beginGame}> Start Game</button>
                    </>
                )
            }
            else {
                return (
                    <div className="dice--container">
                        {diceElement}
                    </div>
                )
            }
        }
    }

    /**************JSX****************/
    return (
       <div className="container flex">
            <div className="game--container flex">
                <h1>Tenzies</h1>
                
                { tenzies ? 
                    <Won />:
                    <div className="game--content">
                        <p className="game--desc">Roll until all dice are the same. Click each die to freeze it
                            at its current value between rolls
                        </p>
                        {game()}
                    </div>
                }
                {!startGame && !tenzies ? "" :<button className="roll--btn" onClick={rollDice}>{tenzies ? "New Game" : "Roll"}</button>}
            </div>
            <div className="time--container flex">
                <div>
                    <h4>Time Elapsed</h4>
                    <h1>{convertToTimeFormat(duration)}</h1>
                </div>
                
                <div className="best-time--container">
                    <h3>Best Time:</h3>
                    <h2>{convertToTimeFormat(bestTime)}</h2>
                    <button className="roll--btn" onClick={resetBestTime}>Reset</button>
                </div>
            </div>
       </div> 
    )
}
