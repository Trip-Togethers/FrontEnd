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
import { SIDEBAR_TAB_TEXT } from "@constants/sidebarTabItem";

import { Plus, Search, Cafe, Bed, ForkSpoon, Hospital } from "@assets/svg";
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
              {currentTab === SIDEBAR_TAB_TEXT.search.id && (
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
