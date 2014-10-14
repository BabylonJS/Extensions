/// <autosync enabled="true" />


var setup = new BABYLON.LeaderBoard.Setup("https://lightspeedbackend.azure-mobile.net/",
                "WnMUrftvAIDmVqezHWCiWUJFvvvtfG79", "DBnAvXPApyeHGryooSfiZrpcEgyVKa37");

setup.createGame(
    { name: "LightSpeed" },
    { name: "Mimetis", email: "sebastien.pertus@gmail.com" },
    function (r) { console.log(r); },
    function (error) { console.error(error); }
);