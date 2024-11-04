import pg from 'pg';
import UserRepository from "./repository/user-repository.js";
import UserService from "./service/user-service.js";
import UserController from "./controller/user-controller.js";

const { Pool } = pg;

const pool = new Pool({
    user: 'root',
    host: 'localhost',
    database: 'postgres',
    password: 'root',
    port: 5432,
});

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
        const userRepository = new UserRepository(pool);
        const userService = new UserService(userRepository);
        const userController = new UserController(userService);

        this.register('userRepository', userRepository);
        this.register('userService', userService);
        this.register('userController', userController);

        return userController;
    }

}

export default new Container(); 