import { app } from "@azure/functions";
import { controllerRequestCreateBox, controllerRequestGetBox } from "../controllers/boxControllers";

app.http('create-box', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: controllerRequestCreateBox
});

app.http('get-box', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: controllerRequestGetBox
});
