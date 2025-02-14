import { styled } from "styled-components";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, SetStateAction } from "react";
import Button from "@components/common/Button";
import avatar from "../../public/svg/avatar.svg";
import {
  Post as PostType,
  ImageInfo,
  RootState,
  Post,
  GetPost,
  Schedule,
} from "@store/store";
import { addComemnts, deleteComments, deleteDetailPosts, editComments, like, showComments, showDetailPosts } from "@api/post.api";
import { showPlan } from "@api/schedule.api";

interface PostImage {
  url: string;
}

// 타입 정의
interface Author {
  nick: string;
  profile: string;
};

interface Comment {
  id: number;
  content: string;
  author: Author;
  createdAt: string;
};

interface CommentsResponse {
  comment: {
    message: string;
    statusCode: number;
    posts: Comment[];
  };
};

function Posts() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [post, setPost] = useState<GetPost | null>(null); // 객체로 상태 변경
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Schedule[]>([]); // 일정 데이터 상태
  const [error, setError] = useState<string | null>(null);
  const [likes, setLikes] = useState<Number>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState<string>("");  // 댓글 입력값을 위한 상태 추가

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await showDetailPosts(Number(postId));
        console.log(response); // 반환된 데이터 확인
        setPost(response.post.post); // 객체로 상태 저장

        // 일정 데이터 가져오기
        const scheduleResponse = await showPlan(); // 일정 데이터를 가져오는 API 호출
        if (Array.isArray(scheduleResponse.schedules)) {
          // tripId가 일치하는 하나의 일정만 찾기
          const selectedSchedule = scheduleResponse.schedules.find(
            (schedule: Schedule) => schedule.id === response.post.post.tripId
          );

          if (selectedSchedule) {
            setData([selectedSchedule]); // 배열 형태로 저장
          } else {
            setError("일정이 존재하지 않습니다.");
          }
        } else {
          setError("데이터 형식이 잘못되었습니다.");
        }
      } catch (error) {
        console.error("게시글을 불러오는 중 오류가 발생했습니다", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const data: CommentsResponse = await showComments(Number(postId));
        console.log(data)
        if (Array.isArray(data.comment.posts)) {
          setComments(data.comment.posts);  // 댓글 배열을 상태에 설정
        } else {
          console.error("댓글 데이터가 배열이 아닙니다.", data);
        }
      } catch (error) {
        console.error("댓글을 가져오는 중 오류가 발생했습니다.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
    fetchPosts();
  }, [postId]);

  const handleDeletePost = async () => {
    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      try {
        // 삭제 API 호출 (예: showDeletePost)
        await deleteDetailPosts(Number(postId)); // postId를 넘겨서 삭제 요청
  
        alert("게시글이 삭제되었습니다.");
        navigate("/posts"); // 삭제 후 목록 페이지로 리다이렉트
      } catch (error) {
        alert("게시글 삭제 중 오류가 발생했습니다.");
        console.error(error);
      }
    }
  };

  // 좋아요 추가 및 삭제
  const handleLike = async() => {
    try {
      const LikeCount = await like(Number(postId))
      setLikes(LikeCount.like.post.like)
      window.location.reload();
    } catch (error) {
      alert("좋아요 추가 혹은 취소 중 오류가 발생했습니다.");
      console.error(error);
    }
  }

  const handleCommentSubmit = async () => {
    if (content.trim()) {
      try {
        const data = await addComemnts(Number(postId), content);  // 댓글 작성 API 호출
        if (data && data.comment && Array.isArray(data.comment.posts)) {
          setComments(data.comment.posts);  // 새로 작성된 댓글이 포함된 댓글 목록 업데이트
        }
        setContent("");  // 댓글 작성 후 입력란 초기화
        window.location.reload();
      } catch (error) {
        console.error("댓글 작성 중 오류가 발생했습니다.", error);
      }
    } else {
      alert("댓글 내용을 입력해 주세요.");
    }
  };

  // 댓글 수정 핸들러
const handleCommentEdit = async (commentId: number, currentContent: string) => {
  const newContent = prompt("수정할 댓글 내용을 입력하세요:", currentContent);
  if (newContent && newContent !== currentContent) {
    try {
      const response = await editComments(Number(postId), commentId, newContent);  // 수정된 댓글 내용 전달
      if (response.statusCode === 200) {
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === commentId ? { ...comment, content: newContent } : comment
          )
        );
        alert("댓글이 수정되었습니다.");
      } else {
        alert("댓글 수정에 실패했습니다.");
      }
    } catch (error) {
      alert("댓글 수정 중 오류가 발생했습니다.");
      console.error(error);
    }
  }
};

// 댓글 삭제 핸들러
const handleCommentDelete = async (commentId: number) => {
  if (window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
    try {
      const response = await deleteComments(Number(postId), commentId);  // 댓글 삭제 요청
      if (response.comment.statusCode === 200) {
        // 댓글 목록에서 해당 댓글 삭제
        setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
        alert("댓글이 삭제되었습니다.");
      } else {
        alert("댓글 삭제에 실패했습니다.");
      }
    } catch (error) {
      alert("댓글 삭제 중 오류가 발생했습니다.");
      console.error(error);
    }
  }
};
  

  // 데이터가 없으면 로딩 중인 화면을 표시
  if (loading) {
    return <div>Loading...</div>;
  }

  // 데이터가 없으면 표시할 오류 메시지
  if (!post) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  return (
    <Container>
      <Header>
        <BackButton scheme="primary" onClick={() => navigate("/posts")}>
          목록으로
        </BackButton>
        <EditDeleteSection>
          <EditButton
            scheme="primary"
            onClick={() => navigate(`/posts/edit/${postId}`)}
          >
            ✏️ 수정
          </EditButton>
          <DeleteButton
            scheme="alert"
            onClick={handleDeletePost} // 삭제 처리
          >
            🗑 삭제
          </DeleteButton>
        </EditDeleteSection>
      </Header>

      <PostWrapper>
        {post && ( // post가 null이 아닐 경우에만 접근
          <>
            <Title>{post.postTitle}</Title>
            <PostInfo>
              <ProfileImg src={post.author.profile} alt="작성자 프로필" />
              <Author>{post.author.nick}</Author>
              <CreatedAt>
                {new Date(post.createdAt).toLocaleDateString()}
              </CreatedAt>
            </PostInfo>
            <Divider />
            {/* 선택한 일정이 있을 경우 */}
            {data.map((schedule) => (
              <SelectedSchedule>
                <p>
                  <strong>일정 제목:</strong> {schedule.title}
                </p>
                <p>
                  <strong>여행지:</strong> {schedule.destination}
                </p>
                <p>
                  <strong>여행 기간:</strong>
                  {new Date(schedule.startDate).toLocaleDateString()} -{" "}
                  {new Date(schedule.endDate).toLocaleDateString()}
                </p>
              </SelectedSchedule>
            ))}
            <Content>{post.postContent}</Content>
            {post.postPhotoUrl && (
              <ImagesContainer>
                <ImageWrapper>
                  <PostImage src={post.postPhotoUrl} />
                </ImageWrapper>
              </ImagesContainer>
            )}
          </>
        )}

        {/* 이미지를 표시하는 부분을 텍스트로 바꿈 */}
        <LikeSection>
          <LikeButton scheme="primary" onClick={handleLike} $isLiked={false}>
            👍🏻
          </LikeButton>
          <LikeCount>{post?.likes}</LikeCount> {/* 옵셔널 체이닝 */}
        </LikeSection>
      </PostWrapper>

      <CommentsWrapper>
        <h3>댓글 ({comments.length})</h3>
        <CommentsList>
          {loading ? (
            <div>로딩 중...</div>
          ) : Array.isArray(comments) && comments.length > 0 ? (
            comments.map((comment) => (
              <CommentItem key={comment.id}>
                <div>
                  <b>{comment.author?.nick || "익명"}</b>: {comment.content}
                  <ButtonWrapper>
                    <EditButton
                      scheme="primary"
                      onClick={() =>
                        handleCommentEdit(comment.id, comment.content)
                      }
                    >
                      ✏️ 수정
                    </EditButton>

                    <DeleteButton
                      scheme="alert"
                      onClick={() => handleCommentDelete(comment.id)}
                    >
                      🗑 삭제
                    </DeleteButton>
                  </ButtonWrapper>
                </div>
              </CommentItem>
            ))
          ) : (
            <div>댓글이 없습니다.</div>
          )}
        </CommentsList>
        <CommentInputWrapper>
          <CommentInput
            value={content}
            onChange={(e) => setContent(e.target.value)} // 댓글 내용 상태 업데이트
            placeholder="댓글을 입력하세요..."
          />
          <CommentButton scheme="primary" onClick={handleCommentSubmit}>
            댓글 작성
          </CommentButton>
        </CommentInputWrapper>
      </CommentsWrapper>
    </Container>
  );
}

export default connect((state: RootState) => ({ posts: state.post.posts }), {

})(Posts);

const SelectedSchedule = styled.div`
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

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
  background: ${(props) =>
    props.$isLiked ? props.theme.color.primary_green : "white"};
  color: ${(props) =>
    props.$isLiked ? "white" : props.theme.color.primary_black};

  &:hover {
    transform: scale(1.05);
    transition: transform 0.2s;
    background: ${(props) =>
      props.$isLiked
        ? props.theme.color.primary_black
        : props.theme.color.primary_green};
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
  background: ${({ theme }) => theme.color.primary_white};
  padding: 0.8rem;
  margin-bottom: 0.5rem;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.color.input_text};
  border-radius: 0;
  position: relative; /* 버튼을 오른쪽 상단에 고정시키기 위한 설정 */
`;

const ButtonWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 0.5rem;
`;

const CommentInputWrapper = styled.div`
  display: flex;
  margin-top: 1rem;
  gap: 0.5rem;
`;

const CommentInput = styled.input`
  flex: 1;
  padding: 0.7rem;
  border: none;
  border-radius: 0;
  border-bottom: 1px solid ${({ theme }) => theme.color.input_text};
  font-family: ${({ theme }) => theme.font.family.contents};
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
