const App = {
    Data: {},
    Schedule: "barreiro",
    Day: "",

    init() {
        this.getData();
    },
    getData() {
        var app = this;
        firebase.database().ref().on("value", function (snapshot) {
            app.Model = snapshot.val();
        }, function (error) {
            console.log("Error: " + error.code);
        });
    }
}
App.init();

class X {

}