import { useEffect, useState } from "react";
import useRestCountriesApi from "../../apis/restCountries.api"
import "./MapOverlay.css"

const MapOverlay = ({cca2}) => {
    
    const [country, setCountry] = useState(null);
    const { getCountryByCca2, fetchStatus } = useRestCountriesApi();


    useEffect(() => {
        if (cca2)
            getCountryByCca2(cca2)
                .then((r) => {
                    setCountry(r);
                    console.log(r);
                })
        console.dir(cca2);
    },[cca2]);    

    return (
        <div className="map-overlay">
            {
                fetchStatus === "error" ? (
                    "Error"
                ) : fetchStatus === "loaded" && country ? (
                    `Country: ${country.name.common}`
                ) : fetchStatus === "loading" ? (
                    "loading..."
                ) : country === null ? (
                    "Choose Country"
                ) : "ERROR"
            } 
        </div>
    );
}

export default MapOverlay;
