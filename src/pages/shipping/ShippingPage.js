import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { ecommerceAPI } from "../../config/config";

const ShippingPage = () => {
    const [orderId, setOrderId] = useState(""); // Lưu trữ order_id người dùng nhập
    const [shipping, setShipping] = useState(null); // Lưu trữ thông tin vận chuyển
    const [loading, setLoading] = useState(false); // Hiển thị trạng thái đang tải
    const [error, setError] = useState(""); // Lưu trữ lỗi khi gọi API
    const [showEditModal, setShowEditModal] = useState(false); // Modal chỉnh sửa
    const [editingShipping, setEditingShipping] = useState(null); // Shipping đang chỉnh sửa
    const [statusOptions] = useState(["Chờ lấy hàng", "Đang vận chuyển", "Đã vận chuyển"]); // Tùy chọn trạng thái


    const apiURL = process.env.REACT_APP_API_URL;

    // Gọi API để lấy thông tin vận chuyển
    const fetchShipping = async () => {
        if (!orderId) {
            setError("Vui lòng nhập Order ID.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${apiURL}/shippings/${orderId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 404) {
                setError("Không tìm thấy thông tin vận chuyển cho Order ID này.");
                return;
            }

            if (!response.ok) throw new Error("Không thể lấy thông tin vận chuyển.");
            const data = await response.json();
            setShipping(data);

            // Chỉ reset editingShipping nếu không mở modal chỉnh sửa
            if (!showEditModal) {
                setEditingShipping(data);
            }
        } catch (err) {
            console.error("Error fetching shipping:", err);
            setError("Đã xảy ra lỗi khi lấy thông tin vận chuyển.");
        } finally {
            setLoading(false);
        }
    };

    // Đồng bộ trạng thái giữa Shipping và Order
    const mapShippingToOrderStatus = (shippingStatus) => {
        switch (shippingStatus) {
            case "Chờ lấy hàng":
                return "Chờ giao hàng";
            case "Đang vận chuyển":
                return "Đang giao hàng";
            case "Đã vận chuyển":
                return "Đã giao hàng";
            default:
                return "Chờ giao hàng";
        }
    };

    // Cập nhật thông tin vận chuyển và đồng thời cập nhật trạng thái đơn hàng
    const handleSaveEdit = async () => {
        if (!editingShipping) return;

        setLoading(true);
        setError("");

        try {
            // Cập nhật thông tin vận chuyển
            const shippingResponse = await fetch(
                `${apiURL}/shippings/${editingShipping.id}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(editingShipping),
                }
            );

            if (!shippingResponse.ok) {
                const errorData = await shippingResponse.json();
                console.error("Lỗi khi cập nhật shipping:", errorData);
                throw new Error(`Cập nhật vận chuyển thất bại: ${errorData.detail || "Có lỗi xảy ra"}`);
            }

            const updatedShipping = await shippingResponse.json();

            // Đồng bộ trạng thái đơn hàng dựa trên trạng thái mới của vận chuyển
            const orderStatus = mapShippingToOrderStatus(updatedShipping.status);
            const orderResponse = await fetch(
                `${apiURL}/orders/${updatedShipping.order_id}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status: orderStatus }),
                }
            );

            if (!orderResponse.ok) {
                const errorData = await orderResponse.json();
                console.error("Lỗi khi cập nhật đơn hàng:", errorData);
                throw new Error("Cập nhật đơn hàng thất bại.");
            }

            // Cập nhật trạng thái và đóng modal
            setShipping(updatedShipping);
            setEditingShipping(updatedShipping);
            setShowEditModal(false);
            alert("Cập nhật thành công!");
        } catch (err) {
            console.error("Lỗi khi cập nhật thông tin:", err);
            alert(`Cập nhật thất bại: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const syncShippingWithOrders = async () => {
            try {
                const response = await fetch(`${apiURL}/orders`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Không thể đồng bộ thông tin vận chuyển.");
                }

                const orders = await response.json();
                for (const order of orders) {
                    if (order.status === "Chờ giao hàng") {
                        await fetch(`${apiURL}/shippings/`, {
                            method: "POST",
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                order_id: order.id,
                                address: order.address,
                                status: "Chờ lấy hàng",
                                shipped_at: null,
                                delivered_at: null,
                            }),
                        });
                    }
                }
            } catch (err) {
                console.error("Lỗi khi đồng bộ thông tin vận chuyển:", err);
            }
        };

        syncShippingWithOrders();
    }, []);

    return (
        <AdminLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-800 w-full sm:w-auto mb-8 mt-10">Quản lý vận chuyển</h1>

                {/* Nhập Order ID */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Nhập Order ID..."
                        className="border border-gray-500 rounded-lg px-4 py-2 mr-2"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                    />

                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                        onClick={fetchShipping}
                    >
                        Tìm kiếm
                    </button>
                </div>

                {/* Thông báo lỗi */}
                {error && <p className="text-red-500 mb-4">{error}</p>}

                {/* Loading */}
                {loading && <p>Đang tải...</p>}

                {/* Hiển thị thông tin vận chuyển */}
                {shipping && (
                    <div className="bg-white rounded-lg shadow-lg p-4">
                        <h2 className="text-xl font-bold mb-4">Thông tin vận chuyển</h2>
                        <p><strong>ID:</strong> {shipping.id}</p>
                        <p><strong>Order ID:</strong> {shipping.order_id}</p>
                        <p><strong>Địa chỉ:</strong> {shipping.address}</p>
                        <p><strong>Trạng thái:</strong> {shipping.status}</p>
                        <p>
                            <strong>Ngày giao:</strong>{" "}
                            {shipping.shipped_at ? new Date(shipping.shipped_at).toLocaleDateString() : "Chưa có"}
                        </p>
                        <p>
                            <strong>Ngày hoàn thành:</strong>{" "}
                            {shipping.delivered_at ? new Date(shipping.delivered_at).toLocaleDateString() : "Chưa có"}
                        </p>
                        <button
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                            onClick={async () => {
                                await fetchShipping();
                                setEditingShipping({ ...shipping });
                                setShowEditModal(true);
                            }}
                        >
                            Sửa thông tin
                        </button>
                    </div>
                )}

                {/* Edit Modal */}
                {showEditModal && editingShipping && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
                            <h3 className="text-xl font-bold mb-4">Chỉnh sửa vận chuyển</h3>

                            {/* Address Field */}
                            <div className="mb-4">
                                <label className="block mb-2">Địa chỉ</label>
                                <input
                                    type="text"
                                    value={editingShipping?.address || ""}
                                    onChange={(e) =>
                                        setEditingShipping((prev) => ({
                                            ...prev,
                                            address: e.target.value,
                                        }))
                                    }
                                    className="border rounded w-full p-2"
                                />

                            </div>

                            {/* Shipped At Field */}
                            <div className="mb-4">
                                <label className="block mb-2">Ngày giao</label>
                                <input
                                    type="datetime-local"
                                    value={editingShipping.shipped_at ? editingShipping.shipped_at.slice(0, 16) : ""}
                                    onChange={(e) =>
                                        setEditingShipping((prev) => ({
                                            ...prev,
                                            shipped_at: e.target.value,
                                        }))
                                    }
                                    className="border rounded w-full p-2"
                                />
                            </div>

                            {/* Delivered At Field */}
                            <div className="mb-4">
                                <label className="block mb-2">Ngày hoàn thành</label>
                                <input
                                    type="datetime-local"
                                    value={editingShipping.delivered_at ? editingShipping.delivered_at.slice(0, 16) : ""}
                                    onChange={(e) =>
                                        setEditingShipping((prev) => ({
                                            ...prev,
                                            delivered_at: e.target.value,
                                        }))
                                    }
                                    className="border rounded w-full p-2"
                                />
                            </div>

                            {/* Status Field */}
                            <select
                                value={editingShipping.status}
                                onChange={(e) =>
                                    setEditingShipping((prev) => ({
                                        ...prev,
                                        status: e.target.value,
                                    }))
                                }
                                className="border rounded w-full p-2"
                            >
                                {statusOptions.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>

                            {/* Save and Cancel Buttons */}
                            <div className="flex justify-between gap-2">
                                <button
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                    onClick={() => setShowEditModal(false)}
                                >
                                    Hủy
                                </button>
                                <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    onClick={handleSaveEdit}
                                >
                                    Lưu
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </AdminLayout>
    );
};

export default ShippingPage;
