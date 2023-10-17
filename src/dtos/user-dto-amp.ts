interface IUserAmpDto {
  _id: string;
  name: string;
  email:string;
  org: string;

}
module.exports = class UserDtoAmp {
  _id;

  name;

  email;
 
  org;

  constructor(model:IUserAmpDto) {
    this._id = model._id;
    this.name = model.name;
    this.email = model.email;
    this.org = model.org;
  }

};