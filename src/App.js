import './App.scss';
import FiltersMenu from "./Components/FiltersMenu";
import Map from "./Components/Map";
import InfoBlock, {infoTypes} from "./Components/InfoBlock";
import {useState} from "react";
import Hint from "./Components/Hint";
import Loader from './Components/Loader';


const App = () => {
    const [data, setData] = useState({type: infoTypes.default, items: []})
    const [isLoading, setIsLoading] = useState(false)

    const initialStateModel = {
        obj_name: [],
        org_id: [],
        sz_name: [],
        sz_type: [],
        s_kind: [],
        buf: [],
    }

    const [model, setModel] = useState(initialStateModel)

    console.log(isLoading)

    return (
        <div className='App'>
            {isLoading && <Loader color={'shadow'}/>}
            <FiltersMenu model={model} setModel={setModel} isLoading={isLoading} setIsLoading={setIsLoading}/>
            <div className={'Map'}>
                <Map setData={setData} data={data} isLoading={isLoading} setIsLoading={setIsLoading}/>
            </div>
            {data?.items?.length > 0
            && <InfoBlock data={data} setData={setData}/>
            }
            <Hint/>
        </div>
    );
}

export default App;
