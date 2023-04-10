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
        abortFetch(); // can't be more than one response to server
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
            return data;
        } catch (e) {
            setFetchStatus("error");
            throw e;
        } 
        
    }

    const clearError = () => {
        if (fetchStatus === "error")
            setFetchStatus("loaded");
    }

    return {clearError, makeRequest, fetchStatus };
}

export default useHttp;
