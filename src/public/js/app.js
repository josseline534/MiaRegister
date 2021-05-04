const validaNumericos = (event)=>{
    if(event.charCode >= 48 &&
        event.charCode <= 57 &&
        cedula.value.length < 10){
        return true
    }else{
        return false
    }
}
const comprobarCedula =() =>{
    if(cedula.value.length != 10){
        cedError.innerHTML=`
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            Cedula incorrecta
        </div>`
    }else{
        cedError.innerHTML=``
    }
}
let mensaje = document.getElementById('mensaje')
setTimeout(()=>{
    mensaje.style.display='none'
},1500)
