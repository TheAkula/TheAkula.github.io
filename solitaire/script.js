let cards = [];

let deckSubmission = 1;
let cardsInPlace = 3;

let suits = [
    'diamonds',
    'hearts',
    'clubs',
    'spades'
]

let cardsNum = [
    'A', 2, 3, 4, 5, 6, 7, 8,
    9, 10, 'J', 'Q', 'K'
]

let solitarePlace = document.querySelector('.solitare-place');
let cardsPlaces = solitarePlace.querySelectorAll('.cards-place');
let deck = document.querySelector('.deck');
let place = document.querySelector('#place');

function MakeCards(arr){
    for(let i = 0; i < suits.length; i++){
        for(let j = 0; j < cardsNum.length; j++){

            let cardPlace = document.createElement('div')

            let color = suits[i] == 'hearts' || suits[i] == 'diamonds' ?
            'red' : 'black'
            cardPlace.className = 'cards-place'
            cardPlace.dataset.color = color;
            cardPlace.dataset.suit = suits[i];
            cardPlace.dataset.order = j + 1;
            cardPlace.innerHTML = `
            <div class="card">
                <div class="card-bord">
                    <span class="card-num">${cardsNum[j]}</span>
                </div>
                <div class="card-img"></div>
                <div class="card-bord">
                    <span class="card-num">${cardsNum[j]}</span>
                </div>
            </div>`

            arr.push(cardPlace)

        }
    }
}

function GameStart(){
    MakeCards(cards);
    Decompose(cards, 1);
    CheckCards();
    document.addEventListener('mousedown', OnMouseDown);
    deck.addEventListener('click', OnClickDeck)
}

function CheckCards(){
    let invertedCards = Array.from(solitarePlace.querySelectorAll('.cards-place'))
    .filter((elem) => {
        if(!elem.classList.contains('fixed')){
        let child = elem.querySelector('.cards-place')
        
        if(child) return elem;
        
        }
    });
    invertedCards.forEach(element => {
        element.querySelector('.card').classList.add('shirt')
    });
}

function Decompose(arr, num){
    for(let i = 0; i < num; i++){

        let elem = arr[Random(arr.length)]
        let cardsPlace = cardsPlaces[num-1];

        let places = cardsPlace.getElementsByClassName('cards-place')
        places.length ? places[places.length-1].append(elem) : cardsPlace.append(elem)

        arr.splice(arr.indexOf(elem), 1);

    }
    
    if(arr.length <= 24){
        while(arr.length){

            let elem = arr[Random(arr.length)];
            elem.classList.add('shirt');
            deck.append(elem);
            arr.splice(arr.indexOf(elem), 1);
        }
        return
    }

    Decompose(arr, ++num)
   
}


function Random(length){
    return Math.round(Math.random()*length - 0.5)
}

let currentDroppable = null;

function OnMouseDown(event) {

    let card = event.target.closest('.cards-place');

    if(!card) return;
    if(card.classList.contains('fixed')) return
    if(card.querySelector('.card').classList.contains('shirt')) return
    if(card.closest('.deck')) return;
    if(card.closest('#place')
    && Array.from(place.querySelectorAll('.cards-place')).indexOf(card) < place.querySelectorAll('.cards-place').length - 1) return
    
    let coords = card.getBoundingClientRect();

    let shiftX = event.clientX - coords.left;
    let shiftY = event.clientY - coords.top;

    card.style.position = 'fixed';
    card.style.zIndex = 10;

    Move(event.pageX, event.pageY)
    
    function Move(pageX, pageY){
        card.style.left = pageX - shiftX + 'px';
        card.style.top = pageY - shiftY + 'px';
    }

    document.addEventListener('mousemove', OnMouseMove)
    document.addEventListener('mouseup', OnMouseUp);


    card.ondragstart = function(){
        return false;
    }

    card.addEventListener('mouseup', OnMouseUp)

    function OnMouseMove(event){

        Move(event.clientX, event.clientY)

        card.hidden = true;

        let elemBellow = document.elementFromPoint(event.clientX, event.clientY).closest('.cards-place')

        card.hidden = false;

        if(!elemBellow) return;
        if(elemBellow.querySelector('.cards-place')) return
        if(elemBellow.closest('#place')) return;
        let w = false;
        if(elemBellow.closest('.right-deck')){
            w = true;
            if(!CheckRightDeck()) return
        }
        let parent = card.parentNode; 

        if(parent == elemBellow) return

        let q = elemBellow.closest('.right-deck');
        CheckCard()

        function CheckCard() {

            let placeColor = elemBellow.dataset.color || null;
            let num = q ? -1 : 1;
            let placeNum = +elemBellow.dataset.order;
            if(!w)
            if(placeColor == card.dataset.color ) return;
            if(placeNum != +card.dataset.order + num) return;

            currentDroppable = elemBellow;
        }

        function CheckRightDeck() {

            if(card.dataset.suit == elemBellow.dataset.suit)
                return true;
            else return false;
        }
    }

    function OnMouseUp(event){

        if(currentDroppable){

            let parent  = card.parentNode.querySelector('.card');
            if(parent) parent.classList.remove('shirt');

            currentDroppable.append(card)
        }

        CheckCardPosition();
        CheckEnd();

        currentDroppable = null;

        card.style.position = '';
        card.style.zIndex = '';
        card.style.left = '';
        card.style.top = '';

    
        document.removeEventListener('mousemove', OnMouseMove);
        document.removeEventListener('mouseup', OnMouseUp)
    
    }
}

function OnClickDeck() {
    CheckEnd();
    let deckCards = deck.querySelectorAll('.cards-place');
    let placeCards = place.querySelectorAll('.cards-place');
    
    if(!deckCards.length) {

        for(let i = 0; i < placeCards.length; i++){
            placeCards[i].classList.add('shirt');
            deck.append(placeCards[i])
        }
        return;
    }
    for(let i = 0; i < deckSubmission; i++) {

        let card = deckCards[i];
        card.classList.remove('shirt');
        place.append(card);

        CheckCardPosition();
    }

}

function CheckCardPosition(){

    let place = document.querySelector('#place');
    let placeCards = place.querySelectorAll('.cards-place');

    if(placeCards.length < cardsInPlace) return;


    for(let i = 1; i < cardsInPlace + 1; i++){
        let card = placeCards[placeCards.length - i]
        card.style.marginRight = '-50px';
    }

    for(let i = 0; i < placeCards.length - cardsInPlace; i++){
        placeCards[i].style.marginRight = '-70px'
    }

}

function CheckEnd(){
    let shirtCards = document.querySelectorAll('.shirt');
    if(shirtCards) return;

    alert(`You win! I'm glad it works!`)
}

GameStart()



