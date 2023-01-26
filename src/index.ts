import express, { Express, Request, Response } from 'express';

const app: Express = express();
app.use(express.json());

const PORT = 8191;

const stateCapitals: Record<string, string> = {
  Arkansas: 'Little Rock',
  Texas: 'Austin',
  Idaho: 'Salem',
};

function handleListenEvent(): void {
  console.log(`Listening on port http://127.0.0.1:${PORT}`);
}

function getCapital(req: Request, res: Response): void {
  if (req.query.state) {
    const { state } = req.query as CapitalRequestQuery;
    if (state in stateCapitals) {
      const stateCapital = stateCapitals[state];
      const stateData = {
        state,
        capital: stateCapital,
      };
      console.log(`User requested data for ${state}`);
      res.json(stateData);
    } else {
      console.log(`User requested data for ${state} but it is not in our dataset`);
      res.sendStatus(400);
    }
  } else {
    console.log('User is requesting all state data');
    res.json(stateCapitals);
  }
}

function addCapital(req: Request, res: Response): void {
  res.sendStatus(501); // 501 Not Implemented
}

app.get('/capital', getCapital);
app.post('/capital', addCapital);

app.listen(PORT, handleListenEvent);
