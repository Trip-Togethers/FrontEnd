import Login from "./pages/Login";
import AddPost from "./pages/AddPost";
import Board from "./pages/Board";
import Calendar from "./pages/Calendar";
import Detail from "./pages/Detail";
import Home from "./pages/Home";
import Join from "./pages/Join";
import Map from "./pages/Map";
import Post from "./pages/Post";
import User from "./pages/User";
import Error from "@common/Error";
import VerifyEmail from "./pages/VerifyEmail";
import { ThemeProvider } from "styled-components";
import { theme } from "./styles/theme";
import { GlobalStyle } from "./styles/global";
import Layout from "@components/layout/Layout";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    //로그인
    path: "/users/login",
    element: <Login />,
    errorElement: <Error />,
  },
  {
    //회원가입
    path: "/users/register",
    element: <Join />,
    errorElement: <Error />,
  },
  {
    //이메일 인증코드
    path: "/users/verify-email",
    element: <VerifyEmail />,
    errorElement: <Error />,
  },
  {
    //메인페이지
    path: "/trips",
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
    errorElement: <Error />,
  },
  {
    //상세페이지
    path: "/trips/:trip_id/activities",
    element: (
      <Layout>
        <Detail />
      </Layout>
    ),
    errorElement: <Error />,
  },
  {
    //지도
    path: "/maps",
    element: (
      <Layout>
        <Map />
      </Layout>
    ),
    errorElement: <Error />,
  },
  {
    //마이페이지
    path: "/users/:user_id",
    element: (
      <Layout>
        <User />
      </Layout>
    ),
    errorElement: <Error />,
  },
  {
    //커뮤니티
    path: "/posts",
    element: (
      <Layout>
        <Board />
      </Layout>
    ),
    errorElement: <Error />,
  },
  {
    //커뮤니티-글작성
    path: " /posts/:post_id",
    element: (
      <Layout>
        <AddPost />
      </Layout>
    ),
    errorElement: <Error />,
  },

  {
    //커뮤니티-글작성
    path: "/posts/new",
    element: (
      <Layout>
        <AddPost />
      </Layout>
    ),
    errorElement: <Error />,
  },
  {
    //커뮤니티 게시글 상세목록
    path: "/posts/:post_id",
    element: (
      <Layout>
        <Post />
      </Layout>
    ),
    errorElement: <Error />,
  },
  {
    // 커뮤니티 게시글 수정
    path: "/posts/edit/:post_id",
    element: (
      <Layout>
        <AddPost isEdit={true} />
      </Layout>
    ),
    errorElement: <Error />,
  },
  {
    //달력
    path: "/calendar/:user_id",
    element: (
      <Layout>
        <Calendar />
      </Layout>
    ),
    errorElement: <Error />,
  },
]);

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <RouterProvider router={router} />
      </ThemeProvider>
    </>
  );
}

export default App;
