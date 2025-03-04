const mongoose = require('mongoose');

const MONGO_URL = 'mongodb+srv://juancamilohernandez200:juancamilo@cluster0.rpl9q.mongodb.net/';

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => console.error('❌ Error al conectar:', err));

module.exports = mongoose;
