    import React, { useState } from 'react';
    import AdminLayout from "../../components/layout/AdminLayout";
    import { useNavigate } from "react-router-dom";

    const AddCategoryPage = () => {
        const navigate = useNavigate();
        const [categoryData, setCategoryData] = useState({
            name: '',
            image: ''
        });
        const [error, setError] = useState("");
        const [success, setSuccess] = useState("");

        const apiURL = process.env.REACT_APP_API_URL;

        const handleInputChange = (e) => {
            const { name, value } = e.target;
            setCategoryData({
                ...categoryData,
                [name]: value
            });
            setError("");
        };

        const handleSubmit = async (e) => {
            e.preventDefault();

            if (!categoryData.name || !categoryData.image) {
                setError("Vui lòng nhập đầy đủ thông tin!");
                return;
            }

            try {
                const token = localStorage.getItem("access_token");
                if (!token) {
                    setError("Token không tồn tại. Vui lòng đăng nhập lại.");
                    return;
                }

                const response = await fetch(`${apiURL}/categories/add`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                    body: JSON.stringify(categoryData),
                });

                if (response.ok) {
                    setSuccess("Danh mục đã được thêm thành công!");
                    setTimeout(() => {
                        setSuccess("");
                        navigate("/admin/categories");
                    }, 500);
                } else {
                    const errorData = await response.json();
                    console.error("Error response:", errorData);
                    setError(errorData.message || "Thêm danh mục thất bại!");
                }
            } catch (error) {
                console.error("Error adding category:", error);
                setError("Đã xảy ra lỗi khi thêm danh mục. Vui lòng thử lại sau.");
            }
        };

        return (
            <AdminLayout>
                <div className="flex bg-gradient-to-r min-h-screen overflow-hidden">
                    <div className="w-full max-w-2xl mx-4 p-6">
                        <div className="flex items-center mb-8 mt-6">
                            <button
                                onClick={() => navigate("/admin/categories")}
                                className="flex items-center px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368" className="mr-2">
                                    <path d="M360-240 120-480l240-240 56 56-144 144h488v-160h80v240H272l144 144-56 56Z" />
                                </svg>
                                <span>Quay Lại</span>
                            </button>
                        </div>

                        <header className="mb-6">
                            <h1 className="text-3xl font-semibold text-gray-800">Thêm danh mục sản phẩm</h1>
                        </header>

                        {success && (
                            <div className="mb-4 p-4 bg-green-100 text-green-800 border border-green-300 rounded-lg">
                                {success}
                            </div>
                        )}

                        {error && (
                            <div className="mb-4 p-4 bg-red-100 text-red-800 border border-red-300 rounded-lg">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 space-y-6">
                            <div className="mb-6">
                                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Tên danh mục</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Nhập tên danh mục"
                                    value={categoryData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="image" className="block text-gray-700 font-medium mb-2">URL hình ảnh</label>
                                <input
                                    type="url"
                                    id="image"
                                    name="image"
                                    placeholder="Nhập link ảnh"
                                    value={categoryData.image}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg"
                            >
                                Thêm danh mục
                            </button>
                        </form>
                    </div>
                </div>
            </AdminLayout>
        );
    };

    export default AddCategoryPage;
