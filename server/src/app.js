import express from "express";
import cors from "cors";
import * as toxicity from "@tensorflow-models/toxicity";
import url from "url";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));



const traducirAIngles = async (texto) => {
    const url = 'https://api.mymemory.translated.net/get?q=${texto}&langpair=es|en';
    const response = await fetch(url);
    const data = await response.json();
    return data.responseData.translatedText;
}

app.post("/toxicity", async (req, res) => {
    const { texto, threshold=80 } = req.body;
    try {
        const model = await toxicity.load(threshold);
        const predictions = await model.classify(texto);
        console.log(predictions);
        return res.status(200).json(predictions);
            
        } catch (error) {
            return error;
        };
});   


app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
