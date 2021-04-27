let chatContent=document.querySelector('.chat-content');
let chatField=document.querySelector('#chat-field');
let chatButton=document.querySelector('.chat-button');
let tempLi=chatContent.querySelector('.chat-li');
let tempElement=document.querySelector('.temp-element').content;

chatButton.onclick=function(evt){
    evt.preventDefault();
    let chatLi=tempElement.cloneNode(true);
    let chatLiP=chatLi.querySelector('p');
    chatLiP.textContent=chatField.value;
    if(chatLiP.textContent!==''){
    chatContent.prepend(chatLi);
    chatField.value='';
    }else{
        chatButton.disabled;

    }
}
let body=document.querySelector('body');
let darkLightMode=document.querySelector('.dark-light-mode');
let jut=document.querySelector('.jut');
darkLightMode.onclick=function(){
    body.classList.toggle('light-body');
    jut.classList.toggle('light-jut');
    $('header').toggleClass('header-light');
    $('.search-block').toggleClass('light-search-block');
    $('.search').toggleClass('light-search')
}
let chat=document.querySelector('.chat');
let chatBlock=document.querySelector('.chat-block');
let switchButton=document.querySelector('.switch');
let switchBlock=document.querySelector('.switch-block');
switchButton.onclick=function(){
    switchBlock.classList.toggle('move');
    if(chatBlock.style.display==='none'){
        chatBlock.style.display='flex';
        chat.style.height='450px'
    }else {
        chatBlock.style.display='none';
        chat.style.height='auto'
    }
   
}
let burgerAside=document.querySelector('.burger-aside');
let aside=document.querySelector('aside');
burgerAside.onclick=function(){
    if(aside.style.animationName==='aside-right'){
        aside.style.animation='forwards aside-left 0.3s'
    }else{
        aside.style.animation='forwards aside-right 0.3s'
    }
    

}

let headerBurger=document.querySelector('.header-burger');
let nav=document.querySelector('nav');
headerBurger.onclick=function(){
    nav.classList.toggle('block')
}
   
let classifications=document.querySelectorAll('.classification-of-technique');
for(classification of classifications){
    let item=classification.querySelector('.item');
    let techniques=classification.querySelectorAll('.technique');

    item.onclick=function(evt){
        evt.preventDefault();
        for(technique of techniques){
            if($(window).width() < 680){
            technique.classList.toggle('visible')
        }
    }
        
    }
    }
      

