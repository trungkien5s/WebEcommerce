import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {ecommerceAPI} from "../../config/config";



const AccountsPage = () => {
    const [accounts, setAccounts] = useState([]);
    const [filteredAccounts, setFilteredAccounts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedAccounts, setSelectedAccounts] = useState([]);
    const [editingAccount, setEditingAccount] = useState(null);
    const [editedCustomerData, setEditedCustomerData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        address: '',
        date_of_birth: '',
        gender: '',
        password: '',
        role: false,
    });
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const itemsPerPage = 5;
    const navigate = useNavigate();

    const apiURL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const response = await axios.get(`${apiURL}/accounts`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                        "Content-Type": "application/json",
                    },
                });
                setAccounts(response.data);
                setFilteredAccounts(response.data);
                setTotalPages(Math.ceil(response.data.length / itemsPerPage));
            } catch (error) {
                console.error("Error fetching accounts:", error.response?.status, error.response?.data);
                alert("Failed to fetch accounts. Please check your authentication or try again later.");
            }
        };

        fetchAccounts();
    }, []);

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);
        const filtered = accounts.filter((account) =>
            account.phone_number.toLowerCase().includes(value) ||
            account.email.toLowerCase().includes(value) ||
            `${account.first_name} ${account.last_name}`.toLowerCase().includes(value)
        );
        setFilteredAccounts(filtered);
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    };

    const handleEditAccount = () => {
        if (selectedAccounts.length === 1) {
            const selectedAccount = accounts.find((acc) => acc.id === selectedAccounts[0]);
            setEditingAccount(selectedAccount.id);
            setEditedCustomerData({ ...selectedAccount });
            setShowEditModal(true);
        } else if (selectedAccounts.length === 0) {
            alert("Vui lòng chọn một tài khoản để chỉnh sửa.");
        } else {
            alert("Chỉ có thể chỉnh sửa một tài khoản mỗi lần.");
        }
    };

    const handleSaveAccount = async () => {
        // Kiểm tra dữ liệu bắt buộc
        if (!editedCustomerData.first_name || !editedCustomerData.last_name || !editedCustomerData.email) {
            alert("Vui lòng điền đầy đủ thông tin Họ, Tên, và Email.");
            return;
        }

        // Chuẩn bị payload cho thông tin khác ngoài `role`
        const { role, ...payload } = {
            first_name: editedCustomerData.first_name || "",
            last_name: editedCustomerData.last_name || "",
            email: editedCustomerData.email || "",
            phone_number: editedCustomerData.phone_number || "",
            address: editedCustomerData.address || "",
            date_of_birth: editedCustomerData.date_of_birth || null,
            gender: editedCustomerData.gender || "",
            password: editedCustomerData.password || "",
            total_spent: editedCustomerData.total_spent || 0,
        };

        try {
            // Gửi yêu cầu cập nhật thông tin tài khoản (không bao gồm vai trò)
            const response = await axios.put(
                `${apiURL}/accounts/${editingAccount}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log("Cập nhật thông tin tài khoản thành công:", response.data);

            // Nếu vai trò (`role`) thay đổi, gọi API riêng để cập nhật vai trò
            if (editedCustomerData.role !== null) {
                try {
                    const roleResponse = await axios.put(
                        `${apiURL}/accounts/${editingAccount}/role`,
                        null, // Không có body, chỉ cần truyền query parameter
                        {
                            params: {
                                new_role: editedCustomerData.role === true, // Chuyển thành boolean
                            },
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                                "Content-Type": "application/json",
                            },
                        }
                    );
                    console.log("Cập nhật vai trò thành công:", roleResponse.data);
                } catch (roleError) {
                    console.error("Lỗi khi cập nhật vai trò:", roleError.response?.data || roleError.message);
                    alert("Cập nhật thông tin tài khoản thành công nhưng cập nhật vai trò thất bại.");
                }
            }

            // Cập nhật danh sách tài khoản trong state
            setAccounts((prevAccounts) =>
                prevAccounts.map((acc) =>
                    acc.id === editingAccount ? { ...acc, ...payload, role: editedCustomerData.role } : acc
                )
            );
            setFilteredAccounts((prevFiltered) =>
                prevFiltered.map((acc) =>
                    acc.id === editingAccount ? { ...acc, ...payload, role: editedCustomerData.role } : acc
                )
            );
            setShowEditModal(false);
            alert("Cập nhật tài khoản thành công!");
        } catch (error) {
            if (error.response) {
                console.error("Chi tiết lỗi từ backend:", error.response.data);
                alert(`Lỗi server: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
            } else {
                console.error("Lỗi không kết nối server:", error.message);
                alert("Không thể kết nối với server. Vui lòng thử lại.");
            }
        }
    };

    const handleDeleteTrigger = () => {
        if (selectedAccounts.length === 0) {
            alert("Please select at least one account to delete.");
        } else {
            setShowDeleteModal(true);
        }
    };

    const handleConfirmDelete = async () => {
        try {
            for (const id of selectedAccounts) {
                await axios.delete(`${apiURL}/accounts/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                        "Content-Type": "application/json"
                        ,
                    },
                });
            }
            setAccounts(accounts.filter((acc) => !selectedAccounts.includes(acc.id)));
            setShowDeleteModal(false);
            setSelectedAccounts([]);
            setShowSuccessModal(true);
            setTimeout(() => setShowSuccessModal(false), 3000);
        } catch (error) {
            console.error("Error deleting accounts:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedCustomerData((prevData) => ({
            ...prevData,
            [name]:
                name === "role"
                    ? value === "true" // Chuyển giá trị role thành boolean
                    : value,
        }));
    };

    const toggleSelectAccounts = (id) => {
        setSelectedAccounts((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((accId) => accId !== id)
                : [...prevSelected, id]
        );
    };

    const changePage = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentAccounts = filteredAccounts.slice(startIndex, startIndex + itemsPerPage);

    const handleExport = () => {
        const csvContent = `data:text/csv;charset=utf-8,${[
            ["ID", "First Name", "Last Name", "Email", "Phone Number", "Address", "Date of Birth", "Gender", "Password", "Role"],
            ...filteredAccounts.map((account) => [
                account.id,
                account.first_name,
                account.last_name,
                account.email,
                account.phone_number,
                account.address,
                account.date_of_birth,
                account.gender,
                account.password,
                account.role,
            ]),
        ]
            .map((row) => row.join(","))
            .join("\n")}`;

        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute("download", "accounts.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
            <AdminLayout>
                <div className="p-6 ml-30 max-w-6xl">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 w-full sm:w-auto mb-8 mt-10">Danh sách tài khoản</h1>
                        <div className="flex gap-4 w-full sm:w-auto justify-between sm:justify-end">
                            <button
                                className="px-4 py-2 bg-white text-black rounded-lg border border-[#d6daec] hover:bg-gray-200"
                                onClick={handleExport}
                            >
                                Xuất
                            </button>


                        </div>
                    </div>


                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-b">

                            <div className="relative w-full sm:w-auto mt-5 ">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm tài khoản..."
                                    className="border border-gray-600 rounded-lg px-4 py-2 pl-10"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="24px"
                                    viewBox="0 -960 960 960"
                                    width="24px"
                                    fill="#5f6368"
                                    className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2"
                                >
                                    <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
                                </svg>






                            </div>


                            <div className="flex gap-4 ml-auto w-full sm:w-auto justify-between sm:justify-end">
                                <button
                                    className="px-4 py-2 bg-white-500 text-gray-600 bg-white rounded border border-blue-400 hover:bg-blue-500 cursor-pointer"
                                    onClick={handleEditAccount}
                                >
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill=""><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z"/></svg>
                                </span>
                                </button>

                                <button
                                    className="px-4 py-2 bg-white-500 text-blue-400 bg-white border border-blue-400 rounded hover:bg-red-500 cursor-pointer"
                                    onClick={handleDeleteTrigger}
                                >
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill=""><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                                </span>
                                </button>
                            </div>
                        </div>
                    </div>


                    {/* Table */}
                    <div className="overflow-x-auto rounded-lg shadow-lg">
                        <table className="w-full text-center ">
                            <thead className="bg-gray-300">
                            <tr>
                                <th className="p-4 text-center border border-gray-400">
                                    <input
                                        type="checkbox"
                                        onChange={(e) => {
                                            const checked = e.target.checked;
                                            setSelectedAccounts(
                                                checked ? accounts.map((account) => account.id) : []
                                            );
                                        }}
                                        checked={selectedAccounts.length === accounts.length && accounts.length > 0}
                                    />
                                </th>
                                <th className="border border-gray-400 p-2">ID</th>
                                <th className="border border-gray-400 p-2">Họ</th>
                                <th className="border border-gray-400 p-2">Tên</th>
                                <th className="border border-gray-400 p-2">Email</th>
                                <th className="border border-gray-400 p-2">Số điện thoại</th>
                                <th className="border border-gray-400 p-2">Địa chỉ</th>
                                <th className="border border-gray-400 p-2">Ngày sinh</th>
                                <th className="border border-gray-400 p-2">Giới tính</th>
                                <th className="border border-gray-400 p-2">Quyền</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentAccounts.length > 0 ? (
                                currentAccounts.map((account, index) => (
                                    <tr
                                        key={account.id}
                                        className="border border-gray-400 hover:bg-gray-100 text-white"
                                    >
                                        <td className="p-4 text-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedAccounts.includes(account.id)}
                                                onChange={() => toggleSelectAccounts(account.id)}
                                            />
                                        </td>
                                        <td className="py-3 px-4 border border-gray-400 text-black">{`#${account.id}`}</td>
                                        <td className="py-3 px-4 border border-gray-400 text-black">{account.first_name}</td>
                                        <td className="py-3 px-4 border border-gray-400 text-black">{account.last_name}</td>
                                        <td className="py-3 px-4 border border-gray-400 text-black">{account.email}</td>
                                        <td className="py-3 px-4 border border-gray-400 text-black">{account.phone_number}</td>
                                        <td className="py-3 border border-gray-400 text-black">{account.address || "N/A"}</td>
                                        <td className="py-3 border border-gray-400 text-black">{account.date_of_birth || "N/A"}</td>
                                        <td className="py-3 border border-gray-400 text-black">{account.gender || "N/A"}</td>
                                        <td className="py-3 px-4 border border-gray-400 text-black truncate">
                                            {account.role ? "Admin" : "User"}
                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="10" className="p-4 text-center">
                                        Không có tài khoản nào được tìm thấy.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>

                    {/* Edit Modal */}
                    {/* Edit Modal */}
                    {showEditModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg p-6 w-96 sm:w-full sm:max-w-xs shadow-lg">
                                <h2 className="text-xl font-semibold mb-4">Chỉnh sửa thông tin tài khoản</h2>

                                {/* Email */}
                                <div className="mb-4">
                                    <label className="block mb-1">Email <span className="text-red-500">*</span></label>
                                    <input
                                        type="email"
                                        value={editedCustomerData.email || ''}
                                        name="email"
                                        onChange={handleInputChange}
                                        className="border rounded w-full p-2"
                                        required
                                    />
                                </div>

                                {/* Số điện thoại */}
                                <div className="mb-4">
                                    <label className="block mb-1">Số điện thoại</label>
                                    <input
                                        type="text"
                                        value={editedCustomerData.phone_number || ''}
                                        name="phone_number"
                                        onChange={handleInputChange}
                                        className="border rounded w-full p-2"
                                    />
                                </div>

                                {/* Địa chỉ */}
                                <div className="mb-4">
                                    <label className="block mb-1">Địa chỉ</label>
                                    <input
                                        type="text"
                                        value={editedCustomerData.address || ''}
                                        name="address"
                                        onChange={handleInputChange}
                                        className="border rounded w-full p-2"
                                    />
                                </div>

                                {/* Mật khẩu */}
                                <div className="mb-4">
                                    <label className="block mb-1">Mật khẩu</label>
                                    <input
                                        type="text"
                                        value={editedCustomerData.password || ''}
                                        name="password"
                                        onChange={handleInputChange}
                                        className="border rounded w-full p-2"
                                    />
                                </div>

                                {/* Quyền */}
                                <div className="mb-4">
                                    <label className="block mb-1">Quyền</label>
                                    <select
                                        name="role"
                                        value={editedCustomerData.role ? "true" : "false"}
                                        onChange={handleInputChange}
                                        className="border rounded w-full p-2"
                                    >
                                        <option value="false">User</option>
                                        <option value="true">Admin</option>
                                    </select>
                                </div>

                                <div className="flex justify-end gap-4">
                                    <button
                                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                        onClick={() => setShowEditModal(false)}
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        onClick={handleSaveAccount}
                                    >
                                        Lưu
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}



                    {/* Delete Modal */}
                    {showDeleteModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg p-6 w-96 sm:w-full sm:max-w-xs shadow-lg">
                                <h2 className="text-xl font-semibold mb-4">Xác nhận</h2>
                                <p className="mb-4 text-gray-600">
                                    Bạn có chắc chắn muốn xóa các tài khoản đã chọn không?
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

                    {/* Pagination */}
                    <div className="p-4 flex justify-between items-center">
                        <p>
                            Hiển thị {Math.min((currentPage - 1) * itemsPerPage + 1, accounts.length)}-
                            {Math.min(currentPage * itemsPerPage, accounts.length)} trong {accounts.length}
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => changePage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#5f6368">
                                    <path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" />
                                </svg>
                            </button>
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => changePage(index + 1)}
                                    className={`px-3 py-1 rounded ${currentPage === index + 1 ? "bg-blue-200 text-blue-600" : "bg-gray-200"}`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => changePage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#5f6368">
                                    <path d="M600-80l400-400-400-400-71 71 329 329-329 329 71 71Z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    {/* Success Modal */}
                    {showSuccessModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-8 rounded-lg max-w-md sm:max-w-xs modal-enter-active">
                                <h3 className="text-xl font-semibold mb-4">Thông báo</h3>
                                <p>Tài khoản đã được xóa thành công!</p>
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



                </div>
            </AdminLayout>

    );
};

export default AccountsPage;
