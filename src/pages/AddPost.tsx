import { useState, useEffect, useRef } from "react";
import { styled } from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { connect, useSelector } from "react-redux";
import { addPost, showPost, updatePost, updatePostWithImage } from "@api/post.api";
import Button from "@components/common/Button";
import InputText from "@components/common/InputText";
import { ImageInfo, Plan, Post, RootState, Schedule } from "@store/store";
import { showPlans } from "@api/post.api";
import { getUserIdFromToken } from "@utils/get.token.utils";
import { getUserInfo, userPage } from "@api/user.api";
import { showPlan } from "@api/schedule.api";

function AddPost() {
  const navigate = useNavigate();
  const { postId } = useParams(); // URL에서 postId 가져오기
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState<Schedule[]>([]); // 일정 데이터 상태
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [title, setTitle] = useState(""); // 제목 상태
  const [content, setContent] = useState(""); // 내용 상태
  const [post, setPost] = useState<any>(null); // 게시글 상태
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // 데이터 가져오기 (게시글 수정 시 데이터 로드)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 게시글 데이터를 가져오는 API 호출 (예: getPostById)
        if (postId) {
          const postResponse = await showPost(Number(postId)); // postId로 게시글 조회
          console.log(postResponse.post.post.postPhotoUrl);
          if (postResponse && postResponse.post) {
            setPost(postResponse.post.post);
            setTitle(postResponse.post.post.postTitle); // 제목 상태 설정
            setContent(postResponse.post.post.postContent); // 내용 상태 설정
            if (postResponse.post.post.postPhotoUrl) {
              setImagePreview(postResponse.post.post.postPhotoUrl); // 이미지 미리보기 설정
            }
          }
        }
        // 일정 데이터 가져오기
        const scheduleResponse = await showPlan(); // 일정 데이터를 가져오는 API 호출
        if (Array.isArray(scheduleResponse.schedules)) {
          setData(scheduleResponse.schedules);
        } else {
          setError("데이터 형식이 잘못되었습니다.");
        }
      } catch (err) {
        setError("데이터를 가져오는 데 실패했습니다.");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [postId]); // postId가 바뀔 때마다 데이터를 다시 불러옴

  // 일정 클릭 시 선택된 일정 저장
  const handleScheduleClick = (schedule: Schedule) => {
    setSelectedSchedule(schedule); // 선택된 일정 상태 업데이트
    setIsModalOpen(false); // 모달 닫기
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 이미지 삭제 핸들러
  const handleImageDelete = () => {
    setSelectedImage(null); // 이미지 파일 삭제
    setImagePreview(null); // 미리보기 삭제
  };

  // 서버에 게시글 저장
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      let responseData;
      if (title) formData.append("postTitle", title);
      if (content) formData.append("postContent", content);
      
      if (selectedImage) {
        formData.append("image", selectedImage); // 이미지 추가
      } 

      if (selectedSchedule) {
        console.log(selectedSchedule.id.toString())
        formData.append('tripId', selectedSchedule.id.toString())
      }

      if (postId) {
        // 수정할 때
        responseData = await updatePostWithImage(Number(postId), formData);
        console.log("게시글 수정 성공:", responseData);
        navigate(`/posts/${postId}`); // 수정 후 상세 페이지로 이동
      } else {
        // 새로운 게시글 추가
        const postData = {
          title: title,
          content: content,
          image: selectedImage,
          author: "작성자",
          likes: 0,
          tripId: selectedSchedule ? selectedSchedule.id.toString() : "",
        };
        responseData = await addPost(postData);
        console.log("게시글 생성 성공:", responseData);
        navigate(`/posts}`); // 생성 후 상세 페이지로 이동
      }
    } catch (error) {
      console.error("게시글 처리 실패:", error);
    }
  };

  return (
    <Container>
      <Title>{postId ? "게시글 수정" : "글 작성하기"}</Title>
      <Form onSubmit={handleSubmit}>
        {/* 제목 입력 */}
        <AddPostTitleInput
          scheme="mypage"
          placeholder="제목을 입력하세요."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* 일정 추가 버튼 */}
        <ScheduleButton type="button" onClick={() => setIsModalOpen(true)}>
          + 일정 추가
        </ScheduleButton>

        {isModalOpen && data && (
          <PlanModals>
            <PlanList>
              {data.map((schedule) => (
                <PlanItem
                  key={schedule.id}
                  onClick={() => handleScheduleClick(schedule)}
                >
                  {schedule.title}
                  <hr />
                  <PlanTitle>{schedule.destination}</PlanTitle>
                  <PlanDate>
                    {new Date(schedule.startDate).toLocaleDateString()} -{" "}
                    {new Date(schedule.endDate).toLocaleDateString()}
                  </PlanDate>
                </PlanItem>
              ))}
            </PlanList>
            <CloseButton onClick={() => setIsModalOpen(false)}>닫기</CloseButton>
          </PlanModals>
        )}

        {/* 선택한 일정 정보 */}
        {selectedSchedule && (
          <SelectedSchedule>
            <h3>{selectedSchedule.title}</h3>
            <p>{selectedSchedule.destination}</p>
            <p>
              {new Date(selectedSchedule.startDate).toLocaleDateString()} -{" "}
              {new Date(selectedSchedule.endDate).toLocaleDateString()}
            </p>
          </SelectedSchedule>
        )}

        {/* 내용 입력 */}
        <AddPostContentInput
          scheme="mypage"
          placeholder="내용을 입력하세요."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* 이미지 업로드 */}
        <ImageUploadWrapper>
          <ImageUploadButton>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              id="image-upload"
              onChange={handleImageUpload}
            />
            <label htmlFor="image-upload">🖼️ + 이미지 추가</label>
          </ImageUploadButton>

          {/* 선택한 이미지 미리보기 및 삭제 */}
          {imagePreview && (
            <ImagePreviewWrapper>
              <ImagePreviewItem>
                <img src={imagePreview} alt="미리보기" width="100" />
                <DeleteButton onClick={handleImageDelete}>×</DeleteButton>
              </ImagePreviewItem>
            </ImagePreviewWrapper>
          )}
        </ImageUploadWrapper>

        {/* 제출 및 취소 버튼 그룹 */}
        <ButtonGroup>
          <Button type="submit" scheme="primary">
            완료
          </Button>
          <Button
            type="button"
            scheme="primary"
            onClick={() => navigate("/posts")}
          >
            취소
          </Button>
        </ButtonGroup>
      </Form>
    </Container>
  );
}

export default AddPost;

const ImagePreviewWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
  flex-wrap: wrap; /* 여러 줄로 표시 */
`;

const ImagePreviewItem = styled.div`
  position: relative;
  display: inline-block;
`;

const SelectedSchedule = styled.div`
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-family: ${({ theme }) => theme.font.family.default};

  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: bold;
    color: #333;
  }

  p {
    margin: 5px 0;
    font-size: 14px;
    color: #666;
  }

  p:first-child {
    margin-top: 10px;
  }
`;

const PlanModals = styled.div`
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -20%);
  background: white;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  z-index: 1000;
  width: 30%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const CloseButton = styled.button`
  background: #ddd;
  border: none;
  padding: 8px 12px;
  margin-top: 10px;
  cursor: pointer;
  font-family: ${({ theme }) => theme.font.family.default};
  display: block;
  margin: 10px auto 0;
  text-align: center;

  &:hover {
    background: #ccc;
  }
`;

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
