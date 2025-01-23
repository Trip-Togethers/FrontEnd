import { styled } from "styled-components";
import GoogleMapComponent from "../components/maps/GoogleMap";
import Sidebar from "../components/maps/Sidebar";
import { DEFAULT_LOCATION } from "../constants/location";

function Map() {
	return (
		<MapStyle>
				{/* 사이드바 */}
				<Sidebar />

				{/* 사이드바 상세 */}
				{/* 검색 카테고리 */}

				{/* 지도 */}
				<GoogleMapComponent 
					latitude={DEFAULT_LOCATION.lat}
					longitude={DEFAULT_LOCATION.lng}
				/>
		</MapStyle>
	);
}

const MapStyle = styled.div`
	display: flex;
	width: 100vw;
	height: 100vh;
`;

export default Map;