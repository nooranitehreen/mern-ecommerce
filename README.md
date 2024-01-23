## E-Commerce App

This repository contains a e-commerce app built using the MERN stack. Please follow the instructions to set it up.

  
**Features**

1. Admin Panel
2. LoginSignup Page
3. Shop Page
4. Product Categories Pages
5. Interactive Cart
6. Checkout
7. Promocode Coupons

**Requirements**

- Node.js
- MongoDB
- Express
- React
- Redux Toolkit
- React Router Dom
  

**Instructions**

1. Clone the repo and run ``npm install``
2. From the admin folder run ``npm run dev``
3. from the app folder run ``npm start``
4. from the server folder run ``npm run dev``
5. to add products the assets images are present in app/frontend/components/assets.

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

---

**Function for fetching All Products**

```js
app.get('/allproducts', async (req, res) => {
    let products = await Product.find({});
    console.log("All Products Fetched");
    res.send(products);
});
```

**HTML for Description Box**

```html
<div className='descriptionbox'>
      <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-box">Description</div>
        <div className="descriptionbox-nav-box fade">Reviews (122)</div>
      </div>
      <div className="descriptionbox-description">
        <p> 
            An e-commerce website is one that   allows people to buy and sell physical goods, services, and digital products over the internet rather than at a brick-and-mortar location.
        </p>
        <p>
            E-commerce websites typically dispaly products or services and detailed descriptions, images, prices, and any  available variations(e.g., sizes, colors). Each product usually has its own dedicated page with relevant information.
        </p>
      </div>
    </div>
```

**CSS for Breadcrums**

```css
.breadcrum{
    display: flex;
    align-items: center;
    gap: 8px;
    color: #5e5e5e;
    font-size: 16px;
    font-weight: 600;
    margin: 60px 170px;
    text-transform: capitalize;
}
```

**Running a cleanup bash script**

```sh
sudo exec cleanup
```
