import './App.scss';
import FiltersMenu from "./Components/FiltersMenu";
import Map from "./Components/Map";
import InfoBlock from "./Components/InfoBlock";
import {useState} from "react";
import Hint from "./Components/Hint";
import InfoAreaBlock from './Components/InfoAreaBlock';


const App = () => {
    const [data, setData] = useState([])
    const [areaData, setAreaData] = useState([])
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
                <Map setData={setData} data={data} 
                    setAreaData={setAreaData} areaData={areaData}/>
            </div>
            {!!data.length
            && <InfoBlock data={data} setData={setData}/>
            }
            {!!areaData.length
            && <InfoAreaBlock areaData={areaData} setAreaData={setAreaData}/>
            }
            <Hint/>
        </div>
    );
}

export default App;
