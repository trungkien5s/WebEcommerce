import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import IconCategories from "../icons/IconCategories";
import IconProduct from "../icons/IconProduct";
import IconLogout from "../icons/IconLogout";
import IconShipping from "../icons/IconShipping";
import IconOrder from "../icons/IconOrder";
import IconDashboard from "../icons/IconDashboard";
import IconAccount from "../icons/IconAccount";

const sidebarLink = [
    { icon: <IconDashboard />, title: "Bảng điều khiển", url: "/admin" },
    { icon: <IconOrder />, title: "Quản lý đơn hàng", url: "/admin/order" },
    { icon: <IconProduct />, title: "Quản lý sản phẩm", url: "/admin/product" },
    { icon: <IconCategories />, title: "Quản lý danh mục", url: "/admin/categories" },
    { icon: <IconShipping />, title: "Quản lý vận chuyển", url: "/admin/shipping" },

];

const settingsLinks = [
    { icon: <IconAccount />, title: "Quản lý tài khoản", url: "/admin/accounts" },
    { icon: <IconLogout />, title: "Đăng xuất", url: "/admin/logout" },
];


const DashboardSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navLinkClass =
        "flex items-center px-4 py-3 rounded-lg duration-300 text-gray-300 text-sm font-medium hover:bg-gray-200 hover:text-gray-900 transition no-underline";
    const activeClass = "bg-white text-gray-900 shadow-lg no-underline";

    return (
        <>
            {/* Sidebar Toggle Button for Mobile */}
            <button
                className="lg:hidden fixed top-4 left-4 z-20 bg-gray-800 p-2 rounded-md text-white"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? "✖" : "☰"}
            </button>

            {/* Sidebar */}
            <div
                    className={`fixed top-16 left-0 h-screen w-64 bg-[#1e2753] transition-transform duration-300 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                } lg:relative lg:translate-x-0`}
            >
                <div className="fixed top-0 left-0 h-full w-64 bg-[#1e2753] flex flex-col px-5 py-6">
                    {/* Main Links */}
                    <div>
                        {sidebarLink.map((link) => (
                            <NavLink
                                to={link.url}
                                key={link.title}
                                end
                                className={({ isActive }) =>
                                    isActive ? `${navLinkClass} ${activeClass}` : navLinkClass
                                }
                            >
                                <div className="flex items-center gap-4">
                                    <span>{link.icon}</span>
                                    <span>{link.title}</span>
                                </div>
                            </NavLink>
                        ))}
                    </div>

                    {/* Settings Links */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase mb-3">Khác</h3>
                        {settingsLinks.map((link) => (
                            <NavLink
                                to={link.url}
                                key={link.title}
                                className={({ isActive }) =>
                                    isActive ? `${navLinkClass} ${activeClass}` : navLinkClass
                                }
                            >
                                <div className="flex items-center gap-4">
                                    <span>{link.icon}</span>
                                    <span>{link.title}</span>
                                </div>
                            </NavLink>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}
        </>
    );
};

export default DashboardSidebar;
