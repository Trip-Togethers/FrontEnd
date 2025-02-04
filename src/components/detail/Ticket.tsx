import React from "react";
import styled from "styled-components";
import Logo from "@assets/svg/Logo";

const Ticket = () => {
  return (
    <div>
      <TicketStyle>
        <div>
          <Logo className="logo" />
        </div>
        <div>Ticket</div>
      </TicketStyle>
    </div>
  );
};

const TicketStyle = styled.div`
  display: grid;
  grid-template-columns: 200px 200px 200px;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 4px 5px 0px;
  height: 100%;
  .logo {
    overflow: inherit;
    transform: rotate(-90deg);
    fill: white;
    background-color: ${({ theme }) => theme.color.primary_green};
    padding: 0.5rem;
  }
`;

export default Ticket;
