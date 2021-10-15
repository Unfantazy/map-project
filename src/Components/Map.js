import React from 'react';
import ReactDOM from 'react-dom';
import L from 'leaflet';
import 'leaflet.vectorgrid';

class Livemap extends React.Component {

    componentDidMount() {
        var map = this.map = L?.map(ReactDOM.findDOMNode(this), {
            minZoom: 9,
            maxZoom: 20,
            center: [55.740223, 37.595290],
            zoom: 11,
            layers: [
                L?.tileLayer(
                    'https://tile2.maps.2gis.com/tiles?x={x}&y={y}&z={z}&v=1.1',
                    {attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'}),
                L?.tileLayer.wms(
                    'https://geoserver.bigdatamap.keenetic.pro/geoserver/leaders/wms',
                    {attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'})
            ],
            attributionControl: false,
        });
        

        var vectorTileOptions = {
            vectorTileLayerStyles: {
            'objects_centroids': function() {
            return {
              color: 'red',
              opacity: 1,
              fillColor: 'yellow',
              fill: true,
            }
            },
            },
            interactive: true,	// Make sure that this VectorGrid fires mouse/pointer events
        }
        var vectorUrl = 'https://geoserver.bigdatamap.keenetic.pro/geoserver/gwc/service/tms/1.0.0/leaders:objects_centroids@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf';
        
        // Из примера это получается (хотя стиль leaflet'а не прогружается, мб его тоже надо добавить к проекту?)
        this.marker = L.marker([55.740223, 37.595290]).addTo(this.map);
        // А вот это уже не работает
        this.objs_vectorgrid = new L?.VectorGrid.Protobuf(vectorUrl, vectorTileOptions).addTo(this.map);

        map?.on('click', this.onMapClick);
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
