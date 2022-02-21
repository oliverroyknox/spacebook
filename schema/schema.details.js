import * as yup from 'yup';

const schema = yup.object({
	firstName: yup.string().required(),
	lastName: yup.string().required(),
});

export default schema;
