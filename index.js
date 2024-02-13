const express = require('express');
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

//Conectar a firebase
const serviceAccount = require('./permissions.json');
initializeApp({
  credential: cert(serviceAccount)
});

const app = express();
const db = getFirestore();

app.use(express.json());

//Escuchamos al puerto y redirijimos al html
const PORT = process.env.PORT || 4000;
app.listen(PORT, function() {
    console.log('listening to requests on prt ', PORT);
});

app.use(express.static('src'));

app.get('/all-empleados', async (req, res) => {
  try {
    const empleadosRef = db.collection('empleados');
    const query = await empleadosRef.get();
    const docs = query.docs;

    const response = docs.map(doc => ({
      id: doc.id,
      nombre: doc.data().nombre,
      codigo: doc.data().codigo,
      estado: doc.data().estado,
      salario: doc.data().salario
    }));

    return res.status(200).json(response);
    
  } catch (error) {
    return res.status(500).send(error);
  }
});

app.get('/all-empleados-activos', async (req, res) => {
  try {
    const empleadosRef = db.collection('empleados');
    const query = await empleadosRef.where('estado', '==' , true).get();
    const docs = query.docs;

    const response = docs.map(doc => ({
      id: doc.id,
      nombre: doc.data().nombre,
      codigo: doc.data().codigo,
      estado: doc.data().estado,
      salario: doc.data().salario
    }));

    return res.status(200).json(response);
    
  } catch (error) {
    return res.status(500).send(error);
  }
});

app.get('/all-empleados-inactivos', async (req, res) => {
  try {
    const empleadosRef = db.collection('empleados');
    const query = await empleadosRef.where('estado', '==' , false).get();
    const docs = query.docs;

    const response = docs.map(doc => ({
      id: doc.id,
      nombre: doc.data().nombre,
      codigo: doc.data().codigo,
      estado: doc.data().estado,
      salario: doc.data().salario
    }));

    return res.status(200).json(response);
    
  } catch (error) {
    return res.status(500).send(error);
  }
});

app.get('/empleados/:cadena', async (req, res) => {
  try {
    const empleadosRef = db.collection('empleados');
    const query = await empleadosRef.get();
    let docs = query.docs;
    docs = docs.filter(doc => doc.data().nombre.match(new RegExp(req.params.cadena, "i")));

    const response = docs.map(doc => ({
      id: doc.id,
      nombre: doc.data().nombre,
      codigo: doc.data().codigo,
      estado: doc.data().estado,
      salario: doc.data().salario
    }));

    return res.status(200).json(response);
    
  } catch (error) {
    return res.status(500).send(error);
  }
});

app.delete('/empleado/:id', async (req, res) => {
  try {
    const empleadoRef = db.collection('empleados').doc(req.params.id);
    await empleadoRef.delete();

    return res.status(200).json({mensaje: 'Empleado eliminado'});
    
  } catch (error) {
    return res.status(500).send(error);
  }
});

app.put('/empleado-estado/:id', async (req, res) => {
  try {
    const empleadoRef = db.collection('empleados').doc(req.params.id);
    await empleadoRef.update({
      estado: req.body.estado
    });

    return res.status(200).json({mensaje: 'Empleado actualizado'});
    
  } catch (error) {
    return res.status(500).send(error);
  }
});

app.post('/empleado', async (req, res) => {
  try {
    const empleadosRef = db.collection('empleados');
    await empleadosRef.add({
      nombre: req.body.nombre,
      codigo: req.body.codigo,
      estado: req.body.estado,
      salario: req.body.salario
    });

    return res.status(200).json({mensaje: 'Empleado agregado'});
    
  } catch (error) {
    return res.status(500).send(error);
  }
});