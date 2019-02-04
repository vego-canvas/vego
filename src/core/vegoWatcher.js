export default class VegoWatcher {
    constructor(id) {
        this.id = id;
    }
}
export const VegoRenderWatcher = new VegoWatcher('VegoWatcher');

export class VegoGeoWatcher extends VegoWatcher {}
