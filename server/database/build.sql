
create database timeline;

use timeline;

create table users(
id 					serial, -- autoincrementing, 4 byte, unsigned integer
email 				varchar(255),
password_digest 	varchar(255),
user_type			varchar(64),
created_date		timestamp,
updated_date		timestamp	
);

create table timelines(
id					serial,
name				varchar(255),
created_date		timestamp,
updated_date		timestamp
);

create table timeline_items(
id					serial,
timeline_id			varchar(255),
content				json,
title				varchar(255),
image_url			varchar(255),
user_id				integer,
status				varchar(32),
created_date		timestamp,
updated_date		timestamp
);

create table timeline_item_logs(
id					serial,
timeline_item_id	integer, -- foreign key? Integer is 4 byte
old_content			json,
new_content			json,
old_title			varchar(255),
new_title			varchar(255),
old_user_id			integer,
new_user_id			integer,
old_status			varchar(32),
new_status			varchar(32),
created_date		timestamp,
updated_date		timestamp
);

create table tracking_actions(
id					serial,
user_id				integer,
resource_type		varchar(255),
resource_id			integer,
created_date		timestamp
);

create table tags(
id					serial,
name				varchar(255)
);

create table tag_items(
id					serial,
tag_id				integer,
timeline_item_id	integer
);

