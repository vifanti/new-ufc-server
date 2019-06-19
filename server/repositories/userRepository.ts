import * as mongoose from "mongoose";
import UserSchema from "../schemas/userSchema";

class UserRepository {
  private model;

  constructor() {
    this.model = mongoose.model("User", UserSchema);
  }

  get(contentAccessKey, name?) {
    if (name) {
      return this.model.find({ name: { $regex: name, $options: "i" }, contentAccessKey: contentAccessKey} );
    }
    return this.model.find({ contentAccessKey: contentAccessKey });
  }

  getById(_id, contentAccessKey) {
    return this.model.find({ _id: _id, contentAccessKey: contentAccessKey });
  }

  findOne(email) {
    return this.model.findOne({ email: email });
  }

  register(user) {
    return this.model.create(user);
  }

  create(user) {
    return this.model.create(user);
  }

  update(_id, user, contentAccessKey) {
    const updateUser = (<any>Object).assign({}, user);
    return this.model.findOneAndUpdate(
      { _id: _id, contentAccessKey: contentAccessKey },
      updateUser,
      { new: true }
    );
  }

  delete(_id, contentAccessKey) {
    return this.model.findOneAndRemove({ _id: _id, contentAccessKey: contentAccessKey});
  }
}

export default new UserRepository();
