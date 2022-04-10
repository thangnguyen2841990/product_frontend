let index = 0;

function getAllCategories() {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/categories/',
        success: function (data) {
            let content = "";
            for (let i = 0; i < data.length; i++) {
                content += `<tr>
                <td>${i + 1}</td>
                <td>${data[i].name}</td>
                               <td><button type="button" id="editCategory" class="btn btn-warning" data-target="#create-category" data-toggle="modal" onclick="showEditCategoryForm(${data[i].id})"><i class="fa fa-edit"></i></button><span>
                        <button type="button" id="deleteCategory" class="btn btn-danger" data-target="#delete-category" data-toggle="modal"
                                         onclick="showDeleteCategory(${data[i].id})"><i class="fa fa-trash"></i></button></td>
            </tr>`
            }
            document.getElementById("category-list-content").innerHTML = content;
        }
    })

}

function showCreatCategoryForm() {
    $(`#name-category`).val(null);
    document.getElementById("submit-create-edit-category").onclick = function () {
        createNewCategory();
    }
}

function createNewCategory() {
    let name = $(`#name-category`).val();
    let newCategory = {
        name: name
    }
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/categories/',
        data: JSON.stringify(newCategory),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        success: function () {
            getAllCategories();
            showSuccessMessage1('Thêm danh mục sản phẩm thành công!');
        },
        error: function () {
            showErrorMessage1('Thêm không thành công');
        }

    })
}

function showEditCategoryForm(id) {
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/categories/${id}`,
        success: function (data) {
            $(`#name-category`).val(data.name)
            index = data.id
            document.getElementById("submit-create-edit-category").onclick = function () {
                editCategory();
            }
        }
    })
}

function editCategory() {
    let name = $(`#name-category`).val();
    let newCategory = {
        name: name
    }
    $.ajax({
        type: 'PUT',
        url: `http://localhost:8080/categories/${index}`,
        data: JSON.stringify(newCategory),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        success: function () {
            getAllCategories();
            showSuccessMessage1('Cập nhật thông tin thành công!');
        },
        error: function () {
            showErrorMessage1('Cập nhật thông tin không thành công!');
        }

    })
}

function showDeleteCategory(id) {
    let content1 = `<button class="btn btn-secondary" data-dismiss="modal" type="button">Đóng</button>
                    <button class="btn btn-danger" onclick="deleteCategory(${id})" data-dismiss="modal"  type="button">Xóa</button>`;
    document.getElementById("footer-deleteCategory").innerHTML = content1;
}

function deleteCategory(id) {
    $.ajax({
        type: "DELETE",
        url: `http://localhost:8080/categories/${id}`,
        success: function () {
            getAllCategories();
            showSuccessMessage1('Xóa thành công!');
        },
        error: function () {
            showErrorMessage1('Xóa lỗi');
        }
    });
}

function showSuccessMessage1(message) {
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

function showErrorMessage1(message) {
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

getAllCategories();