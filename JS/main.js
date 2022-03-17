const tileDisplay = document.querySelector('.container-box-grid');
const keyboard = document.querySelector('.key-container');
const hint = document.querySelector('.hint');
const messageDisplay = document.querySelector('.message-container');
const card = document.querySelector('.card-container');
const confeti = document.querySelector('.confeti');
const clickToClose = document.querySelector('.close-buttton');
const hintMainContainer = document.querySelector('.hint-text');
const reloads = document.querySelector('#refresh');
const legendClose = document.querySelector('#buttonClose');
const legendInfo = document.querySelector('.info-legend');
const infoIcon = document.querySelector('#info');
const closeScore = document.querySelector('#scoreClose');
const scoreCard = document.querySelector('.scoreCard');
const leaderBoard = document.querySelector('#scoreOpen');
const scoreDetails =  document.querySelector('.scoreDetails');
const scoreThis = document.getElementById('score-this');
const scoreHi = document.getElementById('score-hi')
let isGameOver = false;
let wordle;
let meaning;
let wordleMeaningText;
let high_score = 0;
let deltaScore=0;

infoIcon.addEventListener('click', ()=> {
        legendInfo.style.display = 'block';
        hintMainContainer.style.display = 'none';
        scoreCard.style.display = 'none';
})

closeScore.addEventListener('click', ()=> {
    scoreCard.style.display = 'none';
})

leaderBoard.addEventListener('click',()=>{
    scoreCard.style.display = 'block';
    hintMainContainer.style.display = 'none';
    scoreHi.textContent = localStorage.getItem("HighScore")
    scoreThis.textContent = sessionStorage.getItem("Score")
    // scoreDetails.style.display = 'flex';
})




const divEle = document.createElement('div');
divEle.innerHTML = ''
divEle.innerHTML = `
<div class="legend"> 
    <h1>💡How to Play?</h1>
    <p>The rules are very simple: You have 6 chances to guess a 5 letter word. You need to guess the word with the help of definition given in the hint section.</p>

    <div class="group">
      <div class="circle green "></div>
      <span>correctly guessed the letter.</span>
    </div>
    <div class="group">
      <div class="circle yellow"></div>
      <span>Letter guessed correctly but not at the right position.</span>
    </div> 
    <div class="group">
      <div class="circle grey"></div>
      <span>Wrong letter entered.</span>
    </div>

  </div>`
  legendInfo.append(divEle);




legendClose.addEventListener('click',()=> {
    legendInfo.style.display = 'none';
})


reloads.addEventListener('click', () => {

    window.location.reload();

})



clickToClose.addEventListener('click', () => {
    hintMainContainer.style.display = 'none'
})

hint.addEventListener('click', () => {
    legendInfo.style.display = 'none';
    scoreCard.style.display = 'none';
    hintMainContainer.style.display = 'block';
    hintMainContainer.style.height = '100%'
    hintMainContainer.style.width = '100%'
})

function getMeaning(wordMeaning) {
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${wordMeaning}`;
    fetch(url).then(res => res.json()).then(result => {
        const resSize = Object.keys(result).length;
        const meanSize = Object.keys(result[resSize - 1].meanings).length;
        const defiSize = Object.keys(result[resSize - 1].meanings[meanSize - 1].definitions).length;
        wordleMeaningText = result[resSize - 1 * Math.random() | 0].meanings[meanSize * Math.random() | 0].definitions[defiSize * Math.random() | 0].definition;
        const div = document.createElement('p')
        const div2 = document.createElement('p');
        const hintTextF = `💡Hint: The word contains letter '${wordle[wordle.length * Math.random() | 0]}'.`;
        div2.textContent = hintTextF;
        div.textContent = wordleMeaningText;
        hintMainContainer.append(div);
        hintMainContainer.append(div2);
    });

}


const keys = [

    "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P",
    "A", "S", "D", "F", "G", "H", "J", "K", "L", "<<",
    "Z", "X", "C", "V", "B", "N", "M", "Enter",
]


// appending keyboard buttons dynamically

keys.forEach(key => {
    const buttonElement = document.createElement('button')
    buttonElement.textContent = key;
    buttonElement.setAttribute('id', key);
    keyboard.append(buttonElement);
    buttonElement.addEventListener('click', () => handleClick(key));
})


let currRow = 0;
let currTile = 0;

const guessRows = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
]



// this forEach loop is creating the tile.

guessRows.forEach((guessRow, guessRowIndex) => {
    const rowElement = document.createElement('div')
    rowElement.setAttribute('id', 'guessRow-' + guessRowIndex);
    rowElement.classList.add('rowElement');
    guessRow.forEach((guess, guessIndex) => {
        const columnElement = document.createElement('div');
        columnElement.setAttribute('id', 'guessRow-' + guessRowIndex + '-tile-' + guessIndex);
        columnElement.classList.add('columnElement');
        rowElement.append(columnElement);
    })
    tileDisplay.append(rowElement);
})


//  this arrow function is handelling the keyboard clicks

const handleClick = (key) => {
    if (!isGameOver) {
        if (key == '<<') {
            deleteLetter();
            return;
        }
        if (key === 'Enter') {
            checkRow()
            return;
        }
        addLetter(key);
    }
    //this function call will let us add the clicked word to the tile
}

const addLetter = (letter) => {
    const tile = document.getElementById('guessRow-' + currRow + '-tile-' + currTile)
    if (currTile < 5 && currRow < 6) {
        tile.textContent = letter;
        tile.setAttribute('data', letter);
        guessRows[currRow][currTile] = letter;
        currTile = currTile + 1;
    }
}

const delKey = document.getElementById('<<')
delKey.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 svg-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
<path stroke-linecap="round" stroke-linejoin="round" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
</svg>`;
delKey.style.fontSize = '20px';


const deleteLetter = () => {

    if (currTile > 0) {

        currTile--;
        const tile = document.getElementById('guessRow-' + currRow + '-tile-' + currTile)
        tile.textContent = ''
        guessRows[currRow][currTile] = '';
        tile.setAttribute('data', '');
    }


}

const checkRow = () => {
    const guess = guessRows[currRow].join('')
    flipTiles()
    if (currTile === 5) {
        if (wordle == guess) {
            card.classList.add('confeti');
            winAudio.play();
            var highSore1 = localStorage.getItem("HighScore");

            // if(high_score == 0)
            // {
            //     sessionStorage.setItem("Score",0) 
            // }
            // deltaScore = parseInt(sessionStorage.getItem("Score"))+100;
            high_score = parseInt(sessionStorage.getItem("Score")) + 100;
            sessionScore(high_score);
            if(high_score>highSore1)
            {
                highestScore(high_score);
            }
            scoreHi.textContent = localStorage.getItem("HighScore")
            if(isNaN(sessionStorage.getItem("Score")))
            {
                sessionStorage.setItem("Score",100)
            }
            scoreThis.textContent = high_score;
            scoreThis.textContent = sessionStorage.getItem("Score")
            showmessage('Woohoo! You Guessed it right 🥳')
            isGameOver = true;
            return;
        }
        else {
            if (currRow >= 5) {
                isGameOver = true;
                looseAudio.play();
                scoreHi.textContent = localStorage.getItem("HighScore")
                scoreThis.textContent = sessionStorage.getItem("Score")
                showmessage(`Game Over 👾 The Word Was ${wordle}`)
                return;
            }

        }
    }
    if (currRow < 5) {
        currRow = currRow + 1;
        currTile = 0;
    }
}

const showmessage = (message) => {
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    messageDisplay.style.height = '30px';
    messageDisplay.append(messageElement);
    // messageDisplay.classList.add('flip')
    setTimeout(() => {
        card.classList.remove('confeti')
        card.style.opacity = '0px';
    }, 29900)
    setTimeout(() => messageDisplay.style.height = '0px', 30000)
    setTimeout(() => messageDisplay.removeChild(messageElement), 30070)
}

const addColorToKey = (keyletter, color) => {
    const key = document.getElementById(keyletter)
    key.classList.add(color)
}

const flipTiles = () => {
    const rowTiles = document.querySelector('#guessRow-' + currRow).childNodes;
    // const dataLetter = tile.getAttribute('data')
    let checkWordle = wordle;
    const guessWhat = []
    rowTiles.forEach(tile => {
        guessWhat.push({ letter: tile.getAttribute('data'), color: 'grey' })
    })

    guessWhat.forEach((guess, index) => {
        if (guess.letter == wordle[index]) {
            guess.color = 'green'
            checkWordle = checkWordle.replace(guess.letter, '')
        }
    })

    guessWhat.forEach(guess => {
        if (checkWordle.includes(guess.letter)) {
            guess.color = 'yellow'
            checkWordle = checkWordle.replace(guess.letter, '');
        }
    })


    rowTiles.forEach((tile, index) => {
        setTimeout(() => {
            tile.classList.add('flip')
            tile.classList.add(guessWhat[index].color)
            addColorToKey(guessWhat[index].letter, guessWhat[index].color);
        }, 100 * index)
    })
}

winAudio = new Audio('/assests/mixkit-video-game-win-2016.wav');
looseAudio = new Audio('/assests/mixkit-falling-game-over-1942.wav');

function highestScore(score)
    {
        localStorage.setItem("HighScore",score);
    }

function sessionScore(scr)
{
 
    sessionStorage.setItem("Score",scr);
}

