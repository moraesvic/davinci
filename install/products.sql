CREATE TABLE products (
    prod_id BIGSERIAL NOT NULL PRIMARY KEY,
    prod_name TEXT NOT NULL,
    prod_descr TEXT,
    prod_image BYTEA,
    prod_price BIGINT NOT NULL,
    prod_instock BIGINT NOT NULL,

    CHECK (CHAR_LENGTH(prod_name) > 0),
    CHECK (prod_price > 0),
    CHECK (prod_instock >= 0)
);

INSERT INTO products
    (prod_name, prod_descr, prod_price, prod_instock)
    VALUES
    (
        'Small canvas',
        'A canvas with dimensions 20x15cm, ideal for portraits',
        9.99,
        50
    ),
    (
        'Medium canvas',
        'A canvas with dimensions 40x30cm, ideal for bolder paintings',
        29.99,
        27
    ),
    (
        'Large canvas',
        'Warming up to paint entire cathedrals? This 100x100cm canvas will get you ready for it!',
        129.99,
        9
    ),
    (
        'Basket of fruits',
        'How do you feel about painting some still nature? This is the perfect motive for you! Not recommended for human consumption.',
        7.99,
        5
    ),
    (
        'Surgeon Starter Pack',
        'If you are serious about painting, you have to learn some anatomy. Luckily, we have separated this starter kit just for you!',
        99.89,
        12
    ),
    (
        'Brush collection',
        'Some fine brushes made with sable fur. Just joking, it is all vegan!',
        179.89,
        3
    )
;