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
    }
    if(url.indexOf('cart') != -1){
        pageCart();
        console.log('provera')
    }
    else{
        index();
    }
    getData('meni', printNavAndFooter);

    getData('products', productsInCart)
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
                html += `<div class="col-${element.col}">
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



    function pageArtworks(){
        getData('products', artworks);
        sortByPrice();
        getData('categories', printCategories);
        getData("products", filterCategory);
        getData('products', sortPrice);
        shippingCost();
        availableProducts();
        getData('products', filterShipping);
        getData('products', filterAvailable);
        function artworks(data){
            let printHtml = '';
            for(let art of data){
                printHtml += `<div class="col-3 mx-1 my-3">
            <div class="card h-100 w-100">
              <img src="${art.img.src}" class="card-img-top" alt="${art.img.alt}">
              <div class="card-body d-flex flex-column align-items-center">
                <h5 class="card-title">${art.name}</h5>
                <p>Price: ${art.price}</p>
                <button type="button" class="btn btn-primary button purchase" data-id="${art.id}">Purchase Now</button>
              </div>
              <div class="card-footer">
                <small class="text-muted">Shipping: ${art.shipping}$</small>
              </div>
                </div>
             </div>`
            }
            $(".arts").html(printHtml);

        }

        function shippingCost(){
            let shippingCosts = [{'Value' : '0', 'Name' : 'Free shipping'}, {'Value' : '1', 'Name' : 'All'}];
            listsRadioBtn('Shipping', shippingCosts, '#shipping');
        }
        function availableProducts(){
            let available = [{'Value' : '0', 'Name' : 'Available for shipping'}, {'Value' : '1', 'Name' : 'All'}];
            listsRadioBtn('Available', available, '#available');
        }
        // function printCategories(data){
        //     let categories = data;
        //     makeDdl('Select category', categories, '#categories');
        // }
        function sortByPrice(){
            let price = [{'id':'asc', 'name':'rastucoj'}, {'id':'desc', 'name':'opadajucoj'}];
            makeDdl('sortiraj po ceni', price, '#price');
        }
        function printCategories(data){
            let categories = data;
            let innerHtml = '';
            for(let category of categories){
                innerHtml += `<div class="col-12 mt-3"><lable>${category.name}</lable>
                            <input type="checkbox" value="${category.id}" name="cb${category.id}" class="category mx-2" data-id="${category.id}"></div>`
            }
            $('#categories').html(innerHtml);
        }
        //filters
        function filterCategory(data){
            var products = data;
            $('.category').change(function(){
                let id = $(this).data('id');
                console.log(id)
                let count = 0;
                let filtriraniProizvodi = [];
                for(let product of products){
                    if(id == product.categoryId){
                        filtriraniProizvodi.push(product)
                    }
                }
                artworks(filtriraniProizvodi)
            })
        }
        function filterShipping(data){
            var products = data;
            var filtriraniProizvodi =[];
            $("input:radio[name=rbShipping]").change(function(){
                let checked = $("input:radio[name=rbShipping]:checked").val();
                if(checked == 1){
                    artworks(products);
                }
                else {
                    for(let product of products){
                        if(checked == product.shipping){
                            filtriraniProizvodi.push(product)
                        }
                    }
                    artworks(filtriraniProizvodi)
                }
            })
        }
        function filterAvailable(data){
            var products = data;
            var filtriraniProizvodi =[];
            $("input:radio[name=rbAvailable]").change(function(){
                let checked = $("input:radio[name=rbAvailable]:checked").val();
                if(checked == 1){
                    artworks(products);
                }
                else {
                    for(let product of products){
                        if(product.inStock == 1){
                            filtriraniProizvodi.push(product)
                        }
                    }
                    artworks(filtriraniProizvodi)
                }
            })
        }
        function sortPrice(data){
            $('#price').change(function(){
                let cena = $('#price').find(":selected").val();
                console.log(cena)
                if (cena == 'asc'){
                    data.sort((a,b) => a.price >b.price ? 1 : -1)
                }
                else{
                    data.sort((a,b) => a.price < b.price ? 1 : -1)
                }

                artworks(data)
            })
        }
    }

    function productsInCart(data){
        $('.purchase').click(function (){
            var id = $(this).data('id');
            var productsInCart = getItemsFromLocalStorage('productsInCart');
            if(productsInCart){
                let le = existsInCart();
                console.log(existsInCart())
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
    function pageCart(){
        printProduct();
        let product = getItemsFromLocalStorage('productInCart');
        console.log(product)
        console.log('proba')
        function printProduct() {

        }
    }
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
            innerHtml += `<input type="radio" name="rb${title}" value="${value.Value}"/>
            <label>${value.Name}</label><br/>`;
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


}
