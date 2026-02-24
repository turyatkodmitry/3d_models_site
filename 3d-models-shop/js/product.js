// Получение ID товара из URL
function getProductId() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id'));
}

// Текущий выбранный индекс изображения
let currentImageIndex = 0;

// Отображение детальной информации о товаре
function displayProductDetail() {
    const productId = getProductId();
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        window.location.href = 'catalog.html';
        return;
    }

    const productDetail = document.getElementById('productDetail');
    if (!productDetail) return;
    
    // Создаем HTML для галереи
    const thumbnailsHtml = product.images.map((img, index) => `
        <div class="thumbnail ${index === 0 ? 'active' : ''}" onclick="changeImage(${index})">
            <img src="${img}" alt="Фото товара ${index + 1}" onerror="this.parentElement.innerHTML='<div class=\'thumbnail-placeholder\'><i class=\'fas ${product.image}\'></i></div>'">
        </div>
    `).join('');

    // Создаем HTML для характеристик
    const specsHtml = Object.entries(product.specs).map(([key, value]) => `
        <div class="spec-item">
            <span class="spec-label">${key}:</span>
            <span>${value}</span>
        </div>
    `).join('');

    productDetail.innerHTML = `
        <div class="product-gallery">
            <div class="main-image" id="mainImage">
                <img src="${product.images[0]}" alt="${product.name}" onerror="this.style.display='none'; this.parentElement.innerHTML='<i class=\'fas ${product.image}\' style=\'font-size: 5rem;\'></i>'">
            </div>
            <div class="thumbnail-container">
                ${thumbnailsHtml}
            </div>
        </div>
        
        <div class="product-info-detail">
            <span class="product-category-detail">${getCategoryName(product.category)}</span>
            <h1 class="product-title-detail">${product.name}</h1>
            
            <div class="product-meta">
                <div class="product-rating">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star-half-alt"></i>
                    <span style="color: var(--gray); margin-left: 5px;">(4.5)</span>
                </div>
                <div style="color: var(--gray);">
                    <i class="fas fa-eye"></i> 234 просмотра
                </div>
            </div>
            
            <div class="product-price-detail">
                ${product.price.toLocaleString('ru-RU')} ₽
            </div>
            
            <div class="product-description">
                <h3 style="margin-bottom: 1rem; color: var(--dark-blue);">Описание</h3>
                <p style="line-height: 1.8;">${product.description}</p>
            </div>
            
            <div class="product-specs">
                <h3 style="margin-bottom: 1rem; color: var(--dark-blue);">Характеристики</h3>
                ${specsHtml}
            </div>
            
            <div class="product-actions-detail">
                <button class="add-to-cart-detail" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Добавить в корзину
                </button>
                <button class="wishlist-btn" onclick="addToWishlist(${product.id})">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        </div>
    `;
}

// Смена изображения в галерее
function changeImage(index) {
    const productId = getProductId();
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    currentImageIndex = index;
    
    // Обновляем главное изображение
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.innerHTML = `<img src="${product.images[index]}" alt="${product.name}" onerror="this.style.display='none'; this.parentElement.innerHTML='<i class=\'fas ${product.image}\' style=\'font-size: 5rem;\'></i>'">`;
    }
    
    // Обновляем активный thumbnail
    document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
        if (i === index) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
}

// Получение названия категории
function getCategoryName(category) {
    const categories = {
        'characters': 'Персонажи',
        'architecture': 'Архитектура',
        'oil': 'Нефть'
    };
    return categories[category] || category;
}

// Добавление в избранное
function addToWishlist(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        showNotification(`❤️ ${product.name} добавлен в избранное!`);
    }
}

// Функция возврата на предыдущую страницу
function goBack() {
    if (document.referrer) {
        window.history.back();
    } else {
        window.location.href = 'catalog.html';
    }
}

// Загружаем товар при открытии страницы
document.addEventListener('DOMContentLoaded', displayProductDetail);