import { factory, primaryKey } from '@mswjs/data';
import { faker } from '@faker-js/faker';

export const db = factory({
  user: {
    id: primaryKey(() => faker.number.int()),
    firstName: () => faker.person.firstName(),
    lastName: () => faker.person.lastName(),
    email: () => faker.internet.email(),
    image: () => faker.image.avatar(),
    gender: () => faker.person.sex(),
    age: () => faker.number.int({ min: 18, max: 60 }),
    phone: () => faker.phone.number()
  }
});

export const generateUsers = (count = 20) => {
  for (let i = 0; i < count; i++) {
    db.user.create({});
  }
  return db.user.getAll();
};
