import { CloneSelf } from '../../actions';

export const addBody = (engine) => {
  let actor = engine.actors[engine.currentActor];
  actor.addBodyPosition();
  engine.game.draw();
};