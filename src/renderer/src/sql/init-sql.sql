create database if not exists sources_system;
USE sources_system;

CREATE PROCEDURE CreateOrClearTables()
BEGIN
    CREATE TABLE if not exists system_info
    (
        sql_version text NOT NULL
    );

    IF NOT EXISTS (SELECT 1
                   FROM system_info
                   WHERE sql_version = ?)
    THEN

        SET FOREIGN_KEY_CHECKS = 0;

        drop TABLE if exists system_info;
        drop TABLE if exists sources_list;
        drop TABLE if exists user_list;
        drop TABLE if exists cupboard_list;
        drop TABLE if exists apply_list;
        drop TABLE if exists device_list;

        SET FOREIGN_KEY_CHECKS = 1;

        CREATE TABLE if not exists system_info
        (
            sql_version   text        NOT null,
            ip_field      text        not null,
            ip_base       int         not null,
            ip_range      int         not null,
            port          int         not null,
            cupboard_num  int         not null,
            tmp_safe_code varchar(18) not null
        );
        insert into system_info (sql_version, ip_field, ip_base, ip_range, port, cupboard_num, tmp_safe_code)
        values (?, ?, ?, ?, ?, ?, 'GT1PTB14416G');

        create table if not exists sources_list
        (
            SSID            int auto_increment                                        not null
                primary key,
            nuclide         tinytext                                                  not null,
            nuclide_id      int                                                       not null,
            nuclide_name    tinytext                                                  not null,
            nuclide_index   tinyint                                                   null,
            nuclide_quality int                                                       not null,
            nuclide_rate    text                                                      not null,
            nuclide_type    enum ('EC','β','α','tmp')                                                      not null,
            nuclide_energy  json                                                      null,
            SourceStatus    enum ('READY', 'OUT', 'ALARM', 'PROCESS', 'PROCESS-PASS') not null
        );

        create table if not exists user_list
        (
            user      varchar(16)                      not null
                primary key,
            password  varchar(18)                      null,
            authority enum ('root', 'normal', 'guest') not null,
            name      text                             null,
            card      varchar(16)                      null,
            state     enum ('normal','freeze')         not null
        );

        create table if not exists cupboard_list
        (
            cupbox_id varchar(8) not null
                primary key,
            device_id int        not null
                unique
        );

        create table if not exists apply_list
        (
            apply_id     int auto_increment                                 not null
                primary key,
            SSID         int                                                not null,
            user         varchar(16)                                        not null,
            first_time   datetime                                           not null,
            last_time    datetime                                           not null,
            process_time datetime                                           null,
            out_time     datetime                                           null,
            back_time    datetime                                           null,
            reason       text                                               null,
            apply_status enum ('process', 'process-pass', 'process-forbid') not null,
            event_status enum ('wait' , 'out', 'normal' , 'back' , 'not-taken')             null,
            user_status  enum ('overdue', 'normal')                         not null,
            item_status  enum ('end' , 'run')                               not null
        );

        create table if not exists device_list
        (
            device_id int auto_increment not null
                primary key,
            SSID      int                not null,
            wiz_ip    varchar(14)        not null,
            wiz_port  int                not null
        );


        create user 'admin'@'%' identified by 'GT1PTB14416G';
        grant all privileges on *.* to 'admin'@'%';
        flush privileges;
    END IF;
END;
CALL CreateOrClearTables();
DROP PROCEDURE CreateOrClearTables;

CREATE TRIGGER if not exists after_Update_apply_list_change_sources_list_SourcesStatus
    AFTER UPDATE
    ON apply_list
    FOR EACH ROW
BEGIN
    DECLARE new_SourceStatus enum ('READY', 'OUT', 'ALARM', 'PROCESS', 'PROCESS-PASS');

    IF NEW.apply_status != OLD.apply_status THEN
        CASE NEW.apply_status
            WHEN 'process' THEN SET new_SourceStatus = 'PROCESS';
            WHEN 'process-pass' THEN SET new_SourceStatus = 'PROCESS-PASS';
            WHEN 'process-forbid' THEN SET new_SourceStatus = 'READY';
            ELSE SET new_SourceStatus = NULL;
            END CASE;

        IF new_SourceStatus IS NOT NULL AND NEW.item_status != 'end' THEN
            UPDATE sources_list
            SET SourceStatus = new_SourceStatus
            WHERE SSID = NEW.SSID;
        END IF;
    END IF;
END;

SET GLOBAL event_scheduler = ON;
CREATE EVENT if not exists update_apply_list_event_status
ON SCHEDULE EVERY 1 MINUTE
DO
BEGIN
    UPDATE apply_list al, sources_list sl
        SET al.event_status = 'not-taken' , al.item_status = 'end' , sl.SourceStatus = 'READY' WHERE al.last_time < SYSDATE() AND al.apply_status = 'process-pass' AND al.event_status = 'wait' AND al.SSID = sl.SSID;
    UPDATE apply_list
        SET user_status = 'overdue' WHERE last_time < SYSDATE() AND event_status = 'out';
END;
