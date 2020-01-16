const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes");

const app = express();

mongoose.connect(
  "mongodb+srv://omnistack:omnistack@cluster0-owvmk.mongodb.net/week10?retryWrites=true&w=majority",
  {
    useNewUrlParser: true, // Para tirar os erros no terminal
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }
);

app.use(cors());
// Para o express entender requisicoes no formato JSON
app.use(express.json());

app.use(routes);

app.listen(3333);
