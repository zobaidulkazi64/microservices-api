import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import route from './routes'


const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));


// call routes
app.use('/api', route);

app.get('/health', (req, res) => {
    res.status(200).send('Hello!, I am live on!, on port 4000');
})



const port = process.env.PORT || 4000
const serviceName = process.env.SERVICE_NAME || 'user-service'

app.listen(port, () => {
  console.log(`${serviceName} started on port ${port}`)  
})