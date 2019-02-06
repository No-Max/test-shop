window.onload = function(){
    
    var shop = new ShopType('Все магазины');

    document.getElementById('backToShopsBtn').onclick = function(){
        pageSwitcher(document.querySelector('.shops-list'));    
    }
}

shopStorage = [
    { id:1, name: "Sex shop", address: "Дзержинского, д. 11", wHours: "10:00 - 22:00", number: 1 },
    { id:2, name: "Brownsugar", address: "Скрыганова 2Б", wHours: "10:00 - 19:00", number: 2 },
    { id:3, name: "BIGZZ", address: "просп. Машерова 76а", wHours: "24 часа в сутки", number: 3 }
];

function ShopType(name) {
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

    if (!dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
    }
    showDialogButton.addEventListener('click', function() {
        dialog.showModal();
    });
    dialog.querySelector('.close').addEventListener('click', function() {
        dialog.close();
    });
  
    updateShopList();
  
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
            if(this.value >= 0){
                updateShop(shopObj, Number(this.value));
            } else {
                addShop(shopObj);
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
        addBtnListener(editBtnclassName, function(index){
            editShop(index);
        });
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

    document.querySelector('#shopTitle').innerText = shop.name;
    
    var dialog = document.getElementById('addProductDialog');
    var showDialogButton = document.getElementById('showAddProductDialog');
    
    if (!dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
    }

    showDialogButton.addEventListener('click', function() {
      dialog.showModal();
    });

    dialog.querySelector('.close').addEventListener('click', function() {
      dialog.close();
    });

    updateProductList();

    function updateProductList(){
        container.innerHTML = '';
        productStorage.forEach(function(product) {
            if(product.shop == shop.id){
                container.append(productElement(product));
            }
        });
        addBtnListener(editBtnclassName, function(index){
            dialog.showModal();
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