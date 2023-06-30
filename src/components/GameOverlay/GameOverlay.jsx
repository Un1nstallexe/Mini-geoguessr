import { useEffect, useMemo, useState } from "react"
import "./GameOverlay.css"
import useRestCountriesApi from "../../apis/restCountries.api";
import Switch from '@mui/material/Switch';
import Slider from '@mui/material/Slider';
import Button from "@mui/material/Button"
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Alert from '@mui/material/Alert';

const GameView = ({rounds, setGameData, setCurrentState, countriesList, allowedRegions, cca2}) => { 

    const [filteredList, setFilteredList] = useState(
        countriesList.filter(r => allowedRegions[r.region])
    )
    
    const [roundsLeft, setRoundsLeft] = useState(Math.min(filteredList.length, rounds));

    const getRandomCountry = () => {
        const ind = Math.round(Math.random()*filteredList.length);
        const r = filteredList[ind];
        setFilteredList(fl => fl.filter((k,i)=>i!==ind));
        setRoundsLeft(rl => rl-1);
        return r;
    };

    const [randomCountry, setRandomCountry] = useState(getRandomCountry);

    const [curAns, setCurAns] = useState("no"); // "no" - not chosen, "wrong" - wrong ans, "ok" - right ans;

    useEffect(() => {
        if (randomCountry && cca2) {
            if (curAns === "no") {
            if (randomCountry?.cca2 === cca2) {
                setCurAns("ok"); 
            }
            else {
                setCurAns("wrong");
            }
            setGameData(ar => [
                    ...ar, {
                        chosenCountry:cca2,
                        rightCountry:randomCountry.cca2
                    } 
                ]);
            setTimeout(() => {
                setRandomCountry(getRandomCountry());
                setCurAns("no");
            }, 1000);
        }
        }
    },[cca2]);

    useEffect(() => {
        if (roundsLeft < 0)
            setCurrentState("end");
    }, [roundsLeft]);

    return (
        <>
            {
                curAns === "no" ? (
                    <>
                        <h2 className="game-overlay-header">Find country:</h2>
                        <Alert variant="outlined" severity="info" icon={<></>} sx={{fontSize:"20px"}}>{randomCountry.name.common}</Alert>
                        <Button 
                            fullWidth
                            sx={{marginTop:"20px"}}
                            color="primary"
                            variant="contained"
                            onClick={()=>setCurrentState("end")}>
                            finish
                        </Button>
                    </>
                ) : 
                curAns === "ok" ? (
                    <Alert  
                        severity="success"
                        variant="outlined"
                        sx={{fontSize:"20px"}}
                        icon={<></>}
                        >
                         Right!
                    </Alert> 
                ) :
                curAns === "wrong" ? (
                    <Alert  
                        severity="error"
                        variant="outlined"
                        sx={{fontSize:"20px"}}
                        icon={<></>}
                        >
                        Wrong!
                    </Alert> 
                ) : (
                    "Error"
                )
            }
            

        </> 
    ) 
}


const FinalView = ({ 
    gameData, 
    setCurrentState, 
    countriesList, 
    svgRef,
    cca2
}) => {

    const allCountries = gameData.length;
    const foundCountries = gameData.filter(
        i => i.chosenCountry === i.rightCountry
    ).length

    useEffect(() => console.log(svgRef.current.querySelector("#GG")),[]);

    const [curItem, setCurItem] = useState(null);

    const markDesisionOnMap = (it) => { 
        const chosen = svgRef.current.querySelector("#"+it.chosenCountry);
        const right = svgRef.current.querySelector("#"+it.rightCountry);
        
        svgRef.current.appendChild(chosen);
        svgRef.current.appendChild(right);
        
        if (cca2) {
            const cur = svgRef.current.querySelector("#"+cca2);
            svgRef.current.appendChild(cur);
        }

        chosen.classList.add("country-chosen-before");
        right.classList.add("country-right-before");  
    }

    const clearDesisionOnMap = (it) => {
        svgRef.current.querySelector("#"+it.chosenCountry).classList.remove("country-chosen-before");
        svgRef.current.querySelector("#"+it.rightCountry).classList.remove("country-right-before");
    }

    return (
        <>
            <h2 className="final-header">The end</h2> 
            <h3 className="final-header-found">You've found:</h3>
            <div className="found-countries">
                {foundCountries}/{allCountries}
            </div>
            <Accordion square={false}>
                <AccordionSummary
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    Details
                </AccordionSummary>
                <AccordionDetails>
                    <ul className="history-list">
                        {gameData.map((item, i) => {
                            const chosenCountryName = countriesList.find(c => c.cca2 === item.chosenCountry).name.common;
                            const rightCountryName = countriesList.find(c => c.cca2 === item.rightCountry).name.common;
                            const equal = (item.chosenCountry === item.rightCountry);
                            return (
                            <li 
                                className={"history-list-item" + (equal ? " history-list-item-right" : "")}
                                key={i} 
                                onMouseOver={()=>markDesisionOnMap(item)} 
                                onMouseOut={()=>clearDesisionOnMap(item)}>
                                <div>Requested country: {rightCountryName}</div>
                                <div>You've chosen: {chosenCountryName}</div>
                                
                            </li>
                        )})}
                    </ul>
                </AccordionDetails>
            </Accordion>
            <div className="to-start-btn">
                <Button
                fullWidth
                variant="contained"
                onClick={()=>setCurrentState("set")} 
            >to Start menu</Button>
            </div>

        </>
    );
}

const SettingsView = ({
    maxRounds,
    allowedRegions,
    setAllowedRegions, 
    setMaxRounds, 
    setCurrentState,
    setMode
}) => {

    const isReadyToGo = useMemo(() => { 
        const a = Object.entries(allowedRegions).filter(reg => reg[1]).length > 0
        console.log(Object.entries(allowedRegions).filter(reg => reg[1]))
        return a; // at least one region chosen
}, [allowedRegions]);

    return (
        <>
                <Button 
                fullWidth
                disabled={!isReadyToGo}
                color="success"
                variant="contained"
                onClick={()=>setCurrentState("game")}>
                    {
                        isReadyToGo ? "Game" 
                        : "Choose at least one region"
                    }
                </Button>
                <div className="set-accordions-wrapper">
                    <Accordion square={false}>
                        <AccordionSummary
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            Choose regions
                        </AccordionSummary>
                        <AccordionDetails>
                        <ul className="region-settings-list" >
                                {
                                    Object.entries(allowedRegions).map((item,i)=>(
                                        <li key={i}>
                                            <Switch
                                                checked={item[1]} 
                                                onChange={()=>setAllowedRegions(
                                                r =>{
                                                    const newR = {...r};
                                                    newR[item[0]] = !item[1]; 
                                                    return newR;
                                                } 
                                            )}/>
                                            {item[0]}
                                        </li>
                                    ))
                                }
                            </ul> 
                        </AccordionDetails>
                    </Accordion>
                        
                        <Accordion square={false}>
                        <AccordionSummary
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            Rounds quantity
                        </AccordionSummary>
                        <AccordionDetails>
                            <span>{maxRounds}</span>
                            <Slider
                                min={1}
                                max={50}
                                value={maxRounds}
                                onChange={(e)=>setMaxRounds(e.target.value)}/>
                        
                        </AccordionDetails>
                    </Accordion>
                    
                </div>
                <Button 
                fullWidth
                color="primary"
                variant="contained"
                onClick={()=>setMode("inspect")}>
                    Inspect map
                </Button>
                
            
        </>
    )

};

const GameOverlay = ({cca2, svgRef, setMode}) => {

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
    
    

    //const [gameMode, setGameMode] = useState("name") // name - find country by name, flag - find country by flag

    // CURRENT STATE 

    const [currentState, setCurrentState] = useState("set") // set - settings, game - game, end - card after game end 

    const [gameData, setGameData] = useState([])

    const [countriesList, setCountriesList] = useState(null);

    const {getAllCountries, abortFetch} = useRestCountriesApi();

    const [correctedCca2, setCorrectedCca2] = useState(null); 

    useEffect(()=>{
        setCorrectedCca2(currentState === "game" ? cca2 : null);
    },[cca2]);

    useEffect(() => {
        setCorrectedCca2(null);
    }, [currentState]);

    useEffect(() => {
        getAllCountries()
            .then(fetchedCountries => {
                setCountriesList(fetchedCountries.filter( // only the countries which are marked on map can be in list, just filtering by existing of SVG element in DOM with id === cca2  
                    item => document.querySelector(
                        "#" + item.cca2
                    )
                ))
            });
        
        return abortFetch;
    },[]);

    useEffect(() => {
        if (currentState === "set") {
            setGameData([]);
        }
        else if (currentState === "game") {

        }
        else if (currentState === "end") {

        }
    },[currentState]);

    return (
     <>
      {
        countriesList === null ? (
            "Loading" 
        ) :
        currentState === "set" ? (
            <SettingsView
            allowedRegions={allowedRegions}
            setAllowedRegions={setAllowedRegions}
            setMaxRounds={setMaxRounds}
            maxRounds={maxRounds}
            setCurrentState={setCurrentState}
            setMode={setMode}
            />
        ) : currentState==="game" ? 
        ( //{rounds, setGameData, setCurrentState, countriesList, allowedRegions, cca2}
            <GameView
                rounds={maxRounds}
                gameData={gameData}
                setGameData={setGameData}
                setCurrentState={setCurrentState}
                countriesList={countriesList}
                allowedRegions={allowedRegions}
                cca2={correctedCca2}
                />
        ) : currentState === "end" ? (
            <FinalView
                gameData={gameData}
                setCurrentState={setCurrentState}
                countriesList={countriesList}
                svgRef={svgRef}
                cca2={cca2}
             />
        ) : "error"
      }
     </>   
    )
}

export default GameOverlay