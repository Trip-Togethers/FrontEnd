interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  createdAt: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
  comments: Comment[];
}

interface PostState {
  posts: Post[];
}

// Action Types
export const ADD_POST = 'ADD_POST';
export const DELETE_POST = 'DELETE_POST';
export const LIKE_POST = 'LIKE_POST';
export const ADD_COMMENT = 'ADD_COMMENT';
export const EDIT_POST = "EDIT_POST";

// Action Creators
export const addPost = (post: Post) => ({
  type: ADD_POST,
  payload: post
});

export const deletePost = (id: string) => ({
  type: DELETE_POST,
  payload: id
});

export const likePost = (id: string) => ({
  type: LIKE_POST,
  payload: id
});

export const addComment = (comment: Comment) => ({
  type: ADD_COMMENT,
  payload: comment
});

export const editPost = (post: Post) => ({
  type: EDIT_POST,
  payload: post
});

// Load initial state from localStorage
const loadState = (): PostState => {
  const savedPosts = localStorage.getItem("posts");
  return savedPosts ? { posts: JSON.parse(savedPosts) } : { posts: [] };
};

// Reducer
const postReducer = (state = loadState(), action: any): PostState => {
  let newState;
  
  switch (action.type) {
    case ADD_POST:
      newState = {
        ...state,
        posts: [{ ...action.payload, comments: action.payload.comments ?? [] }, ...state.posts],
      };
      break;

      case DELETE_POST: {  // 중괄호 추가
        const filteredPosts = state.posts.filter(post => post.id !== action.payload);
        const reindexedPosts = filteredPosts.map((post, index) => ({
          ...post,
          id: (index + 1).toString()
        }));
        
        newState = {
          ...state,
          posts: reindexedPosts,  // reindexedPosts 사용
        };
        break; }

      case LIKE_POST:
      newState = {
        ...state,
        posts: state.posts.map(post =>
          post.id === action.payload ? { ...post, likes: post.likes + 1 } : post
        ),
      };
      break;

    case ADD_COMMENT:
      newState = {
        ...state,
        posts: state.posts.map(post =>
          post.id === action.payload.postId
            ? { ...post, comments: [...post.comments, action.payload] }
            : post
        ),
      };
      break;

      case EDIT_POST:
        newState = {
          ...state,
          posts: state.posts.map(post =>
            post.id === action.payload.id ? action.payload : post
          ),
        };
        break;
      
    default:
      return state;
  }

  localStorage.setItem("posts", JSON.stringify(newState.posts));
  return newState;
};



export default postReducer;
