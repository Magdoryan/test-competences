// VARIABLES GLOBALES

let isDate = true; // Boolean détection si tri par date (tri par défault)

let orderAsc = true; // Boolean détection si tri croissant ASC ou décroissant DESC (tri par défault croissant)

let search = $( " #search " )[ 0 ].value; // String correspondant au champ de recherche (gère le rafraîchissement de la page avec f5)

const countElemPage = 30; // Nombre d'élement a afficher au depart et lors de l'appuie sur le bouton 'voir plus'

let countElem = countElemPage; // Nombre d'élement à afficher

/**
 * Fonction pour la gestion du Menu mobile et ordinateur
 */
function menu() {
  const principalMenu = $( "#fixedMenu" );
  let nice = false;
  $( ".open-menu" ).on( "click", () => {
    principalMenu.addClass( "is-opened" );
    $( "body" ).addClass( "is-clipped" );
    nice = principalMenu.niceScroll( {
      cursorcolor: "#27386c", // change cursor color in hex
      cursoropacitymin: 1,
      cursorwidth: ".4375rem", // cursor width in pixel (you can also write "5px")
      cursorborder: false, // css definition for cursor border
      cursorborderradius: "4px", // border radius in pixel for cursor
      // cursorfixedheight: 72, // set fixed height for cursor in pixel
      railpadding: {
        top: 16, right: 6, left: 0, bottom: 16
      }
    } );
    setTimeout( () => {
      nice.resize();
    }, 250 );
  } );

  $( ".close-menu" ).on( "click", () => {
    principalMenu.removeClass( "is-opened" );
    $( "body" ).removeClass( "is-clipped" );
    nice = principalMenu.getNiceScroll().remove();
    $( "#main-nav .is-inViewport" ).removeClass( "is-inViewport" );
  } );

  $( "#main-nav" ).on( "click", ".nav-show", ( e ) => {
    e.preventDefault();
    $( e.currentTarget ).next( "ul" ).addClass( "is-inViewport" );
  } );
  $( "#main-nav" ).on( "click", ".nav-hide", ( e ) => {
    $( e.currentTarget ).parent( "ul" ).removeClass( "is-inViewport" );
  } );
}

/**
 * Fonction permettant de décodé une chaine string en html entities
 * Renvoie la chaine décodé
 */
function decodeHTMLEntities( text ) {
  return $( "<textarea/>" ).html( text ).text();
}

/**
 * Fonction permettant la récupération des données du webservice,
 * le traitement des différents tri et de la recherche
 * mais aussi de l'éxécution de la fonction d'affichage
 */
function webserviceRequest() {
  $.getJSON( "./index.json", ( data ) => {
    let finalData = data;

    // Verification du champ de recherche et éxécution du filtre de recherche sur la Description, le Titre et la Date
    if ( search !== "" ) {
      finalData = finalData.filter( ( elem ) => decodeHTMLEntities( elem.page_description.toLowerCase() ).includes( search ) ||
      decodeHTMLEntities( elem.page_title.toLowerCase() ).includes( search ) ||
      elem.event_date.includes( search ) );
    }

    // Éxécution du tri et de l'ordre choisie, tri sur le Jour et l'heure toujours croissante
    finalData = finalData.sort( ( a, b ) => {
      if ( orderAsc ) {
        if ( isDate ) {
          return new Date( `${a.event_date} ${a.event_time_start}` ) - new Date( `${b.event_date} ${b.event_time_start}` );
        }
        return a.page_title.localeCompare( b.page_title );
      }
      if ( isDate ) {
        return new Date( `${b.event_date} ${a.event_time_start}` ) - new Date( `${a.event_date} ${b.event_time_start}` );
      }
      return b.page_title.localeCompare( a.page_title );
    } );

    showElements( finalData.slice( countElem - countElemPage, countElem ), finalData.length ); // Éxécution de la fonction d'affichage (affichage de countElemPage elements a chaque éxécution)
  } );
}

/**
 * Fonction permettant l'affichage des élements
 */
function showElements( data, lengthTotal ) {

  // On supprime le bouton 'voir plus' si il existe et on verifie l'appuie sur le bouton 'voir plus'
  if ( $( "#seeMore" ) ) {
    $( "#seeMore" ).remove();
    if ( countElem === countElemPage ) {
      $( "#listProgram" ).empty();
    }
  }

  // Vérification pour savoir si des élements on étais trouvés
  if ( lengthTotal === 0 ) {
    $( "#listProgram" ).append( "<div class='h5 text-center mx-auto'><p>aucun élément correspondant trouvé.</p></div>" );
  } else {

    // Boucle sur les données et créer l'affichage
    $.each( data, ( _key, value ) => {
      const newCard = $( "<a class='card card-actualite' href='#'></a>" ); // Création de la Card

      // Vérification d'existance d'une image
      if ( value.page_front_image ) {
        newCard.append( $( `<img src='https://www.bdangouleme.com${value.page_front_image}' alt="">` ) );
      }

      // Création du body de la Card
      const cardBody = $( "<div class='card-body'></div>" );
      cardBody.append( $( `<h2 class="h3 card-title">${value.page_title}</h2>` ) );
      cardBody.append( $( `<span class="date">${value.event_date} Debut: ${value.event_time_start} Fin: ${value.event_time_end}</span>` ) );
      cardBody.append( $( `<div class="p card-text">${value.page_description}</div>` ) );

      newCard.append( cardBody ); // Ajout du body a la l'element Card

      $( "#listProgram" ).append( $( "<div class='col-md-4'></div>" ).append( newCard ) ); // Ajout de la card a notre liste
    } );

    // Verification du nombre d'element afficher et à afficher pour savoir
    // si un bouton voir plus est nécessaire (countElemPage elements ajoutés à chaque éxécution)
    if ( lengthTotal - countElem > 0 ) {
      $( "#listProgram" ).append( $( "<div id='seeMore' class='col-md-12'><button class='btn d-block btn-filtre btn-outline-primary mx-auto'>Voir plus</button></div>" ) );
      $( "#seeMore" ).on( "click", () => {
        countElem += countElemPage; // Ajout de countElemPage au maximum d'élement à afficher
        webserviceRequest(); // Éxécution de la récupération et l'affichage avec les nouveaux paramètres
      } );
    }
  }
}

/**
 * Éxécution des fonctions et ajout des évenements lorsque le DOM est totalement chargé
 */
$( document ).ready( () => {
  menu(); // Éxécution de la fonction qui gère le menu

  webserviceRequest(); // Éxécution de la récupération et l'affichage avec les paramètres de départ

  // Ajout d'un évenement de click sur le bouton de tri par date
  $( "#sortDate" ).on( "click", ( e ) => {
    orderAsc = !orderAsc; // change l'ordre a chaque appuie sur le bouton (ASC ou DESC)
    countElem = countElemPage; // Réinitialise le nombre d'élements maximum afficher avant d'avoir le bouton 'voir plus'
    const name = $( "#sortTitre" );

    // Gestion du style des deux boutons de tri
    if ( name.hasClass( "asc" ) || name.hasClass( "desc" ) ) {
      name.removeClass( "asc desc" );
    }
    if ( orderAsc ) {
      $( e.currentTarget ).addClass( "asc" ).removeClass( "desc" );
    } else {
      $( e.currentTarget ).addClass( "desc" ).removeClass( "asc" );
    }

    isDate = true; // Passe la variable a true pour dire que nous trions par date

    webserviceRequest(); // Éxécution de la récupération et l'affichage avec les nouveaux paramètres
  } );

  $( "#sortTitre" ).on( "click", ( e ) => {
    orderAsc = !orderAsc; // change l'ordre a chaque appuie sur le bouton (ASC ou DESC)
    countElem = countElemPage; // Réinitialise le nombre d'élements maximum afficher avant d'avoir le bouton 'voir plus'
    const date = $( "#sortDate" );

    // Gestion du style des deux boutons de tri
    if ( date.hasClass( "asc" ) || date.hasClass( "desc" ) ) {
      date.removeClass( "asc desc" );
    }
    if ( orderAsc ) {
      $( e.currentTarget ).addClass( "asc" ).removeClass( "desc" );
    } else {
      $( e.currentTarget ).addClass( "desc" ).removeClass( "asc" );
    }
    isDate = false; // Passe la variable a false pour dire que nous trions par Titre

    webserviceRequest(); // Éxécution de la récupération et l'affichage avec les nouveaux paramètres
  } );

  // Ajout de l'évenement keyup pour la recherche en temps réel
  $( " #search " ).on( "keyup", ( e ) => {
    e.preventDefault();
    countElem = countElemPage; // Réinitialise le nombre d'élements maximum afficher avant d'avoir le bouton 'voir plus'
    search = e.currentTarget.value.toLowerCase(); // Stocke le texte dans la variable global

    webserviceRequest(); // Éxécution de la récupération et l'affichage avec les nouveaux paramètres
  } );
} );
