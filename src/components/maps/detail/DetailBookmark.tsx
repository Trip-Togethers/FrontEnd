import { loadBookmark } from "@api/map.api";
import Bookmark from "@assets/svg/Bookmark";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Dispatch, SetStateAction } from 'react';

export interface Place {
  place_id: string;
  name: string;
  rating: number;
  vicinity: string;
  photos: any[];
  latitude: number;
  longitude: number;
}

interface DetailBookmarkProps {
  setSelectedPlace: Dispatch<SetStateAction<google.maps.places.PlaceResult | null>>;
  selectedPlace: google.maps.places.PlaceResult | null;
  handleUnbookmark: (placeId: string) => Promise<void>;
}
;

function DetailBookmark({ selectedPlace, handleUnbookmark, setSelectedPlace }: DetailBookmarkProps) {
  if (!selectedPlace) return null;

  console.log(selectedPlace);
  const [bookmarkedPlaces, setBookmarkedPlaces] = useState<Place[]>([]);
  const token = localStorage.getItem("token");

    useEffect(() => {
      const fetchBookmarkedPlaces = async () => {
        try {
          const data = await loadBookmark();
          console.log("북마크된 장소:", data); // data 객체를 로그로 확인
          if (data && data.destinations) {
            setBookmarkedPlaces(data.destinations); // destinations가 있는 경우에만 상태 업데이트
          } else {
            console.error("destinations가 없습니다.");
          }
        } catch (error) {
          console.error("북마크된 장소 불러오는 중 오류 발생:", error);
        }
      };

    fetchBookmarkedPlaces();
  }, [token]);

  // selectedPlace에 해당하는 장소 찾기
  const selectedBookmarkedPlace = bookmarkedPlaces.find(
    (place) => place.place_id === selectedPlace.place_id
  );

  // 선택된 북마크 장소가 있을 때 GoogleMap에 표시
  useEffect(() => {
    if (selectedBookmarkedPlace) {
      setSelectedPlace(selectedBookmarkedPlace);
    }
  }, [selectedBookmarkedPlace, setSelectedPlace]);

   return (
    <DetailBookmarkContainer>
      {selectedBookmarkedPlace && (
        <div>
        {selectedBookmarkedPlace.photos && selectedBookmarkedPlace.photos.length > 0 ? (
          <img
            src={selectedBookmarkedPlace.photos[0]}
            alt={selectedBookmarkedPlace.name}
          />
        ) : (
          <p>이미지가 존재하지 않습니다.</p>
        )}
          <div className="place-contents">
            <div className="title">
              <h3>{selectedBookmarkedPlace.name}</h3>
              <div
                className="bookmark"
                onClick={() =>
                  handleUnbookmark(selectedBookmarkedPlace.place_id)
                }
              >
                <Bookmark />
              </div>
            </div>
            <p className="rating">
              ⭐ {selectedBookmarkedPlace.rating || "평점 없음"}
            </p>
            <p className="vicinity">{selectedBookmarkedPlace.vicinity}</p>
          </div>
        </div>
      )}
    </DetailBookmarkContainer>
  );
}

export default DetailBookmark;



const DetailBookmarkContainer = styled.div`
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
