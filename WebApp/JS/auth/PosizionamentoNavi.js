//funzioni per trasfomare colore sfondo da RGB a hex
function daColoreAHex(color) {
    let hex = color.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
  
function daRGBAColore(colore) {
    let col = colore.substring(4, colore.length-2);
    let red = parseInt(col.split(", ")[0]);
    let green = parseInt(col.split(", ")[1]);
    let blue = parseInt(col.split(", ")[2]);
    return "#" + daColoreAHex(red) + daColoreAHex(green) + daColoreAHex(blue);
}

//funzioni per il controllo della sovrapposizione di navi --> viene controllato lo sfondo per determinare se è già presente una nave
function controlloSorvapposizioneNavi(iLettera, iNumero, fLettera, fNumero){
    let sovrapposta=false;
    if(iLettera === fLettera){
        let i = iNumero-1;
        
        while(i<fNumero && !sovrapposta){
            let id = iLettera+""+(i+1);
            let bgColor = daRGBAColore(window.getComputedStyle( document.getElementById("A1") ,null).getPropertyValue('background-color').toString());
            if(bgColor === "#808080"){
                sovrapposta=true;
            }
            i++;
        }
        
    }else if(iNumero === fNumero){
        let i = iLettera.charCodeAt(0)-1;
        while(i<fLettera.charCodeAt(0) && !sovrapposta){
            let id = (iLettera++)+""+iNumero;
            let bgColor = daRGBAColore(window.getComputedStyle( document.getElementById("A1") ,null).getPropertyValue('background-color').toString());
            if(bgColor === "#808080"){
                sovrapposta=true;
            }
            i++;
        }
    }
    return sovrapposta;
}

//esegue il controllo del posizionamento per ciascuna nave
var naviInserite = Array("nonInserita", "nonInserita", "nonInserita", "nonInserita", "nonInserita", "nonInserita");

function posizionamentoNave(lunghezzaNave, numeroNave){

    let inizioLettera = (document.getElementsByClassName("coordinataInizioLettera")[numeroNave-1].value).toString();
    let fineLettera = document.getElementsByClassName("coordinataFineLettera")[numeroNave-1].value;
    let inizioNumero = document.getElementsByClassName("coordinataInizioNumero")[numeroNave-1].value.toString();
    let fineNumero = document.getElementsByClassName("coordinataFineNumero")[numeroNave-1].value;

    inizioLettera = inizioLettera.toUpperCase();
    fineLettera = fineLettera.toUpperCase();

    if(inizioLettera === "" || inizioNumero=== "" || fineLettera === "" || fineNumero === ""){
        alert("Le coordinate non sono state inserite completamente");
    }else if(((inizioLettera === fineLettera && (Math.abs(inizioNumero-fineNumero)!==lunghezzaNave-1)) || (inizioNumero === fineNumero && Math.abs(inizioLettera-fineLettera)!==lunghezzaNave-1 && (inizioLettera<'A' || fineLettera>'L'))) || (inizioNumero<1 || fineNumero>10 )){//controlla se la lunghezza della nave è corretta
        alert("Le coordinate sono errate");
    }else if(inizioLettera!==fineLettera && inizioNumero!==fineNumero){
        alert("La nave non può essere posizionata in obliquo");
    }else if(inizioLettera === fineLettera){
        if(!controlloSorvapposizioneNavi(inizioLettera, inizioNumero, fineLettera, fineNumero)){//la nave non è sovrapposta ad un'altra
            for(let i = inizioNumero-1; i<fineNumero;i++){
                let id = inizioLettera+""+(i+1);
                document.getElementById(id).style.backgroundColor = "#808080";
            }
            naviInserite[numeroNave-1]="inserita";
        }else{
            alert("Non puoi sovrapporre due navi");
        }
    }else if(inizioNumero === fineNumero){
        if(!controlloSorvapposizioneNavi(inizioLettera, inizioNumero, fineLettera, fineNumero)){//la nave non è sovrapposta ad un'altra
            let lettera = inizioLettera;
            for(let i = inizioLettera.charCodeAt(0)-1; i<fineLettera.charCodeAt(0);i++){
                let id = lettera+""+inizioNumero;
                lettera = String.fromCharCode(lettera.charCodeAt() + 1);
                document.getElementById(id).style.backgroundColor = "#808080";
            }
            naviInserite[numeroNave-1]="inserita";
        }else{
            alert("Non puoi sovrapporre due navi");
        }
    }
}

//per ogni nave viene eseguito lo stesso controllo solo che cambia la lunghezza della nave
document.getElementsByClassName("posizionaBtn")[0].addEventListener("click", function(){
    posizionamentoNave(5, 1); 
    
})

document.getElementsByClassName("posizionaBtn")[1].addEventListener("click", function(){
    posizionamentoNave(4, 2); 
})

document.getElementsByClassName("posizionaBtn")[2].addEventListener("click", function(){
    posizionamentoNave(3, 3); 
})

document.getElementsByClassName("posizionaBtn")[3].addEventListener("click", function(){
    posizionamentoNave(3, 4); 
})

document.getElementsByClassName("posizionaBtn")[4].addEventListener("click", function(){
    posizionamentoNave(2, 5); 
})

document.getElementsByClassName("posizionaBtn")[5].addEventListener("click", function(){
    posizionamentoNave(2, 6); 
})




//si può giocare solo se sono state inserite tutte le navi
document.getElementById("playBtn").addEventListener("click", function(){
    var inserite = true;
    for (let i = 0; i < naviInserite.length; i++) {
        if(naviInserite[i]==="nonInserita"){
            inserite=false;
        }
    }
    
    if(inserite===true){
        window.location = "../HTML/Griglia.html";
    }else{
        alert("Posiziona prima le navi");
    }
})


