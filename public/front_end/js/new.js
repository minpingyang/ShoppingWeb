function sortButtonCss(element){
  $(".sort-options").css({
    "background-color" : "white",
    "color" : "black"
  });

  element.style.backgroundColor = "black";
  element.style.color = "white";
}

function sortMostPopular(element){
  sortButtonCss(element);
};

function sortPriceAscending(element){
  sortButtonCss(element);
};

function sortPriceDescending(element){
  sortButtonCss(element);
};
