DROP TABLE items;
DROP TABLE orders;

ALTER TABLE orders
DROP INDEX items_id_idx;