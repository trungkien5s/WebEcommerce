import React from 'react';
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { withErrorBoundary } from "react-error-boundary";
import ErrorComponent from "../common/ErrorComponent";

const LayoutAuthentication = (props) => {
    const { children, heading = "" } = props;

    return (
        <div className="flex flex-col md:flex-row w-full min-h-screen ">
            {/* Phần bên trái: Ảnh nền */}
            <div
                className="flex-1 bg-cover bg-center min-h-[40vh] md:min-h-screen"
                style={{ backgroundImage: `url('/signin.png')` }}
            >
            </div>

            {/* Phần bên phải: Form Sign In */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-10 overflow-y-hidden">
                <div className="w-full max-w-[556px] bg-white rounded-xl px-6 py-8 lg:px-16 lg:py-14 mx-auto dark:text-white">
                    {/* Logo */}

                    {/* Heading */}
                    <h1 className="leading-[66.60px] text-[#484848] text-[36px] md:text-[66.60px] text-center font-normal font-['Volkhov'] mb-5">
                        {heading}
                    </h1>

                    {/* Children (form hoặc nội dung) */}
                    {children}
                </div>
            </div>
        </div>
    );
};

LayoutAuthentication.propTypes = {
    heading: PropTypes.string,
    children: PropTypes.node,
};

export default withErrorBoundary(LayoutAuthentication, {
    FallbackComponent: ErrorComponent,
});
