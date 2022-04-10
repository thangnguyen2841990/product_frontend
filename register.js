function singUp() {
    let username = $(`#username`).val();
    let password = $(`#password`).val();
    let confirmPassword = $(`#repairPassword`).val();
    let user = {
        username : username,
        password : password,
        confirmPassword : confirmPassword
    }
    $.ajax({
        type : 'POST',
        url : 'http://localhost:8080/register',
        data : JSON.stringify(user),
        headers : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json',
        },
        success : function () {
            let message =` <button class="btn btn-primary" onclick="showLoginForm()">Đã có tài khoản đăng nhập ngay!</button>`
            showSuccessMessage("Đăng ký thành công!")
            document.getElementById("showMessage").innerHTML = message;
        }, error: function () {
            showErrorMessage('Xảy ra lỗi!')
        }
    })
}
function showLoginForm() {
    location.href="/practice3/login.html"
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