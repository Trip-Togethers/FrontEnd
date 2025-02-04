import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import Button from "@components/common/Button";
import { RootState } from '@store/store';

function Board() {
  const navigate = useNavigate();
  const posts = useSelector((state: RootState) => state.post.posts);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const displayedPosts = useMemo(() => {
    console.log("Redux에서 변경된 posts:", posts);
    return posts.map(post => ({ ...post })).reverse(); // 불변성 유지
  }, [posts]);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [posts]);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = displayedPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(displayedPosts.length / postsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <BoardStyle>
      <Header>
        <h1>게시판</h1>
        <Button scheme="primary" 
          style={{ fontSize: "1.25rem", padding: 0, width: "3rem", height: "3rem" }}
          onClick={() => navigate("/posts/new")}
        >
          글쓰기
        </Button>
      </Header>
      <Table>
        <thead>
          <tr>
            <Th>번호</Th>
            <Th>제목</Th>
            <Th>글쓴이</Th>
            <Th>작성일</Th>
            <Th>좋아요</Th>
          </tr>
        </thead>
        <tbody>
          {currentPosts.map((post, index) => (
            <Tr key={post.id} onClick={() => navigate(`/posts/${post.id}`)}>
              <Td>{index + 1 + indexOfFirstPost}</Td>
              <Td>{post.title}</Td>
              <Td>{post.author}</Td>
              <Td>{new Date(post.createdAt).toLocaleDateString()}</Td>
              <Td>👍 {post.likes}</Td>
            </Tr>
          ))}
        </tbody>
      </Table>
      <Pagination>
        <PageButton disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
          ◀
        </PageButton>
        
        {[...Array(totalPages)].map((_, i) => (
          <PageButton 
            key={i} 
            $active={currentPage === i + 1} 
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </PageButton>
        ))}

        <PageButton disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
          ▶
        </PageButton>
      </Pagination>
    </BoardStyle>
  );
}

export default Board;

const BoardStyle = styled.div`
  width: 70%;
  height: 70%;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  font-family: ${({ theme }) => theme.font.family.default};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: ${({ theme }) => theme.font.family.contents};
`;

const Th = styled.th`
  padding: 10px;
  border-bottom: 2px solid #ddd;
  text-align: left;
`;

const Tr = styled.tr`
  cursor: pointer;
  &:hover {
    background: #f9f9f9;
  }
`;

const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  gap: 0.5rem;
  
`;

const PageButton = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  background: ${({ $active, theme }) => ($active ? theme.color.primary_green : "white")};
  color: ${({ $active, theme }) => ($active ? theme.color.primary_black : theme.color.name_gray)};
  border-radius: 5px;
  font-family: ${({ theme }) => theme.font.family.default};
  background-color:  ${({ theme }) => theme.color.primary_white};

  &:hover {
    background: ${({ theme }) => theme.color.primary_green};
    color: white;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

