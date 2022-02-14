let panier = [];
console.log(panier);



// Les produits du localStorage sont récuprérés et placé dans la variable 'panier' (qui est un tableau)
productOfLocalstorage();



function productOfLocalstorage() {
    let howManyProduct = localStorage.length;
    for (let i = 0; i < howManyProduct; i++) {
        let product = localStorage.getItem(localStorage.key(i));
        let productObject = JSON.parse(product);// Contraire de 'stringify', 
        panier.push(productObject);
    }
}

