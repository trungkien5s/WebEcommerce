import React, { useState } from "react";
import LayoutAuthentication from "../../components/layout/LayoutAuthentication";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormGroup from "../../components/common/FormGroup";
import { Label } from "../../components/label";
import { Input } from "../../components/input";
import { Button } from "../../components/button";
import { useNavigate } from "react-router-dom";
import {ecommerceAPI} from "../../config/config";


const ConfirmCodePage = () => {
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        mode: "onSubmit",
    });

    const navigate = useNavigate();
    const [isResending, setIsResending] = useState(false); // Trạng thái gửi lại mã
    const lastEmail = localStorage.getItem("reset_email") || ""; // Lấy email từ localStorage

    const apiURL = process.env.REACT_APP_API_URL;

    const handleConfirmCode = async (values) => {
        try {
            console.log("Mã xác nhận đã nhập:", values.code);

            // Lưu mã xác nhận (token) để sử dụng ở bước tiếp theo
            localStorage.setItem("reset_token", values.code);

            // Chuyển đến trang tạo mật khẩu
            navigate("/auth/create");
        } catch (error) {
            console.error("Lỗi khi xác nhận mã:", error);
            alert("Mã xác nhận không hợp lệ, vui lòng thử lại.");
        }
    };

    const handleResendCode = async () => {
        if (!lastEmail) {
            alert("Không có email để gửi lại mã xác nhận. Vui lòng quay lại bước trước.");
            return;
        }

        setIsResending(true); // Bắt đầu trạng thái gửi lại
        try {
            const response = await fetch(
                `${apiURL}/accounts/password-reset-request?email=${encodeURIComponent(
                    lastEmail
                )}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Lỗi từ API:", errorData);
                throw new Error(`Lỗi: ${errorData.detail || "Không thể gửi lại mã xác nhận"}`);
            }

            alert("Mã xác nhận đã được gửi lại thành công!");
        } catch (error) {
            console.error("Lỗi khi gửi lại mã xác nhận:", error.message);
            alert("Không thể gửi lại mã xác nhận. Vui lòng thử lại sau.");
        } finally {
            setIsResending(false); // Kết thúc trạng thái gửi lại
        }
    };

    return (
        <LayoutAuthentication heading="FASCO">
            <div className="flex flex-col items-center mt-20">
                <div className="text-black text-3xl font-normal font-['Volkhov'] leading-10 mb-5">
                    Nhập mã xác nhận
                </div>
                <form onSubmit={handleSubmit(handleConfirmCode)} className="w-full max-w-sm">
                    <FormGroup>
                        <Label
                            htmlFor="code"
                            className="text-[#121018] text-xs font-normal"
                        >
                            Nhập mã 6 chữ số được gửi đến email của bạn
                        </Label>
                        <Input
                            control={control}
                            name="code"
                            type="text"
                            placeholder="123456"
                        />
                    </FormGroup>
                    <Button
                        className="bg-black rounded-[10px] shadow-[0px_20px_35px_0px_rgba(0,0,0,0.15)] w-full mt-4"
                        type="submit"
                    >
                        Xác nhận
                    </Button>
                </form>
                <div className="text-center mt-5">
                    <p className="text-black text-base font-normal font-['Poppins'] leading-10 tracking-wider">
                        Bạn không nhận được mã?{" "}
                        <button
                            onClick={handleResendCode}
                            disabled={isResending}
                            className={`text-[#5b86e5] text-base font-normal font-['Poppins'] leading-10 tracking-wider ${
                                isResending ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            {isResending ? "Đang gửi lại..." : "Gửi lại"}
                        </button>
                    </p>
                </div>
            </div>
        </LayoutAuthentication>
    );
};

export default ConfirmCodePage;
