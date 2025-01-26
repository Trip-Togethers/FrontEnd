import { styled } from "styled-components";
import { ModalPlanButton, AddPostButton, WithdrawButton, JoinButton, CheckButton, EditButton, CreatePlanButton, DeleteButton, CancelButton, LoginButton } from '@/components/common/Button';
import { PostContentInput ,PostTitleInput,AddPlanInput, SearchInput ,EmailInput, PasswordInput, NicknameInput, ContactInput  } from "@/components/common/InputText" 


function Login() {
    return (
        <LoginStyle>
            <CreatePlanButton />
            <DeleteButton />
            <CancelButton />
            <LoginButton />
            <ModalPlanButton />
            <EditButton />
            <CheckButton />
            <JoinButton />
            <WithdrawButton />
            <AddPostButton />
            <EmailInput />
            <PasswordInput />
            <NicknameInput />
            <ContactInput />
            <SearchInput />
            <AddPlanInput />
            <PostTitleInput />
            <PostContentInput />
        </LoginStyle>
    );
}

const LoginStyle = styled.div`
`;

export default Login;