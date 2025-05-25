import React from "react";

type IconButtonProps = {
  icon?: React.ReactNode;
  label: React.ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  tabIndex?: number;
};

type TooltipIconButtonProps = {
  tooltip: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

export const Divider = ({ dashed = false, className = "" }) => {
  return (
    <div
      className={`border-b ${
        dashed ? "border-dashed" : "border-solid"
      } border-gray-300 ${className}`}
    />
  );
};

export const ReusableIconButton = ({
  icon,
  label,
  onClick,
  className = "",
  tabIndex = 0,
}: IconButtonProps) => {
  return (
    <button
      tabIndex={tabIndex}
      onClick={onClick}
      className={`btn btn-sm bg-base-100 border border-base-200 flex items-center gap-1 hover:bg-base-300 ${className}`}
    >
      {icon}
      {label}
    </button>
  );
};

export const TooltipIconButton: React.FC<TooltipIconButtonProps> = ({
  tooltip,
  children,
  onClick,
  className = "",
}) => {
  return (
    <div
      className={`relative group hover:cursor-pointer ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-center">
        {React.isValidElement(children)
          ? React.cloneElement(children as React.ReactElement, {
              className: `${
                (children as React.ReactElement).props.className || ""
              } text-neutral group-hover:text-white transition-colors`,
            })
          : children}
      </div>
      <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
        {tooltip}
      </span>
    </div>
  );
};
