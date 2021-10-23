import React from 'react';
import ReactDOM from 'react-dom';
import L from 'leaflet';
import '../Leaflet.VectorGrid/src/bundle';
import '../Leaflet.markercluster/src/index';
import '@geoman-io/leaflet-geoman-free'
import svg_red from '../images/icons/map-marker_red.svg'
import svg_blue from '../images/icons/map-marker_blue.svg'

import {mapAPI} from "../API/methods";

const objIcon = new L.Icon({
    iconUrl: svg_red,
    iconSize: [24, 35],
    iconAnchor: [20, 20],
});

const selectedIcon = new L.Icon({
    iconUrl: svg_blue,
    iconSize: [24, 35],
    iconAnchor: [20, 20],
});

class Livemap extends React.Component {
    componentDidMount() {
        window.LeafletMap = this.map = L?.map(ReactDOM.findDOMNode(this), {
            minZoom: 9,
            maxZoom: 20,
            center: [55.740223, 37.595290],
            zoom: 11,
            layers: [],
            attributionControl: false,
        });

        this.map.getPane('overlayPane').style.zIndex = 1000

        this.map.createPane('basePane');
        this.map.getPane('basePane').style.zIndex = 100;

        this.map.createPane('heatPane');
        this.map.getPane('heatPane').style.zIndex = 200;

        this.map.createPane('bufferPane');
        this.map.getPane('bufferPane').style.zIndex = 300;

        this.map.createPane('objectPane');
        this.map.getPane('objectPane').style.zIndex = 400;

        this.map.getPane('markerPane').style.zIndex = 400;

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

        window.Markers = this.markers = new L.markerClusterGroup({
            chunkedLoading: true,
            showCoverageOnHover: false,
            disableClusteringAtZoom: 15,
            removeOutsideVisibleBounds: true,
            spiderfyOnMaxZoom: false,
        }).addTo(this.map);

        mapAPI.getLayerJSON('objects_centroids').then(res => {
            this.markers.clearLayers();
            for (var i = 0; i < res.data.features.length; i++) {
                var a = res.data.features[i];
                var id = a.properties.id;
                new L.marker(L.latLng(a.geometry.coordinates[1], a.geometry.coordinates[0]), {id: id, icon: objIcon})
                    .addTo(this.markers);
            }
        })
            .catch(err => {
                console.log(err)
            })

        this.markers.on('click', (e) => {
            e.layer.setIcon(selectedIcon)

            L?.tileLayer.wms('http://geoserver.bigdatamap.keenetic.pro/geoserver/leaders/wms', {
                layers: 'leaders:object_buffer',
                styles: 'leaders:buffer_selected',
                format: 'image/png',
                transparent: 'true',
                tileSize: 512,
                pane: 'bufferPane',
                detectRetina: true,
                viewparams: 'object_id:' + e.layer.options.id,
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

        this.map.on('click', this.onMapClick);

        // добавление контрола переключения слоев
        const filterParams = 'obj_name:Спортивный комплекс образовательного учреждения\;Дворовая территория;org_id:219814\;237454;sz_name:зал спортивный №1;s_kind:46\;100;buf:500\;1000';
        Promise.resolve(AddLayersWithControl(this.map, this.markers, filterParams));

        // добавление контрола geoman
        AddGeomanControl(this.map);
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
    if (mapElement) {
        mapElement.pm.setLang('ru');
        mapElement.pm.addControls({
            position: 'topright',
            drawCircleMarker: false,
            drawMarker: false,
            drawPolyline: false,
            optionsControls: false,
            rotateMode: false,
            cutPolygon: false
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
        if (drawControl && editControl && serviceTab) {
            serviceTab.appendChild(drawControl);
            serviceTab.appendChild(editControl);
        }
        ;

        mapElement.on("pm:create", () => {
            console.log('element is created');
            // disable buttons
            document.getElementsByClassName('leaflet-pm-draw')[0].style.pointerEvents = 'none';
            document.querySelectorAll('.leaflet-pm-draw a').forEach(a => a.classList.add('leaflet-disabled'));
        });

        mapElement.on("pm:remove", () => {
            console.log('element is deleted');
            if (mapElement.pm.getGeomanDrawLayers(true).getLayers().length === 0) {
                //enable buttons
                document.getElementsByClassName('leaflet-pm-draw')[0].style.pointerEvents = 'auto';
                document.querySelectorAll('.leaflet-pm-draw a')
                    .forEach(a => a.classList.remove('leaflet-disabled'));
            }
            ;
        });

        document.getElementById('layerBtn')?.addEventListener('click', () => {
            var drawingLayers = mapElement.pm.getGeomanDrawLayers(true).getLayers()[0];
            var shape = drawingLayers.pm.getShape() === 'Circle' ? L.PM.Utils.circleToPolygon(drawingLayers, 20) : drawingLayers;
            var shapeJson = shape.toGeoJSON()['geometry'];
            var shapeJsonFormatted = JSON.stringify(shapeJson).replaceAll(",", "\\,")
            console.log(mapAPI.getShapeProvision('geojson:' + shapeJsonFormatted));
        })
    }
}

export const AddLayersWithControl = async (mapElement, markersElement, filterParams) => {
    const apiUrl = 'http://geoserver.bigdatamap.keenetic.pro/geoserver/leaders/wms';

    // heatmap square 
    let params = (await mapAPI.getParamsForHeatmapSquare(filterParams)).data.features[0].properties;

    let envSqParams = "";
    for (let i in params) {
        envSqParams += i + ":" + params[i] + ";";
    }
    envSqParams = envSqParams.substring(0, envSqParams.length - 2);
    var heat_square = L?.tileLayer.wms(apiUrl, {
        layers: 'leaders:heatmap_square',
        styles: 'leaders:heatmap_square_style',
        format: 'image/png',
        transparent: 'true',
        tileSize: 512,
        pane: 'heatPane',
        detectRetina: true,
        opacity: 0.5,
        viewparams: filterParams,
        env: envSqParams
    });

    var heat_population = L?.tileLayer.wms(apiUrl, {
        layers: 'leaders:grid_hex_wgs_population',
        styles: 'leaders:heat_population',
        format: 'image/png',
        transparent: 'true',
        tileSize: 512,
        pane: 'heatPane',
        detectRetina: true,
        opacity: 0.5
    });

    // heatmap square init
    var provParams = (await mapAPI.getParamsForHeatmapProvision(filterParams)).data.features[0].properties;

    let envProvParams = "";
    for (let i in provParams) {
        envProvParams += i + ":" + provParams[i] + ";";
    }
    envProvParams = envProvParams.substring(0, envProvParams.length - 2);
    var heat_provision = L?.tileLayer.wms(apiUrl, {
        layers: 'leaders:heatmap_provision',
        styles: 'leaders:heatmap_provision_style',
        format: 'image/png',
        transparent: 'true',
        tileSize: 512,
        pane: 'heatPane',
        detectRetina: true,
        opacity: 0.5,
        viewparams: filterParams,
        env: envProvParams
    });

    var buffers = L?.tileLayer.wms(apiUrl, {
        layers: 'leaders:objects_buffer_iso',
        styles: 'leaders:buffers',
        format: 'image/png',
        transparent: 'true',
        tileSize: 512,
        pane: 'bufferPane',
        detectRetina: true
    });

    var emptyLayer = L.tileLayer('', {pane: 'heatPane'}).addTo(mapElement);

    var baseMaps = {
        'Базовая карта': emptyLayer,
        'Тепловая карта спортивных зон': heat_square,
        'Тепловая карта населения': heat_population,
        'Тепловая карта обеспеченности спортивными зонами': heat_provision
    };

    var overlayMaps = {
        "Спортивные объекты": markersElement,
        "Зоны доступности": buffers
    };

    var stylesControl = L.control.layers(baseMaps, overlayMaps, {position: 'topright', collapsed: false});

    var layers_legends = [
        {
            name: 'heatmap_square',
            style: 'heat_square_style',
            legend_name: 'Суммарная площадь спортивных зон',
        },
        {
            name: 'grid_hex_wgs_population',
            style: 'heat_population',
            legend_name: 'Средняя численность населения',
        },
        {
            name: 'heatmap_provision',
            style: 'heatmap_provision_style',
            legend_name: 'Обеспеченность населения <br>спортивной инфраструктурой',
        }
    ]

    // legend
    var legend = L.control({style: 'background:white'});
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info-legend')
        div.style = 'display: none'
        div.innerHTML +=
            '<strong style="margin-bottom: -20px; display: block;"> Условные обозначения </strong><br>'
        var layer = layers_legends[1]
        var layer_name = layer.name;
        var layer_style = layer.style;
        var layer_legend_name = layer.legend_name;
        var layer_legend_descr = layer.legend_descr;
        var content = `<div class="${layer_name} legend">`;
        if (layer_legend_name) {
            content += `<b>${layer_legend_name}</b><br>`;
        }
        if (layer_legend_descr) {
            content += `<i>${layer_legend_descr}</i><br>`
        }

        content += `<img class="img-legend" src="http://geoserver.bigdatamap.keenetic.pro/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&WIDTH=30&FORMAT=image/png&LAYER=leaders:${layer_name}&STYLE=leaders:${layer_style}&legend_options=fontName:Roboto;fontAntiAliasing:true;fontSize:12;dpi:200;bgColor:0xffffff;fontColor:0x4c4c4c;"></div>`;
        div.innerHTML += content
        return div;
    };
    if (window.Legend) {
        window.Legend.remove(mapElement);
    }
    window.Legend = legend;
    legend.addTo(mapElement);

    // переопределение функции клика по input выбора слоя
    stylesControl._onInputClick = function () {
        let inputs = this._layerControlInputs,
            input, layer;
        var addedLayers = [],
            removedLayers = [];

        this._handlingClick = true;

        for (var i = inputs.length - 1; i >= 0; i--) {
            input = inputs[i];
            layer = this._getLayer(input.layerId).layer;

            if (input.checked) {
                addedLayers.push(layer);
                // ПОДПИСЬ к легенде
                if (layer.options.pane === 'heatPane' && layer._url === '') {
                    document.querySelector('.info-legend').style = 'display: none'
                } else if (layer.options.pane === 'heatPane' && layer._url !== '') {
                    document.querySelector('.info-legend').style = 'display: block'
                    const layer_name = layer.options.layers.split(':')[1]
                    const style = layer.options.styles.split(':')[1]
                    const legend_params = layers_legends.find(item => item.name === layer_name)
                    document.querySelector('.info-legend > div > b').innerHTML = legend_params.legend_name;
                    // $('.info-legend').children('div').children('i').text(legend_params.);

                    var src = `http://geoserver.bigdatamap.keenetic.pro/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&WIDTH=30&FORMAT=image/png&LAYER=leaders:${layer_name}&STYLE=leaders:${style}&legend_options=fontName:Roboto;fontAntiAliasing:true;fontSize:12;dpi:200;bgColor:0xffffff;fontColor:0x4c4c4c; `
                    document.querySelector('.info-legend > div > img').setAttribute("src", src);
                }

            } else if (!input.checked) {
                removedLayers.push(layer);
            }
        }

        // Bugfix issue 2318: Should remove all old layers before readding new ones
        for (i = 0; i < removedLayers.length; i++) {
            if (this._map.hasLayer(removedLayers[i])) {
                this._map.removeLayer(removedLayers[i]);
            }
        }
        for (i = 0; i < addedLayers.length; i++) {
            if (!this._map.hasLayer(addedLayers[i])) {
                this._map.addLayer(addedLayers[i]);
            }
        }

        this._handlingClick = false;

        this._refocusOnMap();
    };
    if (window.StylesControl) {
        window.StylesControl.remove(mapElement);
    }
    window.StylesControl = stylesControl;
    stylesControl.addTo(mapElement);

    var layerControl = document.querySelector('.leaflet-control-layers.leaflet-control-layers-expanded.leaflet-control');
    var layerTab = document.querySelector('div.layers-control');
    if (layerControl && layerTab) {
        layerTab.appendChild(layerControl);

        var baseLayers = layerControl.querySelector('.leaflet-control-layers-base');
        var overlaysLayers = layerControl.querySelector('.leaflet-control-layers-overlays');

        const radioLabel = layerControl.querySelectorAll('.leaflet-control-layers-base label');
        const radioSpan = layerControl.querySelectorAll('.leaflet-control-layers-base span');

        radioLabel.forEach(el => el.classList.add('form-radio-custom'))
        radioSpan.forEach(el => el.classList.add('checkmark'))

        const label = layerControl.querySelectorAll('.leaflet-control-layers-overlays label');
        const span = layerControl.querySelectorAll('.leaflet-control-layers-overlays span');

        label.forEach(el => el.classList.add('form-checkbox-custom'))
        span.forEach(el => el.classList.add('form-label', 'form-label--lib'))

        if (baseLayers && overlaysLayers) {
            layerControl.insertBefore(overlaysLayers, layerControl.firstChild);
            layerControl.appendChild(baseLayers);
        }
    }
    ;
};

export const LoadMarkers = (markersGroup, params) => {
    mapAPI.getObjectsByFilters(params).then(res => {
        markersGroup.clearLayers();
        for (var i = 0; i < res.data.features.length; i++) {
            var a = res.data.features[i];
            var id = a.properties.id;
            new L.marker(L.latLng(a.geometry.coordinates[1], a.geometry.coordinates[0]), {id: id, icon: objIcon})
                .addTo(markersGroup);
        }
    })
        .catch(err => {
            console.log(err)
        })
}

export default Livemap
