import React from 'react';

const productData = [
  {
    name: "6 Hours Badge",
    price: "$74.99",
    img: "https://img.icons8.com/external-flat-wichaiwi/64/external-badge-web-application-flat-wichaiwi.png"
  },
  {
    name: "Headphones",
    price: "$79.99",
    img: "https://img.icons8.com/ios-filled/100/headphones.png"
  },
  {
    name: "T-Shirt",
    price: "$79.99",
    img: "https://img.icons8.com/ios-filled/100/t-shirt.png"
  }
];

const Products = () => {
  return (
    <div className="p-4 flex">
      <aside className="w-1/5 p-4">
        <h3 className="text-xl font-bold">Podshlanes</h3>
        <p className="font-semibold mt-4 mb-2">Department</p>
        <ul className="space-y-2 text-sm">
          <li><input type="checkbox" /> All</li>
          <li><input type="checkbox" /> Electronics</li>
          <li><input type="checkbox" /> Clothes</li>
          <li><input type="checkbox" /> Books</li>
        </ul>
      </aside>
      <main className="w-4/5 grid grid-cols-3 gap-6">
        {productData.map((item, i) => (
          <div key={i} className="border rounded p-4 text-center shadow-md">
            <img src={item.img} alt={item.name} className="mx-auto h-20" />
            <h4 className="mt-2 font-semibold">{item.name}</h4>
            <p className="text-gray-600">{item.price}</p>
            <button className="mt-2 bg-blue-500 text-white px-3 py-1 rounded">
              Add to Cart
            </button>
          </div>
        ))}
      </main>
    </div>
  );
};

export default Products;
