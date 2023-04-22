import express, { Express } from 'express';
import StateController from './controllers/StateControllers';

const app: Express = express();
app.use(express.json());

const PORT = 8191;

//function handleListenEvent(): void {
//  console.log(`Listening on port http://127.0.0.1:${PORT}`);
//}

app.get('/capital', StatesController.getCapital);
app.post('/capital', StatesController.addCapital);

// app.listen(PORT, handleListenEvent);
app.listen(PORT, () => console.log('Listening on port http://127.0.0.1:${PORT}`));

//() => console.log('Listening on port http://127.0.0.1:${PORT}`));

//function handleListenEvent() {
//  console.log(`Listening on port http://127.0.0.1:${PORT}`);
//}
