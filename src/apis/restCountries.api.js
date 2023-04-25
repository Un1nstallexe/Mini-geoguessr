import useHttp from "../hooks/http.hook";

const useRestCountriesApi = () => {
    const prefix = "https://restcountries.com/v3.1/";

    const {clearError, makeRequest, fetchStatus, abortFetch} = useHttp();

    const getAllCountries = () => {
        return makeRequest(prefix + "all?fields=cca2,name");
    }

    const getCountryByCca2 = async (cca2) => {
        abortFetch(); // prevent update after country change, like tap on the other country makes new fetch, than country can be updated twice.
        return (await makeRequest(prefix+ "alpha/" + cca2))[0]; // why [{}], not {} like e.g. in Marvel API?
    }

    return {clearError, fetchStatus, getAllCountries, getCountryByCca2}; 
}

export default useRestCountriesApi;
