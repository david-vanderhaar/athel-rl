import * as Helper from '../lib/helper';

export const createEntity = (id = null, name = 'Empty', components = {}, world) => {
  let entity = {
    id,
    name,
    components,
    world,
    sendEvent: (target, eventType, parameters) => sendEvent(target, eventType, parameters, world),
  };
  return entity
}

export const sendEvent = async (target = null, eventType = null, parameters = null, world = null) => {
  let success = false;
  for (let key in target.components) {
    let component = target.components[key]
    if (component.hasOwnProperty(eventType)) {
      console.log('SUCCESSFUL EVENT: ', eventType)
      success = true
      if (eventType !== 'PREPARE_RENDER') {
        await Helper.delay();
      }
      component[eventType]({ ...parameters, self: target, component: component });
      Helper.DRAW(world.map, world.display)
    }
  }
  if (!success) {
    console.log('FAILED EVENT')
  }
};