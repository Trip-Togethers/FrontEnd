import { styled } from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { addPost,editPost } from "@/store/postReducer";
import Button from "@/components/common/Button";
import { PostContentInput, PostTitleInput } from "@/components/common/InputText";

interface PostData {
  title: string;
  content: string;
  author: string;
  createdAt: string; 
  likes: number;
  comments: { id: string; postId: string; author: string; content: string }[];
}

interface AddPostProps {
  addPost: (post: any) => void;
  editPost: (post: any) => void; // ✅ editPost 추가
  posts: any[];
  isEdit?: boolean;
}

function AddPost({ addPost, posts, isEdit, editPost }: AddPostProps) {
  const navigate = useNavigate();
  const { post_id } = useParams<{ post_id: string }>();
  const [postData, setPostData] = useState<PostData>({
    title: "",
    content: "",
    author: "익명",
    createdAt: new Date().toISOString(), // 현재 시간 자동 생성
    likes: 0, // 기본값 0
    comments: [], // 빈 배열로 초기화
  });
  


  // ✅ 수정 모드일 때 기존 데이터 불러오기
  useEffect(() => {
    if (isEdit && post_id) {
      const existingPost = posts.find((post) => post.id === post_id);
      if (existingPost) {
        setPostData({
          title: existingPost.title,
          content: existingPost.content,
          author: existingPost.author,
          createdAt: existingPost.createdAt,
          likes: existingPost.likes,
          comments: existingPost.comments,
        });
      }
    }
  }, [isEdit, post_id, posts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const existingPost = posts.find(post => post.id === post_id);
    const newPostId = isEdit ? post_id : (posts.length + 1).toString();
  
    const updatedPost = {
      id: newPostId, 
      title: postData.title,
      content: postData.content,
      author: postData.author,
      createdAt: existingPost ? existingPost.createdAt : new Date().toISOString(),
      likes: existingPost ? existingPost.likes : 0,
      comments: existingPost ? existingPost.comments : [],
    };
  
    if (isEdit) {
      // 수정 모드
      editPost(updatedPost);
      console.log("🚀 게시글 수정됨:", updatedPost);
    } else {
      // 새 글 작성 모드
      addPost(updatedPost);
      console.log("🚀 새 게시글 추가됨:", updatedPost);
    }
    
    navigate("/posts");
  };
  

  return (
    <Container>
      <Title>{isEdit ? "게시글 수정" : "글 작성하기"}</Title> {/* ✅ 수정 모드일 때 제목 변경 */}
      <Form onSubmit={handleSubmit}>
        <PostTitleInput
          name="title"
          value={postData.title}
          onChange={(e) => setPostData({ ...postData, title: e.target.value })}
        />
        <ScheduleButton type="button">+ 일정 추가</ScheduleButton>
        <PostContentInput
          name="content"
          value={postData.content}
          onChange={(e) => setPostData({ ...postData, content: e.target.value })}
        />
        <ImageUploadButton>
          <input type="file" accept="image/*" style={{ display: "none" }} id="image-upload" />
          <label htmlFor="image-upload">+ 이미지 추가</label>
        </ImageUploadButton>
        <ButtonGroup>
          <Button type="submit" scheme="primary">{isEdit ? "수정 완료" : "완료"}</Button>
          <Button type="button" scheme="primary" onClick={() => navigate("/posts")}>취소</Button>
        </ButtonGroup>
      </Form>
    </Container>
  );
}

export default connect(
  (state: any) => ({ posts: state.post.posts }),
  { addPost, editPost } 
)(AddPost);

const Title = styled.h2`
  font-size: ${({ theme }) => theme.heading.large.fontSize};
  font-family: ${({ theme }) => theme.font.family.title}; 
  font-weight: ${({ theme }) => theme.font.weight.bold}; 
  text-align: center;
  margin-bottom: 1rem;
`;


const Container = styled.div`
  width: 100%;
  max-width: 800px;
  margin: auto;
  padding: 2rem;
  align-items: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  margin: 0 auto; 
`;

const ScheduleButton = styled.button`
  width: 10rem;
  height: 7rem;
  padding: 10px;
  background: ${({ theme }) => theme.color.input_background};
  color: ${({ theme }) => theme.color.input_text};
  font-family: ${({ theme }) => theme.font.family.title};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  font-size: 1rem;
  align-self: flex-start; 
  margin-left: 6rem;
  
  &:hover {
    background: ${({ theme }) => theme.color.primary_green};
    color: white;
  }
`;

// 이미지 업로드 버튼
const ImageUploadButton = styled.div`
  width: 100%;
  max-width: 548px;
  padding: 10px;
  background: ${({ theme }) => theme.color.input_background};
  color: ${({ theme }) => theme.color.input_text};
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  font-size: 1rem;
  justify-content: center;
  margin: 0 auto;
  font-family: ${({ theme }) => theme.font.family.default};

  label {
    cursor: pointer;
    display: block;
  }

  &:hover {
    background: ${({ theme }) => theme.color.primary_green};
    color: white;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;