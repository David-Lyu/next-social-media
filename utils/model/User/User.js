import Adapters from 'next-auth/adapters';

class User extends Adapters.TypeORM.Models.User.model {
  constructor(
    name,
    email,
    image,
    emailVerified,
    firstName,
    lastName,
    userType
    // friends
  ) {
    super(name, email, image, emailVerified);
    if (firstName) this.firstName = firstName;
    if (lastName) this.lastName = lastName;
    if (userType) this.userType = userType;
    // if (friends) this.friends = friends;
  }
}

const UserSchema = {
  name: 'User', //the name of the index?
  target: User, //user from above
  columns: {
    ...Adapters.TypeORM.Models.User.schema.columns,
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    firstName: {
      type: 'varchar',
      nullable: true
    },
    lastName: {
      type: 'varchar',
      nullable: true
    },
    userType: {
      type: 'varchar',
      nullable: true
    }
    // friends: {
    //   type: 'array',
    //   nullable: true
    // }
  }
};

// Extend the built-in models using class inheritance
// class User extends Adapters.TypeORM.Models.User.model {
//   // You can extend the options in a model but you should not remove the base
//   // properties or change the order of the built-in options on the constructor
//   constructor(name, email, image, emailVerified) {
//     super(name, email, image, emailVerified);
//   }
// }

// const UserSchema = {
//   name: 'User',
//   target: User,
//   columns: {
//     ...Adapters.TypeORM.Models.User.schema.columns,
//     // Adds a phoneNumber to the User schema
//     phoneNumber: {
//       type: 'varchar',
//       nullable: true
//     }
//   }
// };

export default {
  User: {
    model: User,
    schema: UserSchema
  }
};
