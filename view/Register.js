document.getElementById('blockForm').addEventListener('submit', async function(event) {
  event.preventDefault(); // Evitar que se envíe el formulario de forma predeterminada
    // Validar que los campos no estén vacíos
    const origen = document.getElementById('origen').value.trim();
    const destino = document.getElementById('destino').value.trim();
    const monto = document.getElementById('monto').value.trim();
    const info = document.getElementById('info').value.trim();

    if (origen === '' || destino === '' || monto === ''|| info === '') {
        mostrarAlerta('danger', 'Todos los campos son requeridos', 'alertaResultadoform');
        return; // Detener el proceso si algún campo está vacío
    }

    // Si todos los campos están llenos, agregar el bloque
    await agregarBloque();
});

async function agregarBloque() {
  const formData = new FormData(document.getElementById('blockForm'));
  const data = {
      origen: formData.get('origen'),
      destino: formData.get('destino'),
      monto: formData.get('monto'),
      info: formData.get('info')
  };

  try {
      const response = await fetch('http://localhost:3000/block', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      });

      if (response.ok) {
          console.log('Bloque agregado exitosamente');
          mostrarAlerta('success', 'Bloque Agregado exitosamente','alertaResultadoform')
          // Actualizar la visualización de la cadena de bloques
          CreateBlockchain();
      } else {
          console.error('Error al agregar el bloque');
          mostrarAlerta('danger', 'Error al agregar el bloque','alertaResultadoform')
      }
  } catch (error) {
      console.error('Error al agregar el bloque:', error);
      mostrarAlerta('danger', 'Error al agregar el bloque','alertaResultadoform')
  }
}

async function CreateBlockchain() {
  try {
      const response = await fetch('http://localhost:3000/blockchain');
      if (!response.ok) {
          throw new Error('Error al obtener la cadena de bloques');
      }
      const data = await response.json();

      // Construir el HTML para mostrar la cadena de bloques
      let blockchainHTML = '<h2>Donativos / Cadena de bloques</h2>';
      data.chain.forEach((block, index) => {
          blockchainHTML += `<p><strong>Donativo ${index}:</strong><br>`;
          blockchainHTML += `Hash: ${block.hash}<br>`;
          blockchainHTML += `Hash Previo: ${block.previousBlockHash}<br>`;
          blockchainHTML += `Origen: ${block.body.origen}<br>`;
          blockchainHTML += `Destino: ${block.body.destino}<br>`;
          blockchainHTML += `Monto: ${block.body.monto}<br>`;
          blockchainHTML += `Informacion Adicional: ${block.body.info}</p>`;
      });

      // Mostrar la cadena de bloques en el elemento con el id blockchainDisplay
      document.getElementById('blockchainDisplay').innerHTML = blockchainHTML;
  } catch (error) {
      console.error('Error al obtener la cadena de bloques:', error);
  }
}

// Llamar a la función displayBlockchain al cargar la página para mostrar la cadena de bloques actual
CreateBlockchain();

async function validateBlockChain() {
  try {
      const response = await fetch('http://localhost:3000/blockchain/validate');
      if (!response.ok) {
          throw new Error('Error al validar la cadena de bloques');
      }
      const data = await response.json();
      mostrarAlerta('success', data.message, 'alertaResultado');
  } catch (error) {
      mostrarAlerta('danger', 'Error al validar la cadena de bloques: ' + error.message, 'alertaResultado');
  }
}

function validateBlock() {
  const blockHeight = document.getElementById('blockHeight').value;

  // Realiza el fetch para validar el bloque
  fetch(`http://localhost:3000/blockchain/validate1/${blockHeight}`)
      .then(response => response.json())
      .then(data => {
          // Determinar el tipo de alerta según el resultado
          let tipoAlerta = '';
          let mensajeAlerta = '';

          if (data.message.includes('es el mas reciente')) {
              tipoAlerta = 'info';
          } else {
              tipoAlerta = data.message.includes('autentico') ? 'success' : 'danger';
          }
          mensajeAlerta = data.message;
          mostrarAlerta(tipoAlerta, mensajeAlerta, 'alertaResultado');
      })
      .catch(error => {
          console.error('Error al validar el bloque:', error);
          // Mostrar un mensaje de error en caso de fallo
          mostrarAlerta('danger', 'Error al validar el bloque', 'alertaResultado');
      });
}

function mostrarAlerta(tipo, mensaje, elemento) {
  const alertaElemento = document.getElementById(elemento);
  // Limpiar todas las clases existentes
  alertaElemento.className = 'alert';
  // Aplicar la clase de Bootstrap según el tipo de alerta
  alertaElemento.classList.add('alert-' + tipo);
  // Mostrar el mensaje
  alertaElemento.textContent = mensaje;
}
