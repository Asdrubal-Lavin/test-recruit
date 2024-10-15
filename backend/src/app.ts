import express from 'express';
import nodeRoutes from './routes/nodeRoutes';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors({
    origin: 'http://localhost:4000', // Este codigo es para manejar CORS en ambiente local permitiendo solicitudes desde ese origen
    }));
app.use(express.json());

// Prefix para la api de nodos
app.use('/api', nodeRoutes);

app.listen(port, () => {
    console.log(`El servidor esta corrindo en el puerto ${port}`);
});
