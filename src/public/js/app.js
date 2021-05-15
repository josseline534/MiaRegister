const validaNumericos = (event)=>{
    if(event.charCode >= 48 &&
        event.charCode <= 57 &&
        cedula.value.length < 10){
        return true
    }else{
        return false
    }
}
const validaCantidad = (event)=>{
    if(event.charCode >= 48 &&
        event.charCode <= 57){
            return true
    }else{
        return false
    }
}
const validaPrecio = (event) =>{
    if(event.charCode >= 48 &&
        event.charCode <= 57 ||
        event.charCode == 46){
            return true
    }else{
        return false
    }
}
const validaFecha = (event) =>{
    let fecha= new Date()
    let fechaActual = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate())
    let dateSelect = new Date(date.value)
    if(dateSelect > fechaActual){
        date.value=""
        dateError.innerHTML=`
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            La fecha ingresada debe ser menor o igual a la fecha actual.
        </div>`
    }else
        dateError.innerHTML=''
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

const mostrar = () =>{
    btnEditar.style.display='block'
    btnAnadir.style.display='none'
}