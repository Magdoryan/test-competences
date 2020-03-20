let isDate = true;
let orderAsc = true;
let search = "";
let countElem = 30;

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

$( document ).ready( () => {
  menu();
  test( isDate );

  $( "#sortDate" ).on( "click", ( e ) => {
    orderAsc = !orderAsc;
    countElem = 30;
    const name = $( "#sortName" );
    if ( name.hasClass( "asc" ) || name.hasClass( "desc" ) ) {
      name.removeClass( "asc desc" );
    }
    if ( orderAsc ) {
      $( e.currentTarget ).addClass( "asc" ).removeClass( "desc" );
    } else {
      $( e.currentTarget ).addClass( "desc" ).removeClass( "asc" );
    }
    isDate = true;
    test( isDate );
  } );

  $( "#sortName" ).on( "click", ( e ) => {
    orderAsc = !orderAsc;
    countElem = 30;
    const date = $( "#sortDate" );
    if ( date.hasClass( "asc" ) || date.hasClass( "desc" ) ) {
      date.removeClass( "asc desc" );
    }
    if ( orderAsc ) {
      $( e.currentTarget ).addClass( "asc" ).removeClass( "desc" );
    } else {
      $( e.currentTarget ).addClass( "desc" ).removeClass( "asc" );
    }
    isDate = false;
    test( isDate );
  } );
} );

function test( isDate ) {
  $.getJSON( "./index.json", ( data ) => {
    const te = data.sort( ( a, b ) => {
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

    showElement( te.slice( countElem - 30, countElem ), te.length );
  } );
}

function showElement( data, lengthTotal ) {
  $( "#seeMore" ).remove();
  if ( countElem === 30 ) {
    $( "#listProgram" ).empty();
  }


  $.each( data, ( key, value ) => {

    // let newElem = $( "<li class='col-md-4'></li>" );

    const newCard = $( "<a class='card card-actualite' href='#'></a>" );
    if ( value.page_front_image ) {
      newCard.append( $( `<img src='https://www.bdangouleme.com${value.page_front_image}' alt="">` ) );
    }
    const cardBody = $( "<div class='card-body'></div>" );
    cardBody.append( $( `<h2 class="h3 card-title">${value.page_title}</h2>` ) );
    cardBody.append( $( `<span class="date">${value.event_date} Debut: ${value.event_time_start} Fin: ${value.event_time_end}</span>` ) );
    cardBody.append( $( `<div class="p card-text">${value.page_description}</div>` ) );

    newCard.append( cardBody );


    $( "#listProgram" ).append( $( "<div class='col-md-4'></div>" ).append( newCard ) );
  } );

  if ( lengthTotal - countElem > 0 ) {
    $( "#listProgram" ).append( $( "<button id='seeMore' class='btn btn-filtre btn-outline-primary mx-auto'>Voir plus</button>" ) );
    $( "#seeMore" ).on( "click", ( e ) => {
      countElem += 30;
      test( isDate );
    } );
  }
}
