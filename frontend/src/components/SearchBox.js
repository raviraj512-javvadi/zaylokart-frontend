import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const SearchBox = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
    } else {
      navigate('/');
    }
    setKeyword(''); // Optional: Clear input after search
  };

  return (
    <form onSubmit={submitHandler} className="search-box">
      <input
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder="Search products..."
        className="search-input"
      />
      <button type="submit" className="search-button">
        <Search size={18} />
      </button>
    </form>
  );
};

export default SearchBox;