import initAdmin from "./init.js";
const { admin } = initAdmin;
const { applyMiddleware, safeFetch } = common;

const db = admin.firestore();

class FbPost {
    constructor (created_time, likes) {
        this.created_time = created_time;
        this.likes = likes;
    }
    
    toString() {
        return this.created_time + ', ' + this.likes;
    }
}

const getFacebookPosts = functions.https.onRequest(async (req, res) => {
    applyMiddleware(req, res);

    // maybe use this instead var startfulldate = admin.firestore.Timestamp.fromDate(new Date(1556062581000));
    // new Date format ('2017-01-01')
    const start = new Date(req.query.start);
    const end = new Date(req.query.end);
    const userID = req.query.userID;
    var fbRef = db.collection("users/" + userID + "/facebook");

    const fbPosts = [];
    var query = fbRef.where("create_time", ">=", start)
                    .where("create_time", "<=", end);
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            console.log(doc.id, doc.data());
                            fbPosts.push(new FbPost(data.created_time, data.likes));
                        });
                        return fbPosts;
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                    });

});

export default { getFacebookPosts };