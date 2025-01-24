import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker, Autocomplete } from "@react-google-maps/api";
import styled from "styled-components";

interface GoogleMapProps {
  latitude: number;
  longitude: number;
}

const GoogleMapComponent: React.FC<GoogleMapProps> = ({ latitude, longitude }) => {
  const [map, setMap] = useState<any>(null);
  const [place, setPlace] = useState<any>(null);

  const mapContainerStyle = {
    width: "100%",
    height: "100%",
  };

  const center = {
    lat: latitude,
    lng: longitude,
  };

  const handleLoad = (map: any) => {
    setMap(map);
  };

  const searchPlace = () => {
    if (map && place) {
      const service = new google.maps.places.PlacesService(map);
      const request = {
        location: new google.maps.LatLng(latitude, longitude),
        radius: 500, // 반경 500m 내에서 검색
        query: place, // 검색할 장소
      };
      service.textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          console.log(results); // 검색된 장소 출력
        }
      });
    }
  };

  //VITE_GOOGLE_MAPS_API_KEY 환경변수 키 네임 -> api호출 회수 제한으로 레이아웃 제작시 사용x
  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API} libraries={['places']}>
      <MapContainer>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={10}
          onLoad={handleLoad}
        >
          <Marker position={center} />
        </GoogleMap>
        {/* <InputWrapper>
          <Autocomplete onPlaceChanged={() => setPlace((document.getElementById("place-input") as HTMLInputElement).value)}>
            <PlaceInput id="place-input" type="text" placeholder="Search for a place" />
          </Autocomplete>
          <SearchButton onClick={searchPlace}>Search Place</SearchButton>
        </InputWrapper> */}
      </MapContainer>
    </LoadScript>
  );
};

export default GoogleMapComponent;

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InputWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PlaceInput = styled.input`
  padding: 8px;
  font-size: 16px;
  width: 300px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const SearchButton = styled.button`
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;