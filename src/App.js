import './App.scss';
import FiltersMenu from "./Components/FiltersMenu";
import Map from "./Components/Map";
import InfoBlock from "./Components/InfoBlock";
import {useState} from "react";
import Hint from "./Components/Hint";


const App = () => {
    const [data, setData] = useState([])
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

    console.log(model)

    return (
        <div className='App'>
            <FiltersMenu model={model} setModel={setModel}/>
            <div className={'Map'}>
                <Map setData={setData} data={data}/>
            </div>
            {!!data.length
            && <InfoBlock data={data} setData={setData}/>
            }
            <Hint/>
        </div>
    );
}

export default App;
