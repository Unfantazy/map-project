const  map = new L.Map('map',{
    center: [55.690223, 37.595290],
    zoom: 10,
})
const layer = L.tileLayer.wms("https://geoserver.bigdatamap.keenetic.pro/geoserver/leaders/wms", {
    layers: 'leaders:objects_buffer',
    format: 'image/png',
    transparent: true,
    tileSize: 512,
    detectRetina: true,
});
layer.addTo(map)