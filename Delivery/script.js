let searchExpressBlocks=document.querySelectorAll('.search-express');
let floatMenus=document.querySelectorAll('.float-menu')
for(let i=0;i<searchExpressBlocks.length;i++){
    let searchExpressBlock=searchExpressBlocks[i];
    let selectButton=searchExpressBlock.querySelector('.select-button');
    let floatMenu=searchExpressBlock.querySelector('.float-menu')
    selectButton.onclick=function(evt){
        evt.preventDefault();
        if(floatMenu.style.display!=='flex'){
        for(menu of floatMenus){
            menu.style.display='none';
        }
            floatMenu.style.display='flex';

        }else{
            for(menu of floatMenus){
                menu.style.display='none'
            }
        }
        if(floatMenu.style.display==='none'){
            searchExpressBlock.classList.remove('search-express-click')
        }else{
            searchExpressBlock.classList.add('search-express-click')
        }
    }
    let searchExpressInput=searchExpressBlock.querySelector('input');
    let links=searchExpressBlock.querySelectorAll('.link');
    for(link of links){
        link.onclick=function(){
            searchExpressInput.value=this.textContent
        }
    }
    
}
let selectArrow=document.querySelector('.select-arrow');
let searchSelect=document.querySelector('.search-select');
selectArrow.onclick=function(){
    searchSelect.classList.toggle('visible');
    selectArrow.classList.toggle('select-button-up')
}
let searchLocation=document.querySelector('.search-location');
let searchLinks=searchLocation.querySelectorAll('.link');
let searchInput=searchLocation.querySelector('input');

for(searchLink of searchLinks){
    searchLink.onclick=function(){
        searchInput.value=this.textContent
    }
}
