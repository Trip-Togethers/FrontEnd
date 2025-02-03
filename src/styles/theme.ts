import "./font.css";

export type ColorKey =
  | "primary_green"
  | "primary_black"
  | "primary_white"
  | "primary_red"
  | "input_text"
  | "input_background"
  | "card_background"
  | "name_gray"
  | "calender_schedule"
  | "schedule_focus";
export type ButtonSize = "default";
export type ButtonScheme = "primary" | "alert" | "not_active";
export type Font = "default" | "contents" | "title";
export type FontWeight = "light" | "normal" | "bold";
export type Shadow = "default";
export type InputScheme = "login" | "mypage";

export interface Theme {
  color: Record<ColorKey, string>;
  button: {
    [key in ButtonSize]: {
      fontSize: string;
      padding: string;
    };
  };
  buttonScheme: {
    [key in ButtonScheme]: {
      color: string;
      backgroundColor: string;
    };
  };
  borderRadius: {
    default: string;
  };
  font: {
    family: Record<Font, string>;
    weight: {
      [key in FontWeight]: number;
    };
  };
  shadow: Record<Shadow, string>;
  inputScheme: {
    [key in InputScheme]: {
      width: string;
      height: string;
      fontSize: string;
    };
  };
}

export const theme: Theme = {
  color: {
    primary_green: "#006D24",
    primary_black: "#1F1F1F",
    primary_white: "#FFFFFF",
    primary_red: "#E70000",
    input_text: "#616161",
    input_background: "#E0E0E0",
    card_background: "#FDFDFA",
    name_gray: "#545454",
    calender_schedule: "#D9EFCE",
    schedule_focus: "#63C647",
  },
  button: {
    default: {
      fontSize: "1.13rem",
      padding: "0.5rem 1.3rem",
    },
  },
  buttonScheme: {
    primary: {
      color: "#FFFFFF",
      backgroundColor: "#006D24",
    },
    alert: {
      color: "#FFFFFF",
      backgroundColor: "#E70000",
    },
    not_active: {
      color: "#888888",
      backgroundColor: "#E0E0E0",
    },
  },
  borderRadius: {
    default: "5px",
  },
  font: {
    family: {
      default: "'BMJUA', sans-serif",
      contents: "'JalnanGothic', sans-serif",
      title: "'SBAggroB', sans-serif",
    },
    weight: {
      light: 300,
      normal: 400,
      bold: 700,
    },
  },
  shadow: {
    default: "0 4px 4px 0 #000000",
  },
  inputScheme: {
    login: {
      width: "340px",
      height: "42px",
      fontSize: "20px",
    },
    mypage: {
      width: "260px",
      height: "35px",
      fontSize: "16px",
    },
  },
};
