// kategorie
enum Category {
  Drink = "drink",
  Dessert = "dessert"
}

// data
type MenuData = {
  id: number;
  typ: Category;
  nazev: string;
  cena: number;
  image: string;
};

const menuData: MenuData[] = [
  { id: 1, typ: Category.Drink, nazev: "Nessie's Espresso Splash", cena: 10.5, image: "https://www.foodandwine.com/thmb/xQZv2CX6FO5331PYK7uGPF1we9Q=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Partners-Flat-White-FT-BLOG0523-b11f6273c2d84462954c2163d6a1076d.jpg" },
  { id: 2, typ: Category.Drink, nazev: "Jasna Lagoon Lemonade", cena: 11.5, image: "https://thumbs.dreamstime.com/b/lemonade-mason-jar-fresh-straw-wooden-table-146624269.jpg" },
  { id: 3, typ: Category.Drink, nazev: "Misty Lake Cappucino", cena: 10.5, image: "https://insanelygoodrecipes.com/wp-content/uploads/2023/06/Cappuccino.jpg" },
  { id: 4, typ: Category.Drink, nazev: "Nessie Chill Time", cena: 8.5, image: "https://img.freepik.com/premium-photo/hot-cup-tea-wooden-table_661047-13736.jpg" },
  { id: 5, typ: Category.Dessert, nazev: "Strawberry Secret", cena: 9.5, image: "https://thf.bing.com/th/id/OIP.x9v8SxrC6heE0o4v5Vg4dQHaE7?cb=thfc1&rs=1&pid=ImgDetMain&o=7&rm=3" },
  { id: 6, typ: Category.Dessert, nazev: "Golden Croissant", cena: 6.5, image: "https://img.magnific.com/premium-photo/butter-croissant-classic-french-pastry-favorite_1106454-19101.jpg" },
  { id: 7, typ: Category.Dessert, nazev: "Berry lake Dream Cake", cena: 13.5, image: "https://replicate.delivery/xezq/NjafRvkunCw0TKem9HbXb8p6B30BjnRnd3fIoJL7X89q7pHtA/out-0.png" },
  { id: 8, typ: Category.Dessert, nazev: "Nessie's Ice Cream Treasure", cena: 9.5, image: "https://replicate.delivery/xezq/ThBzfgvU1MReXEvyabUtborOAAzGGfMjqbeJkMjHJOdWtTPaB/out-0.png" }
  
];


// trida
abstract class Item {
  constructor(
    public id: number,
    public nazev: string,
    public cena: number,
    public category: Category

  ) {}

  abstract vypocitejCenu(): number;

  getInfo(): string {
    return `${this.nazev} - ${this.cena} EUR`;
  }
}


// konktretni trid
class Drink extends Item {
  vypocitejCenu(): number {
    return this.cena; //kdyz drink, nemeni se cen
  }
}

class Dessert extends Item {
  private serviceFee = 0.5; // priplatek za baleni

  vypocitejCenu(): number {
    return this.cena + this.serviceFee;
  }
}


// veci v Kosiku
class CartItem {
  private _mnozstvi: number = 1;

  constructor(public item: Item) {}

  set mnozstvi(value: number) {
    this._mnozstvi = value < 1 ? 1 : value;
  }

  get mnozstvi() {
    return this._mnozstvi;
  }

  celkovaCena(): number {
    return this.item.vypocitejCenu() * this._mnozstvi;
  }
}


//objednavka
class Order {
  private items: CartItem[] = [];

  addItem(item: Item) {
    //kdyz je stejna vec v kosiku tak jen zvysim mnozstvi
    const exist = this.items.find(i => i.item.id === item.id);

    if (exist) {
      exist.mnozstvi += 1;
    } else {
      this.items.push(new CartItem(item));
    }
  }

  removeItem(index: number) {
    this.items.splice(index, 1);
  }

  getItems() {
    return this.items;
  }

  getTotal(): number {
    return this.items.reduce((sum, i) => sum + i.celkovaCena(), 0);
  }
}

const order = new Order();


//funkce pro tvoreni instanci
function createInstance(data: MenuData): Item {
  if (data.typ === Category.Drink) {
    return new Drink(data.id, data.nazev, data.cena, data.typ);
  } else {
    return new Dessert(data.id, data.nazev, data.cena, data.typ);
  }
}


// zobrazeni
function renderProducts(data = menuData) {
    const container = document.getElementById("products");
    if (!container) return;
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
function addToCart(id: number) {
  const data = menuData.find(d => d.id === id);
  if (!data) return;

  const item = createInstance(data);
  order.addItem(item);

  renderCart();
}


function renderCart() {
  const container = document.getElementById("cart")!;
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
  btn.onclick = () => alert("Payment system zatím není napojen ");
  container.appendChild(btn);
}


function changeQty(index: number, delta: number) {
  const item = order.getItems()[index];
  item.mnozstvi = item.mnozstvi + delta;

  if (item.mnozstvi < 1) {
    order.removeItem(index);
  }

  renderCart();
}

function removeItem(index: number) {
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