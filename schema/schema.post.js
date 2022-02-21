import * as yup from 'yup';

const schema = yup.object({
	text: yup.string().required(),
});

export default schema;
