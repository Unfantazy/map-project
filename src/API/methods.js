import axios from "axios";

const settings = {
    withCredentials: true,
}
const instance = axios.create({
    ...settings
})

export const mapAPI = {
    getSportsTypes(type, value) {
        return instance.get(`http://geoserver.bigdatamap.keenetic.pro/geoserver/wfs?SERVICE=wfs&VERSION=1.1.0&REQUEST=GetFeature&TYPENAME=leaders%3Afilter_${type}&VIEWPARAMS=${value ? `name:${value}` : ''}&OUTPUTFORMAT=application%2Fjson`)
    },
    getSportsZonesTypes(type, value) {
        return instance.get(`http://geoserver.bigdatamap.keenetic.pro/geoserver/wfs?SERVICE=wfs&VERSION=1.1.0&REQUEST=GetFeature&TYPENAME=leaders%3Afilter_${type}&VIEWPARAMS=${value ? `name:${value}` : ''}&OUTPUTFORMAT=application%2Fjson`)
    },
    getSportsZonesNames(type, value) {
        return instance.get(`http://geoserver.bigdatamap.keenetic.pro/geoserver/wfs?SERVICE=wfs&VERSION=1.1.0&REQUEST=GetFeature&TYPENAME=leaders%3Afilter_${type}&VIEWPARAMS=${value ? `name:${value}` : ''}&OUTPUTFORMAT=application%2Fjson`)
    },
    getOrganizations(type, value) {
        return instance.get(`http://geoserver.bigdatamap.keenetic.pro/geoserver/wfs?SERVICE=wfs&VERSION=1.1.0&REQUEST=GetFeature&TYPENAME=leaders%3Afilter_${type}&VIEWPARAMS=${value ? `name:${value}` : ''}&OUTPUTFORMAT=application%2Fjson`)
    },
    getNames(type, value) {
        return instance.get(`http://geoserver.bigdatamap.keenetic.pro/geoserver/wfs?SERVICE=wfs&VERSION=1.1.0&REQUEST=GetFeature&TYPENAME=leaders%3Afilter_${type}&VIEWPARAMS=${value ? `name:${value}` : ''}&OUTPUTFORMAT=application%2Fjson`)
    }

}
