async function getRequest(body, callback) {
	try {
	  const response = await fetch("https://jscp-diplom.netoserver.ru/", {
		method: "POST",
		headers: {
		  'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: body
	  });
  
	  if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	  }
  
	  const data = await response.json();
  
	  if (callback) {
		callback(data);
	  }
  
	  return data;
	} catch (error) {
	  throw error;
	}
  }
  