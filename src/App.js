import './App.scss';
import Map from "./Components/Map";
import FiltersMenu from "./Components/FiltersMenu";
import LayersFilter from "./Components/LayersFilter";
import LayersFilters from "./Components/LayersFilters";

const App = ()  => {
  return (
      <div className='App'>
          <LayersFilters />
          <FiltersMenu />
          <Map/>
      </div>
  );
}

export default App;
