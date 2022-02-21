// Récupération de l'id items et de l'url de l'API

const items = document.querySelector("#items");
const url = "http://localhost:3000/api/products";

//La méthode Fetch récupére les ressources de l'URL
fetch(url)

// Fetch retourne une promesse contenant la réponse
// Je convertis la réponse au format JSON
.then((response => response.json()))
// La promesse est chainé, donc cette promesse, j'en fait une boucle for qui me permet de récupérer les éléments de l'API
.then(function (products) {
  for (let i = 0; i < products.length; i++) {
    //Boucle qui récupére le tableau des canapés
    let product = products[i];
    console.log(product);

    /*Template de la section #items en HTML, les produits seron injectés dedans*/
    const insert = 
    // Ici, le href envoi sur la page produit, en affichant le canapé voulu (via l'ID)
      `<a href="./product.html?id=${product._id}">
        <article>
        <img src="${product.imageUrl}" altTxt=${product.altTxt}>
        <h3 class="productName">${product.name}</h3>
        <p class="productDescription">${product.description}</p>
        </article>
      </a> `;

    items.insertAdjacentHTML("beforeend", insert);
  };
})
//Se déclenche si la promesse est rejétée, ici en l'occurence, si la correspondance avec le serveur est impossible
.catch = (function(error) {
  document.querySelector('#items').textContent = " Nous rencontrons actuellement un probléme au niveau du serveur, veuillez retenter plus tard " + error;
}); 

