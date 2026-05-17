declare module "react-toggle-dark-mode" {
  import type { ButtonHTMLAttributes, CSSProperties, FC } from "react";

  export interface DarkModeSwitchProps
    extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "children"> {
    checked: boolean;
    onChange: (checked: boolean) => void;
    style?: CSSProperties;
    size?: number | string;
    moonColor?: string;
    sunColor?: string;
  }

  export const DarkModeSwitch: FC<DarkModeSwitchProps>;
}
