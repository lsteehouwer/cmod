import { Component, Vue } from "vue-property-decorator";
import WithRender from "./menu.html";

@Component({
    name: "modeller-menu"
})
@WithRender 
class MenuComponent extends Vue {
    isHidden: boolean = true;
}

export { MenuComponent };