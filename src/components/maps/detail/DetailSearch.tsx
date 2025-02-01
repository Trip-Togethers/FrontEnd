import { Bookmark } from "@/assets/svg";
import styled from "styled-components";

interface Props {
  selectedPlace: google.maps.places.PlaceResult | null;
}

function DetailSearch({ selectedPlace }: Props) {
  if (!selectedPlace) return null;

  return (
    <DetailSearchContainer>
      {selectedPlace && (
        <div>
          {selectedPlace.photos?.[0] && (
            <img
              src={selectedPlace.photos[0].getUrl({ maxWidth: 300 })}
              alt={selectedPlace.name}
            />
          )}
          <div className="place-contents">
            <div className="title">
              <h3>{selectedPlace.name}</h3>
              <Bookmark />
            </div>
            <p className="rating">⭐ {selectedPlace.rating || "평점 없음"}</p>
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
