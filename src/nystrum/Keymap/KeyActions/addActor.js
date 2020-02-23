import * as Helper from '../../../helper';
import { Bandit, RangedBandit } from '../../entites';
import * as Item from '../../items';

const getBanditStats = () => {
  let banditLevels = [
    {
      name: 'Slingshot',
      renderer: {
        character: Helper.getRandomInArray(['r']),
        color: '#ced5dd',
        background: '',
      },
      durability: 1,
      attackDamage: 1,
      speed: 100,
      entityClass: RangedBandit
    },
    {
      name: 'Buckshot',
      renderer: {
        character: Helper.getRandomInArray(['r']),
        color: '#3fc072',
        background: '',
      },
      durability: 2,
      attackDamage: 1,
      speed: 200,
      entityClass: RangedBandit
    },
    {
      name: 'Ross',
      renderer: {
        character: Helper.getRandomInArray(['b']),
        color: '#ced5dd',
        background: '',
      },
      durability: 1,
      attackDamage: 1,
      speed: 100,
      entityClass: Bandit
    },
    {
      name: 'Kevin',
      renderer: {
        character: Helper.getRandomInArray(['b']),
        color: '#3fc072',
        background: '',
      },
      durability: 2,
      attackDamage: 1,
      speed: 100,
      entityClass: Bandit
    },
    {
      name: 'Jacob',
      renderer: {
        character: Helper.getRandomInArray(['b']),
        color: '#67a1d7',
        background: '',
      },
      durability: 3,
      attackDamage: 1,
      speed: 100,
      entityClass: Bandit
    },
    {
      name: 'Jarod',
      renderer: {
        character: Helper.getRandomInArray(['b']),
        color: '#e16264',
        background: '',
      },
      durability: 1,
      attackDamage: 5,
      speed: 300,
      entityClass: Bandit
    },
    {
      name: 'Bigii',
      renderer: {
        character: Helper.getRandomInArray(['b']),
        color: '#9f62e1',
        background: '',
      },
      durability: 15,
      attackDamage: 10,
      speed: 100,
      entityClass: Bandit
    },
  ]
  return Helper.getRandomInArray(banditLevels);

}

export const addActor = (game) => {
  let targetEntity = game.engine.actors[game.engine.currentActor]
  let pos = Helper.getRandomPos(game.map).coordinates
  const banditStats = getBanditStats();
  // let actor = new RangedBandit({
  let actor = new banditStats.entityClass({
    targetEntity,
    pos,
    renderer: banditStats.renderer,
    name: banditStats.name,
    game,
    actions: [],
    attackDamage: banditStats.attackDamage,
    durability: banditStats.durability,
    speed: banditStats.speed,
    // directional projectile destruction breaks engine
    getProjectile: ({pos, targetPos, direction, range}) => Item.directionalKunai(game.engine, { ...pos }, direction, range)
    // getProjectile: ({ pos, targetPos, direction, range }) => Item.kunai(game.engine, { ...pos }, { ...targetPos })
  })
  // game.placeActorOnMap(actor)
  if (game.randomlyPlaceActorOnMap(actor)) {
    game.engine.addActor(actor);
    game.draw();
  };
}