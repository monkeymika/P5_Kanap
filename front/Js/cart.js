// Les éléments du localStorage sont récupérées
let storage = JSON.parse(localStorage.getItem("Panier"));

// Fonction pour supprimer le produit avec l'id et la couleur correspondante
 eraseCart = (id, color) => {
    storage = storage.filter(kanap => {
        if(kanap.id == id && kanap.color == color){
            return false;
        } 
        return true;
    });
    localStorage.setItem("Panier", JSON.stringify(storage));
};

// Fonction pour modifier la quantité
changeQuantity = (kanap, newQuantity) => {
    kanap.quantity = newQuantity;
    localStorage.setItem("Panier", JSON.stringify(storage));
};

// Création d'une fonction qui parcoure le panier
if (storage === null || storage == 0) {
    document.getElementById("cart__items").textContent = 'Votre panier est vide'

}else{
    storage.forEach(function(kanap) {
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
            })
            
            // Modification de la quantité
            document.querySelectorAll(".itemQuantity").forEach(inputQuantity => {
                inputQuantity.addEventListener("change", (e) => {
                    let newQuantity = e.currentTarget.closest(".itemQuantity").value;
                    let id = e.currentTarget.closest(".cart__item").dataset.id;
                    let color = e.currentTarget.closest(".cart__item").dataset.color;
                    let myProduct = storage.find(e => (e.id === id)&&(e.color === color));
                    changeQuantity(myProduct, newQuantity);
                    window.location.reload();
                })
            })
        })
    })
}

// Calcul de la somme des produits
if (storage !== null){
    let totalProduct = 0;
    let totalPrice = 0;
    for(let kanap of storage){

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

// --------- Vérification des données saisies par l'utilisateur ---------//

const button = document.querySelector('#order');
button.addEventListener('click',() =>{
    // window.location.href ="confirmation.html";
    
    //Récupération des valeurs du formulaire
    const formValues = {
        Prenom: document.querySelector('#firstName').value,
        Nom: document.querySelector('#lastName').value,
        Adresse: document.querySelector('#address').value,
        Ville: document.querySelector('#city').value,
        Email: document.querySelector('#email').value
    }
    console.log(formValues);

    // ************ Gestion validation du formulaire (REGEX) **********//
    //Fonction qui affiche un texte dans un 'alert'
    const warning = (value) => {
        return `${value} : 3 caractères min, et 20 caractères max \n Les chiffres et les symboles ne sont pas autorisé`;
    }

    //Fonction contenant la regex pour la validation de : prenom, nom, ville
    const regExBasic = (value) => {
        return /^([a-zA-Z]{3,20})?([-]{0,1})?([a-zA-Z]{3,20})$/.test(value);
    }

    // Fonction contenant la regex pour la validation de l'adresse
    const regExAdress = (value) => {
        return /^[a-zA-Z0-9\s,.'-]{3,}$/.test(value);
    }

    //Fonction contenant la regex pour la validation de l'adresse mail
    const regExMail = (value) => {
        return /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/.test(value);
    }

    checkFirstName = () =>{
        //Controle de la validité du prenom
        const theFirstName = formValues.Prenom;
        if (regExBasic(theFirstName)){
            return true;
        } else {
            alert(warning('Prenom'))
            return false;
        };
    };

    checkLastName = () =>{
        //Controle de la validité du nom
        const theLastName = formValues.Nom;
        if (regExBasic(theLastName)){
            return true;
        } else {
            alert(warning('Nom'))
            return false;
        };
    };

    checkAddress = () =>{
        //Controle de la validité de l'adresse
        const theAdress = formValues.Adresse;
        if (regExAdress(theAdress)){
            return true;
        } else {
            alert(warning("L'adresse saisie n'est pas valide"))
            return false;
        };
    };

    checkCity = () =>{
        //Controle de la validité de la ville
        const theCity = formValues.Ville;
        if (regExBasic(theCity)){
            return true;
        } else {
            alert(warning('Ville'))
            return false;
        };
    };

    checkEmail = () =>{
        //Controle de la validité de l'adresse mail
        const theEmail = formValues.Email;
        if (regExMail(theEmail)){
            return true;
        } else {
            alert(("L'adresse mail que vous avez rentré n'est pas valide"))
            return false;
        };
    };


    // Contrôle de la validité du formulaire avant envoi dans le localStorage
    if (checkFirstName() && checkLastName() && checkAddress() && checkCity() && checkEmail()) {
        // l'objet 'formValues' est placés dans le localStorage
        localStorage.setItem('formValues', JSON.stringify(formValues)); 
    } else {
        alert("Veuillez remplir l'intégralité du formulaire");
    };


    //************* Fin - Gestion validation du formulaire */

    // Mettre les valeurs du formulaire et les produits séléctionnés dans un objet qui sera envoyé
    const dataToSend = {
        storage,
        formValues,
    };
    console.log(dataToSend);  
});

// ----------------- Mettre le contenu du localStorage des les champs du formulaire --------------//

// Prendre la key du localStorage et la mettre dans une variable
const dataLocalStorage = localStorage.getItem('formValues');

// Convertir la chaîne de caractère en objet javascript
const dataLocalStorageObjet = JSON.parse(dataLocalStorage);



// Mettre les values du localStorage dans les champs du formulaire
document.querySelector('#firstName').value = dataLocalStorageObjet.Prenom;
document.querySelector('#lastName').value = dataLocalStorageObjet.Nom;
document.querySelector('#address').value = dataLocalStorageObjet.Adresse;
document.querySelector('#city').value = dataLocalStorageObjet.Ville;
document.querySelector('#email').value = dataLocalStorageObjet.Email;






















