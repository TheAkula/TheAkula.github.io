let countries=document.querySelectorAll('.country');

for(let i=0;i<countries.length;i++){
    let country=countries[i];
    let countryImg=country.querySelector('img');
    countryImg.addEventListener('click', function(){
        country.style.display='none'
    })
}
let slider=document.querySelector('.price-range');

noUiSlider.create(slider, {
    start: [20, 4000],
    connect: true,
    range:{
        'min': 0,
        'max': 5000
    },
    tooltips: true,
    step: 1,
    

});


let body=document.querySelector('body');
let noUiHandles=document.querySelectorAll('.noUi-handle');

for(let i=0;i<noUiHandles.length;i++){
    let noUiTooltip=noUiHandles[i].querySelector('.noUi-tooltip');
    noUiTooltip.textContent='$'+Math.round(noUiHandles[i].getAttribute('aria-valuenow'));
    noUiTooltip.addEventListener('DOMSubtreeModified',function(){
        noUiTooltip.textContent='$'+Math.round(noUiHandles[i].getAttribute('aria-valuenow'));
    })
}


$(document).ready(function(){
    $('.first-slider .center').slick({
      infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1
    });
  });


let milkShadow=document.querySelector('.milk-shadow');
let burger=document.querySelector('.header-burger');
let nav=document.querySelector('nav');

burger.onclick=function(){
    nav.style.animation='toRight 0.4s ease-in-out forwards' 
    nav.classList.add('visible');
    milkShadow.style.animation='toO1 0.2s  forwards';
    milkShadow.classList.add('visible');
    body.style.overflowY='hidden'
}

milkShadow.onclick=function(){
    nav.style.animation='toLeft 0.4s ease-in-out forwards'
    milkShadow.style.animation='toO0 0.3s forwards';

    let toLeft=setTimeout(function(){
    
        nav.classList.remove('visible');
        milkShadow.classList.remove('visible');
    },400)
    body.style.overflowY='auto'

}


let floatItems=document.querySelectorAll('.float-item');

for(let i=0;i<floatItems.length;i++){
    let floatMenu=floatItems[i].querySelector('.float-menu');
    let arrow=floatItems[i].querySelector('.select-arrw');
    arrow.onclick=function(){
        floatMenu.classList.toggle('block')
        if(floatMenu.classList.contains('block')){
        arrow.style.transform='rotate(180deg)'
        }else{
            arrow.style.transform='rotate(0deg)'
        }
    }

}