import styled from "styled-components";

interface Props {
  icon: any;
  name: string;
  type: string;
  click: (name: string, type: string) => void;
}

function SearchCategoryButton({ icon, name, type, click }: Props) {
  return (
    <SearchCategoryButtonStyle length={name.length}>
      <div onClick={() => click(name, type)}>
        {icon}
        <p>{name}</p>
      </div>
    </SearchCategoryButtonStyle>
  );
}

export default SearchCategoryButton;

const SearchCategoryButtonStyle = styled.div<{ length: number }>`
  div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: ${({ length }) => length * 15 + 55}px;
    height: 35px;
    background-color: ${({ theme }) => theme.color.primary_white};
    margin: 0 12px;
    border-radius: 25px;
    box-shadow: ${({ theme }) => theme.shadow.default};

    svg {
      width: 24px;
      height: 24px;

      path {
        fill: ${({ theme }) => theme.color.primary_black};
      }
    }

    p {
      font-size: 16px;
      font-family: ${({ theme }) => theme.font.family.title};
    }

    &:hover {
      cursor: pointer;
      background-color: ${({ theme }) => theme.color.primary_green};

      svg {
        path {
          fill: ${({ theme }) => theme.color.primary_white};
        }
      }

      p {
        color: ${({ theme }) => theme.color.primary_white};
      }
    }
  }
`;
