import {VueConstructor} from 'vue'
import {
    Row,
    Col,
    Form,
    Input,
    Button,
    Dialog,
    Upload,
    Option,
    Select,
    Progress,
    FormItem,
    Pagination,
    PageHeader,
    ButtonGroup,
} from "element-ui";

export const ElementUI = {
    install(Vue: VueConstructor) {
        Vue.component(Row.name, Row);
        Vue.component(Col.name, Col);

        Vue.component(Form.name, Form);
        Vue.component(Input.name, Input);
        Vue.component(Upload.name, Upload);
        Vue.component(FormItem.name, FormItem);

        Vue.component(Button.name, Button);
        Vue.component(Select.name, Select);
        Vue.component(Option.name, Option);
        Vue.component(Dialog.name, Dialog);
        Vue.component(Progress.name, Progress);
        Vue.component(Pagination.name, Pagination);
        Vue.component(PageHeader.name, PageHeader);
        Vue.component(ButtonGroup.name, ButtonGroup);
    }
}