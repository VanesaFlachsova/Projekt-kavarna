// kategorie
enum Category {
  Drink = "drink",
  Dessert = "dessert"
}

// data produktu
type MenuData = {
  id: number;
  typ: Category;
  nazev: string;
  cena: number;
  image: string;
};

const menuData: MenuData[] = [ // data pro naplneni menu
  { id: 1, typ: Category.Drink, nazev: "Nessie's Espresso Splash", cena: 10.5, image: "https://www.foodandwine.com/thmb/xQZv2CX6FO5331PYK7uGPF1we9Q=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Partners-Flat-White-FT-BLOG0523-b11f6273c2d84462954c2163d6a1076d.jpg" },
  { id: 2, typ: Category.Drink, nazev: "Jasna Lagoon Lemonade", cena: 11.5, image: "https://thumbs.dreamstime.com/b/lemonade-mason-jar-fresh-straw-wooden-table-146624269.jpg" },
  { id: 3, typ: Category.Drink, nazev: "Misty Lake Cappucino", cena: 10.5, image: "https://insanelygoodrecipes.com/wp-content/uploads/2023/06/Cappuccino.jpg" },
  { id: 4, typ: Category.Drink, nazev: "Nessie Chill Time", cena: 8.5, image: "https://img.freepik.com/premium-photo/hot-cup-tea-wooden-table_661047-13736.jpg" },
  { id: 5, typ: Category.Dessert, nazev: "Strawberry Secret", cena: 9.5, image: "https://thf.bing.com/th/id/OIP.x9v8SxrC6heE0o4v5Vg4dQHaE7?cb=thfc1&rs=1&pid=ImgDetMain&o=7&rm=3" },
  { id: 6, typ: Category.Dessert, nazev: "Golden Croissant", cena: 6.5, image: "https://img.magnific.com/premium-photo/butter-croissant-classic-french-pastry-favorite_1106454-19101.jpg" },
  { id: 7, typ: Category.Dessert, nazev: "Berry lake Dream Cake", cena: 13.5, image: "https://www.beyondthebayoublog.com/wp-content/uploads/2024/02/Overview-How-to-make-Fruit-Cake-1024x683.png" },
  { id: 8, typ: Category.Dessert, nazev: "Nessie's Ice Cream Treasure", cena: 9.5, image: "https://thumbs.dreamstime.com/b/beautiful-ice-cream-glass-closeup-42036406.jpg" }
  
];


// trida
abstract class Item { //abstraktni pro drinky a dezerty protoze se lisi v vypoctu ceny ale maji stejne vlastnosti jako id, nazev atd.
  constructor(
    public id: number,
    public nazev: string,
    public cena: number,
    public category: Category

  ) {}

  abstract vypocitejCenu(): number; // metoda pro vypocet ceny bude v cisle, ale konkretni implementac bude v konkretnich tridach

  getInfo(): string { // zobrazeni nazvu a ceny
    return `${this.nazev} - ${this.cena} EUR`;
  }
}


// konktretni tridy
class Drink extends Item {
  vypocitejCenu(): number {
    return this.cena;
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
  private _mnozstvi: number = 1; // produkt v kosiku zacina na 1

  constructor(public item: Item) {} // pro ulozeni produktu, ktery je v kosiku

  set mnozstvi(value: number) {
    this._mnozstvi = value < 1 ? 1 : value;
  } //kontrola aby to nebylo min nez 1

  get mnozstvi() { //získani mnozstvi
    return this._mnozstvi; 
  } 

  celkovaCena(): number { 
    return this.item.vypocitejCenu() * this._mnozstvi; //cena produktu krat mnozstvi
  }
}


//objednavka
class Order {
  private items: CartItem[] = [];

  addItem(item: Item) {
    //kdyz je stejna vec v kosiku tak jen zvysim mnozstvi
    const exist = this.items.find(i => i.item.id === item.id);
 
    if (exist) { // jestli uz je v kosiku, tak jen zvysim mnozstvi
      exist.mnozstvi += 1; 
    } else { // jinak pridam novou polozku
      this.items.push(new CartItem(item));
    }
  } 

  removeItem(index: number) { // odstraneni polozky z kosiku
    this.items.splice(index, 1);
  } 

  getItems() { // ziskani polozek 
    return this.items;
  }

  getTotal(): number { // vypocet celkove ceny objednavky
    return this.items.reduce((sum, i) => sum + i.celkovaCena(), 0); // projdu vsechny polozky a sectu jejich ceny. reduce je metoda pro agregaci pole, zacina s 0 a pro kazdou polozku pricte celkovou cenu k sumu
  }
}

const order = new Order();


//funkce pro tvoreni instanci
function createInstance(data: MenuData): Item {
  if (data.typ === Category.Drink) {
    return new Drink(data.id, data.nazev, data.cena, data.typ); // kdyz je to drink vytvorim instanci drink
  } else {
    return new Dessert(data.id, data.nazev, data.cena, data.typ); // kdyz dezert tak dezert
  }
}


// zobrazeni
function renderProducts(data = menuData) {
    const container = document.getElementById("products"); // ziskani elementu pro zobrazeni produktu
    if (!container) return; // kontrola jestli element je
    container.innerHTML = ""; // vycisteni 
    data.forEach(d => { //pro kazdej produkt vytvori div a naplni ho informacemi o produktu
        const div = document.createElement("div"); 
        div.className = "product-box"; // pridani tridy pro styling
        div.innerHTML = `  
      <img src="${d.image}" alt="${d.nazev}" class="product-img"> // zobrazeni obrazku 
 
      <h3>${d.nazev}</h3> 

      <p>${d.cena} EUR</p> 

      <button onclick="addToCart(${d.id})">Add</button>  // tlacitko pro pridani do kosiku, vola funkci s id
    `;
        container.appendChild(div); // pridani divu do kontejneru
    });
}


// logic
function addToCart(id: number) { // funkce pro pridani produktu do kosiku bere id daneho produktu
  const data = menuData.find(d => d.id === id);
  if (!data) return;

  const item = createInstance(data); //vytvari instance produktu drink neboo dezert podle dat
  order.addItem(item);

  renderCart(); // zobrazuje aktualizovany kosik
}


function renderCart() { // zobrazeni celkove kosiku
  const container = document.getElementById("cart")!; // ziskani elementu pro zobrazeni kosiku
  container.innerHTML = ""; //cisto

  const items = order.getItems(); // ziskani polozek

  items.forEach((c, index) => { //pro kazdou polozku udela div a naplni informacemi a tlacitka zmena mnozstvi a krizek pro zruseni
    const div = document.createElement("div");
    div.className = "cart-item"; // stylin
//zobrazeni nazvu mnozstvi a ceny + tlacitka pro +/-/x
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
  const totalDiv = document.createElement("div"); // celkova cena
  totalDiv.innerHTML = `<h3>Total: ${order.getTotal().toFixed(2)} EUR</h3>`; // zobrazeni
  container.appendChild(totalDiv); // pridani do kontejneru, funguje jako posledni polozka v kosiku

  //check
  const btn = document.createElement("button"); // zaplaceni
  btn.className = "checkout-btn"; 
  btn.innerText = "Zaplatit"; // text tlacitka
  btn.onclick = () => alert("Payment system zatím není napojen "); // alert 
  container.appendChild(btn); //to the kontejner
}


function changeQty(index: number, delta: number) { // zmena mnozstvi produktu v kosiku
  const item = order.getItems()[index]; //ziskani polozky by index
  item.mnozstvi = item.mnozstvi + delta; // zmena mnozstvi podle delta, ktere muze byt +1 nebo -1

  if (item.mnozstvi < 1) { // kdyz je mnozstvi min nez 1, odstran z kosiku
    order.removeItem(index);
  }

  renderCart(); //aktualizace
}

function removeItem(index: number) { //odstraneni polozky z kosiku
  order.removeItem(index); 
  renderCart();
}


function showDrinks() { //zobrazeni jen dirnku
  renderProducts(menuData.filter(d => d.typ === Category.Drink)); //filtruje podle typu
}

function showDesserts() { //zpbrazeni jen dezertu
  renderProducts(menuData.filter(d => d.typ === Category.Dessert));
}


// start
renderProducts(); //aktualizace vseho hned