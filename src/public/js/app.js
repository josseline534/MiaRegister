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
},3000)

const mostrarPromo = () =>{
    btnEditar.style.display='block'
    btnAnadir.style.display='none'
}

const precioVenta = () => {
    console.log(pUnit.value);
    let total = (parseFloat(pUnit.value)*0.12) + parseFloat(pUnit.value)
    let totalGanancia = (total * (parseFloat(ganancia.value)/100))+ total
    pVenta.value = totalGanancia.toFixed(2)
}

const llenarDatos = () => {
    detalle.value = prodDetalle.innerHTML
}

const llenarDatosEditar = () => {
    detalle.value = productoDetalle.innerHTML
    cantidad.value = productoCantidad.innerHTML
    btnEditar.style.display = 'block'
    btnAnadir.style.display = 'none'
}
const cantMax = () => {
    if(parseInt(cantidad.value) > prodStock.innerHTML ){
        errorCant.innerHTML=`
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            La cantidad indicada supera el stock
        </div>`
    }
}

const descargarExcel = () => {
    var table2excel = new Table2Excel();
    table2excel.export(document.querySelectorAll("#tabla"),"Productos_menor_stock");
}