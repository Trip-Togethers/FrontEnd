import { useState, useCallback, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import styled from "styled-components";
import SidebarTab from "./Sidebar";
import SearchCategoryButton from "./SearchCategoryButton";
import { SIDEBAR_TAB_TEXT } from "@/constants/sidebarTabItem";

import { Plus, Search, Cafe, Bed, ForkSpoon, Hospital, LocationPin } from "@/assets/svg";
import DetailSearch from "./detail/DetailSearch";

const Category = [
  {
    icon: <ForkSpoon />,
    name: "음식점",
    type: "restaurant",
  },
  {
    icon: <Cafe />,
    name: "카페",
    type: "cafe",
  },
  {
    icon: <Bed />,
    name: "숙소",
    type: "lodging",
  },
  {
    icon: <Hospital />,
    name: "병원",
    type: "hospital",
  },
];

interface GoogleMapProps {
  latitude: number;
  longitude: number;
}

function GoogleMapComponent({ latitude, longitude }: GoogleMapProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<string | null>(null);

  const [map, setMap] = useState<any>(null);
  const [center, setCenter] = useState({ lat: latitude, lng: longitude });
  const [searchResults, setSearchResults] = useState<any>(null);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  
  const [destinations, setDestinations] = useState<any[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (currentTab === "bookmark") {
      fetchDestinations();
    }
  }, [currentTab]);

  const fetchDestinations = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_ADDRESS}/maps/destinations`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoidGVzdEBhc2QuY29tIiwiaWF0IjoxNzM4NjU0OTYzLCJleHAiOjE3Mzg3NDEzNjN9.NLJ0CyNIrSm3FLUZB2AFqV9awvzg5gZJ4v-0-uasiPM',
        },
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setDestinations(data.destinations);
      } else {
        console.error("목적지 불러오기 실패:", data.message);
      }
    } catch (error) {
      console.error("서버 요청 오류:", error);
    }
  };

  const handleDestinationClick = (lat: number, lng: number) => {
    if (!map) return;

    const newCenter = { lat, lng };
    setCenter(newCenter);
    setSelectedMarker(newCenter);
    map.panTo(newCenter);
    map.setZoom(18);
  };
  
  

  // 사이드바 관련 코드
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
    [currentTab, isSidebarOpen],
  );

  const handleCategoryClick = useCallback(
    (name: string, type: string) => {
      setCurrentTab(SIDEBAR_TAB_TEXT.search.id);
      setIsSidebarOpen(true);
      (document.getElementById("place-input") as HTMLInputElement).value = name;
      searchCategory(type);
    },
    [currentTab, isSidebarOpen],
  );

  useEffect(() => {
    if (!isSidebarOpen) {
      setSearchResults(null);
      setSelectedPlace(null);
    }
  }, [isSidebarOpen]);

  // 지도 관련 코드
  const mapContainerStyle = {
    width: "100%",
    height: "100%",
  };

  const handleLoad = (map: any) => {
    setMap(map);

    map.addListener("click", (event: any) => {
      if (event.placeId) {
        event.stop();
        fetchPlaceDetails(event.placeId);
        setCurrentTab(SIDEBAR_TAB_TEXT.search.id);
        setIsSidebarOpen(true);
      } else {
        setSelectedPlace(null);
        setIsSidebarOpen(false);
      }
    });
  };

  const fetchPlaceDetails = (placeId: any) => {
    const service = new google.maps.places.PlacesService(map);
    const request = {
      placeId: placeId,
      fields: [
        "name",
        "geometry",
        "vicinity",
        "rating",
        "photos",
        "opening_hours",
      ],
    };

    service.getDetails(request, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && place) {
        setSelectedPlace(place);
      }
    });
  };

  const handleAutocompleteLoad = (
    autocompleteInstance: google.maps.places.Autocomplete,
  ) => {
    setAutocomplete(autocompleteInstance);
  };

  const handlePlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const currentCenter = place.geometry.location;

        setSearchResults([place]);
        setSelectedPlace(place);
        setCurrentTab(SIDEBAR_TAB_TEXT.search.id);
        setCenter({ lat: currentCenter.lat(), lng: currentCenter.lng() });
        map?.panTo(currentCenter);
        map?.setZoom(18);
      }
    }
  };

  const searchCategory = (type: string) => {
    if (!map) return;

    const currentCenter = map.getCenter();
    const service = new google.maps.places.PlacesService(map);
    const request = {
      location: currentCenter,
      radius: 1000,
      type,
      fields: [
        "name",
        "geometry",
        "vicinity",
        "rating",
        "photos",
        "opening_hours",
      ],
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        setSearchResults(results);
        setCenter({ lat: currentCenter.lat(), lng: currentCenter.lng() });

        const bounds = new google.maps.LatLngBounds();
        results.forEach((place) => {
          if (place.geometry && place.geometry.location) {
            bounds.extend(place.geometry.location);
          }
        });
        map.fitBounds(bounds);
      }
    });
  };

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={["places"]}
    >
      <MapContainer>
        <SidebarContainer>
          <SidebarTab
            isSidebarOpen={isSidebarOpen}
            currentTab={currentTab}
            handleSidebarClick={handleSidebarClick}
          ></SidebarTab>
          {isSidebarOpen && (
            <SidebarDetailContainer>
              {currentTab === "search" && (
                <>
                  <InputContainer>
                    <div className="search">
                      <Search />
                    </div>
                    <Autocomplete
                      onLoad={handleAutocompleteLoad}
                      onPlaceChanged={handlePlaceChanged}
                    >
                      <input
                        id="place-input"
                        type="text"
                        placeholder="검색어를 입력해주세요"
                      />
                    </Autocomplete>
                    <div
                      className="clear"
                      onClick={() =>
                        ((
                          document.getElementById(
                            "place-input",
                          ) as HTMLInputElement
                        ).value = "")
                      }
                    >
                      <Plus />
                    </div>
                  </InputContainer>
                  <DetailSearch selectedPlace={selectedPlace} />
                </>
              )}

              {currentTab === "bookmark" && (
                <BookmarkContainer>
                  <ul>
                    {destinations.length > 0 ? (
                      destinations.map((place) => (
                        <li
                          key={place.id}
                          onClick={() => handleDestinationClick(place.latitude, place.longitude)}
                        >
                          <span>{place.name}</span>
                          <LocationPin width={20} height={20} color="black" />
                        </li>
                      ))
                    ) : (
                      <p>저장된 목적지가 없습니다.</p>
                    )}
                  </ul>
                </BookmarkContainer>
              )}

            </SidebarDetailContainer>
          )}
          <CategoryContainer isOpen={isSidebarOpen}>
            {Category.map((item) => (
              <SearchCategoryButton
                icon={item.icon}
                name={item.name}
                type={item.type}
                click={handleCategoryClick}
              />
            ))}
          </CategoryContainer>
        </SidebarContainer>

        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={10}
          onLoad={handleLoad}
          onClick={() => setSelectedPlace(null)}
        >
          {searchResults &&
            searchResults.map((place: any) => (
              <Marker
                key={place.place_id}
                position={{
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng(),
                }}
                title={place.name}
                onClick={() => {
                  setSelectedPlace(place);
                  setIsSidebarOpen(true);
                }}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png", // 기본 아이콘
                  scaledSize:
                    selectedPlace?.place_id === place.place_id
                      ? new google.maps.Size(50, 50) // 선택된 마커 크기
                      : new google.maps.Size(30, 30), // 기본 마커 크기
                }}
              />
            ))}
          
          {selectedMarker && (
              <Marker
                position={selectedMarker}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // ✅ 파란색 마커 추가
                  scaledSize: new google.maps.Size(40, 40),
                }}
              />
            )}
        </GoogleMap>
      </MapContainer>
    </LoadScript>
  );
}

export default GoogleMapComponent;

const BookmarkContainer = styled.div`
  width: 100%;
  padding: 20px;
  text-align: center;
  cursor: pointer;

  h3 {
    margin-bottom: 10px;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 10px;
    margin: 5px 0;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  small {
    color: #6c757d;
    font-size: 12px;
  }
`;

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
`;

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
  border: 1px solid ${({ theme }) => theme.color.primary_green};
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
    font-family: ${({ theme }) => theme.font.family.title};
    width: 180px;

    &:focus {
      outline: none;
    }
  }

  div.search {
    svg {
      path {
        fill: ${({ theme }) => theme.color.primary_green};
      }
    }
  }

  div.clear {
    rotate: 45deg;

    svg {
      path {
        fill: ${({ theme }) => theme.color.input_background};
      }
    }

    &:hover {
      cursor: pointer;
    }
  }
`;

const CategoryContainer = styled.div<{ isOpen: boolean }>`
  position: absolute;
  left: ${({ isOpen }) => (isOpen ? "385px" : "75px")};
  margin: 10px 0 0 20px;
  height: 40px;
  display: flex;
  align-items: center;
`;
