import styled from "styled-components";

function DetailSearch(){

  return (
    <DetailSearchContainer>
			<PlaceInput id="place-input" type="text" placeholder="Search for a place" />
    </DetailSearchContainer>
  );
};

export default DetailSearch;

const DetailSearchContainer = styled.div`
`;

const PlaceInput = styled.input`
  padding: 8px;
  font-size: 16px;
  width: 300px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;