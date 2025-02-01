import { styled } from "styled-components";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { likePost, addComment, deletePost } from "@/store/postReducer";
import { useState, useEffect } from "react";
import Button from "@/components/common/Button";
import avatar from "../../public/svg/avatar.svg";

interface PostProps {
  posts: any[];
  likePost: (id: string) => void;
  addComment: (comment: any) => void;
  deletePost: (id: string) => void;
}

interface ImageModalProps {
  images: any[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const ImageModal = ({ images, currentIndex, onClose, onPrev, onNext }: ImageModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrev, onNext]);

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        
        <ImageNavigator>
          {currentIndex > 0 && (
            <NavButton onClick={onPrev}>
              ←
            </NavButton>
          )}
          
          <ModalImage 
            src={typeof images[currentIndex] === 'string' ? images[currentIndex] : images[currentIndex].url} 
            alt={`이미지 ${currentIndex + 1}`}
          />
          
          {currentIndex < images.length - 1 && (
            <NavButton onClick={onNext}>
              →
            </NavButton>
          )}
        </ImageNavigator>

        <ImageCounter>
          {currentIndex + 1} / {images.length}
        </ImageCounter>
      </ModalContent>
    </ModalOverlay>
  );
};

function Post({ posts, likePost, addComment, deletePost }: PostProps) {
  const navigate = useNavigate();
  const { post_id } = useParams();
  const post = posts.find((p) => p.id === post_id);
  const [comment, setComment] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  if (!post) return <p>게시글을 찾을 수 없습니다.</p>;

  const handleDelete = () => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      deletePost(post.id);
      navigate("/posts");
    }
  };

  const handlePrevImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (selectedImageIndex !== null && post.images && selectedImageIndex < post.images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  return (
    <Container>
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

      <PostWrapper>
        <Title>{post.title}</Title>
        <PostInfo>
          <ProfileImg src={avatar} alt="작성자 프로필" />
          <Author>{post.author}</Author>
          <CreatedAt>{new Date(post.createdAt).toLocaleDateString()}</CreatedAt>
        </PostInfo>
        <Divider />

        <Content>{post.content}</Content>

        {post.images && post.images.length > 0 && (
          <ImagesContainer>
            {post.images.map((image, index) => (
              <ImageWrapper key={index} onClick={() => setSelectedImageIndex(index)}>
                <PostImage
                  src={typeof image === 'string' ? image : image.url}
                  alt={`게시글 이미지 ${index + 1}`}
                />
              </ImageWrapper>
            ))}
          </ImagesContainer>
        )}

        {selectedImageIndex !== null && post.images && (
          <ImageModal
            images={post.images}
            currentIndex={selectedImageIndex}
            onClose={() => setSelectedImageIndex(null)}
            onPrev={handlePrevImage}
            onNext={handleNextImage}
          />
        )}

        <LikeSection>
          <LikeButton scheme="primary" onClick={() => likePost(post.id)} $isLiked={post.hasLiked}>
            {post.hasLiked ? '👍' : '👍🏻'}
          </LikeButton>
          <LikeCount>{post.likes}</LikeCount>
        </LikeSection>
      </PostWrapper>

      <CommentsWrapper>
        <h3>댓글 ({post.comments.length})</h3>
        <CommentsList>
          {post.comments.map((c) => (
            <CommentItem key={c.id}>
              <b>{c.author}</b>: {c.content}
            </CommentItem>
          ))}
        </CommentsList>

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
  { likePost, addComment, deletePost }
)(Post);

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ImageNavigator = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const ModalImage = styled.img`
  max-width: 80vw;
  max-height: 80vh;
  object-fit: contain;
`;

const NavButton = styled.button`
  background: rgba(255, 255, 255, 0.3);
  border: none;
  color: white;
  font-size: 2rem;
  padding: 1rem;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.5);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: -40px;
  right: -40px;
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  padding: 10px;

  &:hover {
    color: ${({ theme }) => theme.color.primary_red};
  }
`;

const ImageCounter = styled.div`
  color: white;
  margin-top: 1rem;
  font-size: 1.2rem;
`;

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
  font-size: 1.2rem;
  line-height: 1.6;
`;

const LikeSection = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  gap: 0.5rem;
  align-items: center;
`;

const LikeButton = styled(Button)<{ $isLiked?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  font-size: 1.5rem;
  padding: 0 !important;
  margin: 0;
  overflow: hidden;
  flex-shrink: 0;
  min-width: 3.5rem !important;
  min-height: 3.5rem !important;
  aspect-ratio: 1/1;
  background: ${props => props.$isLiked ? props.theme.color.primary_green : 'white'};
  color: ${props => props.$isLiked ? 'white' : props.theme.color.primary_black};

  &:hover {
    transform: scale(1.05);
    transition: transform 0.2s;
    background: ${props => props.$isLiked ? props.theme.color.primary_black : props.theme.color.primary_green};
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

const ImagesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
`;

const ImageWrapper = styled.div`
  width: 100%;
  padding-top: 100%;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
`;

const PostImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

