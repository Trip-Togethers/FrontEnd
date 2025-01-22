import { useState } from "react";
import { styled } from "styled-components";
import '../styles/font.css'

interface UserInfo {
  nickname: string;
  email: string;
  newPassword: string;
  confirmPassword: string;
}

function User() {
  const [isVerified, setIsVerified] = useState(false);
  const [verifyPassword, setVerifyPassword] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const [userInfo, setUserInfo] = useState<UserInfo>({
    nickname: "",
    email: "current@email.com", // 현재 이메일
    newPassword: "",
    confirmPassword: "",
  });

  const handleVerifyPassword = () => {
    // TODO: 실제 비밀번호 검증 로직 구현
    if (verifyPassword === "correctpassword") {
      setIsVerified(true);
      setVerifyError("");
    } else {
      setVerifyError("비밀번호가 일치하지 않습니다.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleWithdrawal = () => {
    if (window.confirm("정말로 탈퇴하시겠습니까?")) {
      // TODO: 회원탈퇴 로직 구현
    }
  };

  const handleUpdate = () => {
    // TODO: 정보 업데이트 로직 구현
  };

  return (
    <UserStyle>
      {!isVerified ? (
        <VerificationContainer>
          <VerificationText>
            내 정보를 확인하려면 비밀번호를 입력해주세요.
          </VerificationText>
          <Input
            type="password"
            value={verifyPassword}
            onChange={(e) => setVerifyPassword(e.target.value)}
            placeholder="현재 비밀번호 입력"
          />
          {verifyError && <ErrorText>{verifyError}</ErrorText>}
          <Button onClick={handleVerifyPassword}>확인</Button>
        </VerificationContainer>
      ) : (
        <UserInfoContainer>
          <FormGroup>
            <Label>닉네임</Label>
            <Input
              type="text"
              name="nickname"
              value={userInfo.nickname}
              onChange={handleInputChange}
            />
            <GuideText>닉네임은 영문 또는 한글만 가능합니다.</GuideText>
          </FormGroup>

          <FormGroup>
            <Label>이메일</Label>
            <DisabledInput value={userInfo.email} disabled />
          </FormGroup>

          <FormGroup>
            <Label>새로운 비밀번호</Label>
            <Input
              type="password"
              name="newPassword"
              value={userInfo.newPassword}
              onChange={handleInputChange}
            />
            <GuideText>
              비밀번호는 8자리 이상 영문과 숫자를 혼합하여 입력해주세요.
            </GuideText>
          </FormGroup>

          <FormGroup>
            <Label>새로운 비밀번호 확인</Label>
            <Input
              type="password"
              name="confirmPassword"
              value={userInfo.confirmPassword}
              onChange={handleInputChange}
            />
          </FormGroup>

          <WithdrawalSection>
            <WithdrawalText>
              회원탈퇴
              <br />
              <small>계정의 모든 정보를 삭제합니다.</small>
            </WithdrawalText>
            <WithdrawalButton onClick={handleWithdrawal}>
              탈퇴하기
            </WithdrawalButton>
          </WithdrawalSection>

          <UpdateButton onClick={handleUpdate}>수정하기</UpdateButton>
        </UserInfoContainer>
      )}
    </UserStyle>
  );
}

const UserStyle = styled.div`
	font-family: 'BMJUA';
	max-width: 600px;
  	margin: 0 auto;
  	padding: 2rem;
`;

const VerificationContainer = styled.div`
  font-family: 'BMJUA';
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  margin-top: 2rem;
`;

const VerificationText = styled.p`
  font-family: 'JalnanGothic';
  font-size: 1.1rem;
  color: #333;
`;

const UserInfoContainer = styled.div`
  font-family: 'JalnanGothic';
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const FormGroup = styled.div`
  font-family: 'JalnanGothic';
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-family: 'JalnanGothic';
  font-weight: bold;
  color: #333;
`;

const Input = styled.input`
  font-family: 'SBAggroB';
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #006D24;
  }
`;

const DisabledInput = styled(Input)`
  font-family: 'SBAggroB';
  background-color: #f5f5f5;
  cursor: not-allowed;
`;

const GuideText = styled.p`
  font-family: 'SBAggroB';
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.25rem;
`;

const ErrorText = styled.p`
  font-family: 'BMJUA';
  color: #ff0000;
  font-size: 0.9rem;
`;

const Button = styled.button`
  font-family: 'BMJUA';
  padding: 0.75rem 2rem;
  background-color: #006D24;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #005D1F;
  }
`;

const WithdrawalSection = styled.div`
  font-family: 'BMJUA';
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  border-top: 1px solid #ddd;
`;

const WithdrawalText = styled.p`
  font-family: 'JalnanGothic';
  color: #666;
  text-decoration: underline;

  small {
    color: #999;
    text-decoration: none;
  }
`;

const WithdrawalButton = styled(Button)`
  font-family: 'JalnanGothic';
  background-color: #dc3545;

  &:hover {
    background-color: #c82333;
  }
`;

const UpdateButton = styled(Button)`
  font-family: 'JalnanGothic';
  margin-top: 2rem;
`;

export default User;