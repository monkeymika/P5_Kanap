/************* Récupération de l'orderID et affichage du numéro de commande ************ */

let str = window.location.href;
let url = new URL(str);
let orderId = url.searchParams.get("id");
document.getElementById("orderId").innerHTML = `${orderId}`;

// Vide toutes les clés stockées dans le localStorage
localStorage.clear();
