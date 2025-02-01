interface Plan {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    image?: string;
  }
  
  interface PlanState {
    plans: Plan[];
  }
  
  // Action 타입 정의
  type PlanAction = 
    | { type: 'ADD_PLAN'; payload: Plan }
    | { type: 'DELETE_PLAN'; payload: string };
  
  // 액션 타입 상수
  export const ADD_PLAN = 'ADD_PLAN';
  export const DELETE_PLAN = 'DELETE_PLAN';
  
  // 액션 생성자
  export const addPlan = (plan: Plan) => ({
    type: ADD_PLAN,
    payload: plan
  });
  
  export const deletePlan = (id: string) => ({
    type: DELETE_PLAN,
    payload: id
  });
  
  // 초기 상태
  const initialState: PlanState = {
    plans: JSON.parse(localStorage.getItem('plans') || '[]')
  };
  
  // 리듀서
  export const planReducer = (
    state: PlanState = initialState,
    action: PlanAction
): PlanState => {
    let newState: PlanState;

    switch (action.type) {
        case ADD_PLAN: {  
            newState = {
                ...state,
                plans: [...state.plans, action.payload].sort(
                  (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
                )
            };
            localStorage.setItem('plans', JSON.stringify(newState.plans));
            return newState;
        }

        case DELETE_PLAN: {  
            newState = {
                ...state,
                plans: state.plans.filter(plan => plan.id !== action.payload)
            };
            localStorage.setItem('plans', JSON.stringify(newState.plans));
            return newState;
        }

        default:
            return state;
    }
};
  
  export type { Plan, PlanState };