require('dotenv').config();
const express = require('express');
const app = express();


const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });


const Schema = mongoose.Schema;
const responseSchema = new Schema({
    prompt: { type: String },
    status: { type: String },
    created: { type: Number },
    message: { type: String },
    total_tokens: { type: Number }
});
const Response = mongoose.model("Response", responseSchema);

const createAndSaveResponse = (apiResponse) => {
    return apiResponse.save()
        .then((savedData) => {
            return savedData;
        })
        .catch((err) => {
            console.error(err);
            throw err;
    });
};

app.use(express.static('public'));
app.use(express.json());


app.get('/info', (req, res) => {
    res.status(200).json({info: 'This is a Chat Microservice built using the OpenAI API `createChatCompletion`'});
});

app.post('/inputMsg', async (req, res) => {
    const { parcel } = req.body;
    console.log(parcel);
    if (!parcel) {
        return res.status(400).send({ status: 'failed'});
    }
    const response = {
        data: {
            created: 1234567890,
            choices: [
                {
                    index: 0,
                    message: {
                        role: 'assistant',
                        content: 'Hello there, how may I assist you today'   
                    }
                }
            ],
            usage: {
                total_tokens: 0
            }
        }
    };
    const apiResponse = new Response({
        prompt: parcel,
        status: 'recieved',
        created: response.data.created,
        message: response.data.choices[0].message.content,
        total_tokens: response.data.usage.total_tokens
    });
    console.log(apiResponse);
    createAndSaveResponse(apiResponse);
    res.status(200).send(apiResponse);
})


app.listen(process.env.PORT || 3000);
console.log(`App listening at http://localhost:${process.env.PORT || 3000}`);

module.exports = app;