import './App.scss';
import FiltersMenu from "./Components/FiltersMenu";
import Map from "./Components/Map";
import InfoBlock, {infoTypes} from "./Components/InfoBlock";
import {useState} from "react";
import Hint from "./Components/Hint";


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

    return (
        <div className='App'>
            <FiltersMenu model={model} setModel={setModel}/>
            <div className={'Map'}>
                <Map setData={setData} data={data} />
            </div>
            {data?.items?.length > 0
                && <InfoBlock data={data} setData={setData}/>
            }
            <Hint/>
        </div>
    );
}

export default App;
