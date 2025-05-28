import React from 'react';
import './Filter.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

const FilterByCategory = ({
                            selectedCategoryId, // category_id được chọn
                            onFilterChange, // Hàm thay đổi category_id
                            selectedPriceRange,
                            onPriceRangeChange
                          }) => {

  const apiURL = process.env.REACT_APP_API_URL;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiURL}/categories`); // Thay URL bằng API thực tế
        setCategories(response.data);
      } catch (err) {
        setError('Không thể tải danh sách danh mục. Vui lòng thử lại sau.');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const priceRanges = [
    { label: 'All', min: 0, max: Infinity },
    { label: '0-1,000,000 VND', min: 0, max: 1000000 },
    { label: '1,000,000-2,000,000 VND', min: 1000000, max: 2000000 },
    { label: '2,000,000-3,000,000 VND', min: 2000000, max: 3000000 },
    { label: '3,000,000-4,000,000 VND', min: 3000000, max: 4000000 }
  ];

  return (
      <div className="filter_by_category">
        {/* Lọc theo danh mục */}
        <h3>Lọc theo danh mục:</h3>
        <ul className="category_list">
          <li
              className={!selectedCategoryId ? 'active' : ''}
              onClick={() => onFilterChange(null)}
          >
            All
          </li>
          {categories.map((category) => (
              <li
                  key={category.id}
                  className={selectedCategoryId === category.id ? 'active' : ''}
                  onClick={() => onFilterChange(category.id)}
              >
                {category.name}
              </li>
          ))}
        </ul>

        {/* Lọc theo giá */}
        <h3>Lọc theo giá:</h3>
        <ul className="price_list">
          {priceRanges.map((range) => (
              <li
                  key={range.label}
                  className={selectedPriceRange && selectedPriceRange.label === range.label ? 'active' : ''}
                  onClick={() => onPriceRangeChange(range)}
              >
                {range.label}
              </li>
          ))}
        </ul>
      </div>
  );
};

export default FilterByCategory;