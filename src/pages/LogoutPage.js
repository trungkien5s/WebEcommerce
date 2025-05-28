import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../components/layout/AdminLayout";
import {ecommerceAPI} from "../config/config";

const LogoutPage = () => {
    const navigate = useNavigate();

    const apiURL = process.env.REACT_APP_API_URL;

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                alert("Đăng xuất thành công!");
                navigate("/auth/sign-in");
                return;
            }

            const response = await axios.post(
                `${apiURL}/logout`,
                {}, // Body rỗng
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                localStorage.removeItem("token");
                alert("Bạn đã đăng xuất thành công!");
                navigate("/auth/sign-in");
            } else {
                alert("Có lỗi xảy ra trong quá trình đăng xuất. Vui lòng thử lại!");
            }
        } catch (error) {
            console.error("Chi tiết lỗi đăng xuất:", error);

            if (error.response) {
                // Lỗi phản hồi từ server
                console.error("Phản hồi server:", error.response);
                alert(`Lỗi server: ${error.response.status} - ${error.response.data.message || "Không xác định"}`);
            } else if (error.request) {
                // Không nhận được phản hồi từ server
                console.error("Yêu cầu không phản hồi:", error.request);
                alert("Không thể kết nối với server. Vui lòng kiểm tra mạng hoặc thử lại sau!");
            } else {
                // Lỗi khi thiết lập yêu cầu
                console.error("Lỗi khi thiết lập yêu cầu:", error.message);
                alert("Lỗi yêu cầu: " + error.message);
            }
        }
    };

    const handleCancel = () => {
        navigate(-1); // Quay lại trang trước
    };

    return (
        <AdminLayout>
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white shadow-lg rounded-lg p-8 text-center w-full max-w-md">
                    <h1 className="text-2xl font-bold mb-4 text-gray-800">Xác nhận Đăng Xuất</h1>
                    <p className="text-gray-600 mb-6">Bạn có chắc chắn muốn đăng xuất không?</p>

                    <div className="flex justify-center gap-4">
                        <button
                            onClick={handleCancel}
                            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-all"
                        >
                            Hủy Bỏ
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                        >
                            Đăng Xuất
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default LogoutPage;
