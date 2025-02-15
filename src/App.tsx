import Login from "./pages/Login";
import AddPost from "./pages/AddPost";
import Board from "./pages/Board";
import Detail from "./pages/Detail";
import Home from "./pages/Home";
import Join from "./pages/Join";
import Map from "./pages/Map";
import Posts from "./pages/Post";
import User from "./pages/User";
import Error from "@components/common/Error";
import VerifyEmail from "./pages/VerifyEmail";
import { ThemeProvider } from "styled-components";
import { theme } from "./styles/theme";
import { GlobalStyle } from "./styles/global";
import Layout from "@components/layout/Layout";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Calendars from "@pages/Calendar";
import { Provider } from "react-redux";
import store from "@store/store";
import InvitePage from "@pages/InvitePage";

const router = createBrowserRouter([
   // 기본 경로 접근 시 로그인 페이지로 리디렉션
  {
    path: "/",
    element: <Navigate to = '/users/login' replace />
  },
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
    path: "/trips/:tripId/activities",
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
    path: "/users/:userId",
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
    path: "/posts",
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
    path: "/posts/:postId",
    element: (
      <Layout>
        <Posts />
      </Layout>
    ),
    errorElement: <Error />,
  },
  {
    // 커뮤니티 게시글 수정
    path: "/posts/edit/:postId",
    element: (
      <Layout>
        <AddPost />
      </Layout>
    ),
    errorElement: <Error />,
  },
  {
    //달력
    //path: "/calendar/:userId",
    path: "/calendar",
    element: (
      <Layout>
        <Calendars />
      </Layout>
    ),
    errorElement: <Error />,
  },
  {
    // 초대 페이지
    path: "/trips/companions/:tripId/invite/:userId/:inviteCode",
    element: <InvitePage />,
    errorElement: <Error />,
  }
]);

function App() {
  return (
    <>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <RouterProvider router={router} />
        </ThemeProvider>
      </Provider>
    </>
  );
}

export default App;
