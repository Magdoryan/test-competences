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

$( '#main-nav').on('click', '.nav-show', function(e) {
  e.preventDefault();
  $(this).next('ul').addClass('is-inViewport');
});
$('#main-nav').on('click', '.nav-hide', function() {
  $(this).parent('ul').removeClass('is-inViewport');
});