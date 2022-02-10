// Récupération de l'id items et de l'url de l'API

const items = document.querySelector('#items');
const url = ('http://localhost:3000/api/products');

fetch(url)
  .then(response => {
    if (response.ok){
      response.json().then(function(products) {
        for (let i = 0; i < products.length; i++) { //Boucle qui récupére le tableau des canapés
          let product = products[i];
          console.log(product);

          /*Template de la section #items en HTML*/
          const insert = 
          `<a href="./product.html?id=${product._id}">
          <article>
          <img src="${product.imageUrl}" altTxt=${product.altTxt}>
          <h3 class="productName">${product.name}</h3>
          <p class="productDescription">${product.description}</p>
          </article>
          </a> `; 

          items.insertAdjacentHTML("beforeend", insert);
        }
      });
    } else { // En cas de probléme avec l'API
      console.log("Il y a une erreur");
      document.querySelector('#items').textContent = "Il y a une erreur";
    }
  });














