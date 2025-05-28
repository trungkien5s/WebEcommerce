import React, { useState } from "react";
import LayoutAuthentication from "../../components/layout/LayoutAuthentication";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Label } from "../../components/label";
import { Input } from "../../components/input";
import FormGroup from "../../components/common/FormGroup";
import useToggleValue from "../../components/hooks/useToogleValue";
import { Button } from "../../components/button";
import IconEyeToggle from "../../components/icons/IconEyeToggle";
import axios from "axios";
import {ecommerceAPI} from "../../config/config";
// import GoogleLogin from "react-google-login";

const schema = yup.object({
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required"),
});


const SignInPage = () => {
    const [loading, setLoading] = useState(false);
    const { handleSubmit, control, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: "onSubmit",
    });

    const { value: showPassword, handleToggleValue: handleTogglePassword } = useToggleValue();
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState(""); // State lưu thông báo lỗi

    const apiURL = process.env.REACT_APP_API_URL;

    const handleSignIn = async (values) => {
        setLoading(true);
        setErrorMessage(""); // Reset lỗi trước khi gửi yêu cầu mới

        try {
            // Chuyển payload sang định dạng application/x-www-form-urlencoded
            const payload = new URLSearchParams();
            payload.append("username", values.username);
            payload.append("password", values.password);

            const response = await axios.post(`${apiURL}/login`, payload, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            if (response.status === 200) {
                const userData = response.data;

                // Kiểm tra access_token
                if (!userData.access_token) {
                    throw new Error("Access token không tồn tại trong phản hồi từ server.");
                }




                console.log(response);
                // Lưu token và thông tin user vào localStorage
                localStorage.setItem("access_token", userData.access_token);
                localStorage.setItem("user", JSON.stringify(userData));

                // Chuyển hướng đến trang admin
                navigate("/admin");
            } else {
                setErrorMessage("Thông tin đăng nhập không chính xác.");
            }
        } catch (error) {
            console.error("Error:", error);

            if (error.response) {
                console.error("Chi tiết lỗi từ server:", error.response.data);
                const serverError = error.response.data.detail || error.response.data.message;
                setErrorMessage(serverError || "Đã xảy ra lỗi trong quá trình đăng nhập. Vui lòng thử lại.");
            } else if (error.message === "Access token không tồn tại trong phản hồi từ server.") {
                setErrorMessage("Không nhận được token từ server. Vui lòng liên hệ quản trị viên.");
            } else if (error.message === "Bạn không có quyền truy cập vào trang này.") {
                setErrorMessage("Bạn không có quyền truy cập. Vui lòng đăng nhập với tài khoản admin.");
            } else {
                setErrorMessage("Không thể kết nối tới server. Vui lòng kiểm tra kết nối mạng và thử lại.");
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <LayoutAuthentication heading="FASCO">
            {/* Logo */}

            {/* Form Container */}
            <div className="flex flex-col items-center mt-12">
                <form
                    onSubmit={handleSubmit(handleSignIn)}
                    className="w-full max-w-md bg-white shadow-lg rounded-lg p-6"
                >
                    {/* Error Message */}
                    {errorMessage && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 mb-4 rounded">
                            {errorMessage}
                        </div>
                    )}

                    {/* Email Input */}
                    <FormGroup>
                        <Label
                            htmlFor="email"
                            className="text-gray-600 text-sm font-medium"
                        >
                            Email
                        </Label>
                        <Input
                            control={control}
                            name="username"
                            type="email"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Nhập email của bạn"
                            error={errors.email?.message}
                        />
                    </FormGroup>

                    {/* Password Input */}
                    <FormGroup>
                        <Label
                            htmlFor="password"
                            className="text-gray-600 text-sm font-medium"
                        >
                            Mật khẩu
                        </Label>
                        <div className="relative">
                            <Input
                                control={control}
                                name="password"
                                type={`${showPassword ? "text" : "password"}`}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Nhập mật khẩu của bạn"
                                error={errors.password?.message}
                            />
                            <span
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                                onClick={handleTogglePassword}
                            >
                        <IconEyeToggle open={showPassword} />
                    </span>
                        </div>
                    </FormGroup>

                    {/* Login Button */}
                    <Button
                        className={`w-full bg-darkbg-600 text-white py-2 px-4 rounded-lg mt-4 transition-colors duration-200 ${
                            loading ? "opacity-50 pointer-events-none" : "hover:bg-dark"
                        }`}
                        type="submit"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <div className="spinner-border animate-spin inline-block w-4 h-4 border-2 rounded-full text-white"></div>
                                <span className="ml-2">Đang đăng nhập...</span>
                            </div>
                        ) : (
                            "Đăng nhập"
                        )}
                    </Button>

                    {/* Register & Forgot Password Links */}
                    <div className="flex justify-between items-center mt-6">
                        <Link
                            to="/auth/sign-up"
                            className="text-blue-600 hover:underline text-sm"
                        >
                            Đăng ký
                        </Link>
                        <Link
                            to="/auth/reset"
                            className="text-blue-600 hover:underline text-sm"
                        >
                            Quên mật khẩu?
                        </Link>
                    </div>
                </form>
            </div>
        </LayoutAuthentication>
    );
};

export default SignInPage;