import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import {ecommerceAPI} from "../../config/config";

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [filterStatus, setFilterStatus] = useState("");
    const [statuses, setStatuses] = useState([]); // Store unique statuses
    const itemsPerPage = 5;
    const [showSuccessModal, setShowSuccessModal] = useState(false); // Track success modal visibility
    const [filtereOrders, setFilteredOrders] = useState([]); // Dữ liệu đã lọc
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const [editedCustomerData, setEditedCustomerData] = useState({
        account_id: '',
        cart_id: '',
        total_price: '',
        status: ''
    });
    const [showDeleteModal, setShowDeleteModal] = useState(null); // Track the order being deleted
    const [selectedOrderDetails, setSelectedOrderDetails] = useState({});

    const navigate = useNavigate();
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const apiURL = process.env.REACT_APP_API_URL;

    // Fetch orders from db.json
    const fetchOrders = async () => {
        try {
            const response = await fetch(`${apiURL}/orders`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            console.log("Orders fetched from API:", data); // Log dữ liệu orders
            setOrders(data);

            // Extract unique statuses
            const uniqueStatuses = [...new Set(data.map((order) => order.status))];
            setStatuses(uniqueStatuses);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchOrders(); // Lấy danh sách đơn hàng
        };
        fetchData();


    }, []);


    // Handle delete

// Handle delete trigger (show modal)
    const handleDeleteTrigger = () => {
        if (selectedOrders.length === 0) {
            alert("Vui lòng chọn ít nhất một đơn hàng để xóa.");
        } else {
            setShowDeleteModal(true); // Show the delete confirmation modal
        }
    };

// Confirm and delete selected orders
    const handleConfirmDelete = async () => {
        try {
            for (const id of selectedOrders) {
                await fetch(`${apiURL}/orders/${id}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                        "Content-Type": "application/json",
                    },
                });
            }
            setOrders(orders.filter((order) => !selectedOrders.includes(order.id)));
            setShowDeleteModal(false); // Close delete confirmation modal
            setSelectedOrders([]); // Clear selection
            setShowSuccessModal(true); // Show success modal
            setTimeout(() => setShowSuccessModal(false), 3000); // Automatically hide after 3 seconds
        } catch (error) {
            console.error("Error deleting orders:", error);
        }
    };
 // Handle checkbox selection
    const toggleSelectOrder = (id) => {
        setSelectedOrders((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((orderId) => orderId !== id)
                : [...prevSelected, id]
        );
    };

    // Filter and paginate orders
    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.status?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter =
            filterStatus === "" ||
            order.status?.toLowerCase() === filterStatus.toLowerCase();
        return matchesSearch && matchesFilter;
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentOrders = filteredOrders.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

    const changePage = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };



    // Fetch details of a specific order
    const fetchOrderDetails = async (orderId) => {
        try {
            const response = await fetch(`${apiURL}/orders/${orderId}/items`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            });

            if (!response.ok) {
                if (response.status === 404) {
                    alert(`Không tìm thấy chi tiết đơn hàng với ID: ${orderId}`);
                    return;
                } else {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            }

            const items = await response.json();

            if (!Array.isArray(items)) {
                throw new TypeError("API response is not an array");
            }

            const detailedItems = await Promise.all(
                items.map(async (item) => {
                    const productResponse = await fetch(`${apiURL}/products/${item.product_id}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                        },
                    });

                    if (!productResponse.ok) {
                        throw new Error(`Failed to fetch product ${item.product_id}`);
                    }

                    const product = await productResponse.json();
                    return {
                        ...item,
                        productName: product.name,
                        productDescription: product.description,
                        productPrice: product.price,
                    };
                })
            );

            setSelectedOrderDetails((prev) => ({
                ...prev,
                [orderId]: detailedItems,
            }));
            setSelectedOrderId(orderId);
            setShowDetailsModal(true);
        } catch (error) {
            console.error("Error fetching order details:", error);
            alert("Có lỗi xảy ra khi lấy chi tiết đơn hàng. Vui lòng thử lại sau.");
        }
    };


    const displayPages = () => {
        const maxVisiblePages = 5;
        let start = Math.max(1, currentPage - 2);
        let end = Math.min(totalPages, start + maxVisiblePages - 1);

        if (end === totalPages) {
            start = Math.max(1, end - maxVisiblePages + 1);
        }

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };


    return (
        <AdminLayout>
            <div className="p-6 max-w-screen-xl mx-auto">
                <div className="flex flex-wrap justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 w-full sm:w-auto mb-8 mt-10">Đơn hàng</h1>

                </div>



                {/* Delete Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-96 sm:w-full sm:max-w-xs shadow-lg">
                            <h2 className="text-xl font-semibold mb-4">Xác nhận</h2>
                            <p className="mb-4 text-gray-600">
                                Bạn có chắc chắn muốn xóa các đơn hàng đã chọn không?
                            </p>
                            <div className="flex justify-end gap-4">
                                <button
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                    onClick={() => setShowDeleteModal(false)} // Close modal without deleting
                                >
                                    Hủy
                                </button>
                                <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    onClick={handleConfirmDelete} // Confirm deletion
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                )}


                {/* Success Modal */}
                {showSuccessModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-8 rounded-lg max-w-md sm:max-w-xs modal-enter-active">
                            <h3 className="text-xl font-semibold mb-4">Thông báo</h3>
                            <p>Đơn hàng đã được xóa thành công!</p>
                            <div className="flex justify-end gap-4 mt-4">
                                <button
                                    onClick={() => setShowSuccessModal(false)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-lg">
                    <div
                        className="flex flex-col sm:flex-row justify-between items-center p-4 border-b gap-4"
                        style={{ marginTop: "20px" }} // Thêm margin để dịch xuống
                    >
                        {/* Bộ lọc */}
                        <div className="relative">
                            <select
                                className="border border-gray-600 rounded-lg px-4 py-2 appearance-none"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                style={{
                                    minWidth: "120px", // Chiều rộng tối thiểu
                                    maxWidth: "150px", // Chiều rộng tối đa
                                    padding: "0.5rem 1rem", // Padding để tạo khoảng cách
                                    textAlign: "left", // Căn chữ về bên trái
                                }}
                            >
                                <option value="">Tất cả</option>
                                {statuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>

                            {/* Icon dropdown */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none"
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>


                        {/* Ô tìm kiếm */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Tìm kiếm khách hàng..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border border-gray-600 rounded-lg px-4 py-2 pl-10"
                            />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24px"
                                viewBox="0 -960 960 960"
                                width="24px"
                                fill="#5f6368"
                                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                            >
                                <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
                            </svg>
                        </div>

                        {/* Các nút chức năng */}
                        <div className="flex gap-4 ml-auto mb-3">
                            <button
                                className="px-4 py-2 bg-white text-blue-400 border border-blue-400 rounded hover:bg-red-500"
                                onClick={handleDeleteTrigger}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="black">
                                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-center">
                            <thead className="bg-gray-300 sticky top-0">
                            <tr>
                                <th className="p-4 border border-gray-400 text-center ">
                                    <input
                                        type="checkbox"
                                        onChange={(e) => {
                                            const checked = e.target.checked;
                                            setSelectedOrders(
                                                checked ? orders.map((order) => order.id) : []
                                            );
                                        }}
                                        checked={selectedOrders.length === orders.length && orders.length > 0}
                                    />
                                </th>
                                <th className="border border-gray-400 p-4">ID Đơn hàng</th>
                                <th className="border border-gray-400 p-4">ID Khách hàng</th>
                                <th className="border border-gray-400 p-4">Trạng thái thanh toán</th>
                                <th className="border border-gray-400 p-4">Tổng số tiền</th>
                                <th className="border border-gray-400 p-4">Chi tiết</th>
                            </tr>
                            </thead>
                            <tbody>
                            { currentOrders.length > 0 ? (currentOrders.map((order) => (
                                    <tr key={order.id} className="border-b hover:bg-gray-100 border border-gray-300">
                                        <td className="p-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedOrders.includes(order.id)}
                                                onChange={() => toggleSelectOrder(order.id)}
                                            />
                                        </td>
                                        <td className="p-4 border border-gray-300">{order.id}</td>
                                        <td className="p-4 border border-gray-300">{order.account_id}</td>
                                        <td className="p-4 border border-gray-300">{order.status}</td>
                                        <td className="p-4 border border-gray-300">{order.total_price.toLocaleString()} đ</td>
                                        <td className="p-4 border border-gray-300">
                                            <button
                                                className="px-3 py-2 bg-blue-500 hover:bg-blue-300 rounded-lg text-white flex items-center gap-2"
                                                onClick={() => fetchOrderDetails(order.id)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="white"><path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>

                                            </button>
                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="p-4 text-center">
                                        Không có đơn hàng nào được tìm thấy.
                                    </td>
                                </tr>
                            )}



                            </tbody>
                        </table>

                        {showDetailsModal && selectedOrderDetails[selectedOrderId] && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-white p-6 rounded-lg max-w-lg shadow-lg">
                                    <h2 className="text-xl font-bold mb-4">Chi tiết đơn hàng #{selectedOrderId}</h2>
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                        <tr className="bg-gray-200">
                                            <th className="border p-2">Tên sản phẩm</th>
                                            <th className="border p-2">Số lượng</th>
                                            <th className="border p-2">Giá mỗi sản phẩm</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {selectedOrderDetails[selectedOrderId].map((item) => (
                                            <tr key={item.product_id}>
                                                <td className="border p-2">{item.productName}</td>
                                                <td className="border p-2">{item.quantity}</td>
                                                <td className="border p-2">{item.productPrice.toLocaleString()} đ</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                    <div className="flex justify-end mt-4">
                                        <button
                                            onClick={() => setShowDetailsModal(false)}
                                            className="px-4 py-2 bg-blue-500 text-white rounded"
                                        >
                                            Đóng
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Pagination */}
                    <div className="p-4 flex justify-between items-center">
                        <p>
                            Hiển thị {Math.min((currentPage - 1) * itemsPerPage + 1, orders.length)}-
                            {Math.min(currentPage * itemsPerPage, orders.length)} trong {orders.length}
                        </p>
                        <div className="flex gap-2">
                            <button
                                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                                disabled={currentPage === 1}
                                onClick={() => changePage(currentPage - 1)}
                            >
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                                <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/>
                            </svg>
                        </span>
                            </button>
                            {displayPages().map((page) => (
                                <button
                                    key={page}
                                    className={`px-3 py-1 border rounded ${
                                        currentPage === page ? "bg-blue-200 text-blue-600 " : "bg-gray-200"
                                    }`}
                                    onClick={() => changePage(page)}
                                >
                                    {page}
                                </button>
                            ))
                            }
                            <button
                                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                                disabled={currentPage === totalPages}
                                onClick={() => changePage(currentPage + 1)}
                            >
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                                <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/>
                            </svg>
                        </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default OrderPage;