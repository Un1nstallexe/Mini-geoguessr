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

    const disableSwipes = (e) => {
        e.stopPropagation()
    }

    return (
        <div className="map-overlay" onDrag={disableSwipes} onTouchMove={disableSwipes}>
            {
                fetchStatus === "error" ? (
                    "Ошибка"
                ) : fetchStatus === "loaded" && country ? (
                    `Страна: ${country.translations.rus.common}`
                ) : fetchStatus === "loading" ? (
                    "загрузка..."
                ) : country === null ? (
                    "Выберите страну"
                ) : "ERROR"
            }
            {
                fetchStatus === "loaded" && country !== null ? (
                    <img 
                        src={country.flags.png} 
                        alt="flag" 
                        className="country-flag"/>
                ) : null
            } 
        </div>
    );
}

export default MapOverlay;
