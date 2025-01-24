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
    // 기본 비밀번호를 '0000'으로 설정
    const defaultPassword = "0000";
  
    if (verifyPassword === defaultPassword || verifyPassword === "correctpassword") {
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
    placeholder="닉네임 입력"
  />
  {/* 닉네임 안내 메시지 */}
  <GuideText>닉네임은 영문 또는 한글만 가능합니다.</GuideText>
</FormGroup>

<FormGroup>
  <Label>이메일</Label>
  <DisabledInput value={userInfo.email} disabled />
</FormGroup>

<FormGroup>
  <Label>비밀번호</Label>
  <Input
    type="password"
    name="newPassword"
    value={userInfo.newPassword}
    onChange={handleInputChange}
    placeholder="새로운 비밀번호 입력"
  />
  <Input
    type="password"
    name="confirmPassword"
    value={userInfo.confirmPassword}
    onChange={handleInputChange}
    placeholder="비밀번호 확인"
    style={{ marginTop: '1rem' }} /* 두 인풋 사이에 간격 추가 */
  />
  {/* 비밀번호 안내 메시지 */}
  <GuideText>8자리 이상 영문과 숫자를 혼합하여 입력해주세요.</GuideText>
  {userInfo.newPassword &&
    userInfo.confirmPassword &&
    userInfo.newPassword !== userInfo.confirmPassword && (
      <ErrorText>비밀번호가 일치하지 않습니다.</ErrorText>
    )}
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

const Input = styled.input<{ error?: string }>`
  font-family: 'SBAggroB';
  padding: 0.75rem;
  border: 1px solid ${({ error }) => (error ? '#FF0000' : '#ddd')}; /* 에러 시 빨간 테두리 */
  background-color: #E0E0E0; /* 배경색 */
  border-radius: 4px;
  font-size: 1rem;
  color: #333; /* 입력 텍스트 색상 */
  position: relative;

  &::placeholder {
    color: #616161; /* 플레이스홀더 색상 */
  }

  &:focus {
    outline: none;
    border-color: ${({ error }) => (error ? '#FF0000' : '#006D24')}; /* 에러 시 빨간 테두리 */
  }
`;

const UserStyle = styled.div`
	font-family: 'BMJUA';
	max-width: 400px;
  	margin: 0 auto;
  	padding: 3rem;
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
  position: relative; /* 안내 메시지를 인풋 박스 안에 배치하기 위해 필요 */
`;

const Label = styled.label`
  font-family: 'JalnanGothic';
  font-weight: bold;
  color: #333;
`;

const DisabledInput = styled(Input)`
  font-family: 'SBAggroB';
  background-color: #f5f5f5;
  cursor: not-allowed;
`;

const GuideText = styled.div`
  font-size: 0.875rem;
  color: ${({ error }) => (error ? '#FF0000' : '#616161')}; /* 에러 시 빨간색 */
  position: static;
  margin-top: 0.5rem;
  top: 50%; /* 인풋 박스 중앙 정렬 */
  left: 1rem; /* 인풋 박스 안쪽 여백 */
  transform: translateY(-50%);
  pointer-events: none; /* 클릭 불가능하도록 설정 */
  white-space: nowrap; /* 텍스트 줄바꿈 방지 */
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