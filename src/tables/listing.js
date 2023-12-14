const db = require("../../config/dbConnection");
const logger = require("../../config/logger");
const helper = require("../utilities/helper");

class NewTableListing {
    listing = async () => {
        try {
            await db.pool.query(`
                CREATE TABLE IF NOT EXISTS listing (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    category INT NOT NULL,
                    summary VARCHAR(255) NOT NULL,
                    description LONGTEXT NOT NULl, 
                    keywords VARCHAR(255),
                    email VARCHAR(255),
                    url VARCHAR(255),
                    phone VARCHAR(20),
                    address VARCHAR(255),
                    number VARCHAR(50),
                    city VARCHAR(100),
                    complement VARCHAR(255),
                    zipCode VARCHAR(20),
                    country VARCHAR(50),
                    status VARCHAR(50),
                    facebook VARCHAR(255),
                    instagram VARCHAR(255),
                    twitter VARCHAR(255),
                    linkedIn VARCHAR(255),
                    openingHours LONGTEXT NOT NULL,
                    promotionalCode VARCHAR(50),
                    payment VARCHAR(50),
                    image LONGTEXT,
                    logoImage LONGTEXT,
                    coverImage LONGTEXT,
                    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                );
            `);
        } catch (error) {
            logger.log(`error`, `Erro ao criar a tabela (listing): ${error}`);
        }
    }

    // Criar as tabelas em ordem para não houver erro de chaves estrangeras por não existir as tabelas;
    createAll = async () => {
        console.log(`${helper.getDateTime()} - Criando tabela de (listing)...`)
        await this.listing();
    }
}

module.exports = new NewTableListing;