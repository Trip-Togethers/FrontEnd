import { useState, useCallback } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import styled from "styled-components";
import SidebarTab from "./Sidebar";
import { SIDEBAR_TAB_TEXT } from "@/constants/sidebarTabItem";

import { Plus, Search } from "@/assets/svg";



interface GoogleMapProps {
  latitude: number;
  longitude: number;
}

function GoogleMapComponent({ latitude, longitude }: GoogleMapProps) {

  // 사이드바 관련 코드
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<string | null>(null);

  const handleSidebarClick = useCallback(
    (id: string) => {
      if (currentTab === id) {
        setIsSidebarOpen(!isSidebarOpen);
        setCurrentTab(null);
      } else {
        setCurrentTab(id);
        setIsSidebarOpen(true);
      }
    },
    [currentTab, isSidebarOpen]
  );

  // 지도 관련 코드
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
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API}
      libraries={["places"]}
    >
      <MapContainer>
        <SidebarContainer>
          <SidebarTab
            isSidebarOpen={isSidebarOpen}
            currentTab={currentTab}
            handleSidebarClick={handleSidebarClick}
          >
          </SidebarTab>
          { isSidebarOpen && (<SidebarDetailContainer>
              { currentTab === SIDEBAR_TAB_TEXT.search.id && 
              (<InputContainer>
                <div className="search">
                  <Search />
                </div>
                <Autocomplete
                  onPlaceChanged={() =>
                    setPlace(
                      (document.getElementById("place-input") as HTMLInputElement)
                        .value
                    )
                  }
                >
                  <input
                    id="place-input"
                    type="text"
                    placeholder="검색어를 입력해주세요"
                  />
                </Autocomplete>
                <div className="clear">
                  <Plus />
                </div>                
              </InputContainer>)}            
            </SidebarDetailContainer>)}
        </SidebarContainer>

        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={10}
          onLoad={handleLoad}
        >
          <Marker position={center} />
        </GoogleMap>
      </MapContainer>
    </LoadScript>
  );
}

export default GoogleMapComponent;

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const SidebarContainer = styled.div`
  z-index: 5;
  left: 0;
  display: flex;
  position: fixed;
  height: 100%;
`

const SidebarDetailContainer = styled.div`
  width: 310px;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
	box-shadow: ${({ theme }) => theme.shadow.default};
`;

const InputContainer = styled.div`
  width: 260px;
  height: 40px;
  margin-top: 20px;
  border: 1px solid ${({ theme }) => theme.color.primary_green };
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;

  svg {
    width: 24px;
    height: 24px;
  }

  input {
    font-size: 13px;
    border: none;
    font-family: ${({ theme }) => theme.font.family.title };
    width: 180px;
  }

  input:focus {
    outline: none;
  }

  div.search {
    svg {
      path {
        fill: ${({ theme }) => theme.color.primary_green };
      }
    }
  }

  div.clear {
    rotate: 45deg;

    svg {
      path {
        fill: ${({ theme }) => theme.color.input_background };
      }
    }
  }
`;