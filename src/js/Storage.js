export default class Storage {
    constructor() {
      this.storage = localStorage;
    }
  
    save(data) {
      this.storage.setItem('data', JSON.stringify(data));
    }
  
    load() {
      try {
        return JSON.parse(this.storage.getItem('data'));
      } catch (e) {
        throw new Error('Invalid data');
      }
    }
  
    statusChange(id, status) {
      const data = this.load();
      for (const item in data) {
        if (item === id) {
          data[item].status = status;
        }
      }
      this.save(data);
    }
  
    remove() {
      let data = this.load();
      data = {};
      this.save(data);
    }
  }