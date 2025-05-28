import React from "react";
import LayoutAuthentication from "../../components/layout/LayoutAuthentication";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormGroup from "../../components/common/FormGroup";
import { Label } from "../../components/label";
import { Input } from "../../components/input";
import { Button } from "../../components/button";
import { Link, useNavigate } from "react-router-dom";
import {ecommerceAPI} from "../../config/config";

const schema = yup.object({
    email: yup
        .string()
        .email("Địa chỉ email không hợp lệ")
        .required("Vui lòng nhập email"),
});

const ResetPasswordPage = () => {
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        mode: "onSubmit",
    });
    const navigate = useNavigate();


    const apiURL = process.env.REACT_APP_API_URL;

    const handleResetPassword = async (values) => {
        try {
            const response = await fetch(
                `${apiURL}/accounts/password-reset-request?email=${encodeURIComponent(values.email)}`, // Truyền qua query
                {
                    method: "POST", // Phương thức POST
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                        "Content-Type": "application/json", // Headers mặc định
                    },
                }

            );



            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error từ API:", errorData);
                throw new Error(
                    `Lỗi: ${errorData.detail?.[0]?.msg || "Không thể gửi mã xác nhận"}`
                );
            }

            const data = await response.json();


            console.log("Request sent to:", `${apiURL}/accounts/password-reset-request?email=${encodeURIComponent(values.email)}`);
            console.log("Response received:", data);
            if (data.reset_token) {
                alert("Mã xác nhận đã được gửi thành công!");
                navigate("/auth/confirm", { state: { reset_token: data.reset_token } });
            } else {
                alert("Không nhận được mã xác nhận. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Lỗi khi gửi yêu cầu:", error.message);
            alert(error.message);
        }
    };

    return (
        <LayoutAuthentication heading="FASCO">
            {/* Đưa FASCO sát lên trên */}
            <div className="absolute top-0 left-0 right-0 flex justify-center mt-4"></div>

            {/* Nội dung chính */}
            <div className="flex flex-col items-center mt-20">
                <div className="text-black text-3xl font-normal font-['Volkhov'] leading-10 mb-5">
                    Quên mật khẩu
                </div>
                <form onSubmit={handleSubmit(handleResetPassword)} className="w-full max-w-sm">
                    <FormGroup>
                        <Label
                            htmlFor="email"
                            className="text-[#121018] text-xs font-normal"
                        >
                            Nhập email của bạn
                        </Label>
                        <Input
                            control={control}
                            name="email"
                            type="email"
                            placeholder="example@gmail.com"
                            error={errors.email?.message}
                        />
                    </FormGroup>
                    <Button
                        className="bg-black rounded-[10px] shadow-[0px_20px_35px_0px_rgba(0,0,0,0.15)] w-full mt-4"
                        type="submit"
                    >
                        <span className="Send Confirmation Code">Gửi mã xác nhận</span>
                    </Button>
                </form>
                <div className="text-center mt-5">
                    <p className="text-sm text-gray-600">
                        Bạn nhớ mật khẩu không?{" "}
                        <Link
                            to="/auth/sign-in"
                            className="text-[#5b86e5] text-base font-normal font-['Poppins'] leading-10 tracking-wider"
                        >
                            Đăng nhập
                        </Link>
                    </p>
                </div>
            </div>
        </LayoutAuthentication>
    );
};

export default ResetPasswordPage;
