import React, { useState } from 'react';
import { styled } from "styled-components";
import { PasswordInput,EmailInput, NicknameInput } from "@/components/common/InputText";
import Button from "@/components/common/Button";
import Avatar from "@assets/svg/Avatar.tsx";
import { useParams } from 'react-router-dom';


interface UserInfo {
  nickname: string;
  email: string;
  currentPassword: string;
  newPassword: string;
}

function User() {
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    nickname: "참가자1 (유저 닉네임)",
    email: "triptogether@email.com",
    currentPassword: "",
    newPassword: "",
  });

  const { user_id } = useParams();
  console.log("Current user_id:", user_id);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError(false);
  };

  const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
	e.preventDefault();
	// "correctPassword" 대신 "0000"으로 변경
	if (password !== "0000") {
	  setError(true);
	} else {
	  setIsVerified(true);
	  setError(false);
	}
  };

  return (
    <UserStyle>
      <Container>
        <TitleWrapper>
          <Title>내 정보</Title>
          <Divider />
        </TitleWrapper>
        <AvatarWrapper>
          <StyledAvatar />
        </AvatarWrapper>

        {!isVerified ? (
          <Form onSubmit={handleSubmit}>
            <InputArea>
              <GuideText>내 정보를 확인하려면 현재 비밀번호를 입력해주세요</GuideText>
              <PasswordInput 
                value={password}
                onChange={handlePasswordChange}
                placeholder="현재 비밀번호"
              />
              {error && <ErrorMessage>비밀번호가 일치하지 않습니다</ErrorMessage>}
            </InputArea>
            <ButtonWrapper>
              <Button type="submit" scheme="primary">
                확인
              </Button>
            </ButtonWrapper>
          </Form>
        ) : (
			<UserInfoForm>
			<NicknameInput />
			<StyledEmailInput 
			  value={userInfo.email}
			  onChange={handleUserInfoChange}
			  name="email"
			  readOnly
			/>          			
			<PasswordInput placeholder='새 비밀번호'/>
			<PasswordInput placeholder='비밀번호 확인'/>
			<ButtonWrapper>
			  <Button type="button" scheme="primary">
				수정하기
			  </Button>
			</ButtonWrapper>

			<WithdrawalSection>
				<WithdrawalTitle>회원탈퇴</WithdrawalTitle>
				<WithdrawalButtonGroup>
				<WithdrawalText>계정의 모든 정보를 삭제합니다</WithdrawalText>
				<StyledButton type="button" scheme="alert" >
				회원탈퇴
				</StyledButton>
				</WithdrawalButtonGroup>
			</WithdrawalSection>
		  </UserInfoForm>
        )}
      </Container>
    </UserStyle>
  );
}

export default User;

const UserStyle = styled.div`
  font-family: ${({ theme }) => theme.font.family.default};
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const Container = styled.div`
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const TitleWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const Divider = styled.div`
  width: 100%;
  height: 2px;
  background-color: ${({ theme }) => theme.color.primary_green};
`;

const AvatarWrapper = styled.div`
  width: 30%;
  height: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.color.calender_schedule};
  margin: 20px 0;
`;

const StyledAvatar = styled(Avatar)`
  height: 100%;
  width: 100%;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputArea = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
   align-items: center; 
  gap: 10px;
`;

const GuideText = styled.p`
  color: #666;
  font-size: 14px;
  text-align: center;
  width: 100%;
  margin: 0;
  font-family: ${({ theme }) => theme.font.family.content};
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.color.primary_red};
  font-size: 14px;
  margin: 4px 0 0 0;
  font-family: ${({ theme }) => theme.font.family.content};
`;

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;

  > button {
    width: 100%;
  }
`;

const UserInfoForm = styled.div`
  width: 90%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 0;
  margin: 0 auto; 
  align-items: center;  
`;


const StyledEmailInput = styled(EmailInput)`
  background-color: ${({ theme }) => theme.color.primary_white};
  border: none;
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

const WithdrawalTitle = styled.h3`
  font-size: 16px;
  color: ${({ theme }) => theme.color.input_text};
  text-align: left;
  margin: 0;
`;

const WithdrawalText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.color.input_text};
  margin: 0;
  text-align: center;
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