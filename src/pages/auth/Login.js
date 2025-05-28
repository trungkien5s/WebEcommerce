import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import axios from "axios";
import { Label } from "../../components/label";
import { Input } from "../../components/input";
import FormGroup from "../../components/common/FormGroup";
import { Button } from "../../components/button";
import IconEyeToggle from "../../components/icons/IconEyeToggle";
import useToggleValue from "../../components/hooks/useToogleValue";
import LayoutAuthentication from "../../components/layout/LayoutAuthentication";

// Validation schema using Yup
const schema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });

  const { value: showPassword, handleToggleValue: togglePasswordVisibility } = useToggleValue();

  // Login handler
  const handleLogin = async (values) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const payload = new URLSearchParams();
      payload.append("username", values.username);
      payload.append("password", values.password);

      const response = await axios.post("https://testbe-1.onrender.com/login", payload, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (response.status === 200) {
        const userData = response.data;

        if (!userData.access_token) {
          throw new Error("Access token is missing from server response.");
        }

        // Store token and navigate to /shop
        localStorage.setItem("access_token", userData.access_token);
        localStorage.setItem("user", JSON.stringify(userData));
        navigate("/shop");
      } else {
        setErrorMessage("Invalid login credentials.");
      }
    } catch (error) {
      if (error.response) {
        const serverError = error.response.data.detail || error.response.data.message;
        setErrorMessage(serverError || "Invalid login credentials.");
      } else {
        setErrorMessage("Unable to connect to the server. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutAuthentication heading="Welcome Back">
      <form onSubmit={handleSubmit(handleLogin)} className="w-full max-w-md mx-auto">
        {errorMessage && (
          <div className="bg-red-500 text-white text-center py-2 mb-4 rounded">
            {errorMessage}
          </div>
        )}

        <FormGroup>
          <Label htmlFor="username">Username</Label>
          <Input
            control={control}
            name="username"
            type="text"
            placeholder="Enter your username"
            error={errors.username?.message}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <Input
            control={control}
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            error={errors.password?.message}
          >
            <IconEyeToggle open={showPassword} onClick={togglePasswordVisibility} />
          </Input>
        </FormGroup>

        <Button
          type="submit"
          className={`w-full mt-4 ${loading ? "opacity-50 pointer-events-none" : ""}`}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Don't have an account? <a href="/auth/sign-up" className="text-blue-500">Sign Up</a>
          </p>
        </div>
      </form>
    </LayoutAuthentication>
  );
};

export default Login;
