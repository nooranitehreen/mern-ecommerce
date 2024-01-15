import React from 'react';
import './DescriptionBox.css';

const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
      <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-box">Description</div>
        <div className="descriptionbox-nav-box fade">Reviews (122)</div>
      </div>
      <div className="descriptionbox-description">
        <p>An e-commerce website is one that allows people to buy and sell physical goods, services, and digital products over the internet rather than at a brick-and-mortar location. Through an e-commerce website, a business can process orders, accept payments, manage shipping and logistics, and provide customer service. In recent years, e-commerce has enjoyed a massive boost from the rise of smartphones, which allow consumers to shop from nearly anywhere.</p>
        <p>
            E-commerce websites typically dispaly products or services and detailed descriptions, images, prices, and any  available variations(e.g., sizes, colors). Each product usually has its own dedicated page with relevant information.
        </p>
      </div>
    </div>
  )
}

export default DescriptionBox;
