// Plan 인터페이스는 그대로 유지
export interface Plan {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  imageUrl?: string;
}

// Action Types와 Interfaces는 그대로 유지
export const ADD_PLAN = 'ADD_PLAN';
export const DELETE_PLAN = 'DELETE_PLAN';

interface AddPlanAction {
  type: typeof ADD_PLAN;
  payload: Plan;
}

interface DeletePlanAction {
  type: typeof DELETE_PLAN;
  payload: string;
}

export type PlanActionTypes = AddPlanAction | DeletePlanAction;

// Action Creators는 그대로 유지
export const addPlan = (plan: Plan): AddPlanAction => ({
  type: ADD_PLAN,
  payload: plan,
});

export const deletePlan = (id: string): DeletePlanAction => ({
  type: DELETE_PLAN,
  payload: id,
});

// State Interface 수정
interface PlanState {
  plans: Plan[];
}

// RootState와 일치하는 초기 상태로 수정
const initialState = {
  plans: {
    plans: []
  }
};

// RootState 타입 정의
export interface RootState {
  plans: {
    plans: Plan[]
  }
}

// Reducer 수정
const planReducer = (
  state = initialState,
  action: PlanActionTypes
) => {
  switch (action.type) {
    case ADD_PLAN:
      return {
        plans: {
          plans: [...state.plans.plans, action.payload]
        }
      };
    case DELETE_PLAN:
      return {
        plans: {
          plans: state.plans.plans.filter((plan) => plan.id !== action.payload)
        }
      };
    default:
      return state;
  }
};

export default planReducer;