import React, { useContext, useState, useMemo, useEffect } from "react";
import { CartContext } from "../ShopPage/ListProducts/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./FloatingCart.css";

const FloatingCart = () => {

  const apiURL = process.env.REACT_APP_API_URL;

  const { cart, toggleChosen, setCart, removeFromCart, updateQuantity } = useContext(CartContext);
  const [showCart, setShowCart] = useState(false);
  const [productDetails, setProductDetails] = useState({}); // Lưu trữ thông tin chi tiết của sản phẩm
  const navigate = useNavigate();

  // Tính tổng tiền, chỉ chạy lại khi cart thay đổi
  const totalPrice = useMemo(() => {
    return cart
        .filter((item) => item.is_chosen)
        .reduce((total, item) => total + (item.price_per_item || 0) * (item.quantity || 1), 0);
  }, [cart]);

  // Toggle hiển thị giỏ hàng
  const toggleCart = () => setShowCart(!showCart);

  // Lấy thông tin chi tiết của sản phẩm
  useEffect(() => {
    const fetchProductDetails = async () => {
      const token = localStorage.getItem("access_token");
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const productDetailsObj = {};
        // Duyệt qua các item trong giỏ hàng và lấy thông tin sản phẩm
        for (let item of cart) {
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

    if (cart.length > 0) {
      fetchProductDetails();
    }
  }, [cart]);

  // Xử lý chỉnh số lượng sản phẩm
  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      alert("Quantity must be greater than 0.");
      return;
    }

    try {
      await updateQuantity(itemId, newQuantity);
      const token = localStorage.getItem("access_token");
      const headers = { Authorization: `Bearer ${token}` };

      // Làm mới giỏ hàng sau khi cập nhật số lượng
      const response = await axios.get(`${apiURL}/cart_items/me`, { headers });
      setCart(response.data);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  // Xử lý xóa sản phẩm khỏi giỏ hàng
  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart(itemId);
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  // Xử lý chuyển sang trang thanh toán
  const handleCheckout = () => {
    const chosenItems = cart.filter((item) => item.is_chosen);
    if (cart.length === 0) {
      alert("Your cart is empty. Please add some products.");
      return;
    }
    navigate("/checkout", { state: { chosenItems } });
  };

  return (
      <div className="floating-cart-container">
        {/* Nút mở giỏ hàng */}
        <button className="floating-cart-icon" onClick={toggleCart}>
          🛒
          {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
        </button>

        {/* Popup hiển thị giỏ hàng */}
        {showCart && (
            <div className="cart-popup">
              <h2>Giỏ hàng:</h2>
              {cart.length === 0 ? (
                  <p>Giỏ hàng của bạn đang trống.</p>
              ) : (
                  <>
                    <ul>
                      {cart.map((item) => {
                        const product = productDetails[item.product_id];
                        return (
                            <li key={item.id} className="cart-item">
                              <input
                                  type="checkbox"
                                  checked={item.is_chosen}
                                  onChange={(e) => toggleChosen(item.id, e.target.checked)}
                              />
                              {product && (
                                  <>
                                    <img src={product.image || "placeholder.jpg"} alt={product.name} width="50" />
                                    <div className="cart-item-details">
                                      <p>{product.name || "Unknown Product"}</p>
                                      <p>Price: {(item.price_per_item || 0).toLocaleString()} VND</p>
                                      <input
                                          type="number"
                                          value={item.quantity || 1}
                                          min="1"
                                          onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                                      />
                                    </div>
                                  </>
                              )}
                              <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
                            </li>
                        );
                      })}
                    </ul>
                    <p className="cart-total">Tổng: {totalPrice.toLocaleString()} VND</p>
                    <button className="checkout-button" onClick={handleCheckout}>
                      Thanh toán
                    </button>
                  </>
              )}
            </div>
        )}
      </div>
  );
};

export default FloatingCart;