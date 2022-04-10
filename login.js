function signIn() {
    let username = $(`#exampleInputUsername1`).val();
    let password = $(`#exampleInputPassword1`).val();
    let user = {
        username: username,
        password: password
    }
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/login',
        data: JSON.stringify(user), //đưa json về dạng chuỗi
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        success: function (currentUser) {
            localStorage.setItem("currentUser",JSON.stringify(currentUser))
            location.href="/practice3/product.html"
        }
    })
}
