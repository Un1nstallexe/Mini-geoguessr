import { useEffect, useState, useMemo } from "react"
import "./InspectOverlay.css"
import useRestCountriesApi from "../../apis/restCountries.api"
import Button from "@mui/material/Button"
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


const InspectOverlay = ({cca2, setMode}) => {

    const [country, setCountry] = useState(null); 

    const {fetchStatus, getCountryByCca2, abortFetch} = useRestCountriesApi();

    const [currency, setCurrency] = useState(null);

    const makeReadableNum = (n) => (
        n
            .toString()
            .split("")
            .reverse()
            .join("")
            .replace(/\d\d\d(?!$)/g,(m)=>m+" ")
            .split("")
            .reverse()
            .join("") // makes that: 1234567890 -> 1 234 567 890 
    )
        

    const countryInfo = useMemo(() => (
        country ? Object.entries({
            population: makeReadableNum(country.population),
            area: makeReadableNum(country.area) + " km²",
            capital: country.capital[0],
            currency: Object.entries(country.currencies)[0][1].name
        }) : null
    ), [country]);

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
                            {country.name.common}
                        </h2>
                        <div className="info-accordion-wrapper">
                            <Accordion 
                                square={false}
                                
                            >
                                <AccordionSummary
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                                >
                                    Info
                                </AccordionSummary>
                                <AccordionDetails> 
                                    <TableContainer component={Paper}>
                                        <Table aria-label="simple table">
                                            <TableBody>
                                                {
                                                    countryInfo.map((item, i) => (
                                                        <TableRow key={i}>
                                                            <TableCell>{item[0]}</TableCell>
                                                            <TableCell>{item[1]}</TableCell>
                                                        </TableRow>
                                                    ))
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </AccordionDetails>
                            </Accordion>
                        </div>
                        
                        
                         
                        <img src={country.flags.png} alt={country.flags.alt} className="flag-img" />
                        <Accordion 
                                square={false}  
                                sx={{
                                    marginTop:"20px"
                                }}     
                        >
                            <AccordionSummary
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                Coat of arms 
                            </AccordionSummary>
                                <AccordionDetails> 
                                    <img src={country.coatOfArms.png} alt={country.coatOfArms.alt} className="flag-img" />
                                </AccordionDetails>
                            </Accordion>
                    </>
                ) : fetchStatus === "loading" ? (
                    "loading..."
                ) : country === null && fetchStatus !== "error" ? (
                    "Choose country"
                ) : (
                    "Error!"
                )
            }
            <Button 
                fullWidth
                color="primary"
                variant="contained"
                onClick={()=>setMode("game")}
                sx={{marginTop:"20px"}}
                >
                    Return to game
            </Button>
        </>
    )
}

export default InspectOverlay;