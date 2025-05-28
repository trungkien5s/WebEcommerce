import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../components/layout/AdminLayout";

const LogOutUser = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await axios.post(
                "https://testbe-1.onrender.com/logout",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                localStorage.removeItem("token");
                alert("Bạn đã đăng xuất thành công!");
                navigate("/login");
            } else {
                alert("Có lỗi xảy ra. Vui lòng thử lại!");
            }
        } catch (error) {
            console.error("Lỗi đăng xuất:", error);
            if (error.response) {
                // Nếu có lỗi từ server
                alert(`Lỗi server: ${error.response.statusText}`);
            } else if (error.request) {
                // Nếu không có phản hồi từ server
                alert("Không thể kết nối với server. Vui lòng thử lại!");
            } else {
                // Lỗi khi thiết lập yêu cầu
                alert("Lỗi yêu cầu: " + error.message);
            }
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <AdminLayout >
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

export default LogOutUser;
