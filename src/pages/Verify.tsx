import { styled } from "styled-components";
import Plane from "@assets/svg/Plane";
import Logo from "@assets/svg/Logo";
import { Link } from "react-router-dom";
import Button from "@components/common/Button";
import InputText from "@components/common/InputText";
import { useAlert } from "@hooks/useAlert";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { verifyEmail } from "@api/auth.api";

export interface LoginProps {
  email: string;
  password: string;
  code: number;
}

function Verify() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginProps>();

  const navigate = useNavigate();
  const showAlert = useAlert();

  const onSubmit = async (data: LoginProps) => {
    try {
      const res = await verifyEmail(data.email, data.code);//BE Login 요청
      if (res.message == "이메일 인증 완료") {
        alert("이메일 인증이 완료되었습니다.")
        navigate("/users/login")
      } else {
        alert("이메일 인증이 완료되지 않았습니다.")
      }
    } catch (error) {
      showAlert("로그인이 실패했습니다.");
    }
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
            <br />
          
            <InputText
              scheme="login"
              placeholder="인증번호"
              {...register("code", {
                required: "인증번호를 입력해주세요.",
                pattern: {
                  value: /^[0-9]+$/, // 숫자만 허용하는 정규식
                  message: "숫자만 입력할 수 있습니다.",
                },
              })}
            />
            <ErrorMessage errors={errors} name="email" as={ErrorTextStyle} />
            <br />
          </div>
          <Button type="submit" scheme="primary">
            인증하기
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
    margin: 20px;
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

export default Verify;
