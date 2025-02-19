import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import Button from "@components/common/Button";
import { showPosts } from "@api/post.api";

interface Author {
  nick: string;
  profile: string;
}

interface Post {
  id: number;
  postTitle: string;
  postContent: string;
  author: Author;
  createdAt: string;
  likes: number;
  comments_count: number;
}

function Board() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [hasMore, setHasMore] = useState(true); // 더 이상 데이터가 있는지 여부
  const postsPerPage = 1; // 한 페이지에 표시할 게시글 수 (예: 10개)

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);

      try {
        const data = await showPosts();
        console.log(data.posts.posts)
          setPosts(data.posts.posts); // 새로운 게시글 추가
      } catch (error) {
        console.error("게시글을 불러오는 중 오류가 발생했습니다", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }
// 페이지 버튼 클릭 시 처리
  const handlePageClick = () => {
    if (hasMore) {
      setCurrentPage(currentPage + 1); // 다음 페이지로 이동
    }
  };

  return (
    <BoardStyle>
      <Header>
        <h1>게시판</h1>
        <Button
          scheme="primary"
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
          {posts.map((post, index) => (
            <Tr key={post.id} onClick={() => navigate(`/posts/${post.id}`)}>
              <Td>{index + 1}</Td>
              <Td>{post.postTitle}</Td>
              <Td>{post.author.nick}</Td>
              <Td>{new Date(post.createdAt).toLocaleDateString()}</Td>
              <Td>👍 {post.likes}</Td>
            </Tr>
          ))}
        </tbody>
      </Table>
      <Pagination>
        <PageButton disabled>◀</PageButton>
        <PageButton $active={true}>1</PageButton>
        <PageButton>2</PageButton>
        <PageButton disabled>▶</PageButton>
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

