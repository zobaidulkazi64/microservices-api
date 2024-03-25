import express from 'express';
import axios from 'axios';
import morgan from 'morgan';
import cors from 'cors';


const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));


app.get('/health', (req, res) => {
    res.send('Hello!, I am live on!, on port 4003');
})



const port = process.env.PORT || 4003
const serviceName = process.env.SERVICE_NAME || 'inventory-service'

app.listen(port, () => {
  console.log(`${serviceName} started on port ${port}`)  
})