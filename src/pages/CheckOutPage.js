import React, { useContext, useState, useEffect } from "react";

import axios from "axios";
import {CartContext} from "../components/ShopPage/ListProducts/CartContext";
import Header from "../components/HomePage/Header/Header";
import CheckoutForm from "../components/CheckOut/MainCheckOut";
import Subscribe from "../components/ShopPage/Subscribe/Subscribe";
import Footer from "../components/ShopPage/Footer/Footer";

import "../components/CheckOut/CheckOutPage.css"
function CheckOutPage() {

  const apiURL = process.env.REACT_APP_API_URL;

  const { cart, cartId } = useContext(CartContext); // Lấy giỏ hàng và cart_id từ context
  const [productDetails, setProductDetails] = useState({}); // Lưu thông tin sản phẩm chi tiết

  // Lọc các sản phẩm được chọn (is_chosen = true)
  const chosenItems = cart.filter((item) => item.is_chosen);

  // Tính tổng tiền
  const calculateTotalPrice = () => {
    return chosenItems.reduce((total, item) => total + item.price_per_item * item.quantity, 0);
  };

  // Lấy thông tin chi tiết của sản phẩm
  useEffect(() => {
    const fetchProductDetails = async () => {
      const token = localStorage.getItem("access_token");
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const productDetailsObj = {};
        // Duyệt qua các item trong giỏ hàng và lấy thông tin sản phẩm
        for (let item of chosenItems) {
          if (item.product_id && !productDetailsObj[item.product_id]) {
            const response = await axios.get(`${apiURL}/products/${item.product_id}`, { headers });
            productDetailsObj[item.product_id] = response.data;
          }
        }
        setProductDetails(productDetailsObj);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    if (chosenItems.length > 0) {
      fetchProductDetails();
    }
  }, [chosenItems]);

  // Hàm xử lý sau khi đặt hàng thành công
  const handleOrderSuccess = () => {
    alert("Your order has been placed successfully!");
    // Có thể reset giỏ hàng hoặc điều hướng người dùng
  };

  return (
      <div className="checkout-page-container">
        <Header />

        <div className="checkout-main-content">
          <div className="checkout-form-container">
            <CheckoutForm
                chosenItems={chosenItems} // Truyền danh sách sản phẩm được chọn
                totalPrice={calculateTotalPrice()} // Truyền tổng giá trị
                cartId={cartId} // Truyền cart_id
                onOrderSuccess={handleOrderSuccess} // Callback khi đặt hàng thành công
            />
          </div>

          <div className="checkout-cart-summary">
            <h2>Your Cart</h2>
            {chosenItems.length === 0 ? (
                <p>Your cart is empty. Please go back and select items.</p>
            ) : (
                <ul className="cart-summary-list">
                  {chosenItems.map((item) => {
                    const product = productDetails[item.product_id]; // Lấy thông tin sản phẩm từ state
                    return (
                        <li key={item.id} className="cart-summary-item">
                          {product && (
                              <>
                                <img
                                    src={product.image || "placeholder.jpg"}
                                    alt={product.name || "Unknown Product"}
                                    className="cart-item-image"
                                />
                                <div className="cart-item-info">
                                  <p>{product.name || "Unknown Product"}</p>
                                  <p>
                                    {item.quantity} x {item.price_per_item.toLocaleString()} VND
                                  </p>
                                </div>
                              </>
                          )}
                        </li>
                    );
                  })}
                </ul>
            )}
            <div className="cart-summary-total">
              <p>Total:</p>
              <p>{calculateTotalPrice().toLocaleString()} VND</p>
            </div>
          </div>
        </div>

        <Subscribe />
        <hr />
        <Footer  />
      </div>
  );
}

export default CheckOutPage;