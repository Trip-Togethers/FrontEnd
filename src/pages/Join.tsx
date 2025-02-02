import { styled } from "styled-components";
import { Plane } from "@assets/svg";
import { Logo } from "@assets/svg";
import Button from "../components/common/Button";
import InputText from "@components/common/InputText";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../hooks/useAlert";
import { signup } from "@api/auth.api";
import { ErrorMessage } from "@hookform/error-message";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { checkEmail } from "@/api/checkEmail";

export interface RegisterProps {
  email: string;
  name: string;
  password: string;
  contact: string;
}

function Join() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<RegisterProps>();

  const navigate = useNavigate();
  const showAlert = useAlert();
  const [isEmailChecked, setIsEmailChecked] = useState(false);

  const onSubmit = (data: RegisterProps) => {
    signup(data).then((res) => {
      showAlert("회원가입이 완료되었습니다.");
      navigate("/users/login");
    });
  };

  const email = watch("email");

  const checkEmailDuplicate = () => {
    if (!email) {
      showAlert("이메일을 입력해주세요.");
      return;
    }

    checkEmail(email)
      .then((res) => {
        if (res.data.isAvailable) {
          showAlert("사용 가능한 이메일입니다.");
          setIsEmailChecked(true);
        } else {
          showAlert("이미 사용 중인 이메일입니다.");
          setIsEmailChecked(false);
        }
      })
      .catch(() => {
        showAlert("이메일 확인 중 오류가 발생했습니다.");
      });
  };

  return (
    <JoinStyle>
      <Plane className="background-svg" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset>
          <Logo className="logo" />
          <div className="input">
            <div className="emailbox">
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
              <button
                className="check"
                type="button"
                onClick={checkEmailDuplicate}
              >
                중복 확인
              </button>
            </div>
            <ErrorMessage errors={errors} name="email" as={ErrorTextStyle} />

            <InputText
              scheme="login"
              type="text"
              placeholder="닉네임"
              {...register("name", {
                required: "닉네임을 입력해주세요.",
                pattern: {
                  value: /^[a-zA-Z가-힣]+$/,
                  message: "닉네임은 영문 또는 한글만 가능합니다.",
                },
              })}
            />
            <ErrorMessage errors={errors} name="name" as={ErrorTextStyle} />

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

            <InputText
              scheme="login"
              type="tel"
              placeholder="연락처 (-없이 입력해주세요)"
              {...register("contact", {
                required: "연락처를 입력해주세요.",
                pattern: {
                  value: /^[0-9]{3}[0-9]{4}[0-9]{4}$/,
                  message: "연락처 양식을 지켜주세요.",
                },
              })}
            />
            <ErrorMessage errors={errors} name="contact" as={ErrorTextStyle} />
          </div>
          <Button type="submit" scheme="primary">
            회원가입
          </Button>
        </fieldset>
      </form>
    </JoinStyle>
  );
}

const JoinStyle = styled.div`
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

    .emailbox {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    .check {
      margin-top: 20px;
      position: absolute;
      font-family: ${({ theme }) => theme.font.family.contents};
      border: none;
      background-color: transparent;
      text-decoration: underline 1px ${({ theme }) => theme.color.primary_green};
      font: 14px;
      color: ${({ theme }) => theme.color.primary_green};
      opacity: 0.7;
      right: 40px;
      align-items: center;

      &:hover {
        opacity: 1;
      }
    }
  }
  .logo {
    height: 42px;
    fill: ${({ theme }) => theme.color.primary_green};
    margin: 40px auto 40px;
  }

  .input {
    margin-bottom: 50px;
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

export default Join;
