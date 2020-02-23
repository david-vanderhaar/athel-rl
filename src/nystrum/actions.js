import * as Helper from '../helper';
import * as Action from './actions';
import * as Constant from './constants';
import { cloneDeep } from 'lodash';
import uuid from 'uuid/v1';
import { Particle } from './entites';
import { MESSAGE_TYPE } from './message';

export class Base {
  constructor({
    game, 
    actor, 
    energyCost = 100, 
    processDelay = 50, 
    particles = [], 
    particleTemplate = Constant.PARTICLE_TEMPLATES.default,
    onBefore = () => null,
    onAfter = () => null,
    onSuccess = () => null,
    onFailure = () => null,
    interrupt = false,
  }) {
    this.actor = actor
    this.game = game
    this.energyCost = energyCost
    this.processDelay = processDelay
    this.particles = particles
    this.particleTemplate = particleTemplate
    this.onBefore = onBefore
    this.onAfter = onAfter
    this.onSuccess = onSuccess
    this.onFailure = onFailure
    this.interrupt = interrupt
  }

  addParticle(
    life, 
    pos, 
    direction, 
    renderer = {...this.particleTemplate.renderer}, 
    type = Constant.PARTICLE_TYPE.directional, 
    path = null
  ) {
    let particle = new Particle({
      game: this.game,
      name: 'particle',
      passable: true,
      life,
      pos,
      direction,
      energy: 100,
      renderer,
      type,
      path,
    })
    this.particles.push(particle);
  }

  removeDeadParticles() {
    this.particles = this.particles.filter((particle) => particle.life > 0);
  }

  perform() {
    console.log(`${this.actor.name} performs`)
    this.actor.energy -= this.energyCost;
    return {
      success: true,
      alternative: null,
    }
  }
}

export class AddStatusEffect extends Base {
  constructor({ effect, processDelay = 0, ...args }) {
    super({ ...args });
    this.effect = effect
    this.processDelay = processDelay
  }

  perform() {
    let success = this.game.engine.addStatusEffect(this.effect);
    let positions = Helper.getPointsOnCircumference(this.actor.pos.x, this.actor.pos.y, 2);
    positions.forEach((pos) => {
      this.addParticle(
        5, 
        {...pos}, 
        {
          x: Math.sign(pos.x - this.actor.pos.x), 
          y: Math.sign(pos.y - this.actor.pos.y)
        },
      )
    })
    if (success) this.actor.energy -= this.energyCost;
    return {
      success,
      alternative: null,
    }
  }
};

export class Say extends Base {
  constructor({ message, processDelay = 50, ...args}) {
    super({...args});
    this.message = message
    this.processDelay = processDelay
  }
  perform() {
    this.game.addMessage(`${this.actor.name} says ${this.message}`, MESSAGE_TYPE.INFORMATION);
    this.actor.energy -= this.energyCost;
    return {
      success: true,
      alternative: null,
    }
  }
};

export class SayManyThings extends Base {
  constructor({ messages, processDelay = 50, ...args}) {
    super({...args});
    this.messages = messages
    this.processDelay = processDelay
  }
  perform() {
    let message = this.messages.shift();
    if (message) {
      this.game.addMessage(`${this.actor.name} says ${message}`, MESSAGE_TYPE.INFORMATION);
      this.actor.energy -= this.energyCost;
    }
    if (this.messages.length) {
      this.actor.setNextAction(this);
    }
    return {
      success: true,
      alternative: null,
    }
  }
};

export class EquipItemFromContainer extends Base {
  // entities can only equip items from their container/inventory
  constructor({ item, ...args }) {
    super({ ...args });
    this.item = item;
  }
  perform() {
    let success = false;
    let alternative = null;
    if (this.item.equipmentType) {
      let itemInSlot = this.actor.getItemInSlot(this.item.equipmentType);
      if (itemInSlot) {
        this.actor.addToContainer(itemInSlot);
        this.actor.unequip(itemInSlot);
      }
      this.actor.removeFromContainer(this.item);
      this.actor.equip(this.item.equipmentType, this.item);
      this.game.addMessage(`${this.actor.name} equips ${this.item.name}.`, MESSAGE_TYPE.ACTION);
      success = true;
    }

    this.actor.energy -= this.energyCost;
    
    return {
      success,
      alternative,
    }
  }
};

export class EquipItemFromTile extends Base {
  // entities can only equip items from their container/inventory
  constructor({ item, ...args }) {
    super({ ...args });
    this.item = item;
  }

  perform () {
    let success = false;
    let alternative = null;
    if (this.item.equipmentType) {
      let itemInSlot = this.actor.getItemInSlot(this.item.equipmentType);
      if (itemInSlot) {
        this.game.map[Helper.coordsToString(this.actor.pos)].entities.push(itemInSlot);
      }

      let entities = this.game.map[Helper.coordsToString(this.actor.pos)].entities
      this.game.map[Helper.coordsToString(this.actor.pos)].entities = entities.filter((it) => it.id !== this.item.id);
      
      this.actor.equip(this.item);
      this.game.addMessage(`${this.actor.name} equips ${this.item.name}.`, MESSAGE_TYPE.ACTION);
      success = true;
    }

    this.actor.energy -= this.energyCost;
    return {
      success,
      alternative,
    }
  }
};

export class UnequipItem extends Base {
  constructor({ item, ...args }) {
    super({ ...args });
    this.item = item;
  }
  perform() {
    this.game.addMessage(`${this.actor.name} puts ${this.item.name} away.`, MESSAGE_TYPE.ACTION);
    this.actor.unequip(this.item);
    this.actor.addToContainer(this.item);
    this.actor.energy -= this.energyCost;
    return {
      success: true,
      alternative: null,
    }
  }
};

export class DropItem extends Base {
  constructor({ item, ...args }) {
    super({ ...args });
    this.item = item;
  }
  perform() {
    this.game.addMessage(`${this.actor.name} drops ${this.item.name}.`, MESSAGE_TYPE.ACTION);
    this.actor.removeFromContainer(this.item);
    this.game.map[Helper.coordsToString(this.actor.pos)].entities.push(this.item);
    this.actor.energy -= this.energyCost;
    return {
      success: true,
      alternative: null,
    }
  }
};

export class PickupItem extends Base {
  constructor({ item, ...args }) {
    super({ ...args });
    this.item = item;
  }
  perform() {
    this.game.addMessage(`${this.actor.name} picks up ${this.item.name}.`, MESSAGE_TYPE.ACTION);
    this.actor.addToContainer(this.item);
    let entities = this.game.map[Helper.coordsToString(this.actor.pos)].entities
    this.game.map[Helper.coordsToString(this.actor.pos)].entities = entities.filter((it) => it.id !== this.item.id);
    this.actor.energy -= this.energyCost;
    return {
      success: true,
      alternative: null,
    }
  }
};

export class DestroySelf extends Base {
  constructor({processDelay = 0, ...args}) {
    super({...args});
    this.processDelay = processDelay
  }
  perform() {
    // console.log(`${this.actor.name} is self-destructing`);
    this.actor.energy -= this.energyCost;
    this.actor.destroy();
    return {
      success: true,
      alternative: null,
    }
  }
};

export class CloneSelf extends Base {
  constructor({cloneArgs = [], ...args}) {
    super({...args});
    this.cloneArgs = cloneArgs;
  }

  perform() {
    let success = false;
    if (this.actor.createClone(this.cloneArgs)) {
      success = true;
      this.actor.energy -= this.energyCost;
      this.game.addMessage(`${this.actor.name} is cloning itself`, MESSAGE_TYPE.ACTION);
    }
    // let clone = cloneDeep(this.actor);
    // clone.game = this.actor.game;
    // clone.id = uuid();
    // this.cloneArgs.forEach((arg) => {
    //   console.log(arg);
      
    //   clone[arg.attribute] = arg.value
    // });
    // if (this.game.placeActorOnMap(clone)) {
    //   this.game.engine.addActorAsNext(clone);
    //   this.game.draw();
    //   success = true;
    // };
    return {
      success,
      alternative: null,
    }
  }
};

export class Charge extends Base {
  constructor({chargeAmount, ...args}) {
    super({...args});
    this.chargeAmount = chargeAmount;
  }
  perform() {
    this.game.addMessage(`${this.actor.name} is charging up!`, MESSAGE_TYPE.ACTION);
    this.actor.energy -= this.energyCost;
    this.actor.increaseCharge(this.chargeAmount);
    return {
      success: true,
      alternative: null,
    }
  }
};

export class Release extends Base {
  constructor({ chargeCost, ...args }) {
    super({ ...args });
    this.chargeCost = chargeCost;
  }
  perform() {
    let success = false;
    if (this.actor.charge >= this.chargeCost) {
      this.game.addMessage(`${this.actor.name} is releasing ${this.chargeCost} volts!`, MESSAGE_TYPE.ACTION);
      this.actor.energy -= this.energyCost;
      this.actor.decreaseCharge(this.chargeCost);
      success = true;
    }
    return {
      success,
      alternative: null,
    }
  }
};

export class Sign extends Base {
  constructor({ sign, ...args }) {
    super({ ...args });
    this.sign = sign;
  }
  perform() {
    this.game.addMessage(`${this.actor.name} threw a ${this.sign.name} sign.`, MESSAGE_TYPE.ACTION);
    this.actor.addSign(this.sign);
    this.actor.energy -= this.energyCost;
    return {
      success: true,
      alternative: null,
    }
  }
};

export class SignRelease extends Base {
  constructor({requiredSequence = [], ...args}) {
    super({...args});
    this.requiredSequence = requiredSequence;
  }

  requiredSequenceIsFulfilled () {
    let signHistory = this.actor.signHistory.concat();
    let relevantHistory = signHistory.slice(
      Math.max(signHistory.length - this.requiredSequence.length, 0)
    )
    let result = JSON.stringify(relevantHistory) === JSON.stringify(this.requiredSequence);
    return result
  }

  perform() {
    let success = false;
    if (this.requiredSequenceIsFulfilled()) {
      this.game.addMessage(
        `${this.actor.name} is releasing the power of ${this.requiredSequence.map(
          (sign) => sign.type
        ).join(' and ')}!`,
        MESSAGE_TYPE.ACTION
      );
      this.actor.energy -= this.energyCost;
      success = true;
      this.actor.clearSigns();
    }
    return {
      success,
      alternative: null,
    }
  }
};

export class CursorMove extends Base {
  constructor({ targetPos, processDelay = 0, ...args}) {
    super({...args});
    this.targetPos = targetPos
    this.processDelay = processDelay
  }
  perform() {
    let success = false;
    let alternative = null;

    if (this.game.cursorCanOccupyPosition(this.targetPos)) {
      let tile = this.game.map[Helper.coordsToString(this.actor.pos)]
      this.game.map[Helper.coordsToString(this.actor.pos)] = { ...tile, entities: tile.entities.filter((e) => e.id !== this.actor.id) }
      this.actor.pos = this.targetPos
      this.game.map[Helper.coordsToString(this.targetPos)].entities.push(this.actor);
      success = true;
    }

    return {
      success,
      alternative,
    }
  }
};

export class ParticleMove extends CursorMove {
  constructor({...args}) {
    super({...args})
  }

  perform () {
    this.actor.energy -= this.energyCost;
    if (this.actor.energy <= 0) {
      this.actor.destroy();
      return { success: false }
    } 
    return super.perform();
  }
}

export class PlaceActor extends Base {
  constructor({ targetPos, entity, ...args}) {
    super({...args});
    this.targetPos = targetPos
    this.entity = entity
  }
  perform() {
    let success = false;
    let alternative = null;
    
    // let canPlace = true;
    // if (!this.game.canOccupyPosition(this.targetPos, this.entity)) canPlace = false;
    // if (this.entity.entityTypes.includes('PARENT')) {
    //   this.entity.children.forEach((child) => {
    //     console.log(child.pos);
        
    //     if (!this.game.canOccupyPosition(child.pos, child)) canPlace = false;
    //   })
    // }

    // if (canPlace) {
    //   this.entity.pos = this.targetPos;
    //   this.game.engine.addActorAsPrevious(this.entity);
    //   this.game.engine.start(); // should this be used outside of engine?
    //   success = true;      
    // }
    if (this.game.canOccupyPosition(this.targetPos, this.entity)) {
      this.entity.pos = this.targetPos;
      // this.game.engine.addActorAsPrevious(this.entity);
      // this.game.engine.addActor(this.entity);
      this.game.engine.addActorAsNext(this.entity);
      this.interrupt = true;
      // this.game.engine.start(); // BUGGED - should this be used outside of engine?
      success = true;
    }
      
    if (success) {
      this.actor.energy -= this.energyCost;
    }
    
    return {
      success,
      alternative,
    }
  }
};

export class PlaceItem extends Base {
  constructor({ targetPos, entity, processDelay = 25, ...args}) {
    super({...args});
    this.targetPos = targetPos
    this.processDelay = processDelay
    this.entity = entity
  }
  perform() {
    let success = false;
    let alternative = null;
    
    if (this.game.canOccupyPosition(this.targetPos, this.entity)) {
      this.entity.pos = this.targetPos;
      success = this.game.placeActorOnMap(this.entity)
    }
      
    if (success) {
      this.actor.energy -= this.energyCost;
    }
    
    return {
      success,
      alternative,
    }
  }
};

export class PlaceItems extends PlaceItem {
  constructor({targetPositions = [], ...args}) {
    super({...args});
    this.targetPositions = targetPositions
  }
  perform() {
    let success = false;
    let alternative = null;
    this.targetPositions.forEach((targetPos) => {
      if (this.game.canOccupyPosition(targetPos, this.entity)) {
        let clone = cloneDeep(this.entity);
        clone.game = this.game;
        clone.id = uuid();
        clone.pos = targetPos;
        let placementSuccess = this.game.placeActorOnMap(clone);
        if (placementSuccess) success = true;
      }
    });

    if (success) this.actor.energy -= this.energyCost;

    return {
      success,
      alternative,
    }
  }
};

export class Move extends Base {
  constructor({ targetPos, processDelay = 25, ...args}) {
    super({...args});
    this.targetPos = targetPos
    this.processDelay = processDelay
  }
  perform() {
    let success = false;
    let alternative = null;
    let moveSuccess = this.actor.move(this.targetPos);
    if (moveSuccess) {
      this.actor.energy -= this.energyCost;
      success = true;
    } else {
      success = true;
      alternative = new Action.Attack({
        targetPos: this.targetPos,
        game: this.game, 
        actor: this.actor, 
        energyCost: Constant.ENERGY_THRESHOLD
      })
    }

    return {
      success,
      alternative,
    }
  }
};

export class ProjectileMove extends Base {
  constructor({ targetPos, damageToSelf = 1, processDelay = 25, ...args}) {
    super({...args});
    this.targetPos = targetPos
    this.processDelay = processDelay
    this.damageToSelf = damageToSelf
  }

  perform() {
    let success = false;
    let alternative = null;
    let moveSuccess = this.actor.move(this.targetPos);
    if (moveSuccess) {
      this.actor.energy -= this.energyCost;
      success = true;
    } else {
      success = true;
      alternative = new Action.SelfDestructiveAttack({
        targetPos: this.targetPos,
        game: this.game, 
        actor: this.actor, 
        energyCost: Constant.ENERGY_THRESHOLD,
        damageToSelf: this.damageToSelf,
      })
    }

    return {
      success,
      alternative,
    }
  }
};

export class MoveMultiple extends Base {
  constructor({ direction, stepCount, processDelay = 25, ...args}) {
    super({...args});
    this.direction = direction;
    this.stepCount = stepCount;
    this.processDelay = processDelay;
  }
  perform() {
    let success = false;
    let alternative = null;
    let newX = this.actor.pos.x + this.direction[0];
    let newY = this.actor.pos.y + this.direction[1];
    let targetPos = { x: newX, y: newY };
    
    if (this.stepCount > 0 && this.actor.move(targetPos)) {
      this.stepCount -= 1;
      this.actor.energy -= this.energyCost;
      this.actor.setNextAction(this);
      success = true;
    } else {
      success = true;
      alternative = new Action.Attack({
        targetPos: targetPos,
        game: this.game, 
        actor: this.actor, 
        energyCost: Constant.ENERGY_THRESHOLD
      })
    }

    return {
      success,
      alternative,
    }
  }
};

export class Shove extends Base {
  constructor({ targetPos, direction, ...args }) {
    super({ ...args });
    this.targetPos = targetPos
    this.direction = direction
  }
  perform() {
    let success = false;
    let alternative = null;
    let moveSuccess = this.actor.shove(this.targetPos, this.direction)
    
    if (moveSuccess) {
      this.actor.energy -= this.energyCost;
      success = true;
    } else {
      success = true;
      alternative = new Action.Attack({
        targetPos: this.targetPos,
        game: this.game,
        actor: this.actor,
        energyCost: Constant.ENERGY_THRESHOLD
      })
    }

    return {
      success,
      alternative,
    }
  }
};

export class Tackle extends MoveMultiple {
  constructor({ direction, stepCount, additionalAttackDamage = 0, processDelay = 25, ...args}) {
    super({...args});
    this.direction = direction;
    this.stepCount = stepCount;
    this.additionalAttackDamage = additionalAttackDamage;
    this.processDelay = processDelay;
  }
  perform() {
    let success = false;
    let alternative = null;
    let newX = this.actor.pos.x + this.direction[0];
    let newY = this.actor.pos.y + this.direction[1];
    let targetPos = { x: newX, y: newY };
    
    if (this.stepCount > 0 && this.actor.shove(targetPos, this.direction)) {
      this.stepCount -= 1;
      this.actor.energy -= this.energyCost;
      this.actor.setNextAction(this);
      for (let i = 0; i < 3; i++) {
        this.addParticle(
          1,
          {
            x: this.actor.pos.x - (this.direction[0] * i),
            y: this.actor.pos.y - (this.direction[1] * i),
          },
          { x: 0, y: 0 }
        )
      }
      success = true;
    } else {
      success = true;
      this.actor.attack(targetPos, this.additionalAttackDamage);
    }

    return {
      success,
      alternative,
    }
  }
};

export class Attack extends Base {
  constructor({ targetPos, processDelay = 100, ...args}) {
    super({...args});
    this.targetPos = targetPos
    this.processDelay = processDelay
    this.particleTemplate = Constant.PARTICLE_TEMPLATES.damage
  }
  perform() {
    let success = false;
    let alternative = null;
    
    if (!this.actor.entityTypes.includes('ATTACKING')) { 
      return { 
        success: true, 
        alternative: new Action.Say({
          message: `Ooh I don\'t know how to attack`,
          game: this.game,
          actor: this.actor,
        }),
      } 
    }
    
    success = this.actor.attack(this.targetPos);
    if (success) {
      this.addParticle(1, {...this.targetPos}, {x: 0, y:0})
      this.actor.energy -= this.energyCost;
    }

    return {
      success,
      alternative,
    }
  }
};

export class SelfDestructiveAttack extends Attack {
  constructor({ damageToSelf, ...args }) {
    super({ ...args });
    this.damageToSelf = damageToSelf
    this.onSuccess = () => {
      console.log('Self destruct success');
      this.actor.decreaseDurabilityWithoutDefense(damageToSelf)
    }
    this.onFailure = () => {
      console.log('Self destruct fails');
      this.actor.destroy()
    }
  }
}

export class MultiTargetAttack extends Base {
  constructor({ targetPositions, processDelay = 25, ...args }) {
    super({ ...args });
    this.targetPositions = targetPositions
    this.processDelay = processDelay
  }

  perform() {
    let success = false;
    let alternative = null;
    
    if (!this.actor.entityTypes.includes('ATTACKING')) {
      return {
        success: true,
        alternative: new Action.Say({
          message: `Ooh I don\'t know how to attack`,
          game: this.game,
          actor: this.actor,
        }),
      }
    }

    let particlePath = [];
    let particlePos = { x: this.actor.pos.x, y: this.actor.pos.y };
    let renderer = this.particleTemplate.renderer;
    this.targetPositions.forEach((targetPos) => {
      let attackSuccess = this.actor.attack(targetPos);
      particlePath.push(targetPos);
      if (attackSuccess) success = true
    })
    this.addParticle(
      particlePath.length + 1, 
      particlePos, 
      null, 
      renderer, 
      Constant.PARTICLE_TYPE.path, 
      particlePath
    )
    
    if (success) { 
      this.actor.energy -= this.energyCost; 
    }

    return {
      success,
      alternative,
    }
  }
};

export class ThrowProjectile extends Move {
  constructor({ ...args }) {
    super({ ...args });
  }

  perform () {
    let success = false;
    let alternative = null;
    this.actor.passable = false;
    let move_result = super.perform();

    if (move_result.success) {
      this.actor.path.shift();
      success = true;
    }
    if (this.actor.path.length === 0) {
      success = true;
      alternative = new Action.DestroySelf({
        game: this.game,
        actor: this.actor,
        energyCost: Constant.ENERGY_THRESHOLD,
        processDelay: 0,
      });
    }
    if (move_result.alternative) {
      let attackSuccess = this.actor.attack(this.targetPos);
      if (attackSuccess) {
        alternative = new Action.DestroySelf({
          game: this.game,
          actor: this.actor,
          energyCost: Constant.ENERGY_THRESHOLD,
          processDelay: 0,
        });
      }
    }

    return {
      success,
      alternative,
    }
  }
}

export class ThrowProjectileGas extends Move {
  constructor({ ...args }) {
    super({ ...args });
    this.processDelay = 0
  }

  perform () {
    let success = false;
    let alternative = null;
    this.actor.passable = false;
    let move_result = super.perform();
    if (move_result.success) {
      this.actor.path.shift();
      success = true;
    } 
    if (this.actor.path.length === 0) {
      success = true;
      alternative = new Action.DestroySelf({
        game: this.game,
        actor: this.actor,
        energyCost: Constant.ENERGY_THRESHOLD,
        processDelay: 0,
      });
    }
    if (move_result.alternative) {
      this.actor.attack(this.targetPos)
    }

    return {
      success,
      alternative,
    }
  }
}

export class CrankEngine extends Base {
  constructor({ engine, ...args }) {
    super({ ...args });
    this.engine = engine;
  }
  async perform() {
    let success = true;
    let alternative = null;

    console.log(`${this.actor.name} is cranking its engine.`);
    try {
      await this.engine.start();
      this.actor.energy -= this.energyCost;
    } catch (error) {
      console.log('CrankEngine');
      console.log(error);
      alternative = new Action.DestroySelf({
        game: this.game,
        actor: this.actor,
        energyCost: Constant.ENERGY_THRESHOLD,
      });
    }
    
    return {
      success,
      alternative,
    }
  }
};
