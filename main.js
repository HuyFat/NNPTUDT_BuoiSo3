let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
let itemsPerPage = 10;
let sortBy = null;
let sortOrder = 'asc';

async function getAllProducts() {
    try {
        const response = await fetch('https://api.escuelajs.co/api/v1/products');
        allProducts = await response.json();
        filteredProducts = [...allProducts];
        updateSortButtons();
        displayProducts();
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

function displayProducts() {
    let productsToSort = [...filteredProducts];
    if (sortBy) {
        productsToSort.sort((a, b) => {
            let aVal = sortBy === 'price' ? a.price : a.title.toLowerCase();
            let bVal = sortBy === 'price' ? b.price : b.title.toLowerCase();
            if (sortOrder === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const productsToShow = productsToSort.slice(startIndex, endIndex);

    const dashboard = document.getElementById('dashboard');
    let table = '<table>';
    table += `<tr>
        <th>ID</th>
        <th onclick="sortProducts('title')">Title ${sortBy === 'title' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</th>
        <th onclick="sortProducts('price')">Price ${sortBy === 'price' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</th>
        <th>Description</th>
        <th>Category</th>
        <th>Images</th>
    </tr>`;
    productsToShow.forEach(product => {
        table += `<tr title="${product.description}">
            <td>${product.id}</td>
            <td>${product.title}</td>
            <td>${product.price}</td>
            <td>${product.description}</td>
            <td>${product.category.name}</td>
            <td>`;
        product.images.forEach(image => {
            table += `<img src="${image}" alt="${product.title}">`;
        });
        table += '</td></tr>';
    });
    table += '</table>';
    dashboard.innerHTML = table;

    renderPagination();
}

function sortProducts(column) {
    if (sortBy === column) {
        sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
        sortBy = column;
        sortOrder = 'asc';
    }
    updateSortButtons();
    displayProducts();
}

function updateSortButtons() {
    const titleBtn = document.querySelector('button[onclick*="title"]');
    const priceBtn = document.querySelector('button[onclick*="price"]');
    if (sortBy === 'title') {
        titleBtn.textContent = `Sắp xếp theo Tên ${sortOrder === 'asc' ? '↑' : '↓'}`;
        priceBtn.textContent = 'Sắp xếp theo Giá';
    } else if (sortBy === 'price') {
        priceBtn.textContent = `Sắp xếp theo Giá ${sortOrder === 'asc' ? '↑' : '↓'}`;
        titleBtn.textContent = 'Sắp xếp theo Tên';
    } else {
        titleBtn.textContent = 'Sắp xếp theo Tên';
        priceBtn.textContent = 'Sắp xếp theo Giá';
    }
}

function renderPagination() {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const pagination = document.getElementById('pagination');
    let paginationHtml = '';

    if (currentPage > 1) {
        paginationHtml += `<button onclick="changePage(${currentPage - 1})">Previous</button>`;
    }

    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            paginationHtml += `<span>${i}</span>`;
        } else {
            paginationHtml += `<button onclick="changePage(${i})">${i}</button>`;
        }
    }

    if (currentPage < totalPages) {
        paginationHtml += `<button onclick="changePage(${currentPage + 1})">Next</button>`;
    }

    pagination.innerHTML = paginationHtml;
}

function changePage(page) {
    currentPage = page;
    displayProducts();
}

function changeItemsPerPage() {
    itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);
    currentPage = 1;
    displayProducts();
}

function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    filteredProducts = allProducts.filter(product => 
        product.title.toLowerCase().includes(searchTerm)
    );
    currentPage = 1;
    displayProducts();
}

// Call the function to load products
getAllProducts();
