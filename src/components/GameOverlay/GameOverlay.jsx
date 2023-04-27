import { useState } from "react"
import "./GameOverlay"

const GameOverlay = () => {

    // FIRST SETTINGS

    const [maxRounds, setMaxRounds] = useState(10);
    const [allowedRegions, setAllowedRegions] = useState({
        Europe: true,
        Americas: true,
        Antarctic: true,
        Australia: true,
        Africa: true,
        Asia: true
    });

    const [gameMode, setGameMode] = useState("name") // name - find country by name, flag - find country by flag

    // CURRENT STATE 

    const [currentState, setCurrentState] = useState("set") // set - settings, game - game, end - card after game end

    const [gameData, setGameData] = useState(null)

    return (
        
    )
}