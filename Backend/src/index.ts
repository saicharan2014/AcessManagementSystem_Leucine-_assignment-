import { AppDataSource } from "../data-source";

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected and tables created!");
  })
  .catch((error) => console.log(error));
