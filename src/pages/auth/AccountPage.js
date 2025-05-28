import { Routes, Route } from "react-router-dom";
import OrderPage from "../order/OrderPage";
import SignInPage from "./SignInPage";
import SignUpPage from "./SignUpPage";
import ResetPasswordPage from "./ResetPasswordPage";
import ConfirmCodePage from "./ConfirmCodePage";
import CreatePasswordPage from "./CreatePasswordPage";


const AccountPage = () => {
    return (
        <Routes>
            <Route path="sign-in" element={<SignInPage />} />
            <Route path="sign-up" element={<SignUpPage />} />
            <Route path="reset" element={<ResetPasswordPage />} />
            <Route path="confirm" element={<ConfirmCodePage />} />
            <Route path="create" element={<CreatePasswordPage />} />
            {/* Default route nếu không khớp */}
            <Route path="*" element={<div>Account Overview</div>} />
        </Routes>
    );
};

export default AccountPage;
