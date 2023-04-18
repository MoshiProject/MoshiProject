import React from 'react';

type ItemType = {
  title: string;
  url: string;
  img: string;
};

const collections = [
  {
    title: 'T-Shirts',
    url: '/collections/t-shirt',
    img: 'https://cdn.shopify.com/s/files/1/0552/4121/2109/files/00015-3138317020.png?v=1681543006',
  },
  {
    title: 'Hoodies',
    url: '/collections/hoodie',
    img: 'https://cdn.shopify.com/s/files/1/0552/4121/2109/files/rei1_copy.png?v=1681807429',
  },
];

const ItemTypeCollections: React.FC = () => {
  return (
    <div className="px-0 md:px-0 mt-8">
      {/* <h2 className="text-2xl mt-2 font-semibold text-center px-0.5 lg:text-2xl lg:font-semibold lg:px-4"></h2> */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {collections.map((item, index) => (
          <a key={index} className="text-center" href={item.url}>
            <div
              className="relative bg-cover bg-center bg-no-repeat"
              style={{backgroundImage: `url(${item.img})`, height: '25rem'}}
            >
              <div className="absolute inset-0 flex justify-center items-center text-white">
                <h3 className="text-4xl md:text-5xl font-semibold uppercase">
                  {item.title}
                </h3>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ItemTypeCollections;
