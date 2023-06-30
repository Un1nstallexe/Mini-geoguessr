import {MapInteractionCSS} from "react-map-interaction"
import {ReactComponent as World} from "../../imgs/world.svg"
import { useState, useEffect, useMemo, useRef } from "react";
import useWindowSize from "../../hooks/window.hook";
import MapOverlay from "../MapOverlay/MapOverlay";
import ReactTouchEvents from "react-touch-events"
import "./SvgMap.css"

const SvgMap = () => {

    const svgRef = useRef(null); 

    const getSvgWidth = () => 
        svgRef.current ? svgRef.current.clientWidth : 1010;
    
    const getSvgHeight = () => 
        svgRef.current ? svgRef.current.clientHeight : 666;

    const [w,h] = useWindowSize(); // screen width and height declaratively

    const minScale = useMemo(()=>Math.min(
        h/getSvgHeight(), w/getSvgWidth()),[w,h]);

    const maxScaleCoef = 32;

    const maxScale = useMemo(()=> maxScaleCoef * minScale,[minScale]);

    const [cca2,setCca2] = useState(null);

    const [countryObject, setCountryObject] = useState(null);

    const [transformValue, setTransformValue] = useState(
        {
            scale: Math.min(
        h/getSvgHeight(), w/getSvgWidth()),
            translation: {
                x:0,
                y:0
            }
        }
    );  

    useEffect(() => {
        if (transformValue.scale === 0)
            setTransformValue({
                scale:minScale,
                translation:{
                    x:0,
                    y:0
                } 
            });
        
        
    },[minScale]); // need for first render

    const xMin = useMemo(()=>
        getSvgWidth()*(-transformValue.scale)+w
        ,[transformValue,w]);
    const yMin = useMemo(()=>
        getSvgHeight()*(-transformValue.scale)+h
        ,[transformValue,h]);

    const prevTarget = useRef(null);

    const onChosenCountryChange = (e) => {
        if (!e.defaultPrevented) {
            setCca2(e.target.id);
            setCountryObject(e.target);
            if (prevTarget.current) {
                prevTarget.current.classList.remove("country-cur");
            }
            prevTarget.current = e.target;
            if (e.target !== svgRef.current) {
                e.target.classList.add("country-cur");
                if (e.target !== svgRef.current)
                    svgRef.current.append(e.target); 
            } 
            
        }   
    }



    const onPathHover = (e) => {
        if (e.target !== svgRef.current && e.target !== null) {
            if (prevTarget.current && e.target !== prevTarget.current && prevTarget.current !== svgRef.current)
                prevTarget.current.before(e.target);
            else {
                svgRef.current.appendChild(e.target);
            }
        }
            
    } 

    return (
        <>
        
        <MapInteractionCSS
            value={transformValue}
            onChange={setTransformValue}
            translationBounds={{
                xMax:0,
                yMax:0,
                xMin:xMin,
                yMin:yMin
            }}
            minScale={minScale}
            maxScale={maxScale}>
            <ReactTouchEvents
            onTap={onChosenCountryChange}>
                <div>
                <World
            className="world-svg"
            onClick={onChosenCountryChange}
            onMouseOver={onPathHover}
            onFocus={onPathHover} 
            ref={svgRef}
            style={{
                strokeWidth:1/(transformValue.scale ?? 1)
            }}
            />
            </div>
            </ReactTouchEvents>
            
            
        </MapInteractionCSS>
        <MapOverlay cca2={cca2} svgRef={svgRef}/>
        </>
        
    )
}

export default SvgMap;