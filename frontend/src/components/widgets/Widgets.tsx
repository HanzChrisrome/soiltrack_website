import React, { InputHTMLAttributes, ReactNode } from "react";
import CardContainer from "./CardContainer";

interface IconInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon: ReactNode;
  className?: string;
  inputClassName?: string;
  error?: string;
}

type SidebarProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  widthClass?: string;
};

type IconButtonProps = {
  icon?: React.ReactNode;
  label: React.ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  tabIndex?: number;
};

type TooltipIcon = {
  content: string;
  icon?: React.ReactNode;
  widthClass?: string; // Optional Tailwind width class, e.g., "w-40"
};

type TooltipIconButtonProps = {
  tooltip: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  tooltipRoundedClass?: string;
};

type SkeletonProps = {
  className?: string;
};

type ToggleSelectorProps = {
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
  className?: string;
  labelMap?: Record<string, string>;
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
  tooltipRoundedClass = "rounded",
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
      <span
        className={`absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-1 ${tooltipRoundedClass} bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10`}
      >
        {tooltip}
      </span>
    </div>
  );
};

export const TooltipIcon: React.FC<TooltipIcon> = ({
  content,
  icon,
  widthClass,
}) => {
  return (
    <div className="relative group inline-block">
      <div className="cursor-pointer text-neutral-500">{icon}</div>
      <div
        className={`absolute left-1/2 -translate-x-1/2 mt-2 ${
          widthClass || "w-max"
        } px-2 py-1 rounded bg-neutral-800 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity z-50 break-words whitespace-normal`}
      >
        {content}
      </div>
    </div>
  );
};

export const Skeleton = ({ className = "" }: SkeletonProps) => {
  return <div className={`animate-pulse bg-base-200 rounded ${className}`} />;
};

export const ToggleSelector = ({
  options,
  selected,
  onSelect,
  className = "",
  labelMap,
}: ToggleSelectorProps) => {
  return (
    <CardContainer
      padding="px-1 py-1"
      className={`flex flex-row items-center gap-1 bg-base-200 border-none rounded-xl ${className}`}
    >
      {options.map((option) => {
        const isSelected = option === selected;
        return isSelected ? (
          <CardContainer
            key={option}
            padding="px-3 py-1.5"
            className="text-sm text-neutral-800"
          >
            {" "}
            {labelMap?.[option] || option}{" "}
          </CardContainer>
        ) : (
          <div
            key={option}
            className="px-3 py-1 cursor-pointer"
            onClick={() => onSelect(option)}
          >
            <span className="text-sm text-neutral-500">
              {labelMap?.[option] || option}
            </span>
          </div>
        );
      })}
    </CardContainer>
  );
};

export const GreenToggleSelector = ({
  options,
  selected,
  onSelect,
  className = "",
  labelMap,
}: ToggleSelectorProps) => {
  return (
    <CardContainer
      padding="px-1 py-1"
      className={`flex flex-row items-center gap-1 bg-primary border-none rounded-xl ${className}`}
    >
      {options.map((option) => {
        const isSelected = option === selected;
        return isSelected ? (
          <CardContainer
            key={option}
            padding="px-3 py-1.5"
            className="text-sm text-primary"
          >
            {" "}
            {labelMap?.[option] || option}{" "}
          </CardContainer>
        ) : (
          <div
            key={option}
            className="px-3 py-1 cursor-pointer"
            onClick={() => onSelect(option)}
          >
            <span className="text-sm text-base-100">
              {labelMap?.[option] || option}
            </span>
          </div>
        );
      })}
    </CardContainer>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({
  visible,
  onClose,
  children,
  widthClass = "sm:w-[750px]",
}) => {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-50 transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      ></div>

      <div
        className={`fixed top-0 right-0 h-full w-full ${widthClass} bg-white shadow-lg z-50
        transform transition-transform duration-300
        ${visible ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-6 h-full overflow-y-auto">{children}</div>
      </div>
    </>
  );
};

export const IconInput: React.FC<IconInputProps> = ({
  icon,
  placeholder,
  type = "text",
  className = "",
  inputClassName = "",
  error = "",
  ...props
}) => {
  if (
    props.value !== undefined &&
    props.onChange === undefined &&
    !props.readOnly
  ) {
    console.warn(
      "Warning: You provided a `value` prop to IconInput without an `onChange` handler or `readOnly`. This will render a read-only input."
    );
  }

  return (
    <div className="flex flex-col gap-1 w-full">
      <div
        className={`flex items-center gap-2 px-4 py-3 bg-base-100 border rounded-lg ${
          error ? "border-red-500" : "border-base-300"
        } ${className}`}
      >
        <div className="text-base-content opacity-70">{icon}</div>
        <input
          {...props}
          type={type}
          placeholder={placeholder}
          className={`flex-1 bg-transparent outline-none text-md ${inputClassName} placeholder:text-base`}
        />
      </div>
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};
