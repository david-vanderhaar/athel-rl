import { PickupItem } from '../../actions';
import { ENERGY_THRESHOLD } from '../../constants';
import { coordsToString, getRandomInArray } from '../../../helper';

export const pickupRandom = (engine) => {
  let actor = engine.actors[engine.currentActor];
  let entities = engine.game.map[coordsToString(actor.pos)].entities.filter((e) => e.id !== actor.id);
  if (entities.length > 0) {
    actor.setNextAction(new PickupItem({
      item: getRandomInArray(entities),
      game: engine.game,
      actor,
      energyCost: ENERGY_THRESHOLD
    }));
  }
  else {
    console.log('nothing to pickup.');
  }
};