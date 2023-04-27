import { useEffect, useState } from "react"
import "./InspectOverlay.css"
import useRestCountriesApi from "../../apis/restCountries.api"

const InspectOverlay = ({cca2}) => {

    const [country, setCountry] = useState(null);

    const {fetchStatus, getCountryByCca2, abortFetch} = useRestCountriesApi();

    useEffect(() => {
       if (cca2) {
            getCountryByCca2(cca2)
                .then((res) => {
                    setCountry(res);
                    console.log(res);
                })
            return abortFetch
       } 
    }, [cca2]);

    return (
        <>

            {
                fetchStatus === "loaded" && country !== null ? (
                    <>
                        <h2 className="country-name">
                            Страна: {country.translations.rus.common}
                        </h2>
                        <img src={country.flags.png} alt={country.flags.alt} className="flag-img" />
                    </>
                ) : fetchStatus === "loading" ? (
                    "Загрузка.."
                ) : country === null && fetchStatus !== "error" ? (
                    "Выберите страну"
                ) : (
                    "Oшибка!"
                )
            }

        </>
    )
}

export default InspectOverlay;