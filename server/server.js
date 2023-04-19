/**
 *  The `dotenv` module is used to load environment variables from a `.env` file into `process.env` object, which can be accessed throughout the application.
 * The `express` module is a popular Node.js web framework used for building web applications and APIs. 
 * The `app` object is an instance of the `express` application that is used to define routes and middleware for the application.
 * */
require('dotenv').config();
const express = require('express');
const app = express();

/**
 * These lines of code are importing the necessary modules from the `openai` package and creating an instance of the `OpenAIApi` class with the required configuration. 
 * The `Configuration` class is used to set the `organization` and `apiKey` properties required for authentication with the OpenAI API.
 * The `OpenAIApi` class is used to interact with the OpenAI API and make requests to it. The `configuration` object is passed as an argument to the `OpenAIApi` constructor to create an instance of the class that is configured to use the specified API key and organization ID. 
 * */
const Configuration = require('openai').Configuration;
const OpenAIApi = require('openai').OpenAIApi;
const configuration = new Configuration({
    organization: process.OPENAI_ORG_ID,
    apiKey: process.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

/**
 * These lines of code are connecting to a MongoDB database using the `mongoose` library. The `mongoose.connect()` method is used to establish a connection to the MongoDB database specified in the `MONGO_URI` environment variable. The `useNewUrlParser` and `useUnifiedTopology` options are passed to the method to ensure that the connection is established using the latest MongoDB driver.
 * Once the connection is established, the `mongoose` library can be used to define and interact with database models. 
 * */
// const mongoose = require('mongoose');
// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

/**
 * These lines of code are defining a Mongoose schema for the `Response` model. The `mongoose.Schema` method is used to create a new schema object, which is then used to define the structure of the `Response` model. The schema defines five properties: `prompt`, `status`, `created`, `message`, and `total_tokens`, each with a specified data type. 
 * */
// const Schema = mongoose.Schema;
// const responseSchema = new Schema({
//     prompt: { type: String },
//     status: { type: String },
//     created: { type: Number },
//     message: { type: String },
//     total_tokens: { type: Number }
// });
// const Response = mongoose.model("Response", responseSchema);

/**
 * The function creates and saves an API response and returns the saved data.
 * @param apiResponse - It is an object that represents the response received from an API call. The function takes this object and saves it to a database using the `.save()` method.
 * @returns The function `createAndSaveResponse` is returning a promise that resolves to the saved data if the save operation is successful, or rejects with an error if the save operation fails.
 * */
// const createAndSaveResponse = (apiResponse) => {
//     return apiResponse.save()
//         .then((savedData) => {
//             return savedData;
//         })
//         .catch((err) => {
//             console.error(err);
//             throw err;
//     });
// };

/**
 * This is a JavaScript function that generates a response using OpenAI's GPT-3.5-turbo model based on
 * a given parcel.
 * @param parcel - The input message or prompt that the user sends to the chatbot. It is used as the
 * content of the first message in the `messages` array passed to the `createChatCompletion` function.
 * @returns The function `generateResponse` is returning a string that is the response generated by the
 * OpenAI GPT-3 model based on the input `parcel` provided as a message from the user.
 */
const generateResponse = async ( parcel ) => {
    let res = '';

    const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
            {role: 'user', content: parcel},
        ]
    });

    // res = completion.data.choices[0].message;
    return completion;
};

/**
 * `app.use(express.static('public'))` is serving static files from the `public` directory. This means that any files in the `public` directory can be accessed by the client by specifying the file path in the URL. For example, if there is a file named `style.css` in the `public` directory, it can be accessed by the client at `http://localhost:3000/style.css`.
 * */
app.use(express.static('public'));
app.use(express.json());

/**
 * This code defines a route for the HTTP GET method at the path '/info'. When a client sends a GET request to this path, the server responds with a JSON object containing information about the chat microservice. The response has a status code of 200, indicating that the request was successful. 
 * */
app.get('/info', (req, res) => {
    res.status(200).json({info: 'This is a Chat Microservice built using the OpenAI API `createChatCompletion`'});
});

/** 
 * This code defines a route for the HTTP POST method at the path '/inputMsg'. 
 * When a client sends a POST request to this path with a JSON payload containing a `parcel` property, the server generates a response using the `generateResponse` function and saves the response to a MongoDB database using the `createAndSaveResponse` function. 
 * The server then sends a JSON response to the client containing the saved response data.
 * If the `parcel` property is not present in the request payload, the server sends a JSON response with a status code of 400 indicating that the request failed. 
 * */
app.post('/inputMsg', async (req, res) => {
    const { parcel } = req.body;
    console.log(parcel);
    if (!parcel) {
        return res.status(400).send({ status: 'failed' });
    }
    const response = await generateResponse(parcel);
    const apiResponse = new Response({
        prompt: parcel,
        status: 'recieved',
        created: response.data.created,
        message: response.data.choices[0].message.content,
        total_tokens: response.data.usage.total_tokens
    });
    console.log(apiResponse);
    // createAndSaveResponse(apiResponse);
    res.status(200).send(apiResponse);
});

/** 
 * `app.listen(process.env.PORT || 3000)` is starting the server and listening for incoming requests on the specified port number. 
 * If the `PORT` environment variable is set, the server will listen on that port number. Otherwise, it will listen on port 3000. 
 * */
app.listen(process.env.PORT || 3000);
console.log(`App listening at http://localhost:${process.env.PORT || 3000}`);

module.exports = app;
