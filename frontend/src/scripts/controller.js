/**
 * Example Sift Sift. Frontend controller entry point.
 */
import { SiftController, registerSiftController } from '@redsift/sift-sdk-web';

export default class MyController extends SiftController {
  constructor() {
    // You have to call the super() method to initialize the base class.
    super();
    this._suHandler = this.onStorageUpdate.bind(this);
  }

  loadView(state) {
    console.log('counter: loadView', state);

    this.storage.subscribe(['count'], this._suHandler);
    switch (state.type) {
      case 'email-thread':
        return {
          html: 'email-thread.html',
          data: {}
        };
      case 'summary':
        return {
          html: 'summary.html',
          data: this.getCount()
        };
      default:
        console.error('counter: unknown Sift type: ', state.type);
    }
  }

    // Event: storage update
  onStorageUpdate(value) {
    console.log('counter: onStorageUpdate: ', value);
    return this.getCount().then(xe => {
      // Publish events from 'x' to view
      this.publish('counts', xe);
    });
  }

  getCount() {
    return this.storage.get({
      bucket: 'count',
      keys: ['word_count']
    }).then((values) => {
      console.log('counter: getCount returned:', values);
      return values[0];
    });
  }
}

// Do not remove. The Sift is responsible for registering its views and controllers
registerSiftController(new MyController());
