import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Sequelize, DataTypes } from 'sequelize';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);

const env = process.env.NODE_ENV ?? 'development';

const configPath = path.join(__dirname, '../config/config.json');

const configFile = fs.readFileSync(configPath, 'utf8');

const config = JSON.parse(configFile)[env];

const sequelize = config.use_env_variable
  ? new Sequelize(process.env[config.use_env_variable], config)
  : new Sequelize(config.database, config.username, config.password, config);

const db = {};

const modelFiles = fs
  .readdirSync(__dirname)
  .filter(
    (file) =>
      !file.startsWith('.') &&
      file !== basename &&
      file.endsWith('.js') &&
      !file.endsWith('.test.js')
  );

for (const file of modelFiles) {
  const modelPath = path.join(__dirname, file);

  const modelModule = await import(pathToFileURL(modelPath).href);

  const defineModel = modelModule.default;

  if (typeof defineModel !== 'function') {
    throw new TypeError(`Model "${file}" must export a default function`);
  }

  const model = defineModel(sequelize, DataTypes);

  db[model.name] = model;
}

for (const model of Object.values(db)) {
  if (typeof model.associate === 'function') {
    model.associate(db);
  }
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
