import React from 'react';
import ReactDOM from 'react-dom';
import L from 'leaflet';
import '../Leaflet.markercluster/src/index';
import '@geoman-io/leaflet-geoman-free'
import svg_red from '../images/icons/map-marker_red.svg'
import svg_blue from '../images/icons/map-marker_blue.svg'
import loader from '../images/icons/loader.gif'
import {infoTypes} from './InfoBlock'

import {mapAPI} from "../API/methods";

const geoServerUrl = 'https://asa.sports.keenetic.pro/geoserver';
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

        const attributionStr = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
        L?.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
            attribution: attributionStr,
            subdomains: 'abcd',
            maxZoom: 20,
            pane: 'basePane',
        }).addTo(this.map);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png', {
            attribution: attributionStr,
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

        LoadMarkers(this.markers, FilterModelToParams(this.props.model));

        this.markers.on('click', (e) => {
            RemoveSelected(this.map);

            e.layer.setIcon(selectedIcon);

            L?.tileLayer.wms(`${geoServerUrl}/leaders/wms`, {
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
                    this.props.setData({
                        type: infoTypes.object,
                        items: res.data.features.map(item => item.properties)
                    })
                })
                .catch(err => {
                    console.log(err)
                })
        })

        this.map.on('click', this.onMapClick);

        // добавление контрола переключения слоев
        Promise.resolve(AddLayersWithControl(this.map, this.markers, FilterModelToParams(this.props.model)))
            .finally(() => this.props.setIsLoading(false));
        
        // добавление контрола geoman
        AddGeoManControl(this);
    }

    componentWillUnmount() {
        this.map?.off('click', this.onMapClick);
        this.map = null;
    }

    onMapClick = () => { }

    render() {
        return (
            <div className='map' id={'map'}></div>
        );
    }
}

const AddGeoManControl = (mapComponent) => {
    mapComponent.map.pm.setLang('ru');
    mapComponent.map.pm.addControls({
        position: 'topright',
        drawCircleMarker: false,
        drawMarker: false,
        drawPolyline: false,
        optionsControls: false,
        rotateMode: false,
        cutPolygon: false
    });

    const controlItems = [
        'Rectangle',
        'Polygon',
        'Circle',
        'Edit',
        'Removal',
        'Drag',
    ]

    controlItems.forEach((item) => mapComponent.map.pm.Toolbar.changeActionsOfControl(item, []));

    var drawControl = document.querySelector('div.leaflet-pm-toolbar.leaflet-pm-draw');
    var editControl = document.querySelector('div.leaflet-pm-toolbar.leaflet-pm-edit');
    var serviceTab = document.querySelector('div.services-control');
    if (drawControl && editControl && serviceTab) {
        serviceTab.appendChild(drawControl);
        serviceTab.appendChild(editControl);
        document.querySelectorAll('.button-container').forEach((btn) => {
            let p = document.createElement("p");
            let innerAnchor = btn.querySelector('a.leaflet-buttons-control-button');
            p.innerText = innerAnchor.querySelector('div').title;
            innerAnchor.after(p);
        })
    };

    // delete old custom territory before new one
    document.querySelectorAll('.leaflet-pm-draw a').forEach(function (item) {
        item.addEventListener('click', function () {
            mapComponent.map.pm.getGeomanDrawLayers(true)?.getLayers()[0]?.removeFrom(mapComponent.map);
            if (window.currentSelectedSavedLayer)
            {
                window.currentSelectedSavedLayer.removeFrom(mapComponent.map)
            }
        });
    });

    
    document.getElementById('layerBtn')?.addEventListener('click', () => { 
        const mapLayers = Object.values(mapComponent.map._layers);
        const hasHeatmapSports = mapLayers.filter(x => x.options.styles === 'leaders:heatmap_square_style').length > 0;
        const hasHeatmapProvision = mapLayers.filter(x => x.options.styles === 'leaders:heatmap_provision_style' || x.options.styles === 'leaders:heatmap_need_style').length > 0;

        const type = hasHeatmapSports
        ? 'info_sports'
        : hasHeatmapProvision
            ? 'info_provision'
            : '';

        const infoType = hasHeatmapSports
        ? infoTypes.sports
        : hasHeatmapProvision
            ? infoTypes.provision
            : infoTypes.baseOrPopulation;
        
        if (infoType !== infoTypes.baseOrPopulation) {
            mapComponent.props.setIsLoading(true);
            const drawingLayer = mapComponent.map.pm.getGeomanDrawLayers(true).getLayers()[0] || window.currentSelectedSavedLayer.pm.getLayers()[0];
            const shape = drawingLayer.pm.getShape() === 'Circle' 
                ? L.PM.Utils.circleToPolygon(drawingLayer, 20) 
                : drawingLayer;
            const params = FilterModelToParams(mapComponent.props.model) + 'geojson:' + JSON.stringify(shape.toGeoJSON()['geometry']).replaceAll(",", "\\,");
            
            mapAPI.getShape(type, params)
                .then(res => {
                    const infoItems = res.data.features.map(item => item.properties);
                    mapComponent.props.setData({
                        type: infoType,
                        items: infoItems 
                    });

                    localStorage.setItem('current_drawing_layer', JSON.stringify({
                        model: mapComponent.props.model,
                        filterParams: params,
                        layer: shape.toGeoJSON(),
                        infoType,
                        infoItems
                    }));
                })
                .catch(err => {
                    console.log(err)
                })
                .finally(() =>  mapComponent.props.setIsLoading(false));

            var saveElms = document.querySelector('.saveLayer');
            if (saveElms)
            {
                saveElms.style = 'display: inline-block';
            }

        }
        else {
            mapComponent.props.setData({
                type: infoType,
                items: [] 
            });
        }
               
    });

    // Сохранение слоя
    document.getElementById('saveLayerBtn')?.addEventListener('click', () => {
        var nameElm = document.querySelector('.saveLayerName');
        var name = nameElm.value
        if (name)
        {
            nameElm.parentElement.parentElement.classList.remove('isFocused');
            nameElm.value = '';
            var saveElms = document.querySelector('.saveLayer');
            if (saveElms)
            {
                saveElms.style = 'display: none';
            }

            var currentLayer = JSON.parse(localStorage.getItem('current_drawing_layer'));
            let savingLayersObj = null;

            if (localStorage.getItem('saved_layers')) {
                savingLayersObj = Array.from(JSON.parse(localStorage.getItem('saved_layers')));
                currentLayer = {
                    ...currentLayer,
                    id: savingLayersObj.length + 1,
                    name
                }
                savingLayersObj.push(currentLayer);
            } 
            else {
                currentLayer = {
                    ...currentLayer,
                    id: 1,
                    name
                }
                savingLayersObj = new Array(currentLayer);
            }
            localStorage.setItem('saved_layers', JSON.stringify(savingLayersObj));
            mapComponent.props.setSavedLayers(savingLayersObj);
        }
        else {
            nameElm.parentElement.parentElement.classList.add('isFocused');
        }
    });

    //Отображение выбранного слоя 
    document.querySelectorAll('.savedLayer')?.forEach((savedLayer) => 
        savedLayer.addEventListener('click', (e) => {
            if (localStorage.getItem('saved_layers') && 
                !e.currentTarget.classList.contains('isActive')) 
            {
                var savingLayers = Array.from(JSON.parse(localStorage.getItem('saved_layers')));
                var currentLayer = savingLayers.find(x => x.id === Number(e.currentTarget.id));
                if (currentLayer) {                            
                    mapComponent.props.setIsLoading(true)
                    // добавление маркеров на карту
                    LoadMarkers(mapComponent.markers, currentLayer.filterParams);
                    // добавление контрола переключения слоев
                    Promise.resolve(AddLayersWithControl(mapComponent.map, mapComponent.markers, currentLayer.filterParams))
                    .then(() => {
                        var layerName = currentLayer.infoType === infoTypes.sports
                            ? 'Тепловая карта спортивных зон'
                            : 'Тепловая карта обеспеченности (потребности) спортивными зонами' ;
                
                        window.baseMaps[layerName].addTo(mapComponent.map)
                        ReClassControl();
                        
                        if (window.currentSelectedSavedLayer)
                        {
                            window.currentSelectedSavedLayer.removeFrom(mapComponent.map)
                        }
                        
                        window.currentSelectedSavedLayer = L.geoJSON(currentLayer.layer).addTo(mapComponent.map);
                        mapComponent.map.setView(window.currentSelectedSavedLayer.getBounds().getCenter(), 
                            mapComponent.map.getZoom(), 
                            {
                                "animate": true,
                            });
                        mapComponent.props.setModel({
                            obj_name: currentLayer.model.obj_name,
                            org_id: currentLayer.model.org_id,
                            org_name: currentLayer.model.org_name,
                            sz_name: currentLayer.model.sz_name,
                            sz_type: currentLayer.model.sz_type,
                            sz_type_name: currentLayer.model.sz_type_name,
                            s_kind: currentLayer.model.s_kind,
                            s_kind_name: currentLayer.model.s_kind_name,
                            buf: currentLayer.model.buf
                        });

                        mapComponent.props.setData({
                            type: currentLayer.infoType,
                            items: currentLayer.infoItems 
                        });
                        mapComponent.props.setFlag(b => b + 1)
                    })
                    .finally(() => mapComponent.props.setIsLoading(false));
                }
            } 
        })
    );
}

export const AddLayersWithControl = async (mapElement, markersElement, filterParams) => {
    RemoveOldLayers(mapElement);
    const apiUrl = `${geoServerUrl}/leaders/wms`;
    const getParamsAsString = (params) => {
        let paramsString = '';
        for (let i in params) {
            paramsString += i + ":" + params[i] + ";";
        }
        return paramsString.substring(0, paramsString.length - 2);
    };

    // heatmap square 
    let params = (await mapAPI.getMapObjects('thresholds_heatmap_square', filterParams)).data.features[0].properties;
    var heat_square = L?.tileLayer.wms(apiUrl, {
        layers: 'leaders:heatmap_square',
        styles: 'leaders:heatmap_square_style',
        format: 'image/png',
        transparent: 'true',
        tileSize: 512,
        pane: 'heatPane',
        detectRetina: true,
        opacity: 0.6,
        viewparams: filterParams,
        env: getParamsAsString(params)
    });

    var heat_population = L?.tileLayer.wms(apiUrl, {
        layers: 'leaders:grid_hex_wgs_population',
        styles: 'leaders:heat_population',
        format: 'image/png',
        transparent: 'true',
        tileSize: 512,
        pane: 'heatPane',
        detectRetina: true,
        opacity: 0.6
    });

    // heatmap provision
    // var provParams = (await mapAPI.getMapObjects('thresholds_heatmap_provision', filterParams)).data.features[0].properties;
    // var heat_provision = L?.tileLayer.wms(apiUrl, {
    //     layers: 'leaders:heatmap_provision',
    //     styles: 'leaders:heatmap_provision_style',
    //     format: 'image/png',
    //     transparent: 'true',
    //     tileSize: 512,
    //     pane: 'heatPane',
    //     detectRetina: true,
    //     opacity: 0.6,
    //     viewparams: filterParams,
    //     env: getParamsAsString(provParams)
    // });

    var heat_need = L?.tileLayer.wms(apiUrl, {
        layers: 'leaders:heatmap_need',
        styles: 'leaders:heatmap_need_style',
        format: 'image/png',
        transparent: 'true',
        tileSize: 512,
        pane: 'heatPane',
        detectRetina: true,
        opacity: 0.6,
        viewparams: filterParams,
    });

    var buffers = L?.tileLayer.wms(apiUrl, {
        layers: 'leaders:filter_apply_buffers',
        styles: 'leaders:buffers',
        format: 'image/png',
        transparent: 'true',
        tileSize: 512,
        pane: 'bufferPane',
        viewparams: filterParams,
        detectRetina: true
    });

    var emptyLayer = L.tileLayer('', {pane: 'heatPane'}).addTo(mapElement);

    var baseMaps = window.baseMaps = {
        'Базовая карта': emptyLayer,
        'Тепловая карта спортивных зон': heat_square,
        'Тепловая карта населения': heat_population,
        // 'Тепловая карта обеспеченности спортивными зонами': heat_provision,
        'Тепловая карта обеспеченности (потребности) спортивными зонами':heat_need
    };

    var overlayMaps = {
        "Спортивные объекты": markersElement,
        "Зоны доступности": buffers
    };

    var stylesControl = L.control.layers(baseMaps, overlayMaps, {position: 'topright', collapsed: false});

    // loader on layer load    
    if (document.getElementsByClassName("Loader-layer").length === 0) {
        var load = document.createElement('div');
        load.classList.add('Loader-layer');
        load.innerHTML = `
            <div class='Loader-layer-wrapper'>
                <div class='Loader-layer__inner'}>
                    Прогрузка слоя...
                    <img src=${loader} alt=''/>
                </div>
            </div>`
        load.style='display:none'
        document.getElementsByClassName('map')[0].appendChild(load); 
    }

    Object.keys(baseMaps).forEach(key => {
        if (key !=='Базовая карта') {
            baseMaps[key].on("loading",function() {
                load = document.getElementsByClassName("Loader-layer")[0]
                load.style='display:block'
            });
            baseMaps[key].on("load",function() {
                load = document.getElementsByClassName("Loader-layer")[0]
                load.style='display:none'
            });
        }
    })
    

    const layers_legends = [
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
        // {
        //     name: 'heatmap_provision',
        //     style: 'heatmap_provision_style',
        //     legend_name: 'Обеспеченность населения <br>спортивной инфраструктурой',
        // },
        {
            name: 'heatmap_need',
            style: 'heatmap_need_style',
            legend_name: 'Обеспеченность или потребность населения в спортивной инфраструктуре',
        }
    ]

    // legend
    var legend = L.control({style: 'background:white'});
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info-legend hint-is-shown')
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

        content += `<img class="img-legend" src="${geoServerUrl}/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&WIDTH=30&FORMAT=image/png&LAYER=leaders:${layer_name}&STYLE=leaders:${layer_style}&legend_options=fontName:Roboto;fontAntiAliasing:true;fontSize:12;dpi:200;bgColor:0xffffff;fontColor:0x4c4c4c;"></div>`;
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
                    const imgElem = document.getElementsByClassName('img-legend')[0]
                    document.querySelector('.info-legend').style = 'display: block'
                    imgElem.style.width='0'
                    const layer_name = layer.options.layers.split(':')[1]
                    const style = layer.options.styles.split(':')[1]
                    const legend_params = layers_legends.find(item => item.name === layer_name)
                    document.querySelector('.info-legend > div > b').innerHTML = legend_params.legend_name;
                    // $('.info-legend').children('div').children('i').text(legend_params.);

                    var src = `${geoServerUrl}/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&WIDTH=30&FORMAT=image/png&LAYER=leaders:${layer_name}&STYLE=leaders:${style}&legend_options=fontName:Roboto;fontAntiAliasing:true;fontSize:12;dpi:200;bgColor:0xffffff;fontColor:0x4c4c4c; `
                    document.querySelector('.info-legend > div > img').setAttribute("src", src);

                    imgElem.onload = function(e){
                        if (layer_name==='heatmap_need') {
                            imgElem.style.width = '200px'
                        }
                        else if (layer_name==='grid_hex_wgs_population') {
                            imgElem.style.width = '150px'
                        }
                        else {
                            imgElem.style.width = '240px'
                        }
                    }
                    
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

        if (baseLayers && overlaysLayers) {
            ReClassControl();
            layerControl.insertBefore(overlaysLayers, layerControl.firstChild);
            layerControl.appendChild(baseLayers);
        }
    };
};

const ReClassControl = () => {   
    const radioLabel = document.querySelectorAll('.leaflet-control-layers-base label');
    const radioSpan = document.querySelectorAll('.leaflet-control-layers-base span');

    radioLabel.forEach(el => el.classList.add('form-radio-custom'))
    radioSpan.forEach(el => el.classList.add('checkmark'))

    const label = document.querySelectorAll('.leaflet-control-layers-overlays label');
    const span = document.querySelectorAll('.leaflet-control-layers-overlays span');

    label.forEach(el => el.classList.add('form-checkbox-custom'))
    span.forEach(el => el.classList.add('form-label', 'form-label--lib'))
}

export const LoadMarkers = (markersGroup, params) => {
    mapAPI.getMapObjects('filter_apply_objects', params).then(res => {
        markersGroup.clearLayers();
        for (var i = 0; i < res.data.features.length; i++) {
            var a = res.data.features[i];
            var id = a.properties.id;
            new L.marker(L.latLng(a.geometry.coordinates[1], a.geometry.coordinates[0]), {id: id, icon: objIcon, pmIgnore: true})
                .addTo(markersGroup);
        }
    })
    .catch(err => {
        console.log(err)
    })
}

export const RemoveSelected = (mapElement) => {    
    Object.values(mapElement._layers)
        .filter(x => x._icon?.src?.includes('map-marker_blue'))
        .forEach(y => y.setIcon(objIcon))

    Object.values(mapElement._layers)
        .filter(x => x.options.styles === 'leaders:buffer_selected')
        .forEach(y => y.remove(mapElement))
}

export const RemoveOldLayers = (mapElement) => {    
    const layers = [
        'leaders:heatmap_square_style', 
        'leaders:heat_population', 
        'leaders:heatmap_provision_style',
        'leaders:heatmap_need_style',
        'leaders:buffers'];

    layers.forEach((layer) => {
        Object.values(mapElement._layers)
        .filter(x => x.options.styles === layer)
        .forEach(y => y.remove(mapElement))
    })
}

export const FilterModelToParams = (filterModel) =>
{
    var params = '';
    if (filterModel) {
        if (filterModel.obj_name?.length > 0) {
            params += 'obj_name:' + filterModel.obj_name.join('\\;') + ';';
        }
        if (filterModel.org_id?.length > 0) {
            params += 'org_id:' + filterModel.org_id.join('\\;') + ';';
        }
        if (filterModel.sz_name?.length > 0) {
            params += 'sz_name:' + filterModel.sz_name.join('\\;') + ';';
        }
        if (filterModel.sz_type?.length > 0) {
            params += 'sz_type:' + filterModel.sz_type.join('\\;') + ';';
        }
        if (filterModel.s_kind?.length > 0) {
            params += 's_kind:' + filterModel.s_kind.join('\\;') + ';';
        }
        if (filterModel.buf?.length > 0) {
            params += 'buf:' + filterModel.buf.join('\\;') + ';';
        }
    }
    
    return params;
}

export default Livemap
