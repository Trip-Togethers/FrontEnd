import { styled } from "styled-components";
import Plane from "@assets/svg/Plane";
import Logo from "@assets/svg/Logo";
import { Google } from "@/assets/svg";
import { Link } from "react-router-dom";
import Button from "@/components/common/Button";
import InputText from "@/components/common/InputText";
import { useAlert } from "@/hooks/useAlert";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { login } from "@api/auth.api";
import { useAuthstore } from "@/store/authStore";

export interface LoginProps {
  email: string;
  password: string;
}

const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/auth? 
  client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}
  &redirect_uri=${import.meta.env.VITE_GOOGLE_REDIRECT_URI}
  &response_type=code
  &scope=email%20profile
  &access_type=offline`.replace(/\s+/g, ""); // 공백 제거

function Login() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginProps>();

  const navigate = useNavigate();
  const showAlert = useAlert();
  const { storeLogin } = useAuthstore();

  const onSubmit = (data: LoginProps) => {
    login(data).then(
      (res) => {
        storeLogin(res.token);
        navigate("/trips");
      },
      () => {
        showAlert("로그인이 실패했습니다.");
      }
    );
  };

  const handleGoogleLogin = () => {
    window.location.href = GOOGLE_AUTH_URL;
  };

  return (
    <LoginStyle>
      <Plane className="background-svg" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset>
          <Logo className="logo" />
          <div className="input">
            <InputText
              scheme="login"
              type="email"
              placeholder="이메일"
              {...register("email", {
                required: "이메일을 입력해주세요.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "유효한 이메일 형식을 입력해주세요.",
                },
              })}
            />
            <ErrorMessage errors={errors} name="email" as={ErrorTextStyle} />
            <InputText
              scheme="login"
              type="password"
              placeholder="비밀번호"
              {...register("password", {
                required: "비밀번호를 입력해주세요.",
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                  message:
                    "비밀번호는 8자리 이상의 영문과 숫자 조합이어야 합니다.",
                },
              })}
            />
            <ErrorMessage errors={errors} name="password" as={ErrorTextStyle} />
          </div>
          <Button type="submit" scheme="primary">
            로그인
          </Button>
          <div>
            <div className="hr-sect">또는 다음으로 로그인</div>
            <Google className="google" onClick={handleGoogleLogin} />
          </div>
          <StyledLink to="/users/register">회원가입</StyledLink>
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
    margin: 40px auto 40px;
  }

  .input {
    margin-bottom: 25px;
  }

  .hr-sect {
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.color.input_text};
    font-family: ${({ theme }) => theme.font.family.title};
    font-weight: ${({ theme }) => theme.font.weight.light};
    opacity: 0.4;
    margin: 25px 0 10px;
  }

  .hr-sect::before,
  .hr-sect::after {
    content: "";
    flex-grow: 1;
    background: ${({ theme }) => theme.color.input_text};
    height: 0.5px;
    font-size: 0px;
    line-height: 0px;
    margin: 0px 16px;
  }

  .google {
    height: 45px;
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

const StyledLink = styled(Link)`
  font-family: ${({ theme }) => theme.font.family.contents};
  color: ${({ theme }) => theme.color.primary_green};
  font-weight: ${({ theme }) => theme.font.weight.normal};
`;

export default Login;
