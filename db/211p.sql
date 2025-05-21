use market_db;
prepare myQuery from 'select * from member where mem_id = "BLK"';
execute myQuery;
deallocate prepare myQuery;

drop table if exists gate_table;
create table gate_table(id int auto_increment primary key, entry_time datetime);

set @curDate = current_timestamp();
prepare myQuery from 'INSERT INTO gate_table VALUES(NULL, ?)';
execute myQuery using @curDate;
deallocate prepare myQuery;

select * from gate_table;