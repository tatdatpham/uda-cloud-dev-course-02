"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const util_1 = require("./util/util");
const path = require("path");
const MIME = require("mime-types");
(() => __awaiter(this, void 0, void 0, function* () {
    // Init the Express application
    const app = express_1.default();
    // Set the network port
    const port = process.env.PORT || 8082;
    const authenticate = (req, res, next) => {
        const auth = { username: 'admin', password: 'Th1s1sr4nd0mp@ssw0rd' };
        const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
        const [username, password] = Buffer.from(b64auth, 'base64').toString().split(':');
        // Verify login and password are set and correct
        if (username && password && username === auth.username && password === auth.password) {
            // Access granted...
            return next();
        }
        else {
            res.status(401).send('Authentication required.'); // custom message    
        }
    };
    // Use the body parser middleware for post requests
    // Include auth
    app.use(authenticate);
    app.use(body_parser_1.default.json());
    //CORS Should be restricted
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "http://localhost:8100");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        next();
    });
    // app.use('/api/v0/', IndexRouter)
    // // Root URI call
    // app.get( "/", async ( req, res ) => {
    //   res.send( "/api/v0/" );
    // } );
    // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
    // GET /filteredimage?image_url={{URL}}
    // endpoint to filter an image from a public url.
    // IT SHOULD
    //    1
    //    1. validate the image_url query
    //    2. call filterImageFromURL(image_url) to filter the image
    //    3. send the resulting file in the response
    //    4. deletes any files on the server on finish of the response
    // QUERY PARAMATERS
    //    image_url: URL of a publicly accessible image
    // RETURNS
    //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]
    /**************************************************************************** */
    //! END @TODO1
    // Root Endpoint
    // Root URI call
    app.get("/", (req, res) => {
        res.status(200).send("Welcome to the Cloud!");
    });
    // Displays a simple message to the user
    app.get("/filteredimage", (req, res) => __awaiter(this, void 0, void 0, function* () {
        let { image_url } = req.query;
        //1. validate the image_url query
        if (!util_1.isValidURL(image_url)) {
            return res.status(400)
                .send(`Wrong URL format. The URL should be start with http://`);
        }
        // get image by url
        try {
            util_1.filterImageFromURL(image_url).then(function (result) {
                console.log(`Download image from URL: ${image_url} successful!!!`);
                // set header 
                let filename = path.basename(result);
                let mimetype = MIME.lookup(filename);
                res.setHeader('Content-disposition', 'attachment; filename=' + filename);
                res.setHeader('Content-type', mimetype.toString());
                // Let client download file
                res.download(result);
                res.download(result, function (err) {
                    // delete local file
                    util_1.deleteLocalFiles([result]);
                    console.log(`Delete local file: ${result}`);
                });
            }, function (err) {
                console.log(err);
                return res.status(400)
                    .send(`Error on downloading image from URL: ${image_url}. Please try another image URL`);
            });
        }
        catch (error) {
            return res.status(400)
                .send(`Error on downloading image from URL: ${image_url}`);
        }
        //res.send(isValidURL(image_url))
    }));
    // Start the Server
    app.listen(port, () => {
        console.log(`server running http://localhost:${port}`);
        console.log(`press CTRL+C to stop server`);
    });
}))();
//# sourceMappingURL=server.js.map