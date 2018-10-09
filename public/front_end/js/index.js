function changePic(n) {
    
    var slides = document.getElementsByClassName("slideshow-imgs");
    var dots = document.getElementsByClassName("dot");

    // changes which dot is active, active dot is white and dark border, inactive is grey
    for (var i = 0; i < dots.length; i++) {
      if(i === n){
        dots[i].className = dots[i].className.replace(" inactiveDot", " activeDot");
      }
      else{
        dots[i].className = dots[i].className.replace(" activeDot", " inactiveDot");
      }
    }

    // hides all images by initially
    for (var i = 0; i < slides.length; i++) {
       slides[i].style.display = "none";  
    }  
    
    // set the image corresponding to the dot on display
    slides[n].style.display = "block"; 
}

$(document).ready(function(e){

});