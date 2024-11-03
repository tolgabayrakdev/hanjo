import UserRepository from "./repository/user-repository.js";
import UserService from "./service/user-service.js";
import UserController from "./controller/user-controller.js";

class Container {
    constructor() {
        this.dependencies = {};
    }

    register(name, instance) {
        this.dependencies[name] = instance;
    }

    get(name) {
        return this.dependencies[name];
    }

    initializeUserModule() {
        const userRepository = new UserRepository();
        const userService = new UserService(userRepository);
        const userController = new UserController(userService);

        this.register('userRepository', userRepository);
        this.register('userService', userService);
        this.register('userController', userController);

        return userController;
    }

}

export default new Container(); 