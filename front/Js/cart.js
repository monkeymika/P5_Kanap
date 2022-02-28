// Les éléments du localStorage sont récupérées
let panier = JSON.parse(localStorage.getItem("Panier"));

// Fonction pour supprimer le produit avec l'id et la couleur correspondante
 eraseCart = (id, color) => {
    panier = panier.filter(kanap => {// La méthode filter crée et retourne un nouveau tableau contenant tous les éléments du tableau d'origine qui remplissent une condition détereminée par la fonction callback
        if(kanap.id == id && kanap.color == color){
            return false;
        } 
        return true;
    });
    localStorage.setItem("Panier", JSON.stringify(panier));
};

// Fonction pour modifier la quantité
changeQuantity = (kanap, newQuantity) => {
    kanap.quantity = newQuantity;
    localStorage.setItem("Panier", JSON.stringify(panier));
};

// Condition pour l'ensemble du panier
if (panier === null || panier == 0) {
    document.getElementById("cart__items").textContent = 'Votre panier Kanap est vide'

}else{
    panier.forEach((kanap) => {
        /* Methode Fetch pour récupérer les données qui ne sont pas stockés dans le localStorage, 
        y compris les données sensibles comme le prix*/
        fetch("http://localhost:3000/api/products/" + `${kanap.id}`)
        .then(data => data.json())
        .then(function(productDetail){
            // Ajout des produits dans la page panier
            document.getElementById("cart__items").innerHTML += `
                <article class="cart__item" data-id="${kanap.id}" data-color="${kanap.color}">
                    <div class="cart__item__img">
                        <img src="${productDetail.imageUrl}" alt="${productDetail.altTxt}">
                    </div>
                    <div class="cart__item__content">
                        <div class="cart__item__content__description">
                        <h2>${productDetail.name}</h2>
                        <p>${kanap.color}</p>
                        <p id="priceProduct">${productDetail.price} €</p>
                        </div>
                        <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${kanap.quantity}">
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                        </div>
                        </div>
                    </div>
                </article>`

                // Sélection des boutons supprimer
                document.querySelectorAll(".deleteItem").forEach(button => {
                // Pour chaque clique
                button.addEventListener("click", (e) => {
                    // Récupération de l'id et de la couleur du produit
                    let removeId = e.currentTarget.closest(".cart__item").dataset.id;
                    let removeColor = e.currentTarget.closest(".cart__item").dataset.color;
                    // Suppression du produit
                    eraseCart(removeId, removeColor);
                    // Actualisation de la page
                    window.location.reload();
                });
            });
            
            // Modification de la quantité
            document.querySelectorAll(".itemQuantity").forEach(inputQuantity => {
                inputQuantity.addEventListener("change", (e) => {
                    let newQuantity = e.currentTarget.closest(".itemQuantity").value;
                    let id = e.currentTarget.closest(".cart__item").dataset.id;
                    let color = e.currentTarget.closest(".cart__item").dataset.color;
                    let myProduct = panier.find(e => (e.id === id)&&(e.color === color));
                    changeQuantity(myProduct, newQuantity);
                    window.location.reload();
                });
            });
        });
    });
};

// Calcul de la somme des produits
if (panier !== null){
    let totalProduct = 0;
    let totalPrice = 0;
    for(let kanap of panier){

        // Calcul de la quantité
        let quantityLap = parseInt(kanap.quantity)
        totalProduct += quantityLap;
        document.getElementById("totalQuantity").innerHTML = totalProduct;

        // Calcul du prix
        fetch("http://localhost:3000/api/products/" + `${kanap.id}`)
        .then( data => data.json())
        .then(function(productDetail){
            let moneyLap = productDetail.price
            totalPrice += moneyLap * quantityLap
            document.getElementById("totalPrice").innerHTML = totalPrice;
        });
    };
};

//-----------------------------------------------------------------------//
// ----------------------- Formulaire -----------------------------------//
//-----------------------------------------------------------------------//

// Fonction pour créer un tableau de produits
let products = [];
if (panier !== null){
    for(let product of panier){
        let productId = product.id;
        products.push(productId);
    }
};



const buttonOrder = document.querySelector('#order');
buttonOrder.addEventListener('click',(e) =>{
    e.preventDefault();

    //Récupération des valeurs (que je met dans un objet) du formulaire qui vont aller dans le localStorage
    const contact = {
        firstName: document.querySelector('#firstName').value,
        lastName: document.querySelector('#lastName').value,
        address: document.querySelector('#address').value,
        city: document.querySelector('#city').value,
        email: document.querySelector('#email').value
    }
    console.log(contact);


// ------------------- validation du formulaire (regex) -------------------------------//

// Fonction qui affiche un texte si jamais les champs ne sont pas bien remplis
const warning = (value) => {
    return `${value} : Les chiffres et les symboles ne sont pas autorisés \n 3 lettres minimum et 20 lettres maximum`
}

// fonction contenant la regEx pour la validation du prénom, le nom, et la ville
const regExFirstNameLastNameCity = (value) => {
    return /^([a-zA-Z]{3,20})?([-]{0,1})?([a-zA-Z]{3,20})$/.test(value);
}

// Fonction contenant la regEx pour la validation de l'adresse
const regExAdress = (value) => {
    return /^[a-zA-Z0-9\s,.'-]{3,}$/.test(value);
}

//Fonction contenant la regex pour la validation de l'adresse mail
const regExMail = (value) => {
    return /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/.test(value);
}


//Contrôle de la validité du prenom
    checkFirstName = () => { 
        const theFirstName = contact.firstName;
        if (regExFirstNameLastNameCity(theFirstName)) {
            document.querySelector('#firstNameErrorMsg').textContent = "";
            return true;
        } else {
            document.querySelector('#firstNameErrorMsg').textContent = "Le prénom n'est pas valide";           
            return false;
        };
    };

//Contrôle de la validité du nom
    checkLastName = () => { 
        const theLastName = contact.lastName;
        if (regExFirstNameLastNameCity(theLastName)) {
            document.querySelector('#lastNameErrorMsg').textContent = "";            
            return true;
        } else {
            document.querySelector('#lastNameErrorMsg').textContent = "Le nom n'est pas valide";  
            return false;
        };
    };

//Contrôle de la validité de l'adresse
    checkAdress = () => { 
        const theAdress = contact.address;
        if (regExAdress(theAdress)) {
            document.querySelector('#addressErrorMsg').textContent = ""; 
            return true;
        } else {
            document.querySelector('#addressErrorMsg').textContent = "L'adresse n'est pas valide"; 
            return false;
        };
    };

//Contrôle de la validité de la ville
    checkCity = () => { 
        const theCity = contact.city;
        if (regExFirstNameLastNameCity(theCity)) {
            document.querySelector('#cityErrorMsg').textContent = ""; 
            return true;
        } else {
            document.querySelector('#cityErrorMsg').textContent = "La ville n'est pas valide"; 
            return false;
        };
    };

    //Contrôle de la validité de l'email
    checkEmail = () => { 
        const theEmail = contact.email;
        if (regExMail(theEmail)) {
            document.querySelector('#emailErrorMsg').textContent = ""; 
            return true;
        } else {
            document.querySelector('#emailErrorMsg').textContent = "L'adresse mail n'est pas valide"; 
            return false;
        };
    };
    


    if (checkFirstName() && checkLastName() && checkAdress() && checkCity() && checkEmail()) {  
        // Mettre l'objet 'contact' dans le localStorage
        localStorage.setItem('contact', JSON.stringify(contact))// stringify transforme l'objet en chaine de caractere
    } else {
        alert("Le formulaire n'est pas correctement rempli");
    };

// ----------------- fin - validation du formulaire (regex)----------------------------//

    // Mettre les 'values' du formulaire et mettre les produits sélectionnés dans un objet à envoyer vers le serveur
    const dataToSend = {
      products,
      contact
    }

    // Envoi de l'objet 'dataToSend' vers le serveur
    fetch("http://localhost:3000/api/products/order", {
        method: 'POST',
        body: JSON.stringify(dataToSend),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
    })
    .then(response => response.json())
    .then(function(data){
        window.location.href = "./confirmation.html?id=" + data.orderId;
    })

    

});


// ************* Mettre le contenu du localStorage dans les champs du formulaire********************//
// Prendre la key dans le localStorage et la mettre dans une variable
const dataLocalStorage = localStorage.getItem('contact');

// Convertir la chaîne de caractère en objet javascript
const dataLocalStorageObjet = JSON.parse(dataLocalStorage);

// Mettre les values du localStorage dans les champs du formulaire(permet de les conserver même au changement de page)
if(dataLocalStorageObjet == null) {
    console.log('le formulaire est vide');
} else {
    document.querySelector("#firstName").value = dataLocalStorageObjet.firstName;
    document.querySelector("#lastName").value = dataLocalStorageObjet.lastName;
    document.querySelector("#address").value = dataLocalStorageObjet.address;
    document.querySelector("#city").value = dataLocalStorageObjet.city;
    document.querySelector("#email").value = dataLocalStorageObjet.email;
}














