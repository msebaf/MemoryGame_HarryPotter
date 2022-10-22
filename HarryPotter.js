final = [];
let cantCartasGiradas = 0;
let cartaAcomparar;
let coincidencias = 0
var actualizar;
const flip = new Audio("flip.ogg")
const badEnd = new Audio("badend2.mp3")
const win = new Audio("win.wav")
let juegos=0
let ganados =0;
let perdidos=0;
let tries=0;
let bestScore = 0

const personajes = fetch("https://hp-api.herokuapp.com/api/characters")
    .then(response =>  response.json(). then(datos => {return  datos.filter(dato => dato.image != "")}))
boton = document.getElementById("jugar")

boton.addEventListener("click", event =>{
   
    document.getElementById("bScore").innerHTML= "Best Score: "+ bestScore;
    if(document.getElementById("logo1")){
        document.getElementById("logo1").remove()
    }
   if(document.getElementById("perdiste")){
    document.getElementById("perdiste").remove();
   }
   if(document.getElementById("ganaste")){
    document.getElementById("ganaste").remove()
   }
   juegos++
   document.getElementById("games").innerHTML = "Games: "+juegos;
    boton.disabled=true;
    console.log("deshab")
   marcoEnJuego = document.getElementById("en_juego")
   while(marcoEnJuego.firstChild){
    marcoEnJuego.removeChild(marcoEnJuego.firstChild);
   }
   coincidencias = 0
   cantCartasGiradas=0
   cartaAcomparar=""
   tries = 0;
   score=0;
   document.getElementById("Score").innerHTML="Score:" + score
   document.getElementById("tries").innerHTML= "Tries: "+tries;
   document.getElementById("found").innerHTML= "Found: "+coincidencias;

    colocarCartas(personajes);
    actualizarTiempo();
    


})



    
  
   
  function elegir10(datos){
        final = []
        let data= []
        datos.forEach(element => {
            data.push(element)
        });
        for (let i = 0; i < 10; i++) {
            indice =  Math.floor(Math.random() * data.length)
            final.push(data[indice])
            final.push(data[indice]) //lo necesito dos veces
           data.splice(indice, 1);
                     
        }
        console.log(final)
        final.sort(()=> Math.random() - 0.5);
       
       

    }

    async function colocarCartas(pers){
       
        elegir10( await pers);
        marcoCartas = document.getElementById("en_juego")
        for (let i = 0; i < 20; i++) {
            marcoUnaCarta = document.createElement("div");
            carta = document.createElement("img");
            carta.setAttribute("src", "reverso_carta.jpg");
            carta.setAttribute("id", i)
            marcoUnaCarta.appendChild(carta);
            marcoCartas.appendChild(marcoUnaCarta);
            carta.addEventListener("click", event=> {
                flip.play()
                console.log("girada")
                var card = event.target;
                if(card.getAttribute("src") == "reverso_carta.jpg"){
                    cantCartasGiradas += 1 
                    card.setAttribute("src", final[card.getAttribute("id")].image)
                    
                    if(cantCartasGiradas==2){
                        
                        cantCartasGiradas=0
                        tries++
                        document.getElementById("tries").innerHTML= "Tries: "+tries;
                       
                        setTimeout(() => {
                        console.log(cantCartasGiradas)
                        if(card.getAttribute("src") == cartaAcomparar.getAttribute("src")){
                            
                           // card.parentNode.parentNode.removeChild(card.parentNode);
                           // cartaAcomparar.parentNode.parentNode.removeChild(cartaAcomparar.parentNode);
                           marco1 = card.parentNode;
                           Ncarta = document.createElement("img");
                           Ncarta.setAttribute("src", card.getAttribute("src"))
                           marco1.replaceChild(Ncarta, card);
                           marco2 = cartaAcomparar.parentNode;
                           Ncarta2 = document.createElement("img");
                           Ncarta2.setAttribute("src", cartaAcomparar.getAttribute("src"))
                           marco2.replaceChild(Ncarta2, cartaAcomparar);
                           
                           coincidencias++
                           document.getElementById("found").innerHTML= "Found: "+coincidencias;
                           score= (coincidencias*100) - (tries*5)
                        score>0? document.getElementById("Score").innerHTML="Score:" + score : document.getElementById("Score").innerHTML="Score:" + 0 
                           
                           if(coincidencias==10){
                            win.play()
                            score>bestScore? bestScore=score : bestScore=bestScore;
                            let ganaste = document.createElement("p")
                            ganaste.innerHTML = "GANASTE"
                            ganaste.setAttribute("class", "mFinal")
                            ganaste.setAttribute("id", "ganaste")
                            fondo = document.getElementById("Marco_cartas").appendChild(ganaste)
                            ganados++;
                            document.getElementById("won").innerHTML="Won: "+ganados;
                            console.log("ganaste")
                            clearInterval(actualizar)
                            boton.disabled=false;
                           }
                        }
                        else{
                            cantCartasGiradas=0
                            score= (coincidencias*100) - (tries*5)
                        score>0? document.getElementById("Score").innerHTML="Score:" + score : document.getElementById("Score").innerHTML="Score:" + 0 
                           
                            card.setAttribute("src", "reverso_carta.jpg")
                            cartaAcomparar.setAttribute("src", "reverso_carta.jpg")
                            
                        }
                    },300)
                    }
                    else{ cartaAcomparar= card;}
                }
                else{
                cantCartasGiradas-=1
                card.setAttribute("src","reverso_carta.jpg")
                
            }
                
                console.log(cantCartasGiradas)
                
            })
            
        }
    }

   function actualizarTiempo(){
    minutos = 3;
   segundos = 0;
     reloj = document.getElementById("reloj")
       actualizar = setInterval(function (){
        if(minutos>0 || segundos>=0){
        if(segundos < 10){
            reloj.innerHTML ="0"+minutos+":"+"0"+segundos
        }
        else{reloj.innerHTML ="0"+minutos+":"+segundos
        }
    
        if(minutos >0 && segundos == 0 ){
            minutos--
            segundos = 59;
        }
        else{
           segundos--
        }
    }
    else{
        clearInterval(actualizar)
        let perdiste = document.createElement("p")
        perdiste.innerHTML = "PERDISTE"
        perdidos++;
        document.getElementById("lost").innerHTML = "Lost: "+perdidos;
        perdiste.setAttribute("class", "mFinal")
        perdiste.setAttribute("id", "perdiste")
        fondo = document.getElementById("Marco_cartas").appendChild(perdiste)
        console.log("Perdiste")
        coincidencias=0;
        CartasEnJuego = document.getElementById("en_juego").childNodes
        console.log(CartasEnJuego)
        badEnd.play()
        score>bestScore? bestScore=score : bestScore=bestScore;
       for (let index = 0; index < CartasEnJuego.length; index++) {
        setTimeout(() => {
            nImg=document.createElement("img")
            nImg.setAttribute("src", "perdiste.jpg")
            CartasEnJuego[index].replaceChild(nImg,  CartasEnJuego[index].firstChild )
            console.log("1 Segundo esperado")
          }, 150*index);
        
       }
       
       setTimeout(() => {
        boton.disabled=false;
      }, 150*20);
       
        
    }
        
    }, 1000);
   
}

