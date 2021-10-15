class InvalidInput extends Error {
	constructor(message) {
		super(message);
		this.name = 'InvalidInput';
	}
};

class AlreadyExistent extends Error {
	constructor(message) {
		super(message);
		this.name = 'AlreadyExistent';
	}
};

class TokenExpired extends Error {
	constructor(message) {
		super(message);
		this.name = 'TokenExpired';
	}
}

class InvalidCredentials extends Error {
	constructor(message) {
		super(message);
		this.name = 'InvalidCredentials';
	}
}

class WrongPriviledges extends Error {
	constructor(message) {
		super(message);
		this.name = 'WrongPriviledges';
	}
}

class InexistentResource extends Error {
	constructor(message) {
		super(message);
		this.name = 'InexistentResource';
	}
}

class UserInputRequired extends Error {
	constructor(message) {
		super(message);
		this.name = 'UserInputRequired';
	}
}

class ErrorWithinError extends Error {
	constructor(message) {
		super(message);
		this.name = 'ErrorWithinError';
	}
}

/* A generic error type, for the cases we just do not want to give too much
 * information to the client */

class InternalServerError extends Error {
	constructor(message) {
		super(message);
		this.name = 'InternalServerError';
	}
}

module.exports = {
	AlreadyExistent,
	ErrorWithinError,
	InexistentResource,
    InternalServerError,
	InvalidCredentials,
	InvalidInput,
	TokenExpired,
	UserInputRequired,
	WrongPriviledges
}