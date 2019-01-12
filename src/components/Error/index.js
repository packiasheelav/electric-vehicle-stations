import React from 'react';

const Error = ({error}) => {
    console.log(error)
	return (
		<div className="error-container">
			<h1>{error.message}</h1>
		</div>
	);
};
export default Error;
