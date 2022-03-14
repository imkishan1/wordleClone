// console.log("connected...")
const tileDisplay = document.querySelector('.container-box-grid');
const keyboard = document.querySelector('.key-container');
const hint = document.querySelector('.hint');
const messageDisplay = document.querySelector('.message-container');
const card = document.querySelector('.card-container');
const confeti =  document.querySelector('.confeti');
const clickToClose = document.querySelector('.close-buttton');
const hintMainContainer = document.querySelector('.hint-text');
const reloads = document.querySelector('#refresh');

reloads.addEventListener('click',() => {

    window.location.reload();
})

let isGameOver =  false;
let wordle;
let meaning;
let wordleMeaningText;


clickToClose.addEventListener('click',() =>{
      hintMainContainer.style.display = 'none'
})

hint.addEventListener('click',() => {
    hintMainContainer.style.display = 'block';
    hintMainContainer.style.height = '100%'
    hintMainContainer.style.width = '100%'
})

function getMeaning(wordMeaning)
{
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${wordMeaning}`;
    fetch(url).then(res => res.json()).then(result => {
        const resSize = Object.keys(result).length;
        const meanSize = Object.keys(result[resSize-1].meanings).length;
        const defiSize = Object.keys(result[resSize-1].meanings[meanSize-1].definitions).length;
        wordleMeaningText = result[resSize-1* Math.random() | 0].meanings[meanSize* Math.random() | 0].definitions[defiSize* Math.random() | 0].definition + ` And the word contains ${wordle[wordle.length * Math.random() | 0]}`;
        const div = document.createElement('p')
        div.textContent = wordleMeaningText;
        hintMainContainer.append(div);
    });

}


const keys = [

    "Q","W","E","R","T","Y","U","I","O","P",
    "A","S","D","F","G","H","J","K","L","Enter",
    "Z","X","C","V","B","N","M","<<",
 ]


 // appending keyboard buttons dynamically

 keys.forEach(key=>{
    const buttonElement =  document.createElement('button')
    buttonElement.textContent = key;
    buttonElement.setAttribute('id',key);
    keyboard.append(buttonElement);
    buttonElement.addEventListener('click',() =>handleClick(key));
  })
 

 let currRow = 0;
 let currTile = 0;

const guessRows  = [
    ['','','','',''],
    ['','','','',''],
    ['','','','',''],
    ['','','','',''],
    ['','','','',''],
    ['','','','',''],
]



// this forEach loop is creating the tile.

guessRows.forEach((guessRow,guessRowIndex)=>{
    const rowElement = document.createElement('div')
    rowElement.setAttribute('id','guessRow-'+guessRowIndex);
    rowElement.classList.add('rowElement');
    guessRow.forEach((guess,guessIndex)=>{
        const columnElement = document.createElement('div');
        columnElement.setAttribute('id','guessRow-'+guessRowIndex+'-tile-'+guessIndex);
        columnElement.classList.add('columnElement');
        rowElement.append(columnElement);
    })
    tileDisplay.append(rowElement);
})


//  this arrow function is handelling the keyboard clicks

 const handleClick = (key) => {
     if(!isGameOver)
     {
 // console.log(key);
 if(key== '<<')
 {
     deleteLetter();
     // messageElement.textContent = '';
     // messageDisplay.textContent=''
    //  console.log(guessRows)
     return;
 }
 if(key==='Enter'){
     checkRow()
    //  console.log(guessRows)
     // if(currRow<5)
     // {
     //     currRow++;
     // }
     return;
 }
 addLetter(key);
     }
    //this function call will let us add the clicked word to the tile
 }

const addLetter = (letter) => {
   const tile = document.getElementById('guessRow-'+currRow+'-tile-'+currTile)
   if(currTile<5 && currRow<6){
    tile.textContent = letter;
    tile.setAttribute('data',letter);
    guessRows[currRow][currTile] = letter;
    currTile = currTile+1; 
    // if(currTile==5)
    // {
    //     currRow++;
    //     currTile=0;
    // }
    // console.log(guessRows)
    }
}


// enterKey.innerHTML = `<span>Check </span><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 svg-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
// <path stroke-linecap="round" stroke-linejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
// </svg>`
const delKey = document.getElementById('<<')
// delKey.innerHTML = `<i class='bx bx-chevrons-left'></i>`;
delKey.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 svg-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
<path stroke-linecap="round" stroke-linejoin="round" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
</svg>`;
delKey.style.fontSize = '20px';


const deleteLetter = () => {

    if(currTile > 0)
    {
        
        currTile--;
        const tile = document.getElementById('guessRow-'+ currRow +'-tile-' + currTile)
        tile.textContent = ''
        guessRows[currRow][currTile] = '';
        tile.setAttribute('data','');
    }
    // if(currRow>=0 && currTile >0)
    // {
    //     currRow = currRow-1;
    // }

}

const checkRow = () =>{
    const guess =  guessRows[currRow].join('')
    flipTiles()
    // console.log(guess)
    if(currTile === 5)
    {
        if(wordle == guess)
        {
            card.classList.add('confeti');
            winAudio.play();
           showmessage('Yay! You Guessed it right 🥳')
           isGameOver = true;
           return;
        }
        else{
            if(currRow >= 5)
            {
                isGameOver = false;
                looseAudio.play();
                showmessage(`Game Over 👾 The Word Was ${wordle}`)
                return;
            }

        }
    }
    if(currRow < 5)
    {
        currRow = currRow+1;
        currTile = 0;
    }
}

const showmessage = (message) => {
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    messageDisplay.style.height = '30px';
    messageDisplay.append(messageElement);
    // messageDisplay.classList.add('flip')
    setTimeout(()=> { card.classList.remove('confeti')
                      card.style.opacity = '0px';
    },3900)
    setTimeout(()=>  messageDisplay.style.height = '0px',4000)
    setTimeout(()=> messageDisplay.removeChild(messageElement),4070)
}

const addColorToKey = (keyletter, color) => {
        const key = document.getElementById(keyletter)
        key.classList.add(color)
}

const flipTiles = () =>{
    const rowTiles =  document.querySelector('#guessRow-'+currRow).childNodes;
    // const dataLetter = tile.getAttribute('data')
let checkWordle = wordle;
const guessWhat = []
rowTiles.forEach(tile=>{
    guessWhat.push({letter: tile.getAttribute('data'),color: 'grey'})
})

guessWhat.forEach((guess,index) => {
    if(guess.letter == wordle[index]){
        guess.color = 'green'
        checkWordle = checkWordle.replace(guess.letter, '')
    }
})

guessWhat.forEach(guess=>{
    if(checkWordle.includes(guess.letter)){
        guess.color = 'yellow'
        checkWordle = checkWordle.replace(guess.letter,'');
    }
})


    rowTiles.forEach((tile ,index)=>{
        setTimeout(() => {
            tile.classList.add('flip')
            tile.classList.add(guessWhat[index].color)
            addColorToKey(guessWhat[index].letter,guessWhat[index].color);
        }, 100*index)
    })
  }

//   setTimeout( ()=> card.classList.remove('confeti'),4000);


winAudio = new Audio('/assests/mixkit-video-game-win-2016.wav');
looseAudio = new Audio('/assests/mixkit-falling-game-over-1942.wav');
