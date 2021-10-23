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
            layers: [],
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

        var objIcon = new L.Icon({
            iconUrl: svg_red,
            iconSize: [24, 35], // size of the icon
            iconAnchor: [20, 20], // point of the icon which will correspond to marker's location
        });

        var selectedIcon = new L.Icon({
            iconUrl: svg_blue,
            iconSize: [24, 35], // size of the icon
            iconAnchor: [20, 20], // point of the icon which will correspond to marker's location
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

        // добавление контрола переключения слоев
        AddLayersControl(this);

        // добавление контрола geoman
        AddGeomanControl(this.map);
        
        var vectorTileOptions = {
            rendererFactory: L.svg.tile,
            // buffer: 500,
            pane: 'objectPane',
            // minZoom: 14,
            interactive: true,
            vectorTileLayerStyles: {
                'objects_centroids': {
                    icon: objIcon
                },
            }
        }

        var vectorUrl = 'https://geoserver.bigdatamap.keenetic.pro/geoserver/gwc/service/tms/1.0.0/leaders:objects_centroids@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf';

        // this.objs_vectorgrid = new L.VectorGrid.Protobuf(vectorUrl, vectorTileOptions).addTo(this.map);

        map?.on('click', this.onMapClick);

        this.markers.on('click', (e) => {
            e.layer.setIcon(selectedIcon)

            var obj_buffer =  L?.tileLayer.wms('http://geoserver.bigdatamap.keenetic.pro/geoserver/leaders/wms', {
                layers:'leaders:object_buffer',
                styles:'leaders:buffer_selected',
                format: 'image/png',
                transparent: 'true',
                tileSize: 512,
                pane: 'bufferPane',
                detectRetina: true,
                viewparams: 'object_id:'+e.layer.options.id,
            }).addTo(this.map);

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

const AddGeomanControl = (mapElement) => {
    if (mapElement){
        mapElement.pm.setLang('ru');
        mapElement.pm.addControls({  
            position: 'topright',  
            drawCircleMarker: false,  
            drawMarker: false,  
            drawPolyline: false,
            optionsControls: false,
            rotateMode:false,
            cutPolygon:false
        }); 
        
        mapElement.pm.Toolbar.changeActionsOfControl('Rectangle', []);
        mapElement.pm.Toolbar.changeActionsOfControl('Polygon', []);
        mapElement.pm.Toolbar.changeActionsOfControl('Circle', []);
        mapElement.pm.Toolbar.changeActionsOfControl('Edit', []);
        mapElement.pm.Toolbar.changeActionsOfControl('Removal', []);
        mapElement.pm.Toolbar.changeActionsOfControl('Drag', []);

        var drawControl = document.querySelector('div.leaflet-pm-toolbar.leaflet-pm-draw');
        var editControl = document.querySelector('div.leaflet-pm-toolbar.leaflet-pm-edit');
        var serviceTab = document.querySelector('div.services-control');
        if (drawControl && editControl && serviceTab){
            serviceTab.appendChild(drawControl);
            serviceTab.appendChild(editControl);
        };

        mapElement.on("pm:create", () => {
            console.log('element is created');
            // disable buttons
            document.getElementsByClassName('leaflet-pm-draw')[0].style.pointerEvents = 'none';
            document.querySelectorAll('.leaflet-pm-draw a').forEach(a => a.classList.add('leaflet-disabled'));
        });

        mapElement.on("pm:remove", () => {
            console.log('element is deleted');
            if (mapElement.pm.getGeomanDrawLayers(true).getLayers().length === 0){
                //enable buttons
                document.getElementsByClassName('leaflet-pm-draw')[0].style.pointerEvents = 'auto';
                document.querySelectorAll('.leaflet-pm-draw a')
                    .forEach(a => a.classList.remove('leaflet-disabled'));
            };
        });

        document.getElementById('layerBtn')?.addEventListener('click', () =>{
            var drawingLayers = mapElement.pm.getGeomanDrawLayers(true).getLayers()[0];
            var shape = drawingLayers.pm.getShape() === 'Circle' ? L.PM.Utils.circleToPolygon(drawingLayers, 20) : drawingLayers;
            var shapeJson = shape.toGeoJSON()['geometry'];
            var shapeJsonFormatted = JSON.stringify(shapeJson).replaceAll(",", "\\,")
            console.log(mapAPI.getShapeProvision('geojson:'+shapeJsonFormatted));
        })
    }
}

const AddLayersControl = (thisElement) => { 
    // heatmap square init
    var heatSqParams = 'obj_name:Спортивный комплекс образовательного учреждения\;Дворовая территория;org_id:219814\;237454;sz_name:зал спортивный №1;s_kind:46\;100;buf:500\;1000'
    var envSqParams = 'class_empty:0.9;class_1:242;class_2:392;class_3:560.83;class_4:800;class_5:1488'
    var heat_square =  L?.tileLayer.wms('http://geoserver.bigdatamap.keenetic.pro/geoserver/leaders/wms', {
        layers:'leaders:heatmap_square',
        styles:'leaders:heatmap_square_style',
        format: 'image/png',
        transparent: 'true',
        tileSize: 512,
        pane: 'heatPane',
        detectRetina: true,
        opacity: 0.5,
        viewparams: heatSqParams,
        env: envSqParams
    }); 
    
    var heat_population =  L?.tileLayer.wms('http://geoserver.bigdatamap.keenetic.pro/geoserver/leaders/wms', {
        layers:'leaders:grid_hex_wgs_population',
        styles:'leaders:heat_population',
        format: 'image/png',
        transparent: 'true',
        tileSize: 512,
        pane: 'heatPane',
        detectRetina: true,
        opacity: 0.5
    }); 

    // heatmap square init
    var heatProvParams = ''
    var envProvParams = 'class_empty:0.9;class_1:8670206.3;class_2:18565976.733333334;class_3:30695172;class_4:49502611.55000001;class_5:1452003333'
    var heat_provision =  L?.tileLayer.wms('http://geoserver.bigdatamap.keenetic.pro/geoserver/leaders/wms', {
        layers:'leaders:heatmap_provision',
        styles:'leaders:heatmap_provision_style',
        format: 'image/png',
        transparent: 'true',
        tileSize: 512,
        pane: 'heatPane',
        detectRetina: true,
        opacity: 0.5,
        viewparams: heatProvParams,
        env: envProvParams
    }); 
    
        
    var buffers =  L?.tileLayer.wms('http://geoserver.bigdatamap.keenetic.pro/geoserver/leaders/wms', {
        layers:'leaders:objects_buffer_iso',
        styles:'leaders:buffers',
        format: 'image/png',
        transparent: 'true',
        tileSize: 512,
        pane: 'bufferPane',
        detectRetina: true
    });

    var emptyLayer = L.tileLayer('').addTo(thisElement.map);
        
    var baseMaps = {
        'Базовая карта': emptyLayer,
        'Тепловая карта спортивных зон': heat_square,
        'Тепловая карта населения': heat_population,
        'Тепловая карта обеспеченности спортивными зонами': heat_provision
    };
    
    var overlayMaps = {
        "Спортивные объекты": thisElement.markers,
        "Зоны доступности":buffers
    };
    
    L.control.layers(baseMaps, overlayMaps, {position:'topright',collapsed:false}).addTo(thisElement.map);
    
    var layerControl = document.querySelector('.leaflet-control-layers.leaflet-control-layers-expanded.leaflet-control');
    var layerTab = document.querySelector('div.layers-control');
    if (layerControl && layerTab){
        layerTab.appendChild(layerControl);
        
        var baseLayers = layerControl.querySelector('.leaflet-control-layers-base');
        var overlaysLayers = layerControl.querySelector('.leaflet-control-layers-overlays');

        const label = layerControl.querySelectorAll('.leaflet-control-layers-overlays label');
        const span = layerControl.querySelectorAll('.leaflet-control-layers-overlays span');

        label.forEach(el => el.classList.add('form-checkbox-custom'))
        span.forEach(el => el.classList.add('form-label', 'form-label--lib'))

        if (baseLayers && overlaysLayers) {
            layerControl.insertBefore(overlaysLayers, layerControl.firstChild);
            layerControl.appendChild(baseLayers);
        }
    };
};

export default Livemap
