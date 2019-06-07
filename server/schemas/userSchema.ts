import * as mongoose from "mongoose";
import * as bcrypt from "bcrypt";

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

// hash user password before saving into database
UserSchema.pre("save", function(next) {
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

export default UserSchema;
