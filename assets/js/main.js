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
    else{
        index();
    }
    console.log(url)
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
        function artworks(data){
            let printHtml = '';
            for(let art of data){
                printHtml += `<div class="col">
            <div class="card h-100 w-100">
              <img src="${art.img.src}" class="card-img-top" alt="${art.img.alt}">
              <div class="card-body d-flex flex-column align-items-center">
                <h5 class="card-title">${art.name}</h5>
                <p>Price: ${art.price}</p>
                <button type="button" class="btn btn-primary button">Purchase Now</button>
              </div>
              <div class="card-footer">
                <small class="text-muted">Shipping: ${art.shipping}$</small>
              </div>
                </div>
              </div>`
            }
            $(".arts").html(printHtml);
        }
        function printCategories(data){
            let categories = data;
            makeDdl('Select category', categories, '#categories');
        }
        function sortByPrice(){
            let price = [{'id':'asc', 'name':'rastucoj'}, {'id':'desc', 'name':'opadajucoj'}];
            makeDdl('sortiraj po ceni', price, '#price');
        }
        function filterCategory(data){
            var products = data;
            $('#categories').change(function(){
                let idCat = $('#categories').find(":selected").val();
                let filtriraniProizvodi = [];
                for(let product of products){
                    if(idCat == product.categoryId){
                        filtriraniProizvodi.push(product)
                    }
                    if(idCat == 0){
                        filtriraniProizvodi = products
                    }
                }
                // filtriraniProizvodi = products.filter(el => el.categoryId == idCat);
                console.log(filtriraniProizvodi)
                artworks(filtriraniProizvodi)
            })
        }
        function sortPrice(data){
            $('#price').change(function(){
                let cena = $('#price').find(":selected").val();
                console.log(cena)
                if (cena == 'asc'){
                    data.sort((a,b) => a.price >b.price ? 1 : -1)
                }
                data.sort((a,b) => a.price < b.price ? 1 : -1)
                artworks(data)
            })
        }
    }
    function makeDdl(option0, values, print){
        let html=`<option value="0">${option0}</option>`;
        for(let value of values){
            html += `<option value="${value.id}">${value.name}</option>>`
        }
        $(print).html(html);
    }



}
