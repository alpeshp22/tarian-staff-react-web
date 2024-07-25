import { useState } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import LoadingSpinner from "../components/LoadingSpinner";
import '../App.css';

const Maps = ({ coordinates, current }) => {

    const { isLoaded } = useLoadScript({ googleMapsApiKey: process.env.REACT_APP_MAP_API_KEY });

    const [activeMarker, setActiveMarker] = useState(null);

    const handleActiveMarker = (marker) => {
        if (marker === activeMarker) {
            return;
        }
        setActiveMarker(marker);
    };

    const locations = coordinates ? coordinates.map(row => ({
        id:row.locationId,
        name: row.pharmacyName,
        phone:row.pharmacyPhonenumber,
        address:row.pharmacyAddress,
        loc: {
            lat: row.pharmacyLatitude || row.pharamcyLatitude,
            lng: row.pharmacyLongitude
        }
    })) : [];
    const centerLat = locations[0] ? locations[0].loc.lat : current.latitude;
    const centerLng = locations[0] ? locations[0].loc.lng : current.longitude;

    // const handleBounds = (map) => {
    //     console.log('onLoad function called!');
    //     const bounds = new window.google.maps.LatLngBounds();
    //     locations.forEach(({loc}) => bounds.extend(loc));
    //     map.fitBounds(bounds);
    // }

    return (
        <div className='map-app'>
            {isLoaded ?
                <GoogleMap
                    zoom={12}
                    center={{ lat: +centerLat, lng: +centerLng }}
                    mapContainerClassName="map-container"
                    onClick={() => setActiveMarker(null)}
                >
                    {
                        locations.map(({id, name, phone, address, loc}) => {
                            return (
                                <>
                                    <Marker key={id} position={{ lat: +loc.lat, lng: +loc.lng }} onClick={() => handleActiveMarker(id)}>
                                        {activeMarker === id ? (
                                            <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                                                <>
                                                <div>{name}</div>
                                                <div>{phone}</div>
                                                <div>{address}</div>
                                                </>
                                            </InfoWindow>
                                        ) : null}
                                    </Marker>
                                </>
                            )
                        })
                    }
                </GoogleMap>
                : <LoadingSpinner />}
        </div>
    )
}

export default Maps;
