export type ColorKey = "primary_green"| "primary_black" | "primary_white" | "primary_red" | "input_text" |
"input_background" | "card_background" | "name_gray" | "calender_schedule" | "schedule_focus" ;
export type HeadingSize = "large" | "medium" | "small";
export type ButtonSize = "large" | "medium" | "small";
export type ButtonScheme = "primary" | "alert";
export type LayoutWidth = "large" | "medium" | "small";
export type Font = "default" | "contents" | "title";
export type FontWeight = "light" | "normal" | "bold";

interface Theme{
    color: Record<ColorKey, string>;
    heading : {
        [key in HeadingSize] : {
            fontSize: string;
        };
    };
    button : {
        [key in ButtonSize]: {
            fontSize : string;
            padding : string;
        }
    },
    buttonScheme: {
        [key in ButtonScheme]: {
            color: string;
            backgroundColor : string;
        }
    }
    borderRadius: {
        default : string;
    }
    layout: {
        width : {
            [key in LayoutWidth]: string;
        },
    }
    font: {
        family: Record<Font, string>;
        weight: {
            [key in FontWeight]: number;
        };
    };
};

export const theme : Theme = {
    color : {
        "primary_green": "#006D24",
        "primary_black": "#1F1F1F",
        "primary_white": "#FFFFFF",
        "primary_red": "#E70000",
        "input_text": "#616161",
        "input_background": "#E0E0E0",
        "card_background": "#FDFDFA",
        "name_gray" : "#545454",
        "calender_schedule" : "#D9EFCE",
        "schedule_focus" : "#63C647"
    },
    heading : {
        large : {
            fontSize: "2rem"
        },
        medium : {
            fontSize : "1.5rem"
        },
        small : {
            fontSize : "1rem"
        }
    },
    button: {
        large : {
            fontSize: "1.5rem",
            padding: "1rem 2rem"
        },
        medium : {
            fontSize : "1rem",
            padding: "0.5rem 1rem"
        },
        small : {
            fontSize : "0.75rem",
            padding: "0.25rem 0.5rem"
        },
    },
    buttonScheme : {
        primary: {
            color : "#FFFFFF",
            backgroundColor: "#006D24"
        },
        alert: {
            color : "#FFFFFF",
            backgroundColor : "#E70000"
        }
    },
    borderRadius: {
        default : "5px",
    },
    layout: {
        width: {
            large : "1020px",
            medium : "760px",
            small : "320px",
        },
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
        }
    }
};
