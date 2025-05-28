import React, {useEffect, useState} from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { useNavigate } from "react-router-dom";
import colors from "tailwindcss/colors";
import {ecommerceAPI} from "../../config/config";

const AddProductPage = () => {
    const [productName, setProductName] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [categories, setCategories] = useState("");
    const [images, setImages] = useState([]);
    const [colorsList, setColors] = useState([]); // Updated color state name
    const [sizes, setSizes] = useState([]); // Updated sizes state name
    const [showModal, setShowModal] = useState(false);
    const [status, setStatus] = useState([]);

    const navigate = useNavigate();

    const apiURL = process.env.REACT_APP_API_URL;

    const handleSave = async () => {
        // Kiểm tra các trường đầu vào
        if (
            !productName ||
            !productDescription ||
            !productPrice ||
            !status ||
            sizes.length === 0 ||
            colorsList.length === 0 ||
            categories.length === 0
        ) {
            alert("Vui lòng điền đầy đủ thông tin và chọn ít nhất một kích cỡ, màu sắc và danh mục!");
            return;
        }

        // Chuyển đổi giá trị trước khi gửi
        const productData = {
            name: productName,
            description: productDescription,
            price: parseFloat(productPrice), // Giá sản phẩm dạng số thực
            category_id: parseInt(categories), // Danh mục dạng số nguyên
            status: status, // Trạng thái là chuỗi
            colors: colorsList, // Mảng màu sắc
            sizes: sizes, // Mảng kích cỡ
            image: images[0] || "", // Chỉ lấy URL đầu tiên trong mảng `images`
        };

        try {
            const response = await fetch(`${apiURL}/products`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(productData),
            });

            if (response.ok) {
                setShowModal(true); // Hiển thị modal thành công
            } else {
                console.error("Failed to add product");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };



    const [availableCategories, setAvailableCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${apiURL}/categories`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Sử dụng token
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setAvailableCategories(data); // Dữ liệu phải chứa { id, name }
                } else {
                    console.error(`Failed to fetch categories: ${response.statusText}`);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);


    const [availableStatuses, setAvailableStatuses] = useState([]);

    useEffect(() => {
        const fetchStatuses = async () => {
            try {
                const response = await fetch(`${apiURL}/products`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Sử dụng token
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setAvailableStatuses(data); // Giả sử dữ liệu là một mảng chứa các đối tượng trạng thái
                } else {
                    console.error(`Failed to fetch statuses: ${response.statusText}`);
                }
            } catch (error) {
                console.error("Error fetching statuses:", error);
            }
        };

        fetchStatuses();
    }, []);

    const handleImageURLInput = (e) => {
        const url = e.target.value;
        setImages([url]); // Lưu duy nhất một URL ảnh
    };

    return (
        <AdminLayout>
            <div className="flex">
                {/* Main Content */}
                <div className="w-full overflow-y-auto h-screen p-6">
                    {/* Back Button */}
                    <div className="flex items-center mb-6">
                        <button
                            onClick={() => navigate("/admin/product")}
                            className="flex items-center px-4 py-2 text-gray-600 bg-gray-200 rounded-lg mb-8 mt-6 hover:bg-gray-300 transition duration-300"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24px"
                                viewBox="0 -960 960 960"
                                width="24px"
                                fill="#5f6368"
                                className="mr-2"
                            >
                                <path d="M360-240 120-480l240-240 56 56-144 144h488v-160h80v240H272l144 144-56 56Z" />
                            </svg>
                            <span>Quay Lại</span>
                        </button>
                    </div>
                    <header className=" mb-6">
                        <h1 className="text-2xl font-bold ">Thêm sản phẩm</h1>
                    </header>

                    <div className="grid grid-cols-3 gap-6">
                        {/* Left Column */}
                        <div className="col-span-2 space-y-6 bg-white p-6 rounded-lg shadow-md">
                            {/* Product Information */}
                            <div>
                                <label className="block font-semibold mb-2">Tên sản phẩm</label>
                                <input
                                    type="text"
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                    className="border px-4 py-2 w-full rounded"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold mb-2">Mô tả sản phẩm</label>
                                <textarea
                                    value={productDescription}
                                    onChange={(e) => setProductDescription(e.target.value)}
                                    className="border px-4 py-2 w-full rounded"
                                />
                            </div>

                            {/* Images */}
                            <div>
                                <label className="block font-semibold mb-2">Ảnh (URL)</label>
                                <input
                                    type="url"
                                    onChange={handleImageURLInput}
                                    className="border px-4 py-2 w-full rounded"
                                    placeholder="Nhập URL ảnh sản phẩm"
                                />
                                {images.length > 0 && (
                                    <div className="mt-2">
                                        <img
                                            src={images[0]} // Hiển thị ảnh đầu tiên
                                            alt="Preview"
                                            className="w-16 h-16 object-cover rounded border"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Price */}
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <label className="block font-semibold mb-2">Giá sản phẩm</label>
                                    <input
                                        type="number"
                                        value={productPrice}
                                        onChange={(e) => setProductPrice(e.target.value)}
                                        className="border px-4 py-2 w-full rounded"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block font-semibold mb-2">Tồn kho</label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="border px-4 py-2 w-full rounded"
                                    >
                                        <option value="">Chọn trạng thái</option> {/* Default option */}
                                        <option value="Còn hàng">Còn hàng</option>
                                        <option value="Hết hàng">Hết hàng</option>
                                    </select>
                                </div>

                            </div>

                            {/* Size and Color */}
                            <div className="flex gap-3">
                                {/* Màu sắc */}
                                <div className="flex-1">
                                    <label className="block font-semibold mb-2">Màu sắc</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {["Đỏ", "Xanh", "Vàng", "Trắng", "Đen", "Hồng", "Xám", "Nâu"].map((color) => (
                                            <label
                                                key={color}
                                                className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition duration-300"
                                            >
                                                <input
                                                    type="checkbox"
                                                    value={color}
                                                    checked={colorsList.includes(color)} // Kiểm tra nếu màu đã được chọn
                                                    onChange={(e) => {
                                                        // Thêm hoặc xóa màu từ mảng `colorsList` khi thay đổi
                                                        setColors((prev) =>
                                                            e.target.checked
                                                                ? [...prev, color] // Thêm màu nếu checkbox được chọn
                                                                : prev.filter((item) => item !== color) // Xóa màu nếu checkbox không được chọn
                                                        );
                                                    }}
                                                    className="form-checkbox text-blue-500"
                                                />
                                                <span className="text-gray-700">{color}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Kích cỡ */}
                                <div className="flex-1">
                                    <label className="block font-semibold mb-2">Kích cỡ</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {[
                                            "XXL",
                                            "XL",
                                            "L",
                                            "M",
                                            "31",
                                            "30",
                                            "29",
                                            "38mm - 44mm",
                                            "26mm - 36mm",
                                            "42",
                                            "41",
                                            "36",
                                            "35",
                                            "11x9cm",
                                            "22cm - 26cm"
                                        ].map((size) => (
                                            <label
                                                key={size}
                                                className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition duration-300"
                                            >
                                                <input
                                                    type="checkbox"
                                                    value={size}
                                                    checked={sizes.includes(size)} // Kiểm tra nếu kích cỡ đã được chọn
                                                    onChange={(e) => {
                                                        // Thêm hoặc xóa kích cỡ từ mảng `sizes` khi thay đổi
                                                        setSizes((prev) =>
                                                            e.target.checked
                                                                ? [...prev, size] // Thêm kích cỡ nếu checkbox được chọn
                                                                : prev.filter((item) => item !== size) // Xóa kích cỡ nếu checkbox không được chọn
                                                        );
                                                    }}
                                                    className="form-checkbox text-blue-500"
                                                />
                                                <span className="text-gray-700">{size}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            <div className="bg-white p-4 rounded-lg shadow-md">
                                <label className="block font-semibold mb-2">Danh mục sản phẩm</label>
                                <select
                                    value={categories}
                                    onChange={(e) => setCategories(e.target.value)}
                                    className="border px-4 py-2 w-full rounded"
                                >
                                    <option value="">Chọn danh mục</option>
                                    {availableCategories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Save and Cancel Buttons */}
                    <div className="flex justify-end mt-6 gap-4">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/product")}
                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded shadow-md hover:bg-gray-300"
                        >
                            Hủy
                        </button>
                        <button
                            type="button"
                            onClick={handleSave} // Call the API to save the product
                            className="px-6 py-2 bg-blue-500 text-white rounded shadow-md hover:bg-blue-600"
                        >
                            Lưu
                        </button>
                    </div>

                    {/* Modal */}
                    {showModal && (
                        <div
                            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 ease-in-out"
                            style={{ animation: "fadeIn 0.3s" }}
                        >
                            <div
                                className="bg-white rounded-lg p-6 w-96 shadow-lg text-center transform transition-transform duration-300 ease-in-out scale-90"
                                style={{ animation: "scaleIn 0.3s forwards" }}
                            >
                                <div className="flex items-center justify-center mb-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shadow-md">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="24px"
                                            viewBox="0 -960 960 960"
                                            width="24px"
                                            fill="blue"
                                        >
                                            <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                                        </svg>
                                    </div>
                                </div>
                                <h2 className="text-xl font-semibold">Thêm sản phẩm thành công</h2>
                                    <p className="text-gray-600 mt-2">Đã thêm sản phẩm mới vào cửa hàng của bạn.</p>
                                <button
                                    onClick={() => {
                                        const modalElement = document.querySelector(".bg-white");
                                        modalElement.style.animation = "scaleOut 0.3s forwards";

                                        setTimeout(() => {
                                            setShowModal(false);
                                            navigate("/admin/product");
                                        }, 300);
                                    }}
                                    className="mt-4 px-6 py-2 bg-blue-500 text-white rounded shadow-md hover:bg-blue-600 transition-transform duration-200 hover:scale-105"
                                >
                                    Tiếp tục
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AddProductPage;