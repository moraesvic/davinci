-- this is for when we thought blobs were something worthwhile

CREATE TABLE pics (
    pic_id BIGSERIAL NOT NULL PRIMARY KEY,
    pic_orig_name TEXT NOT NULL,
	pic_md5 TEXT NOT NULL,
	pic_data BYTEA NOT NULL

    CHECK (CHAR_LENGTH(pic_orig_name) > 0),
    -- MD5SUM must be equal to 32, or 16 bytes
    CHECK (CHAR_LENGTH(pic_md5) = 32) 
);
