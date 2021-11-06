import axios from "axios";

const settings = {
    withCredentials: true,
}
const instance = axios.create({
    ...settings
})

const apiUrl = 'https://asa.sports.keenetic.pro/geoserver';
const wfsApiUrl = apiUrl + '/wfs/?SERVICE=wfs&VERSION=1.1.0&REQUEST=GetFeature&TYPENAME=leaders%3A';
const owsApiUrl = apiUrl + '/leaders/ows/?service=WFS&version=1.0.0&request=GetFeature&typeName=';
const outputFormatApplJson = '&OUTPUTFORMAT=application%2Fjson';
const outputFormatJson = '&outputFormat=json';
const formatOptions = '&format_options=callback:getJson';

const getWfsRequestUrl = (type, params, outputFormat = '', formatOptions = '') => {
    return `${wfsApiUrl}${type}&VIEWPARAMS=${params ? params : ''}${outputFormat}${formatOptions}`;
}

export const mapAPI = {
    getFilterValues(type, value) {
        return instance.get(getWfsRequestUrl(`filter_${type}`, value ? `name:${value}` : '', outputFormatApplJson))
    },
    getInfoAboutObject(id) {
        return instance.get(getWfsRequestUrl('info_objects', `id:${id}`, outputFormatApplJson))
    },
    getShapeInfo(type, params) {
        return instance.get(getWfsRequestUrl(type, params, outputFormatApplJson))
    },
    getLayerJSON(layer, params) {
        return instance.get(`${owsApiUrl}leaders:${layer}&VIEWPARAMS=${params ? params : ''}${outputFormatJson}${formatOptions}`)
    },
    getMapObjects(type, params) {
        return instance.get(getWfsRequestUrl(type, params, outputFormatJson, formatOptions))
    }
}


