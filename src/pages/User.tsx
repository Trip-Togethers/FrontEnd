import { useEffect, useState } from "react";
import { styled } from "styled-components";
import InputText from "@components/common/InputText";
import Button from "@components/common/Button";
import Avatar from "@assets/svg/Avatar";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useAlert } from "@hooks/useAlert";
import { useAuthstore } from "@store/authStore";
import { editUser, userPage } from "@api/user.api";
import { jwtDecode } from "jwt-decode";
import { UserFormData } from "models/user.model";
import { getUserIdFromToken } from "@utils/get.token.utils";

function User() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<UserFormData>();
  const [userData, setUserData] = useState<UserFormData | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false); // 기존 정보 확인 상태
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // 사용자 정보 불러오기
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token"); // 로컬 스토리지에서 토큰 가져오기
      if (!token) {
        setError("로그인 정보가 없습니다.");
        setLoading(false);
        return;
      }

      const userId = getUserIdFromToken(token);
      if (!userId) {
        setError("유효하지 않은 토큰입니다.");
        setLoading(false);
        return;
      }

      try {
        const response = await userPage(userId); // userPage API 호출
        setUserData(response.user); // 응답 데이터에서 사용자 정보 저장
        setValue("email", response.user.email); // 이메일 값 설정
        setValue("nickname", response.user.nickname); // 닉네임 값 설정
        setLoading(false);
      } catch (error) {
        setError("유저 데이터를 가져오는 데 실패했습니다.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []); // 컴포넌트가 처음 렌더링될 때만 실행

  const onVerifySubmit = async (data: any) => {
    // 비밀번호 검증 로직을 추가할 수 있습니다.
    setIsVerified(true);
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

  const onUpdateSubmit = async (data: UserFormData) => {
    try {
      // 비밀번호 변경을 확인하는 로직
      if (data.newPassword !== data.confirmPassword) {
        setError("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
        return;
      }
      // userData가 null이 아닌지 확인
      if (!userData) {
        setError("사용자 정보를 불러오는 데 실패했습니다.");
        return;
      }
      const userId = Number(
        getUserIdFromToken(localStorage.getItem("token") || "")
      );
      // editUser 함수 호출하여 서버에 데이터 전송
      const response = await editUser(userId, {
        nickname: data.nickname,
        email: data.email,
        newPassword: data.newPassword,
      });

      // 수정 성공 시 성공 메시지나 피드백 표시
      alert("사용자 정보가 업데이트되었습니다.");
      setUserData(response.user); // 갱신된 사용자 정보 업데이트
      navigate("/trips"); // 수정 후 다른 페이지로 이동
    } catch (error) {
      setError("정보 수정에 실패했습니다.");
      console.log(error);
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <UserPageStyle>
      <Container>
        <Title>내 정보</Title>
        <Divider />
        <form
          onSubmit={handleSubmit(isVerified ? onUpdateSubmit : onVerifySubmit)}
        >
          <fieldset>
            <div className="input">
              {!isVerified ? (
                <>
                  <GuideText>
                    내 정보를 확인하려면 현재 비밀번호를 입력해주세요
                  </GuideText>
                  <InputText
                    scheme="mypage"
                    type="password"
                    placeholder="현재 비밀번호"
                    {...register("password", {
                      required: "비밀번호를 입력해주세요.",
                      pattern: {
                        value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                        message:
                          "비밀번호는 8자리 이상의 영문과 숫자 조합이어야 합니다.",
                      },
                    })}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="password"
                    as={ErrorTextStyle}
                  />
                </>
              ) : (
                <>
                  <StyledAvatar>
                    <div className="upload-box">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    {imagePreview ? (
                  <img src={imagePreview} alt="preview" />
                  ) : (
                    <Avatar />
                  )}
                    </div>
                  </StyledAvatar>
                  <InputText
                    scheme="mypage"
                    type="text"
                    placeholder="닉네임"
                    defaultValue={userData?.nickname || ""} // 초기값 설정
                    {...register("nickname", {
                      required: "닉네임을 입력해주세요.",
                      pattern: {
                        value: /^[a-zA-Z가-힣]+$/,
                        message: "닉네임은 영문 또는 한글만 가능합니다.",
                      },
                    })}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="nickname"
                    as={ErrorTextStyle}
                  />

                  <InputText
                    scheme="mypage"
                    type="email"
                    value={userData?.email || ""}
                    readOnly
                    placeholder="이메일"
                  />

                  <InputText
                    scheme="mypage"
                    type="password"
                    placeholder="새 비밀번호"
                    {...register("newPassword", {
                      pattern: {
                        value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                        message:
                          "비밀번호는 8자리 이상의 영문과 숫자 조합이어야 합니다.",
                      },
                    })}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="newPassword"
                    as={ErrorTextStyle}
                  />

                  <InputText
                    scheme="mypage"
                    type="password"
                    placeholder="새 비밀번호 확인"
                    {...register("confirmPassword", {
                      validate: (value) =>
                        value === watch("newPassword") ||
                        "비밀번호가 일치하지 않습니다.",
                    })}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="confirmPassword"
                    as={ErrorTextStyle}
                  />
                </>
              )}
            </div>

            <Button type="submit" scheme="primary">
              {isVerified ? "수정하기" : "확인"}
            </Button>
          </fieldset>
        </form>
      </Container>
    </UserPageStyle>
  );
}

export default User;

const Container = styled.div`
  width: 100%;
  max-width: 800px;
  height: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
  font-family: ${({ theme }) => theme.font.family.title};
`;

const Divider = styled.div`
  width: 100%;
  height: 2px;
  background-color: ${({ theme }) => theme.color.primary_green};
`;

const StyledAvatar = styled.div`
  height: 220px;  /* 원하는 고정 크기로 설정 */
  width: 220px;   /* width와 height를 동일하게 설정하여 원형 만들기 */
  display: flex;
  justify-content: center;
  align-items: center;

  .upload-box {
    position: relative;
    width: 100%;
    height: 100%;
    border: 1px dashed ${({ theme }) => theme.color.input_background};
    border-radius: 50%;  /* 동그라미 모양으로 설정 */
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background-color: ${({ theme }) => theme.color.input_background};

    &:hover {
      border-color: ${({ theme }) => theme.color.primary_green};
    }

    input {
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }
  }

  img {
    width: 100%;  /* 부모 요소 크기에 맞게 확장 */
    height: 100%; /* 부모 요소 크기에 맞게 확장 */
    object-fit: cover;  /* 이미지가 동그라미에 맞게 잘리도록 설정 */
    border-radius: 50%;  /* 이미지를 원형으로 만들기 */
  }
`;


const GuideText = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.color.primary_black};
  font-family: ${({ theme }) => theme.font.family.contents};
  margin-bottom: 1rem;
`;

const WithdrawalSection = styled.div`
  width: 100%;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.color.input_background};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
`;

const WithdrawalText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.color.input_text};
  margin: 0;
  text-align: center;
  font-family: ${({ theme }) => theme.font.family.contents};
`;

const WithdrawalButtonGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const StyledButton = styled(Button)`
  background-color: ${({ theme }) => theme.color.primary_white};
  color: ${({ theme }) => theme.color.input_text};
  border: none;
`;

const UserPageStyle = styled.div`
  margin-top: 1.5rem;
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  flex-direction: column;

  form {
    position: relative;
    width: 570px;
    border-radius: 14px;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;    
    flex-direction: column;
    text-align: center;
    background-color: ${({ theme }) => theme.color.primary_white};
    box-shadow: rgba(0, 0, 0, 0.25) 0px 4px 5px 0px;
  }

  fieldset {
    margin: 0 auto;
    border: none;
    width: 100%;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  .input {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 80%
    max-width: 400px; 
    align-items: center;

    input {
      width: 350px;
      height: 45px !important;
      font-size: 16px !important;
    }
  }
`;

const ErrorTextStyle = styled.p`
  margin: 0 10px;
  font-family: ${({ theme }) => theme.font.family.title};
  font-weight: ${({ theme }) => theme.font.weight.light};
  font-size: 1rem;
  color: ${({ theme }) => theme.color.primary_red};
  opacity: 0.7;
  text-align: left;
`;
