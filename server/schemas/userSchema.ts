import * as mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  admin: {
    type: Boolean
  },
  contentAccessKey: {
    type: String
  },
  dataAtualizacao: {
    type: Date,
    default: Date.now
  }
});
export default UserSchema;