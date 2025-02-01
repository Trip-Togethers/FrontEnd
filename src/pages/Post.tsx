import { styled } from "styled-components";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { likePost, addComment, deletePost  } from "@/store/postReducer";
import { useState } from "react";
import Button from "@/components/common/Button";
import avatar from "../../public/svg/avatar.svg"

interface PostProps {
  posts: any[];
  likePost: (id: string) => void;
  addComment: (comment: any) => void;
  deletePost: (id: string) => void;
}

function Post({ posts, likePost, addComment, deletePost }: PostProps) {
  const navigate = useNavigate();
  const { post_id } = useParams();
  const post = posts.find((p) => p.id === post_id);
  const [comment, setComment] = useState("");

  if (!post) return <p>게시글을 찾을 수 없습니다.</p>;

  const handleDelete = () => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      deletePost(post.id);
      navigate("/posts");
    }
  };


  return (
    <Container>
      {/* 목록으로 돌아가기 버튼 */}
      <Header>
        <BackButton scheme="primary" onClick={() => navigate("/posts")}>
          목록으로
        </BackButton>
        <EditDeleteSection>
          <EditButton scheme="primary" onClick={() => navigate(`/posts/edit/${post.id}`)}>
              ✏️ 수정
            </EditButton>
            <DeleteButton scheme="alert" onClick={handleDelete}>
              🗑 삭제
            </DeleteButton>
          </EditDeleteSection>
      </Header>

      {/* 게시글 제목 및 정보 */}
      <PostWrapper>
        <Title>{post.title}</Title>
        <PostInfo>
          <ProfileImg src={avatar} alt="작성자 프로필" />
          <Author>{post.author}</Author>
          <CreatedAt>{new Date(post.createdAt).toLocaleDateString()}</CreatedAt>
        </PostInfo>
        <Divider />

        {/* 게시글 내용 */}
        <Content>{post.content}</Content>

        {/* 좋아요 버튼 */}
        <LikeSection>
          <LikeButton scheme="primary" onClick={() => likePost(post.id)}>
            👍🏻 
          </LikeButton>
          <LikeCount>{post.likes}</LikeCount>
        </LikeSection>
      </PostWrapper>

      {/* 댓글 영역 */}
      <CommentsWrapper>
        <h3>댓글 ({post.comments.length})</h3>
        <CommentsList>
          {post.comments.map((c) => (
            <CommentItem key={c.id}>
              <b>{c.author}</b>: {c.content}
            </CommentItem>
          ))}
        </CommentsList>

        {/* 댓글 입력 */}
        <CommentInputWrapper>
          <CommentInput
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="댓글을 입력하세요..."
          />
          <CommentButton
            scheme="primary"
            onClick={() => {
              addComment({
                id: Date.now().toString(),
                postId: post.id,
                author: "익명",
                content: comment,
              });
              setComment("");
            }}
          >
            댓글 작성
          </CommentButton>
        </CommentInputWrapper>
      </CommentsWrapper>
    </Container>
  );
}

export default connect(
  (state: any) => ({ posts: state.post.posts }),
  { likePost, addComment, deletePost })(Post);


const Container = styled.div`
  width: 70%;
  max-width: 800px;
  margin: auto;
  padding: 2rem;
  font-family: ${({ theme }) => theme.font.family.default};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const BackButton = styled(Button)`
  font-size: 1rem;
  padding: 0.5rem 1rem;
`;

const PostWrapper = styled.div`
  background: ${({ theme }) => theme.color.card_background};
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: ${({ theme }) => theme.font.weight.bold};
  margin-bottom: 0.5rem;
`;

const PostInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.color.name_gray};
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const ProfileImg = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
`;

const Author = styled.span`
  font-weight: ${({ theme }) => theme.font.weight.bold};
`;

const CreatedAt = styled.span`
  color: ${({ theme }) => theme.color.input_text};
`;

const Divider = styled.hr`
  margin: 1rem 0;
  border: 0;
  height: 1px;
  background: ${({ theme }) => theme.color.input_background};
`;

const Content = styled.p`
  font-size: 1rem;
  line-height: 1.6;
`;

const LikeSection = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  gap: 0.5rem;
  align-items: center;
`;

const LikeButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem; /* ✅ 가로 크기 */
  height: 3rem; /* ✅ 세로 크기 */
  border-radius: 50%;
  font-size: 1.5rem;
  padding: 0 !important;
  margin: 0;
  overflow: hidden;
  flex-shrink: 0;
  min-width: 3.5rem !important; // 최소 너비 강제 지정
  min-height: 3.5rem !important; // 최소 높이 강제 지정
  aspect-ratio: 1/1; // 가로 세로 비율 1:1 강제

   &:hover {
    transform: scale(1.05); // 호버 시 약간 커지는 효과
    transition: transform 0.2s;
  }

`;

const LikeCount = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.color.primary_black};
`;

const CommentsWrapper = styled.div`
  margin-top: 2rem;
`;

const CommentsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const CommentItem = styled.li`
  background: ${({ theme }) => theme.color.input_background};
  padding: 0.8rem;
  border-radius: 5px;
  margin-bottom: 0.5rem;
`;

const CommentInputWrapper = styled.div`
  display: flex;
  margin-top: 1rem;
  gap: 0.5rem;
`;

const CommentInput = styled.input`
  flex: 1;
  padding: 0.7rem;
  border: 1px solid ${({ theme }) => theme.color.input_text};
  border-radius: 5px;
`;

const CommentButton = styled(Button)`
  font-size: 1rem;
  padding: 0.7rem 1rem;
`;

const EditDeleteSection = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const EditButton = styled(Button)`
  font-size: 1rem;
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.color.primary_green};
  color: white;
  border-radius: 5px;

  &:hover {
    background: ${({ theme }) => theme.color.primary_black};
  }
`;

const DeleteButton = styled(Button)`
  font-size: 1rem;
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.color.primary_red};
  color: white;
  border-radius: 5px;

  &:hover {
    background: ${({ theme }) => theme.color.primary_black};
  }
`;