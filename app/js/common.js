window.onload = function(){
    //storrage for Shops and Products
    var shopStorage = [
        new Shop({name: "Sex shop", address: "Дзержинского, д. 11", wHours: "10:00 - 22:00", number: 1, coords: [53.844546, 27.550548], products: [
            new Product({number: 1, name: 'Штуки-дрюки', price: 50}),
            new Product({number: 2, name: 'Штуки-базуки', price: 60}),   
        ]}),
        new Shop({name: "Brownsugar", address: "Скрыганова 2Б", wHours: "10:00 - 19:00", number: 2, coords: [53.951456, 27.494942], products: [
            new Product({number: 1, name: 'Пирог', price: 10}),
            new Product({number: 2, name: 'Кекс', price: 3})
        ]}),
        new Shop({ id:3, name: "BIGZZ", address: "просп. Машерова 76а", wHours: "24 часа в сутки", number: 3, coords: [53.914627, 27.658311], products: [
            new Product({number: 1, name: 'Сахар', price: 10}), 
            new Product({number: 2, name: 'Гречка', price: 99})
        ] })
    ];
    //all magic after maps loading
    ymaps.ready(function () {  
        shopsList('Все магазины', shopStorage, new ymaps.Map("map", {
            center: [53.899290, 27.561581], //Minsk
            zoom: 11 
        }, {
            balloonMaxWidth: 300,
            searchControlProvider: 'yandex#search'
        }));
    });
}

/* 
    Shops list Functionality
    name[string] - name of shops list, 
    shopStorage[array] - storage of shops, 
    map[object] - ymaps.Map object
*/
function shopsList(name, shopStorage, map) {
    //get DOM elements
    var shopTypeName =  document.getElementById('shopTypeName');
    var container = document.querySelector('#shopsContainer');
    var dialog = document.getElementById('addShopDialog');
    var showDialogButton = document.getElementById('showAddShopDialog');
    var addShopBtn = document.getElementById('addShop');
    
    var dialogNameField = document.querySelector("#shopName");
    var dialogAddressField = document.querySelector("#shopAddress");
    var dialogHoursField = document.querySelector("#shopHours");
    var dialogCoordsField = document.querySelector("#shopCoords");
    
    //set the conrolls class names
    var editBtnclassName = 'edit-shop';
    var productsBtnclassName = 'show-products';
    var showOnMapBtnClass = 'map-info';
    var removeBtnclassName = 'remove-shop';

    //prepering page
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

    //init drag and drop for all shop items
    new Sortable(shopsContainer, {
        onEnd: function(e) {
            sortShops(e.newIndex, e.oldIndex);
            updateShopList();
        }
    });
    //lister for cteating/updating shop button
    addShopBtn.onclick = function(e){
        e.preventDefault(); 
        if(dialogNameField.value && dialogAddressField.value && dialogHoursField.value && dialogCoordsField.value) {
            if(!this.value){
                addShop(dialogNameField.value, dialogAddressField.value, dialogHoursField.value, dialogCoordsField.value);
            } else {                
                updateShop(dialogNameField.value, dialogAddressField.value, dialogHoursField.value, dialogCoordsField.value, Number(this.value));   
            }
        }     
    };
    
    /* 
        add shop to shopStorage
        name[string] - name of shop, 
        address[string] - address of shop, 
        wHours[string] - working hours of shop, 
        coords[array] - coordiantes for mark on the map
    */
    function addShop (name, address, wHours, coords){
        shopStorage.push(new Shop({
            name: name,
            address: address,
            wHours: wHours,
            number: shopStorage.length + 1,
            coords: coordsFromStr(coords)
        }));
        updateShopList();           
        dialog.close();
    }

    /* 
        update shop in shopStorage
        name[string] - name of shop, 
        address[string] - address of shop, 
        wHours[string] - working hours of shop, 
        coords[array] - coordiantes for mark on the map
        index[number] - position of shop in the shopStorage
    */
    function updateShop (name, address, wHours, coords, index){
        shopStorage[index].name = name;
        shopStorage[index].address = address;
        shopStorage[index].wHours = wHours;
        shopStorage[index].coords = coordsFromStr(coords);

        dialogNameField.value = '';
        dialogAddressField.value = ''; 
        dialogHoursField.value = ''; 

        addShopBtn.value = '';
        updateShopList();           
        dialog.close();
    }
    
    /* 
        open modal and fill fields to edit shop in the shopStorage
        index[number] - position of shop in the shopStorage
    */
    function editShop(index) {
        addShopBtn.value = index;
        
        dialogNameField.value = shopStorage[index].name;
        dialogAddressField.value = shopStorage[index].address; 
        dialogHoursField.value = shopStorage[index].wHours; 
        dialogCoordsField.value = shopStorage[index].coords;
        
        var event = new Event("input");
        dialogAddressField.dispatchEvent(event);
        dialogHoursField.dispatchEvent(event);
        dialogNameField.dispatchEvent(event);
        dialog.showModal();
    }

    //update list of shops and set listeners for buttons
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
        addBtnListener(showOnMapBtnClass, function(index){
            map.balloon.open(shopStorage[index].coords, {
                contentHeader: shopStorage[index].name,
                contentBody: shopStorage[index].address,
                contentFooter: '<sup>' + shopStorage[index].wHours + '</sup>'
            });
        });
        addBtnListener(removeBtnclassName, function(index, id){
            for(var i = 0; i < shopStorage.length; i++){
                if(shopStorage[i].id == id){
                    shopStorage.splice(i, 1);
                }
            }
            updateShopList();
        });
    }

    /*
        create shop markup
        shop[object] - shop object
        return[object] - html element of shop
    */
    function shopElement(shop){
        var item = document.createElement('div');
            item.classList.add('mdl-list__item');
            item.innerHTML =
                '<span>' + shop.number + '.</span>'+
                '<span>'+ shop.name +'</span>'+                  
                '<span>' + shop.wHours + '</span>'+
                '<span><a href="#" class="' + showOnMapBtnClass + '">' + shop.address + '<i class="material-icons">place</i></a></span>'+
                '<span><button value="' + shop.id + '" class="' + removeBtnclassName + ' mdl-button mdl-js-button mdl-button--raised mdl-button--accent"><i class="material-icons">delete</i></button></span>'+
                '<span><button class="' + productsBtnclassName + ' mdl-button mdl-js-button mdl-button--raised mdl-button--accent"><i class="material-icons">list</i></button></span>'+
                '<button class="' + editBtnclassName + ' mdl-button mdl-js-button mdl-button--raised mdl-button--accent"><i class="material-icons">edit</i></button>';
        return item;
    };

    /*
        sort shop list on the page
        currentIndex[number] - current index in the shop list,
        oldIndex[number] - old index in the shop list
    */
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

    //set right numbers for shops in the shopStorage
    function sortShopNumbers(){
        for(var i = 0; i < shopStorage.length; i++){
            shopStorage[i].number = i+1;
        }    
    }
}

/* 
    products list Functionality
    shop[object] - active shop objet,  
    map[object] - ymaps.Map object
*/
function productsList(shop, map){
    //get DOM elements
    var addProductBtn = document.getElementById('addProduct');
    var container = document.querySelector('#productsContainer');
    var dialog = document.getElementById('addProductDialog');
    var showDialogButton = document.getElementById('showAddProductDialog');
    var editBtnclassName = 'edit-product';
    var dialogPriceField = document.getElementById('productPrice');
    var dialogNameField = document.getElementById('productName');
    var backToShopsBtn = document.getElementById('backToShopsBtn');
    var productListPage = document.querySelector('.shops-list');
    var removeBtnclassName = 'remove-product';
    
    //prepearing page
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
    
    //show only current mark on the map 
    map.geoObjects.removeAll();
    var cont = '<b>' + shop.name + '</b>' + '<br>' + shop.wHours;
    map.geoObjects.add(new ymaps.Placemark(shop.coords, {
        balloonContent: cont
    }, {
        preset: 'twirl#violetIcon'
    }));

    //back to sops list page button listener
    backToShopsBtn.onclick = function(){
        pageSwitcher(productListPage);
        var event = new Event('backToShopPage');
        document.dispatchEvent(event);    
    }

    //add/edit product button listener
    addProductBtn.onclick = function(e){
        e.preventDefault();
        if(dialogNameField.value && dialogPriceField.value){
            if(!this.value){  
                addProduct(dialogNameField.value, dialogPriceField.value);
            }else{
                updateProduct(dialogNameField.value, dialogPriceField.value, this.value)
            }    
        }  
    };

    /* 
        add new product to shop.products
        name[string] - name of product,  
        price[number] - price of product
    */
    function addProduct(name, price){   
        var number = 1;
        if(shop.products){
            number = shop.products.length + 1;
        }     
        shop.addProduct(new Product({
            name: name,
            price: price,
            number: number
        }));
        updateProductList();           
        dialog.close();
    }

    /* 
        update product in shop.products
        name[string] - name of product,  
        price[number] - price of product
        id[number] - id of product
    */
    function updateProduct(name, price, id){
        var index = getIndexById(id);
        shop.products[index].name = name;
        shop.products[index].price = price;

        dialogNameField.value = '';
        dialogPriceField.value = '';

        addProductBtn.value = '';
        updateProductList();           
        dialog.close();
    }

    /* 
        edit product in shop.products
        id[number] - id of product
    */
    function editProduct(id) {
        addProductBtn.value = id;
        var index = getIndexById(id);
        dialogNameField.value = shop.products[index].name ;
        dialogPriceField.value = shop.products[index].price;

        dialog.showModal();        
        var event = new Event("input");
        dialogPriceField.dispatchEvent(event);
        dialogNameField.dispatchEvent(event);
    }

    //update list of products and set listeners for buttons
    function updateProductList(){
        if(shop.products){
            container.innerHTML = '';
            for(var i = 0; i < shop.products.length; i++){
                container.append(productElement(shop.products[i]));
            }
            addBtnListener(editBtnclassName, function(index, id){
                editProduct(id);
            });
            addBtnListener(removeBtnclassName, function(index, id){
                shop.products.splice(getIndexById(id), 1);
                updateProductList();
            });
        }
    }
    /*

    /*
        create product markup
        product[object] - product object
        return[object] - html element of product
    */
    function productElement(product){
        var item = document.createElement('tr');
            item.innerHTML =
            '<td>' + product.number + '</td>'+
            '<td>' + product.name + '</td>'+
            '<td>$' + product.price + '</td>'+
            '<td><button value="' + product.id + '" class="' + removeBtnclassName + ' mdl-button mdl-js-button mdl-button--raised mdl-button--accent"><i class="material-icons">delete</i></button><button value="' + product.id + '" class="' + editBtnclassName + ' mdl-button mdl-js-button mdl-button--raised mdl-button--accent"><i class="material-icons">edit</i></button></td>';
        return item;
    };

    /*
        get product index by id
        id[number] - id of product
        return[number] - index of product
    */
    function getIndexById(id){
        var index;
        for(var i = 0; i < shop.products.length; i++){
            if(shop.products[i].id == id){
                index = i;
            }
        };
        return index;
    }
}

//class for Shop
function Shop(shop){    
    this.id = new Date().getTime() + Math.random();
    this.name = shop.name;
    this.address = shop.address;
    this.wHours = shop.wHours;
    this.number = shop.number;
    this.coords = shop.coords;
    this.products = [];
    if(shop.products){
        this.products = shop.products;
    }
    this.addProduct = function(product){
        this.products.push(product);
    };
}

//class for Product
function Product(product){    
    this.id = new Date().getTime() + Math.random();
    this.name = product.name;
    this.price = product.price;
    this.number = product.number;
}

/*
    return coordinates from string
    str[string] - string of coordinates
    return[array] - array of coordinates
*/
function coordsFromStr(str){
    var coordsArr = str.split(',');
    coordsArr[0] = Number(coordsArr[0].trim()); 
    coordsArr[1] = Number(coordsArr[1].trim()); 
    return [coordsArr[0], coordsArr[1]];
}

/*
    add listeners for buttons
    btnclassName[string] - class name for buttons
    cb[function] - callback
*/
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

/*
    Switch between pages
    page[object] - object for page to switch
*/
function pageSwitcher(page){
    var pages = document.getElementsByClassName('page');
    for(var i = 0; i < pages.length; i++){
        pages[i].classList.remove('active');
    }
    page.classList.add('active');
}