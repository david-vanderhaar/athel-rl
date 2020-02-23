import { MultiTargetAttack} from '../../actions';
import { ENERGY_THRESHOLD, PARTICLE_TEMPLATES } from '../../constants';

export const leafWhirlwind = (engine) => {
  let actor = engine.actors[engine.currentActor];
  let targetPositions = [
    {
      x: actor.pos.x - 1,
      y: actor.pos.y,
    },
    {
      x: actor.pos.x - 1,
      y: actor.pos.y - 1,
    },
    {
      x: actor.pos.x,
      y: actor.pos.y - 1,
    },
    {
      x: actor.pos.x + 1,
      y: actor.pos.y - 1,
    },
    {
      x: actor.pos.x + 1,
      y: actor.pos.y,
    },
    {
      x: actor.pos.x + 1,
      y: actor.pos.y + 1,
    },
    {
      x: actor.pos.x,
      y: actor.pos.y + 1,
    },
    {
      x: actor.pos.x - 1,
      y: actor.pos.y + 1,
    },
  ]

  actor.setNextAction(new MultiTargetAttack({
    targetPositions,
    game: engine.game,
    actor,
    energyCost: (ENERGY_THRESHOLD * 8),
    particleTemplate: PARTICLE_TEMPLATES.leaf,
  }))
}