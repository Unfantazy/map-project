import './App.scss';
import Map from "./Components/Map";
import FiltersMenu from "./Components/FiltersMenu";
import LayersFilters from "./Components/LayersFilters";
import {useEffect} from "react";
import Func from "./leaflet";
import Livemap from "./Components/Map";

const App = ()  => {

    // useEffect(() => {
    //     Func()
    //     console.log('yo')
    // }, [])


  return (
      <div className='App'>
          <LayersFilters />
          <FiltersMenu />
          <div className={'Map'}>
          <Livemap />
          </div>
      </div>
  );
}

export default App;
