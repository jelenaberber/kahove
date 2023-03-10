window.onload = () =>{
    function getData(file, callback){
        $.ajax({
            url: "assets/data/" + file + ".json",
            method: 'get',
            dataType: "json",
            success: callback,
            error: function(err){
                console.log(err);
            }
        });
    }
    let url = window.location.pathname;
    console.log(url)
    if(url.indexOf('artworks') != -1){
        pageArtworks();
        getData('categories', printCategories);
    }
    if(url.indexOf('cart') != -1){
        pageCart();
    }
    else{
        index();
    }
    getData('meni', printNavAndFooter);




        function printNav(data){
        console.log(data)
        let htmlNav = '';
        for (let i = 0; i < data.length; i++) {
            htmlNav += `<li class="nav-item"><a class="nav-link active link" aria-current="page" href="${data[i].src}">${data[i].name}</a></li>`
        };
        return htmlNav;
    }
    function printNavAndFooter(data) {
        let print = printNav(data);
        $("#nav").html(print);
        //footer
        $("#menu").html(print);
        var dataContact = [{"src":"dokumentacija.pdf", "name" : "Dokumentacija"},
        {"src":"sitemap.xml", "name" : "Sitemap "}, {"src":"main.js", "name" : "Javascript "}];
        let fut = printNav(dataContact);
        $("#important").html(fut);
    }

    function index(){
        function printContent(data) {
            let html = '';
            for (let element of contents) {
                html += `<div class="col-lg-${element.col} col-md-12 col-sm-12">
                <h1 class="text-center">${element.title}</h1>
                <p>${element.content}</p>
            </div>`
            }
            return html;
        }
        var contents = [{
            "col":"4", "title": "2022 - The Great Beginning",
            "content": "Founded in 2022 with the Fluffy Mona Lisa as our debut artwork. Recreating historical masterpieces in creative and extraordinary forms was our initial design directive."
        },
            {
                "col":"4", "title": "2023 - The Big Bang",
                "content": "The year Kahove enters the art industry and makes significant changes to the way art is understood and enjoyed throughout the world. The introduction of fine art pieces using advanced and complex production techniques. To create and deliver 1,000,000 artworks around the world in the year 2023."
            }]
        var html = printContent(contents);
        console.log(html)
        $("#content").html(html);
    }

    function artworks(data){
        let printHtml = '';
        console.log(data)
        data = filterCategory(data);
        data = sortPrice( data);
        data = dostupnostFilter(data);
        data = filterShipping(data);
        for(let art of data){
            printHtml += `<div class="col-lg-3 col-md-5 col-sm-12 mx-1 my-3">
            <div class="card h-100 w-100">
              <img src="${art.img.src}" class="card-img-top" alt="${art.img.alt}">
              <div class="card-body d-flex flex-column align-items-center">
                <h5 class="card-title">${art.name}</h5>
                <p>Price: ${art.price}.00$</p>
                <button type="button" class="btn button purchase" data-id="${art.id}">Purchase Now</button>
              </div>
              <div class="card-footer">
                <small class="text-muted">Shipping: ${art.shipping}.00$</small>
              </div>
                </div>
             </div>`
        }
        $(".arts").html(printHtml);
    }
    function printCategories(data){
        let html = "";
        data.forEach(cat => {
            html += `<li class="list-group-item border border-0">
					   <input type="checkbox" value="${cat.id}" class="category" name="categories"/> ${cat.name}
					</li>`;
        });
        document.getElementById('categories').innerHTML = html;
        categories = data;
        getData('products', artworks);
        $('.category').change(promenaFiltera);
    }
    function filterCategory(data){
        let selectedCategories = [];
        $('.category:checked').each(function(el){
            selectedCategories.push(parseInt($(this).val()));
            console.log(selectedCategories)
        });
        if(selectedCategories.length != 0){
            let products = []
            for(let el of data){
                for(let cat of selectedCategories){
                    if(el.categoryId == cat){
                        products.push(el)
                    }
                }
            }
            return products;
        }
        else{
            return data;
        }
    }
    function promenaFiltera(){
        getData("products", artworks);
    }
    function availableProducts(){
        let available = [{'id' : 1, 'name' : 'Available for shipping'}, {'id' : 2, 'name' : 'Not available'}];
        makeDdl('Available', available, '#available');
        $('#available').change(promenaFiltera);
    }
    availableProducts();
    function dostupnostFilter(data){
        var available = $('#available').find(":selected").val();
        console.log(available)
        if(available == 1){
            return data.filter(x => x.inStock);
        }
        else if(available == 2){
            return data.filter(x => !x.inStock);
        }
        return data
    }
    function printSortByPrice(){
        let price = [{'id':'asc', 'name':'Ascending'}, {'id':'desc', 'name':'Descending'}, {'id':'popular', 'name':'Most popular'}, {'id':'new', 'name':'New products'}];
        makeDdl('Sort', price, '#price');
    }
    printSortByPrice();
    function sortPrice(data){
        var sort = $('#price').find(":selected").val();
        if (sort == 'asc'){
            return data.sort((a,b) => a.price >b.price ? 1 : -1);
        }
        else if(sort == 'desc'){
            return data.sort((a,b) => a.price < b.price ? 1 : -1);
        }
        else if(sort = "popular"){
            return data.sort((a,b) => a.sold < b.sold ? 1 : -1);
        }
        else{
            return data
        }
    }
    $("#price").change(promenaFiltera);
    function shippingCost(){
        let shippingCosts = [{'id' : 1, 'name' : 'Free shipping'}, {'id' : 2, 'name' : 'Not free'}];
        makeDdl('Shipping', shippingCosts, '#shipping');
        $('#shipping').change(promenaFiltera);
    }
    shippingCost();
    function filterShipping(data){
        var shipping = $('#shipping').find(":selected").val();
        console.log(shipping)
        if(shipping == 1){
            return data.filter(x => !x.shipping);
        }
        else if(shipping == 2){
            return data.filter(x => x.shipping > 0);
        }
        return data
    }
    function pageArtworks(){
        getData('products', productsInCart)
        function productsInCart(data){
            $(document).on("click",".purchase",function(){
                var id = $(this).data('id');
                var productsInCart = getItemsFromLocalStorage('productsInCart');
                if(productsInCart){
                    let le = existsInCart();
                    if(existsInCart()){
                        addAmount();
                    }
                    else {
                        putInCart();
                    }
                }
                else{
                    firstItem();
                }
                function putInCart(){
                    let products = getItemsFromLocalStorage('productsInCart');
                    let newProduct = [];
                    newProduct = {
                        id: id,
                        amount: 1
                    }
                    products.push(newProduct);
                    setItemToLocalStorage('productsInCart', products)
                }
                function existsInCart(){
                    for(obj of productsInCart){
                        if(obj.id == id){
                            return true;
                        }
                    }
                    return false;
                }
                function addAmount(){
                    let products = getItemsFromLocalStorage('productsInCart')
                    for(let i=0; i<products.length; i++){
                        if(products[i].id == id){
                            products[i].amount += 1;
                        }
                    }
                    setItemToLocalStorage('productsInCart', products);
                }
                function firstItem (){
                    let products = [];
                    products[0] = {
                        id: id,
                        amount: 1
                    }
                    setItemToLocalStorage("productsInCart", products);
                }


                console.log(getItemsFromLocalStorage('productsInCart'))
            })
        }
    }

    function pageCart(){
        getData('products', printProduct)
        function printProduct(data) {
            let productsInLS = getItemsFromLocalStorage('productsInCart');
            let innerHtml = '';
            let allProducts = data;
            let count = 0;
            let shipping = 0;
            let price = 0;
            if(productsInLS === null || productsInLS === []){
                innerHtml = `<div class="row d-flex justify-content-center flex-column align-items-center">
                            <h1 class="blueLetters text-center mt-5">Your cart is empty</h1>
                            <img src="assets/img/empty_cart.jpg" alt="EmptyCart" class="col-lg-6 col-md-10 col-sm-12 mt-5">
                            <button class="btn button col-lg-2 col-md-3 mt-5"><a href="artworks.html">Go back to shopping</a></button>
                        </div>`
                $('#print').html(innerHtml);
                $('#form').hide();
                $('#deleteAll').hide();
            }
            else{
                innerHtml = `<div class="container-fluid mt-5 d-flex flex-column align-items-center">
                            <h1 class="text-center blueLetters">Products</h1>
                            <span class="dot mb-5"></span>
                            <div class="col-12 d-flex flex-column justify-content-center align-items-center">
                                <table class="col-12 d-flex flex-wrap text-center">
                                    <tbody id="printProductsInCart">`
                for(let el of allProducts){
                    for (let pr of productsInLS)
                        if (pr.id == el.id){
                            count++;
                            innerHtml += `<tr>
                        <th scope="row">${count}</th>
                        <td class="col-lg-2 col-sm-10"><img src="${el.img.src}" alt="${el.img.alt}" class="col-5 pt-3"/></td>
                        <td class="col-lg-2 col-sm-5">${el.name}</td>
                        <td class="col-lg-2 col-sm-5">${el.price}.00$</td>
                        <td class="col-lg-2 col-sm-5"><button class="btn button plus" data-plus="${el.id}"><i class="fa-solid fa-plus"></i></button> ${pr.amount} <button class="btn button minus" data-minus="${el.id}"><i class="fa-solid fa-minus"></i></button></td>
                        <td class="col-lg-2 col-sm-5"><button class="btn button deleteItem" data-delete="${el.id}">Delete from cart</button></td>
                    </tr>`
                            if (el.shipping != 0){
                                shipping += el.shipping
                            }
                            price += el.price * pr.amount;
                        }
                }
                let totalPrice = shipping + price;
                innerHtml += `</tbody>
                                    </table>
                                </div>`
                let bill = `<h1 class="text-center blueLetters pt-3">Order details</h1>
                            <p class="px-5 fs-5 py-3">Subtotal: ${price}.00$</p>
                            <p class="px-5 fs-5 py-3">Shipping: ${shipping}.00$</p>
                            <p class="px-5 fs-5 py-3">Total: ${totalPrice}.00$</p>`
                $('#bill').html(bill);
                $('#form').show();
            }
            $('#print').html(innerHtml);
        }

        $('#deleteAll').click(function(){
            localStorage.removeItem('productsInCart');
            printProduct();
        })
        $('#buy').click(function() {
            formValidation();
        })
        $('#close').click(function (){
            $('#modal-2').hide();
            localStorage.removeItem('productsInCart');
            printProduct();
        })
    }
    function formValidation(){
        event.preventDefault();
        let name, email, address;
        name = $('#name');
        email = $('#email');
        address = $('#address');
        var count = 0;
        var regexForName = /^[A-ZŠĐŽĆČ][a-zšđžćč]{2,15}(\s[A-ZŠĐŽĆČ][a-zšđžćč]{2,15})?$/;
        var regexForEmail = /^[a-z]((\.|-|_)?[a-z0-9]){2,}@[a-z]((\.|-|_)?[a-z0-9]+){2,}\.[a-z]{2,6}$/i;
        let regexForAddress = /^(([A-ZŠĐČĆŽ][a-zščćđž\d]+)|([0-9][1-9]*\.?))(\s[A-Za-zŠĐŽĆČščćđž\d]+){0,7}\s(([1-9][0-9]{0,5}[\/-]?[A-Z])|([1-9][0-9]{0,5})|(BB))\.?$/;
        if (name.val() == ''){
            name.addClass('error')
        }
        else if(!regexForName.test(name.val())){
            $('#spanName').html("You didn`t enter name correctly.").css('display', 'block');
        }
        else{
            $('#spanName').css("display", "none");
            name.removeClass('error');
            count++
        }
        if (email.val() == ''){
            email.addClass('error')
        }
        else if(!regexForEmail.test(email.val())){
            $('#spanEmail').html("You didn`t enter email correctly.").css('display', 'block');
        }
        else{
            $('#spanEmail').css("display", "none");
            email.removeClass('error');
            count++
        }
        if (address.val() == ''){
            address.addClass('error')
        }
        else if(!regexForAddress.test(address.val())){
            $('#spanAddress').html("You didn`t enter address correctly.").css('display', 'block');
        }
        else{
            $('#spanAddress').css("display", "none");
            address.removeClass('error');
            count++
        }
        if(count==3){
            $('#modal-2').show();
        }
    }


    $(document).on("click",".deleteItem",function(){
        let id = $(this).data('delete');
        let products = getItemsFromLocalStorage('productsInCart');
        let result = products.filter(c => c.id !== id);
        console.log(products)
        if(products.length === 1){
            innerHtml = `<div class="row d-flex justify-content-center flex-column align-items-center">
                        <h1 class="blueLetters text-center mt-5">Your cart is empty</h1>
                        <img src="assets/img/empty_cart.jpg" alt="EmptyCart" class="col-6 mt-5">
                        <button class="btn button col-2 mt-5"><a href="artworks.html">Go back to shopping</a></button>
                    </div>`
            console.log($('#form'), $('#deleteAll'), $('#print'))
            $('#form').hide();
            $('#deleteAll').hide();
            $('#print').html(innerHtml);
            setItemToLocalStorage('productsInCart', null)

        }
        else {
            setItemToLocalStorage('productsInCart', result)
        }
        pageCart();
    });

    $(document).on("click",".plus",function(){
        let id = $(this).data('plus');
        let products = getItemsFromLocalStorage('productsInCart');
        for(let el of products){
            if(el.id === id){
                el.amount = parseInt(el.amount)+1;
            }
        }
        setItemToLocalStorage('productsInCart', products)
        pageCart();
    });
    $(document).on("click",".minus",function(){
        let id = $(this).data('minus');
        let products = getItemsFromLocalStorage('productsInCart');
        for(let el of products){
            if(el.id === id){
                el.amount = (el.amount <= 1) ? 1 : parseInt(el.amount)-1;
            }
        }
        setItemToLocalStorage('productsInCart', products)
        pageCart();
    });
    function makeDdl(option0, values, print){
        let html=`<option value="0">${option0}</option>`;
        for(let value of values){
            html += `<option value="${value.id}">${value.name}</option>`;
        }
        $(print).html(html);
    }
    function listsRadioBtn(title, values, print){
        let innerHtml = `<h6>${title}</h6>`;
        for(let value of values){
            innerHtml += `<div class="col-12"><input type="radio" name="rb${title}" value="${value.Value}"/>
            <label>${value.Name}</label></div>`;
        }
        $(print).html(innerHtml);
    }

//local storage
    function setItemToLocalStorage(itemKey, itemValue){
        localStorage.setItem(itemKey, JSON.stringify(itemValue))
    }
    function getItemsFromLocalStorage(itemKey){
        return JSON.parse(localStorage.getItem(itemKey));
    }

    $('.category').change(artworks);
}
