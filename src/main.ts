import { Modeller } from "./modeller/modeller"
import { Session } from "./modeller/services/session-service";
import { Config } from "./modeller/services/config-service";

class Main {
    public static main() {
        let canvas = document.getElementById("canvas") as HTMLCanvasElement;
        let config = Config.getInstance();
        config.baseUrl = "http://localhost/~lucas/cora-server/api";
        let session = Session.getInstance();
        session.petrinetId = 70;
        session.userId = 53;
        session.sessionId = 0;
        let modeller = new Modeller(canvas);
    }
}

document.addEventListener("DOMContentLoaded", (event) => {
    Main.main();
});
