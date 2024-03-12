import React from "react";

type DiceProps = {
    id: string;
    handleSelect: () => void;
    isHeld: boolean;
    value: number;

}

export default function Dice({handleSelect, isHeld, value, id}: DiceProps){
    const matched = isHeld ? "dice--matched" : ""
    
    let diceFace;
    switch (value) {
        case 1:
           diceFace = "one"
            break;
        case 2:
           diceFace = "two"
            break;
        case 3:
           diceFace = "three"
            break;
        case 4:
           diceFace = "four"
            break;
        case 5:
           diceFace = "five"
            break;
        case 6:
           diceFace = "six"
            break;
    }
    return (
        //fontawesome element
        <i 
        id={id}
            className={`fa-solid fa-dice-${diceFace} dice flex ${matched}`} 
            onClick={handleSelect}
        >
        </i>
    )
}