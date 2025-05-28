import React from "react";
import "./CheckOutForm.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CheckoutForm({ chosenItems, totalPrice, cartId, onOrderSuccess }) {

  const apiURL = process.env.REACT_APP_API_URL;

  const navigate = useNavigate()

  const handlePayNow = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const headers = { Authorization: `Bearer ${token}` };

      // Gửi yêu cầu tạo đơn hàng
      const response = await axios.post(
          `${apiURL}/orders/`,
          {
            cart_id: cartId,
            total_price: totalPrice,
          },
          { headers }
      );

      console.log("Order created:", response.data);

      // Gọi callback khi đặt hàng thành công
      onOrderSuccess();

      alert("Order placed successfully!");

      navigate("/account")
    } catch (error) {
      console.error("Error creating order:", error.response?.data || error.message);
      alert("Failed to place the order. Please try again.");
    }
  };

  return (
      <div className="checkout-container">
        <div className="checkout-form">
          <h2>Thông tin liên hệ</h2>
          <div className="form-group">
            <input type="email" placeholder="Email- SĐT" />
          </div>

          <button className="pay-now" onClick={handlePayNow}>
            Đặt Hàng
          </button>
          <footer>
            <p>Hãy mua ngay đừng chần chừ !!!</p>
          </footer>
        </div>
      </div>
  );
}

export default CheckoutForm;