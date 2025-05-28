import React, { useState } from "react";
import LayoutAuthentication from "../../components/layout/LayoutAuthentication";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Label } from "../../components/label";
import { Input } from "../../components/input";
import FormGroup from "../../components/common/FormGroup";
import { Button } from "../../components/button";
import useToggleValue from "../../components/hooks/useToogleValue";
import axios from "axios";
import {ecommerceAPI} from "../../config/config";

const SignUpPage = () => {
    const { handleSubmit, control } = useForm();
    const navigate = useNavigate();
    const { value: showPassword, handleToggleValue: handleTogglePassword } = useToggleValue();
    const [loading, setLoading] = useState(false);

    const apiURL = process.env.REACT_APP_API_URL;

    const handleSignUp = async (values) => {
        setLoading(true);

        try {
            const payload = {
                first_name: values.firstname,
                last_name: values.lastname,
                email: values.email,
                phone_number: values.phone_number,
                address: values.address,
                date_of_birth: values.date_of_birth,
                gender: values.gender,
                password: values.password,
                role: false, // Giá trị mặc định cho role
            };

            console.log("Payload gửi lên server:", payload); // Kiểm tra dữ liệu gửi lên

            const response = await axios.post(`${apiURL}/signup`, payload, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                const serverMessage = response.data.message || "Đăng ký thành công!";
                alert(serverMessage);
                navigate("/auth/sign-in", { state: { message: serverMessage } });
            } else {
                alert("Không thể đăng ký. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert(error.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <LayoutAuthentication heading="FASCO">
            <div className="text-black text-3xl font-normal font-['Volkhov'] leading-10 mb-5">
            </div>
            <form onSubmit={handleSubmit(handleSignUp)}>
                <FormGroup>
                    <Label htmlFor="firstname"></Label>
                    <Input
                        control={control}
                        name="firstname"
                        type="text"
                        className=" text-base font-normal font-['Poppins'] leading-10 tracking-wider w-full border-b border-gray-400 focus:border-[#9d9d9d] focus:outline-none"
                        placeholder="Nhập họ"
                    />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="lastname"></Label>
                    <Input
                        control={control}
                        name="lastname"
                        type="text"
                        className=" text-base font-normal font-['Poppins'] leading-10 tracking-wider w-full border-b border-gray-400 focus:border-[#9d9d9d] focus:outline-none"

                        placeholder="Nhập tên"
                    />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="email"></Label>
                    <Input
                        control={control}
                        name="email"
                        type="email"
                        className=" text-base font-normal font-['Poppins'] leading-10 tracking-wider w-full border-b border-gray-400 focus:border-[#9d9d9d] focus:outline-none"

                        placeholder="Nhập email"
                    />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="phone_number"></Label>
                    <Input
                        control={control}
                        name="phone_number"
                        type="text"
                        className=" text-base font-normal font-['Poppins'] leading-10 tracking-wider w-full border-b border-gray-400 focus:border-[#9d9d9d] focus:outline-none"

                        placeholder="Nhập số điện thoại"
                    />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="address"></Label>
                    <Input
                        control={control}
                        name="address"
                        type="text"
                        className=" text-base font-normal font-['Poppins'] leading-10 tracking-wider w-full border-b border-gray-400 focus:border-[#9d9d9d] focus:outline-none"

                        placeholder="Nhập địa chỉ"
                    />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="date_of_birth"></Label>
                    <Input
                        control={control}
                        name="date_of_birth"
                        className=" text-base font-normal font-['Poppins'] leading-10 tracking-wider w-full border-b border-gray-400 focus:border-[#9d9d9d] focus:outline-none"

                        type="date"
                    />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="gender"></Label>
                    <select {...control.register("gender")} className="border rounded p-2 w-full">
                        <option value="">Chọn giới tính</option>
                        <option value="Male">Nam</option>
                        <option value="Female">Nữ</option>
                        <option value="Other">Khác</option>
                    </select>
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="password"></Label>
                    <Input
                        control={control}
                        name="password"
                        placeholder="Nhập mật khẩu"
                        type={showPassword ? "text" : "password"}

                        className=" text-base font-normal font-['Poppins'] leading-10 tracking-wider w-full border-b border-gray-400 focus:border-[#9d9d9d] focus:outline-none"

                    />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="confirmpassword"></Label>
                    <Input
                        control={control}
                        name="confirmpassword"
                        placeholder="Xác nhận mật khẩu"
                        type={showPassword ? "text" : "password"}

                        className=" text-base font-normal font-['Poppins'] leading-10 tracking-wider w-full border-b border-gray-400 focus:border-[#9d9d9d] focus:outline-none"

                    />
                </FormGroup>
                <Button type="submit" className="w-full bg-black text-white py-3">
                    {loading ? "Đang đăng ký..." : "Đăng ký"}
                </Button>
            </form>
            <p className="text-center mt-5">
                Bạn đã có tài khoản?{" "}
                <Link to="/auth/sign-in" className="text-blue-500">
                    Đăng nhập
                </Link>
            </p>
        </LayoutAuthentication>
    );
};

export default SignUpPage;