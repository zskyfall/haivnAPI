class OOPUser{
	constructor(fullName, email, username, avatar, cover){
		this._fullName = fullName;
		this._email = email;
		this._username = username;
		this._avatar = avatar;
		this._cover = cover;
	}
	get(){
		return this;
	}
}

module.exports = OOPUser;