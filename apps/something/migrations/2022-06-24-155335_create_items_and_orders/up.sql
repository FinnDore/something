CREATE TABLE
    items (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description VARCHAR(500) NOT NULL,
        priceId VARCHAR(30) NOT NULL
    );


CREATE TABLE
    orders (
        id VARCHAR(36) PRIMARY KEY,
        itemId VARCHAR(36) NOT NULL,
        quantity INTEGER NOT NULL
    );

CREATE INDEX items_id_idx ON orders (itemId);
