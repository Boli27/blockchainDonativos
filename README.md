blockchainHTML += `<p><strong>Donativo ${index}:</strong><br>`;
          blockchainHTML += `<strong>Hash: </strong> ${block.hash}<br>`;
          blockchainHTML += `<strong>Hash previo: </strong>${block.previousBlockHash}<br>`;
          blockchainHTML += `<strong>Origen: </strong> ${block.body.origen}<br>`;
          blockchainHTML += `<strong>Destino: </strong> ${block.body.destino}<br>`;
          blockchainHTML += `<strong>Monto: </strong> ${block.body.monto}<br>`;
          blockchainHTML += `<strong>Informacion Adicional: </strong> ${block.body.info}</p>`;
