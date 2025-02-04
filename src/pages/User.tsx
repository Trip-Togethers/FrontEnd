import { useState } from 'react';
import { styled } from "styled-components";
import InputText from "@components/common/InputText";
import Button from "@components/common/Button";
import Avatar from "@assets/svg/Avatar";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useAlert } from "@hooks/useAlert";

interface UserFormData {
  password: string;
  newPassword: string;
  confirmPassword: string;
  email: string;
  nickname: string;
}

function User() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<UserFormData>();

  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();
  const showAlert = useAlert();

  const onVerifySubmit = (data: UserFormData) => {
    if (data.password === "a12341234") { // 테스트용
      setIsVerified(true);
    } else {
      showAlert("비밀번호가 일치하지 않습니다.");
    }
  };

  const onUpdateSubmit = (data: UserFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      showAlert("새 비밀번호가 일치하지 않습니다.");
      return;
    }
    showAlert("정보가 수정되었습니다.");
    navigate("/trips");
  };

  const handleWithdrawal = () => {
    if (window.confirm("정말로 회원탈퇴 하시겠습니까?")) {
      showAlert("회원탈퇴가 완료되었습니다.");
      navigate("/users/login");
    }
  };

  return (
    <UserPageStyle>
      <Container>  
          <Title>내 정보</Title>
          <Divider />
          <StyledAvatar />      
        <form onSubmit={handleSubmit(isVerified ? onUpdateSubmit : onVerifySubmit)}>
          <fieldset>
            <div className="input">
              {!isVerified ? (
                <>
                  <GuideText>내 정보를 확인하려면 현재 비밀번호를 입력해주세요</GuideText>
                  <InputText
                    scheme="mypage"
                    type="password"
                    placeholder="현재 비밀번호"
                    {...register("password", {
                      required: "비밀번호를 입력해주세요.",
                      pattern: {
                        value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                        message: "비밀번호는 8자리 이상의 영문과 숫자 조합이어야 합니다."
                      }
                    })}
                  />
                  <ErrorMessage errors={errors} name="password" as={ErrorTextStyle} />
                </>
              ) : (
                <>
                  <InputText
                    scheme="mypage"
                    type="text"
                    placeholder="닉네임"
                    {...register("nickname", {
                      required: "닉네임을 입력해주세요.",
                      pattern: {
                        value: /^[a-zA-Z가-힣]+$/,
                        message: "닉네임은 영문 또는 한글만 가능합니다."
                      }
                    })}
                  />
                  <ErrorMessage errors={errors} name="nickname" as={ErrorTextStyle} />

                  <InputText
                    scheme="mypage"
                    type="email"
                    value="test@example.com"
                    readOnly
                    placeholder="이메일"
                  />

                  <InputText
                    scheme="mypage"
                    type="password"
                    placeholder="새 비밀번호"
                    {...register("newPassword", {
                      required: "새 비밀번호를 입력해주세요.",
                      pattern: {
                        value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                        message: "비밀번호는 8자리 이상의 영문과 숫자 조합이어야 합니다."
                      }
                    })}
                  />
                  <ErrorMessage errors={errors} name="newPassword" as={ErrorTextStyle} />

                  <InputText
                      scheme="mypage"
                      type="password"
                      placeholder="새 비밀번호 확인"
                      {...register("confirmPassword", {
                        required: "비밀번호 확인을 입력해주세요.",
                        validate: (value) => 
                          value === watch("newPassword") || "비밀번호가 일치하지 않습니다."
                      })}
                    />
                    <ErrorMessage errors={errors} name="confirmPassword" as={ErrorTextStyle} />
                </>
              )}
            </div>
            <Button type="submit" scheme="primary">
              {isVerified ? "수정하기" : "확인"}
            </Button>
            {isVerified && (
              <WithdrawalSection>
                <WithdrawalButtonGroup>
                  <WithdrawalText>회원탈퇴 <br/> 계정의 모든 정보를 삭제합니다</WithdrawalText>
                    <StyledButton
                      scheme="alert"
                      type="button"
                      onClick={handleWithdrawal}>
                      회원탈퇴
                    </StyledButton>
                  </WithdrawalButtonGroup>
              </WithdrawalSection>
            )}
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


const StyledAvatar = styled(Avatar)`
  height: 30%;
  width: 30%;
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
    background-color: ${({theme}) => theme.color.primary_white};
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

