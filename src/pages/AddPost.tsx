import React, { useState, useEffect } from "react";
import { styled } from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { connect, useSelector } from "react-redux";
import { addPost, editPost } from "@/store/postReducer";
import Button from "@/components/common/Button";
import InputText from "@/components/common/InputText";
import { ImageInfo, Plan, Post, RootState } from "@/store/store";


//  인터페이스 정의
interface CommentType {
  id: string;
  postId: string;
  author: string;
  content: string;
  createdAt: string;
}

interface PostData {
  title: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
  comments: CommentType[];
  images?: ImageInfo[];
  planId?: string;
  planInfo?: Plan;
}

interface AddPostProps {
  addPost: typeof addPost;
  editPost: typeof editPost;
  posts: Post[];
  isEdit?: boolean;
}

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}


  //  일정 선택 모달 컴포넌트 (PlanModal)
  //  일정 선택을 위한 모달 컴포넌트
const PlanModal: React.FC<PlanModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        {children}
      </ModalContent>
    </ModalOverlay>
  );
};

  //  게시글 추가 및 수정 컴포넌트 (AddPost)
  //  - 제목, 내용, 이미지 업로드, 일정 선택 등의 기능 제공
  //  - 수정 모드일 경우 기존 데이터를 불러와서 편집 가능

function AddPost({ addPost, posts, isEdit, editPost }: AddPostProps) {
  const navigate = useNavigate();
  const { post_id } = useParams<{ post_id: string }>();

  // 일정 모달 노출 상태 관리
  const [showPlanModal, setShowPlanModal] = useState(false);
  // redux에서 일정 데이터를 가져옴
  const plans = useSelector((state: RootState) => state.plan.plans);

  // 게시글 데이터 상태 초기화
  const [postData, setPostData] = useState<PostData>({
    title: "",
    content: "",
    author: "익명",
    createdAt: new Date().toISOString(),
    likes: 0,
    comments: [],
    images: [],
  });

  // 수정 모드일 때 기존 게시글 데이터 로드
  useEffect(() => {
    if (isEdit && post_id) {
      const existingPost = posts.find((post) => post.id === post_id);
      if (existingPost) {
        setPostData({
          ...existingPost,
          comments: existingPost.comments.map((comment) => ({
            id: comment.id,
            postId: comment.postId,
            author: comment.author,
            content: comment.content,
            createdAt: "createdAt" in comment ? comment.createdAt : new Date().toISOString(),
          })),
          images:
            existingPost.images?.map((image: ImageInfo) => ({
              url: image.url,
              originalName: image.originalName || image.url.split("/").pop(),
              file: image.file,
              toDelete: image.toDelete,
            })) || [],
        });
      }
    }
  }, [isEdit, post_id, posts]);

   //  일정 선택 버튼 클릭 핸들러
  const handleScheduleClick = () => {
    setShowPlanModal(true);
  };


   //  일정 선택 시 해당 일정 정보를 게시글 데이터에 반영
  const handleSelectPlan = (plan: Plan) => {
    setPostData((prev) => ({
      ...prev,
      planId: plan.id,
      planInfo: plan,
      content: `${prev.content}\n\n[여행 일정]\n${plan.title}\n기간: ${new Date(
        plan.startDate
      ).toLocaleDateString()} - ${new Date(plan.endDate).toLocaleDateString()}`,
    }));
    setShowPlanModal(false);
  };

    // 이미지 파일 업로드 핸들러
   //  - 선택한 파일들을 이미지 미리보기 URL과 함께 상태에 저장
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const newImages = await Promise.all(
        newFiles.map(async (file) => ({
          url: URL.createObjectURL(file),
          originalName: file.name,
          file,
        }))
      );
      setPostData((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...newImages],
      }));
    }
  };

    // 개별 이미지 삭제 핸들러
  const handleImageDelete = (index: number) => {
    setPostData((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || [],
    }));
  };


   //  선택된(체크된) 이미지 삭제 핸들러
  const handleSelectedImagesDelete = () => {
    setPostData((prev) => ({
      ...prev,
      images: prev.images?.filter((img) => !img.toDelete) || [],
    }));
  };

    // 폼 제출 핸들러 (게시글 저장/수정)
    //  - 제목과 내용 필수 체크
    // - 수정모드이면 기존 게시글 수정, 아니면 새 게시글 추가

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postData.title.trim() || !postData.content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    // 수정모드이면 기존 post_id 사용, 아니면 새 id 생성
    const newPostId = isEdit && post_id ? post_id : (posts.length + 1).toString();

    const updatedPost = {
      ...postData,
      id: newPostId,
      // 이미지 데이터 재정의: file이 있을 경우 URL 재생성, 없으면 기존 url 사용
      images:
        postData.images?.map((img) => ({
          url: img.file ? URL.createObjectURL(img.file) : img.url,
          originalName: img.originalName || img.file?.name || "",
        })) || [],
      // 댓글 데이터에 생성일자가 없으면 현재 시간 적용
      comments: postData.comments.map((comment) => ({
        ...comment,
        createdAt: comment.createdAt || new Date().toISOString(),
      })),
    };

    if (isEdit) {
      editPost(updatedPost);
    } else {
      addPost(updatedPost);
    }
    navigate("/posts");
  };

    // JSX 렌더링
    // 제목, 내용 입력창, 일정 추가 버튼, 이미지 업로드, 제출/취소 버튼, 일정 선택 모달
  return (
    <Container>
      <Title>{isEdit ? "게시글 수정" : "글 작성하기"}</Title>
      <Form onSubmit={handleSubmit}>
        {/* 제목 입력 */}
        <AddPostTitleInput
          scheme="mypage"
          placeholder="제목을 입력하세요."
          name="title"
          value={postData.title}
          onChange={(e) => setPostData({ ...postData, title: e.target.value })}
        />

        {/* 일정 추가 버튼 및 선택된 일정 표시 */}
        <ScheduleButton type="button" onClick={handleScheduleClick}>
          + 일정 추가
        </ScheduleButton>
        {postData.planInfo && (
          <SelectedPlan>
            <PlanTitle>{postData.planInfo.title}</PlanTitle>
            <PlanDate>
              {new Date(postData.planInfo.startDate).toLocaleDateString()} -{" "}
              {new Date(postData.planInfo.endDate).toLocaleDateString()}
            </PlanDate>
            <RemovePlanButton
              onClick={() =>
                setPostData((prev) => ({
                  ...prev,
                  planId: undefined,
                  planInfo: undefined,
                }))
              }
            >
              ×
            </RemovePlanButton>
          </SelectedPlan>
        )}

        {/* 내용 입력 */}
        <AddPostContentInput
          scheme="mypage"
          name="content"
          value={postData.content}
          onChange={(e) => setPostData({ ...postData, content: e.target.value })}
        />

        {/* 이미지 업로드 영역 */}
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
            <label htmlFor="image-upload">🖼️ + 이미지 추가</label>
          </ImageUploadButton>
          {postData.images && postData.images.length > 0 && (
            <FileList>
              {postData.images.map((image, index) => (
                <FileItem key={index}>
                  <FileCheckbox>
                    <input
                      type="checkbox"
                      checked={image.toDelete || false}
                      onChange={(e) => {
                        const imagesCopy = [...(postData.images || [])];
                        imagesCopy[index] = {
                          ...imagesCopy[index],
                          toDelete: e.target.checked,
                        };
                        setPostData((prev) => ({
                          ...prev,
                          images: imagesCopy,
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
                  <DeleteButton
                    onClick={(e) => {
                      e.preventDefault();
                      handleImageDelete(index);
                    }}
                  >
                    ×
                  </DeleteButton>
                </FileItem>
              ))}
              {postData.images.some((img) => img.toDelete) && (
                <DeleteSelectedButton
                  onClick={(e) => {
                    e.preventDefault();
                    handleSelectedImagesDelete();
                  }}
                >
                  선택한 이미지 삭제
                </DeleteSelectedButton>
              )}
            </FileList>
          )}
        </ImageUploadWrapper>

        {/* 제출 및 취소 버튼 그룹 */}
        <ButtonGroup>
          <Button type="submit" scheme="primary">
            {isEdit ? "수정 완료" : "완료"}
          </Button>
          <Button type="button" scheme="primary" onClick={() => navigate("/posts")}>
            취소
          </Button>
        </ButtonGroup>

        {/* 일정 선택 모달 */}
        <PlanModal isOpen={showPlanModal} onClose={() => setShowPlanModal(false)}>
          <ModalHeader>일정 선택</ModalHeader>
          <PlanList>
            {plans.length === 0 ? (
              <NoPlanMessage>등록된 일정이 없습니다.</NoPlanMessage>
            ) : (
              plans.map((plan: Plan) => (
                <PlanItem key={plan.id} onClick={() => handleSelectPlan(plan)}>
                  <h4>{plan.title}</h4>
                  <p>
                    {new Date(plan.startDate).toLocaleDateString()} -{" "}
                    {new Date(plan.endDate).toLocaleDateString()}
                  </p>
                </PlanItem>
              ))
            )}
          </PlanList>
        </PlanModal>
      </Form>
    </Container>
  );
}


  // Redux connect 설정
export default connect(
  (state: RootState) => ({
    posts: state.post.posts,
    plans: state.plan.plans,
  }),
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
  font-size: 2rem;
  font-family: ${({ theme }) => theme.font.family.title};
  font-weight: ${({ theme }) => theme.font.weight.bold};
  text-align: center;
  margin-bottom: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 0 auto;
  align-items: stretch;
  width: 100%;
`;

// 제목 입력 스타일
const AddPostTitleInput = styled(InputText)`
  font-size: 1rem;
  padding: 1rem;
  border-radius: 0;
  width: 100% !important;
  max-width: 100%;
  display: block;
  height: 3rem;
  color: ${({ theme }) => theme.color.primary_black};
  background-color: ${({ theme }) => theme.color.primary_white};
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.color.primary_black};
  font-family: ${({ theme }) => theme.font.family.title};
`;

// 내용 입력 스타일 (textarea로 변환)
const AddPostContentInput = styled(InputText).attrs({ as: "textarea" })`
  border: 1px solid ${({ theme }) => theme.color.primary_black};
  font-size: 1rem;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.default};
  width: 100% !important;
  max-width: 100%;
  display: block;
  height: 400px;
  font-family: ${({ theme }) => theme.font.family.contents};
  background-color: ${({ theme }) => theme.color.primary_white};
  white-space: pre-wrap;
  word-wrap: break-word;
  resize: none;
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
  margin-left: 0;

  &:hover {
    background: ${({ theme }) => theme.color.primary_green};
    color: white;
  }
`;

const ImageUploadWrapper = styled.div`
  width: 100%;
  margin: 0 auto;
`;

const ImageUploadButton = styled.div`
  width: 100%;
  padding: 10px;
  background: ${({ theme }) => theme.color.input_background};
  color: ${({ theme }) => theme.color.input_text};
  border-radius: 5px;
  cursor: pointer;
  text-align: left;
  font-size: 1.25rem;
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

const FileList = styled.div`
  max-height: 200px;
  overflow-y: auto;
  margin-top: 10px;
  background: ${({ theme }) => theme.color.input_background};
  font-family: ${({ theme }) => theme.font.family.contents};
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
  font-family: ${({ theme }) => theme.font.family.contents};

  &:last-child {
    margin-bottom: 0;
  }
`;

const FileCheckbox = styled.div`
  display: flex;
  align-items: center;
  margin-right: 8px;
  font-family: ${({ theme }) => theme.font.family.contents};

  input {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.color.primary_black};
  font-family: ${({ theme }) => theme.font.family.contents};
  flex: 1;
`;

const FileSize = styled.span`
  color: ${({ theme }) => theme.color.input_text};
  font-family: ${({ theme }) => theme.font.family.contents};
  font-size: 0.8rem;
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

/* ---------------------- 모달 관련 스타일 ---------------------- */

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.h3`
  margin: 0 0 1rem 0;
  font-family: ${({ theme }) => theme.font.family.title};
`;

/* ---------------------- 일정 리스트 및 아이템 스타일 ---------------------- */
const PlanList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-family: ${({ theme }) => theme.font.family.contents};
  max-height: 300px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.color.input_background};
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.color.primary_green};
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.color.primary_black};
  }
`;

const PlanItem = styled.div`
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.color.input_background};
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.color.input_background};
  }

  h4 {
    margin: 0 0 0.5rem 0;
    font-family: ${({ theme }) => theme.font.family.title};
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.color.input_text};
    font-size: 0.9rem;
  }
`;

const SelectedPlan = styled.div`
  position: relative;
  background: ${({ theme }) => theme.color.schedule_focus};
  padding: 1rem;
  border-radius: 5px;
  margin-left: 0;
`;

const PlanTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  font-family: ${({ theme }) => theme.font.family.title};
  padding-right: 2rem;
  color: ${({ theme }) => theme.color.primary_black};
`;

const PlanDate = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.color.primary_black};
  font-family: ${({ theme }) => theme.font.family.title};
  font-size: 1rem;
`;

const RemovePlanButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.color.primary_red};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.color.primary_black};
  }
`;

const NoPlanMessage = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.color.input_text};
  padding: 2rem;
`;
