import { CloneSelf } from '../../actions';

export const cloneSelf = (engine, cloneOverrides = []) => {
  let actor = engine.actors[engine.currentActor];
  actor.setNextAction(new CloneSelf({
    game: engine.game,
    actor,
    cloneArgs: cloneOverrides,
  }));
};