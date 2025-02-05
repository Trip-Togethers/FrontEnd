import { Plan, PlanState } from './store';
import { Action } from '@reduxjs/toolkit';

export const ADD_PLAN = "ADD_PLAN";
export const DELETE_PLAN = "DELETE_PLAN";

type PlanAction =
  | { type: typeof ADD_PLAN; payload: Plan }
  | { type: typeof DELETE_PLAN; payload: string };

  type UnknownAction = Action<string> & {
    [key: string]: unknown;
  };
  type AllPlanActions = PlanAction | UnknownAction;

  export function addPlan(plan: Plan): PlanAction {
    return { type: ADD_PLAN, payload: plan };
}

export function deletePlan(id: string) {
  return { type: DELETE_PLAN, payload: id } as const;
}

const initialState: PlanState = {
  plans: JSON.parse(localStorage.getItem("plans") || "[]"),
};


function isPlan(value: unknown): value is Plan {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'title' in value &&
    'startDate' in value &&
    'endDate' in value
  );
}
export function planReducer(
  state: PlanState = initialState,
  action: AllPlanActions
): PlanState {
  let newState = state;

  switch (action.type) {
    case ADD_PLAN: {
      if ('payload' in action && isPlan(action.payload)) {
        newState = {
          ...state,
          plans: [...state.plans, action.payload].sort(
            (a, b) =>
              new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          ),
        };
        localStorage.setItem("plans", JSON.stringify(newState.plans));
      }
      return newState;
    }

    case DELETE_PLAN: {
      if ('payload' in action && typeof action.payload === 'string') {
        newState = {
          ...state,
          plans: state.plans.filter((plan) => plan.id !== action.payload),
        };
        localStorage.setItem("plans", JSON.stringify(newState.plans));
      }
      return newState;
    }

    default:
      return state;
  }
}

export type { Plan };