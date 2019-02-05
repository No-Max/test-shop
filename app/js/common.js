window.onload = function(){
    
    var shop = new ShopType('Все магазины');

    document.getElementById('shopTypeName').innerHTML = shop.name;

    
    var addShopBtn = document.getElementById('addShop');
    var dialog = document.getElementById('addShopDialog');
    var showDialogButton = document.getElementById('showAddShopDialog');
    
    if (! dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
    }

    showDialogButton.addEventListener('click', function() {
      dialog.showModal();
    });

    dialog.querySelector('.close').addEventListener('click', function() {
      dialog.close();
    });

    addShopBtn.onclick = function(e){
        e.preventDefault();
        shopObj = {
            name: document.querySelector("#shopName").value, 
            address: document.querySelector("#shopAddress").value, 
            wHours: document.querySelector("#shopHours").value    
        }
        if(shopObj.name && shopObj.address && shopObj.wHours){
            shop.addShop(shopObj);
            dialog.close();
        }  
    };

    document.getElementById('backToShopsBtn').onclick = function(){
        pageSwitcher(document.querySelector('.shops-list'));    
    }
}

shopStorage = [
    { id:1, name: "Sex shop", address: "Дзержинского, д. 11", wHours: "10:00 - 22:00", number: 1 },
    { id:2, name: "Brownsugar", address: "Скрыганова 2Б", wHours: "10:00 - 19:00", number: 2 },
    { id:3, name: "BIGZZ", address: "просп. Машерова 76а", wHours: "24 часа в сутки", number: 3 }
];
function findShopByID(id){
    var result;
    shopStorage.forEach(function(shop){
        if(shop.id == id) result = shop;
    });
    return result;
}

function ShopType(name) {
    this.name = name;
    this.addShop = function(shop){
        shop.id = shopStorage.length + 1;
        shop.number = shopStorage.length + 1;
        shopStorage.push(shop);   
        updateShopList();   
    }

    var container = document.querySelector('#shopsContainer');
    var editBtnclassName = 'edit-shop';
    var productsBtnclassName = 'show-products';
    
    updateShopList();

    new Sortable(shopsContainer, {
        onEnd: function(e) {
            sortShops(e.newIndex, e.oldIndex);
            updateShopList();
        }
    });

    function shopElement(shop){
        var item = document.createElement('div');
            item.classList.add('mdl-list__item');
            item.innerHTML =
                '<span>' + shop.number + '.</span>'+
                '<span>'+ shop.name +'</span>'+                  
                '<span>' + shop.wHours + '</span>'+
                '<span>' + shop.address + '</span>'+
                '<span><button class="' + productsBtnclassName + ' mdl-button mdl-js-button mdl-button--raised mdl-button--accent">Товары</button></span>'+
                '<button class="' + editBtnclassName + ' mdl-button mdl-js-button mdl-button--raised mdl-button--accent"><i class="material-icons">edit</i></button>';
        return item;
    };

    function updateShopList(){
        container.innerHTML = '';
        shopStorage.forEach(function(shop) {
            container.append(shopElement(shop));
        });
        addBtnListener(productsBtnclassName, function(index){
            new Product(shopStorage[index]);
        });
    }
    function sortShops(currentIndex, oldIndex){
        var buffer = shopStorage[oldIndex];
        if (currentIndex < oldIndex){
            for(var i = oldIndex; i > currentIndex; i--){
                shopStorage[i] = shopStorage[i-1];
            }
            shopStorage[currentIndex] = buffer;
        }else if (currentIndex > oldIndex){
            for(var i = oldIndex; i < currentIndex; i++){
                shopStorage[i] = shopStorage[i+1];
            }
            shopStorage[currentIndex] = buffer;
        }
        sortShopNumbers();
    }

    function sortShopNumbers(){
        for(var i = 0; i < shopStorage.length; i++){
            shopStorage[i].number = i+1;
        }    
    }
}

productStorage = [
    {id: 1, number: 1, name: 'Штуки-дрюки', price: 50, shop: 1},
    {id: 2, number: 2, name: 'Штуки-базуки', price: 60, shop: 1},
    {id: 3, number: 3, name: 'Пирог', price: 10, shop: 2},
    {id: 4, number: 4, name: 'Кекс', price: 3, shop: 2},  
    {id: 5, number: 5, name: 'Сахар', price: 10, shop: 3}, 
    {id: 6, number: 6, name: 'Гречка', price: 99, shop: 3},   
];

function Product(shop){
    
    var container = document.querySelector('#productsContainer');
    
    var editBtnclassName = 'edit-product';
    
    pageSwitcher(container.parentNode.parentNode);

    document.querySelector('#shopName').innerText = shop.name;
    
    updateProductList();

    function updateProductList(){
        container.innerHTML = '';
        productStorage.forEach(function(product) {
            if(product.shop == shop.id){
                container.append(productElement(product));
            }
        });
        addBtnListener(editBtnclassName, function(index){
                
        });
    }

    function productElement(product){
        var item = document.createElement('tr');
            item.innerHTML =
            '<td>' + product.number + '</td>'+
            '<td>' + product.name + '</td>'+
            '<td>$' + product.price + '</td>'+
            '<td><button class="' + editBtnclassName + ' mdl-button mdl-js-button mdl-button--raised mdl-button--accent"><i class="material-icons">edit</i></button></td>';
        return item;
    };
}







function addBtnListener(btnclassName, cb){
    var editBtns = document.getElementsByClassName(btnclassName); 
    for(var i = 0; i < editBtns.length; i++){
        (function(index) { 
            editBtns[i].onclick = function(e){
                cb(index, event);
            };
        })(i);     
    }
}

function pageSwitcher(page){
    var pages = document.getElementsByClassName('page');
    for(var i = 0; i < pages.length; i++){
        pages[i].classList.remove('active');
    }
    page.classList.add('active');
}