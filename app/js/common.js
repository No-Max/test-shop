window.onload=function(){
    shopState=[
        {id:1,name:"Sex shop",address:"Дзержинского, д. 11",wHours:"10:00 - 22:00",number:1},
        {id:2,name:"Brownsugar",address:"Скрыганова 2Б",wHours:"10:00 - 19:00",number:2},
        {id:3,name:"BIGZZ",address:"просп. Машерова 76а",wHours:"24 часа в сутки",number:3}
    ];
    function App(state, container) {
        this.state = state;
        this.container = container;
        this.showAllShops = function() {
            state.forEach(function(shop) {
                var item = document.createElement('div');
                item.classList.add('mdl-list__item');
                item.innerHTML =
                    '<span><i class="material-icons mdl-list__item-icon">shopping_cart</i></span>'+
                    '<span>'+ shop.name +'</span>'+                  
                    '<span>' + shop.wHours + '</span>'+
                    '<span>' + shop.address + '</span>'+
                    '<button class="mdl-button mdl-js-button mdl-button--raised mdl-button--accent"><i class="material-icons">link</i></button>';
                container.append(item);
            }); 
        }
    }
    var shop = new App(shopState, document.getElementById('shopsContainer'));
    shop.showAllShops();


}   
var foo = '';
new Sortable(document.getElementById('shopsContainer'), {
	group: "words",
	handle: ".my-handle", // Restricts sort start click/touch to the specified element
	draggable: "mdl-list__item",   // Specifies which items inside the element should be sortable
	ghostClass: "sortable-ghost",
	onAdd: function (evt){
			var itemEl = evt.item;
		},
	
		onUpdate: function (evt){
			var itemEl = evt.item; // the current dragged HTMLElement
		},
	
		onRemove: function (evt){
			var itemEl = evt.item;
		}
});
	