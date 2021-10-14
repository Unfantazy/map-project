// const Func = () => {
//     const L = window.L
//
//     const map = L?.map('map', {
//         center: [51.505, -0.09],
//         zoom: 13
//     });
//
//    const layer = L?.tileLayer?.wms("https://geoserver.bigdatamap.keenetic.pro/geoserver/leaders/wms", {
//         layers: 'leaders:objects_buffer',
//         format: 'image/png',
//         transparent: true,
//         tileSize: 512,
//         detectRetina: true,
//     });
//     layer?.addTo(map)
//
//     return <div className='map'></div>
//
// }
//
// export default Func