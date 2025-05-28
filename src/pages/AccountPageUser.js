import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/HomePage/Header/Header";
import Subscribe from "../components/ShopPage/Subscribe/Subscribe";
import Footer from "../components/ShopPage/Footer/Footer";
import "./AccountPageUser.css"

const AccountPageUser = () => {

  const apiURL = process.env.REACT_APP_API_URL;

  const [userInfo, setUserInfo] = useState({});
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null); // Lưu trữ chi tiết sản phẩm trong đơn hàng
  const [loading, setLoading] = useState(false);

  // Lấy thông tin người dùng và danh sách đơn hàng khi trang được tải
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      try {
        const response = await axios.get(`${apiURL}/accounts/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserInfo(response.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    const fetchUserOrders = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      try {
        const response = await axios.get(`${apiURL}/orders/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
        console.log("Orders Data:", response.data); // Gỡ lỗi
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchUserInfo();
    fetchUserOrders();
  }, []);

  // Lấy chi tiết đơn hàng theo `order_id`
  const fetchOrderDetails = async (orderId) => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    setOrderDetails(null); // Xóa dữ liệu cũ trước khi gọi API mới
    setLoading(true);

    try {
      console.log(`Fetching order items for order ID: ${orderId}`); // Gỡ lỗi

      const orderItemsResponse = await axios.get(
          `${apiURL}/orders/${orderId}/items`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
      );

      const orderItems = orderItemsResponse.data;
      if (orderItems.length === 0) {
        console.log("No items found for this order.");
        setOrderDetails([]);
        setLoading(false);
        return;
      }

      console.log("Order Items:", orderItems);

      const productDetails = [];

      // Lấy thông tin chi tiết sản phẩm từ product_id
      for (let item of orderItems) {
        const productResponse = await axios.get(
            `${apiURL}/products/${item.product_id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
        );

        productDetails.push({
          ...productResponse.data,
          quantity: item.quantity,
          price_per_item: item.price_per_item,
        });
      }

      // Cập nhật chi tiết sản phẩm
      setOrderDetails(productDetails);
    } catch (error) {
      console.error("Error fetching order items or product details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi nhấn "View Details"
  const handleOrderClick = (order) => {
    fetchOrderDetails(order.id);
  };

  return (
      <>
        <Header />
        <div className="account-user-container">
          <div className="account-page">
            <div className="infor-user">
              <h1>Thông tin cá nhân:</h1>
              <div className="inner-infor-user">
                <p>Tên: {userInfo.last_name || "N/A"}</p>
                <p>Email: {userInfo.email || "N/A"}</p>
                <p>Số điện thoại: {userInfo.phone_number || "N/A"}</p>
              </div>
            </div>

            <div className="table-order">
              <h2>Đơn hàng đã tạo:</h2>
              <table>
                <thead>
                <tr>
                  <th>Ngày</th>
                  <th>Tổng số tiền</th>
                  <th>Trạng thái vận chuyển</th>
                  <th>Sản phẩm</th>
                </tr>
                </thead>
                <tbody>
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <tr key={order.id}>
                          <td>{new Date(order.created_at).toLocaleDateString()}</td>
                          <td>{order.total_price.toLocaleString()} VND</td>
                          <td>{order.status}</td>
                          <td>
                            <button onClick={() => handleOrderClick(order)}>Xem chi tiết</button>
                          </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                      <td colSpan="5">Không tìm thấy sản phẩm.</td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>


            {loading && <p>Loading...</p>}

            {orderDetails && orderDetails.length > 0 ? (
                <div>
                  <h3>Chi tiết đơn hàng:</h3>
                  <table>
                    <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Ảnh</th>
                      <th>Số lượng</th>
                      <th>Giá</th>
                      <th>Tổng số tiền</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orderDetails.map((product, index) => (
                        <tr key={index}>
                          <td>{product.name}</td>
                          <td>
                            <img
                                src={product.image || "placeholder.jpg"}
                                alt={product.name || "No Image"}
                                width="50"
                            />
                          </td>
                          <td>{product.quantity}</td>
                          <td>{product.price_per_item.toLocaleString()} VND</td>
                          <td>{(product.price_per_item * product.quantity).toLocaleString()} VND</td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
            ) : (
                !loading && <p>Không tìm thấy sản phẩm trong đơn hàng.</p>
            )}
          </div>
        </div>

        <Subscribe />
        <hr></hr>
        <Footer />
      </>

  );
};

export default AccountPageUser;