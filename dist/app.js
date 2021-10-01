"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("config"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./middleware/auth"));
const db_1 = __importDefault(require("./main/db"));
const user_1 = __importDefault(require("./routes/user/user"));
const auth_2 = __importDefault(require("./routes/user/auth"));
const ad_click_1 = __importDefault(require("./routes/ad-click"));
const ad_impression_1 = __importDefault(require("./routes/ad-impression"));
const news_1 = __importDefault(require("./routes/news"));
const app = express_1.default();
app.use(cors_1.default());
app.use(express_1.default.json());
app.use('/api/users', user_1.default);
app.use('/api/auth', auth_2.default);
app.use('/api/ad-click', ad_click_1.default);
app.use('/api/ad-impression', ad_impression_1.default);
app.use('/api/news', news_1.default);
app.use(auth_1.default);
db_1.default((db, err) => {
    if (!err) {
        const PORT = process.env.PORT || config_1.default.get('port');
        app.listen(PORT, () => {
            console.log('Connected to DB');
            console.log('Listening on port', PORT);
        });
    }
    else {
        console.log('Error in connecting to DB: ' + err);
    }
});
