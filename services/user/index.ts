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

app.post('/auth', (req, res) => {
    try {
        const { username, password } = req.body

      const user =  axios.post('http://localhost:3001/auth', {
            username,
            password
        })

        res.send(user)
    } catch (error) {
        console.log(error)
    }
})

app.listen(3000, () => {
  console.log('Server started on port 3000')  
})