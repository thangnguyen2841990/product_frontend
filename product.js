let currentUser = JSON.parse(localStorage.getItem("currentUser")) ;
function getCategories() {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/categories',
        headers : {
            "Authorization" : 'Bearer ' + currentUser.token
        },
        success: function (data) {
            let content = `<select id="category">`
            for (let i = 0; i < data.length; i++) {
                content += displayCategory(data[i]);
            }
            content += '</select>'
            document.getElementById('category-option').innerHTML = content;
        }
    })
}

function getCategories1() {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/categories',
        headers : {
            "Authorization" : 'Bearer ' + currentUser.token
        },
        success: function (data) {
            let content = '';
            for (let i = 0; i < data.length; i++) {
                content += displayCategoryList(data[i]);
            }
            document.getElementById('list-category').innerHTML = content;
        }
    })
}

//list cate
function displayCategoryList(category) {

    return   ` <li class="nav-item"  >
        <a class="nav-link"   onclick="findProductByCategory(${category.id},0)">
            <p>${category.name}</p>
        </a>
    </li>`

}

//hàm hiển thị select list category
function displayCategory(category) {
    return `<option  value="${category.id}">${category.name}</option>`;
}

function showCreateForm() {
    $(`#create-product-title`).html("Thêm mới sản phẩm")
    let footer =   `<button class="btn btn-secondary" data-dismiss="modal" type="button">Đóng</button>
                    <button class="btn btn-primary" onclick="createNewProduct()" type="button">Tạo mới</button>`;
    $(`#create-product-footer`).html(footer);
    $(`#name`).val(null);
    $(`#price`).val(null);
    $(`#quantity`).val(null);
    $(`#description`).val(null);
    $(`#image`).val(null);
    getCategories();
}

function createNewProduct() {
    let name = $(`#name`).val();
    let price = $(`#price`).val();
    let quantity = $(`#quantity`).val();
    let description = $(`#description`).val();
    let image = $(`#image`);
    let category = $(`#category`).val();
    let productForm = new FormData();
    productForm.append('name',name);
    productForm.append('price', price);
    productForm.append('quantity', quantity);
    productForm.append('description', description);
    productForm.append('category', category);
    productForm.append('image',image.prop('files')[0]);
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/products',
        data: productForm,
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        headers : {
            "Authorization" : 'Bearer ' + currentUser.token
        },
        success: function () {
            getProductsByPage(0);
            showSuccessMessage('Thêm sản phẩm thành công!');
        },
        error: function () {
            showErrorMessage('Thêm không thành công!');
        }
    })
}
function findProductByName(page) {
    let q = $(`#q`).val();
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/products?q=${q}&page=${page}`,
        headers : {
            "Authorization" : 'Bearer ' + currentUser.token
        },
        success: function (data) {
            let array = data.content;
            let content = '';
            for (let i = 0; i < array.length; i++) {
                content += `<tr>
            <td>${i + 1}</td>
            <td><img src="${array[i].image}" alt="Ảnh sản phẩm" width="100" height="100"></td>  
            <td>${array[i].name}</td>
            <td>${array[i].category?.name}</td>
            <td>${array[i].price}</td>
            <td>${array[i].quantity}</td>
            <td>${array[i].description}</td>
               <td><button type="button" id="editProduct" class="btn btn-warning" data-target="#create-product" data-toggle="modal" onclick="showEditForm(${array[i].id})"><i class="fa fa-edit"></i></button></td>
            <td><button class="btn btn-danger" data-target="#delete-product" data-toggle="modal"
                                        type="button" onclick="showDeleteProduct(${array[i].id})"><i class="fa fa-trash"></i></button></td>
        </tr>`
            }
            document.getElementById("product-list-content").innerHTML = content;
            document.getElementById("displayPage").innerHTML =
                `<button class="btn btn-primary" id="first" onclick="findProductByName(0)" style="margin-right: 10px"><i class="fa-solid fa-backward-fast"></i></button><button class="btn btn-primary" id="backup" onclick="findProductByName(${data.pageable.pageNumber}-1)"><i class="fa-solid fa-backward-step"></i></button>
    <span>Trang </span><span>${data.pageable.pageNumber + 1} / ${data.totalPages}</span>
    <button class="btn btn-primary" id="next" onclick="findProductByName(${data.pageable.pageNumber}+1)"><i class="fa-solid fa-forward-step"></i></button>
<button class="btn btn-primary" id="last" onclick="findProductByName(${data.totalPages}-1)"><i class="fa-solid fa-forward-fast"></i></button>`
            //điều kiện bỏ nút previous
            if (data.pageable.pageNumber === 0) {
                document.getElementById("backup").hidden = true
                document.getElementById("first").hidden = true

            }
            //điều kiện bỏ nút next
            if (data.pageable.pageNumber + 1 === data.totalPages) {
                document.getElementById("next").hidden = true
                document.getElementById("last").hidden = true
            }
        }
    });
    event.preventDefault();

}

function findProductByCategory(categoryId,page) {
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/products/search/${categoryId}?page=${page}`,
        headers : {
            "Authorization" : 'Bearer ' + currentUser.token
        },
        success: function (data) {
            let array = data.content;
            let content = '';
            for (let i = 0; i < array.length; i++) {
                content += `<tr>
            <td>${i + 1}</td>
            <td><img src="${array[i].image}" alt="Ảnh sản phẩm" width="100" height="100"></td>  
            <td>${array[i].name}</td>
            <td>${array[i].category?.name}</td>
            <td>${array[i].price}</td>
            <td>${array[i].quantity}</td>
            <td>${array[i].description}</td>
               <td><button type="button" id="editProduct" class="btn btn-warning" data-target="#create-product" data-toggle="modal" onclick="showEditForm(${array[i].id})"><i class="fa fa-edit"></i></button></td>
            <td><button class="btn btn-danger" data-target="#delete-product" data-toggle="modal"
                                        type="button" onclick="showDeleteProduct(${array[i].id})"><i class="fa fa-trash"></i></button></td>
        </tr>`
            }
            document.getElementById("product-list-content").innerHTML = content;
            document.getElementById("displayPage").innerHTML =
                `<button class="btn btn-primary" id="first" onclick="findProductByCategory(${categoryId},0)" style="margin-right: 10px"><i class="fa-solid fa-backward-fast"></i></button><button class="btn btn-primary" id="backup" onclick="findProductByCategory(${categoryId},${data.pageable.pageNumber}-1)"><i class="fa-solid fa-backward-step"></i></button>
    <span>Trang </span><span>${data.pageable.pageNumber + 1} / ${data.totalPages}</span>
    <button class="btn btn-primary" id="next" onclick="findProductByCategory(${categoryId},${data.pageable.pageNumber}+1)"><i class="fa-solid fa-forward-step"></i></button>
<button class="btn btn-primary" id="last" onclick="findProductByName(${categoryId},${data.totalPages}-1)"><i class="fa-solid fa-forward-fast"></i></button>`
            //điều kiện bỏ nút previous
            if (data.pageable.pageNumber === 0) {
                document.getElementById("backup").hidden = true
                document.getElementById("first").hidden = true

            }
            //điều kiện bỏ nút next
            if (data.pageable.pageNumber + 1 === data.totalPages) {
                document.getElementById("next").hidden = true
                document.getElementById("last").hidden = true

            }
        }
    });
    event.preventDefault();

}

function showEditForm(id) {
$(`#create-product-title`).html("Chỉnh sửa thông tin sản phẩm")
    let footer =   `<button class="btn btn-secondary" data-dismiss="modal" type="button">Đóng</button>
                    <button class="btn btn-primary" onclick="editProduct(${id})" type="button">Cập nhật</button>`;
    $(`#create-product-footer`).html(footer);
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/products/${id}`,
        headers : {
            "Authorization" : 'Bearer ' + currentUser.token
        },
        success: function (data) {
            $(`#name`).val(data.name);
            $(`#price`).val(data.price);
            $(`#quantity`).val(data.quantity);
            $(`#description`).val(data.description);
            $(`#image`).val(data.image);
            index = data.id;
        }
    });
    getCategories();
}

function editProduct(id) {
    let name = $(`#name`).val();
    let price = $(`#price`).val();
    let quantity = $(`#quantity`).val();
    let description = $(`#description`).val();
    let image = $(`#image`);
    let category = $(`#category`).val();
    let productForm = new FormData();
    productForm.append('name',name);
    productForm.append('price', price);
    productForm.append('quantity', quantity);
    productForm.append('description', description);
    productForm.append('category', category);
    productForm.append('image',image.prop('files')[0]);
    $.ajax({
        type: 'POST',
        url: `http://localhost:8080/products/edit/${id}`,
        headers : {
            "Authorization" : 'Bearer ' + currentUser.token
        },
        data: productForm,
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        success: function () {
            getProductsByPage(0);
            showSuccessMessage('Cập nhật sản phẩm thành công!');
        },
        error: function () {
            showErrorMessage('Cập nhật không thành công!');
        }
    })
}


function showDeleteProduct(id) {
    let content = `<button class="btn btn-secondary" data-dismiss="modal" type="button">Đóng</button>
                    <button class="btn btn-danger" onclick="deleteProduct(${id})" data-dismiss="modal"  type="button">Xóa</button>`;
    $(`#footer-delete`).html(content);
}

function deleteProduct(id) {
    $.ajax({
        type: "DELETE",
        url: `http://localhost:8080/products/${id}`,
        headers : {
            "Authorization" : 'Bearer ' + currentUser.token
        },
        success: function () {
            getProductsByPage(0);
            showSuccessMessage('Xóa thành công!');
        },
        error: function () {
            showErrorMessage('Xóa lỗi');
        }
    });
}

function getProductsByPage(page) {
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/products?page=${page}`,
        headers : {
            "Authorization" : 'Bearer ' + currentUser.token
        },
        success: function (data) {
            let array = data.content;
            let content = "";
            for (let i = 0; i < array.length; i++) {
                content += `<tr>
            <td>${i + 1}</td>
            <td><img src="http://localhost:8080/image/${array[i].image}" alt="Ảnh sản phẩm" width="100" height="100"></td>  
            <td>${array[i].name}</td>
            <td>${array[i].category?.name}</td>
            <td>${array[i].price}</td>
            <td>${array[i].quantity}</td>
            <td>${currentUser.username}</td>
               <td><button type="button" id="editProduct" class="btn btn-warning" data-target="#create-product" data-toggle="modal" onclick="showEditForm(${array[i].id})"><i class="fa fa-edit"></i></button></td>
            <td><button class="btn btn-danger" data-target="#delete-product" data-toggle="modal"
                                        type="button" onclick="showDeleteProduct(${array[i].id})"><i class="fa fa-trash"></i></button></td>
        </tr>`
            }
            document.getElementById("product-list-content").innerHTML = content;
            document.getElementById("displayPage").innerHTML =
                `<button class="btn btn-primary" id="first" onclick="getProductsByPage(0)" style="margin-right: 10px"><i class="fa-solid fa-backward-fast"></i></button><button class="btn btn-primary" id="backup" onclick="getProductsByPage(${data.pageable.pageNumber}-1)"><i class="fa-solid fa-backward-step"></i></button>
    <span>Trang </span><span>${data.pageable.pageNumber + 1} / ${data.totalPages}</span>
    <button class="btn btn-primary" id="next" onclick="getProductsByPage(${data.pageable.pageNumber}+1)"><i class="fa-solid fa-forward-step"></i></button>
<button class="btn btn-primary" id="last" onclick="getProductsByPage(${data.totalPages}-1)"><i class="fa-solid fa-forward-fast"></i></button>`
            //điều kiện bỏ nút previous
            if (data.pageable.pageNumber === 0) {
                document.getElementById("backup").hidden = true
                document.getElementById("first").hidden = true
            }
            //điều kiện bỏ nút next
            if (data.pageable.pageNumber + 1 === data.totalPages) {
                document.getElementById("next").hidden = true
                document.getElementById("last").hidden = true
            }
        }
    });

}

function showSuccessMessage(message) {
    $(function () {
        var Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });

        Toast.fire({
            icon: 'success',
            title: message
        })
    });
}



function showErrorMessage(message) {
    $(function () {
        var Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });

        Toast.fire({
            icon: 'error',
            title: message
        })
    });
}
function showUsername() {
    let showUsername =`<p>${currentUser.username}</p>`;
    document.getElementById("displayUsername").innerHTML = "Chào:" +  showUsername;
}
function logOut() {
    localStorage.removeItem(currentUser);
    location.href = '/practice3/login.html'

}
$(document).ready(function () {
    if (currentUser != null) {
        getCategories1();
        getProductsByPage(0);
    } else {
        location.href = '/practice3/login.html'
    }
})
showUsername();
