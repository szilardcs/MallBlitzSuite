import { faker } from "@faker-js/faker";

export function createContactUsInfoFaker() {
	return {
		name: faker.person.fullName(),
		emailAddress: faker.internet.email(),
		subject: faker.lorem.paragraph(1),
		message: faker.lorem.sentences(2),
	};
}
