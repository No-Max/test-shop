window.onload = function(){
    var shopStorage = [
        { id:1, name: "Sex shop", address: "Дзержинского, д. 11", wHours: "10:00 - 22:00", number: 1, coords: [53.844546, 27.550548], products: [
            {id: 1, number: 1, name: 'Штуки-дрюки', price: 50, shop: 1},
            {id: 2, number: 2, name: 'Штуки-базуки', price: 60, shop: 1},   
        ]},
        { id:2, name: "Brownsugar", address: "Скрыганова 2Б", wHours: "10:00 - 19:00", number: 2, coords: [53.951456, 27.494942], products: [
            {id: 3, number: 1, name: 'Пирог', price: 10, shop: 2},
            {id: 4, number: 2, name: 'Кекс', price: 3, shop: 2}
        ]},
        { id:3, name: "BIGZZ", address: "просп. Машерова 76а", wHours: "24 часа в сутки", number: 3, coords: [53.914627, 27.658311], products: [
            {id: 5, number: 1, name: 'Сахар', price: 10, shop: 3}, 
            {id: 6, number: 2, name: 'Гречка', price: 99, shop: 3}
        ] }
    ];
    ymaps.ready(function () {  
        shopsList('Все магазины', shopStorage, new ymaps.Map("map", {
            center: [53.802257, 27.661831], //Minsk
            zoom: 10 
        }, {
            balloonMaxWidth: 300,
            searchControlProvider: 'yandex#search'
        }));
    });
}

function shopsList(name, shopStorage, map) {
    var shopTypeName =  document.getElementById('shopTypeName');
    var container = document.querySelector('#shopsContainer');
    var dialog = document.getElementById('addShopDialog');
    var showDialogButton = document.getElementById('showAddShopDialog');
    var addShopBtn = document.getElementById('addShop');
    
    var dialogNameField = document.querySelector("#shopName");
    var dialogAddressField = document.querySelector("#shopAddress");
    var dialogHoursField = document.querySelector("#shopHours");
    
    var editBtnclassName = 'edit-shop';
    var productsBtnclassName = 'show-products';

    shopTypeName.innerHTML = name;
    updateShopList(); 
    document.addEventListener('backToShopPage', function (e) {
        updateShopList();        
    }, false);
    
    if (!dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
    }
    showDialogButton.addEventListener('click', function() {
        dialog.showModal();
    });
    dialog.querySelector('.close').addEventListener('click', function() {
        dialog.close();
        addShopBtn.value = '';
    });
  
    new Sortable(shopsContainer, {
        onEnd: function(e) {
            sortShops(e.newIndex, e.oldIndex);
            updateShopList();
        }
    });

    addShopBtn.onclick = function(e){
        e.preventDefault();
        var shopObj = {
            name: dialogNameField.value, 
            address: dialogAddressField.value, 
            wHours: dialogHoursField.value    
        }
        if(shopObj.name && shopObj.address && shopObj.wHours){
            if(!this.value){
                addShop(shopObj);
            } else {                
                updateShop(shopObj, Number(this.value));   
            }
        }  
    };
    
    function addShop (shop){
        shop.id = shopStorage.length + 1;
        shop.number = shopStorage.length + 1;
        shopStorage.push(shop);
        updateShopList();           
        dialog.close();
    }

    function updateShop (shop, index){
        shopStorage[index].name = shop.name;
        shopStorage[index].address = shop.address;
        shopStorage[index].wHours = shop.wHours;
        
        dialogNameField.value = '';
        dialogAddressField.value = ''; 
        dialogHoursField.value = ''; 

        addShopBtn.value = '';
        updateShopList();           
        dialog.close();
    }

    function editShop(index) {
        addShopBtn.value = index;
        var shop = shopStorage[index];
        dialog.showModal();
        dialogNameField.value = shop.name;
        dialogAddressField.value = shop.address; 
        dialogHoursField.value = shop.wHours; 
        var event = new Event("input");
        dialogAddressField.dispatchEvent(event);
        dialogHoursField.dispatchEvent(event);
        dialogNameField.dispatchEvent(event);
    }

    function updateShopList(){
        container.innerHTML = '';
        shopStorage.forEach(function(shop) {
            container.append(shopElement(shop));
        });
        addBtnListener(productsBtnclassName, function(index){
            productsList(shopStorage[index], map);
        });
        addBtnListener(editBtnclassName, function(index){
            editShop(index);
        });
        map.geoObjects.removeAll();
        for(var i = 0; i < shopStorage.length; i++){
            var cor = shopStorage[i].coords;
            var cont = '<b>' + shopStorage[i].name + '</b>' + '<br>' + shopStorage[i].wHours;
            map.geoObjects.add(new ymaps.Placemark(cor, {
                balloonContent: cont
            }, {
                preset: 'twirl#violetIcon'
            }));
        }
    }

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

var productStorage = [
    {id: 1, number: 1, name: 'Штуки-дрюки', price: 50, shop: 1},
    {id: 2, number: 2, name: 'Штуки-базуки', price: 60, shop: 1},
    {id: 3, number: 1, name: 'Пирог', price: 10, shop: 2},
    {id: 4, number: 2, name: 'Кекс', price: 3, shop: 2},  
    {id: 5, number: 1, name: 'Сахар', price: 10, shop: 3}, 
    {id: 6, number: 2, name: 'Гречка', price: 99, shop: 3},   
];

function productsList(shop, map){
    var addProductBtn = document.getElementById('addProduct');
    var container = document.querySelector('#productsContainer');
    var dialog = document.getElementById('addProductDialog');
    var showDialogButton = document.getElementById('showAddProductDialog');
    var editBtnclassName = 'edit-product';
    var dialogPriceField = document.getElementById('productPrice');
    var dialogNameField = document.getElementById('productName');
    var backToShopsBtn = document.getElementById('backToShopsBtn');
    var productListPage = document.querySelector('.shops-list')
    var productStorage = shop.products;
    pageSwitcher(container.parentNode.parentNode);
    updateProductList();
    document.querySelector('#shopTitle').innerText = shop.name;
    
    if (!dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
    }
    showDialogButton.addEventListener('click', function() {
        dialog.showModal();
    });
    dialog.querySelector('.close').addEventListener('click', function() {
        dialog.close();
        addProductBtn.value = '';
    });

    map.geoObjects.removeAll();
    var cont = '<b>' + shop.name + '</b>' + '<br>' + shop.wHours;
    map.geoObjects.add(new ymaps.Placemark(shop.coords, {
        balloonContent: cont
    }, {
        preset: 'twirl#violetIcon'
    }));

    addProductBtn.onclick = function(e){
        e.preventDefault();
        var prodObj = {
            name: dialogNameField.value, 
            price: dialogPriceField.value 
        }
        if(prodObj.name && prodObj.price){
            if(!this.value){  
                addProduct(prodObj);
            }else{
                updateProduct(prodObj, this.value)
            }    
        }  
    };
    backToShopsBtn.onclick = function(){
        pageSwitcher(productListPage);
        var event = new Event('backToShopPage');
        document.dispatchEvent(event);    
    }

    function updateProductList(){
        container.innerHTML = '';
        productStorage.forEach(function(product) {
            if(product.shop == shop.id){
                container.append(productElement(product));
            }
        });
        addBtnListener(editBtnclassName, function(index, id){
            editProduct(id);
        });
    }

    function editProduct(id) {
        addProductBtn.value = id;
        var index = getIndexById(id);
        dialogNameField.value = productStorage[index].name ;
        dialogPriceField.value = productStorage[index].price;

        dialog.showModal();        
        var event = new Event("input");
        dialogPriceField.dispatchEvent(event);
        dialogNameField.dispatchEvent(event);
    }

    function updateProduct(productObj, id){
        var index = getIndexById(id);
        productStorage[index].name = productObj.name;
        productStorage[index].price = productObj.price;
        dialogNameField.value = '';
        dialogPriceField.value = '';

        addProductBtn.value = '';
        updateProductList();           
        dialog.close();
    }

    function addProduct(productObj){
        productObj.id = productStorage.length + 1;
        productObj.number = getNewNumber();
        productObj.shop = shop.id;
        productStorage.push(productObj);

        updateProductList();           
        dialog.close();
    }

    function productElement(product){
        var item = document.createElement('tr');
            item.innerHTML =
            '<td>' + product.number + '</td>'+
            '<td>' + product.name + '</td>'+
            '<td>$' + product.price + '</td>'+
            '<td><button value="' + product.id + '" class="' + editBtnclassName + ' mdl-button mdl-js-button mdl-button--raised mdl-button--accent"><i class="material-icons">edit</i></button></td>';
        return item;
    };
    function getIndexById(id){
        var index;
        for(var i = 0; i < productStorage.length; i++){
            if(productStorage[i].id == id){
                index = i;
            }
        };
        return index;
    }
    function getNewNumber(){
        var id = 0;
        for(var i = 0; i < productStorage.length; i++){
            if(productStorage[i].shop == shop.id){
                id++;
            }
        };
        return id+1;
    }
}

function Shop(shop){    
    this.id = new Date().getTime();
    this.name = shop.name;
    this.address = shop.address;
    this.wHours = shop.wHours;
    this.number = shop.number;
    this.products = [];
    this.addProduct = function(product){
        this.products.push(product);
    };
}

function addBtnListener(btnclassName, cb){
    var editBtns = document.getElementsByClassName(btnclassName); 
    for(var i = 0; i < editBtns.length; i++){
        (function(index) { 
            editBtns[i].onclick = function(){
                cb(index, this.value);
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