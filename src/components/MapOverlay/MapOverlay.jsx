import { useEffect, useState } from "react";
import useRestCountriesApi from "../../apis/restCountries.api"
import "./MapOverlay.css"
import InspectOverlay from "../InspectOverlay/InspectOverlay";
import GameOverlay from "../GameOverlay/GameOverlay";

const MapOverlay = ({cca2, children, svgRef}) => { 
    
    const [mode, setMode] = useState("game"); // game / inspect

    const disableSwipes = (e) => { // swipes make uncaught errors since swipe handle in SvgMap works on part of the surface covered with MapOverlay (because e.target is div.map-overlay but event is in SvgMap comp)
        e.stopPropagation()
    }

    return (
        <div className="map-overlay" onDrag={disableSwipes} onTouchMove={disableSwipes}>
            {
                mode === "game" ? (
                    <GameOverlay cca2={cca2} svgRef={svgRef} setMode={setMode}/>
                ) : mode === "inspect" ? (
                    <InspectOverlay cca2={cca2} setMode={setMode}/>
                ) : "Error"
            }
        </div>
    );
}

export default MapOverlay;
