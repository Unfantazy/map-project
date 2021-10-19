import React from 'react';
import ReactDOM from 'react-dom';
import L from 'leaflet';
import '../Leaflet.VectorGrid/src/bundle';
import svg from '../images/icons/map-marker_red.svg'
import {mapAPI} from "../API/methods";

class Livemap extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        var map = this.map = L?.map(ReactDOM.findDOMNode(this), {
            minZoom: 9,
            maxZoom: 20,
            center: [55.740223, 37.595290],
            zoom: 11,
            layers: [ 
                // L?.tileLayer(
                //     'https://tile2.maps.2gis.com/tiles?x={x}&y={y}&z={z}&v=1.1',
                //     {
                //         attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                //             '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
                //     }),
            ],
            attributionControl: false,
        });

        map.getPane('overlayPane').style.zIndex=1000

        map.createPane('basePane');
        map.getPane('basePane').style.zIndex = 100;
        
        map.createPane('heatPane');
        map.getPane('heatPane').style.zIndex = 200;

        map.createPane('bufferPane');
        map.getPane('bufferPane').style.zIndex = 300;
        
        map.createPane('objectPane');
        map.getPane('objectPane').style.zIndex = 400;        

        var CartoDB_VoyagerNoLabels =  L?.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20,
            pane: 'basePane',
        }).addTo(this.map); 
        var CartoDB_VoyagerOnlyLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20,
            pane: 'overlayPane',
        }).addTo(this.map);

        var greenIcon = new L.Icon({
            
            iconUrl: svg,
            iconSize: [24, 35], // size of the icon
            // iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        });


        var vectorTileOptions = {
            rendererFactory: L.canvas.tile,
            buffer: 500,
            pane: 'objectPane',
            interactive: true,	// Make sure that this VectorGrid fires mouse/pointer events
            vectorTileLayerStyles: {
                'objects_centroids': {
                    icon: greenIcon
                    // return {
                    //     fillColor: '#E31A1C',
                    //     fillOpacity: 0.5,
                    //     stroke: true,
                    //     fill: true,
                    //     color: 'blue',
                    //     weight: 1,
                    //     radius: 5
                    // }
                },
            },

        }

        var vectorUrl = 'https://geoserver.bigdatamap.keenetic.pro/geoserver/gwc/service/tms/1.0.0/leaders:objects_centroids@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf';

        this.objs_vectorgrid = new L.VectorGrid.Protobuf(vectorUrl, vectorTileOptions).addTo(this.map);

        map?.on('click', this.onMapClick);

        this.objs_vectorgrid.on('click', (e) => {
            mapAPI.getInfoAboutObject(e.layer.properties.id)
                .then(res => {
                    this.props.setData(res.data.features.map(item => {
                        return item.properties
                    }))
                })
                .catch(err => {
                    console.log(err)
                })
        })
    }


    componentWillUnmount() {
        this.map?.off('click', this.onMapClick);
        this.map = null;
    }

    onMapClick = () => {
     // this.props.setData([])
    }

    render() {
        return (
            <div className='map' id={'map'}></div>
        );
    }

}

export default Livemap
