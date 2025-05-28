import React from "react";
import { useController } from "react-hook-form";
import PropTypes from "prop-types";
import { withErrorBoundary } from "react-error-boundary";
import ErrorComponent from "../common/ErrorComponent";

const Input = (props) => {
    const {
        control,
        name,
        type,
        error = "",
        placeholder, // Đã sửa
        children,
        ...rest
    } = props;

    const { field } = useController({
        control,
        name,
        defaultValue: "",
    });

    console.log(error);

    return (
        <div className="relative">
            <input
                id={name}
                type={type}
                className={`w-full py-4 px-6 border rounded-xl text-m font-normal text-darkbg placeholder:text-text4 
          ${error && error.length > 0 ? "border-error text-red-400" : "border-strock text-text1"}
          ${children ? "pr-16" : ""}`}
                placeholder={placeholder} // Đã sửa
                {...rest}
                {...field}
            />
            {error && error.length > 0 && (
                <span className="font-medium text-sm text-error">{error}</span>
            )}
            {children && (
                <span className="absolute right-6 top-2/4 -translate-y-2/4 cursor-pointer select-none">
          {children}
        </span>
            )}
        </div>
    );
};

Input.propTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    control: PropTypes.any.isRequired,
    error: PropTypes.string,
    placeholder: PropTypes.string, // Đã thêm
};

export default withErrorBoundary(Input, {
    FallbackComponent: ErrorComponent,
});
