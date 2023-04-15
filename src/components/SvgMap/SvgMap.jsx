import "./SvgMap.css"
import { MapInteractionCSS } from 'react-map-interaction';
import {ReactComponent as WorldSvg} from "../../imgs/world.svg";
import { useEffect, useState } from "react";
import ReactTouchEvents from "react-touch-events";
import useRestCountriesApi from "../../apis/restCountries.api"
import MapOverlay from "../MapOverlay/MapOverlay"

const SvgMap = () => {
    const { getCountryByCca2 } = useRestCountriesApi();

    const [cca2,setCca2] = useState(null);

    const onCca2Change = (e) => {
        setCca2(e.target.id);
    } 

    return (
        <>
        <MapInteractionCSS
            minScale={1} 
            maxScale={8}
            >
            <ReactTouchEvents onTap={onCca2Change}>
                <WorldSvg onClick={onCca2Change}/>
            </ReactTouchEvents>
        </MapInteractionCSS>
        <MapOverlay cca2={cca2}/>
        </>
    )
}

export default SvgMap;
