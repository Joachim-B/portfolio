//#region LoadPage

window.onload = ExecuteOnStart

function ExecuteOnStart()
{
    // pages par défaut
    document.getElementById("Physique").style.display = "none"
    document.getElementById("Chance").style.display = "none"
    document.getElementById("Intelligence").style.display = "none"
    document.getElementById("CustomDice").style.display = "none"

    // effets graphiques
    document.getElementById("liStatPrecision").style.backgroundColor = "#1d1d1d";
    document.getElementById("persoDelete").style.display = "none"

    // remplissage de l'input du stress
    document.querySelectorAll('.selectStress').forEach(element => {
        element.insertAdjacentHTML("beforeend", "<option value=\"100\" selected>100%</option>")
        for (let i = 9; i >= 0 ; i --)
        {
            let percent = i * 10;
            element.insertAdjacentHTML("beforeend", "<option value=\""+percent+"\">"+percent+"%</option>")
        }
    })

    // Données personnage 1
    CreatePerso()

    // ajouts d'évènements
    document.getElementById("accessNavStats").addEventListener("click", OpenMenuStats)
    document.getElementById("accessNavPerso").addEventListener("click", OpenMenuPerso)

    document.getElementById("liStatPrecision").addEventListener("click", ChangeStatTab)
    document.getElementById("liStatPhysique").addEventListener("click", ChangeStatTab)
    document.getElementById("liStatChance").addEventListener("click", ChangeStatTab)
    document.getElementById("liStatIntelligence").addEventListener("click", ChangeStatTab)
    document.getElementById("navCustomDice").addEventListener("click", ChangeStatTab)

    document.getElementById("liStatPrecision").addEventListener("click", CloseMenuStats)
    document.getElementById("liStatPhysique").addEventListener("click", CloseMenuStats)
    document.getElementById("liStatChance").addEventListener("click", CloseMenuStats)
    document.getElementById("liStatIntelligence").addEventListener("click", CloseMenuStats)
    document.getElementById("navCustomDice").addEventListener("click", CloseMenuStats)

    document.getElementById("addPerso").addEventListener("click", CreatePerso)
    document.querySelector("#persoInfosName input").addEventListener("change", ChangePersoName)
    document.querySelector("#persoInfosBackground input").addEventListener("change", ChangeBackground)
    document.querySelector("#persoDelete").addEventListener("click", DeletePerso)

    document.querySelectorAll('.palier select').forEach(element => {
        element.addEventListener("change", SetPalierPercents)
    })
    document.querySelectorAll('.selectStress').forEach(element => {
        element.addEventListener("change", SetStressValues)
    })

    document.getElementById("dicePrecision").addEventListener("click", RollDicePrecision)
    document.getElementById("dicePhysique").addEventListener("click", RollDicePhysique)
    document.getElementById("diceChance").addEventListener("click", RollDiceChance)
    document.getElementById("diceIntelligence").addEventListener("click", RollDiceIntelligence)
    document.getElementById("diceCustom").addEventListener("click", RollDiceCustom)
    document.getElementById("popupOK").addEventListener("click", ClosePopup)

    document.querySelector(".corpsACorpsCheck input").addEventListener("change", CorpsACorpsCheckChanged)
    document.querySelector(".corpsACorpsPV input").addEventListener("change", CorpsACorpsPVChanged)

}

//#endregion

//#region Data

// Liste d'objet qui sauvegarde les données de tous les personnages
let PersoList = []

// Index qui détermine quel personnage est affiché
let persoIndex = 0

// Index des ID attribués à chaque personnage (du type "perso[int]")
let idIndex = 1

//#endregion

//#region Fonctions menu

function OpenMenuStats()
{
    document.getElementById("navStats").style.display = "flex"

    const navStatsContainer = document.getElementById("navStatsContainer")
    const menuOpenBackground = document.getElementById("menuOpenBackground")
    const accessNavStats = document.getElementById("accessNavStats")
    const navStats = document.getElementById("navStats")

    navStatsContainer.style.zIndex = "11"
    navStats.style.maxWidth = "270px"
    navStats.style.border = "solid #1d1d1d";
    navStats.style.borderWidth = "0 2px 0 0";
    navStats.style.borderRadius = "0 0 3px 0";
    menuOpenBackground.style.display = "block";
    menuOpenBackground.style.opacity = "100%";
    menuOpenBackground.animate([
        {opacity: "0%"},
        {opacity: "100%"}
    ], {
        duration: 180,
    })

    accessNavStats.getElementsByTagName("img")[0].getAttributeNode("src").value = "assets/arrowNav.svg";
    accessNavStats.getElementsByTagName("img")[0].style.transform = "rotate(180deg)"

    accessNavStats.removeEventListener("click", OpenMenuStats)
    accessNavStats.addEventListener("click", CloseMenuStats)
    document.getElementById("menuOpenBackground").addEventListener("click", CloseMenuStats)
}

function CloseMenuStats()
{   
    const navStatsContainer = document.getElementById("navStatsContainer")
    const menuOpenBackground = document.getElementById("menuOpenBackground")
    const accessNavStats = document.getElementById("accessNavStats")
    const navStats = document.getElementById("navStats")

    navStats.style.maxWidth = "0px";
    navStats.style.border = "none";
    menuOpenBackground.style.opacity = "0%";
    menuOpenBackground.animate([
        {opacity: "100%"},
        {opacity: "0%"}
    ], {
        duration: 180,
    })

    accessNavStats.getElementsByTagName("img")[0].getAttributeNode("src").value = "assets/dice-icon-menu.svg";
    accessNavStats.getElementsByTagName("img")[0].style.transform = "rotate(0deg)"

    accessNavStats.removeEventListener("click", CloseMenuStats)
    accessNavStats.addEventListener("click", OpenMenuStats)
    document.getElementById("menuOpenBackground").removeEventListener("click", CloseMenuStats)

    setTimeout(() => {
        navStatsContainer.style.zIndex = "1"
        menuOpenBackground.style.display = "none";
    },180)
}

function OpenMenuPerso()
{
    document.getElementById("navPerso").style.display = "flex"

    const navPersoContainer = document.getElementById("navPersoContainer")
    const menuOpenBackground = document.getElementById("menuOpenBackground")
    const accessNavPerso = document.getElementById("accessNavPerso")
    const navPerso = document.getElementById("navPerso")

    navPersoContainer.style.zIndex = "11"
    navPerso.style.maxWidth = "270px";
    navPerso.style.border = "solid #1d1d1d";
    navPerso.style.borderWidth = "0 0 0 2px";
    navPerso.style.borderRadius = "0 0 0 3px";
    menuOpenBackground.style.display = "block";
    menuOpenBackground.style.opacity = "100%";
    menuOpenBackground.animate([
        {opacity: "0%"},
        {opacity: "100%"}
    ], {
        duration: 180,
    })

    accessNavPerso.getElementsByTagName("img")[0].getAttributeNode("src").value = "assets/arrowNav.svg";

    accessNavPerso.removeEventListener("click", OpenMenuPerso)
    accessNavPerso.addEventListener("click", CloseMenuPerso)
    document.getElementById("menuOpenBackground").addEventListener("click", CloseMenuPerso)
}

function CloseMenuPerso()
{   
    const navPersoContainer = document.getElementById("navPersoContainer")
    const menuOpenBackground = document.getElementById("menuOpenBackground")
    const accessNavPerso = document.getElementById("accessNavPerso")
    const navPerso = document.getElementById("navPerso")

    navPerso.style.maxWidth = "0px"
    navPerso.style.border = "none"
    menuOpenBackground.style.opacity = "0%";
    menuOpenBackground.animate([
        {opacity: "100%"},
        {opacity: "0%"}
    ], {
        duration: 180,
    })

    accessNavPerso.getElementsByTagName("img")[0].getAttributeNode("src").value = "assets/perso-icon-menu.svg";

    accessNavPerso.removeEventListener("click", CloseMenuPerso)
    accessNavPerso.addEventListener("click", OpenMenuPerso)
    document.getElementById("menuOpenBackground").removeEventListener("click", CloseMenuPerso)

    setTimeout(() => {
        navPersoContainer.style.zIndex = "1"
        menuOpenBackground.style.display = "none";
    },180)
}


function ChangeStatTab(e)
{
    let tab;
    if (e.target.nodeName == "SPAN"
    || e.target.nodeName == "IMG")
    {
        tab = e.target.parentElement.id
    }
    else
    {
        tab = e.target.id
    }
    document.getElementById("liStatPrecision").style.backgroundColor = "transparent";
    document.getElementById("liStatPhysique").style.backgroundColor = "transparent";
    document.getElementById("liStatChance").style.backgroundColor = "transparent";
    document.getElementById("liStatIntelligence").style.backgroundColor = "transparent";
    document.getElementById("navCustomDice").style.backgroundColor = "transparent";

    document.getElementById(tab).style.backgroundColor = "#1d1d1d";

    document.getElementById("Precision").style.display = "none"
    document.getElementById("Physique").style.display = "none"
    document.getElementById("Chance").style.display = "none"
    document.getElementById("Intelligence").style.display = "none"
    document.getElementById("CustomDice").style.display = "none"

    switch (tab) {
        case "liStatPrecision":
            document.getElementById("Precision").style.display = "block"
            break;
        case "liStatPhysique":
            document.getElementById("Physique").style.display = "block"
            break;
        case "liStatChance":
            document.getElementById("Chance").style.display = "block"
            break;
        case "liStatIntelligence":
            document.getElementById("Intelligence").style.display = "block"
            break;
        case "navCustomDice":
            document.getElementById("CustomDice").style.display = "block"
            break;
        default:;
    }
}

//#endregion

//#region Valeurs des stats

function SetStressValues(e)
{
    const value = e.target.value
    document.querySelectorAll('.selectStress').forEach(element => {
        if (element.value != value)
        {
            element.value = value;
        }
    })
}

function SetPalierPercents(e)
{
    const value = e.target.value
    e.target.parentElement.getElementsByTagName("span")[0].innerHTML = "(" + ConvertPalierToPercents(value) + "%)"
}

function CorpsACorpsPVChanged(e)
{
    let value = e.target.value
    if (value < 0)
    {
        e.target.value = 0
        return
    }
    const pvMax = (document.querySelector("#Physique .palier select").value)*3
    if (value > pvMax)
    {
        e.target.value = pvMax
    }
}

function CorpsACorpsCheckChanged(e)
{
    SetCorpsACorpsDisplay(e.target.checked)
}

function SetCorpsACorpsDisplay(checked)
{
    const corpsACorpsPV = document.querySelector(".corpsACorpsPV")
    const corpsACorpsMode = document.querySelector(".corpsACorpsMode")
    if (checked)
    {
        corpsACorpsPV.style.display = "block"
        corpsACorpsMode.style.display = "flex"
    }
    else
    {
        corpsACorpsPV.style.display = "none"
        corpsACorpsMode.style.display = "none"
    }
}

//#endregion

//#region LANCER DE DE

function RollDicePrecision()
{
    const section = document.getElementById("Precision")
    const scoreToBeat = GetPalierStat(section) + GetStressStat(section) + GetBonusStat(section)
    const scoreMade = GetRandomNumber(1, 100)
    let contentHisto, popupContent

    if (scoreMade <= scoreToBeat)
    {
        const bodyPartNumber = GetRandomNumber(1, 100)
        const bodyPartName = GetBodyPart(bodyPartNumber)
        
        let wordTouche
        
        if (bodyPartName == "jambe droite"
        || bodyPartName == "jambe gauche"
        || bodyPartName == "tête")
        {
            wordTouche = "touchée"
        }
        else
        {
            wordTouche = "touché"
        }
        const bodyPartNameUpperCase = bodyPartName[0].toUpperCase() + bodyPartName.substring(1)

        const bodyPartContent = bodyPartNameUpperCase + ' ' + wordTouche + " (" + bodyPartNumber + ")"

        let damageTypeNumber
        if (scoreMade <= 5) {
            damageTypeNumber = 3
        }
        else
        {
            damageTypeNumber = GetRandomNumber(1, 3)
        }
        const damageTypeContent = "Dégâts de type " + damageTypeNumber
        
        popupContent = [
            bodyPartContent,
            damageTypeContent
        ]

        contentHisto = `${scoreToBeat}% - ${bodyPartNameUpperCase} - Dégât ${damageTypeNumber}`
    }
    else
    {
        contentHisto = scoreToBeat + "%"
    }

    SetPopupContentClassic(scoreMade, scoreToBeat, popupContent)
    const colorClassName = GetNumberColorClassName(scoreMade, scoreToBeat)
    setTimeout(() => {
        AddValueToHistorique(scoreMade, colorClassName, contentHisto, "histoPrecision")
    },180)

    OpenPopup()
}



function RollDicePhysique()
{
    const section = document.getElementById("Physique")
    let scoreToBeat, scoreMade, contentHisto, popupContent = []

    if (!section.querySelector(".corpsACorpsCheck input").checked)
    {
        scoreToBeat = GetPalierStat(section) + GetStressStat(section) + GetBonusStat(section)
        scoreMade = GetRandomNumber(1, 100)
        contentHisto = scoreToBeat + "%"
    }
    else
    {
        const PV = section.querySelector(".corpsACorpsPV input").value
        const palier = parseInt(section.querySelector(".palier select").value)

        if ((PV < 1 && palier != 0 ) || PV > palier*3)
        {
            scoreMade = "Erreur"
            popupContent = ["Valeur de PV incompatible"]
        }
        else
        {
            scoreMade = GetRandomNumber(1, 100)
            popupContent = ["Malus : " + (GetPVMalus(palier, PV)*-1) + "%"]
            if(section.querySelectorAll(".corpsACorpsMode input")[0].checked)
            {
                scoreToBeat = 100 + GetStressStat(section) + GetBonusStat(section) + GetPVMalus(palier, PV)
                if (scoreMade <= scoreToBeat)
                {
                    let degat = 3
                    if (scoreMade > 5)
                    {
                        degat = GetRandomNumber(1, 3)
                    }
                    popupContent.splice(0, 0, "Dégât de type " + degat)
                    contentHisto = scoreToBeat + "% - Dégât " + degat
                }
                else
                {
                    contentHisto = scoreToBeat + "%"
                }
            }
            else
            {
                scoreToBeat = GetPalierStat(section) + GetStressStat(section) + GetBonusStat(section) + GetPVMalus(palier, PV)
                contentHisto = scoreToBeat + "%"
            }
        }
    }
    
    if (scoreMade != "Erreur")
    {
        SetPopupContentClassic(scoreMade, scoreToBeat, popupContent)
        const colorClassName = GetNumberColorClassName(scoreMade, scoreToBeat)
        setTimeout(() => {
            AddValueToHistorique(scoreMade, colorClassName, contentHisto, "histoPhysique")
        },180)
    }
    else
    {
        SetPopupContentError(popupContent)
    }

    OpenPopup()
}



function RollDiceChance()
{
    const section = document.getElementById("Chance")
    const scoreToBeat = GetPalierStat(section) + GetStressStat(section) + GetBonusStat(section)
    const scoreMade = GetRandomNumber(1, 100)
    const contentHisto = scoreToBeat + "%"

    SetPopupContentClassic(scoreMade, scoreToBeat, null)

    const colorClassName = GetNumberColorClassName(scoreMade, scoreToBeat)
    setTimeout(() => {
        AddValueToHistorique(scoreMade, colorClassName, contentHisto, "histoChance")
    },180)

    OpenPopup()
}



function RollDiceIntelligence()
{
    const section = document.getElementById("Intelligence")
    const scoreToBeat = GetPalierStat(section) + GetStressStat(section) + GetBonusStat(section)
    const scoreMade = GetRandomNumber(1, 100)
    const contentHisto = scoreToBeat + "%"
    
    SetPopupContentClassic(scoreMade, scoreToBeat, null)

    const colorClassName = GetNumberColorClassName(scoreMade, scoreToBeat)
    setTimeout(() => {
        AddValueToHistorique(scoreMade, colorClassName, contentHisto, "histoIntelligence")
    },180)

    OpenPopup()
}



function RollDiceCustom()
{
    const section = document.getElementById("CustomDice")
    const minValue = parseInt(section.getElementsByClassName("customMinValue")[0].value)
    const maxValue = parseInt(section.getElementsByClassName("customMaxValue")[0].value)
    let scoreMade, popupContent, contentHisto, colorClassName

    if (!Number.isInteger(minValue)
        || !Number.isInteger(maxValue))
    {
        scoreMade = "Erreur"
        popupContent = ["Valeurs incorrectes"]
    }
    else if (minValue > maxValue) 
    {
        scoreMade = "Erreur"
        popupContent = ["La valeur min doit être inférieure à la valeur max"]
    }
    else
    {
        scoreMade = GetRandomNumber(minValue, maxValue)
        popupContent = ["Min : " + minValue + " - Max : " + maxValue]
        contentHisto = minValue + " - " + maxValue

        if (scoreMade == minValue
            || scoreMade == maxValue)
        {
            colorClassName = "numberResultCritSuccess"
        }
        else
        {
            colorClassName = ""
        }
    }

    if (scoreMade != "Erreur")
    {
        SetPopupContentCustom(scoreMade, minValue, maxValue, popupContent)
        setTimeout(() => {
            AddValueToHistorique(scoreMade, colorClassName, contentHisto, "histoCustom")
        },180)
    }
    else
    {
        SetPopupContentError(popupContent)
    }

    OpenPopup()
}

//#endregion

//#region LANCER DE DE UTILS

function GetRandomNumber(min, max)
{
    return Math.floor(Math.random()*(max - min + 1) + min)
}

function GetPalierStat(section)
{
    const palierValue = section.getElementsByClassName("palier")[0].getElementsByTagName("select")[0].value
    return ConvertPalierToPercents(palierValue)
}

function ConvertPalierToPercents(palierValue) {
    switch (palierValue.toString()) {
        case "0" :
            return 30
        case "1" :
            return 45
        case "2" :
            return 55
        case "3" :
            return 60
        case "4" :
            return 65
        case "5" :
            return 70
    }
}


function GetBonusStat(section)
{
    const bonusValue = parseInt(section.getElementsByClassName("bonusMalus")[0].getElementsByTagName("input")[0].value)

    if (Number.isInteger(bonusValue))
    {
        return bonusValue;
    }
    else
    {
        return 0;
    }
}

function GetStressStat(section)
{
    const stressValue = parseInt(section.getElementsByClassName("stress")[0].getElementsByTagName("select")[0].value)

    let result = 0;

    switch (stressValue) {
        case 100 :
            result = 0
            break;
        case 90 :
            result = 0
            break;
        case 80 :
            result = 5
            break;
        case 70 :
            result = 5
            break;
        case 60 :
            result = 10
            break;
        case 50 :
            result = 10
            break;
        case 40 :
            result = 20
            break;
        case 30 :
            result = 20
            break;
        case 20 :
            result = 35
            break;
        case 10 :
            result = 35
            break;
        case 0 :
            result = 100
            break;
        default:;
    }
    return (result*(-1))
}

function GetPVMalus(palier, PV)
{
    const palierPV = Math.floor(PV/3)
    const palierStat = ConvertPalierToPercents(palier)
    const palierStatPV = ConvertPalierToPercents(palierPV)

    return (palierStat - palierStatPV)*-1
}

function GetBodyPart(value)
{
    switch (true) {
        case value <= 50 :
            return "torse"
        case value <= 60 :
            return "bras gauche"
        case value <= 70 :
            return "bras droit"
        case value <= 80 :
            return "jambe gauche"
        case value <= 90 :
            return "jambe droite"
        case value <= 100 :
            return "tête"
    }
}

function SetPopupContentCustom(scoreMade, minValue, maxValue, popupContent)
{
    const popupResultClassic = document.getElementById("popupResultClassic")
    const popupResultCustom = document.getElementById("popupResultCustom")
    const popupResultNumber = popupResultCustom.getElementsByTagName("span")[0]

    popupResultClassic.style.display = "none"
    popupResultCustom.style.display = "block"

    popupResultNumber.textContent = scoreMade;

    if (scoreMade == minValue
        || scoreMade == maxValue)
    {
        popupResultNumber.className = "popupResultNumberCustom numberResultCritSuccess"
    }
    else if (scoreMade == "Erreur")
    {
        popupResultNumber.className = "popupResultErreur"
    }
    else
    {
        popupResultNumber.className = "popupResultNumberCustom"
    }

    document.getElementById("popupMainContent").innerHTML = null
    if (popupContent != null
        && popupContent != "")
    {
        SetPopupMainContent(popupContent)
    }
}

function SetPopupContentClassic(scoreMade, scoreToBeat, popupContent)
{
    const popupResultClassic = document.getElementById("popupResultClassic")
    const popupResultCustom = document.getElementById("popupResultCustom")
    const popupResultNumber = popupResultClassic.getElementsByTagName("span")[0]
    const popupScoreToBeat = document.getElementById("popupScoreToBeat")

    popupResultCustom.style.display = "none"
    popupResultClassic.style.display = "block"

    popupResultNumber.textContent = scoreMade;
    popupResultNumber.className = "popupResultNumber " + GetNumberColorClassName(scoreMade, scoreToBeat)
    popupScoreToBeat.innerHTML = "/ "+ scoreToBeat

    document.getElementById("popupMainContent").innerHTML = null
    if (popupContent != null
        && popupContent != "")
    {
        SetPopupMainContent(popupContent)
    }
}

function SetPopupContentError(popupContent)
{
    const popupResultClassic = document.getElementById("popupResultClassic")
    const popupResultCustom = document.getElementById("popupResultCustom")
    const popupResultNumber = popupResultCustom.getElementsByTagName("span")[0]

    popupResultClassic.style.display = "none"
    popupResultCustom.style.display = "block"

    popupResultNumber.textContent = "Erreur";
    popupResultNumber.className = "popupResultErreur"

    document.getElementById("popupMainContent").innerHTML = null
    if (popupContent != null
        && popupContent != "")
    {
        SetPopupMainContent(popupContent)
    }
}

function SetPopupMainContent(popupContent)
{
    const popupMainContent = document.getElementById("popupMainContent")

    popupContent.forEach(element => {
        popupMainContent.insertAdjacentHTML("beforeend", "<li>" + element + "</li>")
    })
}

function GetNumberColorClassName(scoreMade, scoreToBeat)
{
    if (scoreMade > scoreToBeat)
    {
        if (scoreMade >= 96)
        {
            return "numberResultCritLoss"
        }
        else
        {
            return "numberResultLoss"
        }
    }
    else
    {
        if (scoreMade <= 5)
        {
            return "numberResultCritSuccess"
        }
        else
        {
            return "numberResultSuccess"
        }
    }
}

function OpenPopup()
{
    const popupResult = document.getElementById("popupResult")
    const menuOpenBackground = document.getElementById("menuOpenBackground")
    popupResult.style.display = "flex"
    popupResult.animate([
        {transform: "scale(0%)"},
        {transform: "scale(100%)"}
    ], {
        duration: 180,
    })
    menuOpenBackground.style.display = "block"
    menuOpenBackground.style.opacity = "100%"
    menuOpenBackground.animate([
        {opacity: "0%"},
        {opacity: "100%"}
    ], {
        duration: 180,
    })
}

function ClosePopup()
{
    const popupResult = document.getElementById("popupResult")
    const menuOpenBackground = document.getElementById("menuOpenBackground")
    menuOpenBackground.style.opacity = "0%"
    popupResult.style.transform = "scale(0%)"
    popupResult.animate([
        {transform: "scale(100%)"},
        {transform: "scale(0%)"}
    ], {
        duration: 180,
    })
    menuOpenBackground.style.opacity = "0%"
    menuOpenBackground.animate([
        {opacity: "100%"},
        {opacity: "0%"}
    ], {
        duration: 180,
    })

    setTimeout(() => {
        popupResult.style.display = "none"
        popupResult.style.transform = "scale(100%)"
        menuOpenBackground.style.display = "none";
    },180)
}

function AddValueToHistorique(scoreMade, scoreClassName, content, idHistorique)
{
    const ul = document.getElementById(idHistorique).getElementsByTagName("ul")[0]

    if (scoreClassName != "")
    {
        scoreClassName += " "
    }

    ul.insertAdjacentHTML("afterbegin",
`<li>
    <div class="histoResult">
        <span class="${scoreClassName}histoNumber">${scoreMade}</span>
        <div class="histoResultLine"></div>
        <span class="histoResultInfos">${content}</span>
    </div>
</li>`)
}

//#endregion

//#region CHANGEMENT DE PERSOS

function CreatePerso()
{
    const persoName = GetNewName()
    let newId
    if (idIndex < 10)
    {
        newId = "0" + idIndex.toString()
    }
    else
    {
        newId = idIndex.toString()
    }

    const newPersoObj = {
        id: "perso" + newId,
        name: persoName,
        background: "",
        precision : {
            palier : 0,
            bonusMalus : 0,
            historique : []
        },
        physique : {
            palier : 0,
            bonusMalus : 0,
            historique : [],
            corpsACorps : {
                checked : false,
                pv : 0
            }
        },
        chance : {
            palier : 0,
            bonusMalus : 0,
            historique : []
        },
        intelligence : {
            palier : 0,
            bonusMalus : 0,
            historique : []
        },
        custom : {
            min : 1,
            max : 100,
            historique : []
        },
        stress: 100
    }
    PersoList.push(newPersoObj)
    idIndex++
    if (PersoList.length > 1)
    {
        document.getElementById("persoDelete").style.display = "flex"
    }

    // Ajout du perso dans la liste et validation de ce perso
    document.querySelector("#listPersos ul").insertAdjacentHTML("beforeend", "<li class=\"navMainButton\" id=\"perso"+ newId +"\"><span>" + persoName + "</span></li>")

    //Reset couleur de l'ancien perso sélectionné
    document.querySelectorAll("#listPersos li")[PersoList.length - 1].addEventListener("click", PersoMenuClick)
    
    SavePersoData()
    LoadPersoData(PersoList.length - 1)
}

function PersoMenuClick(e)
{
    SavePersoData()
    let persoId
    if (e.target.nodeName != "LI")
    {
        persoId = e.target.parentElement.id
    }
    else
    {
        persoId = tab = e.target.id
    }

    PersoList.forEach(element => {
        if (element.id == persoId)
        {
            LoadPersoData(PersoList.indexOf(element))
            return false
        }
        return true
    })
}

function LoadPersoData(newPersoIndex)
{
    // Apparence du menu
    //Reset couleur de l'ancien perso sélectionné
    document.querySelectorAll("#listPersos li")[persoIndex].style.backgroundColor = "transparent";
    persoIndex = newPersoIndex
    document.querySelectorAll("#listPersos li")[persoIndex].style.backgroundColor = "#1d1d1d";

    // Infos du menu
    const persoData = PersoList[persoIndex]
    document.querySelector("#persoInfosName input").value = persoData.name
    document.querySelector("#headerPersoName").innerText = persoData.name
    document.querySelector("#persoInfosBackground input").value = persoData.background
    ChangeBackground()

    // Load des 4 stats
    LoadStat(persoData.precision, "Precision")
    LoadStat(persoData.physique, "Physique")
    LoadStat(persoData.chance, "Chance")
    LoadStat(persoData.intelligence, "Intelligence")

    // Load corps à corps
    const corpsACorps = persoData.physique.corpsACorps
    console.dir(corpsACorps)
    document.querySelector("#Physique .corpsACorpsCheck input").checked = corpsACorps.checked
    SetCorpsACorpsDisplay(corpsACorps.checked)
    document.querySelector("#Physique .corpsACorpsPV input").value = corpsACorps.pv

    // Load stress
    document.querySelectorAll(".selectStress").forEach(element => {
        element.value = persoData.stress
    })

    // Load custom
    document.querySelector(".customMinValue").value = persoData.custom.min
    document.querySelector(".customMaxValue").value = persoData.custom.max
    LoadHistorique(persoData.custom, "CustomDice")
}

function LoadStat(statData, statSection)
{
    const section = document.getElementById(statSection)
    section.querySelector(".palier select").value = statData.palier
    section.querySelector(".palier span").innerHTML = "(" + ConvertPalierToPercents(statData.palier.toString()) + "%)"
    section.querySelector(".bonusMalus input").value = statData.bonusMalus
    LoadHistorique(statData, statSection)
}

function LoadHistorique(statData, statSection)
{
    const histoUl = document.getElementById(statSection).querySelector(".historiqueDice ul")
    histoUl.innerHTML = null
    if (statData.historique.length < 1)
    {
        return
    }

    statData.historique.forEach(element => {
        histoUl.insertAdjacentHTML("beforeend",
`<li>
    <div class="histoResult">
        <span class="${element.class}">${element.score}</span>
        <div class="histoResultLine"></div>
        <span class="histoResultInfos">${element.infos}</span>
    </div>
</li>`)
    })
}

function SavePersoData()
{
    const persoData = PersoList[persoIndex]
    persoData.name = document.querySelector("#persoInfosName input").value
    persoData.background = document.querySelector("#persoInfosBackground input").value

    // Save des 4 stats
    SaveStat(persoData.precision, "Precision")
    SaveStat(persoData.physique, "Physique")
    SaveStat(persoData.chance, "Chance")
    SaveStat(persoData.intelligence, "Intelligence")

    const corpsACorps = persoData.physique.corpsACorps
    corpsACorps.checked = document.querySelector("#Physique .corpsACorpsCheck input").checked
    corpsACorps.pv = document.querySelector("#Physique .corpsACorpsPV input").value

    persoData.stress = document.querySelector(".selectStress").value

    persoData.custom.min = document.querySelector(".customMinValue").value
    persoData.custom.max = document.querySelector(".customMaxValue").value
    SaveHistorique(persoData.custom, "CustomDice")
}

function SaveStat(statData, statSection)
{
    const section = document.getElementById(statSection)
    statData.palier = section.querySelector(".palier select").value
    statData.bonusMalus = section.querySelector(".bonusMalus input").value
    SaveHistorique(statData, statSection)
}

function SaveHistorique(statData, statSection)
{
    const section = document.getElementById(statSection)
    const histoList = section.querySelectorAll(".historiqueDice ul li")
    if (histoList.length < 1)
    {
        return
    }

    statData.historique = []

    let saveIndex = 0
    let limitSaves = false

    histoList.forEach(element => {
        if (limitSaves)
        {
            return
        }

        const histoDiv = element.querySelector("div")
        statData.historique.push({
            score: histoDiv.children[0].innerText,
            class: histoDiv.children[0].className,
            infos: histoDiv.children[2].innerText
        })

        saveIndex ++
        if (saveIndex >= 30)
        {
            limitSaves = true
        }
    })
}

function GetNewName()
{
    let i = 1
    while(1)
    {
        const newName = "Personnage " + i
        if (PersoList.length > 0)
        {
            let nameTaken = false;
            PersoList.forEach(element => {
                if (nameTaken)
                {
                    return
                }

                if (element.name == newName)
                {
                    i++;
                    nameTaken = true
                    return
                }
            });
            if (nameTaken)
            {
                continue
            }
        }
        return newName
    }
}

function ChangePersoName()
{
    if (PersoList.length < 1 )
    {
        return;
    }

    const persoData = PersoList[persoIndex]
    const newName = document.querySelector("#persoInfosName input").value
    document.querySelectorAll("#listPersos li")[persoIndex].innerText = newName
    document.querySelector("#headerPersoName").innerText = newName
    persoData.name = newName
}

function ChangeBackground()
{
    if (PersoList.length < 1 )
    {
        return;
    }

    const persoData = PersoList[persoIndex]
    const newBackGround = document.querySelector("#persoInfosBackground input").value
    persoData.background = newBackGround

    const backgroundLowerCase = newBackGround.toString().toLowerCase()

    if (backgroundLowerCase == "zèbre" )
    {
        document.body.style.backgroundImage = "url(assets/bonus/zebre.jpg)"
        return;
    }
    if (backgroundLowerCase == "mona" )
    {
        document.body.style.backgroundImage = "url(assets/bonus/mona.jpg)"
        return;
    }
    if (backgroundLowerCase == "hentai" )
    {
        document.body.style.backgroundImage = "url(assets/bonus/hentai.jpg)"
        return;
    }
    
    let timedOut = false;
    let img = new Image();
    
    img.onerror = img.onabort = function() {
        if (!timedOut) {
            clearTimeout(timer);
            document.body.style.backgroundImage = "url(assets/default-background.jpg)"
            return
        }
    };
    img.onload = function() {
        if (!timedOut) {
            clearTimeout(timer);
            document.body.style.backgroundImage = "url(" + newBackGround + ")"
            return
        }
    };
    img.src = newBackGround;
    timer = setTimeout(function() {
        timedOut = true;
        return;
    }, 10000); 
    document.body.style.backgroundImage = "url(assets/default-background.jpg)"
}

function DeletePerso()
{
    let persoMenu = document.querySelectorAll("#listPersos li")[persoIndex]
    document.querySelector("#listPersos ul").removeChild(persoMenu)
    PersoList.splice(persoIndex,1)
    if (persoIndex != 0)
    {
        persoIndex--
    }
    LoadPersoData(persoIndex)

    if (PersoList.length == 1)
    {
        document.getElementById("persoDelete").style.display = "none"
    }
}

//#endregion
