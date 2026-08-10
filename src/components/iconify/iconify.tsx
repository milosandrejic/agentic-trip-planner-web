import {
  SvgIcon,
  type SvgIconProps,
} from "@mui/material";

interface IconifyProps extends Omit<SvgIconProps, "fontSize"> {
  icon: typeof SvgIcon;
  size?: number;
}

export function Iconify({ icon: Icon, size = 20, style, ...props }: IconifyProps) {
  return (
    <Icon
      {...props}
      style={{
        ...style,
        flexShrink: 0,
        fontSize: size,
        height: size,
        width: size,
      }}
    />
  );
}
