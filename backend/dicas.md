`yarn init -y`

Instalar o express
`yarn add express`

Criar na raiz o arquivo `index.js`

```
const express = require("express");

const app = express();

// Para o express entender requisicoes no formato JSON
app.use(express.json());

app.get("/", (request, response) => {
  return response.json({ message: "teste" });
});

app.listen(3333);

```

Para ficar observando o codigo
`yarn add nodemon -D`

##### Criar um script personalizado para iniciar o backend

Em `package.json`: <b>scripts</b>

```
{
  "name": "backend",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "scripts": {
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "express": "^4.17.1"
  },
  "devDependencies": {
    "nodemon": "^2.0.2"
  }
}
```

Instalar o [insomnia](https://insomnia.rest/download/)

Criar uma pasta para o projeto e criar a primeira request

<hr>

#### Conectar o backend com um banco de dados

<b>MongoDB (nao-relacional)</b>

Posso ter um banco na nuvem com o [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

Organizations > Name Organization > Billing > Aplly Credit `rocketseat2020`

Build a New Cluster > Create a Cluster

Database Access > ADD NEW USER >
username:omnistack
password:omnistack
Read and write to any database
Add User

Network Access (liberar os ips que vao acessar a base de dados)
ALLOW ACCESS FROM ANYWHERE

Voltar no cluster e clicar em `CONNECT`

Connect Your Application
Connection String Only copy
`mongodb+srv://omnistack:<password>@cluster0-owvmk.mongodb.net/test?retryWrites=true&w=majority`

Dentro da aplicacao

`yarn add mongoose`

e importar dentro do `index.js`

colocar a senha
e mudar o nome do banco de `test` para `week10`

```
const express = require("express");
const mongoose = require("mongoose");

const app = express();

mongoose.connect(
  "mongodb+srv://omnistack:omnistack@cluster0-owvmk.mongodb.net/week10?retryWrites=true&w=majority",
  {
    useNewUrlParser: true, // Para tirar os erros no terminal
    useUnifiedTopology: true
  }
);

// Para o express entender requisicoes no formato JSON
app.use(express.json());

app.get("/", (request, response) => {
  return response.json({ message: "teste" });
});

app.listen(3333);

```

<hr>

Criar uma pasta `src` na raiz
Mover o `index.js` para dentro da pasta `src`

e mudar o `package.json`, para poder ouvir o `index.js`

```
"scripts": {
  "dev": "nodemon src/index.js"
},
```

e executar `yarn dev` novamente

<hr>

#### Separar as rotas em outro arquivo

criar o arquivo `routes.js` na pasta `src`

`routes.js`

```
const { Router } = require("express");

const routes = Router();

routes.get("/", (request, response) => {
  return response.json({ message: "teste" });
});

module.exports = routes;
```

`index.js`

```
const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");

const app = express();

mongoose.connect(
  "mongodb+srv://omnistack:omnistack@cluster0-owvmk.mongodb.net/week10?retryWrites=true&w=majority",
  {
    useNewUrlParser: true, // Para tirar os erros no terminal
    useUnifiedTopology: true
  }
);

// Para o express entender requisicoes no formato JSON
app.use(express.json());

app.use(routes);

app.listen(3333);
```

<hr>

Criar a pasta `models` na pasta `src`
E dentro criar a entidade Dev, criar o arquivo `Dev.js`

`models/Dev.js`

```
const mongoose = require("mongoose");

const DevSchema = new mongoose.Schema({
  name: String,
  github_username: String,
  bio: String,
  avatar_url: String,
  techs: [String]
});

module.exports = mongoose.model("Dev", DevSchema);
```

Criar uma rota para cadastro para dev e criar no insomnia tambem

`yarn add axios`

`routes.js`

```
const { Router } = require("express");
const axios = require("axios");
const Dev = require("./models/Dev");

const routes = Router();

routes.post("/devs", async (request, response) => {
  const { github_username, techs } = request.body;

  const apiResponse = await axios.get(
    `https://api.github.com/users/${github_username}`
  );

  // Se o name nao existir ele vai pegar o login
  const { name = login, avatar_url, bio } = apiResponse.data;

  // Separa as tecnologias que estao em uma string por virgula, para se transformar em um array
  // O percorrer cada tecnologia e usar o trim, para remover espacamento antes ou depois de uma string
  const techsArray = techs.split(",").map(tech => tech.trim());

  const dev = await Dev.create({
    github_username,
    name,
    avatar_url,
    bio,
    techs: techsArray
  });

  return response.json(dev);
});

module.exports = routes;

```

Baixar o [MongoDB Compass](https://www.mongodb.com/products/compass) para visualizar o banco de dados

Abrir e conectar a mesma url que esta no `index.js`

Exclua o usuario que foi criado, porque falta a informacao de latitude e longitude

<hr>

#### Colocar a latitude e longitude

O type da location vai ser bem grande, separar em outro arquivo

Criar na pasta `models` o a pasta `utils` e o dentro o arquivo `PointSchema.js`

`PointSchema.js`

```
const mongoose = require("mongoose");

const PointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
});

module.exports = PointSchema;
```

Importar o PointSchema para dentro do `Dev.js`
`Dev.js`

```
const mongoose = require("mongoose");
const PointSchema = require("./utils/PointSchema");

const DevSchema = new mongoose.Schema({
  name: String,
  github_username: String,
  bio: String,
  avatar_url: String,
  techs: [String],
  location: {
    type: PointSchema,
    index: "2dsphere"
  }
});

module.exports = mongoose.model("Dev", DevSchema);
```

### Colocar latitude e longitude no `routes.js` no request.body e buscar a informacao

```
const { Router } = require("express");
const axios = require("axios");
const Dev = require("./models/Dev");

const routes = Router();

routes.post("/devs", async (request, response) => {
  const { github_username, techs, latitude, longitude } = request.body;

  const apiResponse = await axios.get(
    `https://api.github.com/users/${github_username}`
  );

  // Se o name nao existir ele vai pegar o login
  const { name = login, avatar_url, bio } = apiResponse.data;

  // Separa as tecnologias que estao em uma string por virgula, para se transformar em um array
  // O percorrer cada tecnologia e usar o trim, para remover espacamento antes ou depois de uma string
  const techsArray = techs.split(",").map(tech => tech.trim());

  const location = {
    type: "Point",
    coordinates: [longitude, latitude]
  };

  const dev = await Dev.create({
    github_username,
    name,
    avatar_url,
    bio,
    techs: techsArray,
    location
  });

  return response.json(dev);
});

module.exports = routes;
```

### Abstrair esse codigo para um controller

Criar a pasta `controllers` na pasta `src` e dentro o arquivo `DevController.js`

tirar o codigo do `routes.js` e passar para o `DevController.js`

`DevController.js`

```
const axios = require("axios");
const Dev = require("../models/Dev");

module.exports = {
  async store(request, response) {
    const { github_username, techs, latitude, longitude } = request.body;

    const apiResponse = await axios.get(
      `https://api.github.com/users/${github_username}`
    );

    // Se o name nao existir ele vai pegar o login
    const { name = login, avatar_url, bio } = apiResponse.data;

    // Separa as tecnologias que estao em uma string por virgula, para se transformar em um array
    // O percorrer cada tecnologia e usar o trim, para remover espacamento antes ou depois de uma string
    const techsArray = techs.split(",").map(tech => tech.trim());

    const location = {
      type: "Point",
      coordinates: [longitude, latitude]
    };

    const dev = await Dev.create({
      github_username,
      name,
      avatar_url,
      bio,
      techs: techsArray,
      location
    });

    return response.json(dev);
  }
};
```

`routes.js`

```
const { Router } = require("express");
const DevController = require("./controllers/DevController");

const routes = Router();

routes.post("/devs", DevController.store);

module.exports = routes;
```

<hr>

### Listar todos os devs

`routes.js`

```
const { Router } = require("express");
const DevController = require("./controllers/DevController");

const routes = Router();

routes.get("/devs", DevController.index);
routes.post("/devs", DevController.store);

module.exports = routes;
```

`DevController.js`

```
async index(request, response) {
    const devs = await Dev.find();

    return response.json(devs);
  },
```

E criar a rota no insomnia

#### Rota de busca

Usada pelo aplicativo mobile, buscar devs em uma localidade especifica, dentro de um raio que trabalham com tais tecnologias.

Latitude, Longitude e Tecnologias

Criar um novo controller `SearchController`
e criar uma nova rota par ao SearchController

`routes.js`

```
const { Router } = require("express");

const DevController = require("./controllers/DevController");
const SearchController = require("./controllers/SearchController");

const routes = Router();

routes.get("/devs", DevController.index);
routes.post("/devs", DevController.store);

routes.get("/search", SearchController.index);

module.exports = routes;
```

Criar a rota no insomnia tambem, e usar o query, nao o body

Query:
`latitude: -22.9725449`
`longitude: -43.3351836`
`techs: ReactJS, VueJs`

<hr>

### Filtrar por tecnologia

Ja que eu vou usar o
`const techsArray = techs.split(",").map(tech => tech.trim());` em dois arquivos eu posso isolar ele

Criar a pasta `utils` na `src` e criar o arquivo `parseStringAsArray.js`

`parseStringAsArray.js`

```
module.exports = function parseStringAsArray(arrayAsString) {
  return arrayAsString.split(",").map(tech => tech.trim());
};
```

Voltar no `DevController` importar e deixar
`const techsArray = parseStringAsArray(techs);`

<hr>

`SearchController`

```
const Dev = require("../models/Dev");
const parseStringAsArray = require("../utils/parseStringAsArray");

module.exports = {
  async index(request, response) {
    const { latitude, longitude, techs } = request.query;

    const techsArray = parseStringAsArray(techs);

    const devs = await Dev.find({
      techs: {
        $in: techsArray // Se tiver pelo menos um tech, ele encontra, nao precisa ser as techs todas iguais
      },
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude]
          },
          $maxDistance: 10000 // Distancia em metros
        }
      }
    });

    return response.json({ devs });
  }
};
```

E testar mudando a latitude ou longitude, deixando mais distante para ver se vai conseguir buscar o usuario

<hr>

`yarn add cors`
`src/index.js`

```
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes");

const app = express();

mongoose.connect(
  "mongodb+srv://omnistack:omnistack@cluster0-owvmk.mongodb.net/week10?retryWrites=true&w=majority",
  {
    useNewUrlParser: true, // Para tirar os erros no terminal
    useUnifiedTopology: true
  }
);

app.use(cors());
// Para o express entender requisicoes no formato JSON
app.use(express.json());

app.use(routes);

app.listen(3333);
```
