import React from 'react';
import ReactDOM from 'react-dom';
import L from 'leaflet';

class Livemap extends React.Component {

    componentDidMount() {
        var map = this.map = L?.map(ReactDOM.findDOMNode(this), {
            minZoom: 2,
            maxZoom: 20,
            layers: [
                L?.tileLayer(
                    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    {attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'}),
                L?.tileLayer.wms(
                    'https://geoserver.bigdatamap.keenetic.pro/geoserver/leaders/wms',
                    {attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'})
            ],
            attributionControl: false,
        });

        map?.on('click', this.onMapClick);
        map?.fitWorld();
    }


    componentWillUnmount() {
        this.map?.off('click', this.onMapClick);
        this.map = null;
    }

    onMapClick = () => {
        // Do some wonderful map things...
    }

    render() {
        return (
            <div className='map' id={'map'}></div>
        );
    }

}
export default Livemap
