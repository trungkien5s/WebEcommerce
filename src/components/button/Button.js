import React from 'react';
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Button = ({
                    type = "button",
                    children,
                    className = "",
                    isLoading = false,
                    ...rest
                }) => {
    const child = !!isLoading ? (
        <div className="w-10 h-10 rounded-full border-4 border-gray-300 border-t-transparent animate-spin"></div>
    ) : (
        children
    );
    let defaultClassName = "p-4 text-base font-semibold text-white rounded-xl flex justify-center items-center min-h-[56px] ";

    switch (rest.kind) {
        case "primary":
            defaultClassName += "bg-primary text-white";
            break;
        case "secondary":
            defaultClassName += "bg-secondary text-white";
            break;

        case "ghost":
            defaultClassName += "rounded-lg border-2 border-purple-300 bg-purple-200 bg-opacity-50 text-purple-500";
            break;
        default:
            break;
    }

    if (rest.href)
        return (
            <Link to={rest.href} className={`${defaultClassName} ${className}`}>
                {child}
            </Link>
        );

    return (
        <button
            className={`${defaultClassName} ${isLoading ? "opacity-50  pointer-events-none" : ""} ${className}`}
            type={type}
            {...rest}
        >
            {child}
        </button>
    );
};

Button.propTypes = {
    type: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    isLoading: PropTypes.bool,
    href:PropTypes.string,
    kind:PropTypes.oneOf(["primary","secondary","ghost"])
};

export default Button;
