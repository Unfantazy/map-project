import React from 'react';
import ReactDOM from 'react-dom';
import L from 'leaflet';
import '../Leaflet.VectorGrid/src/bundle';
import '../Leaflet.markercluster/src/index';
import '@geoman-io/leaflet-geoman-free'
import svg_red from '../images/icons/map-marker_red.svg'
import svg_blue from '../images/icons/map-marker_blue.svg'

import {mapAPI} from "../API/methods";

class Livemap extends React.Component {
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

        map.on('zoomend', function(e){
            console.log (map.getZoom())
        })

        map.getPane('overlayPane').style.zIndex=1000

        map.createPane('basePane');
        map.getPane('basePane').style.zIndex = 100;
        
        map.createPane('heatPane');
        map.getPane('heatPane').style.zIndex = 200;

        map.createPane('bufferPane');
        map.getPane('bufferPane').style.zIndex = 300;
        
        map.createPane('objectPane');
        map.getPane('objectPane').style.zIndex = 400;       
        
        map.getPane('markerPane').style.zIndex = 400; 

        L?.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20,
            pane: 'basePane',
        }).addTo(this.map); 
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20,
            pane: 'overlayPane',
        }).addTo(this.map);

        var heatParams = 'obj_name:Спортивный комплекс образовательного учреждения\;Дворовая территория;org_id:219814\;237454;sz_name:зал спортивный №1;s_kind:46\;100;buf:500\;1000'
        var envParams = 'class_empty:0.9;class_1:242;class_2:392;class_3:560.83;class_4:800;class_5:1488'
        var heat_square =  L?.tileLayer.wms('http://geoserver.bigdatamap.keenetic.pro/geoserver/leaders/wms', {
			layers:'leaders:'+'heatmap_square',
			styles:'leaders:heatmap_square_style',
			format: 'image/png',
			transparent: 'true',
			tileSize: 512,
			pane: 'heatPane',
			detectRetina: true,
			opacity: 0.5,
			viewparams: heatParams,
			env: envParams
		}).addTo(this.map); 

        var objIcon = new L.Icon({
            iconUrl: svg_red,
            iconSize: [24, 35], // size of the icon
            iconAnchor:   [20, 20], // point of the icon which will correspond to marker's location
        });

        var selectedIcon = new L.Icon({
            iconUrl: svg_blue,
            iconSize: [24, 35], // size of the icon
            iconAnchor:   [20, 20], // point of the icon which will correspond to marker's location
        });
        

        this.markers = new L.markerClusterGroup({ 
            chunkedLoading: true, 
            showCoverageOnHover: false, 
            disableClusteringAtZoom:15,
            removeOutsideVisibleBounds: true,
            spiderfyOnMaxZoom: false,
        }).addTo(this.map);

        function markersCreate (list, mapElement) {
            for (var i = 0; i < objectsPoints.length; i++) {
                var a = list[i];
                var id = a.properties.id;
                new L.marker(L.latLng(a.geometry.coordinates[1], a.geometry.coordinates[0]), { id: id, icon: objIcon}).addTo(mapElement.markers);
            }
            window.test_markers = mapElement.markers;
        }

        var objectsPoints = mapAPI.getLayerJSON('objects_centroids').then(res => {
                objectsPoints = res.data.features
                markersCreate (objectsPoints, this)
            })
            .catch(err => {
                console.log(err)
            })

        var emptyLayer = L.tileLayer('');
        
        var baseMaps = {
            'Базовая карта':emptyLayer,
            "Тепловая карта спортивных зон": heat_square
        };
        
        var overlayMaps = {
            "Спортивные объекты": this.markers
        };
        
        L.control.layers(baseMaps, overlayMaps, {position:'topright',collapsed:false}).addTo(map);


        var vectorTileOptions = {
            rendererFactory: L.svg.tile,
            // buffer: 500,
            pane: 'objectPane',
            // minZoom: 14,
            interactive: true,	// Make sure that this VectorGrid fires mouse/pointer events
            vectorTileLayerStyles: {
                'objects_centroids': {
                    icon: objIcon
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

        // this.objs_vectorgrid = new L.VectorGrid.Protobuf(vectorUrl, vectorTileOptions).addTo(this.map);

        map?.on('click', this.onMapClick);

        this.markers.on('click', (e) => {
            e.layer.setIcon(selectedIcon)

            mapAPI.getInfoAboutObject(e.layer.options.id)
                .then(res => {
                    this.props.setData(res.data.features.map(item => {
                        return item.properties
                    }))
                })
                .catch(err => {
                    console.log(err)
                })
        })

        window.test_map = this.map;

        map?.pm.setLang('ru');
        map?.pm.addControls({  
            position: 'topleft',  
            drawCircleMarker: false,  
            drawMarker: false,  
            drawPolyline: false
          }); 

        document.getElementById('layerBtn')?.addEventListener('click', () =>{
            var drawingLayers = map.pm.getGeomanDrawLayers(true).getLayers();
            var group = L.featureGroup();
            drawingLayers.forEach((layer) => {
                group.addLayer(layer.pm.getShape() === 'Circle' ? L.PM.Utils.circleToPolygon(layer, 20) : layer);
            })
            var shapes = group.toGeoJSON();
            console.log(shapes);
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
