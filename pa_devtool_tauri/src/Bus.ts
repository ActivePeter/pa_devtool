import mitt from 'mitt';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace bus_event_names{
    export const add_new_cmd_2_cur_prj="add_new_cmd_2_cur_prj"
    export const delete_one_cmd_in_cur_prj="delete_one_cmd_in_cur_prj"
    export const change_one_cmd_in_cur_prj="change_one_cmd_in_cur_prj"
}
export default mitt();

