declare const config: {
  development: {
    username: string;
    password: string;
    database: string;
    host: string;
    dialect: "postgres";
  };
  test: {
    username: string;
    password: string;
    database: string;
    host: string;
    dialect: "postgres";
  };
  production: {
    username: string;
    password: string;
    database: string;
    host: string;
    dialect: "postgres";
  };
};
export default config;
