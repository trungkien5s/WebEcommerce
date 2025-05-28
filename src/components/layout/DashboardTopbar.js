import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {ecommerceAPI} from "../../config/config";

const DashboardTopbar = () => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(""); // Giá trị tìm kiếm
    const [products, setProducts] = useState([]); // Danh sách sản phẩm
    const [filteredResults, setFilteredResults] = useState([]); // Kết quả lọc
    const [showResults, setShowResults] = useState(false); // Hiển thị kết quả tìm kiếm

    const toggleMenu = () => setMenuVisible((prev) => !prev);

    const toggleFullscreen = () => {
        if (!fullscreen) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
        setFullscreen((prev) => !prev);
    };

    useEffect(() => {
        // Tải danh sách sản phẩm từ backend
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${ecommerceAPI.baseURL}products`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                        "Content-Type": "application/json",
                    },
                });
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    const handleSearch = (event) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);

        if (term.length > 0) {
            const results = products.filter((product) =>
                product.name.toLowerCase().includes(term)
            );
            setFilteredResults(results);
            setShowResults(true);
        } else {
            setShowResults(false);
        }
    };

    const handleResultClick = () => {
        setShowResults(false); // Đóng danh sách kết quả
        setSearchTerm(""); // Reset ô tìm kiếm
    };

    return (
        <div
            className="fixed top-0 left-0 w-full h-16 bg-[#070b1d] flex items-center justify-between px-8 shadow-lg z-50"
        >
            {/* Logo and Search */}
            <div className="flex items-center gap-6">
                <Link to="/admin" className="flex items-center gap-2">
                    <img
                        src="/Group%201000004658.png"
                        alt="FASCO Logo"
                        className="w-12 h-12 object-contain"
                    />
                    <span className="text-white text-2xl font-bold font-['Rubik Glitch']">
        FASCO
      </span>
                </Link>
                <div className="relative hidden lg:block w-96 mt-5">
                    <input
                        type="text"
                        placeholder="Tìm kiếm...."
                        className="w-full py-3 pl-12 pr-4 bg-white text-sm text-gray-700 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="20px"
                        width="20px"
                        viewBox="0 -960 960 960"
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                        <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
                    </svg>
                    {showResults && (
                        <ul className="absolute top-14 left-0 w-full bg-[#1e2753] rounded-lg shadow-lg text-white z-50">
                            {filteredResults.length > 0 ? (
                                filteredResults.map((product) => (
                                    <li
                                        key={product.id}
                                        className="px-4 py-2 hover:bg-indigo-500 cursor-pointer"
                                        onClick={handleResultClick}
                                    >
                                        <Link to={`/admin/product/${product.id}`}>{product.name}</Link>
                                    </li>
                                ))
                            ) : (
                                <li className="px-4 py-2 text-gray-400">Không tìm thấy kết quả</li>
                            )}
                        </ul>
                    )}
                </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-6 text-white">
                {/* Fullscreen */}
                <span
                    onClick={toggleFullscreen}
                    className="cursor-pointer transition-colors duration-300 hover:text-indigo-500"
                >
      <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="white"
      >
        <path d="M120-120v-200h80v120h120v80H120Zm520 0v-80h120v-120h80v200H640ZM120-640v-200h200v80H200v120h-80Zm640 0v-120H640v-80h200v200h-80Z" />
      </svg>
    </span>

                {/* User Menu */}
                <div className="relative">
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={toggleMenu}
                    >
                        <div className="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-full uppercase">
                            A
                        </div>
                        <span className="text-sm hidden lg:block">ADMIN</span>
                    </div>
                    {menuVisible && (
                        <ul className="absolute right-0 mt-2 w-40 bg-black shadow-lg rounded-md z-50">
                            <li className="px-4 py-2 hover:bg-gray-500 cursor-pointer">
                                <Link to="/admin/order">Đơn hàng</Link>
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-500 cursor-pointer">
                                <Link to="/admin/logout">Đăng xuất</Link>
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardTopbar;
