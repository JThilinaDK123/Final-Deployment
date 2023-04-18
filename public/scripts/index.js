/**
 * These lines of code are selecting HTML elements from the DOM (Document Object Model) using their respective IDs and assigning them to variables using the `const` keyword. 
 * */
const sendMsg = document.getElementById('msg-send');
const inputMsg = document.getElementById('msg-input');
const resMsg = document.getElementById('msg-response');


/**
 * This function sends a message inputted by the user to the server and displays the response received from the server.
 * @param e - The parameter `e` is an event object that is passed to the `sendMsgInfo` function when it is called. It is used to prevent the default behavior of a form submission when the function is called as an event listener.
 * @returns If the inputMsg value is empty, the function will return and nothing will happen. Otherwise, the function will make a POST request to the '/inputMsg' endpoint with the inputMsg value as a JSON object in the request body. It will then wait for a response from the server and if the response status is 'received', it will set the text content of the resMsg element to the response
 */
const sendMsgInfo = async (e) => {
  e.preventDefault();
  if (inputMsg.value === '') { return };
  const res = await fetch('/inputMsg', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ parcel: inputMsg.value }),
  });
  const data = await res.json();
  if (data.status === 'recieved') {
    resMsg.textContent = data.message;
  }
};

/**
 * `sendMsg.addEventListener('click', sendMsgInfo);` is adding an event listener to the `sendMsg` element. The event listener is listening for a 'click' event on the `sendMsg` element, and when the event is triggered, it calls the `sendMsgInfo` function. 
 * This allows the user to click the `sendMsg` element and trigger the `sendMsgInfo` function, which sends a message inputted by the user to the server and displays the response received from the server. 
 * */
sendMsg.addEventListener('click', sendMsgInfo);