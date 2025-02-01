import { styled } from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { addPost, editPost } from "@/store/postReducer";
import Button from "@/components/common/Button";
import { PostContentInput, PostTitleInput } from "@/components/common/InputText";

interface ImageInfo {
  url: string;
  originalName?: string;
  file?: File;
  toDelete?: boolean;  // 삭제 표시를 위한 필드 추가
}

interface PostData {
  title: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
  comments: { id: string; postId: string; author: string; content: string }[];
  images?: ImageInfo[];
}

interface AddPostProps {
  addPost: (post: any) => void;
  editPost: (post: any) => void;
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
    createdAt: new Date().toISOString(),
    likes: 0,
    comments: [],
    images: [],
  });
  
  useEffect(() => {
    if (isEdit && post_id) {
      const existingPost = posts.find((post) => post.id === post_id);
      if (existingPost) {
        setPostData({
          ...existingPost,
          images: existingPost.images?.map(image => ({
            url: image.url,
            originalName: image.originalName || image.url.split('/').pop()
          })) || [],
        });
      }
    }
  }, [isEdit, post_id, posts]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const newImages = await Promise.all(
        newFiles.map(async (file) => ({
          url: URL.createObjectURL(file),
          originalName: file.name,
          file
        }))
      );
      
      setPostData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...newImages]
      }));
    }
  };

  // 이미지 삭제 핸들러
  const handleImageDelete = (index: number) => {
    setPostData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || []
    }));
  };

  // 선택된 이미지 삭제 핸들러
  const handleSelectedImagesDelete = () => {
    setPostData(prev => ({
      ...prev,
      images: prev.images?.filter(img => !img.toDelete) || []
    }));
  };

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 제목이나 내용이 비어있는지 확인
    if (!postData.title.trim() || !postData.content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }
    
    const newPostId = isEdit ? post_id : (posts.length + 1).toString();
  
    const updatedPost = {
      ...postData,
      id: newPostId,
      images: postData.images?.map(img => ({
        url: img.file ? URL.createObjectURL(img.file) : img.url,
        originalName: img.originalName || img.file?.name
      })) || [],
    };
  
    if (isEdit) {
      editPost(updatedPost);
    } else {
      addPost(updatedPost);
    }
    
    navigate("/posts");
  };

  return (
    <Container>
      <Title>{isEdit ? "게시글 수정" : "글 작성하기"}</Title>
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
        <ImageUploadWrapper>
          <ImageUploadButton>
            <input
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              id="image-upload"
              onChange={handleFileUpload}
            />
            <label htmlFor="image-upload">+ 이미지 추가</label>
          </ImageUploadButton>
          {postData.images && postData.images.length > 0 && (
            <FileList>
              {postData.images.map((image, index) => (
                <FileItem key={index}>
                  <FileCheckbox>
                    <input
                      type="checkbox"
                      checked={image.toDelete}
                      onChange={(e) => {
                        const imagesCopy = [...(postData.images || [])];
                        imagesCopy[index] = { ...imagesCopy[index], toDelete: e.target.checked };
                        setPostData(prev => ({
                          ...prev,
                          images: imagesCopy
                        }));
                      }}
                    />
                  </FileCheckbox>
                  <FileInfo>
                    {image.originalName || image.file?.name}
                    {image.file && (
                      <FileSize>
                        ({(image.file.size / 1024 / 1024).toFixed(2)}MB)
                      </FileSize>
                    )}
                  </FileInfo>
                  <DeleteButton onClick={(e) => {
                    e.preventDefault();  // 폼 제출 방지
                    handleImageDelete(index);
                  }}>
                    ×
                  </DeleteButton>
                </FileItem>
              ))}
              {postData.images.some(img => img.toDelete) && (
                <DeleteSelectedButton
                  onClick={(e) => {
                    e.preventDefault();  // 폼 제출 방지
                    handleSelectedImagesDelete();
                  }}
                >
                  선택한 이미지 삭제
                </DeleteSelectedButton>
              )}
            </FileList>
          )}
        </ImageUploadWrapper>
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

const Container = styled.div`
  width: 100%;
  max-width: 800px;
  margin: auto;
  padding: 2rem;
  align-items: center;
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.heading.large.fontSize};
  font-family: ${({ theme }) => theme.font.family.title};
  font-weight: ${({ theme }) => theme.font.weight.bold};
  text-align: center;
  margin-bottom: 1rem;
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

const ImageUploadButton = styled.div`
  width: 100%;
  padding: 10px;
  background: ${({ theme }) => theme.color.input_background};
  color: ${({ theme }) => theme.color.input_text};
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  font-size: 1rem;
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

const ImageUploadWrapper = styled.div`
  width: 100%;
  max-width: 548px;
  margin: 0 auto;
`;

const FileList = styled.div`
  max-height: 200px;
  overflow-y: auto;
  margin-top: 10px;
  background: ${({ theme }) => theme.color.input_background};
  border-radius: 5px;
  padding: 10px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.color.input_background};
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.color.input_text};
    border-radius: 4px;
  }
`;

const FileItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background: white;
  border-radius: 4px;
  margin-bottom: 6px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.color.primary_black};
  flex: 1;
`;

const FileSize = styled.span`
  color: ${({ theme }) => theme.color.input_text};
  font-size: 0.8rem;
`;

const FileCheckbox = styled.div`
  display: flex;
  align-items: center;
  margin-right: 8px;

  input {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.color.primary_red};
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 4px;

  &:hover {
    color: ${({ theme }) => theme.color.primary_black};
  }
`;

const DeleteSelectedButton = styled.button`
  width: 100%;
  margin-top: 10px;
  padding: 8px;
  background: ${({ theme }) => theme.color.primary_red};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background: ${({ theme }) => theme.color.primary_black};
  }
`;