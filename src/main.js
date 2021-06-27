const { app } = require('./app');

app.listen(app.get('puerto'), () => {
  console.log(`Servidor en el puerto: ${app.get('puerto')}`);
});
