import express from 'express';
import axios from 'axios';
import morgan from 'morgan';
import cors from 'cors';


const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.get('/users', (req, res) => {
    try {
     const getUser =  axios.get('http://localhost:3001/auth')

     res.send(getUser)
    } catch (error) {
        console.log(error)
    }
})

app.listen(3001, () => {
  console.log('Server started on port 3001')  
})