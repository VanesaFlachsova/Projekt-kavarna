"use strict";
// kategorie
var Category;
(function (Category) {
    Category["Drink"] = "drink";
    Category["Dessert"] = "dessert";
})(Category || (Category = {}));
const menuData = [
    { id: 1, typ: Category.Drink, nazev: "Nessie's Espresso Splash", cena: 10.5, image: "https://www.foodandwine.com/thmb/xQZv2CX6FO5331PYK7uGPF1we9Q=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Partners-Flat-White-FT-BLOG0523-b11f6273c2d84462954c2163d6a1076d.jpg" },
    { id: 2, typ: Category.Drink, nazev: "Jasna Lagoon Lemonade", cena: 11.5, image: "https://thumbs.dreamstime.com/b/lemonade-mason-jar-fresh-straw-wooden-table-146624269.jpg" },
    { id: 3, typ: Category.Drink, nazev: "Misty Lake Cappucino", cena: 10.5, image: "https://insanelygoodrecipes.com/wp-content/uploads/2023/06/Cappuccino.jpg" },
    { id: 4, typ: Category.Drink, nazev: "Nessie Chill Time", cena: 8.5, image: "https://img.freepik.com/premium-photo/hot-cup-tea-wooden-table_661047-13736.jpg" },
    { id: 5, typ: Category.Dessert, nazev: "Strawberry Secret", cena: 9.5, image: "https://thf.bing.com/th/id/OIP.x9v8SxrC6heE0o4v5Vg4dQHaE7?cb=thfc1&rs=1&pid=ImgDetMain&o=7&rm=3" },
    { id: 6, typ: Category.Dessert, nazev: "Golden Croissant", cena: 6.5, image: "https://img.magnific.com/premium-photo/butter-croissant-classic-french-pastry-favorite_1106454-19101.jpg" },
    { id: 7, typ: Category.Dessert, nazev: "Berry lake Dream Cake", cena: 13.5, image: "https://i.pinimg.com/originals/ce/80/21/ce80210dd4df9279120c0465464366da.jpg" },
    { id: 8, typ: Category.Dessert, nazev: "Nessie's Ice Cream Treasure", cena: 9.5, image: "https://d1ralsognjng37.cloudfront.net/25c4e9dc-ba1d-4a1a-92d0-ba70d377ac6e.jpeg" }
];
// trida
class Item {
    id;
    nazev;
    cena;
    category;
    constructor(id, nazev, cena, category) {
        this.id = id;
        this.nazev = nazev;
        this.cena = cena;
        this.category = category;
    }
    getInfo() {
        return `${this.nazev} - ${this.cena} EUR`;
    }
}
// konktretni trid
class Drink extends Item {
    vypocitejCenu() {
        return this.cena; //kdyz drink, nemeni se cen
    }
}
class Dessert extends Item {
    serviceFee = 0.5; // priplatek za baleni
    vypocitejCenu() {
        return this.cena + this.serviceFee;
    }
}
// veci v Kosiku
class CartItem {
    item;
    _mnozstvi = 1;
    constructor(item) {
        this.item = item;
    }
    set mnozstvi(value) {
        this._mnozstvi = value < 1 ? 1 : value;
    }
    get mnozstvi() {
        return this._mnozstvi;
    }
    celkovaCena() {
        return this.item.vypocitejCenu() * this._mnozstvi;
    }
}
//objednavka
class Order {
    items = [];
    addItem(item) {
        //kdyz je stejna vec v kosiku tak jen zvysim mnozstvi
        const exist = this.items.find(i => i.item.id === item.id);
        if (exist) {
            exist.mnozstvi += 1;
        }
        else {
            this.items.push(new CartItem(item));
        }
    }
    removeItem(index) {
        this.items.splice(index, 1);
    }
    getItems() {
        return this.items;
    }
    getTotal() {
        return this.items.reduce((sum, i) => sum + i.celkovaCena(), 0);
    }
}
const order = new Order();
//funkce pro tvoreni instanci
function createInstance(data) {
    if (data.typ === Category.Drink) {
        return new Drink(data.id, data.nazev, data.cena, data.typ);
    }
    else {
        return new Dessert(data.id, data.nazev, data.cena, data.typ);
    }
}
// zobrazeni
function renderProducts(data = menuData) {
    const container = document.getElementById("products");
    if (!container)
        return;
    container.innerHTML = "";
    data.forEach(d => {
        const div = document.createElement("div");
        div.className = "product-box";
        div.innerHTML = `
      <img src="${d.image}" alt="${d.nazev}" class="product-img">

      <h3>${d.nazev}</h3>

      <p>${d.cena} EUR</p>

      <button onclick="addToCart(${d.id})">Add</button>
    `;
        container.appendChild(div);
    });
}
// logic
function addToCart(id) {
    const data = menuData.find(d => d.id === id);
    if (!data)
        return;
    const item = createInstance(data);
    order.addItem(item);
    renderCart();
}
function renderCart() {
    const container = document.getElementById("cart");
    container.innerHTML = "";
    const items = order.getItems();
    items.forEach((c, index) => {
        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
      <h4>${c.item.nazev}</h4>

      <div class="qty-controls">
        <button onclick="changeQty(${index}, -1)">−</button>
        <span>${c.mnozstvi}</span>
        <button onclick="changeQty(${index}, 1)">+</button>

        <button class="remove" onclick="removeItem(${index})">✕</button>
      </div>

      <p>${c.celkovaCena().toFixed(2)} EUR</p>
    `;
        container.appendChild(div);
    });
    // celkem
    const totalDiv = document.createElement("div");
    totalDiv.innerHTML = `<h3>Total: ${order.getTotal().toFixed(2)} EUR</h3>`;
    container.appendChild(totalDiv);
    //check
    const btn = document.createElement("button");
    btn.className = "checkout-btn";
    btn.innerText = "Zaplatit";
    btn.onclick = () => alert("Zaplaceno! Děkujeme za vaši objednávku.");
    container.appendChild(btn);
}
function changeQty(index, delta) {
    const item = order.getItems()[index];
    item.mnozstvi = item.mnozstvi + delta;
    if (item.mnozstvi < 1) {
        order.removeItem(index);
    }
    renderCart();
}
function removeItem(index) {
    order.removeItem(index);
    renderCart();
}
function showDrinks() {
    renderProducts(menuData.filter(d => d.typ === Category.Drink));
}
function showDesserts() {
    renderProducts(menuData.filter(d => d.typ === Category.Dessert));
}
// start
renderProducts();
