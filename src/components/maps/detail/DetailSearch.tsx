import { Bookmark } from '@assets/svg'; //overflow
import styled from 'styled-components';

interface Props {
    selectedPlace: google.maps.places.PlaceResult | null;
}

function DetailSearch({ selectedPlace }: Props) {
    if (!selectedPlace) return null;

    const handleBookmarkClick = async () => {
        if (!selectedPlace || !selectedPlace.geometry?.location) return;

        const placeData = {
            name: selectedPlace.name, // 장소 이름
            latitude: selectedPlace.geometry.location.lat(), // 위도
            longitude: selectedPlace.geometry.location.lng(), // 경도
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_ADDRESS}/maps/destinations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(placeData),
                credentials: 'include',
            });

            if (response.ok) {
                console.log('북마크 저장 성공!', await response.json());
            } else {
                console.error('북마크 저장 실패:', response.status);
            }
        } catch (error) {
            console.log(error);
            console.error('북마크 저장 중 오류 발생:', error);
        }
    };

    return (
        <DetailSearchContainer>
            {selectedPlace && (
                <div>
                    {selectedPlace.photos?.[0] && <img src={selectedPlace.photos[0].getUrl({ maxWidth: 300 })} alt={selectedPlace.name} />}
                    <div className="place-contents">
                        <div className="title">
                            <h3>{selectedPlace.name}</h3>
                            <div className="bookmark" onClick={handleBookmarkClick}>
                                <Bookmark />
                            </div>
                        </div>
                        <p className="rating">⭐ {selectedPlace.rating || '평점 없음'}</p>
                        <p className="vicinity">{selectedPlace.vicinity}</p>
                    </div>
                </div>
            )}
        </DetailSearchContainer>
    );
}

export default DetailSearch;

const DetailSearchContainer = styled.div`
    margin-top: 20px;
    width: 310px;

    div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-family: ${({ theme }) => theme.font.family.default};

        img {
            width: 100%;
            height: 200px;
        }

        div.title {
            width: 300px;
            flex-direction: row;
            justify-content: space-between;
            margin: 20px 0;
            padding: 0 10px;

            h3 {
                padding: 0;
                margin: 0;
                font-size: 24px;
            }

            div.bookmark {
                cursor: pointer;
            }

            svg {
                width: 24px;
                height: 24px;
            }
        }

        p {
            margin: 5px 10px;
            padding: 0;
        }
    }
`;
