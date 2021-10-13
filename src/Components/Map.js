import {MapContainer, TileLayer, Marker, Popup, WMSTileLayer} from 'react-leaflet'

const Map = () => {
    return (
        <>
            <div className={'Map'}>
                <MapContainer center={[55.505, 37.36]} zoom={8} scrollWheelZoom={true}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <WMSTileLayer
                    url={'https://geoserver.bigdatamap.keenetic.pro/geoserver/leaders/wms'}
                        params={{
                            layers: 'leaders:objects_buffer',
                            format: 'image/png',
                            transparent: true,
                            tileSize: 512,
                            detectRetina: true,
                            style: 'leaders:test_style_obs'
                        }}
                    />
                </MapContainer>
            </div>
        </>
    );
}

export default Map;
