import axios from "axios";

const settings = {
    withCredentials: true,
}
const instance = axios.create({
    ...settings
})

const apiUrl = 'http://geoserver.bigdatamap.keenetic.pro/geoserver';

export const mapAPI = {
    getSportsTypes(type, value) {
        return instance.get(`${apiUrl}/wfs?SERVICE=wfs&VERSION=1.1.0&REQUEST=GetFeature&TYPENAME=leaders%3Afilter_${type}&VIEWPARAMS=${value ? `name:${value}` : ''}&OUTPUTFORMAT=application%2Fjson`)
    },
    getSportsZonesTypes(type, value) {
        return instance.get(`${apiUrl}/wfs?SERVICE=wfs&VERSION=1.1.0&REQUEST=GetFeature&TYPENAME=leaders%3Afilter_${type}&VIEWPARAMS=${value ? `name:${value}` : ''}&OUTPUTFORMAT=application%2Fjson`)
    },
    getSportsZonesNames(type, value) {
        return instance.get(`${apiUrl}/wfs?SERVICE=wfs&VERSION=1.1.0&REQUEST=GetFeature&TYPENAME=leaders%3Afilter_${type}&VIEWPARAMS=${value ? `name:${value}` : ''}&OUTPUTFORMAT=application%2Fjson`)
    },
    getOrganizations(type, value) {
        return instance.get(`${apiUrl}/wfs?SERVICE=wfs&VERSION=1.1.0&REQUEST=GetFeature&TYPENAME=leaders%3Afilter_${type}&VIEWPARAMS=${value ? `name:${value}` : ''}&OUTPUTFORMAT=application%2Fjson`)
    },
    getNames(type, value) {
        return instance.get(`${apiUrl}/wfs?SERVICE=wfs&VERSION=1.1.0&REQUEST=GetFeature&TYPENAME=leaders%3Afilter_${type}&VIEWPARAMS=${value ? `name:${value}` : ''}&OUTPUTFORMAT=application%2Fjson`)
    },
    getInfoAboutObject(id) {
        return instance.get(`${apiUrl}/wfs?SERVICE=wfs&VERSION=1.1.0&REQUEST=GetFeature&TYPENAME=leaders%3Ainfo_objects&VIEWPARAMS=id:${id}&OUTPUTFORMAT=application%2Fjson`)
    },
    getLayerJSON(layer) {
        return instance.get(`${apiUrl}/leaders/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=leaders:${layer}&outputFormat=json&format_options=callback:getJson`)
    }
}


