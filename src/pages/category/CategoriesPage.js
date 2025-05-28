import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    const apiURL = process.env.REACT_APP_API_URL;

    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem("access_token");
                if (!token) {
                    alert("Bạn cần đăng nhập để tiếp tục.");
                    return;
                }

                const response = await axios.get(`${apiURL}/categories`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                setCategories(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh mục:", error);
                alert("Không thể tải danh mục. Vui lòng thử lại sau.");
            }
        };

        fetchCategories();
    }, []);

    // Handle category deletion
    const handleDelete = async (categoryId) => {
        if (!window.confirm("Bạn chắc chắn muốn xóa danh mục này và tất cả sản phẩm liên quan?")) {
            return;
        }

        try {
            const token = localStorage.getItem("access_token");

            // Lấy danh sách sản phẩm trong danh mục
            const productResponse = await axios.get(`${apiURL}/products?category_id=${categoryId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const products = productResponse.data;

            // Xóa từng sản phẩm liên quan
            for (const product of products) {
                await axios.delete(`${apiURL}/products/${product.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
            }

            // Xóa danh mục
            await axios.delete(`${apiURL}/categories/delete?category_id=${categoryId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            // Cập nhật danh sách danh mục sau khi xóa
            setCategories((prevCategories) =>
                prevCategories.filter((category) => category.id !== categoryId)
            );

            alert("Danh mục và các sản phẩm liên quan đã được xóa thành công.");
        } catch (error) {
            console.error("Lỗi khi xóa danh mục:", error.response?.data || error.message);
            alert("Không thể xóa danh mục. Vui lòng thử lại sau.");
        }
    };
            // Handle navigation to edit category page
    const handleEdit = async (categoryId) => {
        const newName = prompt("Nhập tên mới cho danh mục:");
        if (!newName) {
            alert("Tên danh mục không được để trống.");
            return;
        }

        try {
            const token = localStorage.getItem("access_token");
            if (!token) {
                alert("Không tìm thấy token. Vui lòng đăng nhập lại.");
                return;
            }

            await axios.put(
                `${apiURL}/categories/change?category_id=${categoryId}`,
                { name: newName }, // Truyền thông tin mới cần chỉnh sửa
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            setCategories((prevCategories) =>
                prevCategories.map((category) =>
                    category.id === categoryId ? { ...category, name: newName } : category
                )
            );

            alert("Danh mục đã được cập nhật thành công.");
        } catch (error) {
            console.error("Lỗi khi chỉnh sửa danh mục:", error.response?.data || error.message);
            alert("Không thể chỉnh sửa danh mục. Vui lòng thử lại sau.");
        }
    };

    return (
        <AdminLayout>
            <div className="p-6 overflow-y-auto h-full">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-8 mt-10">Danh mục sản phẩm</h1>
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        onClick={() => navigate("/admin/categories/add-category")}
                    >
                        + Thêm
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="relative bg-white shadow-md rounded-lg overflow-hidden group hover:shadow-lg transition-shadow duration-300"
                        >
                            <div
                                className="h-40 bg-cover bg-center"
                                style={{ backgroundImage: `url(${category.image})` }}
                            ></div>
                            <div className="p-4">
                                <h2 className="text-lg font-medium text-gray-800">
                                    {category.name}
                                </h2>
                            </div>
                            <div
                                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            >
                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => handleEdit(category.id)}
                                        className="text-blue-600 bg-white px-4 py-2 rounded-md shadow-md hover:bg-blue-500 hover:text-white transition duration-300"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill=""><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z"/></svg>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category.id)}
                                        className="text-red-600 bg-white px-4 py-2 rounded-md shadow-md hover:bg-red-500 hover:text-white transition duration-300"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill=""><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
};

export default CategoriesPage;
