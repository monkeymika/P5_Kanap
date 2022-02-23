let str = window.location.href; // L'url de la page en cours est stocké dans la variable str
let url = new URL(str); // Créer une URL qui pointe vers 'str' donc 'http://localhost:3000/api/products/
let idKanap = url.searchParams.get("id"); // L'ID de l'url est récupéré 


// Je concaténe l'url avec l'ID que j'ai récupéré avec 'searchParams'
let UrlKanap = `http://localhost:3000/api/products/` + idKanap;// 

//Insérer un produit et ses détails dans la page Produit
fetch(UrlKanap)
.then((response => response.json()))
.then(function(kanap) {
  
  // L'image du produit est inséré dans "img"
  
    let img = document.createElement("img");
    document.querySelector(".item__img").appendChild(img);// J'ajoute la balise <img> dans l'HTML
    // setAttribute permet d'assigner les données de l'API (ici à src et alt)
    img.setAttribute("src", `${kanap.imageUrl}`);
    img.setAttribute("alt", `${kanap.altTxt}`);

// Le nom du produit est inséré dans #name

  let name = document.querySelector("#title");
  name.textContent = `${kanap.name}`;

// Insert le prix

  let price = document.querySelector("#price");
  price.textContent = `${kanap.price}`;

// Insert la description

  let description = document.querySelector("#description");
  description.textContent = `${kanap.description}`;

// Insert le choix des couleurs
  document.querySelector('#colors').insertAdjacentHTML('beforeend',
    kanap.colors.map((color) => `<option value='${color}'>${color}</option>`)
  ); 
});
   
// Ajout d'un événement lors du clic sur le bouton 'panier'
const button = document.querySelector("#addToCart");
button.addEventListener('click', () => {

  // La couleur et la quantité choisis par l'utilisateur sont récupérés
  let color = document.querySelector("#colors");
  let productColor = color[color.selectedIndex].text;
  let productQuantity = document.querySelector("#quantity").value;
  
  // Si l'utilisateur n'a pas séléctionner de couleur ni de quantité, un message d'alert apparait, et il ne peut pas accéder au panier
  if (color == null || color === "" || productQuantity == null|| productQuantity == 0) {
    alert("Sélectionnez une couleur et le nombre d'article que vous voulez!")
  } else { 
    window.location.href ="cart.html"
  }

  // Fonction qui permet de stocker dans le localStorage
   saveCart = (panier) => {
    localStorage.setItem("Panier", JSON.stringify(panier));
  }
  
  // Fonction qui permet de récupérer les éléments du localStorage
  getCart = () => {
    let panier = localStorage.getItem("Panier");
    if (panier == null) {
      return [];
    } else {
      return JSON.parse(panier);
    }
  }

  // Conditions pour ajouter le produit au panier
  addCart = (product) => {
    let panier = getCart();
    
    // Ici, on vérifie si l'ID du canapé est déja présent dans le panier
    let foundProduct = panier.find(p => p.id == product.id);
    if (foundProduct != undefined){ 

      // Si l'ID est bien présent, on vérifie également pour la couleur
      let foundColor = panier.find(p => p.color == product.color);
      if (foundColor != undefined){

        // Si l'ID et la couleur sont déja dans le panier, on ajoute la quantité choisi par l'utilisateur
        foundColor.quantity = foundColor.quantity + JSON.parse(productQuantity) ;
      }else{
        product.quantity = JSON.parse(productQuantity);
        panier.push(product);
      } 

    // Sinon, on le rajoute dans le panier si la quantité est supérieure à 0   
    }else{
      if(productQuantity >0){
        product.quantity = JSON.parse(productQuantity);
          panier.push(product);
      }     
    }
    saveCart(panier);
  }
  
  // Au clique sur "Ajouter au panier",l'ID, la quantité et la couleur, sont ajouté au panier 
  addCart({
  "id": idKanap,
  "quantity": productQuantity,
  "color": productColor});
});




















