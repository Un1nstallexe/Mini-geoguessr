import { useEffect, useState } from "react";
import useRestCountriesApi from "../../apis/restCountries.api"
import "./MapOverlay.css"
import InspectOverlay from "../InspectOverlay/InspectOverlay";

const MapOverlay = ({cca2, children}) => {

    useEffect(() => { 
    },[cca2]);    

    const disableSwipes = (e) => {
        e.stopPropagation()
    }

    return (
        <div className="map-overlay" onDrag={disableSwipes} onTouchMove={disableSwipes}>
             {/*children*/}
             <InspectOverlay cca2={cca2}/>
        </div>
    );
}

export default MapOverlay;
