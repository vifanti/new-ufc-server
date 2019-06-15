import * as mongoose from "mongoose";

class Database {
    //salvando na base de teste
    private DB_URI = 'mongodb+srv://vifanti:280695@crud-nodejs-vf8hk.mongodb.net/test?retryWrites=true&w=majority';
    private DB_CONNECTION;

    constructor() { mongoose.set('useFindAndModify', false); }

    createConnection() {
        mongoose.connect(this.DB_URI, { useNewUrlParser: true });
        this.logger(this.DB_URI);
    }

    logger(uri) {
        this.DB_CONNECTION = mongoose.connection;
        this.DB_CONNECTION.on('connected', () => console.log(`Moogose is connected in ${uri}`));
        this.DB_CONNECTION.on('error', error => console.error.bind(console, `Connection Error: ${error}`));
        this.DB_CONNECTION.on('disconnected', () => console.log(`Moogose is disconnected in ${uri}`));
    }

    closeConnection(message, callback) {
        this.DB_CONNECTION.close(() => {
            console.log(`Mongoose was desconeted by: ${message}`)
            callback();
        });
    }

}

export default Database;
