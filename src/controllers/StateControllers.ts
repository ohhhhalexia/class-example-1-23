import { Request, Response } from 'express';
import Statesmodel 

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
  