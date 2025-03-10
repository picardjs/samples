const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("answerToLife", 42);
