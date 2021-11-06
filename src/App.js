import './App.scss';
import FiltersMenu from "./Components/FiltersMenu";
import Map from "./Components/Map";
import InfoBlock, {infoTypes} from "./Components/InfoBlock";
import {useEffect, useState} from "react";
import Hint from "./Components/Hint";
import Loader from './Components/Loader';


const App = () => {
    const [data, setData] = useState({type: infoTypes.default, items: []})
    const [isLoading, setIsLoading] = useState(true)

    const [flag, setFlag] = useState(0)

    const [isHintShown, setIsHintShown] = useState(true)

    const legend = document.querySelector('.info-legend')

    useEffect(() => {
        if (isHintShown) {
            legend?.classList.add('hint-is-shown')
        } else {
            legend?.classList.remove('hint-is-shown')
        }
    }, [isHintShown, legend])

    const initialStateModel = {
        obj_name: [],
        org_id: [],
        sz_name: [],
        sz_type: [],
        s_kind: [100],
        buf: [500, 1000, 3000, 5000],
    }

    const [model, setModel] = useState(initialStateModel)

    const initSavedLayers = localStorage.getItem('saved_layers')
        ? Array.from(JSON.parse(localStorage.getItem('saved_layers')))
        : [];

    const [savedLayers, setSavedLayers] = useState(initSavedLayers)
    const [selectedInput, setSelectedInput] = useState(0);
    const [isInfoBlockShown, setIsInfoBlockShown] = useState(false)

    return (
        <div className='App'>
            {isLoading && <Loader color={'shadow'}/>}
            <FiltersMenu 
                model={model} 
                setModel={setModel} 
                setIsLoading={setIsLoading}
                savedLayers={savedLayers}
                flag={flag}
                selectedInput={selectedInput}
                setSelectedInput={setSelectedInput}
                />                
            <div className={'Map'}>
                <Map
                    model={model}
                    setModel={setModel} 
                    setData={setData}
                    data={data}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    isHintShown={isHintShown}
                    setSavedLayers={setSavedLayers}
                    setFlag={setFlag}
                    setSelectedInput={setSelectedInput}
                    setIsInfoBlockShown={setIsInfoBlockShown}
                />
            </div>
            {data?.items
            && <InfoBlock 
                data={data} 
                setData={setData} 
                model={model}
                isInfoBlockShown={isInfoBlockShown}
                setIsInfoBlockShown={setIsInfoBlockShown}/>
            }
            <Hint isHintShown={isHintShown} setIsHintShown={setIsHintShown}/>
        </div>
    );
}

export default App;
