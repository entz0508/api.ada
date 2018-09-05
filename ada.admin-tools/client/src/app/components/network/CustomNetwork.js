import React    from 'react';
import axios    from "axios";
import {config} from "../../config/config";

export default class CustomNetwork
{
	static request(method = "post", route = "/", data, fn)
	{
		axios({
			method: method,
			url: `${config.host}${route}`,
			data: data
		}).then(response => {

			fn(response);

		}).catch(exception => {
			alert(exception);
		});
	}
}