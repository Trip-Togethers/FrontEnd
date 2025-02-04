import { styled } from "styled-components";
import Plane from "@assets/svg/Plane";
import Logo from "@assets/svg/Logo";
import Button from "@components/common/Button";
import InputText from "@components/common/InputText";
import { useAlert } from "@hooks/useAlert";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useAuthstore } from "@store/authStore";
import { useEmail } from "@store/authStore";
import { verifyEmail } from "@api/auth.api";

export interface VerifyProps {
  code: string;
}

function VerifyEmail() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyProps>();

  const email = useEmail((state) => state.email); // 전역 상태에서 이메일 가져오기

  const navigate = useNavigate();
  const showAlert = useAlert();
  const { isLoggedIn, storeLogin, storeLogout } = useAuthstore();

  const onSubmit = async (data: VerifyProps) => {
    try {
      const res = await verifyEmail(data.code); // API 요청
      showAlert("회원가입이 완료되었습니다.");
      navigate("/login"); // 로그인 페이지로 이동
    } catch (error) {
      showAlert("인증 코드가 올바르지 않습니다.");
      navigate("/users/register");
    }
  };

  return (
    <LoginStyle>
      <Plane className="background-svg" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset>
          <Logo className="logo" />
          <div className="input">
            <p>이메일 인증 코드를 입력하세요.</p>
            <InputText
              scheme="mypage"
              label="현재 이메일"
              value={email || ""}
              disabled
            />
            <br />
            <InputText
              scheme="mypage"
              label="인증코드"
              type="text"
              placeholder="인증코드"
              {...register("code", {
                required: "인증코드를 입력해주세요.",
              })}
            />
            <ErrorMessage errors={errors} name="code" as={ErrorTextStyle} />
          </div>
          <Button type="submit" scheme="primary">
            확인
          </Button>
        </fieldset>
      </form>
    </LoginStyle>
  );
}

const LoginStyle = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.color.primary_green};
  z-index: 0;

  p {
    font-size: 20px;
    font-family: ${({ theme }) => theme.font.family.contents};
    color: ${({ theme }) => theme.color.primary_black};
    margin-bottom: 50px;
  }

  .background-svg {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    object-fit: cover;
  }

  form {
    position: relative;
    width: 570px;
    height: 580px;
    border-radius: 14px;
    border: none;
    display: flex;
    flex-direction: column;
    text-align: center;
    background-color: ${({ theme }) => theme.color.primary_white};
    box-shadow: rgba(0, 0, 0, 0.25) 0px 4px 5px 0px;
  }

  fieldset {
    margin: 0 auto;
    border: none;
  }

  .logo {
    height: 42px;
    fill: ${({ theme }) => theme.color.primary_green};
    margin: 40px auto 20px;
  }

  .input {
    margin-bottom: 40px;
  }
`;

const ErrorTextStyle = styled.p`
  margin: 0 10px;
  font-family: ${({ theme }) => theme.font.family.title};
  font-weight: ${({ theme }) => theme.font.weight.light};
  font-size: 0.63rem;
  color: ${({ theme }) => theme.color.primary_red};
  opacity: 0.7;
  text-align: left;
`;

export default VerifyEmail;
