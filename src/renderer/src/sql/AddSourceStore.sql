DELETE FROM sources_list WHERE nuclide_name = 'tmp';
alter table sources_list auto_increment = 1;
INSERT INTO sources_list (nuclide, nuclide_id, nuclide_name, nuclide_index, nuclide_quality, nuclide_rate, nuclide_type, nuclide_energy, SourceStatus) VALUES ('tmp', 0, 'tmp', 0, 0, 'tmp', 'tmp', null, 'OUT');
