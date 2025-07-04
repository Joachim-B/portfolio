const colorTab = ['red','blue','cyan','yellow','green','lime','pink','rgb(180,180,180)'] //constante avec toutes les couleurs utilisées

let soluce = [0,0,0,0]; //tableau qui contient la solution

while (soluce[0] == soluce[1] == soluce[2] == soluce[3]) { //pour éviter qu'il y ait 4 fois la même couleur
    soluce = [];
    for (i=0;i<4;i++) {
        let random = Math.floor(8*Math.random())
        soluce.push(colorTab[random])
    }
}
console.log('Solution : '+soluce)

const guessOrder = ['rball1','rball2','rball3','rball4'] //constante qui donne les id des "boules-réponse"
let colorOrder = 0; //variable qui enregistre quelle boule-réponse doit être modifiée quand on clique sur une couleur

let currentGuess = [] //sauvegarder notre réponse
let lapNumber = 1; //connaitre combien de coups on a joué
let gameOver = 0; //connaitre si la partie vient d'être finie ou pas

function clickTouches(color) {
    if (gameOver == 0) { //si la partie n'est pas finie

        if (colorOrder < 4) {
            document.getElementById(guessOrder[colorOrder]).style.background = color;
            currentGuess[colorOrder] = color;
            colorOrder++;
            console.log(currentGuess)
        }
    }
}

function sendErase(response) {

    if (gameOver == 0) { //si la partie n'est pas finie
        
        if (response == 'erase') {
            if (colorOrder > 0) {
                colorOrder -= 1 ;
                document.getElementById(guessOrder[colorOrder]).style.background = 'white';
                currentGuess.splice(currentGuess.length-1, 1);
                console.log(currentGuess)
            }
        } else { //quand le joueur valide sa réponse

            if (colorOrder == 4) { //savoir si le joueur a bien mis 4 couleurs dans sa réponse, autrement le programme ne se lance pas
                for (i=1;i<5;i++) {
                    document.getElementById('guess'+lapNumber).getElementsByClassName('ball'+i)[0].style.background = currentGuess[i-1]
                }
                //mettre notre réponse dans le mastermind
    
                for (i=0;i<4;i++) {
                    document.getElementById(guessOrder[i]).style.background = 'white';
                }
                //transformer notre ancienne réponse en espaces vides
                colorOrder = 0;
                
                let soluceCopy = soluce.slice() //copie de soluce
                let nbHints = [];
                let checkColors = 0;
                while (checkColors < soluceCopy.length) {
                    if(currentGuess[checkColors] == soluceCopy[checkColors]) { //checker si la couleur suggérée par le joueur est correcte et à la bonne position
                        nbHints.push('red')
                        soluceCopy.splice(checkColors,1)
                        currentGuess.splice(checkColors,1)
                    } else {
                        checkColors++;
                    }
                }
                //connaître tous les indices rouges

                if (soluceCopy.length == 0) { //si tous les indices sont rouges
                    
                    console.log('Trouvé !!!')
                    for (i=0;i<4;i++) {
                        document.getElementById('guess'+lapNumber).getElementsByClassName('hint'+(i+1))[0].style.background = nbHints[i] //mettre tous les indices en rouge
                        document.getElementById('answer').getElementsByClassName('ball'+(i+1))[0].style.background = soluce[i] //mettre la bonne couleur aux boules en haut du mastermind
                        document.getElementById('answer').getElementsByClassName('balls')[0].style.display = 'flex' //afficher la réponse en haut du mastermind
                    }
                    //montrer la réponse en haut du mastermind et mettre les indices en rouge
    
                    gameOver = 1; //dire que la partie est finie
                    document.getElementById('replay').style.display = 'block'; //afficher le bouton replay

                } else {

                    for (i=0; i<soluceCopy.length;i++) {
                        for(j=0;j<currentGuess.length;j++) {
                            if (soluceCopy[i] == currentGuess[j]) {
                                nbHints.push('white');
                                currentGuess.splice(j,1)
                                break;
                            }
                        }
                        //on regarde la valeur de soluceCopy est égale à une valeur de currentGuess, si oui on supprime la valeur de currentGuess et on sort de la boucle
                    }
                    //connaître les indices blancs

                    let totalNbHints = nbHints.length
                    for (i=0;i<totalNbHints;i++) {
                        random = Math.floor(nbHints.length*Math.random())
                        document.getElementById('guess'+lapNumber).getElementsByClassName('hint'+(i+1))[0].style.background = nbHints[random]
                        nbHints.splice(random,1)
                    }
                    //mélanger les indices et les montrer
                        

                    if (lapNumber == 12) { //si le joueur est à son 12e essai
                        console.log('Perdu :(')
                        for (i=0;i<4;i++) {
                            document.getElementById('answer').getElementsByClassName('ball'+(i+1))[0].style.background = soluce[i]
                            document.getElementById('answer').getElementsByClassName('balls')[0].style.display = 'flex'
                        }
                        //montrer la réponse en haut du mastermind

                        gameOver = 1;
                        document.getElementById('replay').style.display = 'block'; //afficher le bouton replay
                    } else { // si la partie continue :

                        currentGuess = []; //reset la réponse du joueur
                        lapNumber++; //rajouter un tour au compteur
                    }
                }
                
            } else;
        }
    } else;
}

function restartGame() {
    document.getElementById('replay').style.display = 'none';
    //cacher le bouton replay
    document.getElementById('answer').getElementsByClassName('balls')[0].style.display = 'none'
    //cacher la réponse du mastermind

    for (i = 1;i <5; i++) {
        for (j=0; j < document.getElementsByClassName('ball'+i).length;j++) {
            document.getElementsByClassName('ball'+i)[j].style.background = 'black'
        }
    }
    for (i = 1;i <5; i++) {
        for (j=0; j < document.getElementsByClassName('hint'+i).length;j++) {
            document.getElementsByClassName('hint'+i)[j].style.background = 'black'
        }
    }
    //remettre en noir toutes les cases



    colorOrder = 0;
    currentGuess = [];
    lapNumber = 1;
    gameOver = 0;

    soluce = [0,0,0,0]
    while (soluce[0] == soluce[1] == soluce[2] == soluce[3]) { // pour éviter qu'il y ait 4 fois la même couleur
        soluce = [];
        for (i=0;i<4;i++) {
            let random = Math.floor(8*Math.random())
            soluce.push(colorTab[random])
        }
    }
    console.log('Solution : '+soluce)

}