const SHA256 = require("crypto-js/sha256");
const Block = require("./block");

class Blockchain {
  constructor() {
    this.chain = [];
    this.height = -1;
    this.initializeChain();
  }

  async initializeChain() {
    if (this.height === -1) {
      const block = new Block({ data: "Genesis Block", monto:"0" });
      await this.addBlock(block);
    }
  }

  addBlock(block) {
    let self = this;
    return new Promise(async (resolve, reject) => {
      block.height = self.chain.length;
      block.time = new Date().getTime().toString();

      if (self.chain.length > 0) {
        block.previousBlockHash = self.chain[self.chain.length - 1].hash;
      }

      let errors = await self.validateChain();
      if (errors.length > 0) {
        reject(new Error("The chain is not valid: ", errors));
      }

      block.hash = SHA256(JSON.stringify(block)).toString();
      self.chain.push(block);
      resolve(block);
    });
  }

  validateChain() {
    let self = this;
    const errors = [];

    return new Promise(async (resolve, reject) => {
      self.chain.map(async (block) => {
        try {
          let isValid = await block.validate();
          if (!isValid) {
            errors.push(new Error(`The block ${block.height} is not valid`));
          }
        } catch (err) {
          errors.push(err);
        }
      });

      resolve(errors);
    });
  }

  validateBlock(height) {
    // Verificar si la altura es válida
    if (height < 0 || height >= this.chain.length) {
      return false;
    }
    // Obtener el bloque que se desea validar
    const block = this.chain[height];

    // Verificar si hay un bloque siguiente para comparar los hashes
    if (height === this.chain.length - 1) {
      return false;
    }

    // Obtener el siguiente bloque
    const nextBlock = this.chain[height + 1];

    console.log("Bloque actual "+ block.height+" Hash actual "+ block.hash);
    console.log("Bloque siguiente "+ nextBlock.height+ " Hash anterior " + nextBlock.previousBlockHash);

    // Verificar si el hash del bloque actual es igual al previous hash del siguiente bloque
    return block.hash === nextBlock.previousBlockHash;
  }

  print() {
    let self = this;
    let blockchainJSON = [];
    for (let block of self.chain) {
      // Parsea el bloque como objeto JSON y agrégalo a blockchainJSON
      blockchainJSON.push(JSON.parse(block.toString()));
    }
    // Devuelve blockchainJSON como resultado
    return blockchainJSON;
  }
  
}

module.exports = Blockchain;
