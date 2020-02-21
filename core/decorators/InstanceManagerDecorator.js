const Instance = (Decorator = null) => class InstanceManagerDecorator extends Decorator {
    constructor(RequestLib) {
      super();
      this.RequestLib = RequestLib;
      this.instances = {};
      return this;
    }

    create(options) {
      if (!options && !options.name)
        throw new Error('Error create instance. Options field "name" not found.');
  
      this.instances[options.name] = new this.RequestLib(options);
      return this;
    }
  
    getInstance(name) {
      return (name && this.instances[name])
        ? this.instances[name]
        : this.instances;
    }
  
    forEachInstances(fn) {
      for (const key of Object.keys(this.instances)) {
        fn(key, this.instances[key]);
      }
    }
  
    get(name, url, data) {
      return this.instances[name].get(url, data);
    }
  
    post(name, url, data) {
      return this.instances[name].post(url, data);
    }
  
    put(name, url, data) {
      return this.instances[name].put(url, data);
    }
  
    delete(name, url, data) {
      return this.instances[name].delete(url, data);
    }
  
    patch(name, url, data) {
      return this.instances[name].patch(url, data);
    }
  
    setHeader(name) {
      return (prop, value) => {
        this.instances[name].setHeader(prop, value);
      }
    }
  }

  export { Instance as InstanceManagerDecorator };
  export default Instance;
  