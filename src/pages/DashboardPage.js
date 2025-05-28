    import React, { useState, useEffect } from "react";
    import AdminLayout from "../components/layout/AdminLayout";
    import { Bar, Line } from "react-chartjs-2";
    import "chart.js/auto";
    import axios from "axios";
    import {ecommerceAPI} from "../config/config";

    const DashboardPage = () => {
        const [orders, setOrders] = useState([]);
        const [products, setProducts] = useState([]);
        const [newUsersCount, setNewUsersCount] = useState(0);
        const [totalOrders, setTotalOrders] = useState(0);
        const [recentOrders, setRecentOrders] = useState([]);
        const [revenueLast7Days, setRevenueLast7Days] = useState(0);
        const [totalRevenue, setTotalRevenue] = useState(0);
        const [revenuePerDay, setRevenuePerDay] = useState({ dates: [], revenues: [] });
        const [topConsumers, setTopConsumers] = useState([]);

        const apiURL = process.env.REACT_APP_API_URL;

        useEffect(() => {
            const fetchData = async () => {
                try {
                    const headers = {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                        "Content-Type": "application/json",
                    };

                    // Fetch dữ liệu từ API
                    const [ordersResponse, productsResponse, accountsResponse, revenueResponse] = await Promise.all([
                        axios.get(`${apiURL}/orders`, { headers }),
                        axios.get(`${apiURL}/products`, { headers }),
                        axios.get(`${apiURL}/accounts`, { headers }),
                        axios.get(`${apiURL}/orders/revenue`, { headers }),
                    ]);

                    const orders = ordersResponse.data;
                    const products = productsResponse.data;
                    const accounts = accountsResponse.data;
                    const totalRevenueData = revenueResponse.data.total_revenue;

                    // Tính tổng số đơn hàng
                    setOrders(orders);
                    setProducts(products);
                    setTotalOrders(orders.length);

                    // Lọc số lượng người dùng
                    setNewUsersCount(accounts.length)

                    const currentDate = new Date();
                    const sevenDaysAgo = new Date(currentDate);
                    sevenDaysAgo.setDate(currentDate.getDate()- 7);

                    // Tổng doanh thu (định dạng theo VN)
                    const formattedTotalRevenue = totalRevenueData.toLocaleString("vi-VN");
                    setTotalRevenue(formattedTotalRevenue);

                    // Doanh thu theo ngày trong 7 ngày gần nhất
                    const dailyRevenue = [];
                    const dates = [];
                    for (let i = 2; i >= 0; i--) {
                        const date = new Date();
                        date.setDate(currentDate.getDate() - i);

                        // Chuyển đổi sang múi giờ Việt Nam
                        const vietnamDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
                        const dateString = vietnamDate.toISOString().split("T")[0]; // Chỉ lấy ngày (yyyy-mm-dd)

                        dates.push(dateString);

                        // Tính doanh thu theo ngày (sử dụng múi giờ Việt Nam để so sánh)
                        const revenueForDay = orders
                            .filter(order => {
                                const orderDate = new Date(order.created_at);
                                const vietnamOrderDate = new Date(orderDate.getTime() + 7 * 60 * 60 * 1000);
                                return vietnamOrderDate.toISOString().split("T")[0] === dateString && order.status === "Đã giao hàng";
                            })
                            .reduce((sum, order) => sum + order.total_price, 0);

                        dailyRevenue.push(revenueForDay);
                    }
                    setRevenueLast7Days(dailyRevenue.reduce((a, b) => a + b, 0));
                    setRevenuePerDay({ dates, revenues: dailyRevenue });

                    // Đơn hàng gần đây
                    const sortedOrders = [...orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

// Chuyển đổi sang múi giờ Việt Nam và định dạng hiển thị
                    const recentOrdersWithFormattedDate = sortedOrders.slice(0, 7).map(order => ({
                        ...order,
                        formattedDate: new Date(order.created_at).toLocaleString("vi-VN", {
                            timeZone: "Asia/Ho_Chi_Minh", // Chuyển sang múi giờ UTC+7
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                        }),
                    }));


                    setRecentOrders(recentOrdersWithFormattedDate);


                    // Lọc top 5 khách hàng có tổng chi tiêu cao nhất
                    const accountSpending = orders.reduce((acc, order) => {
                        const { account_id, total_price } = order;
                        if (!acc[account_id]) {
                            acc[account_id] = 0;
                        }
                        acc[account_id] += total_price;
                        return acc;
                    }, {});
                    const updatedAccounts = accounts.map(account => ({
                        ...account,
                        total_spent: accountSpending[account.id] || 0,
                    }));
                    const topConsumers = updatedAccounts.sort((a, b) => b.total_spent - a.total_spent).slice(0, 10);
                    setTopConsumers(topConsumers);
                } catch (error) {
                    console.error("Error fetching data", error);
                }
            };
            fetchData();
        }, []);

        const ordersPerDay = revenuePerDay.dates.map((date) => {
            return orders.filter((order) => {
                // Chuyển đổi ngày tạo của đơn hàng sang múi giờ Việt Nam
                const orderDate = new Date(order.created_at);
                const vietnamOrderDate = new Date(orderDate.getTime() + 7 * 60 * 60 * 1000);

                // So sánh chỉ ngày (yyyy-mm-dd)
                return vietnamOrderDate.toISOString().split("T")[0] === date;
            }).length; // Đếm số lượng đơn hàng
        });

        const ordersData = {
            labels: revenuePerDay.dates,
            datasets: [
                {
                    label: "Số lượng đơn hàng",
                    data: ordersPerDay,
                    backgroundColor: "#3B82F6",
                    borderColor: "#2563EB",
                    pointBackgroundColor: "#60A5FA",
                    pointBorderColor: "#1E3A8A",
                    tension: 0.4,
                    fill: false,
                },
            ],
        };

        const revenueData = {
            labels: revenuePerDay.dates,
            datasets: [
                {
                    label: "Doanh Thu",
                    data: revenuePerDay.revenues,
                    backgroundColor: "#10B981",
                    borderColor: "#10B981",
                    borderWidth: 1,
                    borderRadius: 10,
                    hoverBackgroundColor: "#34D399",
                    hoverBorderColor: "#2D6A4F",
                    hoverBorderWidth: 2,
                    barPercentage: 0.6,
                },
            ],
        };

        return (
            <AdminLayout>
                <div className="p-6 bg-gray-50 min-h-screen">
                    <h1 className="text-2xl font-bold text-gray-800 mb-8 mt-10">Bảng Điều Khiển</h1>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-lg font-medium mb-4">Tổng số đơn hàng</h2>
                            <p className="text-3xl font-bold">{totalOrders}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-lg font-medium mb-4">Tổng doanh thu</h2>
                            <p className="text-3xl font-bold">{totalRevenue} đ</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-lg font-medium mb-4">Số người dùng</h2>
                            <p className="text-3xl font-bold">{newUsersCount}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-lg font-medium mb-4">Doanh Thu</h2>
                            <Bar data={revenueData} />
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-lg font-medium mb-4">Đơn hàng theo ngày</h2>
                            <Line data={ordersData} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-lg font-semibold mb-4 text-gray-800">Khách hàng thân thiết</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border-collapse rounded-lg shadow-md overflow-hidden">
                                    <thead>
                                    <tr className="bg-gray-100 border-b">
                                        <th className="px-6 py-3 text-left font-semibold text-gray-600">Tên</th>
                                        <th className="px-6 py-3 text-left font-semibold text-gray-600">Địa chỉ</th>
                                        <th className="px-6 py-3 text-left font-semibold text-gray-600">Tổng Chi Tiêu</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {topConsumers.map((user, index) => (
                                        <tr
                                            key={user.id}
                                            className={`${
                                                index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                            } hover:bg-gray-100 transition-all duration-150`}
                                        >
                                            <td className="px-6 py-4 text-gray-800 font-medium">
                                                {user.first_name} {user.last_name}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{user.address}</td>
                                            <td className="px-6 py-4 text-green-600 font-bold">
                                                {user.total_spent.toLocaleString()} đ
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-lg font-semibold mb-4 text-gray-800">Đơn hàng gần đây</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border-collapse rounded-lg shadow-md overflow-hidden">
                                    <thead>
                                    <tr className="bg-gray-100 border-b">
                                        <th className="px-6 py-3 text-left font-semibold text-gray-600">ID</th>
                                        <th className="px-6 py-3 text-left font-semibold text-gray-600">Mã đơn</th>
                                        <th className="px-6 py-3 text-left font-semibold text-gray-600">Trạng thái</th>
                                        <th className="px-6 py-3 text-left font-semibold text-gray-600">Giá tiền</th>
                                        <th className="px-6 py-3 text-left font-semibold text-gray-600">Ngày tạo</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {recentOrders.map((order, index) => (
                                        <tr
                                            key={order.id}
                                            className={`${
                                                index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                            } hover:bg-gray-100 transition-all duration-150`}
                                        >
                                            <td className="px-6 py-4 text-gray-800 font-medium">{order.account_id}</td>
                                            <td className="px-6 py-4 text-gray-600">{order.id}</td>
                                            <td
                                                className={`px-6 py-4 ${
                                                    order.status === "Đã giao hàng"
                                                        ? "text-green-600 font-semibold"
                                                        : order.status === "Đang giao hàng"
                                                            ? "text-yellow-500 font-semibold"
                                                            : "text-gray-600"
                                                }`}
                                            >
                                                {order.status}
                                            </td>
                                            <td className="px-6 py-4 text-green-600 font-bold">
                                                {order.total_price.toLocaleString()} đ
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">{order.formattedDate}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        );
    };

    export default DashboardPage;
