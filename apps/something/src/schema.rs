table! {
    items (id) {
        id -> Varchar,
        name -> Varchar,
        description -> Varchar,
        priceId -> Varchar,
    }
}

table! {
    orders (id) {
        id -> Varchar,
        itemId -> Varchar,
        quantity -> Integer,
    }
}

allow_tables_to_appear_in_same_query!(
    items,
    orders,
);
