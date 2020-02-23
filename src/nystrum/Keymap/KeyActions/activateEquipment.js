import { UI_Actor } from '../../entites';
import { UnequipItem } from '../../actions';
import { addAlphabeticallyToKeymap, deactivateUIKeymap } from '../helper';

const keymapEquipment = (engine, initiatedBy) => {
  let keymap = {
    Escape: {
      activate: () => deactivateUIKeymap(engine, 'visibleEquipment'),
      label: 'Close',
    }
  };

  initiatedBy.equipment.filter((slot) => slot.item).map((slot) => {
    let obj = {
      activate: null,
      label: ''
    }
    obj['activate'] = () => {
      console.log(`setting action for ${initiatedBy.name} to unequip ${slot.item.name}`);
      initiatedBy.setNextAction(new UnequipItem({
        item: slot.item,
        game: engine.game,
        actor: initiatedBy,
      }))
      deactivateUIKeymap(engine, 'visibleEquipment');
    }
    obj['label'] = `Unequip ${slot.name}`;
    addAlphabeticallyToKeymap(keymap, obj);
    return true;
  })

  return keymap;
}

export const activateEquipment = (engine) => {
  let currentActor = engine.actors[engine.currentActor]
  engine.game.visibleEquipment = currentActor.equipment;

  let ui = new UI_Actor({
    initiatedBy: currentActor,
    pos: { ...currentActor.pos },
    renderer: {
      character: 'E',
      color: 'white',
      background: '',
    },
    name: 'Equipment',
    game: engine.game,
  })
  engine.addActorAsPrevious(ui);
  engine.game.placeActorOnMap(ui)
  engine.game.draw()
  ui.keymap = keymapEquipment(engine, currentActor);
}