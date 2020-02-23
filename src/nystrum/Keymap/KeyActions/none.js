import { Say } from '../../actions';
import * as Constant from '../../constants';

export const none = (engine) => {
  let actor = engine.actors[engine.currentActor];
  actor.setNextAction(new Say({
    message: 'standing still...',
    game: engine.game,
    actor,
    energyCost: Constant.ENERGY_THRESHOLD
  }))
}