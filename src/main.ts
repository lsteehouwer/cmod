import { Modeller } from "./modeller/modeller";
import { Session } from "./services/session";
import { Config } from "./services/config";

class Main {
    public static main() {
        let canvas = document.getElementById("canvas") as HTMLCanvasElement;
        let config = Config.getInstance();
        config.baseUrl = "http://localhost/~lucas/cora-server/api";
        let session = Session.getInstance();
        session.petrinetId = 36;
        session.userId = 20;
        session.sessionId = 1;
        let modeller = new Modeller(canvas);
    }
}

document.addEventListener("DOMContentLoaded", (event) => {
    Main.main();
});
