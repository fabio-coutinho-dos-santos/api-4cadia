const server = require("./src/Config/server")
require("./src/Config/database")
require("./src/Config/routes")(server)
