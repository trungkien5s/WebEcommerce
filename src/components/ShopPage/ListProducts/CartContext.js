import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();

const CartProvider = ({ children }) => {

  const apiURL = process.env.REACT_APP_API_URL;

  const [cart, setCart] = useState([]);
  const [cartId, setCartId] = useState(null); // Lưu trữ `cart_id`

  useEffect(() => {
    const initializeCart = async () => {
      try {
        // Lấy token từ localStorage (hoặc trạng thái khác)
        const token = localStorage.getItem("access_token");
        if (!token) {
          console.error("No token found, user not authenticated.");
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        // Kiểm tra giỏ hàng hiện tại
        try {
          const cartResponse = await axios.get(`${apiURL}/carts/me`, { headers });
          setCartId(cartResponse.data.id); // Lưu ID giỏ hàng
          console.log("Existing cart:", cartResponse.data);

          // Lấy các mục trong giỏ hàng
          const itemsResponse = await axios.get(`${apiURL}/cart_items/me`, { headers });
          setCart(itemsResponse.data);
        } catch (error) {
          if (error.response?.status === 404) {
            // Nếu giỏ hàng chưa tồn tại, tạo mới
            const createCartResponse = await axios.post(
                `${apiURL}/carts/me`,
                {},
                { headers }
            );
            setCartId(createCartResponse.data.id);
            console.log("New cart created:", createCartResponse.data);
          } else {
            console.error("Error fetching cart:", error);
          }
        }
      } catch (error) {
        console.error("Error initializing cart:", error);
      }
    };

    initializeCart();
  }, []);

  // Hàm thêm sản phẩm vào giỏ hàng
  const addToCart = async (product) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("No token found, user not authenticated.");
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      // Gửi yêu cầu thêm sản phẩm vào giỏ hàng
      const response = await axios.post(
          `${apiURL}/cart_items/me?product_id=${product.id}`,
          {
            cart_id: cartId, // Sử dụng `cart_id`
            product_id: product.id,
            quantity: 1,
            price_per_item: product.price,
            is_chosen: true,
          },
          { headers }
      );

      // Cập nhật giỏ hàng
      setCart((prevCart) => [...prevCart, response.data]);
      console.log("Product added to cart:", response.data);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }};

  // Hàm chọn/bỏ chọn sản phẩm
  const toggleChosen = async (itemId, isChosen) => {
    try {
      const token = localStorage.getItem("access_token");
      const headers = { Authorization: `Bearer ${token}` };

      await axios.put(`${apiURL}/cart_items/me/${itemId}`, { is_chosen: isChosen }, { headers });

      // Cập nhật trạng thái
      setCart((prevCart) =>
          prevCart.map((item) =>
              item.id === itemId ? { ...item, is_chosen: isChosen } : item
          )
      );
    } catch (error) {
      console.error("Error toggling is_chosen:", error);
    }
  };

  // Hàm xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = async (itemId) => {
    try {
      const token = localStorage.getItem("access_token");
      const headers = { Authorization: `Bearer ${token}` };

      await axios.delete(`${apiURL}/cart_items/me?item_id=${itemId}`, { headers });

      // Cập nhật giỏ hàng
      setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Error removing cart item:", error);
    }
  };

  // Hàm cập nhật số lượng sản phẩm
  const updateQuantity = async (itemId, quantity) => {
    try {
      const token = localStorage.getItem("access_token");
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.put(
          `${apiURL}/cart_items/me/${itemId}`,
          { quantity },
          { headers }
      );

      // Cập nhật giỏ hàng
      setCart((prevCart) =>
          prevCart.map((item) =>
              item.id === itemId ? { ...item, quantity: response.data.quantity } : item
          )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  return (
      <CartContext.Provider
          value={{
            cart,
            cartId,
            addToCart,
            toggleChosen,
            removeFromCart,
            updateQuantity,
          }}
      >
        {children}
      </CartContext.Provider>
  );
};

export { CartContext, CartProvider };