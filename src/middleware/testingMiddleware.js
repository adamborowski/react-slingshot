import {availableScoreSelector, createSession} from "../selectors/testingSelectors.js";
import {SESSION_SCORE, SESSION_CREATE} from "../constants/actionTypes";
import {push} from 'react-router-redux';

export default  store => next => action => {
  const state = store.getState();
  switch (action.type) {
    case SESSION_SCORE:
      const session = createSession(state);
      const maxAvailable = availableScoreSelector(state);
      const currentSession = session.Session.withId(action.sessionId);
      const currentSessionScore = currentSession.score;
      const currentScenario = currentSession.scenario;
      const otherScoredSessions = currentScenario.sessions.all().toModelArray().filter(a => a.id !== currentSession.id && a.score > 0);

      if (otherScoredSessions.length === 0) {
        if (action.score - currentSessionScore > maxAvailable) {
          action.score = maxAvailable + currentSessionScore;
        }
      }
      else {
        //todo next(dialogAction('There is already scored session, only one can be scored at a time', {cancel, override:overrideAction()}));
        console.log('There is already scored session, only one can be scored at a time');
        return;
      }
      break;
  }

  next(action);

  switch (action.type) {
    case SESSION_CREATE:
      const newItem = state.orm.Session.meta.maxId;
      const session = createSession(state);

      let action2 = push(`/scenario/${action.payload.scenario}/session/${newItem}`);
      store.dispatch(action2);
      break;
  }

};
