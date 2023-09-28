var validation = {
    //conserve la référence de l'élément de formulaire
    refFormulaire:null,
    //conserse le tableau des messages d'erreur
    tErreurs:[],
    //tableau des validités des champs
    tValide:[],
    valideTypeDon : false,
    valideMontantDon : false,
    etapeValide:false,

    /**
     * Méthode d'initialisation de la validation du formulaire
     */

    initialiser: function(){

        //si le javascript et activé, la classe js est placée dans le body indiquant au CSS qu'il est actif
        document.body.className = "js";

        //obtient la référence de la balise <form> en utilisant la classe formulaire
        this.refFormulaire = document.querySelector(".formulaire");

        //empêche la validation html quand il y a du javascript
        this.refFormulaire.setAttribute('novalidate', 'novalidate');

        //défini les écouteurs d'événement des boutons submit et reset
        this.refFormulaire.addEventListener('submit', this.validerFormulaire.bind(this));
        document.getElementById("bouton-suivant").addEventListener('click', this.validerBoutonsRadioTypeDon.bind(this));
        document.getElementById("bouton-suivant").addEventListener('click', this.validerBoutonsRadioMontantDon.bind(this));
        this.refFormulaire.addEventListener('submit', this.validerBoutonsRadioPays.bind(this));
        this.refFormulaire.addEventListener('submit', this.validerListeDeroulante.bind(this));
        // this.refFormulaire.addEventListener('submit', this.validerSiChecked.bind(this));

        //défini les écouteurs blur des éléments de texte du formulaire
        this.refFormulaire.querySelector("#prenom").addEventListener("blur", this.validerChampTexte.bind(this));
        this.refFormulaire.querySelector("#nom").addEventListener("blur", this.validerChampTexte.bind(this));
        this.refFormulaire.querySelector("#courriel").addEventListener("blur", this.validerChampTexte.bind(this));
        this.refFormulaire.querySelector("#telephone").addEventListener("blur", this.validerChampTexte.bind(this));
        this.refFormulaire.querySelector("#ville").addEventListener("blur", this.validerChampTexte.bind(this));
        this.refFormulaire.querySelector("#code_postal").addEventListener("blur", this.validerChampTexte.bind(this));
        this.refFormulaire.querySelector("#nom_carte").addEventListener("blur", this.validerChampTexte.bind(this));
        this.refFormulaire.querySelector("#numero_carte").addEventListener("blur", this.validerChampTexte.bind(this));
        this.refFormulaire.querySelector("#mois").addEventListener("blur", this.validerChampTexte.bind(this));
        this.refFormulaire.querySelector("#annee").addEventListener("blur", this.validerChampTexte.bind(this));
        this.refFormulaire.querySelector("#cvv").addEventListener("blur", this.validerChampTexte.bind(this));
        this.refFormulaire.querySelector("#cvv").addEventListener("blur", this.validerChampTexte.bind(this));

        this.tValide["prenom"]=false;
        this.tValide["nom"]=false;
        this.tValide["courriel"]=false;
        this.tValide["telephone"]=false;
        this.tValide["ville"]=false;
        this.tValide["code_postal"]=false;
        this.tValide["nom_carte"]=false;
        this.tValide["numero_carte"]=false;
        this.tValide["mois"]=false;
        this.tValide["annee"]=false;
        this.tValide["cvv"]=false;

        console.log("init "+ this.tErreurs);
    },

    chargeJSON: function(objJSON){
        //fonction fetch (chargement asynchrone du JSON)
        fetch(objJSON)
            .then(response => response.json()) //la prommesse retourne une réponse de type JSON
            .then(monJSON => this.tErreurs=monJSON); // une fois reçu, on stock le JSON dans la variable
    },
    validerBoutonsRadioTypeDon:function(){
        const radios = document.querySelectorAll('input[name="type_don"]');
        const errDon = document.getElementById("err_don");
        let isChecked = false;


        radios.forEach(function(radio) {
            if (radio.checked) {
                isChecked = true;
            }
        });
        radios.forEach(function(radio) {
            radio.addEventListener("change", function() {
                errDon.textContent = ""; // Efface le message d'erreur lorsque le bouton radio est coché
            });
        });

        if (!isChecked) {
            isChecked=false;
            errDon.textContent = "Veuillez choisir un type de don.";
        } else {
            errDon.textContent = ""; // Efface le message d'erreur s'il était affiché précédemment
        }
        return isChecked;
    },
    validerBoutonsRadioMontantDon: function() {
        console.log("rentre dans la fonction");
        const radios = document.querySelectorAll('input[name="montant_don"]');
        const errDon = document.getElementById("err_montant_don");
        const boutonAutre = document.getElementById("autre_montant");
        const champAutreMontant = document.querySelector('input[name="autre_montant"]');
        let isChecked = false;

        radios.forEach(function(radio) {
            if (radio.checked) {
                isChecked = true;
            }

            // Ajoutez un gestionnaire d'événements "change" à chaque bouton radio
            radio.addEventListener("change", function() {
                errDon.textContent = ""; // Efface le message d'erreur lorsque le bouton radio est coché
            });
        });

        boutonAutre.addEventListener("change", function() {
            if (boutonAutre.checked) {
                // Si "Autre" est sélectionné, vérifie si le champ de texte contient une valeur
                if (champAutreMontant.value.trim() === "") {
                    errDon.textContent = "Veuillez entrer un montant personnalisé.";
                } else {
                    errDon.textContent = ""; // Efface le message d'erreur si un montant est saisi
                }
            } else {
                errDon.textContent = ""; // Efface le message d'erreur si "Autre" n'est pas sélectionné
            }
        });

        // Ajoutez un gestionnaire d'événements "input" au champ de texte
        champAutreMontant.addEventListener("input", function() {
            errDon.textContent = ""; // Efface le message d'erreur lorsque du texte est saisi
        });

        if (boutonAutre.checked && champAutreMontant.value.trim() === "") {
            errDon.textContent = "Veuillez entrer un montant personnalisé.";
            event.preventDefault(); // Empêche l'envoi du formulaire si le champ est vide
        }

        if (!isChecked) {
            errDon.textContent = "Veuillez choisir un montant de don.";
        }
        return isChecked;
    },
    validerBoutonsRadioPays: function (event){
        const radiosPays = document.querySelectorAll('input[name="pays"]');
        const errPays = document.getElementById("err_pays");
        let isPaysSelected = false;

        radiosPays.forEach(function(radio) {
            if (radio.checked) {
                isPaysSelected = true;
            }
        });

        if (!isPaysSelected) {
            errPays.textContent = "Veuillez sélectionner un pays.";
            event.preventDefault(); // Empêche l'envoi du formulaire si aucun pays n'est sélectionné
        } else {
            errPays.textContent = ""; // Efface le message d'erreur s'il était affiché précédemment
        }
    },
    validerListeDeroulante: function (event){
        const selectProvince = document.getElementById("province");
        const errProvince = document.getElementById("err_province");

        if (selectProvince.value === "") {
            errProvince.textContent = "Veuillez sélectionner une province.";
            event.preventDefault(); // Empêche l'envoi du formulaire si aucune province n'est sélectionnée
        }
        else {
            errProvince.textContent = ""; // Efface le message d'erreur s'il était affiché précédemment
        }
        selectProvince.addEventListener("change", function () {
            // Efface le message d'erreur lorsque l'utilisateur sélectionne une option
            errProvince.textContent = "";
        });
    },

    /**
     * Méthode de validation des champs de texte
     * @param evenement
     */

    validerChampTexte: function(evenement){
        console.log("validerChampTexte "+  this.tErreurs);
        //champ invalide par défaut
        var valide=false;
        //objet du DOM déclancheur, initialise un objet jQuery
        var objCible=evenement.currentTarget;
        //retrouve le regexp de l'objet du DOM en lisant l'attribut pattern
        var strChaineExp=new RegExp(objCible.getAttribute('pattern'));
        //valide si pas vide
        if(this.validerSiVide(objCible)===true){
            //si vide, afficher le message d'erreur
            this.afficherChampErreur(objCible, this.tErreurs[objCible.getAttribute("name")]["vide"]);
        }else{
            if(objCible.hasAttribute("pattern")){
                //si pas vide, tester le pattern
                if (strChaineExp.test(objCible.value)) {
                    //si pattern ok
                    valide = true;
                    //effacer le champ d'erreur
                    this.effacerChampErreur(objCible);
                } else {
                    //si pattern invalide afficher message détaillé
                    this.afficherChampErreur(objCible, this.tErreurs[objCible.getAttribute("name")]["pattern"]);
                }
            }else{
                this.effacerChampErreur(objCible);
                valide = true;
            }
        }
        //modifier le tableau des validitées
        this.modifierTableauValidation(objCible.getAttribute("name"),valide);
    },

    /**
     * Méthode de validation finale du formulaire et d'envoi
     * @param evenement
     */
    validerFormulaire: function(evenement){
        //Par defaut, le formulaire est considé comme valide
        var valide = true;
        //Pour chacun des champs présent dans le tableau de validation
        for(var champ in this.tValide ){
            //Si un champ est invalide
            if (this.tValide[champ] === false) {
                //cible l'objet du DOM fautif
                var objCible=this.refFormulaire.querySelector("#"+champ);
                //ici deux possibilité de message, vide ou pattern
                if(this.validerSiVide(objCible)===true){
                    this.afficherChampErreur(objCible, this.tErreurs[objCible.getAttribute("name")]["vide"]);
                }else{
                    if(objCible.hasAttribute("pattern")){
                        var strChaineExp=new RegExp(objCible.getAttribute('pattern'));
                        if(strChaineExp.test(objCible.value) ){
                            //affiche que l'entrée n'est pas du bon format
                            this.afficherChampErreur(objCible, this.tErreurs[objCible.getAttribute("name")]["pattern"]);
                        }
                    } else {
                        //effacer le champ d'erreur
                        this.effacerChampErreur(objCible);
                    }
                }
                //Le formulaire contient des champs invalide, et n'est donc pas prêt à l'envoi
                valide=false;
            }
        }

        // si le formulaire n'est pas valide, on annule la soumission du formulaire de l'événement submit
        if(valide === false){
            evenement.preventDefault();
        }
    },


    //Méthodes utilitaires**********************************
    /**
     * Méthode de validation de champs si vide
     * @param objCible
     * @returns {boolean}
     */
    validerSiVide: function(objCible){
        var valide = false; //false = champ vide
        if(objCible.value === ""){
            valide = true; //si false, champ contient quelque chose
        }
        return valide;
    },

    /**
     * Méthode d'affichage des messages d'erreur
     * @param objCible
     * @param message
     */
    afficherChampErreur: function (objCible,message){
        console.log(message);
        var nom = "err_"+objCible.getAttribute("id");
        document.getElementById(nom).innerHTML=message;
        objCible.classList.add("formulaire__item--erreur");
    },

    /**
     * Méthode d'effacement des messages d'erreur
     * @param objCible
     */
    effacerChampErreur: function(objCible) {
        var nom = "err_"+objCible.getAttribute("id");
        document.getElementById(nom).innerHTML="";
        objCible.classList.remove("formulaire__item--erreur");
    },

    /**
     * Méthode de d'inscription de l'état des champs dans le tableau de validation
     * @param nomChamp
     * @param valide
     */
    modifierTableauValidation:function(nomChamp,valide){
        this.tValide[nomChamp]=valide;
    },

    /**
     * Méthode d'effacement des message d'erreur et de remise à zéro des champs du formulaire
     */
    effacerFormulaire: function(){
        var liste=document.querySelectorAll(".formulaire__erreur")
        liste.forEach(function(objetCible){
            objetCible.innerHTML="";
            objetCible.parentNode.classList.remove("formulaire__item--erreur");
        });
        this.tValide["prenom"]=false;
        this.tValide["nom"]=false;
        this.tValide["courriel"]=false;
        this.tValide["telephone"]=false;
        this.tValide["ville"]=false;
        this.tValide["code_postal"]=false;
        this.tValide["nom_carte"]=false;
        this.tValide["numero_carte"]=false;
        this.tValide["mois"]=false;
        this.tValide["annee"]=false;
        this.tValide["cvv"]=false;
    }
};
//Fin méthodes utilitaires**********************************

//*******************
// Écouteurs d'événements
//*******************
window.addEventListener('load', validation.initialiser.bind(validation));

// STEPS LEFT


document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".formulaire");
    const barreProgres = document.getElementById("barreprogres");
    const boutonSuivant = document.getElementById("bouton-suivant");
    const boutonPrecedent = document.getElementById("bouton-precedent");
    const etapes = document.querySelectorAll("fieldset");
    let etapeActuelle = 0;
    const nombreEtapes = etapes.length;
    const etapesBarre = document.querySelectorAll(".barreprogres li");

    // Fonction pour afficher ou masquer une étape en fonction de l'indice
    function afficherEtape(indice) {
        etapes.forEach(function (etape, index) {
            etape.style.display = index === indice ? "block" : "none";
        });
    }
    function mettreAJourBarreProgres() {
        etapesBarre.forEach((etape, index) => {
            if (index <=  etapeActuelle) {
                etape.classList.add("active");
            } else {
                etape.classList.remove("active");
            }
        });
    }

    boutonSuivant.addEventListener("click", function () {
        if (etapeActuelle < nombreEtapes - 1) {
            etapes[etapeActuelle].style.display = "none";
            etapeActuelle++;
            afficherEtape(etapeActuelle);
            mettreAJourBarreProgres();
            if (etapeActuelle === nombreEtapes - 1 ) {
                boutonSuivant.style.display = "none";
                document.querySelector('button[type="submit"]').style.display = "block";
            }

            if (etapeActuelle > 0) {
                boutonPrecedent.style.display = "block";
            }
        }
        console.log("Étape actuelle : " + etapeActuelle);
    });

    boutonPrecedent.addEventListener("click", function () {
        if (etapeActuelle > 0) {
            etapes[etapeActuelle].style.display = "none";
            etapeActuelle--;
            afficherEtape(etapeActuelle);
            mettreAJourBarreProgres();

            if (etapeActuelle === 0) {
                boutonPrecedent.style.display = "none";
            }

            if (etapeActuelle < nombreEtapes - 1) {
                boutonSuivant.style.display = "block";
                document.querySelector('button[type="submit"]').style.display = "none";
            }
        }
        console.log("Étape actuelle : " + etapeActuelle);
    });

    // Initialisation de la première étape au chargement de la page
    afficherEtape(etapeActuelle);


});
