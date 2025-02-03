import { styled } from "styled-components";
import Ticket from "@/components/detail/ticket";
import Modal from "@/components/common/modal";
import { useState } from "react";

function Detail() {
  const { isIngOpen, setIngOpen } = useState(false);
  return (
    <DetailStyle>
      <Ticket />
      <Modal isOpen={isIngOpen}>제목:</Modal>
      <div>dmdrks</div>
    </DetailStyle>
  );
}

const DetailStyle = styled.div`
  box-shadow: rgba(0, 0, 0, 0.25) 0px 4px 5px 0px;
  border: 10px;
`;

export default Detail;
