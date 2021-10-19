import './App.scss';
import FiltersMenu from "./Components/FiltersMenu";
import Livemap from "./Components/Map";
import InfoBlock from "./Components/InfoBlock";
import {useState} from "react";

const App = () => {
    const [data, setData] = useState([])
    return (
        <div className='App'>
            {/*<LayersFilters />*/}
            <FiltersMenu/>
            <div className={'Map'}>
                <Livemap setData={setData} data={data}/>
            </div>
            {!!data.length
            && <InfoBlock data={data}/>
            }
        </div>
    );
}

export default App;
