const axios = require("axios");
const Dev = require("../models/Dev");
const parseStringAsArray = require("../utils/parseStringAsArray");

module.exports = {
  // Listar todos os usuarios
  async index(request, response) {
    const devs = await Dev.find();

    return response.json(devs);
  },

  async store(request, response) {
    const { github_username, techs, latitude, longitude } = request.body;

    let dev = await Dev.findOne({ github_username });

    // Se um dev nao existir, ele vai criar um novo dev
    if (!dev) {
      const apiResponse = await axios.get(
        `https://api.github.com/users/${github_username}`
      );

      // Se o name nao existir ele vai pegar o login
      const { name = login, avatar_url, bio } = apiResponse.data;

      // Separa as tecnologias que estao em uma string por virgula, para se transformar em um array
      // O percorrer cada tecnologia e usar o trim, para remover espacamento antes ou depois de uma string
      const techsArray = parseStringAsArray(techs);

      const location = {
        type: "Point",
        coordinates: [longitude, latitude]
      };

      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location
      });
    }

    return response.json(dev);
  },

  async update(request, response) {
    const { github_username } = request.params;
    const { name, avatar_url, bio, techs, latitude, longitude } = request.body;

    const dev = await Dev.findOne({ github_username });

    if (!dev) {
      return response.json({ error: "user not found" });
    }

    const techsArray = parseStringAsArray(techs);

    const location = {
      type: "Point",
      coordinates: [longitude, latitude]
    };

    const devUpdated = await dev.update({
      name,
      avatar_url,
      bio,
      techs: techsArray,
      location
    });

    return response.json(devUpdated);
  },

  async destroy(request, response) {
    const { github_username } = request.params;

    const dev = await Dev.findOne({ github_username });

    if (!dev) {
      return response.json({ error: "user not found" });
    }

    await dev.delete();

    return response.json({ message: "deleted" });
  }
};
