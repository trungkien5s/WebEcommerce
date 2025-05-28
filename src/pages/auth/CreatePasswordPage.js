import React from "react";
import LayoutAuthentication from "../../components/layout/LayoutAuthentication";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormGroup from "../../components/common/FormGroup";
import { Label } from "../../components/label";
import { Input } from "../../components/input";
import { Button } from "../../components/button";
import {useNavigate} from "react-router-dom";

const schema = yup.object({
    password: yup
        .string()
        .min(8, "Password must be at least 8 characters")
        .required("This field is required"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
});

const CreatePasswordPage = () => {
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        mode: "onSubmit",
    });
    const navigate = useNavigate()
    const handleCreatePassword = (values) => {
        console.log("Password Created:", values.password);
        // Xử lý logic lưu mật khẩu hoặc xác thực gì đó
        navigate("/auth/sign-in")
        alert("Lấy mật khẩu thành công!!!")
    };

    return (
        <LayoutAuthentication heading="FASCO">
            <div className="flex flex-col  mt-20">
                <div className="text-black text-3xl font-normal font-['Volkhov'] leading-10 mb-10">
                    Nhập mật khẩu mới
                </div>
                <form onSubmit={handleSubmit(handleCreatePassword)} className="w-full max-w-sm">
                    <FormGroup>
                        <Label
                            htmlFor="password"
                            className="text-[#121018] text-xs font-normal"
                        >
                        </Label>
                        <Input
                            control={control}
                            name="password"
                            type="password"
                            placeholder="Mật khẩu mới"
                            error={errors.password?.message}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label
                            htmlFor="confirmPassword"
                            className="text-[#121018] text-xs font-normal"
                        >
                        </Label>
                        <Input
                            control={control}
                            name="confirmPassword"
                            type="password"
                            placeholder="Xác nhận mật khẩu"
                            error={errors.confirmPassword?.message}
                        />
                    </FormGroup>
                    <Button
                        className="bg-black rounded-[10px] shadow-[0px_20px_35px_0px_rgba(0,0,0,0.15)] w-full mt-4"
                        type="submit"
                    >
                        Tạo mật khẩu
                    </Button>
                </form>
            </div>
        </LayoutAuthentication>
    );
};

export default CreatePasswordPage;
