import useHttp from "../hooks/http.hook";

const useRestCountriesApi = () => {
    const prefix = "https://restcountries.com/v3.1/";

    const {clearError, makeRequest, fetchStatus} = useHttp();

    const getAllCountries = () => {
        return makeRequest(prefix + "all?fields=cca2,name");
    }

    const getCountryByCca2 = async (cca2) => {
        return await makeRequest(prefix+ "alpha/" + cca2)[0];
    }

    return {clearError, fetchStatus, getAllCountries, getCountryByCca2}; 
}
