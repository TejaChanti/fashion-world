document.addEventListener('DOMContentLoaded', function () {
    const tabs = document.querySelectorAll('.tab');
    const productDisplay = document.getElementById('product-display');
    const apiUrl = 'https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json';
  
    async function fetchProductData() {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.categories;
      } catch (error) {
        console.error('Error fetching product data:', error);
        return [];
      }
    }
  
    function renderProducts(products) {
      productDisplay.innerHTML = '';
      products.forEach(product => {
        const discount = calculateDiscount(product.price, product.compare_at_price);
        const productCard = `
          <div class="product-card">
            <img class="product-image" src="${product.image}" alt="${product.title}">
            <div class="badge">${product.badge_text || ''}</div>
            <div class="product-details">
            <div class="title-vendor-card">
            <div class="product-title">${product.title}</div>
            <div class="vendor">${product.vendor}</div>
            </div>
            <div class="price-discount-card">
            <div class="price">Rs ${product.price}</div>
            <div class="compare-price">${product.compare_at_price}</div>
            <div class="discount">${discount}% off</div>
            </div>
            <button class="add-to-cart">Add to cart</button>
            </div>
          </div>
        `;
        productDisplay.innerHTML += productCard;
      });
    }
  
    function calculateDiscount(price, comparePrice) {
      const discount = ((comparePrice - price) / comparePrice) * 100;
      return Math.round(discount);
    }
  
    fetchProductData().then(categories => {
      if (categories.length > 0) {
        renderProducts(categories[0].category_products);
      }
    });
  
    tabs.forEach(tab => {
      tab.addEventListener('click', async function () {
        tabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        const category = this.dataset.category;
        const categories = await fetchProductData();
        const selectedCategory = categories.find(cat => cat.category_name.toLowerCase() === category.toLowerCase());
        if (selectedCategory) {
          renderProducts(selectedCategory.category_products);
        }
      });
    });
  });
  