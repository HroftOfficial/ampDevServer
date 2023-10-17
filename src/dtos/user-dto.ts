interface IUserDto {
  _id: string;
  name: string;
  email:string

}

module.exports = class UserDto {
  _id;

  name;

  email;
  
  constructor(model:IUserDto) {
    this._id = model._id;
    this.name = model.name;
    this.email = model.email;
  }

};