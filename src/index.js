const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('./BC/blockchain');
const Block = require("./BC/block");

const app = express();
const blockchain = new Blockchain();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

// Ruta para obtener la cadena de bloques completa
app.get('/blockchain', (req, res) => {
    const chain = blockchain.print();
    res.json({chain}); // Envía la cadena de bloques como respuesta al cliente en formato JSON
  });
  
// Ruta para agregar un nuevo bloque
app.post('/block', (req, res) => {
    const { monto, origen, destino, info } = req.body;
    
    // Crear un nuevo bloque utilizando la clase Block
    const newBlock = new Block({ monto, origen, destino, info });
  
    // Agregar el nuevo bloque a la cadena de bloques
    blockchain.addBlock(newBlock).then((block) => {
      res.json({ message: 'Nuevo bloque agregado', block });
    }).catch((error) => {
      res.status(500).json({ error: error.message });
    });
});
  

// Ruta para validar la cadena de bloques
app.get('/blockchain/validate', (req, res) => {
  blockchain.validateChain().then((errors) => {
    if (errors.length === 0) {
      res.json({ message: 'La cadena de bloques es válida' });
    } else {
      res.json({ message: 'La cadena de bloques no es válida', errors });
    }
  }).catch((error) => {
    res.status(500).json({ error: error.message });
  });
});

app.get('/blockchain/validate1/:height', (req, res) => {
    const height = parseInt(req.params.height);
  
    // Valida el bloque en la cadena de bloques
    const bloquereciente = blockchain.chain.length - 1;
  
    if (height === bloquereciente) {
        res.json({ message: `El bloque en la altura ${height} es el mas reciente en la cadena` });
    }
     
    if (height > bloquereciente){
      res.json({ message: `El bloque en la altura ${height} no existe` });
    }else {
        // Valida el bloque en la cadena de bloques
        const isValid = blockchain.validateBlock(height);

        if (isValid) {
            res.json({ message: `El bloque en la altura ${height} es autentico` });
        } else {
            res.json({ message: `El bloque en la altura ${height} ha sido alterado, y no coincide en la cadena` });
        }
    }

  });

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor Express iniciado en el puerto ${PORT}`);
});
