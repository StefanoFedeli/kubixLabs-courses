CREATE TABLE user_details
(
    user_id    UUID PRIMARY KEY      DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name  VARCHAR(100) NOT NULL,
    role       VARCHAR(50)  NOT NULL DEFAULT 'regular',
    auth_type  VARCHAR(50)  NOT NULL DEFAULT 'basic'
);

CREATE TABLE auth_basic
(
    user_id  UUID PRIMARY KEY REFERENCES user_details (user_id),
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100)        NOT NULL
);

CREATE TABLE auth_metamask
(
    user_id    UUID PRIMARY KEY REFERENCES user_details (user_id),
    account_id VARCHAR(100) UNIQUE
);


CREATE TABLE badges
(
    badge_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title       VARCHAR(100) NOT NULL UNIQUE,
    photo       VARCHAR(255),
    description TEXT
);

CREATE TABLE user_badges
(
    user_id  UUID REFERENCES user_details (user_id),
    badge_id UUID REFERENCES badges (badge_id),
    PRIMARY KEY (user_id, badge_id)
);
