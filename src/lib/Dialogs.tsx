import { Subject } from 'rxjs';
import BasicDialog from './dialogs/BasicDialog';

export { default as BasicDialog } from './dialogs/BasicDialog';

class Dialogs {

    private refs = {};

    addRef(name: string, ref: BasicDialog) {
        this.refs[name] = ref;
    }

    open(name: string) {
        this.refs[name].open();
    }

    close(name: string) {
        this.refs[name].cancel();
    }

    onOpen(name: string): Subject<{}> {
        return this.refs[name].onOpen;
    }

    onClose(name: string): Subject<{}> {
        return this.refs[name].onClose;
    }

    onSave(name: string): Subject<{}> {
        return this.refs[name].onSave;
    }

}

export default new Dialogs();
