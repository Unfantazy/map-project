import './App.scss';
import Map from "./Components/Map";
import Menu from "./Components/Menu";
import LayersFilter from "./Components/LayersFilter";

const App = ()  => {
  return (
      <div className='App'>
          <Menu />
          <Map/>
          <LayersFilter/>
      </div>
  );
}

export default App;
