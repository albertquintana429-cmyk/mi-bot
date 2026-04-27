// utils.js
async function someAsyncOperation() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Operación completada");
    }, 1000);
  });
}

module.exports = { someAsyncOperation };

  