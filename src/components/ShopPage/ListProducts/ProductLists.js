import React, { useState, useEffect } from 'react';
import './product.css';
import { useNavigate } from 'react-router-dom';

function ProductList({ products, sortOrder, onSortChange, selectedCategoryId, selectedPriceRange }) {
  const limit = 9; // Giới hạn mỗi trang 9 sản phẩm
  const [currentProducts, setCurrentProducts] = useState([]);
  const [pageActive, setPageActive] = useState(0);
  const [quantityPage, setQuantityPage] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    applyFiltersAndPaginate(products, sortOrder, selectedCategoryId, selectedPriceRange);
  }, [products, sortOrder, selectedCategoryId, selectedPriceRange]);

  const applyFiltersAndPaginate = (products, sortOrder, categoryId, priceRange) => {
    const filtered = filterProducts(products, categoryId, priceRange);
    const sorted = sortProducts(filtered, sortOrder);
    paginateProducts(sorted, 0);
  };

  const filterProducts = (products, categoryId, priceRange) => {
    return products.filter((product) => {
      const matchesCategory = categoryId ? product.category_id === categoryId : true;
      const matchesPrice =
          priceRange && priceRange.min !== undefined && priceRange.max !== undefined
              ? product.price >= priceRange.min && product.price <= priceRange.max
              : true;
      const isInStock = product.status === "Còn hàng";
      return matchesCategory && matchesPrice && isInStock;
    });
  };

  const sortProducts = (products, sortOrder) => {
    return [...products].sort((a, b) => {
      const [key, order] = sortOrder.split('-');
      if (key === 'price') {
        return order === 'asc' ? a.price - b.price : b.price - a.price;
      }
      return 0;
    });
  };

  const paginateProducts = (products, page) => {
    setCurrentProducts(products.slice(page * limit, (page + 1) * limit));
    setQuantityPage(Math.ceil(products.length / limit));
    setPageActive(page);
  };

  const handleClickPagination = (page) => {
    if (page >= 0 && page < quantityPage) {
      paginateProducts(products, page);
    }
  };

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  const renderPageNumbers = () => {
    const start = Math.max(0, pageActive - Math.floor(5 / 2));
    const end = Math.min(quantityPage, start + 5);
    return [...Array(end - start).keys()].map((_, index) => (
        <li
            key={start + index}
            className={pageActive === start + index ? 'active' : ''}
            onClick={() => handleClickPagination(start + index)}
        >
          {start + index + 1}
        </li>
    ));
  };

  if (!products.length) {
    return <div>Không có sản phẩm </div>;
  }

  return (
      <div>
        <div className="sort-options">
          <label>Sắp xếp:</label>
          <select value={sortOrder} onChange={(e) => onSortChange(e.target.value)}>
            <option value="price-asc">Giá: Thấp đến cao</option>
            <option value="price-desc">Giá: Cao đến thấp</option>
          </select>
        </div>
        <div className="newar_product_list">
          {currentProducts.map((item) => (
              <div className="newar_product_item" key={item.id}>
                <div className="newar_product_img">
                  <img src={item.image} alt={item.name} />
                  <div className="ShowWhenHover">
                    <div className="view-product" onClick={() => handleProductClick(item.id)}>
                      🛒
                    </div>
                  </div>
                </div>
                <div className="text_title_price">
                  <h3>{item.name}</h3>

                  <div>
                    Size: {item.sizes}-{item.colors}
                    {/* Màu: {item.colors} */}
                  </div>

                  <p>{item.price.toLocaleString()} VND</p>
                </div>
              </div>
          ))}
        </div>
        <ul className="pagination2">
          <li onClick={() => handleClickPagination(pageActive - 1)} disabled={pageActive === 0}>
            Trước
          </li>
          {renderPageNumbers()}
          <li onClick={() => handleClickPagination(pageActive + 1)} disabled={pageActive === quantityPage - 1}>
            Sau
          </li>
        </ul>
      </div>
  );
}

export default ProductList;