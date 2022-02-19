const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');

const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda: '',
    criptomoneda: ''
};

const obtenerCriptomonedas = criptomonedas => new Promise((resolve) => {
    resolve(criptomonedas);
})

document.addEventListener('DOMContentLoaded', () => {

    consultarCriptomonedas();

    formulario.addEventListener('submit', submitFormulario);

    criptomonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
});

function consultarCriptomonedas(){

    const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`;

    fetch(url)
        .then(respuesta => respuesta.json() )
        .then(resultado => obtenerCriptomonedas(resultado.Data))
        .then( criptomonedas => selectCriptomoneda(criptomonedas) )
}

function selectCriptomoneda( criptomonedas ){
    criptomonedas.forEach( cripto =>{
        const { Name, FullName } = cripto.CoinInfo;

        const opcion = document.createElement('option');
        opcion.value = Name;
        opcion.textContent = FullName;
        criptomonedasSelect.appendChild(opcion);

    });
}

function leerValor(e){
    objBusqueda[e.target.name] = e.target.value;
    // console.log(objBusqueda);
}

function submitFormulario(e){
    e.preventDefault();

    const { moneda, criptomoneda } = objBusqueda;

    if (moneda === '' || criptomoneda === '') {
        mostrarAlerta('Ambos campos son obligatorios');
        return;
    }

    consultarAPI();
}

function mostrarAlerta(mensaje){

    const exiteError = document.querySelector('.error');

    if (!exiteError) {
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('error');
        divMensaje.textContent = mensaje;
        formulario.appendChild(divMensaje);

        setTimeout( () => {
            divMensaje.remove();
        }, 3000);
    }
    
}

function consultarAPI(){
    const { moneda, criptomoneda } = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();

    fetch(url)
        .then( respuesta => respuesta.json() )
        .then( cotizacion => {
            mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
        } )
}

function mostrarCotizacionHTML(cotizacion) {

    limpiarHTML()
    
    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El precio es: <span>${PRICE}</span> `;

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `El precio más alto del día: <span>${HIGHDAY}</span>`;
    
    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `El precio más bajo del día: <span>${LOWDAY}</span>`;

    const ultimasHoras = document.createElement('p');
    ultimasHoras.innerHTML = `Varación últimas 24 horas: <span>${CHANGEPCT24HOUR}</span>`;

    const ultimasActualizacion = document.createElement('p');
    ultimasActualizacion.innerHTML = `Ultimas actualización: <span>${LASTUPDATE}</span>`;

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimasActualizacion);

    formulario.appendChild(resultado);

}

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarSpinner() {
    limpiarHTML();

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');

    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;

    resultado.appendChild(spinner);
}