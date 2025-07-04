window.onload = onStart;

const totalBox = []; // retient l'entièreté des cases du plateau

function onStart() {
    for (i=1;i<=100;i++) {
        document.getElementsByClassName('board')[0].insertAdjacentHTML('beforeend','<div id="'+i+'" onclick ="clickCase(\''+i+'\')" onmouseover = "playerSeeBoats(\''+i+'\')"></div>');
        
        document.getElementsByClassName('botBoard')[0].insertAdjacentHTML('beforeend','<div id="bot'+i+'" onclick ="playerPlaceBoats(\''+i+'\')" onmouseover ="playerSeeBoats(\''+i+'\')"></div>')
       
        document.getElementsByClassName('board')[1].insertAdjacentHTML('beforeend','<div id="mini'+i+'"></div>');
        
        document.getElementsByClassName('botBoard')[1].insertAdjacentHTML('beforeend','<div id="minibot'+i+'"></div>');
        totalBox.push(i);
    }
}
//mettre les 100 divs dans #board et récupérer leurs id dans un tableau

let boxAvailables = []; //retient toutes les cases libres
let boxUnavailables = []; //retient quelles cases sont prises

let boatSizeAmount = [0,0,0,0]; //tableau qui sauvegarde le nombre de bateau au total. boatSizeAmount[0]=nb bateaux de deux,  boatSizeAmount[1]=nb bateaux de 3, etc...
let totalBoats; //donne le nombre total de bateaux sur le plateau
let gameStatus = 'no'; //savoir si la partie a commencé et si les bateaux sont placés. Valeurs : 'solo','inPlaceBot','placeBotOver','bot','inPlaceP1','placeP1Over','inPlaceP2','placeP2Over','2p','no'
let allowConfirm = false; //pour éviter de lancer le jeu avec 0 bateaux

let posBoats2 = []; //tableau qui stocke les coordonnées des bateaux de 2 cases
let posBoats3 = []; //tableau qui stocke les coordonnées des bateaux de 3 cases
let posBoats4 = []; //tableau qui stocke les coordonnées des bateaux de 4 cases
let posBoats5 = []; //tableau qui stocke les coordonnées des bateaux de 5 cases
let boatFound = []; //retient les places de bateau trouvées
let boatLength; //donne la taille du bateau que le joueur est en train de poser
let saveClickedBox = [] //retient toutes les cases qui ont été cliquées

let playerScore = 152; //stocke le score du joueur en mode solo
let highscoreSolo = 0; //meilleur score du joueur en mode solo
//Définition du score : bateau touché : -1pt, case vide touchée : -2pts 

let openGamemode = false //s'active si le choix du gamemode s'ouvre
let actualGamemode; //donne quel mode de jeu est activé. Valeurs : 'solo','inPlace','bot','2players'
let changeGamemode = true; //permet de ne pas revenir sur le menu du choix du gamemode si on ne change pas les paramètres de bateaux entre 2 parties

let copyBoatSizeAmount = []; //copier boatSizeAmount et l'utiliser pour placer les bateaux du joueur
let copyTotalBoats; //retient le nombre de bateaux coulés par le bot et le nombre de bateaux qu'il reste à placer au joueur
let boatCurrentlyPlaced = false; //détermine à quel moment de la pose d'un bateau se trouve le joueur.
let botBoxUnavailables = []; //permet de connaitre quelles cases sont occupées
let initialBoatPos = ''; //retient la position initiale du bateau en train d'être posé
let initialPosX; //retient la position en abscisse (entre 1 et 10) de la position initiale du bateau
let initialPosY; //retient la position en ordonnée (entre 1 et 10) de la position initiale du bateau
let botCardinal; //retient dans quelle direction le bateau va être posé et s'il peut être posé. Valeur : 'north','south','west','east','no'
let placesHistory = []; //recence tous les types de bateaux placés dans leur ordre d'apparition

let boardOnBotBoard = false; //retient si le tableau principal contient botBoard ou board

let botPosBoats2 = [];
let botPosBoats3 = [];
let botPosBoats4 = [];
let botPosBoats5 = []; //tableaux qui stockent les positions des bateaux du joueur
let botBoxLeft = [] //recense les cases qu'il reste à cliquer
let botBoxEmpty = [] //recense toutes les cases cliquées vides
let botMemory = [] //retient les id des pièces des bateaux qui n'ont pas été entièrement trouvés
let botDirection; //retient dans quelle direction le bot va aller s'il trouve une pièce de bateau
let botNextPlay; //retient l'id de la prochaine pièce que le bot va cliquer (le bot fait ses calculs après avoir joué son coup)

let p1Turn = true; //détermine à qui est-ce le tour de joueur. True : joueur 1, False : joueur 2
let saveClickedBox2 = []; //retient toutes les cases que le joueur 2 a cliqué
let boatFound2 = [];
let noReset = false; //permet d'éviter que les joueurs puissent reset pendant le timeout en mode 2 joueurs

function changeNbBoats(idboat) {
    if (openGamemode == false) {
        let upDown = idboat.substring(0,(idboat.length-1))
        let number = idboat.substring(idboat.length-1)
        changeGamemode = true;
        document.getElementById('confirmBoatAmount').innerHTML = '<p class="confirmResetText">Confirm</p>'
        if(upDown == 'up') {
            boatSizeAmount[number-2]++;
            
        } else {
            if (boatSizeAmount[number-2]>0) {
                boatSizeAmount[number-2] -= 1;
            }
        }
        document.getElementById('size'+number).getElementsByClassName('boatAmount')[0].getElementsByTagName('span')[1].innerHTML = boatSizeAmount[number-2];
        
        if (boatSizeAmount[0] !==0 || boatSizeAmount[1] !==0 || boatSizeAmount[2] !==0 || boatSizeAmount[3] !==0) {
            document.getElementById('confirmBoatAmount').style.opacity = '100%'
            allowConfirm = true;
        } else {
            document.getElementById('confirmBoatAmount').style.opacity = '20%'
            allowConfirm = false;
        }
        //vérifier qu'il y a au moins un bateau de sélectionné
    }
    
}

function resetConfirm(answer) {
    
    if(answer == 'confirm') {
        if (openGamemode == true) { //quand le bouton confirm a une fonction de Go back
            openGamemode = false;
            allowConfirm = true;
            document.getElementById('gamemodeChoice').style.display = 'none'
            document.getElementById('firstBoard').getElementsByClassName('board')[0].style.display = 'flex'
            document.getElementById('confirmBoatAmount').getElementsByTagName('p')[0].innerHTML = 'Confirm'
        
        } else if (gameStatus == 'placeBotOver') { //si le bouton Confirm a une fonction de confirmation des bateaux posés
            document.getElementById('showBoats').getElementsByTagName('p')[0].innerHTML = 'Show boats'
            startVSBot();

        } else if (gameStatus == 'placeP1Over') {
            for(i=0;i<boxUnavailables.length;i++) {
                document.getElementById(boxUnavailables[i]).style.backgroundImage = 'none'
            }
            actualGamemode = 'uhuh'
            swapBoards();
            actualGamemode = 'inPlace'
            copyTotalBoats = totalBoats
            copyBoatSizeAmount = boatSizeAmount.slice(0);
            placesHistory = [];
            document.getElementById('principalText').style.textAlign = 'left'
            document.getElementById('retourConsole').style.justifyContent = 'left'
            document.getElementById('boatPreview').style.display = 'block'
            document.getElementById('showBoats').style.opacity = '20%'
            document.getElementById('confirmBoatAmount').style.opacity = '20%'
            document.getElementById('confirmBoatAmount').getElementsByTagName('p')[0] = 'Play'
            document.getElementsByClassName('botBoard')[0].style.backgroundColor = 'red'
            for (i=boatSizeAmount.length-1;i>=0;i--) {
                if(boatSizeAmount[i] > 0) {
                    boatLength = i+2;
                    break;
                }
            }
            document.getElementById('boatPreview').style.backgroundImage = 'url("img/boat-all/'+boatLength+'boat-all.png")'
            document.getElementById('principalText').innerHTML = '<span>Player 2 turn :</span><span>Please place the size '+boatLength+' boat on the board. </span><span>Boats remaining : '+totalBoats+'</span>'
            gameStatus = 'inPlaceP2'

        } else if(gameStatus == 'placeP2Over') {
            for(i=0;i<botBoxUnavailables.length;i++) {
                document.getElementById('bot'+botBoxUnavailables[i]).style.backgroundImage = 'none'
            }
            copyTotalBoats = totalBoats
            actualGamemode = 'uhuhx2'
            swapBoards();
            p1Turn = false;
            document.getElementById('principalText').style.textAlign = 'center'
            document.getElementById('principalText').innerHTML = '<span>Player 2 turn !</span><span>Player 1 remaining boats : '+totalBoats+'</span><span>Player 2 remaining boats : '+copyTotalBoats
            document.getElementById('retourConsole').style.justifyContent = 'center'
            document.getElementById('showBoats').getElementsByTagName('p')[0].innerHTML = 'Show boats'
            
            document.getElementById('confirmBoatAmount').getElementsByTagName('p')[0].innerHTML = 'Replay'
            if (boatSizeAmount[0] !==0 || boatSizeAmount[1] !==0 || boatSizeAmount[2] !==0 || boatSizeAmount[3] !==0) {
                document.getElementById('confirmBoatAmount').style.opacity = '100%'
                allowConfirm = true;
            
            }
            gameStatus = '2players'
            actualGamemode = gameStatus
        }
        else if (allowConfirm == true) { //quand le bouton confirm a une fonction de confirm et replay
            if (changeGamemode == false) {
                if(actualGamemode == 'solo') {
                    resetAll();
                    gamemode('solo')
                
                } else if(actualGamemode == 'bot'){
                    startVSBot();
                
                } else {
                    resetAll();
                    gamemode('2players');
                }

            } else {
                resetAll();
                openGamemode = true;
                allowConfirm = false;
                document.getElementById('firstBoard').getElementsByClassName('board')[0].style.display = 'none'
                document.getElementById('firstBoard').getElementsByClassName('botBoard')[0].style.display = 'none'
                document.getElementById('gamemodeChoice').style.display = 'flex'
                document.getElementById('confirmBoatAmount').getElementsByTagName('p')[0].innerHTML = 'Go back'
            }
        } else;

    } else if(noReset == false) { //empêche aux joueurs de reset pendant le timeout
        resetAll();
        if(openGamemode == true) {
            openGamemode = false;
            document.getElementById('gamemodeChoice').style.display = 'none'
            document.getElementById('firstBoard').getElementsByClassName('board')[0].style.display = 'flex'
        }
        allowConfirm = false;
        document.getElementById('confirmBoatAmount').style.opacity = '20%'
        changeGamemode = true;
        gameStatus = 'no';
        document.getElementById('confirmBoatAmount').innerHTML = '<p class="confirmResetText">Confirm</p>'
        document.getElementById('commentaires').style.display = 'none'
        for(i=0;i<boatSizeAmount.length;i++) {
            boatSizeAmount[i] = 0;
            document.getElementById('size'+(i+2)).getElementsByClassName('boatAmount')[0].getElementsByTagName('span')[1].innerHTML = '0';
        }
    } else;
}

function resetAll() { //reset des éléments principaux quand on repasse par le menu des modes de jeu
    for(i=0;i<totalBox.length;i++) {
        document.getElementById(totalBox[i]).style.backgroundColor = 'lightseagreen'
        document.getElementById(totalBox[i]).style.backgroundImage = 'none'
        document.getElementById('mini'+totalBox[i]).style.backgroundColor = 'lightseagreen'
        document.getElementById('mini'+totalBox[i]).style.backgroundImage = 'none'
        document.getElementById('bot'+totalBox[i]).style.backgroundColor = 'lightseagreen'
        document.getElementById('bot'+totalBox[i]).style.backgroundImage = 'none'
        document.getElementById('minibot'+totalBox[i]).style.backgroundColor = 'lightseagreen'
        document.getElementById('minibot'+totalBox[i]).style.backgroundImage = 'none'
    }
    //reset des terrains de jeu
    if(initialBoatPos.length) {
        document.getElementById('bot'+initialBoatPos).innerHTML = ''
    }
    document.getElementsByClassName('botBoard')[0].style.backgroundColor = 'white'
    document.getElementsByClassName('board')[0].style.backgroundColor = 'white'
    playerScore = 152;
    boatCurrentlyPlaced = false;
    placesHistory = [];

}

function gamemode(mode) { //que faire quand on clique sur l'un des 3 modes de jeu
    openGamemode = false;
    actualGamemode = mode;
    changeGamemode = false;
    document.getElementById('gamemodeChoice').style.display = 'none'
    document.getElementById('commentaires').style.display = 'flex'
    saveClickedBox = []
    posBoats2 = []
    posBoats3 = []
    posBoats4 = []
    posBoats5 = []
    boatFound = []
    boxUnavailables = []
    botPosBoats2 = []
    botPosBoats3 = []
    botPosBoats4 = []
    botPosBoats5 = []
    botBoxUnavailables = []
    boxAvailables = totalBox.slice();
    
    if (mode == 'solo') {
        document.getElementById('confirmBoatAmount').innerHTML = '<p class="confirmResetText">Replay</p>'
        document.getElementById('retourConsole').style.justifyContent = 'center'
        document.getElementById('retourConsole').style.alignItems = 'center'
        document.getElementById('firstBoard').getElementsByClassName('board')[0].style.display = 'flex'
        document.getElementById('retourConsole').style.width = '500px'
        document.getElementById('retourConsole').style.height = '70px'
        document.getElementById('secondBoard').style.display = 'none'
        document.getElementById('boatPreview').style.display = 'none'
        document.getElementById('mainComment').style.marginBottom = '0px'
        document.getElementById('showBoats').getElementsByClassName('confirmResetText')[0].innerHTML = "Show boats"
        document.getElementById('showBoats').style.opacity = "100%"
        gameStatus = 'solo'
        placeBoats();

    } else {
        
        document.getElementById('retourConsole').style.justifyContent = 'left'
        document.getElementById('retourConsole').style.textAlign = 'left'
        document.getElementById('retourConsole').style.width = '470px'
        document.getElementById('retourConsole').style.height = '120px'
        document.getElementById('mainComment').style.marginBottom = '20px'
        document.getElementById('showBoats').getElementsByClassName('confirmResetText')[0].innerHTML = "Cancel last boat"
        document.getElementById('showBoats').style.opacity = "20%"
        document.getElementById('confirmBoatAmount').style.opacity = '20%'
        totalBoats = boatSizeAmount[0]+boatSizeAmount[1]+boatSizeAmount[2]+boatSizeAmount[3]
        copyTotalBoats = totalBoats;
        copyBoatSizeAmount = boatSizeAmount.slice(0);
        for (i=boatSizeAmount.length-1;i>=0;i--) {
            if(boatSizeAmount[i] > 0) {
                boatLength = i+2;
                break;
            }
        }
        actualGamemode = 'inPlace'

        if(mode == 'bot') {
            document.getElementById('firstBoard').getElementsByClassName('board')[0].style.display = 'none'
            document.getElementById('firstBoard').getElementsByClassName('botBoard')[0].style.display = 'flex'
            document.getElementById('firstBoard').getElementsByClassName('botBoard')[0].style.backgroundColor = 'red'
            document.getElementById('secondBoard').getElementsByClassName('botBoard')[0].style.display = 'none'
            document.getElementById('secondBoard').getElementsByClassName('board')[0].style.display = 'flex'
            document.getElementById('secondBoard').style.display = 'flex'
            boardOnBotBoard = true;
            document.getElementById('confirmBoatAmount').getElementsByTagName('p')[0].innerHTML = 'Play'
            document.getElementById('principalText').innerHTML = '<span>Please place the size '+boatLength+' boat on the board. </span><span>Boats remaining : '+totalBoats+'</span>'
            document.getElementById('boatPreview').style.display = 'block'
            document.getElementById('boatPreview').style.backgroundImage = 'url("img/boat-all/'+boatLength+'boat-all.png")'
            gameStatus = 'inPlaceBot'
       
        } else {
            botBoxUnavailables = [];
            botPosBoats2 = []
            botPosBoats3 = []
            botPosBoats4 = []
            botPosBoats5 = []
            saveClickedBox2 = []
            boatFound2 = []
            for(i=0;i<totalBox.length;i++) {
                document.getElementById('bot'+totalBox[i]).style.backgroundColor = 'royalblue'
                document.getElementById('minibot'+totalBox[i]).style.backgroundColor = 'royalblue'
            }
            document.getElementById('firstBoard').getElementsByClassName('botBoard')[0].style.display = 'none'
            document.getElementById('firstBoard').getElementsByClassName('board')[0].style.display = 'flex'
            document.getElementById('firstBoard').getElementsByClassName('board')[0].style.backgroundColor = 'red'
            document.getElementById('secondBoard').getElementsByClassName('board')[0].style.display = 'none'
            document.getElementById('secondBoard').getElementsByClassName('botBoard')[0].style.display = 'flex'
            document.getElementById('secondBoard').style.display = 'flex'
            boardOnBotBoard = false;
            document.getElementById('confirmBoatAmount').getElementsByTagName('p')[0].innerHTML = 'Confirm boats'
            document.getElementById('principalText').innerHTML = '<span>Player 1 turn :</span><span>Please place the size '+boatLength+' boat on the board. </span><span>Boats remaining : '+totalBoats+'</span>'
            document.getElementById('boatPreview').style.display = 'block'
            document.getElementById('boatPreview').style.backgroundImage = 'url("img/boat-all/'+boatLength+'boat-all.png")'
            gameStatus = 'inPlaceP1'
        }
    }
}

function startVSBot() { //reinitialise l'état du jeu sans avoir à repasser par la pose des bateaux
    for(i=0;i<totalBox.length;i++) {
        document.getElementById(totalBox[i]).style.backgroundColor = 'lightseagreen'
        document.getElementById(totalBox[i]).style.backgroundImage = 'none'
        document.getElementById('mini'+totalBox[i]).style.backgroundColor = 'lightseagreen'
        document.getElementById('mini'+totalBox[i]).style.backgroundImage = 'none'
        document.getElementById('bot'+totalBox[i]).style.backgroundColor = 'lightseagreen'
        document.getElementById('minibot'+totalBox[i]).style.backgroundColor = 'lightseagreen'
    }

    showBoats('botBoardOnly')
    document.getElementById('confirmBoatAmount').getElementsByTagName('p')[0].innerHTML = 'Replay'
    document.getElementsByClassName('botBoard')[0].style.display = 'none'
    document.getElementsByClassName('botBoard')[1].style.display = 'flex'
    document.getElementsByClassName('board')[0].style.display = 'flex'
    document.getElementsByClassName('board')[1].style.display = 'none'
    boardOnBotBoard = false;
    totalBoats = boatSizeAmount[3]+boatSizeAmount[2]+boatSizeAmount[1]+boatSizeAmount[0]
    copyTotalBoats = totalBoats; //après avoir utilisé copyTotalBoats pour connaitre le nombre restants de bateaux à placer, on le réutilise pour connaitre le nombre de bateaux détruits par le bot.
    saveClickedBox = []
    posBoats2 = []
    posBoats3 = []
    posBoats4 = []
    posBoats5 = []
    boatFound = []
    boxUnavailables = []
    botBoxLeft = totalBox.slice(0);
    botDirection = 'no'
    botBoxEmpty = []
    botMemory = []
    boxAvailables = totalBox.slice();
    gameStatus = 'bot'
    botNextPlay = Math.floor(botBoxLeft.length*Math.random())
    actualGamemode = 'bot'
    placeBoats();
}

function placeBoats() {
    console.clear()
    console.log('Bateaux confirmé !')
    let errorInBoard = false; //s'active si un bateau n'a pas trouvé de place sur le plateau

    for(boatLength=5;boatLength>=2;boatLength-=1) { //boucle qui commence par les bateaux de 5 cases et finit aux bateaux de 2 cases
        
        let placeUnavailable = [] //tableau qui retient les cases sur lesquelles les bateaux du même type ont déjà essayé de se poser mais n'ont pas trouvé de place                
        if(errorInBoard == true) {
            break;
        }
        
        for (boatLeft=0;boatLeft<boatSizeAmount[boatLength-2];boatLeft++) { //boucle qui a autant de tours que d'exemplaires du bateau
    
            let placeNotFound = true; //boolean qui dit reste en true tant que le bateau n'a pas pas trouvé de place
    
            while( placeNotFound == true) { //boucle qui ne s'arrête pas tant que le bateau n'a pas trouvé sa place ou que le plateau n'a plus assez de place pour poser le bateau
    
                for (i=0;i<placeUnavailable.length;i++) {
                    const posplaceUnavailable = boxAvailables.indexOf(placeUnavailable[i]);
                    boxAvailables.splice(posplaceUnavailable,1)
                }
                //on enlève des places disponibles les places déjà testées lorsqu'on a essayé de poser un bateau et qu'il n'a pas su se placer
                let randomPoint = Math.floor(boxAvailables.length*Math.random())
                if(boxAvailables.length >0) {
                    randomPoint = boxAvailables[randomPoint]
                } else {
                    break; //sort de la boucle s'il n'y a plus de place disponible
                }
                for (i=0;i<placeUnavailable.length;i++) {
                    boxAvailables.push(placeUnavailable[i])
                }
                //partie pour donner l'id d'une case disponible -> randomPoint
    
    
                let temporaryAxes = ['north','south','west','east']; //enregistre les axes cardinaux dans lesquels le bateau peut aller 
                const posNorth = temporaryAxes.indexOf('north')
                const posSouth = temporaryAxes.indexOf('south')
                if(randomPoint <= ((boatLength-1)*10)) {
                    temporaryAxes.splice(posNorth,1)
                } else if(randomPoint >= 100-((boatLength-1)*10)) {
                    temporaryAxes.splice(posSouth,1)
                }
                const posWest = temporaryAxes.indexOf('west')
                const posEast = temporaryAxes.indexOf('east')
                for(i=1;i<boatLength;i++) {
                    if(((randomPoint-i) % 10 == 0)) {
                        temporaryAxes.splice(posWest,1)
                        break;
                    } else if ((randomPoint+(i-1)) % 10 == 0) {
                        temporaryAxes.splice(posEast,1)
                        break;
                    } else;
                }
                //connaître les directions dans lesquelles le bateau peut aller en fonction de sa place et de sa distance des bordures 
    
                eval('posBoats'+boatLength).push(randomPoint)
    
                while(placeNotFound == true && temporaryAxes.length > 0) {
                    let randomAxe = Math.floor(temporaryAxes.length*Math.random())
                    let actualDirection = temporaryAxes[randomAxe] //prend un point cardinal random parmi ceux disponibles
                    temporaryAxes.splice(randomAxe, 1) //enlève le point cardinal sélectionné pour ne pas qu'on puisse le choisir après
    
                    for (i=1;i<boatLength;i++) { //début de la boucle pour vérifier si les cases autour sont libres
                        let breakLoop = 0;
                        placeNotFound = false; // tant que le bateau n'a pas rencontré de case prise, mettre placeNotFound en false pour ensuite le remettre en true s'il rencontre une case prise
                        if (actualDirection == 'north') {
                            if(boxUnavailables.length > 0) {
                                for(j=0;j<boxUnavailables.length;j++) {
                                    if(randomPoint-10*i == boxUnavailables[j]) {
                                        breakLoop = 1;
                                        break;
                                    }
                                }
                            }
                            let actualRandomPoint = randomPoint-10*i;
                            eval('posBoats'+boatLength).push(actualRandomPoint)
    
                        } else if (actualDirection == 'south') {
                            if(boxUnavailables.length > 0) { 
                                for(j=0;j<boxUnavailables.length;j++) {
                                    if(randomPoint+10*i == boxUnavailables[j]) {
                                        breakLoop = 1;
                                        placeNotFound = true;
                                        break;
                                    }
                                }
                            }
                            let actualRandomPoint = randomPoint+10*i;
                            eval('posBoats'+boatLength).push(actualRandomPoint)
                        } else if (actualDirection == 'west') {
                            if(boxUnavailables.length > 0) {
                                for(j=0;j<boxUnavailables.length;j++) {
                                    if(randomPoint-1*i == boxUnavailables[j]) {
                                        breakLoop = 1;
                                        break;
                                    }
                                }
                            }
                            let actualRandomPoint = randomPoint-1*i;
                            eval('posBoats'+boatLength).push(actualRandomPoint)
                        } else if (actualDirection == 'east') {
                            if(boxUnavailables.length > 0) {
                                for(j=0;j<boxUnavailables.length;j++) {
                                    if(randomPoint+1*i == boxUnavailables[j]) {
                                        breakLoop = 1;
                                        break;
                                    }
                                }
                            }
                            let actualRandomPoint = randomPoint+1*i;
                            eval('posBoats'+boatLength).push(actualRandomPoint)
                        }
                        if (breakLoop == 1){
                            for(j=i;j>0;j-=1) {
                                if(actualDirection == 'north') {
                                    eval('posBoats'+boatLength).splice(eval('posBoats'+boatLength).length-1,1)
    
                                } else if(actualDirection == 'south') {
                                    eval('posBoats'+boatLength).splice(eval('posBoats'+boatLength).length-1,1)
    
                                } else if(actualDirection == 'west') {
                                    eval('posBoats'+boatLength).splice(eval('posBoats'+boatLength).length-1,1)
    
                                } else {
                                    eval('posBoats'+boatLength).splice(eval('posBoats'+boatLength).length-1,1)
                                }
                            }
                            placeNotFound = true;
                            break;
                        }
    
                    }
                }
                if(placeNotFound == false) { // transformer les cases non prises en cases prises

                    for (i=boatLength;i>0;i-=1) {
                        boxUnavailables.push(eval('posBoats'+boatLength)[eval('posBoats'+boatLength).length-i])
                        const posRandom = boxAvailables.indexOf(eval('posBoats'+boatLength)[eval('posBoats'+boatLength).length-i])
                        boxAvailables.splice(posRandom, 1)
                    }
                    
                } else {
                    eval('posBoats'+boatLength).splice(eval('posBoats'+boatLength).length-1,1) //reset le point random de départ
                    placeUnavailable.push(randomPoint);
                }
            }
    
            if(placeNotFound == true) {
                console.log('Aucune place trouvée, veuillez recharger un plateau !')
                if(gameStatus == 'solo') {
                    document.getElementById('principalText').innerHTML = "<span>ERR0R :<br />Unable to place the size "+boatLength+" boat number "+(boatLeft+1)+". Please reload the board by pressing \"Replay\" or reset.</span>"
                } else {
                    document.getElementById('principalText').innerHTML = "<span>ERR0R :<br />Unable to place the size "+boatLength+" boat number "+(boatLeft+1)+". Please reload the board by pressing \"Replay\" or reset.</span><span>(You will not have to replace your boats.)</span>"
                }
                
                showBoats('error');
                errorInBoard = true;
                break;
            } else;
        }
    }
    
    if (errorInBoard == false) {
        console.log('Positionnement des bateaux réussi !')
        if(gameStatus == 'solo') {
            totalBoats = posBoats5.length/5+posBoats4.length/4+posBoats3.length/3+posBoats2.length/2
            document.getElementById('principalText').innerHTML = "<span>Game started ! Click on the board above !</span><span>Boats left to find : "+totalBoats+"</span>"
        } else {
            document.getElementById('principalText').innerHTML = '<span>Game started ! Click on the board above !</span><span>Player remaining boats : '+totalBoats+'</span><span>Bot remaining boats : '+copyTotalBoats+'</span>'
        }
    }
    //si tous les bateaux ont été posé

    if (boatSizeAmount[0] !==0 || boatSizeAmount[1] !==0 || boatSizeAmount[2] !==0 || boatSizeAmount[3] !==0) {
        document.getElementById('confirmBoatAmount').style.opacity = '100%'
        allowConfirm = true;
    } else;
}

function playerPlaceBoats(id) { //fonction qui pose ou non le bateau lorsque le joueur clique sur une case, en fonction des instructions transmises par la variable playerSeeBoats
    if (gameStatus == 'inPlaceBot' || gameStatus == 'inPlaceP1' || gameStatus == 'inPlaceP2') {

        let trueVariable = ['botBoxUnavailables','bot','botBoard','botPosBoats',true]
        
        if(gameStatus == 'inPlaceP1') {
            trueVariable = ['boxUnavailables','','board','posBoats',false]
        }
        // trueVariable[0] = boxUnavailables
        // trueVariable[1] = début de l'id de la case
        // trueVariable[2] = quel tableau il faut modifier
        // trueVariable[3] = dans quelle variable il faut enregistrer la place du bateau
        // trueVariable[4] = sur le bon terrain

        if(boardOnBotBoard == trueVariable[4]) {
            if(boatCurrentlyPlaced == false) {
                let cantPlaceHere = false;
                for(i=0;i<eval(trueVariable[0]).length;i++) { //boucle pour détecter si la case qu'on clique est déjà occupée
                    if(id == eval(trueVariable[0])[i]) {
                        cantPlaceHere = true;
                    }
                }
                if(cantPlaceHere == false) { //mettre la case initiale du bateau
                    document.getElementById(trueVariable[1]+id).style.backgroundColor = '#ce0000'
                    document.getElementById(trueVariable[1]+id).innerHTML = '<span>Cancel</span>'
                    document.getElementsByClassName(trueVariable[2])[0].style.backgroundColor = 'white'
                    boatCurrentlyPlaced = true;
                    initialBoatPos = id;
                    for(i=1;i<=10;i++) {
                        if((initialBoatPos-(i)) % 10 == 0) {
                            initialPosX = i;
                            break;
                        }
                    }
                    for(i=1;i<=10;i++) {
                        if(initialBoatPos <= (i*10)) {
                            initialPosY = i;
                            break;
                        }
                    }
                }
            } else {
                if(id == initialBoatPos) { //si on clique sur la case Cancel
                    let color = 'lightseagreen'
                    if(gameStatus == 'inPlaceP2') {
                        color = 'royalblue'
                    }
                    document.getElementById(trueVariable[1]+id).style.backgroundColor = color
                    document.getElementById(trueVariable[1]+id).innerHTML = ''
                    document.getElementsByClassName(trueVariable[2])[0].style.backgroundColor = 'red'
                    boatCurrentlyPlaced = false;
                } else {
                    if(botCardinal != 'no') { //si on clique sur une case où le bateau peut se placer
                        if(botCardinal == 'north') {
                            for (i=0;i<boatLength;i++) {
                                eval(trueVariable[3]+boatLength).push(parseInt(initialBoatPos)-10*i)
                                eval(trueVariable[0]).push(parseInt(initialBoatPos)-10*i)
                            }
                        } else if (botCardinal == 'south') {
                            for (i=0;i<boatLength;i++) {
                                eval(trueVariable[3]+boatLength).push(parseInt(initialBoatPos)+10*i)
                                eval(trueVariable[0]).push(parseInt(initialBoatPos)+10*i)
                            }
                        } else if (botCardinal == 'west') {
                            for (i=0;i<boatLength;i++) {
                                eval(trueVariable[3]+boatLength).push(parseInt(initialBoatPos)-i)
                                eval(trueVariable[0]).push(parseInt(initialBoatPos)-i)
                            }
                        } else {
                            for (i=0;i<boatLength;i++) {
                                eval(trueVariable[3]+boatLength).push(parseInt(initialBoatPos)+i)
                                eval(trueVariable[0]).push(parseInt(initialBoatPos)+i)
                            }
                        }
                        boatCurrentlyPlaced = false
                        document.getElementById(trueVariable[1]+initialBoatPos).innerHTML = ''
                        document.getElementsByClassName(trueVariable[2])[0].style.backgroundColor = 'red'
                        document.getElementById('showBoats').style.opacity = '100%'
                        colorPlayerBoats(boatLength,initialBoatPos,trueVariable[1],botCardinal)
                        placesHistory.push(boatLength)
                        copyTotalBoats --;
                        copyBoatSizeAmount[boatLength-2]--;
                        if(copyBoatSizeAmount[0]+copyBoatSizeAmount[1]+copyBoatSizeAmount[2]+copyBoatSizeAmount[3]==0) { //si tous les bateaux ont été posés
                            document.getElementById('boatPreview').style.display = 'none'
                            document.getElementById('confirmBoatAmount').style.opacity = '100%'
                            document.getElementById('principalText').style.textAlign = 'center'
                            document.getElementById('retourConsole').style.justifyContent = 'center'
                            document.getElementsByClassName(trueVariable[2])[0].style.backgroundColor = 'white'
                            if(gameStatus == 'inPlaceBot') {
                                document.getElementById('principalText').innerHTML = '<span>Press "Play" to start !</span>'
                                gameStatus = 'placeBotOver'
                            } else if(gameStatus == 'inPlaceP1') {
                                document.getElementById('principalText').innerHTML = '<span>Press "Confirm boats" to start placing boats on the second board.</span>'
                                gameStatus = 'placeP1Over'
                            } else {
                                gameStatus = 'placeP2Over'
                                document.getElementById('principalText').innerHTML = '<span>Press "Confirm boats" to start playing !</span>'
                            }
    
                        } else {
                            for (i=copyBoatSizeAmount.length-1;i>=0;i--) { //boucle pour connaitre quelle est la longueur du prochain bateau à placer
                                if(copyBoatSizeAmount[i] > 0) {
                                    boatLength = i+2;
                                    break;
                                }
                            }

                            if(gameStatus == 'inPlaceBot') {
                                document.getElementById('principalText').innerHTML = '<span>Please place the size '+boatLength+' boat on the board.</span><span>Boats remaining : '+copyTotalBoats+'</span>'
                            } else if(gameStatus == 'inPlaceP1') {
                                document.getElementById('principalText').innerHTML = '<span>Player 1 turn :</span><span>Please place the size '+boatLength+' boat on the board.</span><span>Boats remaining : '+copyTotalBoats+'</span>'
                            } else {
                                document.getElementById('principalText').innerHTML = '<span>Player 2 turn :</span><span>Please place the size '+boatLength+' boat on the board.</span><span>Boats remaining : '+copyTotalBoats+'</span>'
                            }
                            document.getElementById('boatPreview').style.backgroundImage = 'url("img/boat-all/'+boatLength+'boat-all.png")'
                            //changer l'image du bateau à placer
                        }
                        initialBoatPos = ''
                        botCardinal = 'no' //important de remettre le botCardinal à 'no' pour ne pas que les bandes orange s'affolent quand on clique sur une autre case après
                    }
                }
            }
        }
        
    } else if(gameStatus == '2players') {
        clickCase(id);
        return;
    } else;
}

function playerSeeBoats(id) { //fonction qui calcule si la case que touche le joueur est compatible avec la pose du bateau
    if(actualGamemode == 'inPlace') {
        
        if(boatCurrentlyPlaced == true) {

            let trueVariable = ['botBoxUnavailables','bot','botBoard','botPosBoats',true]
            if(gameStatus == 'inPlaceP1') {
                trueVariable = ['boxUnavailables','','board','posBoats',false]
            }

            if(boardOnBotBoard == trueVariable[4]) {
                let currentPosX;
                let currentPosY;
                for(i=1;i<=10;i++) {
                    if((id-(i)) % 10 == 0) {
                        currentPosX = i;
                        break;
                    }
                }
                for(i=1;i<=10;i++) {
                    if(id <= (i*10)) {
                        currentPosY = i;
                        break;
                    }
                }
                let boatPlaceable = true;
                let newCardinal = 'no';
    
                if(currentPosX == initialPosX) {
                    if (currentPosY < initialPosY) { //si on se trouve sur une case au nord
        
                        if(initialBoatPos <= ((boatLength-1)*10)) {
                            boatPlaceable = false;
                        } else {
                            for(i=1;i<boatLength;i++) {
                                if(boatPlaceable == true) {
                                    for(j=0;j<eval(trueVariable[0]).length;j++) {
                                        if(parseInt(initialBoatPos)-(i*10)==eval(trueVariable[0])[j]) {
                                            boatPlaceable = false;
                                            break;
                                        }
                                    }
                                } else {
                                    break;
                                }
                            }
                        }
                        if(boatPlaceable == true) {
                            for(i=1;i<boatLength;i++) {
                                document.getElementById(trueVariable[1]+(initialBoatPos-(10*i))).style.backgroundColor = '#ffb835'
                            }
                            newCardinal = 'north'
                        } else;
        
                    } else if (currentPosY > initialPosY) { //si on se trouve sur une case au sud
        
                        if(initialBoatPos > 100-((boatLength-1)*10)) {
                            boatPlaceable = false;
                        } else {
                            for(i=1;i<boatLength;i++) {
                                if(boatPlaceable == true) {
                                    for(j=0;j<eval(trueVariable[0]).length;j++) {
                                        if(parseInt(initialBoatPos)+(i*10)==eval(trueVariable[0])[j]) {
                                            boatPlaceable = false;
                                            break;
                                        }
                                    }
                                } else {
                                    break;
                                }
                            }
                        }
                        if(boatPlaceable == true) {
                            for(i=1;i<boatLength;i++) {
                                let realID = parseInt(initialBoatPos)+10*i
                                document.getElementById(trueVariable[1]+realID).style.backgroundColor = '#ffb835'
                            }
                            newCardinal = 'south'
                        } else;
                    }
    
                } else if (currentPosY == initialPosY) {
    
                    if (currentPosX<initialPosX) { //si on se trouve sur une case à l'ouest
        
                        for(i=1;i<boatLength;i++) {
                            if((initialBoatPos-i) % 10 == 0) {
                                boatPlaceable = false;
                                break;
                            }
                        }
                        if(boatPlaceable == true) {
                            for(i=1;i<boatLength;i++) {
                                if(boatPlaceable == true) {
                                    for(j=0;j<eval(trueVariable[0]).length;j++) {
                                        if(parseInt(initialBoatPos)-i==eval(trueVariable[0])[j]) {
                                            boatPlaceable = false;
                                            break;
                                        }
                                    }
                                } else {
                                    break;
                                }
                            }
                        }
                        if(boatPlaceable == true) {
                            for(i=1;i<boatLength;i++) {
                                document.getElementById(trueVariable[1]+(initialBoatPos-i)).style.backgroundColor = '#ffb835'
                            }
                            newCardinal = 'west'
                        } else;
    
                    } else { //si on se trouve sur une case à l'est
    
                        for (i=1;i<boatLength;i++) {
                            if ((parseInt(initialBoatPos)+(i-1)) % 10 == 0) {
                                boatPlaceable = false;
                                break;
                            }
                        }
                        if(boatPlaceable == true) {
                            for(i=1;i<boatLength;i++) {
                                if(boatPlaceable == true) {
                                    for(j=0;j<eval(trueVariable[0]).length;j++) {
                                        if(parseInt(initialBoatPos)+i==eval(trueVariable[0])[j]) {
                                            boatPlaceable = false;
                                            break;
                                        }
                                    }
                                } else {
                                    break;
                                }
                            }
                        }
                        if(boatPlaceable == true) {
                            for(i=1;i<boatLength;i++) {
                                let realID = parseInt(initialBoatPos)+i
                                document.getElementById(trueVariable[1]+realID).style.backgroundColor = '#ffb835'
                            }
                            newCardinal = 'east'
                        } else;
    
                    }
    
                } else;
    
                if(newCardinal != botCardinal) {
                    eraseOrange();
                }
                //reset les couleurs orange en bleu si c'est nécessaire
                botCardinal = newCardinal
            }
        }
    }
}

function colorPlayerBoats(boatLength,id,board,cardinal) { //rend visible les bateaux que le joeur pose
    let color = 'lightseagreen'
    if(gameStatus == 'inPlaceP2') {
        color = 'royalblue'
    }

    if(cardinal == 'north') {
        for (i=0;i<boatLength;i++) {
            let realID = id-i*10
            document.getElementById(board+realID).style.backgroundColor = color
            document.getElementById(board+realID).style.backgroundImage = 'url("img/'+boatLength+'boat-'+(boatLength-i)+'-'+cardinal+'.png")'
        }
    } else if (cardinal == 'south') {
        for (i=0;i<boatLength;i++) {
            let realID = parseInt(id)+10*i
            document.getElementById(board+realID).style.backgroundColor = color
            document.getElementById(board+realID).style.backgroundImage = 'url("img/'+boatLength+'boat-'+(boatLength-i)+'-'+cardinal+'.png")'
        }
    } else if (cardinal == 'west') {
        for (i=0;i<boatLength;i++) {
            let realID = id-i
            document.getElementById(board+realID).style.backgroundColor = color
            document.getElementById(board+realID).style.backgroundImage = 'url("img/'+boatLength+'boat-'+(boatLength-i)+'-'+cardinal+'.png")'
        }
    } else {
        for (i=0;i<boatLength;i++) {
            let realID = parseInt(id)+i
            document.getElementById(board+realID).style.backgroundColor = color
            document.getElementById(board+realID).style.backgroundImage = 'url("img/'+boatLength+'boat-'+(boatLength-i)+'-'+cardinal+'.png")'
        }
    }
}

function eraseOrange() { //efface les barres orange qui apparaissent lorsque le joueur veut poser un bateau
    let IDBoard; //permet de savoir quel board il faut modifier
    let color = 'lightseagreen' //savoir en quelle couleur il faut changer les bandes orange

    if(gameStatus == 'inPlaceP1') {
        IDBoard = ''
    } else {
        IDBoard = 'bot'
        if(gameStatus == 'inPlaceP2') {
            color = 'royalblue'
        }
    }
    if(botCardinal == 'north') {
        for(i=1;i<boatLength;i++) {
            document.getElementById(IDBoard+(initialBoatPos-(10*i))).style.backgroundColor = color
        }
    } else if(botCardinal == 'south') {
        for(i=1;i<boatLength;i++) {
            let realID = parseInt(initialBoatPos)+(10*i)
            document.getElementById(IDBoard+realID).style.backgroundColor = color
        }
    } else if (botCardinal == 'west') {
        for(i=1;i<boatLength;i++) {
            document.getElementById(IDBoard+(initialBoatPos-i)).style.backgroundColor = color
        }
    } else if (botCardinal == 'east') {
        for(i=1;i<boatLength;i++) {
            let realID = parseInt(initialBoatPos)+i
            document.getElementById(IDBoard+realID).style.backgroundColor = color
        }
    } else;
}

function buttonShowBoats() { //fonction qui détermine l'action que va faire le bouton showBoats en fonction de l'état du jeu
    if(actualGamemode == 'inPlace') { //quand le bouton a une fonction d'annuler le dernier
        if(placesHistory.length>0) {

            let trueVariable = ['botBoxUnavailables','bot','botBoard','botPosBoats']
            if(gameStatus == 'inPlaceP1' || gameStatus == 'placeP1Over') {
                trueVariable = ['boxUnavailables','','board','posBoats']
            }

            switch (gameStatus) { //revenir au statut de jeu précédent
                case 'placeBotOver' :
                    gameStatus = 'inPlaceBot'
                    break;
                case 'placeP1Over' :
                    gameStatus = 'inPlaceP1'
                    break;
                case 'placeP2Over' :
                    gameStatus = 'inPlaceP2'
                    break;
            }

            let color = 'lightseagreen'
            if(gameStatus == 'inPlaceP2') {
                color = 'royalblue'
            }

            document.getElementById('confirmBoatAmount').style.opacity = '20%'
            document.getElementsByClassName(trueVariable[2])[0].style.backgroundColor = 'red'
            let getBoatSize = placesHistory[placesHistory.length-1]
            for (i=0;i<getBoatSize;i++) {
                let getID = eval(trueVariable[3]+getBoatSize)[eval(trueVariable[3]+getBoatSize).length-1]
                document.getElementById(trueVariable[1]+getID).style.backgroundColor = color
                document.getElementById(trueVariable[1]+getID).style.backgroundImage = 'none'
                eval(trueVariable[0]).splice(eval(trueVariable[0]).length-1,1)
                eval(trueVariable[3]+getBoatSize).splice(eval(trueVariable[3]+getBoatSize).length-1,1)
            }
            copyBoatSizeAmount[getBoatSize-2]++;

            for (i=copyBoatSizeAmount.length-1;i>=0;i--) {
                if(copyBoatSizeAmount[i] > 0) {
                    boatLength = i+2;
                    break;
                }
            }
            copyTotalBoats++;
            if(copyTotalBoats == totalBoats) {
                document.getElementById('showBoats').style.opacity = '20%'
            }
            document.getElementById('principalText').style.textAlign = 'left'
            document.getElementById('retourConsole').style.justifyContent = 'left'
            document.getElementById('boatPreview').style.display = 'block'
            if(gameStatus == 'inPlaceBot') {
                document.getElementById('principalText').innerHTML = '<span>Please place the size '+boatLength+' boat on the board.</span><span>Boats remaining : '+copyTotalBoats+'</span>'
            } else if(gameStatus == 'inPlaceP1') {
                document.getElementById('principalText').innerHTML = '<span>Player 1 turn :</span><span>Please place the size '+boatLength+' boat on the board.</span><span>Boats remaining : '+copyTotalBoats+'</span>'
            } else {
                document.getElementById('principalText').innerHTML = '<span>Player 2 turn :</span><span>Please place the size '+boatLength+' boat on the board.</span><span>Boats remaining : '+copyTotalBoats+'</span>'
            }
            document.getElementById('boatPreview').style.backgroundImage = 'url("img/boat-all/'+boatLength+'boat-all.png")'
            placesHistory.splice(placesHistory.length-1)
        }
    } else {
        if(gameStatus != 'no') {
            showBoats('button')
        }
    }
}

function showBoats(gameMoment) { //fait apparaître tous les bateaux lorsqu'on clique sur le bouton "Show Boats" ou lorsque la partie est finie.
    
    if(gameMoment == 'button') {
        if(gameStatus == 'solo') {
            document.getElementById('principalText').innerHTML = '<span>Player gave up, press "Replay" to restart a game.</span>'
        } else if( gameStatus == 'bot'){
            document.getElementById('principalText').innerHTML = '<span>Player forfeited, press "Replay" to restart a game (you will not have to replace your boats).</span>'
        } else {
            document.getElementById('principalText').innerHTML = '<span>Game stopped. Press "Replay" to restart a game.</span>'
        }
    }

    if(gameMoment != 'vsbotwin') {
        for(i=0;i<totalBox.length;i++) {
            document.getElementById(totalBox[i]).style.backgroundColor = 'lightseagreen'
            document.getElementById('mini'+totalBox[i]).style.backgroundColor = 'lightseagreen'
            if(gameStatus == '2players') { 
                document.getElementById('bot'+totalBox[i]).style.backgroundColor = 'royalblue'
                document.getElementById('minibot'+totalBox[i]).style.backgroundColor = 'royalblue'
            } else {
                document.getElementById('bot'+totalBox[i]).style.backgroundColor = 'lightseagreen'
                document.getElementById('minibot'+totalBox[i]).style.backgroundColor = 'lightseagreen'
            }
        }
    }
    
    if(gameMoment != 'botBoardOnly') {
        for(i=2;i<=5;i++) { // i= taille du bateau
            for(j=0;j<(eval('posBoats'+i).length)/i;j++) { // j= nombre total de bateau de la même taille
                if(eval('posBoats'+i)[j*i] == eval('posBoats'+i)[j*i+1]+10) { //si la 1ere case du bateau est égale à la deuxième case du bateau+10, c'est que la première case se situe sur la ligne en-dessous donc le bateau va au nord
                    for(k=0;k<i;k++) { //k = id de chaque partie de bateau
                        document.getElementById(eval('posBoats'+i)[i*j+k]).style.backgroundImage = 'url("img/'+i+'boat-'+parseInt(i-k)+'-north.png")'
                        document.getElementById('mini'+eval('posBoats'+i)[i*j+k]).style.backgroundImage = 'url("img/'+i+'boat-'+parseInt(i-k)+'-north.png")'
                        document.getElementById(eval('posBoats'+i)[i*j+k]).style.backgroundColor = 'lightseagreen'
                        document.getElementById('mini'+eval('posBoats'+i)[i*j+k]).style.backgroundColor = 'lightseagreen'

                    }
                } else if (eval('posBoats'+i)[j*i] == eval('posBoats'+i)[j*i+1]-10) {
                    for(k=0;k<i;k++) {
                        document.getElementById(eval('posBoats'+i)[i*j+k]).style.backgroundImage = 'url("img/'+i+'boat-'+parseInt(i-k)+'-south.png")'
                        document.getElementById('mini'+eval('posBoats'+i)[i*j+k]).style.backgroundImage = 'url("img/'+i+'boat-'+parseInt(i-k)+'-south.png")'
                        document.getElementById(eval('posBoats'+i)[i*j+k]).style.backgroundColor = 'lightseagreen'
                        document.getElementById('mini'+eval('posBoats'+i)[i*j+k]).style.backgroundColor = 'lightseagreen'
                    }
                } else if (eval('posBoats'+i)[j*i] == eval('posBoats'+i)[j*i+1]+1) {
                    for(k=0;k<i;k++) {
                        document.getElementById(eval('posBoats'+i)[i*j+k]).style.backgroundImage = 'url("img/'+i+'boat-'+parseInt(i-k)+'-west.png")'
                        document.getElementById('mini'+eval('posBoats'+i)[i*j+k]).style.backgroundImage = 'url("img/'+i+'boat-'+parseInt(i-k)+'-west.png")'
                        document.getElementById(eval('posBoats'+i)[i*j+k]).style.backgroundColor = 'lightseagreen'
                        document.getElementById('mini'+eval('posBoats'+i)[i*j+k]).style.backgroundColor = 'lightseagreen'
                    }
                } else {
                    for(k=0;k<i;k++) {
                        document.getElementById(eval('posBoats'+i)[i*j+k]).style.backgroundImage = 'url("img/'+i+'boat-'+parseInt(i-k)+'-east.png")'
                        document.getElementById('mini'+eval('posBoats'+i)[i*j+k]).style.backgroundImage = 'url("img/'+i+'boat-'+parseInt(i-k)+'-east.png")'
                        document.getElementById(eval('posBoats'+i)[i*j+k]).style.backgroundColor = 'lightseagreen'
                        document.getElementById('mini'+eval('posBoats'+i)[i*j+k]).style.backgroundColor = 'lightseagreen'
                    }
                }
            }
        }
    }

    if(actualGamemode != 'solo') {
        for(i=2;i<=5;i++) { // i= taille du bateau
            for(j=0;j<(eval('botPosBoats'+i).length)/i;j++) { // j= nombre total de bateau de la même taille
                if(eval('botPosBoats'+i)[j*i] == eval('botPosBoats'+i)[j*i+1]+10) { //si la 1ere case du bateau est égale à la deuxième case du bateau+10, c'est que la première case se situe sur la ligne en-dessous donc le bateau va au nord
                    for(k=0;k<i;k++) { //k = id de chaque partie de bateau
                        document.getElementById('bot'+eval('botPosBoats'+i)[i*j+k]).style.backgroundImage = 'url("img/'+i+'boat-'+parseInt(i-k)+'-north.png")'
                        document.getElementById('minibot'+eval('botPosBoats'+i)[i*j+k]).style.backgroundImage = 'url("img/'+i+'boat-'+parseInt(i-k)+'-north.png")'
                    }
                } else if (eval('botPosBoats'+i)[j*i] == eval('botPosBoats'+i)[j*i+1]-10) {
                    for(k=0;k<i;k++) {
                        document.getElementById('bot'+eval('botPosBoats'+i)[i*j+k]).style.backgroundImage = 'url("img/'+i+'boat-'+parseInt(i-k)+'-south.png")'
                        document.getElementById('minibot'+eval('botPosBoats'+i)[i*j+k]).style.backgroundImage = 'url("img/'+i+'boat-'+parseInt(i-k)+'-south.png")'
                    }
                } else if (eval('botPosBoats'+i)[j*i] == eval('botPosBoats'+i)[j*i+1]+1) {
                    for(k=0;k<i;k++) {
                        document.getElementById('bot'+eval('botPosBoats'+i)[i*j+k]).style.backgroundImage = 'url("img/'+i+'boat-'+parseInt(i-k)+'-west.png")'
                        document.getElementById('minibot'+eval('botPosBoats'+i)[i*j+k]).style.backgroundImage = 'url("img/'+i+'boat-'+parseInt(i-k)+'-west.png")'
                    }
                } else {
                    for(k=0;k<i;k++) {
                        document.getElementById('bot'+eval('botPosBoats'+i)[i*j+k]).style.backgroundImage = 'url("img/'+i+'boat-'+parseInt(i-k)+'-east.png")'
                        document.getElementById('minibot'+eval('botPosBoats'+i)[i*j+k]).style.backgroundImage = 'url("img/'+i+'boat-'+parseInt(i-k)+'-east.png")'
                    }
                }
            }
        }
    }
    gameStatus = 'no'
}
//hacked by MalAlpha}

function clickCase(id) { //code qui se fait lorsqu'on clique sur une case lors d'une partie
    console.log(id)
    if (gameStatus != 'no') { //checker si le joueur est en pleine partie

        if(gameStatus == 'inPlaceP1') {
            playerPlaceBoats(id);
            return;
        }
        if(gameStatus == '2players') {
            if(boardOnBotBoard == true && p1Turn == false) {
                return;
            } else if(boardOnBotBoard == false && p1Turn == true) {
                return;
            }
            else;
        }

        let trueSaveClickedBox = 'saveClickedBox'
        if(gameStatus == '2players' && p1Turn == true) { //check s'il faut vérifier les cases trouvées par le joueur 1 ou 2
            trueSaveClickedBox = 'saveClickedBox2'
        }

        let pieceAlreadyClicked = false;
        for(i=0;i<eval(trueSaveClickedBox).length;i++) {
            if(id == eval(trueSaveClickedBox)[i]) {
                pieceAlreadyClicked = true;
                break;
            }
        }
        if(pieceAlreadyClicked == false) { //check si la case a déjà été cliquée

            if(gameStatus=='solo') {
                clickCalculs('player',id);

            } else if(gameStatus == '2players') {
                clickCalculs('player',id)

            } else if(gameStatus == 'bot') { //si le joueur est en train de jouer contre un bot
                clickCalculs('player',id);
                clickCalculs('bot',botNextPlay)

                newEmptyBox();

                if(totalBoats == 0 || copyTotalBoats == 0) { //si la partie est gagnée pour un des deux joueurs
                    
                    if (copyTotalBoats == 0){
                        document.getElementById('principalText').innerHTML = '<span>Bot win ! Try again !</span><span>Press Replay to play on a new board (you will not have to replace your boats).</span>'
                        swapBoards();
                    }
                    if(totalBoats == 0) {
                        document.getElementById('principalText').innerHTML = '<span>Player win !</span><span>Press Replay to play on a new board (you will not have to replace your boats).</span>'
                        for (i=0; i<boxAvailables.length;i++) {
                            document.getElementById(boxAvailables[i]).style.backgroundColor = "lightseagreen"
                            document.getElementById('mini'+boxAvailables[i]).style.backgroundColor = "lightseagreen"
                        }
                    }
                    if(totalBoats == copyTotalBoats) {
                        document.getElementById('principalText').innerHTML = '<span>Draw ! Both Player and Bot win !</span><span>Press Replay to play on a new board (you will not have to replace your boats).</span>'
                        swapBoards();
                    }
                    showBoats('vsbotwin')
                    return;

                } else if(botMemory.length >0) { // si le bot a trouvé une case de bateau
                    if(botMemory.length == 1) { //si le bot n'a trouvé qu'une seule case de bateau

                        let randomDir = Math.floor(4*Math.random())
                        let cardinalTab = ['north','south','west','east']
                        botDirection = cardinalTab[randomDir]
                        //donner une direction aléatoire au bot s'il ne sait pas par où aller
                    }

                    if(botDirection == 'west') {
                        let randomDir = Math.floor(3*Math.random())
                        if(randomDir == 0) {
                            botDirection = 'east'
                        } else;

                    } else if(botDirection == 'east') {
                        let randomDir = Math.floor(3*Math.random())
                        if(randomDir == 0) {
                            botDirection = 'west'
                        } else;

                    } else if(botDirection == 'north') {
                        let randomDir = Math.floor(3*Math.random())
                        if(randomDir == 0) {
                            botDirection = 'south'
                        } else;

                    } else if(botDirection == 'south') {
                        let randomDir = Math.floor(3*Math.random())
                        if(randomDir == 0) {
                            botDirection = 'north'
                        } else;

                    } else;
                    //déterminer dans quelle direction autour du bateau le bot va aller pour choisir une case s'il a trouvé un bout de bateau. Il y a 1/3 chance que le bot aille dans le sens opposé au sens de départ
                    
                    let posFound = false;
                    let secondDirectionChoice = false; //permet de connaître si a tester d'aller dans la direction opposée avant d'aller dans la direction actuelle
                    botNextPlay = botMemory[0]
                    while( posFound == false ) {
                        if(botDirection == 'west') {

                            if((botNextPlay-1) % 10 == 0) {
                                if(secondDirectionChoice == false) {
                                    botDirection = 'east'
                                    secondDirectionChoice = true;

                                } else {
                                    let randomDir = Math.floor(2*Math.random())
                                    if(randomDir == 0) {
                                        botDirection = 'north'
                                    } else {
                                        botDirection = 'south'
                                    }
                                    secondDirectionChoice = false;
                                }
                                botNextPlay = botMemory[0]
                            //savoir si la case se trouve sur le bord gauche du terrain
                            
                            } else {
                                botNextPlay = botNextPlay-1
                                posFound = true
                                for(i=0;i<botBoxEmpty.length;i++) {

                                    if(botNextPlay == botBoxEmpty[i]) {
                                        if(secondDirectionChoice == false) {
                                            botDirection = 'east'
                                            secondDirectionChoice = true;
        
                                        } else {
                                            let randomDir = Math.floor(2*Math.random())
                                            if(randomDir == 0) {
                                                botDirection = 'north'
                                            } else {
                                                botDirection = 'south'
                                            }
                                            secondDirectionChoice = false;
                                        }
                                        botNextPlay = botMemory[0]
                                        posFound = false;
                                        break;
                                    }
                                }
                                if(posFound == true) {
                                    for(i=0;i<botMemory.length;i++) {
                                        if(botNextPlay == botMemory[i]) {
                                            posFound = false
                                            break;
                                        }
                                    }
                                }
                            }

                        } else if (botDirection == 'east') {

                            if(botNextPlay % 10 == 0) {
                                if(secondDirectionChoice == false) {
                                    botDirection = 'west'
                                    secondDirectionChoice = true;

                                } else {
                                    let randomDir = Math.floor(2*Math.random())
                                    if(randomDir == 0) {
                                        botDirection = 'north'
                                    } else {
                                        botDirection = 'south'
                                    }
                                    secondDirectionChoice = false;
                                }
                                botNextPlay = botMemory[0]
                            //savoir si la case se trouve sur le bord droit du terrain
                            
                            } else {
                                botNextPlay = botNextPlay+1
                                posFound = true
                                for(i=0;i<botBoxEmpty.length;i++) {

                                    if(botNextPlay == botBoxEmpty[i]) {
                                        if(secondDirectionChoice == false) {
                                            botDirection = 'west'
                                            secondDirectionChoice = true;
        
                                        } else {
                                            let randomDir = Math.floor(2*Math.random())
                                            if(randomDir == 0) {
                                                botDirection = 'north'
                                            } else {
                                                botDirection = 'south'
                                            }
                                            secondDirectionChoice = false;
                                        }
                                        botNextPlay = botMemory[0]
                                        posFound = false;
                                        break;
                                    }
                                }
                                if(posFound == true) {
                                    for(i=0;i<botMemory.length;i++) {
                                        if(botNextPlay == botMemory[i]) {
                                            posFound = false
                                            break;
                                        }
                                    }
                                }
                            }

                        } else if (botDirection == 'north') {

                            if(botNextPlay <= 10) {
                                if(secondDirectionChoice == false) {
                                    botDirection = 'south'
                                    secondDirectionChoice = true;

                                } else {
                                    let randomDir = Math.floor(2*Math.random())
                                    if(randomDir == 0) {
                                        botDirection = 'west'
                                    } else {
                                        botDirection = 'east'
                                    }
                                    secondDirectionChoice = false;
                                }
                                botNextPlay = botMemory[0]
                            //savoir si la case se trouve sur le bord haut du terrain
                            
                            } else {
                                botNextPlay = botNextPlay-10
                                posFound = true
                                for(i=0;i<botBoxEmpty.length;i++) {

                                    if(botNextPlay == botBoxEmpty[i]) {
                                        if(secondDirectionChoice == false) {
                                            botDirection = 'south'
                                            secondDirectionChoice = true;
        
                                        } else {
                                            let randomDir = Math.floor(2*Math.random())
                                            if(randomDir == 0) {
                                                botDirection = 'west'
                                            } else {
                                                botDirection = 'east'
                                            }
                                            secondDirectionChoice = false;
                                        }
                                        botNextPlay = botMemory[0]
                                        posFound = false;
                                        break;
                                    }
                                }
                                if(posFound == true) {
                                    for(i=0;i<botMemory.length;i++) {
                                        if(botNextPlay == botMemory[i]) {
                                            posFound = false
                                            break;
                                        }
                                    }
                                }
                            }

                        } else {

                            if(botNextPlay > 90) {
                                if(secondDirectionChoice == false) {
                                    botDirection = 'north'
                                    secondDirectionChoice = true;

                                } else {
                                    let randomDir = Math.floor(2*Math.random())
                                    if(randomDir == 0) {
                                        botDirection = 'west'
                                    } else {
                                        botDirection = 'east'
                                    }
                                    secondDirectionChoice = false;
                                }
                                botNextPlay = botMemory[0]
                            //savoir si la case se trouve sur le bord bas du terrain
                            
                            } else {
                                botNextPlay = botNextPlay+10
                                posFound = true
                                for(i=0;i<botBoxEmpty.length;i++) {

                                    if(botNextPlay == botBoxEmpty[i]) {
                                        if(secondDirectionChoice == false) {
                                            botDirection = 'north'
                                            secondDirectionChoice = true;
        
                                        } else {
                                            let randomDir = Math.floor(2*Math.random())
                                            if(randomDir == 0) {
                                                botDirection = 'west'
                                            } else {
                                                botDirection = 'east'
                                            }
                                            secondDirectionChoice = false;
                                        }
                                        botNextPlay = botMemory[0]
                                        posFound = false;
                                        break;
                                    }
                                }
                                if(posFound == true) {
                                    for(i=0;i<botMemory.length;i++) {
                                        if(botNextPlay == botMemory[i]) {
                                            posFound = false
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }

                } else { //si le bot n'a pas trouvé de case bateau
                    let randomPos = Math.floor(botBoxLeft.length*Math.random())
                    botNextPlay = botBoxLeft[randomPos]
                    botDirection = 'no'
                }

                console.log('Next play : '+botNextPlay)
                console.log('Bot direction : '+botDirection)

            } else;

        }else;
    }
    
}

function clickCalculs(who,id) {

    let stopSearch = false; //stoppe la recherche si l'id est trouvé dans un tableau "posBoats (ou "botPosBoats").

    if(who == 'player') {

        let trueVariable = ['','posBoats','','lightseagreen','rgb(23, 128, 122)']
        //trueVariable[0] : changer les id qui finissent par un 2 (savedClickedBox2,boatFound2)
        //trueVariable[1] : changer dans quel type de tableau posBoats il faut chercher
        //trueVariable[2] : quel type de case il faut changer
        //trueVariable[3] : quelle couleur de fond il faut mettre si tout le bateau a été touché
        //trueVariable[4] : quelle couleur quand on a cliqué sur une case vide

        if(gameStatus == '2players' && p1Turn == true) {
            trueVariable = ['2','botPosBoats','bot','royalblue','rgb(40, 82, 209)']
        }

        eval('saveClickedBox'+trueVariable[0]).push(id) //sauvegarde la case en tant que case déjà cliquée
    
        for (let boatSize=5;boatSize>=2;boatSize--) { //boucle pour chaque type de bateau
    
            for(let idPosition=0;idPosition<eval(trueVariable[1]+boatSize).length;idPosition++) { //boucle pour chercher si l'id est dans le tableau des bateaux
                if(id == eval(trueVariable[1]+boatSize)[idPosition]) {
                    eval('boatFound'+trueVariable[0]).push(id);
                    document.getElementById(trueVariable[2]+id).style.backgroundColor = "darkred"
                    if(gameStatus != 'solo') {
                        document.getElementById('mini'+trueVariable[2]+id).style.backgroundColor = "darkred"
                    } else {
                        playerScore--;
                        if(playerScore < 0) { //éviter d'avoir un score négatif. Dans la vie il vaut mieux rester positif.
                            playerScore = 0; 
                        }
                    }
                    let allBoatDestroyed = true;
    
                    for (piecePosition=0;piecePosition<boatSize;piecePosition++) { //boucle qui cherche à quelle partie du bateau l'id appartient
                        if((idPosition-piecePosition) % boatSize == 0) {
                            for (k=0;k<boatSize;k++) { //boucle qui vérifie si toutes les autres parties du bateau ont été touchées
                                let boatPartAlsoTouched = false;
    
                                for(l=0;l<eval('boatFound'+trueVariable[0]).length;l++) { //boucle qui check toutes les pièces de bateau touchées
                                    if (eval(trueVariable[1]+boatSize)[(idPosition-piecePosition)+k] == eval('boatFound'+trueVariable[0])[l]) {
                                        boatPartAlsoTouched = true;
                                        break;
                                    }
                                }
                                if(boatPartAlsoTouched == false) {
                                    allBoatDestroyed = false;
                                    break;
                                }
                            }
    
                            if(allBoatDestroyed == true) {

                                let boatCardinal;
                                if(eval(trueVariable[1]+boatSize)[idPosition-piecePosition] == eval(trueVariable[1]+boatSize)[idPosition-piecePosition+1]+10) {
                                    boatCardinal = 'north'
                                } else if (eval(trueVariable[1]+boatSize)[idPosition-piecePosition] == eval(trueVariable[1]+boatSize)[idPosition-piecePosition+1]-10) {
                                    boatCardinal = 'south'
                                } else if (eval(trueVariable[1]+boatSize)[idPosition-piecePosition] == eval(trueVariable[1]+boatSize)[idPosition-piecePosition+1]+1) {
                                    boatCardinal = 'west'
                                } else {
                                    boatCardinal = 'east'
                                }
                                //connaître dans quelle direction va le bateau à l'aide de la position de ses 2 premières cases
    
                                for (i=0;i<boatSize;i++) {
                                    document.getElementById(trueVariable[2]+eval(trueVariable[1]+boatSize)[idPosition-piecePosition+i]).style.backgroundColor = trueVariable[3]
                                    document.getElementById(trueVariable[2]+eval(trueVariable[1]+boatSize)[idPosition-piecePosition+i]).style.backgroundImage = 'url("img/'+boatSize+'boat-'+(boatSize-i)+'-'+boatCardinal+'.png")'
                                }
                                if (gameStatus != 'solo') {
                                    for (i=0;i<boatSize;i++) {
                                        document.getElementById('mini'+trueVariable[2]+eval(trueVariable[1]+boatSize)[idPosition-piecePosition+i]).style.backgroundColor = trueVariable[3]
                                        document.getElementById('mini'+trueVariable[2]+eval(trueVariable[1]+boatSize)[idPosition-piecePosition+i]).style.backgroundImage = 'url("img/'+boatSize+'boat-'+(boatSize-i)+'-'+boatCardinal+'.png")'
                                    }
                                }
                                //placer les images de bateau

                                if(gameStatus == '2players' && p1Turn == true) {
                                    copyTotalBoats--;
                                } else {
                                    totalBoats--;
                                }
                            }
                            break;
                        }
                    }
                    stopSearch = true;
                    break;
                }
            }

            if(stopSearch == true && gameStatus != 'bot') { //si on a trouvé que l'id correspondait à un bateau
                if(eval('boatFound'+trueVariable[0]).length == boxUnavailables.length) { //si tous les bateaux ont été trouvés

                    if(gameStatus == 'solo') {
                        if (playerScore > highscoreSolo) {
                            highscoreSolo = playerScore;
                            document.getElementById('principalText').innerHTML = '<span>Game won ! Score : '+playerScore+'</span><span>New highscore !'
                        } else {
                            document.getElementById('principalText').innerHTML = '<span>Game won ! Score : '+playerScore+'</span><span>Highscore : '+highscoreSolo+'</span>'
                        }
                        for (i=0; i<boxAvailables.length;i++) {
                            document.getElementById(trueVariable[2]+boxAvailables[i]).style.backgroundColor = trueVariable[3]
                        }
                    } else {
                        if(p1Turn == true) {
                            document.getElementById('principalText').innerHTML = '<span>Player 1 win !!!</span><span>Player 2 remaining boats : '+totalBoats+'</span>'
                        } else {
                            document.getElementById('principalText').innerHTML = '<span>Player 2 win !!!</span><span>Player 1 remaining boats : '+copyTotalBoats+'</span>'
                        }
                        showBoats('2players')
                    }
                    gameStatus = 'no';
                }
                break;
            }
        }
        if (stopSearch == false) {
            document.getElementById(trueVariable[2]+id).style.backgroundColor = trueVariable[4]
            if(gameStatus !='solo') {
                document.getElementById('mini'+trueVariable[2]+id).style.backgroundColor = trueVariable[4]
            } else {
                playerScore-= 2;
            }
        }
        if(gameStatus == 'solo') {
            document.getElementById('principalText').innerHTML = "<span>Boats left to find : "+totalBoats+"</span>"
        }
        if(gameStatus == '2players') {
            allowConfirm = false; //éviter d'appuyer sur le bouton replay
            gameStatus = 'no' //permet d'éviter que les joueurs cliquent plusieurs fois sur le terrain
            noReset = true;
            setTimeout(() => {
                swapBoards();
                if(p1Turn == false) {
                    p1Turn = true;
                    document.getElementById('principalText').innerHTML = '<span>Player 1 turn !</span><span>Player 1 remaining boats : '+totalBoats+'</span><span>Player 2 remaining boats : '+copyTotalBoats
                } else {
                    p1Turn = false;
                    document.getElementById('principalText').innerHTML = '<span>Player 2 turn !</span><span>Player 1 remaining boats : '+totalBoats+'</span><span>Player 2 remaining boats : '+copyTotalBoats
                }

                if (boatSizeAmount[0] !==0 || boatSizeAmount[1] !==0 || boatSizeAmount[2] !==0 || boatSizeAmount[3] !==0) {
                    allowConfirm = true;
                }
                noReset = false;
                gameStatus = '2players'
            }, 1000);
        }

    } else if (who == 'bot') {
        
        const searchID = botBoxLeft.indexOf(id)
        botBoxLeft.splice(searchID,1)

        for (let boatSize=5;boatSize>=2;boatSize--) { //boucle pour chaque type de bateau

            for(let idPosition=0;idPosition<eval('botPosBoats'+boatSize).length;idPosition++) { //boucle pour chercher si l'id est dans le tableau des bateaux
                if(id == eval('botPosBoats'+boatSize)[idPosition]) {
                    botMemory.push(id)
                    document.getElementById('bot'+id).style.backgroundColor = "darkred"
                    document.getElementById('bot'+id).style.backgroundImage = 'none'
                    document.getElementById('minibot'+id).style.backgroundColor = "darkred"
                    document.getElementById('minibot'+id).style.backgroundImage = 'none'
                    let allBoatDestroyed = true;
                    for (let piecePosition=0;piecePosition<boatSize;piecePosition++) { //boucle qui cherche à quelle partie du bateau l'id appartient
                        if((idPosition-piecePosition) % boatSize == 0) {
                            for (k=0;k<boatSize;k++) { //boucle qui vérifie si toutes les autres parties du bateau ont été touchées
                                let boatPartAlsoTouched = false;
                                for(l=0;l<botMemory.length;l++) { //boucle qui check toutes les pièces de bateau touchées
                                    if (eval('botPosBoats'+boatSize)[(idPosition-piecePosition)+k] == botMemory[l]) {
                                        boatPartAlsoTouched = true;
                                        break;
                                    }
                                }
                                if(boatPartAlsoTouched == false) {
                                    allBoatDestroyed = false;
                                    break;
                                }
                            }

                            if(allBoatDestroyed == true) {
                                copyTotalBoats--;
                                for (i=0;i<boatSize;i++) {
                                    botBoxEmpty.push(eval('botPosBoats'+boatSize)[idPosition-piecePosition+i])
                                    const searchMemory = botMemory.indexOf(eval('botPosBoats'+boatSize)[idPosition-piecePosition+i]);
                                    botMemory.splice(searchMemory, 1)
                                    botDirection = 'no'
                                }

                            }
                            break;
                        }
                    }
                    stopSearch = true;
                    break;
                }
            }
        }
        if (stopSearch == false) {
            document.getElementById('bot'+id).style.backgroundColor = "rgb(23, 128, 122)"
            document.getElementById('minibot'+id).style.backgroundColor = "rgb(23, 128, 122)"
            botBoxEmpty.push(id)
        }
        document.getElementById('principalText').innerHTML = '<span>Game started !</span><span>Player remaining boats : '+totalBoats+'</span><span>Bot remaining boats : '+copyTotalBoats+'</span>'
    }
    
}

function swapBoards() { //passer du terrain board au terrain botBoard
    if (actualGamemode != 'inPlace') {
        if(boardOnBotBoard == true) {
            document.getElementsByClassName('botBoard')[0].style.display = "none"
            document.getElementsByClassName('board')[0].style.display = "flex"
            document.getElementsByClassName('board')[1].style.display = "none"
            document.getElementsByClassName('botBoard')[1].style.display = "flex"
            boardOnBotBoard = false;
        } else {
            document.getElementsByClassName('board')[0].style.display = "none"
            document.getElementsByClassName('botBoard')[0].style.display = "flex"
            document.getElementsByClassName('botBoard')[1].style.display = "none"
            document.getElementsByClassName('board')[1].style.display = "flex"
            boardOnBotBoard = true;
        }
    }
}

function newEmptyBox() { //transforme toutes les cases non-cliquées entourées de cases cliquées en cases aussi cliquées. Permet d'améliorer l'intelligence du bot.
    idSurroundedX = []
    idSurroundedY = []

    for(i=0;i<botBoxLeft.length;i++) {

        if((botBoxLeft[i]-1) % 10 == 0) {
            for(j=0;j<botBoxEmpty.length;j++) {
                if(botBoxLeft[i]+1 == botBoxEmpty[j]) {
                    idSurroundedX.push(botBoxLeft[i]);
                    break;
                }
            }

        } else if(botBoxLeft[i] % 10 == 0) {
            for(j=0;j<botBoxEmpty.length;j++) {
                if(botBoxLeft[i]-1 == botBoxEmpty[j]) {
                    idSurroundedX.push(botBoxLeft[i]);
                    break;
                }
            }

        } else {

            for(j=0;j<botBoxEmpty.length;j++) {
                if(botBoxLeft[i]+1 == botBoxEmpty[j]) {
                    for(k=0;k<botBoxEmpty.length;k++) {
                        if(botBoxLeft[i]-1 == botBoxEmpty[k]) {
                            idSurroundedX.push(botBoxLeft[i]);
                            break;
                        }
                    }
                    break;
                }
            }
        }
    }
    //boucle pour connaitre les cases entourées de case déjà cliquées sur l'axe X.

    for(i=0;i<botBoxLeft.length;i++) {

        if(botBoxLeft[i] <= 10) {
            for(j=0;j<botBoxEmpty.length;j++) {
                if(botBoxLeft[i]+10 == botBoxEmpty[j]) {
                    idSurroundedY.push(botBoxLeft[i]);
                    break;
                }
            }

        } else if(botBoxLeft[i] > 90) {
            for(j=0;j<botBoxEmpty.length;j++) {
                if(botBoxLeft[i]-10 == botBoxEmpty[j]) {
                    idSurroundedY.push(botBoxLeft[i]);
                    break;
                }
            }

        } else {

            for(j=0;j<botBoxEmpty.length;j++) {
                if(botBoxLeft[i]-10 == botBoxEmpty[j]) {
                    for(k=0;k<botBoxEmpty.length;k++) {
                        if(botBoxLeft[i]+10 == botBoxEmpty[k]) {
                            idSurroundedY.push(botBoxLeft[i]);
                            break;
                        }
                    }
                    break;
                }
            }
        }
    }
    //boucle qui fait la même chose pour connaitre si une case est entourée sur l'axe vertical

    for(i=0;i<idSurroundedX.length;i++) {
        for(j=0;j<idSurroundedY.length;j++) {
            if(idSurroundedX[i] == idSurroundedY[j]) {
                console.log('Nouvelle case empty : '+idSurroundedX[i])
                botBoxEmpty.push(idSurroundedX[i])
                const posID = botBoxLeft.indexOf(idSurroundedX[i])
                botBoxLeft.splice(posID,1)
                idSurroundedY.splice(j,1)
                break;
            }
        }
    }
    //permet de relier les cases entourées verticalement aux cases entourées horizontalement, pour ainsi former la position d'une case entièrement entourée
}