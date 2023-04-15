import { useRef } from "react";
import { useState } from "react"; 

const useHttp = () => {        
    const [fetchStatus, setFetchStatus] = useState("loaded"); // error || loaded || loading
    const abortFetchController = useRef(null);

    const abortFetch = () => {
        if (abortFetchController.current)
            abortFetchController.current.abort();
    } 

    const makeRequest = async (url, method = "GET", body = null, headers = {
      'Content-Type': 'application/json'
    } ) => {
        setFetchStatus("loading");
        abortFetchController.current = new AbortController();
        try {
            const response = await fetch(url, {
            method,
            body,
            headers,
                signal:abortFetchController.current.signal
            });

            if (!response.ok) {
                throw new Error(`Could not fetch ${url}, status: ${response.status}`);
            }
            const data = await response.json();

            setFetchStatus("loaded");
            abortFetchController.current = null;
            return data;
        } catch (e) {
            if (e.code !== 20) {

                setFetchStatus("error");
                console.dir(e);
                throw e;

            }   // abort exception is normal
            
        } 
        
    }

    const clearError = () => {
        if (fetchStatus === "error")
            setFetchStatus("loaded");
    }

    return { abortFetch, clearError, makeRequest, fetchStatus };
}

export default useHttp;
