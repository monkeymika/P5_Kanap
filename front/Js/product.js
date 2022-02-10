// Etape 4 : Faire le lien entre un produit de la page d'accueil et la page Produit
// Etape 5 : Récuperer l'ID du produit à afficher

let str = window.location.href;// Contient l'url compléte de la page en cours de visite
let url = new URL(str);// La variable contient l'objet URL
let id = url.searchParams.get("id");// On prend l'ID de l'URL          

let UrlKanap = `http://localhost:3000/api/products/` + id; 

console.log(UrlKanap);


fetch(`http://localhost:3000/api/products/` + id)
.then(response => {
  if (response.ok){
    response.json().then((response) => displayProducts(response));

    //Etape 6 : Insérer un produit et ses détails dans la page Produit

    function displayProducts(kanap) {
      const { colors, name, price, imageUrl, description, altTxt} = kanap;
      
      //Appel des fonctions

      makeColors(colors);
      makeTitle(name);
      makePrice(price);
      makeImage(imageUrl, altTxt);
      makeDescription(description);
    }

    // Fonction qui permet le choix des couleurs
    function makeColors(colors) {
      const selectColors = document.querySelector("#colors");
      colors.forEach((color) => {
        const choice = document.createElement("option");
        choice.value = color;
        choice.textContent = color;
        selectColors.appendChild(choice);
      });
    }

    // Fonction qui permet l'affichage de l'image et du texte alternatif
    function makeImage(imageUrl, altTxt) {
      const image = document.createElement("img");
      image.src = imageUrl;
      image.alt = altTxt;
      const parent = document.querySelector(".item__img");
      parent.appendChild(image);
    }

    // Fonction qui permet l'affichage du titre
    function makeTitle(name) {
      document.querySelector("#title").textContent = name;
    }

    // Fonction qui permet l'affichage du prix
    function makePrice(price) {
      document.querySelector("#price").textContent = price;
    }

    // Fonction qui permet l'affichage de la description du canapé
    function makeDescription(description) {
      document.querySelector("#description").textContent = description;
    }
  } else {
    console.log("Il y a une erreur");
    document.querySelector('.item__img').textContent = "Nous rencontrons actuellement un probléme, essayez de nouveau plus tard";
  }
});
